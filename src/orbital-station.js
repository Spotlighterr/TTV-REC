import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function createPanelFinish() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#999'; ctx.fillRect(0, 0, 256, 256);
  let seed = 141;
  for (let i = 0; i < 2000; i++) {
    seed = (seed * 16807) % 2147483647;
    const x = seed % 256, y = Math.floor(seed / 256) % 256;
    ctx.fillStyle = i % 3 ? '#888' : '#aaa'; ctx.fillRect(x, y, 1 + i % 13, 1);
  }
  ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
  ctx.strokeRect(4, 4, 248, 248); ctx.strokeRect(12, 12, 232, 232);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createOrbitalStation(glowMap) {
  const group = new THREE.Group(), rotor = new THREE.Group(); group.add(rotor);
  group.rotation.set(.95, .32, -.34);
  const finish = createPanelFinish();
  const materials = {
    titanium: new THREE.MeshStandardMaterial({ color: 0x6b7588, metalness: .86, roughness: .32, bumpMap: finish, bumpScale: .022 }),
    carbon: new THREE.MeshStandardMaterial({ color: 0x101827, metalness: .52, roughness: .43, bumpMap: finish, bumpScale: .018 }),
    ivory: new THREE.MeshStandardMaterial({ color: 0x9fadaf, metalness: .68, roughness: .31 }),
    copper: new THREE.MeshStandardMaterial({ color: 0xd76532, metalness: .72, roughness: .31 }),
    cyan: new THREE.MeshBasicMaterial({ color: new THREE.Color(0.1, 2.2, 2.8) }),
    amber: new THREE.MeshBasicMaterial({ color: new THREE.Color(3.5, .43, .09) }),
  };
  const bins = Object.fromEntries(Object.keys(materials).map(key => [key, []]));
  const q = new THREE.Quaternion(), matrix = new THREE.Matrix4();
  function add(key, geometry, x = 0, y = 0, z = 0, rz = 0, rx = 0) {
    q.setFromEuler(new THREE.Euler(rx, 0, rz));
    matrix.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1));
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    g.applyMatrix4(matrix); bins[key].push(g); if (g !== geometry) geometry.dispose();
  }
  const box = (key, w, h, d, x, y, z, rz = 0) => add(key, new THREE.BoxGeometry(w, h, d), x, y, z, rz);
  const torus = (key, r, tube, z = 0) => add(key, new THREE.TorusGeometry(r, tube, 8, 192), 0, 0, z);
  torus('carbon', 4.12, .18); torus('titanium', 3.96, .035, .12); torus('titanium', 4.29, .04, -.1);
  torus('cyan', 3.93, .015, .08); torus('copper', 4.34, .026, -.04);
  const jets = [];
  for (let i = 0; i < 80; i++) {
    const a = i / 80 * Math.PI * 2, c = Math.cos(a), s = Math.sin(a), rz = a - Math.PI / 2;
    add(i % 10 === 0 ? 'copper' : i % 3 === 0 ? 'ivory' : 'titanium', new RoundedBoxGeometry(.295, .32, .16, 1, .024), c * 4.13, s * 4.13, .15, rz);
    box('carbon', .19, .21, .018, c * 4.13, s * 4.13, .242, rz);
    for (let k = 0; k < 3; k++) {
      const da = a + (k - 1) * .011;
      box('titanium', .016, .17, .023, Math.cos(da) * 4.13, Math.sin(da) * 4.13, .259, rz);
    }
    box(i % 5 ? 'cyan' : 'amber', .08, .022, .02, c * 3.97, s * 3.97, .18, rz);
    if (i % 10 === 0) {
      add('carbon', new RoundedBoxGeometry(.46, .72, .46, 2, .055), c * 4.54, s * 4.54, 0, rz);
      box('ivory', .36, .48, .026, c * 4.54, s * 4.54, .244, rz);
      box('copper', .075, .48, .03, c * 4.54, s * 4.54, .268, rz);
      add('titanium', new THREE.CylinderGeometry(.14, .18, .25, 20), c * 4.89, s * 4.89, 0, rz);
      const flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: i % 20 ? 0x3df4ff : 0xff8047, transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending }));
      flame.position.set(c * 5.04, s * 5.04, 0); flame.scale.set(.65, .65, 1); rotor.add(flame); jets.push(flame);
    }
  }
  // Service gantries: frames, small radiators, handrails and layered docking housings.
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + .38, c = Math.cos(a), s = Math.sin(a), rz = a - Math.PI / 2;
    box('titanium', .11, 1.15, .11, c * 4.82, s * 4.82, -.12, rz);
    for (let j = 0; j < 7; j++) {
      const r = 4.37 + j * .145;
      box('ivory', .35, .025, .06, c * r, s * r, -.12, rz);
    }
    add('carbon', new RoundedBoxGeometry(.82, .42, .28, 2, .035), c * 5.5, s * 5.5, -.12, rz);
    box('copper', .73, .08, .3, c * 5.5, s * 5.5, -.12, rz);
    box('cyan', .52, .014, .018, c * 5.51, s * 5.51, .031, rz);
  }
  Object.entries(bins).forEach(([key, parts]) => {
    const geometry = mergeGeometries(parts, false); parts.forEach(part => part.dispose());
    const mesh = new THREE.Mesh(geometry, materials[key]); rotor.add(mesh);
  });
  return { group, update(time, speed) {
    rotor.rotation.z = time * .027;
    jets.forEach((jet, i) => { const intensity = .8 + Math.sin(time * 2 + i) * .1 + Math.min(.8, speed * 8); jet.scale.setScalar(intensity); });
  } };
}

export function createFlightEffects(glowMap, mobile) {
  const group = new THREE.Group();
  const palette = [0x5ae7ff, 0xff7545, 0xd193ff];
  const streams = [];
  for (let i = 0; i < 3; i++) {
    const curve = new THREE.CatmullRomCurve3(Array.from({ length: 9 }, (_, j) => {
      const a = j / 8 * Math.PI * 1.65 + i * .52;
      return new THREE.Vector3(3 + Math.cos(a) * (5 + i * .48), Math.sin(a) * (3 + i * .4), -3 + Math.sin(a * 1.4) * 3);
    }));
    const geometry = new THREE.TubeGeometry(curve, mobile ? 96 : 180, .017 + i * .006, 4, false);
    const material = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, color: { value: new THREE.Color(palette[i]) }, strength: { value: 1 }, offset: { value: i * .3 } },
      vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec2 vUv;uniform float time;uniform float offset;uniform float strength;uniform vec3 color;void main(){float run=fract(vUv.x-time*.065+offset);float trail=pow(1.-run,7.);float edge=sin(vUv.y*3.14159);gl_FragColor=vec4(color*2.,(.13+trail*.85)*edge*strength);}',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const stream = new THREE.Mesh(geometry, material); group.add(stream); streams.push(stream);
  }
  const geometry = new THREE.IcosahedronGeometry(1, 1), vertices = geometry.attributes.position;
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i), y = vertices.getY(i), z = vertices.getZ(i);
    const displacement = 1 + .2 * Math.sin(x * 12 + y * 17) * Math.cos(z * 9);
    vertices.setXYZ(i, x * displacement, y * displacement * .8, z * displacement);
  }
  geometry.computeVertexNormals();
  const rocks = new THREE.InstancedMesh(geometry, new THREE.MeshStandardMaterial({ color: 0x39313b, roughness: .93, metalness: .12, flatShading: true }), mobile ? 35 : 70);
  const transform = new THREE.Object3D();
  for (let i = 0; i < rocks.count; i++) {
    const a = i * 2.399963, r = 8 + (i % 11) * .47;
    transform.position.set(3 + Math.cos(a) * r, Math.sin(a) * r * .56, -9 - i % 13);
    transform.rotation.set(i * .7, i * .2, i); transform.scale.setScalar(.06 + (i % 6) * .035); transform.updateMatrix(); rocks.setMatrixAt(i, transform.matrix);
  }
  group.add(rocks);
  const shockwave = new THREE.Mesh(new THREE.RingGeometry(.95, 1, 128), new THREE.MeshBasicMaterial({ color: 0x74eaff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
  shockwave.position.set(3, 0, -1); group.add(shockwave);
  let shock = 1;
  return { group, pulse() { shock = 0; }, update(time, dt, progress, speed, paused) {
    streams.forEach(stream => { stream.material.uniforms.time.value = time; stream.material.uniforms.strength.value = .65 + Math.min(.7, speed * 8); });
    rocks.rotation.y = time * .007;
    if (!paused) shock = Math.min(1, shock + dt * .7);
    shockwave.scale.setScalar(1 + shock * 9); shockwave.material.opacity = paused ? 0 : Math.sin(shock * Math.PI) * .4;
    group.position.y = Math.sin(progress * Math.PI / 4) * .3;
  } };
}
