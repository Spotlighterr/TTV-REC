import * as THREE from 'three';

const pointOnEarth = (lon, lat, radius) => {
  const a = lon * Math.PI / 180, b = lat * Math.PI / 180;
  return new THREE.Vector3(radius * Math.cos(b) * Math.cos(a), radius * Math.sin(b), -radius * Math.cos(b) * Math.sin(a));
};

// Thousands of surface details share one geometry/material and one draw call.
export function createLandPoints(map, sprite, radius) {
  const mask = document.createElement('canvas'); mask.width = 1024; mask.height = 512;
  const context = mask.getContext('2d', { willReadFrequently: true });
  context.drawImage(map.image, 0, 0, mask.width, mask.height);
  const pixels = context.getImageData(0, 0, mask.width, mask.height).data;
  const positions = [], colors = [];
  const cyan = new THREE.Color('#7cbed1'), gold = new THREE.Color('#ffe2a0');
  for (let lat = -59; lat < 79; lat += 1.05) {
    const step = 1.25 / Math.cos(lat * Math.PI / 180);
    for (let lon = -180; lon < 180; lon += step) {
      const px = Math.floor((lon + 180) / 360 * 1024), py = Math.floor((90 - lat) / 180 * 512);
      const offset = (py * 1024 + px) * 4;
      if (pixels[offset] < 28 || pixels[offset + 1] < 55) continue;
      const point = pointOnEarth(lon, lat, radius + 0.012);
      positions.push(point.x, point.y, point.z);
      const color = pixels[offset] > 150 && lon > 102 && lon < 110 && lat > 8 && lat < 24 ? gold : cyan;
      colors.push(color.r, color.g, color.b);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({ map: sprite, vertexColors: true, size: 0.026, transparent: true, opacity: 0.64, depthWrite: false, blending: THREE.AdditiveBlending }));
}

export function createCityLights(sprite, radius) {
  const cities = [[105.8542, 21.0285], [108.2, 16.05], [106.63, 10.82], [106.68, 20.85], [103.82, 1.35], [139.69, 35.68], [100.5, 13.75]];
  const positions = [];
  cities.forEach(([lon, lat], city) => {
    for (let i = 0; i < 42; i++) {
      const angle = i * 2.399963, distance = Math.sqrt(i / 42) * 0.62;
      const p = pointOnEarth(lon + Math.cos(angle) * distance, lat + Math.sin(angle) * distance * 0.65, radius + 0.02 + city * 0.0001);
      positions.push(p.x, p.y, p.z);
    }
  });
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({ map: sprite, color: 0xffe4ba, size: 0.038, opacity: 0.68, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
}

export function createOrbitalDetails(radius) {
  const group = new THREE.Group();
  const tickPositions = [];
  for (let i = 0; i < 144; i++) {
    const a = i / 144 * Math.PI * 2, r = radius + 0.5, length = i % 12 === 0 ? 0.115 : i % 3 === 0 ? 0.065 : 0.028;
    tickPositions.push(Math.cos(a) * r, Math.sin(a) * r, 0, Math.cos(a) * (r + length), Math.sin(a) * (r + length), 0);
  }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(tickPositions, 3));
  const ticks = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0xa1cbde, transparent: true, opacity: 0.3 }));
  ticks.rotation.set(0.82, 0.18, -0.28); group.add(ticks);

  const satellites = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({ color: 0xb8d0df, specular: 0xaccaff, shininess: 55 }), 6);
  satellites.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  for (let i = 0; i < 6; i++) satellites.setColorAt(i, new THREE.Color(i % 3 === 0 ? '#e0e7e8' : '#285c86'));
  satellites.frustumCulled = false; group.add(satellites);
  const dummy = new THREE.Object3D(), offset = new THREE.Vector3(), position = new THREE.Vector3(), orientation = new THREE.Quaternion();
  function update(time) {
    for (let s = 0; s < 2; s++) {
      const a = time * (s ? -0.07 : 0.095) + s * 2.8, r = radius + 0.68 + s * 0.2;
      position.set(Math.cos(a) * r, Math.sin(a) * r * 0.46, Math.sin(a) * r * 0.9);
      orientation.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, -a);
      for (let part = 0; part < 3; part++) {
        offset.set(part === 0 ? 0 : part === 1 ? -0.15 : 0.15, 0, 0).applyQuaternion(orientation);
        dummy.position.copy(position).add(offset); dummy.quaternion.copy(orientation);
        dummy.scale.set(part === 0 ? 0.095 : 0.18, part === 0 ? 0.09 : 0.013, part === 0 ? 0.13 : 0.25);
        dummy.updateMatrix(); satellites.setMatrixAt(s * 3 + part, dummy.matrix);
      }
    }
    satellites.instanceMatrix.needsUpdate = true;
  }
  return { group, update };
}

export function createRouteParticles(curves) {
  const positions = [], phases = [];
  curves.forEach((curve, i) => {
    for (let j = 0; j < 96; j++) {
      const p = curve.getPoint(j / 95); positions.push(p.x, p.y, p.z); phases.push(j / 95 + i * 0.17);
    }
  });
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1));
  const material = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 }, pixelRatio: { value: 1 } },
    vertexShader: `attribute float phase; varying float strength; uniform float time; uniform float pixelRatio;
      void main(){ float trail=fract(phase-time*.1); strength=pow(1.-trail,26.); vec4 p=modelViewMatrix*vec4(position,1.);
      gl_Position=projectionMatrix*p; gl_PointSize=clamp((1.+strength*5.)*pixelRatio*12./max(1.,-p.z),1.,13.*pixelRatio); }`,
    fragmentShader: `varying float strength; void main(){float d=length(gl_PointCoord-.5);float a=pow(max(0.,1.-d*2.),2.);gl_FragColor=vec4(.65,.87,1.,a*strength);}`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geometry, material);
}

export function createRadar() {
  return new THREE.Mesh(new THREE.RingGeometry(0.09, 0.33, 64), new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: 'varying vec2 uvPosition;void main(){uvPosition=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying vec2 uvPosition;uniform float time;void main(){vec2 p=uvPosition-.5;float angle=atan(p.y,p.x);float sweep=fract(angle/6.283185-time*.09);float alpha=pow(1.-sweep,9.)*.28;gl_FragColor=vec4(.68,.86,1.,alpha);}',
    side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
}
