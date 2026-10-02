const fs = require('fs');
const zlib = require('zlib');

function unpackBits(src, uncompressedLength) {
  const dest = Buffer.alloc(uncompressedLength);
  let srcPos = 0;
  let destPos = 0;
  while (destPos < uncompressedLength && srcPos < src.length) {
    const n = src.readInt8(srcPos++);
    if (n >= 0 && n <= 127) {
      const count = n + 1;
      src.copy(dest, destPos, srcPos, srcPos + count);
      srcPos += count;
      destPos += count;
    } else if (n >= -127 && n <= -1) {
      const count = 1 - n;
      const val = src[srcPos++];
      dest.fill(val, destPos, destPos + count);
      destPos += count;
    }
  }
  return dest;
}

const fd = fs.openSync('D:/kNowHow/TTV-REC/REC16 _ TTV _ BTT _ BND/bnd ttv gen16.psd', 'r');
let offset = 26;
function readUint32() {
  const b = Buffer.alloc(4);
  fs.readSync(fd, b, 0, 4, offset);
  offset += 4;
  return b.readUInt32BE(0);
}
offset += 4 + readUint32(); // Color mode
offset += 4 + readUint32(); // Image resources
offset += 4 + readUint32(); // Layer & mask

const compBuf = Buffer.alloc(2);
fs.readSync(fd, compBuf, 0, 2, offset);
offset += 2;

const psdWidth = 5546;
const psdHeight = 1494;
const channels = 4;

const scanlineCountsBuf = Buffer.alloc(psdHeight * channels * 2);
fs.readSync(fd, scanlineCountsBuf, 0, psdHeight * channels * 2, offset);
offset += psdHeight * channels * 2;

const scanlineCounts = [];
for (let i = 0; i < psdHeight * channels; i++) {
  scanlineCounts.push(scanlineCountsBuf.readUInt16BE(i * 2));
}

const channelData = [
  Buffer.alloc(psdWidth * psdHeight),
  Buffer.alloc(psdWidth * psdHeight),
  Buffer.alloc(psdWidth * psdHeight),
  Buffer.alloc(psdWidth * psdHeight)
];

for (let c = 0; c < channels; c++) {
  let cPos = 0;
  for (let y = 0; y < psdHeight; y++) {
    const count = scanlineCounts[c * psdHeight + y];
    const srcBuf = Buffer.alloc(count);
    fs.readSync(fd, srcBuf, 0, count, offset);
    offset += count;
    const line = unpackBits(srcBuf, psdWidth);
    line.copy(channelData[c], cPos);
    cPos += psdWidth;
  }
}
fs.closeSync(fd);

// Helper to save sub-rectangle as PNG
function saveSubRect(x0, y0, w, h, outputPath) {
  const rawPngData = Buffer.alloc(h * (1 + w * 4));
  let rawPos = 0;
  for (let y = 0; y < h; y++) {
    rawPngData[rawPos++] = 0; // Filter None
    const srcRowStart = (y0 + y) * psdWidth;
    for (let x = 0; x < w; x++) {
      const srcPx = srcRowStart + (x0 + x);
      rawPngData[rawPos++] = channelData[0][srcPx]; // R
      rawPngData[rawPos++] = channelData[1][srcPx]; // G
      rawPngData[rawPos++] = channelData[2][srcPx]; // B
      rawPngData[rawPos++] = channelData[3][srcPx]; // A
    }
  }

  const compressed = zlib.deflateSync(rawPngData, { level: 9 });

  const crc32 = (function() {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      table[i] = c;
    }
    return function(buf) {
      let c = 0xFFFFFFFF;
      for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
      return (c ^ 0xFFFFFFFF) >>> 0;
    };
  })();

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcData = Buffer.concat([typeBuf, data]);
    const crcVal = Buffer.alloc(4);
    crcVal.writeUInt32BE(crc32(crcData), 0);
    return Buffer.concat([len, typeBuf, data, crcVal]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const pngBuffer = Buffer.concat([
    pngSignature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);

  fs.writeFileSync(outputPath, pngBuffer);
  console.log('Saved', outputPath, 'Dimensions:', w, 'x', h, 'Size:', pngBuffer.length);
}

// 1. Export Artboard 1: 0, 0, 3925, 1453
saveSubRect(0, 0, 3925, 1453, 'D:/kNowHow/TTV-REC/assets/images/gen16-bnd/bnd-ttv-cover.png');
// Also save to BND TTV.png in REC16 _ TTV _ BTT _ BND
saveSubRect(0, 0, 3925, 1453, 'D:/kNowHow/TTV-REC/REC16 _ TTV _ BTT _ BND/BND TTV.png');

console.log('DONE!');
