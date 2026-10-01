import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const MODEL_ROOT = '/models/road-world/polyhaven';

function asphaltTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#62686c';
  ctx.fillRect(0, 0, 512, 512);
  let seed = 8821;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 26000; i++) {
    const value = Math.round(92 + random() * 105);
    ctx.fillStyle = `rgba(${value},${value},${value},${0.025 + random() * 0.09})`;
    const size = 0.5 + random() * 2.2;
    ctx.fillRect(random() * 512, random() * 512, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.7, 13);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  const roughness = texture.clone();
  roughness.colorSpace = THREE.NoColorSpace;
  roughness.needsUpdate = true;
  const bump = texture.clone();
  bump.colorSpace = THREE.NoColorSpace;
  bump.needsUpdate = true;
  return { color: texture, roughness, bump };
}

function vergeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#526a50';
  ctx.fillRect(0, 0, 512, 512);
  let seed = 17413;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 110; i++) {
    const x = random() * 512;
    const y = random() * 512;
    const radius = 9 + random() * 38;
    ctx.globalAlpha = 0.06 + random() * 0.09;
    ctx.fillStyle = random() > 0.45 ? '#a3a475' : '#243f37';
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius * (0.5 + random()), random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  const flecks = ['#81906a', '#a4a57b', '#4e644f', '#887e62', '#c1b393'];
  for (let i = 0; i < 35000; i++) {
    ctx.globalAlpha = 0.16 + random() * 0.48;
    ctx.fillStyle = flecks[Math.floor(random() * flecks.length)];
    const x = random() * 512;
    const y = random() * 512;
    ctx.fillRect(x, y, 0.6 + random() * 2.3, 0.6 + random() * 3.8);
  }
  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  const bump = texture.clone();
  bump.colorSpace = THREE.NoColorSpace;
  bump.needsUpdate = true;
  return { color: texture, bump };
}

function milepostTexture(number) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#153f78';
  ctx.fillRect(0, 0, 256, 192);
  ctx.fillStyle = '#d32f2f';
  ctx.fillRect(0, 165, 256, 27);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.font = '700 104px "Bebas Neue", Arial, sans-serif';
  ctx.fillText(String(number).padStart(2, '0'), 128, 131);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function cursorGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 5, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
  gradient.addColorStop(0.16, 'rgba(137,194,255,0.62)');
  gradient.addColorStop(0.48, 'rgba(63,139,229,0.2)');
  gradient.addColorStop(1, 'rgba(26,75,140,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function RoadWorld({ progress, onReady, onFailure }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      onFailure();
      return undefined;
    }

    let disposed = false;
    const isMobile = () => window.innerWidth < 760;
    const pixelRatio = () => Math.min(devicePixelRatio, isMobile() ? 1.25 : 1.55, Math.sqrt(1700000 / (innerWidth * innerHeight)));
    renderer.setPixelRatio(pixelRatio());
    renderer.setSize(innerWidth, innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    let environmentMap;
    scene.environment = environmentMap;
    scene.environmentIntensity = 0.76;
    scene.fog = new THREE.Fog(0xc3d7e4, 38, 88);
    const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 160);
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    renderPass.clearAlpha = 0;
    composer.addPass(renderPass);
    const ssaoPass = new SSAOPass(scene, camera, innerWidth, innerHeight, 16);
    ssaoPass.kernelRadius = 7;
    ssaoPass.minDistance = 0.004;
    ssaoPass.maxDistance = 0.12;
    composer.addPass(ssaoPass);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.26, 0.42, 0.9);
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());
    scene.add(new THREE.HemisphereLight(0xeaf4ff, 0x53616b, 1.05));
    const sun = new THREE.DirectionalLight(0xffe8c4, 2.55);
    sun.position.set(-5, 9, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(isMobile() ? 768 : 1280, isMobile() ? 768 : 1280);
    Object.assign(sun.shadow.camera, { left: -11, right: 11, top: 10, bottom: -10, near: 0.5, far: 48 });
    sun.shadow.bias = -0.00025;
    scene.add(sun);
    const blueFill = new THREE.DirectionalLight(0x9dc6e8, 0.62);
    blueFill.position.set(7, 2, 1);
    scene.add(blueFill);
    const chapterLightStops = [0xfff0d8, 0xd8edff, 0xffd7bc, 0xf5d8ef, 0xffc47c].map(color => new THREE.Color(color));
    const currentSunColor = new THREE.Color();
    let hdrTexture;
    let hdriEnvironment;
    let gazaniaTemplate;
    let empodiumTemplate;
    const gltfLoader = new GLTFLoader();
    const loadModel = (url, onLoad) => gltfLoader.load(url, result => {
      if (disposed) {
        result.scene.traverse(object => {
          object.geometry?.dispose();
          const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
          materials.forEach(material => material.dispose());
        });
        return;
      }
      onLoad(result.scene);
    });
    const environmentLoader = new HDRLoader();
    environmentLoader.load(`${MODEL_ROOT}/flower_road_2k.hdr`, texture => {
      hdrTexture = texture;
      if (disposed) { texture.dispose(); return; }
      texture.mapping = THREE.EquirectangularReflectionMapping;
      hdriEnvironment = pmremGenerator.fromEquirectangular(texture).texture;
      if (environmentMap) environmentMap.dispose();
      environmentMap = hdriEnvironment;
      scene.environment = hdriEnvironment;
      scene.environmentIntensity = 0.82;
      texture.dispose();
      hdrTexture = null;
      pmremGenerator.dispose();
    });
    loadModel(`${MODEL_ROOT}/flower_gazania/flower_gazania_1k.gltf`, model => {
      gazaniaTemplate = model;
      populateFlowerBeds(model, 0);
    });
    loadModel(`${MODEL_ROOT}/flower_empodium/flower_empodium_1k.gltf`, model => {
      empodiumTemplate = model;
      populateFlowerBeds(model, 1);
    });

    const roadPoints = [V(-0.5, -1.35, 22), V(0.9, -0.55, 12), V(-1.2, 0.95, 1), V(1.5, 2.7, -10), V(-1.35, 4.8, -22), V(1.2, 7.4, -35), V(0.3, 10.4, -48)];
    const roadPath = new THREE.CatmullRomCurve3(roadPoints, false, 'catmullrom', 0.28);
    const roadHalfWidth = t => 1.38 + [0.08, 0.29, 0.51, 0.73, 0.93].reduce((width, stop) => width + 0.25 * Math.exp(-Math.pow((t - stop) / 0.038, 2)), 0);
    const roadGeometry = new THREE.BufferGeometry();
    const roadVertices = [];
    const roadUvs = [];
    const roadIndices = [];
    const segments = 240;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = roadPath.getPointAt(t);
      const tangent = roadPath.getTangentAt(t).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      for (const edge of [-1, 1]) {
        const vertex = point.clone().addScaledVector(side, edge * roadHalfWidth(t));
        roadVertices.push(vertex.x, vertex.y, vertex.z);
        roadUvs.push(edge === -1 ? 0 : 1, t * 12);
      }
      if (i < segments) {
        const base = i * 2;
        roadIndices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
      }
    }
    roadGeometry.setAttribute('position', new THREE.Float32BufferAttribute(roadVertices, 3));
    roadGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(roadUvs, 2));
    roadGeometry.setIndex(roadIndices);
    roadGeometry.computeVertexNormals();
    const asphaltGrain = asphaltTexture();
    const asphalt = new THREE.Mesh(roadGeometry, new THREE.MeshStandardMaterial({ color: 0xb8c0c6, map: asphaltGrain.color, roughnessMap: asphaltGrain.roughness, bumpMap: asphaltGrain.bump, bumpScale: 0.035, metalness: 0.04, roughness: 0.94, side: THREE.DoubleSide }));
    asphalt.receiveShadow = true;
    scene.add(asphalt);

    const roadsideAt = (t, side, offset) => {
      const point = roadPath.getPointAt(t);
      const tangent = roadPath.getTangentAt(t).normalize();
      const lateral = V(-tangent.z, 0, tangent.x).normalize();
      return point.addScaledVector(lateral, side * offset);
    };
    const vergeGrain = vergeTexture();
    const vergeMaterial = new THREE.MeshStandardMaterial({
      map: vergeGrain.color,
      bumpMap: vergeGrain.bump,
      bumpScale: 0.045,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
    });
    const vergeOffsets = [0, 0.55, 1.65, 3.05];
    const vergeDrops = [-0.012, -0.035, -0.1, -0.42];
    const vergeAlpha = [1, 1, 0.74, 0];
    const vergeHeight = distance => {
      for (let i = 1; i < vergeOffsets.length; i++) {
        if (distance <= vergeOffsets[i]) {
          return THREE.MathUtils.lerp(vergeDrops[i - 1], vergeDrops[i], (distance - vergeOffsets[i - 1]) / (vergeOffsets[i] - vergeOffsets[i - 1]));
        }
      }
      return vergeDrops[vergeDrops.length - 1];
    };
    for (const side of [-1, 1]) {
      const vertices = [];
      const uvs = [];
      const colors = [];
      const indices = [];
      const count = 220;
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        vergeOffsets.forEach((offset, edge) => {
          const edgeWobble = edge === 3 ? Math.sin(t * 47) * 0.16 + Math.sin(t * 113) * 0.07 : 0;
          const point = roadsideAt(t, side, roadHalfWidth(t) + offset + edgeWobble);
          vertices.push(point.x, point.y + vergeDrops[edge], point.z);
          uvs.push(edge / 3, t * 14);
          colors.push(1, 1, 1, vergeAlpha[edge]);
        });
        if (i < count) {
          for (let edge = 0; edge < vergeOffsets.length - 1; edge++) {
            const a = i * vergeOffsets.length + edge;
            const b = a + vergeOffsets.length;
            indices.push(a, b, a + 1, a + 1, b, b + 1);
          }
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      const verge = new THREE.Mesh(geometry, vergeMaterial);
      verge.receiveShadow = true;
      scene.add(verge);
    }

    const bladeGeometry = new THREE.BufferGeometry();
    bladeGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
      -0.022, 0, 0, 0.022, 0, 0, 0.032, 0.25, 0.018,
      0, 0, -0.018, 0, 0, 0.018, -0.016, 0.22, 0.03,
    ], 3));
    bladeGeometry.setIndex([0, 1, 2, 3, 4, 5]);
    bladeGeometry.computeVertexNormals();
    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, roughness: 0.95, metalness: 0 });
    let grassShader;
    bladeMaterial.onBeforeCompile = shader => {
      shader.uniforms.roadTime = { value: 0 };
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nuniform float roadTime;');
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.x += position.y * position.y * sin(roadTime * 0.8 + instanceMatrix[3].x * 1.3 + instanceMatrix[3].z * 0.8) * 0.23;');
      grassShader = shader;
    };
    const grassCount = isMobile() ? 2200 : 8000;
    const grass = new THREE.InstancedMesh(bladeGeometry, bladeMaterial, grassCount);
    const dummy = new THREE.Object3D();
    let grassSeed = 29417;
    const grassRandom = () => { grassSeed = (grassSeed * 16807) % 2147483647; return (grassSeed - 1) / 2147483646; };
    const grassColors = [0x5c7852, 0x718b5d, 0x8b9464, 0x9c9969, 0xb4a67a].map(color => new THREE.Color(color));
    for (let i = 0; i < grassCount; i++) {
      const t = 0.01 + grassRandom() * 0.94;
      const side = i % 2 ? 1 : -1;
      const offset = roadHalfWidth(t) + 0.18 + grassRandom() * 2.32;
      const point = roadsideAt(t, side, offset);
      dummy.position.set(point.x, point.y + vergeHeight(offset - roadHalfWidth(t)) + 0.015, point.z);
      dummy.rotation.set(0, grassRandom() * Math.PI * 2, (grassRandom() - 0.5) * 0.22);
      dummy.scale.set(0.65 + grassRandom() * 0.75, 0.42 + grassRandom() * 0.88, 0.65 + grassRandom() * 0.75);
      dummy.updateMatrix();
      grass.setMatrixAt(i, dummy.matrix);
      grass.setColorAt(i, grassColors[Math.floor(grassRandom() * grassColors.length)]);
    }
    grass.instanceMatrix.needsUpdate = true;
    if (grass.instanceColor) grass.instanceColor.needsUpdate = true;
    grass.frustumCulled = false;
    grass.receiveShadow = true;
    scene.add(grass);

    const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0xe9e4d5, roughness: 0.82 });
    [-1, 1].forEach(sign => {
      const points = [];
      for (let i = 0; i <= 140; i++) {
        const point = roadPath.getPointAt(i / 140);
        const tangent = roadPath.getTangentAt(i / 140).normalize();
        points.push(point.add(new THREE.Vector3(-tangent.z, 0, tangent.x).normalize().multiplyScalar(sign * (roadHalfWidth(i / 140) - 0.11))).add(V(0, 0.014, 0)));
      }
      const edge = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 220, 0.014, 6, false), edgeMaterial);
      scene.add(edge);
    });

    const laneMaterial = new THREE.MeshStandardMaterial({ color: 0xf3e9c8, roughness: 0.82 });
    const laneMarks = [];
    for (let i = 0; i < 15; i++) {
      const t = 0.025 + i * 0.064;
      const point = roadPath.getPointAt(t);
      const tangent = roadPath.getTangentAt(t).normalize();
      const mark = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.012, 0.82), laneMaterial);
      mark.position.copy(point).add(V(0, 0.025, 0));
      mark.quaternion.setFromUnitVectors(V(0, 0, -1), tangent);
      mark.userData.routeT = t;
      scene.add(mark);
      laneMarks.push(mark);
    }

    const flowerBeds = [];
    const flowerStops = [0.065, 0.2, 0.36, 0.53, 0.69, 0.87];
    flowerStops.forEach((station, stationIndex) => {
      for (const side of [-1, 1]) {
        for (let patch = 0; patch < 2; patch++) {
          const t = Math.max(0.002, station + (patch ? 0.012 : -0.002));
          const point = roadsideAt(t, side, roadHalfWidth(t) + (patch ? 2.37 : 2.04));
          point.y += vergeHeight(patch ? 2.37 : 2.04) + 0.02;
          const group = new THREE.Group();
          group.position.copy(point);
          scene.add(group);
          flowerBeds.push({ group, position: V(0, 0, 0), species: (stationIndex + patch + (side > 0 ? 1 : 0)) % 2 });
        }
      }
    });

    const cursorGlowMaterial = new THREE.SpriteMaterial({ map: cursorGlowTexture(), color: 0x8dbfff, transparent: true, opacity: 0.24, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
    const cursorGlow = new THREE.Sprite(cursorGlowMaterial);
    cursorGlow.scale.set(1.9, 1.9, 1);
    cursorGlow.renderOrder = 20;
    scene.add(cursorGlow);
    const cursorLight = new THREE.PointLight(0x79b8ff, 1.1, 5.2, 2);
    scene.add(cursorLight);
    const raycaster = new THREE.Raycaster();
    const cursorPlane = new THREE.Plane();
    const cursorPoint = V();
    const cursorTarget = V();

    const concrete = new THREE.MeshStandardMaterial({ color: 0x8c928d, roughness: 0.92, metalness: 0.02 });
    const paintedMetal = new THREE.MeshStandardMaterial({ color: 0xe8ecea, roughness: 0.58, metalness: 0.28 });
    const blueReflector = new THREE.MeshPhysicalMaterial({ color: 0x1a4b8c, roughness: 0.27, metalness: 0.38, clearcoat: 0.65, clearcoatRoughness: 0.22 });
    const redReflector = new THREE.MeshPhysicalMaterial({ color: 0xd32f2f, roughness: 0.29, metalness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.25 });
    const markerTs = [0.025, 0.11, 0.2, 0.29, 0.38, 0.47, 0.56, 0.65, 0.74, 0.83, 0.92];
    const majorMarkers = new Map([[0, 1], [3, 2], [5, 3], [8, 4], [10, 5]]);
    markerTs.forEach((t, index) => {
      for (const side of [-1, 1]) {
        const marker = new THREE.Group();
        marker.position.copy(roadsideAt(t, side, roadHalfWidth(t) + 0.3)).add(V(0, vergeHeight(0.3), 0));
        marker.rotation.y = Math.atan2(roadPath.getTangentAt(t).x, roadPath.getTangentAt(t).z);
        scene.add(marker);
        const footing = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.11, 14), concrete);
        footing.position.y = 0.035;
        footing.castShadow = footing.receiveShadow = true;
        marker.add(footing);
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 0.7, 16), paintedMetal);
        body.position.y = 0.43;
        body.castShadow = true;
        marker.add(body);
        const topBand = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.047, 0.085, 16), blueReflector);
        topBand.position.y = 0.67;
        marker.add(topBand);
        const lowerBand = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.055, 0.075, 16), redReflector);
        lowerBand.position.y = 0.38;
        marker.add(lowerBand);
        if (side === 1 && majorMarkers.has(index)) {
          const face = new THREE.Mesh(
            new THREE.PlaneGeometry(0.28, 0.21),
            new THREE.MeshBasicMaterial({ map: milepostTexture(majorMarkers.get(index)), side: THREE.DoubleSide, toneMapped: false }),
          );
          face.position.set(0, 0.84, 0.002);
          face.rotation.y = Math.PI;
          marker.add(face);
          const frame = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.24, 0.025), blueReflector);
          frame.position.set(0, 0.84, 0);
          marker.add(frame);
          face.position.z = -0.018;
        }
      }
    });

    const populateFlowerBeds = (template, species) => {
      flowerBeds.forEach((bed, index) => {
        if (bed.species !== species || bed.plants) return;
        const plants = [];
        for (let j = 0; j < 2; j++) {
          const plant = template.clone(true);
          const bounds = new THREE.Box3().setFromObject(plant);
          const dimensions = bounds.getSize(V());
          const width = Math.max(dimensions.x, dimensions.z, 0.01);
          const scale = Math.min(2.35, 1.25 / width) * (0.88 + ((j * 37 + index * 13) % 18) / 100);
          const instance = new THREE.Group();
          plant.scale.setScalar(scale);
          plant.position.y = -bounds.min.y * scale;
          plant.traverse(object => {
            if (object.isMesh) {
              object.castShadow = true;
              object.receiveShadow = true;
              const materials = Array.isArray(object.material) ? object.material : [object.material];
              materials.forEach(material => { material.envMapIntensity = 0.72; });
            }
          });
          instance.add(plant);
          instance.position.set(bed.position.x + Math.cos(j * 2.4) * 0.28, bed.position.y, bed.position.z + Math.sin(j * 2.4) * 0.36);
          instance.rotation.y = (index * 1.83 + j * 1.1) % (Math.PI * 2);
          bed.group.add(instance);
          plants.push(instance);
        }
        bed.plants = plants;
      });
    };
    if (gazaniaTemplate) populateFlowerBeds(gazaniaTemplate, 0);
    if (empodiumTemplate) populateFlowerBeds(empodiumTemplate, 1);

    const cameraPath = new THREE.CatmullRomCurve3([V(-0.1, 4.8, 30), V(0.55, 5.35, 20), V(-0.75, 6.65, 10), V(0.7, 8.35, 0), V(-0.65, 10.45, -10)], false, 'catmullrom', 0.22);
    const lookPath = new THREE.CatmullRomCurve3([V(0.9, 2.95, 14), V(-1.2, 3.65, 4), V(1.5, 5.3, -6), V(-1.35, 7.25, -16), V(1.2, 9.5, -26)], false, 'catmullrom', 0.22);
    let currentProgress = progress.current;
    const pointer = new THREE.Vector2();
    const targetPointer = new THREE.Vector2();
    const onPointerMove = event => {
      targetPointer.x = (event.clientX / innerWidth - 0.5) * 2;
      targetPointer.y = (event.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    let last = performance.now();
    let frameId;
    const render = now => {
      if (disposed) return;
      const dt = Math.min((now - last) / 1000, 0.08);
      last = now;
      const targetProgress = THREE.MathUtils.clamp(progress.current, 0, 4);
      currentProgress += (targetProgress - currentProgress) * (1 - Math.exp(-dt * 4.8));
      const t = currentProgress / 4;
      cameraPath.getPoint(t, camera.position);
      lookPath.getPoint(t, cameraTarget);
      pointer.lerp(targetPointer, 1 - Math.exp(-dt * 3.8));
      camera.position.x += pointer.x * 0.28;
      camera.position.y -= pointer.y * 0.14;
      cameraTarget.x += pointer.x * 0.45;
      cameraTarget.y -= pointer.y * 0.18;
      camera.lookAt(cameraTarget);
      const roadTangent = roadPath.getTangentAt(t).normalize();
      camera.rotation.z += -roadTangent.x * 0.018 + Math.sin(now * 0.00028) * 0.002;
      camera.fov = 48 + Math.sin(now * 0.00019) * 0.12;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      const lightBand = Math.min(3, Math.floor(t * 4));
      const lightMix = t * 4 - lightBand;
      currentSunColor.copy(chapterLightStops[lightBand]).lerp(chapterLightStops[lightBand + 1], lightMix);
      sun.color.copy(currentSunColor);
      sun.intensity = 2.25 + t * 0.42;
      sun.position.set(-5 + t * 5.5, 11 + t * 5, 8 - t * 3.5);
      scene.fog.color.copy(currentSunColor).lerp(new THREE.Color(0xc3d7e4), 0.74);
      const cameraForward = camera.getWorldDirection(V());
      cursorPlane.setFromNormalAndCoplanarPoint(cameraForward, camera.position.clone().addScaledVector(cameraForward, 7.2));
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(cursorPlane, cursorTarget);
      cursorPoint.lerp(cursorTarget, 1 - Math.exp(-dt * 8));
      cursorGlow.position.copy(cursorPoint);
      cursorLight.position.copy(cursorPoint);
      if (grassShader) grassShader.uniforms.roadTime.value = now * 0.001;

      flowerBeds.forEach((bed, i) => {
        bed.plants?.forEach((plant, j) => { plant.rotation.z = Math.sin(now * 0.00062 + i * 0.9 + j) * 0.025; });
      });
      laneMarks.forEach(mark => {
        const routeT = mark.userData.routeT;
        const point = roadPath.getPointAt(routeT);
        const tangent = roadPath.getTangentAt(routeT).normalize();
        mark.position.set(point.x, point.y + 0.025, point.z);
        mark.quaternion.setFromUnitVectors(V(0, 0, -1), tangent);
      });
      composer.render(dt);
      frameId = requestAnimationFrame(render);
    };
    const cameraTarget = V();
    const resize = () => {
      renderer.setPixelRatio(pixelRatio());
      renderer.setSize(innerWidth, innerHeight, false);
      composer.setPixelRatio(pixelRatio());
      composer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    onReady();
    frameId = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      composer.dispose();
      pmremGenerator.dispose();
      if (hdrTexture) hdrTexture.dispose();
      if (environmentMap) environmentMap.dispose();
      if (hdriEnvironment && hdriEnvironment !== environmentMap) hdriEnvironment.dispose();
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach(material => {
            Object.values(material).forEach(value => { if (value?.isTexture) value.dispose(); });
            material.dispose();
          });
        }
      });
      renderer.dispose();
    };
  }, [progress, onReady, onFailure]);

  return <canvas ref={canvasRef} className="world-canvas" aria-hidden="true" />;
}
