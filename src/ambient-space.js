import * as THREE from 'three';

export function createAmbientSpace(glowMap) {
  const group = new THREE.Group();
  // Prepaint the distant nebula once; the render loop only moves one textured plane.
  const canvas = document.createElement('canvas'); canvas.width = 1536; canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  let seed = 1829;
  const random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 48; i++) {
    const x = 350 + i * 20 + (random() - .5) * 180;
    const y = 540 - Math.sin(i / 48 * Math.PI) * 250 + (random() - .5) * 220;
    const r = 90 + random() * 190;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, i < 18 ? 'rgba(25,120,153,.19)' : i < 32 ? 'rgba(113,49,142,.15)' : 'rgba(180,68,37,.14)');
    gradient.addColorStop(.45, i < 24 ? 'rgba(17,67,114,.07)' : 'rgba(104,34,87,.045)'); gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient; ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
  const mist = new THREE.Mesh(new THREE.PlaneGeometry(58, 38), new THREE.MeshBasicMaterial({ map, transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending }));
  mist.position.set(5, 4, -28); group.add(mist);
  const count = 420, positions = new Float32Array(count * 3), colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = random() * Math.PI * 2, radius = 4.5 + random() * 9;
    positions.set([Math.cos(a) * radius + 2, Math.sin(a) * radius * .6, -3 - random() * 15], i * 3);
    const warm = i % 7 === 0;
    colors.set(warm ? [1, .34, .12] : [.18, .65, .95], i * 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const dust = new THREE.Points(geometry, new THREE.PointsMaterial({ map: glowMap, vertexColors: true, transparent: true, depthWrite: false, size: .13, opacity: .55, blending: THREE.AdditiveBlending })); group.add(dust);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(4.5, .018, 5, 160, Math.PI * 1.4), new THREE.MeshBasicMaterial({ color: 0x739fc6, transparent: true, opacity: .2, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.position.set(3, 0, -3); halo.rotation.set(.85, .35, -.25); group.add(halo);
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: 0xff824c, transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending }));
  sun.position.set(10, 5, -12); sun.scale.set(15, 15, 1); group.add(sun);
  const blue = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: 0x1876da, transparent: true, opacity: .45, depthWrite: false, blending: THREE.AdditiveBlending }));
  blue.position.set(-4, -3, -13); blue.scale.set(18, 12, 1); group.add(blue);
  return { group, update(time, progress) {
    mist.rotation.z = -.16 + Math.sin(time * .025) * .035;
    dust.rotation.z = time * .006; dust.position.y = Math.sin(time * .08) * .2;
    halo.rotation.z = -.25 + time * .012; halo.material.opacity = .12 + Math.max(0, 1 - Math.abs(progress - 3)) * .14;
    sun.position.x = 10 - progress * 1.1;
  } };
}
