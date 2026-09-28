import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createPanelFinish } from './orbital-station';

// Build hundreds of small architectural details once, then merge by surface material.
// Each finished miniature uses six draw calls, regardless of its number of parts.
export function createDepartmentModel(index, accent) {
  const group = new THREE.Group();
  const finish = createPanelFinish();
  const materials = {
    shell: new THREE.MeshStandardMaterial({ color: 0x667784, metalness: .8, roughness: .3, bumpMap: finish, bumpScale: .008 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x111721, metalness: .35, roughness: .43, bumpMap: finish, bumpScale: .012 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x154b67, metalness: .55, roughness: .13, clearcoat: 1, clearcoatRoughness: .12 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xc4a773, metalness: .75, roughness: .3 }),
    light: new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: .65, metalness: .3, roughness: .23 }),
    white: new THREE.MeshStandardMaterial({ color: 0x9eaebc, metalness: .45, roughness: .36, side: THREE.DoubleSide }),
  };
  const pieces = Object.fromEntries(Object.keys(materials).map(key => [key, []]));
  const matrix = new THREE.Matrix4(), quaternion = new THREE.Quaternion();
  function add(type, geometry, position = [0, 0, 0], rotation = [0, 0, 0]) {
    quaternion.setFromEuler(new THREE.Euler(...rotation));
    matrix.compose(new THREE.Vector3(...position), quaternion, new THREE.Vector3(1, 1, 1));
    const part = geometry.index ? geometry.toNonIndexed() : geometry;
    part.applyMatrix4(matrix); pieces[type].push(part);
    if (part !== geometry) geometry.dispose();
  }
  const box = (type, size, pos, rot) => add(type, new THREE.BoxGeometry(...size), pos, rot);
  const rounded = (type, size, pos, radius = .05) => add(type, new RoundedBoxGeometry(...size, 2, radius), pos);
  const cylinder = (type, top, bottom, height, pos, rot, segments = 32) => add(type, new THREE.CylinderGeometry(top, bottom, height, segments), pos, rot);
  const ring = (type, radius, thickness, pos, rot) => add(type, new THREE.TorusGeometry(radius, thickness, 6, 48), pos, rot);
  const bar = (type, start, end, radius = .015) => {
    const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end), delta = b.clone().sub(a);
    const geometry = new THREE.CylinderGeometry(radius, radius, delta.length(), 6);
    geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()));
    add(type, geometry, a.add(b).multiplyScalar(.5).toArray());
  };
  // Machined exhibition base: stacked edge, radial engravings and a luminous inset.
  cylinder('dark', 1.07, 1.02, .14, [0, -.8, 0]);
  cylinder('dark', 1.045, 1.045, .035, [0, -.71, 0]);
  ring('light', 1.018, .012, [0, -.688, 0], [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 36; i++) {
    const a = i / 36 * Math.PI * 2;
    box(i % 3 ? 'shell' : 'light', [.009, .008, i % 3 ? .055 : .09], [Math.sin(a) * .92, -.687, Math.cos(a) * .92], [0, a, 0]);
    if (i % 3 === 0) {
      cylinder('gold', .013, .013, .012, [Math.sin(a) * .98, -.68, Math.cos(a) * .98], undefined, 8);
      box('shell', [.08, .09, .13], [Math.sin(a) * 1.03, -.79, Math.cos(a) * 1.03], [0, a, 0]);
    }
  }

  if (index === 0) {
    // An architectural study: stepped towers, curtain walls, terraces and roof plant.
    box('white', [1.32, .1, .94], [0, -.61, 0]);
    const towers = [[-.34, .4, -.08, .46, 1.9, .48], [.27, .06, -.19, .46, 1.22, .46], [.35, -.35, .31, .54, .42, .36]];
    towers.forEach(([x, y, z, w, h, d], t) => {
      box('glass', [w, h, d], [x, y, z]);
      const floors = Math.round(h / .13);
      for (let f = 0; f <= floors; f++) {
        const fy = y - h / 2 + h * f / floors;
        box('shell', [w + .035, .018, d + .035], [x, fy, z]);
        if (f % 3 === t) box('light', [w * .42, .026, .008], [x + .06, fy + .043, z + d / 2 + .008]);
      }
      for (const side of [-1, 1]) {
        box('white', [.026, h + .04, .028], [x + side * w / 2, y, z + d / 2]);
        box('shell', [.018, h, .024], [x, y, z + side * d / 2]);
      }
      for (let col = 1; col < 5; col++) {
        const cx = x - w / 2 + col * w / 5;
        box('shell', [.009, h, .016], [cx, y, z + d / 2 + .003]);
        for (let f = 0; f < floors; f++) if ((f * 7 + col * 3 + t) % 5 < 2) {
          box('gold', [w / 5 - .025, .049, .006], [cx - .038, y - h / 2 + (f + .5) * h / floors, z + d / 2 + .014]);
        }
      }
      for (let segment = 0; segment < Math.floor(h / .45); segment++) {
        const low = y - h / 2 + segment * .45, high = Math.min(y + h / 2, low + .45);
        bar('white', [x - w / 2, low, z - d / 2 - .01], [x + w / 2, high, z - d / 2 - .01], .012);
        bar('shell', [x + w / 2 + .012, low, z - d / 2], [x + w / 2 + .012, high, z + d / 2], .01);
      }
      box('white', [w + .08, .055, d + .08], [x, y + h / 2, z]);
      box('dark', [w * .53, .09, d * .55], [x, y + h / 2 + .07, z]);
      for (let ac = 0; ac < 3; ac++) {
        cylinder('shell', .032, .032, .015, [x + (ac - 1) * .08, y + h / 2 + .12, z]);
        ring('dark', .022, .004, [x + (ac - 1) * .08, y + h / 2 + .13, z], [Math.PI / 2, 0, 0]);
      }
    });
    bar('gold', [-.34, 1.39, -.08], [-.34, 1.79, -.08], .012);
    cylinder('light', .027, .027, .06, [-.34, 1.79, -.08]);
    for (let i = 0; i < 5; i++) box('white', [.12, .018, .42], [-.34 + i * .16, -.535, .34]);
    for (const x of [-.55, .6]) {
      cylinder('gold', .045, .065, .09, [x, -.53, .3]);
      add('light', new THREE.IcosahedronGeometry(.075, 1), [x, -.43, .3]);
    }
  } else if (index === 1) {
    // Mirrorless camera with layered optical glass, knurled controls and a hot shoe.
    rounded('dark', [1.42, .83, .47], [0, .01, 0], .1);
    rounded('shell', [1.44, .12, .49], [0, .42, 0], .04);
    rounded('dark', [.3, .76, .65], [.57, -.04, .08], .1);
    rounded('shell', [.42, .2, .39], [-.13, .53, -.02], .035);
    box('glass', [.25, .095, .018], [-.13, .54, -.224]);
    box('gold', [.22, .018, .21], [-.13, .645, -.02]);
    const face = [Math.PI / 2, 0, 0];
    cylinder('shell', .365, .365, .1, [-.13, 0, .3], face);
    cylinder('dark', .32, .35, .47, [-.13, 0, .55], face);
    for (let i = 0; i < 6; i++) ring(i === 0 ? 'gold' : 'shell', .323 - i * .004, .012, [-.13, 0, .38 + i * .065]);
    cylinder('dark', .292, .292, .035, [-.13, 0, .805], face);
    cylinder('glass', .246, .246, .015, [-.13, 0, .832], face);
    ring('light', .205, .007, [-.13, 0, .845]);
    ring('glass', .14, .015, [-.13, 0, .852]);
    cylinder('dark', .085, .085, .01, [-.13, 0, .857], face);
    for (let i = 0; i < 36; i++) {
      const a = i / 36 * Math.PI * 2;
      box('shell', [.011, .022, .14], [-.13 + Math.sin(a) * .326, Math.cos(a) * .326, .51], [0, 0, -a]);
    }
    for (const x of [-.51, .46]) {
      cylinder('dark', .12, .12, .09, [x, .51, 0]);
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2;
        box('shell', [.014, .067, .018], [x + Math.sin(a) * .12, .51, Math.cos(a) * .12], [0, a, 0]);
      }
    }
    cylinder('light', .052, .052, .02, [.46, .56, 0]);
    box('glass', [.84, .48, .02], [-.12, -.03, -.25]);
    for (let i = 0; i < 4; i++) cylinder('shell', .026, .026, .03, [.47, .24 - i * .12, -.25], face, 12);
    box('white', [.18, .046, .009], [-.52, .28, .247]);
    for (const x of [-.74, .74]) ring('shell', .068, .019, [x, .28, 0], [0, Math.PI / 2, 0]);
    cylinder('shell', .16, .24, .13, [0, -.6, 0]);
    for (let x = 0; x < 6; x++) for (let y = 0; y < 11; y++) {
      box('shell', [.012, .022, .007], [.47 + x * .028, -.3 + y * .049, .409]);
    }
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2;
      cylinder('gold', .011, .011, .012, [-.13 + Math.sin(a) * .345, Math.cos(a) * .345, .36], face, 8);
    }
    for (let i = 0; i < 6; i++) box('dark', [.034, .12, .009], [-.13 + Math.sin(i / 6 * Math.PI * 2) * .11, Math.cos(i / 6 * Math.PI * 2) * .11, .862], [0, 0, -i / 6 * Math.PI * 2 - .45]);
  } else if (index === 2) {
    // Communications satellite with tiled arrays, foil panels and a parabolic dish.
    rounded('gold', [.63, .7, .56], [0, .12, 0], .045);
    for (let i = 0; i < 6; i++) box('shell', [.61, .025, .012], [0, -.14 + i * .105, .287]);
    for (const side of [-1, 1]) {
      bar('shell', [side * .3, .12, 0], [side * 1.32, .12, 0], .035);
      box('shell', [.62, .045, 1.13], [side * .97, .12, 0]);
      for (let x = 0; x < 3; x++) for (let z = 0; z < 6; z++) {
        box('glass', [.176, .013, .158], [side * .97 + (x - 1) * .193, .15, (z - 2.5) * .177]);
        box('light', [.15, .003, .004], [side * .97 + (x - 1) * .193, .159, (z - 2.5) * .177]);
      }
      cylinder('dark', .075, .075, .12, [side * .42, .12, 0], [0, 0, Math.PI / 2]);
    }
    const profile = Array.from({ length: 13 }, (_, i) => { const r = i / 12 * .47; return new THREE.Vector2(r, .48 + r * r * .68); });
    add('white', new THREE.LatheGeometry(profile, 40));
    ring('gold', .47, .014, [0, .63, 0], [Math.PI / 2, 0, 0]);
    for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2; bar('shell', [Math.sin(a) * .43, .61, Math.cos(a) * .43], [0, 1.02, 0], .012); }
    cylinder('gold', .046, .065, .13, [0, 1.01, 0]);
    bar('shell', [.25, .38, -.2], [.38, 1.11, -.2], .009);
    add('light', new THREE.SphereGeometry(.03, 10, 8), [.38, 1.11, -.2]);
    for (const x of [-.21, .21]) cylinder('dark', .07, .13, .18, [x, -.32, 0]);
    cylinder('shell', .13, .19, .2, [0, -.56, 0]);
    for (const x of [-.33, .33]) {
      box('white', [.016, .67, .57], [x, .12, 0]);
      for (let i = 0; i < 9; i++) box('dark', [.019, .018, .46], [x * 1.035, -.16 + i * .067, 0]);
      bar('gold', [x, -.15, -.29], [x, .4, -.29], .018);
    }
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * Math.PI * 2;
      bar('shell', [0, .478, 0], [Math.sin(a) * .458, .622, Math.cos(a) * .458], .004);
    }
  } else {
    // Event pavilion: truss structure, LED wall, line arrays, stairs and stage lights.
    box('dark', [1.6, .13, 1.03], [0, -.52, 0]);
    box('shell', [1.62, .027, 1.05], [0, -.44, 0]);
    for (let i = 0; i < 3; i++) box('shell', [.73, .055, .15], [0, -.63 + i * .058, .73 - i * .15]);
    for (const x of [-.7, .7]) {
      for (const z of [-.36, -.21]) bar('shell', [x, -.43, z], [x, .89, z], .022);
      for (let y = 0; y < 7; y++) {
        bar('shell', [x, -.4 + y * .18, -.36], [x, -.22 + y * .18, -.21], .011);
        bar('shell', [x, -.4 + y * .18, -.21], [x, -.22 + y * .18, -.36], .011);
      }
      for (let y = 0; y < 3; y++) rounded('dark', [.19, .17, .24], [x, .55 - y * .19, .03], .022);
      box('light', [.025, .84, .025], [x, .03, -.19]);
    }
    for (const y of [.76, .91]) bar('shell', [-.72, y, -.29], [.72, y, -.29], .026);
    for (let i = 0; i < 9; i++) bar('shell', [-.72 + i * .16, .76, -.29], [-.56 + i * .16, .91, -.29], .012);
    box('dark', [1.2, .83, .085], [0, .19, -.28]);
    box('glass', [1.13, .76, .01], [0, .19, -.229]);
    // Small luminous LED bars form a visual equalizer, legible even at mobile size.
    for (let i = 0; i < 17; i++) {
      const h = .11 + Math.pow(Math.sin(i * .72), 2) * .32;
      box('light', [.035, h, .008], [(i - 8) * .055, -.12 + h / 2, -.217]);
    }
    for (let i = 0; i < 5; i++) {
      cylinder('dark', .065, .085, .13, [(i - 2) * .28, .7, -.17], [Math.PI / 3, 0, 0], 16);
      cylinder('light', .057, .057, .014, [(i - 2) * .28, .66, -.11], [Math.PI / 3, 0, 0], 16);
    }
    ring('light', .2, .009, [0, -.425, .08], [Math.PI / 2, 0, 0]);
    bar('shell', [.3, -.43, .12], [.3, -.02, .12], .011);
    bar('dark', [.3, -.02, .12], [.23, .04, .13], .022);
    for (const x of [-.68, .68]) for (let i = 0; i < 3; i++) {
      rounded('dark', [.18, .105, .18], [x, -.37 + i * .11, .29], .016);
      ring('shell', .039, .005, [x, -.37 + i * .11, .386]);
    }
    for (let i = 0; i < 15; i++) box('light', [.036, .009, .03], [(i - 7) * .095, -.42, .46]);
  }
  Object.entries(pieces).forEach(([type, geometries]) => {
    if (!geometries.length) { materials[type].dispose(); return; }
    const geometry = mergeGeometries(geometries, false);
    geometries.forEach(part => part.dispose());
    const mesh = new THREE.Mesh(geometry, materials[type]);
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.userData.pick = { kind: 'department', index }; group.add(mesh);
  });
  const scanner = new THREE.Mesh(new THREE.TorusGeometry(.99, .008, 5, 100), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: .45, depthWrite: false, blending: THREE.AdditiveBlending }));
  scanner.rotation.x = Math.PI / 2; group.add(scanner);
  const beams = [];
  if (index === 3) {
    for (let i = 0; i < 3; i++) {
      const material = new THREE.ShaderMaterial({
        uniforms: { color: { value: new THREE.Color([0x32e6ff, 0xff508b, 0x9770ff][i]) } },
        vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
        fragmentShader: 'varying vec2 vUv;uniform vec3 color;void main(){float edge=pow(sin(vUv.x*3.14159),2.);float fade=pow(1.-vUv.y,1.5);gl_FragColor=vec4(color*1.5,edge*fade*.13);}',
        transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(.025, .28, 1.05, 24, 1, true), material);
      beam.position.set((i - 1) * .4, .14, .06); group.add(beam); beams.push(beam);
    }
  }
  return { group, accentMaterial: materials.light, update(time) {
    scanner.position.y = -.67 + ((time * .18) % 1) * 1.7;
    scanner.scale.setScalar(.9 + Math.sin(time * .6) * .05);
    beams.forEach((beam, i) => { beam.rotation.z = Math.sin(time * .7 + i * 2) * .18; });
  } };
}
