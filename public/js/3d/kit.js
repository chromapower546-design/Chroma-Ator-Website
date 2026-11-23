// Shared geometry, material and texture helpers for the product studio.
import * as THREE from '../../vendor/three.module.js?v=3';

const PI = Math.PI;
const TAU = PI * 2;

export { THREE, PI, TAU };

export function paint(color, metalness = 0.35, roughness = 0.45, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });
}

export function addEdges(mesh, color = 0x030805, opacity = 0.3) {
  const geometry = new THREE.EdgesGeometry(mesh.geometry, 28);
  const lines = new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false })
  );
  lines.scale.setScalar(1.0015);
  mesh.add(lines);
  return lines;
}

export function addBox(parent, w, h, d, material, o = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(o.x || 0, o.y || 0, o.z || 0);
  mesh.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
  mesh.castShadow = o.cast !== false;
  mesh.receiveShadow = o.receive !== false;
  if (o.edge) addEdges(mesh, o.edgeColor, o.edgeOpacity);
  parent.add(mesh);
  return mesh;
}

export function addCyl(parent, rTop, rBottom, h, material, o = {}) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(rTop, rBottom, h, o.seg || 24, 1, !!o.open),
    material
  );
  if (o.axis === 'x') mesh.rotation.z = PI / 2;
  else if (o.axis === 'z') mesh.rotation.x = PI / 2;
  mesh.position.set(o.x || 0, o.y || 0, o.z || 0);
  mesh.rotation.x += o.rx || 0;
  mesh.rotation.y += o.ry || 0;
  mesh.rotation.z += o.rz || 0;
  mesh.castShadow = o.cast !== false;
  mesh.receiveShadow = o.receive !== false;
  if (o.edge) addEdges(mesh, o.edgeColor, o.edgeOpacity);
  parent.add(mesh);
  return mesh;
}

export function addSphere(parent, r, material, o = {}) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, o.seg || 20, o.seg || 20), material);
  mesh.position.set(o.x || 0, o.y || 0, o.z || 0);
  mesh.scale.set(o.sx || 1, o.sy || 1, o.sz || 1);
  mesh.castShadow = o.cast !== false;
  mesh.receiveShadow = o.receive !== false;
  parent.add(mesh);
  return mesh;
}

export function addTorus(parent, radius, tube, material, o = {}) {
  const mesh = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, o.tubeSeg || 10, o.seg || 36, o.arc || TAU),
    material
  );
  mesh.position.set(o.x || 0, o.y || 0, o.z || 0);
  mesh.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
  mesh.castShadow = o.cast !== false;
  mesh.receiveShadow = o.receive !== false;
  parent.add(mesh);
  return mesh;
}

export function addTube(parent, points, radius, material, o = {}) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(point => new THREE.Vector3(point[0], point[1], point[2]))
  );
  const geometry = new THREE.TubeGeometry(curve, o.seg || 56, radius, o.radial || 8, false);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = o.cast !== false;
  mesh.receiveShadow = o.receive !== false;
  parent.add(mesh);
  return mesh;
}

export function addPipe(parent, a, b, radius, material, o = {}) {
  const start = new THREE.Vector3(a[0], a[1], a[2]);
  const end = new THREE.Vector3(b[0], b[1], b[2]);
  const direction = end.clone().sub(start);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, direction.length(), o.seg || 14),
    material
  );
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = o.cast !== false;
  mesh.receiveShadow = o.receive !== false;
  parent.add(mesh);
  return mesh;
}

export function addLouvers(parent, w, h, count, material, o = {}) {
  const group = new THREE.Group();
  group.position.set(o.x || 0, o.y || 0, o.z || 0);
  group.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
  const step = h / count;
  const vertical = o.vertical === true;
  for (let i = 0; i < count; i += 1) {
    const offset = -h / 2 + step * (i + 0.5);
    if (vertical) {
      addBox(group, 0.02, h, 0.05, material, {
        x: offset,
        y: 0,
        z: 0,
        rz: 0.52,
        cast: false
      });
    } else {
      addBox(group, w, 0.02, 0.05, material, {
        x: 0,
        y: offset,
        z: 0,
        rx: 0.5,
        cast: false
      });
    }
  }
  parent.add(group);
  return group;
}

export function addWheel(parent, x, z, o = {}) {
  const radius = o.radius || 0.38;
  const width = o.width || 0.26;
  const rubber = o.rubber || paint(0x101413, 0.05, 0.92);
  const rim = o.rim || paint(0x9aa39f, 0.8, 0.28);
  const hub = o.hub || paint(0x242a27, 0.65, 0.4);
  const group = new THREE.Group();
  group.position.set(x, radius, z);
  addCyl(group, radius, radius, width, rubber, { axis: 'z', seg: 28 });
  addCyl(group, radius * 0.58, radius * 0.58, width + 0.015, rim, { axis: 'z', seg: 24 });
  addCyl(group, radius * 0.2, radius * 0.2, width + 0.06, hub, { axis: 'z', seg: 16 });
  if (o.hubcap !== false) {
    addCyl(group, radius * 0.1, radius * 0.1, width + 0.08, rim, { axis: 'z', seg: 12 });
  }
  parent.add(group);
  return group;
}

export function addWheelPair(parent, x, z, o = {}) {
  addWheel(parent, x, z, o);
  addWheel(parent, x, -z, o);
}

export function addBolts(parent, positions, radius, material, o = {}) {
  positions.forEach(([x, y, z]) => {
    addCyl(parent, radius, radius, o.length || 0.03, material, {
      x,
      y,
      z,
      axis: o.axis || 'z',
      seg: 10,
      cast: false
    });
  });
}

export function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function makeTexture(w, h, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  draw(ctx, w, h);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function addBrand(parent, o = {}) {
  const lines = o.lines || ['CHROMA-ATOR'];
  const texture = makeTexture(1024, 320, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = o.color || '#F2F7F4';
    ctx.font = `800 ${o.font || 118}px Arial, Helvetica, sans-serif`;
    ctx.fillText(lines[0], w / 2, lines[1] ? h * 0.38 : h * 0.5);
    if (lines[1]) {
      ctx.fillStyle = o.accent || '#F0C553';
      ctx.font = '700 42px Arial, Helvetica, sans-serif';
      ctx.fillText(lines[1], w / 2, h * 0.74);
    }
  });
  const width = o.w || 1.4;
  const height = o.h || width * (320 / 1024);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.position.set(o.x || 0, o.y || 0, o.z || 0.001);
  mesh.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
  parent.add(mesh);
  return mesh;
}

export function addPlate(parent, o = {}) {
  const text = o.text || 'PESO APPROVED';
  const texture = makeTexture(512, 200, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = o.bg || '#D7DEDA';
    roundRect(ctx, 4, 4, w - 8, h - 8, 14);
    ctx.fill();
    ctx.strokeStyle = o.border || '#8B9791';
    ctx.lineWidth = 6;
    roundRect(ctx, 12, 12, w - 24, h - 24, 10);
    ctx.stroke();
    ctx.fillStyle = o.color || '#1A2620';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `800 ${o.font || 66}px Arial, Helvetica, sans-serif`;
    ctx.fillText(text, w / 2, h / 2 + 2);
  });
  const width = o.w || 0.3;
  const height = o.h || width * (200 / 512);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.position.set(o.x || 0, o.y || 0, o.z || 0.001);
  mesh.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
  parent.add(mesh);
  return mesh;
}

export function addScreen(parent, o = {}) {
  const texture = makeTexture(512, 300, (ctx, w, h) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, o.bgTop || '#06170E');
    gradient.addColorStop(1, o.bgBottom || '#020B06');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(110,214,154,.45)';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.fillStyle = o.color || '#6EF0A5';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '700 132px "Courier New", monospace';
    ctx.fillText(o.value || '0.00', w - 54, h * 0.44);
    ctx.fillStyle = 'rgba(110,214,154,.65)';
    ctx.textAlign = 'left';
    ctx.font = '700 36px Arial, sans-serif';
    ctx.fillText(o.unit || 'kg', 44, h * 0.4);
    ctx.fillStyle = 'rgba(110,214,154,.35)';
    ctx.fillRect(44, h * 0.62, w - 100, 8);
    ctx.fillRect(44, h * 0.72, (w - 100) * 0.7, 8);
    ctx.fillRect(44, h * 0.82, (w - 100) * 0.45, 8);
  });
  const width = o.w || 0.44;
  const height = o.h || width * (300 / 512);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: false,
    toneMapped: false
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.position.set(o.x || 0, o.y || 0, o.z || 0.001);
  mesh.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
  parent.add(mesh);
  return mesh;
}

export function addChevrons(parent, o = {}) {
  const texture = makeTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#121614';
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-PI / 4);
    const stripe = 52;
    for (let i = -12; i < 14; i += 2) {
      ctx.fillStyle = i % 4 === 0 ? '#D6351F' : '#E9EEE9';
      ctx.fillRect(i * stripe - w, -h * 1.4, stripe, h * 2.8);
    }
    ctx.restore();
  });
  const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(o.w || 0.7, o.h || 0.32), material);
  mesh.position.set(o.x || 0, o.y || 0, o.z || 0.001);
  mesh.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
  parent.add(mesh);
  return mesh;
}

export function addValveWheel(parent, o = {}) {
  const metal = o.material || paint(0xC9A227, 0.7, 0.3);
  const group = new THREE.Group();
  group.position.set(o.x || 0, o.y || 0, o.z || 0);
  group.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
  addTorus(group, o.radius || 0.11, 0.016, metal, { seg: 24 });
  addPipe(group, [0, 0, -0.01], [0, 0, 0.01], 0.018, metal);
  addBox(group, (o.radius || 0.11) * 1.7, 0.012, 0.012, metal, { cast: false });
  addBox(group, 0.012, (o.radius || 0.11) * 1.7, 0.012, metal, { cast: false });
  parent.add(group);
  return group;
}

export function addPallet(parent, w, d, material, o = {}) {
  const y = o.y || 0.06;
  addBox(parent, w, 0.12, d, material, { y, edge: true });
  const block = o.block || paint(0x2B322D, 0.2, 0.65);
  const count = o.count || 4;
  for (let i = 0; i < count; i += 1) {
    addBox(parent, w * 0.9, 0.1, 0.12, block, {
      y: 0.17,
      z: -d / 2 + (d / (count - 1)) * i
    });
  }
  return parent;
}

export function disposeObject(root) {
  root.traverse(child => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach(material => {
        if (material.map) material.map.dispose();
        if (material.envMap) material.envMap.dispose();
        material.dispose();
      });
    }
  });
}
