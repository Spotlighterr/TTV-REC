import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createDepartmentModel } from './department-models';
import { createAmbientSpace } from './ambient-space';
import { createOrbitalStation, createFlightEffects } from './orbital-station';
import earthDayUrl from '../assets/textures/earth-day.jpg';
import earthNormalUrl from '../assets/textures/earth-normal.jpg';
import earthWaterUrl from '../assets/textures/earth-water.jpg';
import earthCloudsUrl from '../assets/textures/earth-clouds.png';
import { createCityLights, createOrbitalDetails, createRouteParticles, createRadar } from './scene-details';
import worldUrl from './data/world.json?url';
import { activities } from './content';

const R = 3.15;
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const geographic = (lon, lat, radius = R) => {
  const a = THREE.MathUtils.degToRad(lon), b = THREE.MathUtils.degToRad(lat);
  return V(radius * Math.cos(b) * Math.cos(a), radius * Math.sin(b), -radius * Math.cos(b) * Math.sin(a));
};
const smooth = value => value * value * (3 - 2 * value);
const polygonRings = feature => feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;

function glowTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.15, 'rgba(210,236,255,.6)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function labelSprite(text) {
  const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.font = `500 26px ${getComputedStyle(document.documentElement).fontFamily}`; ctx.fillStyle = '#d6e4ef'; ctx.textAlign = 'center'; ctx.fillText(text, 320, 56);
  const map = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false }));
  sprite.scale.set(3, 0.45, 1);
  return sprite;
}

function archipelagoMarker(text, lon, lat, labelOffset) {
  const point = geographic(lon, lat, R + 0.045);
  const marker = new THREE.Group();
  marker.position.copy(point);
  marker.quaternion.setFromUnitVectors(V(0, 0, 1), point.clone().normalize());

  const halo = new THREE.Mesh(
    new THREE.RingGeometry(0.075, 0.09, 40),
    new THREE.MeshBasicMaterial({ color: 0xffbd83, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }),
  );
  halo.position.z = 0.012;
  marker.add(halo);

  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 12, 8),
    new THREE.MeshBasicMaterial({ color: 0xffe2bd }),
  );
  center.position.z = 0.025;
  marker.add(center);

  const label = labelSprite(text);
  label.scale.set(0.9, 0.135, 1);
  label.position.set(labelOffset[0], labelOffset[1], 0.05);
  marker.add(label);
  return marker;
}

export default function RecWorld({ progress, state, pinRef, onReady, onFailure, onPick }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch { onFailure(); return undefined; }
    let disposed = false, needsRender = true;
    const mobile = () => window.innerWidth < 760;
    const dprLimit = () => Math.min(devicePixelRatio, mobile() ? 1.3 : 1.5, Math.sqrt(1500000 / (innerWidth * innerHeight)));
    let renderDpr = dprLimit(), qualityScale = 1;
    renderer.setPixelRatio(renderDpr); renderer.setSize(innerWidth, innerHeight, false);
    renderer.setClearColor(0x03080f);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; renderer.shadowMap.autoUpdate = false;
    const scene = new THREE.Scene();
    const studio = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(studio, .04, .1, 100, { size: 128 });
    scene.environment = environment.texture; scene.environmentIntensity = .5;
    studio.dispose(); pmrem.dispose();
    const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 180);
    camera.position.set(0, 0, 12.5);
    scene.add(new THREE.AmbientLight(0x526d9b, .4));
    const sun = new THREE.DirectionalLight(0xffe6cf, 2.6); sun.position.set(-5, 7, 9); scene.add(sun);
    sun.target.position.set(3, 0, 0); scene.add(sun.target);
    sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 30 });
    sun.shadow.bias = -.0003; sun.shadow.normalBias = .025;
    const blueLight = new THREE.DirectionalLight(0x62a9c6, 1.55); blueLight.position.set(-7, -2, 1); scene.add(blueLight);
    const rimLight = new THREE.DirectionalLight(0xd99568, 2.2); rimLight.position.set(4, 5, -5); scene.add(rimLight);
    const violetLight = new THREE.DirectionalLight(0x766c9a, 0.45); violetLight.position.set(7, -4, 4); scene.add(violetLight);

    const earthRig = new THREE.Group(); scene.add(earthRig);
    const earthSpin = new THREE.Group(); earthRig.add(earthSpin);
    const sphereGeometry = new THREE.SphereGeometry(R, mobile() ? 72 : 96, mobile() ? 48 : 64);
    const earthMaterial = new THREE.MeshPhongMaterial({ color: 0xd9e6f1, specular: 0x7eb2d8, shininess: 32 });
    const earthTextures = new THREE.TextureLoader();
    const loadEarth = (url, color = false) => { const texture = earthTextures.load(url, () => { needsRender = true; }); if (color) texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8); return texture; };
    earthMaterial.map = loadEarth(earthDayUrl, true);
    earthMaterial.normalMap = loadEarth(earthNormalUrl); earthMaterial.normalScale.set(.65, .65);
    earthMaterial.specularMap = loadEarth(earthWaterUrl);
    const planet = new THREE.Mesh(sphereGeometry, earthMaterial); earthSpin.add(planet);
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(R + .035, 72, 48), new THREE.MeshPhongMaterial({ map: loadEarth(earthCloudsUrl, true), transparent: true, opacity: .62, depthWrite: false, color: 0xe3f0ff, shininess: 0 })); earthSpin.add(clouds);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(R * 1.028, 64, 48), new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(0x459de9) } },
      vertexShader: 'varying vec3 n; varying vec3 p; void main(){ n=normalize(normalMatrix*normal); vec4 v=modelViewMatrix*vec4(position,1.); p=v.xyz; gl_Position=projectionMatrix*v; }',
      fragmentShader: 'uniform vec3 color; varying vec3 n; varying vec3 p; void main(){float rim=pow(1.-abs(dot(normalize(n),normalize(-p))),3.4); gl_FragColor=vec4(color*1.7,rim*.9);}',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    earthRig.add(atmosphere);

    const glowMap = glowTexture();
    const ambientSpace = createAmbientSpace(glowMap); scene.add(ambientSpace.group);
    const station = createOrbitalStation(glowMap); earthRig.add(station.group);
    const flight = createFlightEffects(glowMap, mobile()); scene.add(flight.group);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: 0x196bad, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.scale.set(13.5, 13.5, 1); glow.position.z = -2.7; earthRig.add(glow);
    const orbitalDetails = createOrbitalDetails(R); earthRig.add(orbitalDetails.group);
    earthSpin.add(createCityLights(glowMap, R));
    const archipelagoMarkers = [
      archipelagoMarker('HOÀNG SA', 111.6019, 16.5333, [0.25, 0.02]),
      archipelagoMarker('TRƯỜNG SA', 111.9167, 8.6333, [0.14, -0.19]),
    ];
    archipelagoMarkers.forEach(marker => earthSpin.add(marker));

    const north = geographic(105.8542, 21.0285, R + 0.045);
    const pin = new THREE.Group(); pin.position.copy(north); pin.quaternion.setFromUnitVectors(V(0, 0, 1), north.clone().normalize()); earthSpin.add(pin);
    const pinCore = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.9, 1.5, 0.9) })); pin.add(pinCore);
    const pinGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: 0xffdb96, opacity: 0.85, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    pinGlow.scale.set(0.34, 0.34, 1); pinGlow.position.z = 0.025; pin.add(pinGlow);
    const radar = createRadar(); radar.position.z = 0.012; pin.add(radar);
    const pinRings = [];
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.071, 48), new THREE.MeshBasicMaterial({ color: 0xf8d992, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
      ring.position.z = 0.01; pin.add(ring); pinRings.push(ring);
    }
    const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.001, 0.033, 0.65, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe1a6, transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
    beacon.rotation.x = Math.PI / 2; beacon.position.z = 0.32; pin.add(beacon);
    const cityLabels = [[108.2, 16.05, 'ĐÀ NẴNG'], [106.63, 10.82, 'TP. HỒ CHÍ MINH']].map(([lon, lat, text]) => {
      const label = labelSprite(text); label.position.copy(geographic(lon + 1.8, lat - 0.6, R + 0.065));
      label.scale.set(0.65, 0.1, 1); earthSpin.add(label); return label;
    });

    const rings = new THREE.Group(); earthRig.add(rings);
    [0, 1, 2].forEach(i => {
      const radius = R + 0.35 + i * 0.25;
      const points = Array.from({ length: 161 }, (_, j) => V(Math.cos(j / 160 * Math.PI * 2) * radius, Math.sin(j / 160 * Math.PI * 2) * radius, 0));
      const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: i === 1 ? 0xd6c397 : 0x528dc5, transparent: true, opacity: i === 1 ? 0.18 : 0.22 }));
      ring.rotation.set(0.9 + i * 0.55, 0.3 + i * 0.42, i * 0.9); rings.add(ring);
    });

    const routes = [];
    [[106.63, 10.82], [108.2, 16.05], [103.82, 1.35], [139.69, 35.68], [2.35, 48.85], [151.21, -33.87]].forEach(([lon, lat], index) => {
      const start = north.clone(), end = geographic(lon, lat, R + 0.045);
      const middle = start.clone().add(end).normalize().multiplyScalar(R + 0.3 + start.distanceTo(end) * 0.24);
      const curve = new THREE.QuadraticBezierCurve3(start, middle, end);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)), new THREE.LineBasicMaterial({ color: index < 2 ? 0xf8d992 : 0x73bced, transparent: true, opacity: index < 2 ? 0.7 : 0.34 }));
      earthSpin.add(line);
      routes.push(curve);
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.021, 8, 6), new THREE.MeshBasicMaterial({ color: 0x89caff })); dot.position.copy(end); earthSpin.add(dot);
    });
    const routeParticles = createRouteParticles(routes); earthSpin.add(routeParticles);

    // Deterministic star positions prevent large changes during resize or remount.
    const starCount = mobile() ? 950 : 1800;
    const positions = new Float32Array(starCount * 3);
    let seed = 719;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < starCount; i++) { positions[i * 3] = (random() - 0.5) * 100; positions[i * 3 + 1] = (random() - 0.5) * 70; positions[i * 3 + 2] = random() * -75 - 8; }
    const starsGeometry = new THREE.BufferGeometry(); starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xbacfe4, size: 0.065, sizeAttenuation: true, map: glowMap, transparent: true, opacity: 0.86, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(stars);

    const streakPositions = new Float32Array(140 * 6);
    for (let i = 0; i < 140; i++) {
      const angle = random() * Math.PI * 2, radius = 6 + random() * 24, z = -20 + random() * 22;
      streakPositions.set([Math.cos(angle) * radius, Math.sin(angle) * radius, z, Math.cos(angle) * radius, Math.sin(angle) * radius, z + 3], i * 6);
    }
    const streakGeometry = new THREE.BufferGeometry(); streakGeometry.setAttribute('position', new THREE.BufferAttribute(streakPositions, 3));
    const streaks = new THREE.LineSegments(streakGeometry, new THREE.LineBasicMaterial({ color: 0x8ac8ff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(streaks);

    const interactives = [];
    const gallery = new THREE.Group(); scene.add(gallery);
    const photoCards = [];
    const textures = [];
    const textureLoader = new THREE.TextureLoader();
    activities.forEach((activity, i) => {
      const group = new THREE.Group(); gallery.add(group);
      const image = textureLoader.load(activity.image, () => { needsRender = true; }); image.colorSpace = THREE.SRGBColorSpace; textures.push(image);
      const material = new THREE.MeshBasicMaterial({ map: image, color: 0xf3eee4, transparent: true, toneMapped: false });
      const card = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.14), material); card.position.z = .045; card.userData.pick = { kind: 'activity', index: i }; group.add(card); interactives.push(card);
      const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.78, 1.22, 0.035)), new THREE.LineBasicMaterial({ color: 0xc0ad93, transparent: true, opacity: 0.42 })); group.add(frame);
      const housing = new THREE.Mesh(new RoundedBoxGeometry(1.86, 1.3, .08, 1, .025), new THREE.MeshStandardMaterial({ color: 0x222a30, metalness: .35, roughness: .48 })); group.add(housing);
      const tag = labelSprite(`0${i + 1} / REC ARCHIVE`); tag.position.y = -0.91; group.add(tag);
      photoCards.push(group);
    });

    const constellation = new THREE.Group(); scene.add(constellation);
    const nodes = [];
    const colors = [0x42e7ff, 0xb986ff, 0xffab4d, 0xff548a];
    const nodePositions = [V(-1.4, 1.55, 0), V(1.6, 1.65, 0), V(-1.4, -1.65, 0.5), V(1.65, -1.5, .2)];
    nodePositions.forEach((pos, i) => {
      const group = new THREE.Group(); group.position.copy(pos); constellation.add(group);
      const model = createDepartmentModel(i, colors[i]); group.add(model.group);
      model.group.traverse(object => { if (object.isMesh) interactives.push(object); });
      nodes.push({ group, model });
    });


    const abortController = new AbortController();
    fetch(worldUrl, { signal: abortController.signal }).then(response => { if (!response.ok) throw new Error('Map unavailable'); return response.json(); }).then(features => {
      if (disposed) return;

      // The geographic overlay is independent of the photographic planet textures.
      needsRender = true;
      const vietnam = features.find(feature => feature.code === 'VNM');
      if (vietnam) polygonRings(vietnam).forEach(polygon => polygon.forEach(ring => {
        const outline = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ring.map(([lon, lat]) => geographic(lon, lat, R + 0.014))), new THREE.LineBasicMaterial({ color: new THREE.Color(1.4, 1.15, 0.65) })); earthSpin.add(outline);
      }));
      onReady();
    }).catch(error => { if (error.name !== 'AbortError' && !disposed) onFailure(); });

    // Longitude first, then latitude: north stays visually up when approaching Vietnam.
    const faceVietnam = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(16), THREE.MathUtils.degToRad(-198), 0, 'XYZ'));
    const startRotation = new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), -0.45).multiply(faceVietnam);
    const endRotation = new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), -0.65).multiply(faceVietnam);
    const rotations = [startRotation, faceVietnam, faceVietnam, startRotation, endRotation];
    const frames = [
      { position: V(3.1, 0, 0), scale: .83, camera: V(0, 0, 12.5) },
      { position: V(3, -1.1, -1), scale: 1.65, camera: V(-0.2, 0.1, 11.3) },
      { position: V(2.8, -2.2, -8), scale: 0.88, camera: V(0, 0, 12.5) },
      { position: V(1.5, -2, -16), scale: .75, camera: V(0, .15, 12.5) },
      { position: V(0, -7.7, -9), scale: 2.55, camera: V(0, 0, 12.5) },
    ];
    const earthPath = new THREE.CatmullRomCurve3(frames.map(frame => frame.position), false, 'catmullrom', 0.2);
    const cameraPath = new THREE.CatmullRomCurve3(frames.map(frame => frame.camera), false, 'catmullrom', 0.2);
    let currentProgress = progress.current;
    let dragYaw = 0, dragPitch = 0, targetYaw = 0, targetPitch = 0, yawVelocity = 0;
    let modelYaw = -.35, targetModelYaw = -.35, modelPitch = .22, targetModelPitch = .22;
    let down = null;
    let lastX = 0, lastY = 0;
    let dragging = false;
    const pointer = new THREE.Vector2();
    const easedPointer = new THREE.Vector2();
    let pointerDirty = false, hovered = null, lastPick = 0;
    const raycaster = new THREE.Raycaster();
    const pointerNdc = event => { pointer.x = event.clientX / innerWidth * 2 - 1; pointer.y = -(event.clientY / innerHeight) * 2 + 1; };
    const pick = () => {
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(interactives, false).find(hit => {
        let visible = true; for (let parent = hit.object; parent; parent = parent.parent) if (!parent.visible) visible = false;
        if (!visible) return false;
        const kind = hit.object.userData.pick.kind;
        return kind === 'activity' ? Math.abs(currentProgress - 2) < 0.42 : Math.abs(currentProgress - 3) < 0.42;
      });
    };
    const pointerDown = event => { down = { x: event.clientX, y: event.clientY, id: event.pointerId, type: event.pointerType }; lastX = event.clientX; lastY = event.clientY; dragging = false; };
    const pointerMove = event => {
      pointerNdc(event); pointerDirty = true; needsRender = true;
      if (down) {
        const dx = event.clientX - down.x, dy = event.clientY - down.y;
        if (!dragging && Math.hypot(dx, dy) > 7) {
          if (down.type === 'touch' && Math.abs(dy) > Math.abs(dx)) { down = null; return; }
          dragging = true; canvas.setPointerCapture(event.pointerId);
        }
        if (dragging && currentProgress < 1.65) {
          yawVelocity = (event.clientX - lastX) * 0.06;
          targetYaw += (event.clientX - lastX) * 0.005;
          targetPitch = THREE.MathUtils.clamp(targetPitch + (event.clientY - lastY) * 0.003, -0.45, 0.45);
        }
        if (dragging && currentProgress > 2.55) {
          targetModelYaw += (event.clientX - lastX) * .008;
          targetModelPitch = THREE.MathUtils.clamp(targetModelPitch + (event.clientY - lastY) * .005, -.4, .7);
        }
        lastX = event.clientX; lastY = event.clientY;
      }
      if (dragging) canvas.style.cursor = 'grabbing';
    };
    const pointerUp = event => {
      if (down && !dragging && Math.hypot(event.clientX - down.x, event.clientY - down.y) < 8) {
        pointerNdc(event); const hit = pick(); if (hit) onPick(hit.object.userData.pick.kind, hit.object.userData.pick.index);
      }
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      down = null; dragging = false;
    };
    const pointerCancel = () => { down = null; dragging = false; yawVelocity = 0; };
    canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('pointermove', pointerMove); canvas.addEventListener('pointerup', pointerUp); canvas.addEventListener('pointercancel', pointerCancel);

    const resize = () => {
      renderDpr = dprLimit() * qualityScale;
      renderer.setPixelRatio(renderDpr); renderer.setSize(innerWidth, innerHeight, false);
      routeParticles.material.uniforms.pixelRatio.value = renderDpr;
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
      needsRender = true;
    };
    window.addEventListener('resize', resize, { passive: true });
    const lost = event => { event.preventDefault(); onFailure(); };
    canvas.addEventListener('webglcontextlost', lost);

    const allFades = new Map();
    [gallery, constellation].forEach(group => {
      const items = [];
      group.traverse(object => { if (object.material) { object.material.transparent = true; items.push([object.material, object.material.opacity]); } });
      allFades.set(group, items);
    });
    const fade = (group, amount) => { group.visible = amount > 0.008; allFades.get(group).forEach(([material, original]) => { material.opacity = original * amount; }); };
    const dragRotation = new THREE.Quaternion(), pinWorld = V(), centerWorld = V(), screenPosition = V(), normalScratch = V(), cameraScratch = V();
    let labelWidth = pinRef.current?.offsetWidth || 220;
    const labelObserver = new ResizeObserver(entries => { labelWidth = entries[0].borderBoxSize?.[0]?.inlineSize || entries[0].contentRect.width; needsRender = true; });
    if (pinRef.current) labelObserver.observe(pinRef.current);
    let previousTime = performance.now(), time = 0, rotation = 0, frameId;
    let lastActivity = -1, lastDepartment = -1, lastFreeze = false, lastFocus = 0, qualityStart = previousTime + 2500, sampleTime = 0, sampleCount = 0;
    let reveal = 1;
    let slowWindows = 0, fastWindows = 0, lastLabelVisible = null;
    const stats = { frames: 0, drawCalls: 0, dpr: renderDpr };
    if (import.meta.env.DEV) canvas.__recStats = stats;
    const render = now => {
      frameId = requestAnimationFrame(render);
      const rawDelta = now - previousTime;
      const dt = Math.min(rawDelta / 1000, 0.1); previousTime = now;
      if (document.hidden) return;
      const freeze = state.current.modal;
      const speed = Math.abs(progress.current - currentProgress);
      const pointerMoving = easedPointer.distanceToSquared(pointer) > 0.00001;
      if (lastFocus !== state.current.focusRequest) { targetYaw = targetPitch = yawVelocity = 0; lastFocus = state.current.focusRequest; needsRender = true; flight.pulse(); }
      if (lastDepartment !== state.current.department) { lastDepartment = state.current.department; reveal = 0; targetModelYaw = -.35; targetModelPitch = .22; needsRender = true; flight.pulse(); }
      const controlsMoving = Math.abs(targetYaw - dragYaw) + Math.abs(targetPitch - dragPitch) + Math.abs(targetModelYaw - modelYaw) + Math.abs(targetModelPitch - modelPitch) > .0001;
      if (freeze && !needsRender && !pointerMoving && !controlsMoving && speed < 0.00001 && lastActivity === state.current.activity && lastFreeze === freeze) return;
      needsRender = false; lastActivity = state.current.activity; lastFreeze = freeze;
      if (!freeze) time += dt;
      currentProgress = progress.current;
      const p = THREE.MathUtils.clamp(currentProgress, 0, 4), from = Math.min(3, Math.floor(p)), to = from + 1, t = smooth(p - from);
      const archipelagoScene = (p > 0.55 && p < 1.55) || p > 3.35;
      archipelagoMarkers.forEach(marker => { marker.visible = archipelagoScene; });
      earthPath.getPoint(p / 4, earthRig.position);
      earthRig.scale.setScalar(THREE.MathUtils.lerp(frames[from].scale, frames[to].scale, t));
      cameraPath.getPoint(p / 4, camera.position);
      if (mobile()) {
        earthRig.position.x *= 0.27;
        earthRig.position.y += THREE.MathUtils.lerp([2.5, 2.5, 2, 2, 1.5][from], [2.5, 2.5, 2, 2, 1.5][to], t);
        earthRig.scale.multiplyScalar(THREE.MathUtils.lerp([.83, .83, .8, .8, .8][from], [.83, .83, .8, .8, .8][to], t));
        camera.position.z += 2.8;
      }
      easedPointer.lerp(pointer, 1 - Math.exp(-dt * 7));
      camera.position.x += easedPointer.x * 0.085;
      camera.position.y += easedPointer.y * 0.055;
      camera.lookAt(0, 0, 0);
      earthSpin.quaternion.copy(rotations[from]).slerp(rotations[to], t);
      if (!dragging && speed > 0.001) { targetYaw *= Math.exp(-dt * 7); targetPitch *= Math.exp(-dt * 7); yawVelocity = 0; }
      else if (!dragging && !freeze) { targetYaw += yawVelocity * dt; yawVelocity *= Math.exp(-dt * 5); }
      dragYaw = THREE.MathUtils.damp(dragYaw, targetYaw, 18, dt);
      dragPitch = THREE.MathUtils.damp(dragPitch, targetPitch, 18, dt);
      dragRotation.setFromEuler(new THREE.Euler(dragPitch + Math.sin(time * 0.09) * 0.02, dragYaw + Math.sin(time * 0.1) * 0.035, 0));
      earthSpin.quaternion.premultiply(dragRotation);
      rings.rotation.z = time * 0.024;
      orbitalDetails.update(time);
      ambientSpace.update(time, p);
      station.update(time, speed); station.group.visible = p < .7 || (p > 1.55 && p < 3.5);
      flight.update(time, dt, p, speed, freeze);
      clouds.rotation.y = time * .005;
      radar.material.uniforms.time.value = time;
      pinGlow.material.opacity = 0.7 + Math.sin(time * 1.8) * 0.1;
      cityLabels.forEach(label => { label.visible = p > 0.7 && p < 1.45; });
      pinRings.forEach((ring, i) => { const phase = (time * 0.45 + i / 3) % 1; ring.scale.setScalar(1 + phase * 3.5); ring.material.opacity = (1 - phase) * 0.75; });
      routeParticles.material.uniforms.time.value = time;
      stars.rotation.y = time * 0.0017;
      stars.rotation.z = p * -0.028;
      streaks.material.opacity = freeze ? 0 : Math.min(0.65, speed * 1.7);
      streaks.position.z = (time * 14) % 10;
      streaks.rotation.z = p * 0.16;
      glow.material.opacity = 0.24 + (1 - Math.min(1, Math.abs(p - 1))) * 0.1;

      const galleryVisibility = 1 - Math.min(1, Math.abs(p - 2) * 1.8);
      fade(gallery, smooth(galleryVisibility));
      gallery.position.set(mobile() ? 0 : 4.05, mobile() ? 2.9 : 0.2, 0);
      gallery.scale.setScalar(mobile() ? 0.65 : 1);
      const desiredRotation = state.current.activity * -Math.PI * 2 / activities.length;
      const angleDelta = Math.atan2(Math.sin(desiredRotation - rotation), Math.cos(desiredRotation - rotation));
      rotation += angleDelta * (freeze ? 1 : 1 - Math.exp(-dt * 8));
      photoCards.forEach((card, i) => {
        const offset = (i - state.current.activity + activities.length) % activities.length;
        const distanceFromActive = Math.min(offset, activities.length - offset);
        card.visible = distanceFromActive <= 2;
        const angle = i / activities.length * Math.PI * 2 + rotation;
        card.position.set(Math.sin(angle) * 4, Math.sin(angle * 2 + time * 0.16) * 0.2, Math.cos(angle) * 3.2);
        card.rotation.set(Math.sin(time * 0.3 + i) * 0.025, Math.sin(angle) * -0.28, Math.sin(angle) * 0.06);
        const isHovered = hovered?.kind === 'activity' && hovered.index === i;
        const isActive = i === state.current.activity;
        const targetScale = (isActive ? 0.98 : 0.7) + (isHovered ? 0.04 : 0);
        card.scale.setScalar(freeze ? targetScale : THREE.MathUtils.damp(card.scale.x, targetScale, 9, dt));
        card.children[1].material.color.setHex(isActive || isHovered ? 0xe1bd93 : 0x8a9498);
        card.children[0].material.opacity = smooth(galleryVisibility) * (isActive ? 1 : .38);
      });
      const constellationVisibility = 1 - Math.min(1, Math.abs(p - 3) * 1.8);
      fade(constellation, smooth(constellationVisibility));
      constellation.position.set(mobile() ? 0 : 3.15, mobile() ? 2.8 : -.2, .7);
      constellation.scale.setScalar(mobile() ? .9 : 2.05);
      reveal = freeze ? 1 : Math.min(1, reveal + dt * 2.6);
      modelYaw = THREE.MathUtils.damp(modelYaw, targetModelYaw, 12, dt);
      modelPitch = THREE.MathUtils.damp(modelPitch, targetModelPitch, 12, dt);
      nodes.forEach(({ group, model }, i) => {
        group.visible = i === (state.current.department || 0);
        const isHovered = hovered?.kind === 'department' && hovered.index === i;
        group.position.set(0, Math.sin(time * .5) * .028 - (1 - reveal) * .25, 0);
        group.scale.setScalar(.88 + .12 * smooth(reveal));
        model.group.rotation.set(modelPitch, modelYaw + Math.sin(time * .16) * .12 + (1 - reveal) * .5, 0);
        if (group.visible) model.update(time);
        model.accentMaterial.emissiveIntensity = freeze ? .65 : THREE.MathUtils.damp(model.accentMaterial.emissiveIntensity, isHovered ? 1.4 : .65, 9, dt);
        model.group.scale.setScalar(freeze ? 1 : THREE.MathUtils.damp(model.group.scale.x, isHovered ? 1.055 : 1, 9, dt));
      });
      camera.updateMatrixWorld();
      if (pointerDirty && !dragging && now - lastPick > 50) {
        lastPick = now; pointerDirty = false;
        gallery.updateMatrixWorld(); constellation.updateMatrixWorld();
        hovered = pick()?.object.userData.pick || null;
        canvas.style.cursor = hovered ? 'pointer' : p < 1.65 || Math.abs(p - 3) < .45 ? 'grab' : 'default';
      }
      if (pinRef.current) {
        pin.getWorldPosition(pinWorld); earthRig.getWorldPosition(centerWorld);
        const facing = normalScratch.copy(pinWorld).sub(centerWorld).normalize().dot(cameraScratch.copy(camera.position).sub(centerWorld).normalize());
        screenPosition.copy(pinWorld).project(camera);
        const visible = p < 1.7 && facing > 0.2 && Math.abs(screenPosition.x) < 0.86 && Math.abs(screenPosition.y) < 0.8;
        const label = pinRef.current;
        if (visible !== lastLabelVisible) { label.style.opacity = visible ? '1' : '0'; label.style.visibility = visible ? 'visible' : 'hidden'; lastLabelVisible = visible; }
        const pointX = (screenPosition.x * 0.5 + 0.5) * innerWidth;
        const labelX = pointX + labelWidth + 30 > innerWidth ? pointX - labelWidth - 18 : pointX + 14;
        label.style.transform = `translate3d(${Math.max(18, labelX)}px,${(-screenPosition.y * 0.5 + 0.5) * innerHeight - 24}px,0)`;
      }
      // A depth texture must exist before any material samples the directional shadow.
      renderer.shadowMap.needsUpdate = constellation.visible || !sun.shadow.map;
      renderer.render(scene, camera);
      stats.frames++; stats.drawCalls = renderer.info.render.calls; stats.dpr = renderDpr;
      // Lower resolution only after sustained slow frames; recovery is deliberately slower.
      if (!freeze && now > qualityStart) {
        sampleTime += rawDelta; sampleCount++;
        if (sampleTime > 1800 && sampleCount > 10) {
          const average = sampleTime / sampleCount;
          slowWindows = average > 25 ? slowWindows + 1 : 0;
          fastWindows = average < 18 ? fastWindows + 1 : 0;
          if (slowWindows >= 2 && qualityScale > 0.7) { qualityScale = Math.max(0.7, qualityScale - 0.15); resize(); slowWindows = 0; }
          else if (fastWindows >= 5 && qualityScale < 1) { qualityScale = Math.min(1, qualityScale + 0.1); resize(); fastWindows = 0; }
          sampleTime = sampleCount = 0;
        }
      }
    };
    resize(); frameId = requestAnimationFrame(render);
    return () => {
      disposed = true; abortController.abort(); cancelAnimationFrame(frameId);
      labelObserver.disconnect();
      window.removeEventListener('resize', resize); canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointermove', pointerMove); canvas.removeEventListener('pointerup', pointerUp); canvas.removeEventListener('pointercancel', pointerCancel);
      const materials = new Set(), geometriesSet = new Set(), maps = new Set(textures);
      maps.add(glowMap);
      scene.traverse(object => { if (object.isInstancedMesh) object.dispose(); if (object.geometry) geometriesSet.add(object.geometry); if (object.material) { materials.add(object.material); Object.values(object.material).forEach(value => { if (value?.isTexture) maps.add(value); }); } });
      geometriesSet.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); maps.forEach(map => map.dispose());
      environment.dispose(); renderer.dispose();
    };
  }, [progress, state, pinRef, onReady, onFailure, onPick]);
  return <canvas ref={canvasRef} className="world-canvas" aria-label="Địa cầu tương tác: kéo để xoay, cuộn để khám phá Việt Nam và REC" />;
}
