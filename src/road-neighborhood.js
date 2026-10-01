import * as THREE from 'three';
import { ROAD_STATIONS } from './road-game-data';

const palette = [0xc5ac98, 0x9db4c2, 0xd6b7a8, 0xaab8a7, 0xbcb3a6];
const navy = new THREE.MeshStandardMaterial({ color: 0x163b70, metalness: 0.15, roughness: 0.55 });
const roof = new THREE.MeshStandardMaterial({ color: 0x495a69, metalness: 0.1, roughness: 0.85 });
const stone = new THREE.MeshStandardMaterial({ color: 0x929a98, roughness: 0.94 });
const paving = new THREE.MeshStandardMaterial({ color: 0xbbb8ad, roughness: 0.92 });
const glass = new THREE.MeshPhysicalMaterial({ color: 0x7897a4, roughness: 0.2, metalness: 0.2, transparent: true, opacity: 0.78, clearcoat: 0.45 });
const warmGlass = new THREE.MeshStandardMaterial({ color: 0xffdeb0, emissive: 0x9b5f2c, emissiveIntensity: 0.22, roughness: 0.35 });
const dark = new THREE.MeshStandardMaterial({ color: 0x263744, roughness: 0.76 });
const brass = new THREE.MeshStandardMaterial({ color: 0xb98d50, metalness: 0.66, roughness: 0.42 });
const red = new THREE.MeshStandardMaterial({ color: 0xc94838, roughness: 0.68 });
let plasterMaps;

function getPlasterMaps() {
  if (plasterMaps) return plasterMaps;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#e9e6df';
  ctx.fillRect(0, 0, 256, 256);
  let seed = 17823;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 9500; i++) {
    const shade = 155 + Math.floor(random() * 95);
    ctx.fillStyle = `rgba(${shade},${shade},${shade},${0.03 + random() * 0.1})`;
    ctx.fillRect(random() * 256, random() * 256, 0.5 + random() * 2, 0.5 + random() * 2);
  }
  ctx.strokeStyle = 'rgba(74,77,70,.07)';
  ctx.lineWidth = 1;
  for (let y = 16; y < 256; y += 30) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
    for (let x = y % 60 ? 0 : 22; x < 256; x += 66) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 30); ctx.stroke();
    }
  }
  const color = new THREE.CanvasTexture(canvas);
  color.colorSpace = THREE.SRGBColorSpace;
  color.wrapS = color.wrapT = THREE.RepeatWrapping;
  color.anisotropy = 8;
  const bump = color.clone();
  bump.colorSpace = THREE.NoColorSpace;
  bump.needsUpdate = true;
  plasterMaps = { color, bump };
  return plasterMaps;
}

function mesh(parent, geometry, material, position, cast = true) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...position);
  object.castShadow = cast;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

function signTexture(label, number) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#143d73';
  ctx.fillRect(0, 0, 512, 160);
  ctx.fillStyle = '#cf3c34';
  ctx.fillRect(0, 147, 512, 13);
  ctx.fillStyle = '#a9c4dd';
  ctx.font = '600 19px Arial';
  ctx.fillText(`REC FTU  /  CHẶNG 0${number}`, 28, 38);
  ctx.fillStyle = '#fff';
  ctx.font = '700 67px Arial';
  ctx.fillText(label, 27, 112, 475);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeHouse(parent, side, color, variation, sign) {
  const width = 1.62 + (variation % 3) * 0.18;
  const depth = 2.15;
  const height = 2.6 + (variation % 4) * 0.24;
  const maps = getPlasterMaps();
  const plaster = new THREE.MeshStandardMaterial({ color, map: maps.color, bumpMap: maps.bump, bumpScale: 0.025, roughness: 0.91 });
  const trim = new THREE.MeshStandardMaterial({ color: variation % 2 ? 0xded8ca : 0xc1cad1, roughness: 0.85 });
  const body = mesh(parent, new THREE.BoxGeometry(width, height, depth), plaster, [0, height / 2 + 0.11, 0]);
  body.receiveShadow = true;
  mesh(parent, new THREE.BoxGeometry(width + 0.14, 0.19, depth + 0.13), roof, [0, height + 0.2, 0]);
  mesh(parent, new THREE.BoxGeometry(width + 0.19, 0.09, depth + 0.18), trim, [0, height + 0.32, 0]);
  mesh(parent, new THREE.BoxGeometry(width + 0.04, 0.09, depth + 0.05), trim, [0, 0.2, 0]);
  // A shared pavement meets every doorway; the frontage always faces the road.
  const frontageX = -side * (width / 2 + 0.012);
  const face = new THREE.Group();
  face.position.x = frontageX;
  face.rotation.y = -side * Math.PI / 2;
  parent.add(face);
  const windowZ = [-0.59, 0.59];
  for (const floor of [1.23, 2.19]) {
    for (const z of windowZ) {
      mesh(face, new THREE.BoxGeometry(0.48, 0.67, 0.075), trim, [z, floor, 0.015]);
      mesh(face, new THREE.PlaneGeometry(0.39, 0.56), (variation + Math.round(z * 3) + floor) % 3 < 1 ? warmGlass : glass, [z, floor, 0.057], false);
      mesh(face, new THREE.BoxGeometry(0.045, 0.62, 0.085), trim, [z, floor, 0.075]);
      mesh(face, new THREE.BoxGeometry(0.52, 0.065, 0.18), stone, [z, floor - 0.36, 0.09]);
    }
  }
  if (variation % 2 === 0) {
    mesh(face, new THREE.BoxGeometry(1.53, 0.07, 0.35), stone, [0, 1.79, 0.22]);
    for (const z of [-0.68, -0.34, 0, 0.34, 0.68]) mesh(face, new THREE.BoxGeometry(0.025, 0.33, 0.025), dark, [z, 1.98, 0.38]);
    mesh(face, new THREE.BoxGeometry(1.42, 0.025, 0.025), dark, [0, 2.15, 0.38]);
  }
  mesh(face, new THREE.BoxGeometry(0.52, 0.88, 0.07), navy, [0, 0.58, 0.05]);
  mesh(face, new THREE.SphereGeometry(0.035, 8, 8), brass, [0.16, 0.57, 0.105]);
  mesh(face, new THREE.BoxGeometry(1.55, 0.09, 0.5), variation % 3 === 0 ? red : navy, [0, 1.04, 0.31]);
  mesh(face, new THREE.BoxGeometry(1.55, 0.07, 0.5), brass, [0, 1.0, 0.34]);
  if (sign) {
    const plate = mesh(face, new THREE.PlaneGeometry(1.45, 0.45), new THREE.MeshBasicMaterial({ map: signTexture(sign.label, sign.number), side: THREE.DoubleSide, toneMapped: false }), [0, height - 0.29, 0.063], false);
    plate.renderOrder = 1;
  } else {
    mesh(face, new THREE.BoxGeometry(1.27, 0.12, 0.09), variation % 2 ? navy : red, [0, height - 0.24, 0.065]);
  }
  // Rainwater pipes, roof vents and planters give each frontage a lived-in scale.
  mesh(face, new THREE.CylinderGeometry(0.025, 0.025, height, 8), dark, [-width / 2 + 0.09, height / 2 + 0.12, 0.07]);
  for (const z of [-0.7, 0.7]) {
    mesh(face, new THREE.BoxGeometry(0.27, 0.19, 0.23), stone, [z, 0.22, 0.22]);
    mesh(face, new THREE.ConeGeometry(0.17, 0.36, 7), new THREE.MeshStandardMaterial({ color: 0x56765a, roughness: 1 }), [z, 0.48, 0.22]);
  }
  mesh(parent, new THREE.CylinderGeometry(0.13, 0.13, 0.16, 10), roof, [0, height + 0.35, 0.52]);
}

export function addRoadNeighborhood(scene, roadPath, roadHalfWidth, roadsideAt, mobile = false) {
  const root = new THREE.Group();
  root.name = 'REC roadside neighborhoods';
  scene.add(root);
  const forward = new THREE.Vector3(0, 0, -1);
  ROAD_STATIONS.forEach((station, chapter) => {
    for (const side of [-1, 1]) {
      for (let building = 0; building < 2; building++) {
        if (mobile && building === 1) continue;
        const t = station.t + (building ? 0.023 : -0.023);
        const area = new THREE.Group();
        area.position.copy(roadsideAt(t, side, roadHalfWidth(t) + 4.8));
        area.position.y -= 0.13;
        area.quaternion.setFromUnitVectors(forward, roadPath.getTangentAt(t).setY(0).normalize());
        root.add(area);
        mesh(area, new THREE.BoxGeometry(4.4, 0.22, 3.0), stone, [0, -0.26, 0]);
        mesh(area, new THREE.BoxGeometry(4.32, 0.05, 2.92), paving, [0, -0.13, 0]);
        for (let stripe = -1; stripe <= 1; stripe++) {
          mesh(area, new THREE.BoxGeometry(4.18, 0.004, 0.012), stone, [0, -0.099, stripe * 0.92], false);
        }
        const house = new THREE.Group();
        house.position.set(side * 0.9, -0.21, 0);
        area.add(house);
        makeHouse(house, side, palette[(chapter + building * 2 + (side > 0 ? 1 : 0)) % palette.length], chapter * 3 + building + (side > 0 ? 1 : 0), building === 0 && side === 1 ? { label: station.sign, number: chapter + 1 } : null);
        const curb = mesh(area, new THREE.BoxGeometry(0.13, 0.11, 3.0), stone, [-side * 2.12, -0.04, 0]);
        curb.receiveShadow = true;
        // Street furniture follows the same material system at every stop.
        if (building === 1 || mobile) {
          mesh(area, new THREE.CylinderGeometry(0.035, 0.048, 1.55, 10), dark, [-side * 1.45, 0.69, -1.02]);
          mesh(area, new THREE.BoxGeometry(0.39, 0.13, 0.3), navy, [-side * 1.45, 1.49, -1.02]);
          mesh(area, new THREE.BoxGeometry(0.29, 0.035, 0.19), warmGlass, [-side * 1.45, 1.4, -1.02], false);
          mesh(area, new THREE.BoxGeometry(0.58, 0.055, 0.23), dark, [-side * 1.2, 0.29, 0.91]);
          for (const x of [-side * 1.42, -side * 0.98]) mesh(area, new THREE.BoxGeometry(0.045, 0.28, 0.045), dark, [x, 0.14, 0.91]);
        }
      }
    }
  });
  return root;
}
