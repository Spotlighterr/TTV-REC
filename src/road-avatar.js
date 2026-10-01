import * as THREE from 'three';

const material = (color, roughness = 0.85, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const jacket = material(0x244f83, 0.72);
const jacketLight = material(0x396b9d, 0.75);
const cloth = material(0x202c3e, 0.98);
const shoes = material(0x393f46, 0.86);
const skin = material(0xd7a582, 0.86);
const hair = material(0x242025, 0.94);
const bag = material(0xb2473b, 0.77);
const bagTrim = material(0x7c2e2b, 0.82);

function add(parent, geometry, surface, x, y, z) {
  const part = new THREE.Mesh(geometry, surface);
  part.position.set(x, y, z);
  part.castShadow = true;
  part.receiveShadow = true;
  parent.add(part);
  return part;
}

export function makeRoadAvatar() {
  const root = new THREE.Group();
  root.name = 'REC explorer';
  const rig = new THREE.Group();
  root.add(rig);
  add(rig, new THREE.CapsuleGeometry(0.22, 0.37, 5, 10), jacket, 0, 1.02, 0);
  add(rig, new THREE.BoxGeometry(0.4, 0.05, 0.24), jacketLight, 0, 1.16, -0.085);
  add(rig, new THREE.CylinderGeometry(0.11, 0.13, 0.13, 12), skin, 0, 1.36, -0.01);
  add(rig, new THREE.SphereGeometry(0.18, 16, 12), skin, 0, 1.56, -0.015);
  add(rig, new THREE.SphereGeometry(0.183, 16, 10, 0, Math.PI * 2, 0, 1.32), hair, 0, 1.6, 0.025);
  add(rig, new THREE.BoxGeometry(0.12, 0.03, 0.11), hair, 0, 1.62, -0.162);
  add(rig, new THREE.BoxGeometry(0.32, 0.45, 0.16), bag, 0, 1.02, 0.23);
  add(rig, new THREE.BoxGeometry(0.25, 0.12, 0.04), bagTrim, 0, 0.91, 0.329);
  for (const side of [-1, 1]) {
    add(rig, new THREE.BoxGeometry(0.045, 0.52, 0.05), bagTrim, side * 0.14, 1.04, 0.13);
  }
  const limbs = { arms: [], legs: [] };
  for (const side of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(side * 0.28, 1.22, 0);
    rig.add(arm);
    add(arm, new THREE.CapsuleGeometry(0.072, 0.32, 4, 8), jacket, 0, -0.22, 0);
    add(arm, new THREE.SphereGeometry(0.07, 8, 7), skin, 0, -0.46, 0);
    limbs.arms.push(arm);
    const leg = new THREE.Group();
    leg.position.set(side * 0.12, 0.72, 0);
    rig.add(leg);
    add(leg, new THREE.CapsuleGeometry(0.095, 0.45, 4, 8), cloth, 0, -0.31, 0);
    add(leg, new THREE.BoxGeometry(0.18, 0.12, 0.3), shoes, 0, -0.63, -0.07);
    limbs.legs.push(leg);
  }
  const shadow = add(root, new THREE.CircleGeometry(0.42, 24), new THREE.MeshBasicMaterial({ color: 0x1c2831, transparent: true, opacity: 0.17, depthWrite: false }), 0, 0.018, 0);
  shadow.rotation.x = -Math.PI / 2;
  shadow.castShadow = false;
  root.visible = false;
  return {
    root,
    update(time, speed, delta) {
      const stride = time * 9;
      const amount = Math.min(1, Math.abs(speed) / 0.09);
      limbs.legs.forEach((leg, index) => { leg.rotation.x = Math.sin(stride + index * Math.PI) * 0.52 * amount; });
      limbs.arms.forEach((arm, index) => { arm.rotation.x = -Math.sin(stride + index * Math.PI) * 0.4 * amount; });
      rig.rotation.z = THREE.MathUtils.lerp(rig.rotation.z, -delta * 0.045, 0.08);
      rig.position.y = Math.abs(Math.sin(stride)) * 0.025 * amount;
    },
  };
}
