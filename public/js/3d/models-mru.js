// Mobile refuelling unit: cascade truck with cylinder pack and rear dispenser.
import {
  THREE,
  PI,
  paint,
  addBox,
  addCyl,
  addSphere,
  addTorus,
  addPipe,
  addTube,
  addLouvers,
  addBrand,
  addPlate,
  addScreen,
  addChevrons,
  addWheelPair,
  addBolts
} from './kit.js?v=3';

export function buildMRU() {
  const root = new THREE.Group();
  const white = paint(0xe7ebe7, 0.32, 0.42);
  const whiteShade = paint(0xcdd5d0, 0.35, 0.45);
  const dark = paint(0x121815, 0.4, 0.52);
  const black = paint(0x080c0a, 0.2, 0.7);
  const steel = paint(0xaab4af, 0.9, 0.24);
  const chrome = paint(0xd9e0dc, 0.95, 0.16);
  const red = paint(0xd6351f, 0.4, 0.4);
  const orange = paint(0xe25822, 0.25, 0.55);
  const gold = paint(0xf0c553, 0.4, 0.34);
  const glass = paint(0x0a1b23, 0.45, 0.1);
  const headlight = paint(0xf2f6e9, 0.3, 0.2, { emissive: 0xf6f2ce, emissiveIntensity: 0.9 });
  const taillight = paint(0xb31f14, 0.3, 0.3, { emissive: 0xd02a18, emissiveIntensity: 0.7 });
  const beacon = paint(0xc22a1c, 0.2, 0.3, { emissive: 0xff3b22, emissiveIntensity: 1.3 });

  // Chassis and rails
  addBox(root, 4.78, 0.18, 1.5, dark, { x: 0.08, y: 0.73, edge: true });
  addBox(root, 4.62, 0.12, 0.14, black, { x: 0.05, y: 0.64, z: 0.56 });
  addBox(root, 4.62, 0.12, 0.14, black, { x: 0.05, y: 0.64, z: -0.56 });

  // Cab
  addBox(root, 1.32, 0.8, 1.66, white, { x: 1.73, y: 1.25, edge: true, edgeColor: 0x5e6b64 });
  addBox(root, 1.06, 0.5, 1.6, white, { x: 1.65, y: 1.84, edge: true, edgeColor: 0x5e6b64 });
  addBox(root, 1.14, 0.08, 1.7, whiteShade, { x: 1.64, y: 2.11, edge: true });
  addBox(root, 0.05, 0.54, 1.46, glass, { x: 2.17, y: 1.86, rz: -0.18 });
  addBox(root, 0.06, 0.06, 1.5, whiteShade, { x: 2.2, y: 2.09, z: 0 });
  addBox(root, 0.05, 0.72, 1.42, glass, { x: 2.35, y: 1.35 });
  [-1, 1].forEach(side => {
    addBox(root, 0.72, 0.34, 0.03, glass, { x: 1.71, y: 1.87, z: side * 0.807 });
    addBox(root, 0.04, 0.36, 0.04, whiteShade, { x: 1.71, y: 1.87, z: side * 0.812 });
    addBox(root, 0.92, 0.36, 0.03, glass, { x: 1.84, y: 1.3, z: side * 0.837 });
    addBox(root, 0.035, 0.44, 0.03, whiteShade, { x: 1.34, y: 1.32, z: side * 0.84 });
    addBox(root, 0.24, 0.04, 0.05, chrome, { x: 1.52, y: 1.18, z: side * 0.85 });
    addBox(root, 1.28, 0.1, 0.025, red, { x: 1.73, y: 1.03, z: side * 0.84 });
  });

  // Cab front details
  addBox(root, 0.08, 0.34, 1.1, dark, { x: 2.4, y: 1.24 });
  for (let i = 0; i < 4; i += 1) {
    addBox(root, 0.04, 0.03, 1.04, chrome, { x: 2.45, y: 1.12 + i * 0.08 });
  }
  addBox(root, 0.16, 0.2, 1.78, steel, { x: 2.44, y: 0.86, edge: true });
  addBox(root, 0.05, 0.3, 1.7, dark, { x: 2.45, y: 0.69 });
  [-0.58, 0.58].forEach(z => {
    addBox(root, 0.05, 0.16, 0.3, headlight, { x: 2.46, y: 1.04, z });
    addBox(root, 0.02, 0.1, 0.05, gold, { x: 2.49, y: 1.04, z: z * 1.12, cast: false });
  });
  addBox(root, 0.02, 0.1, 1.56, red, { x: 2.42, y: 1.05 });
  addBox(root, 0.22, 0.22, 0.08, dark, { x: 2.43, y: 1.58 });
  addBrand(root, {
    lines: ['CHROMA-ATOR'],
    x: 2.43,
    y: 1.53,
    z: 0,
    ry: PI / 2,
    w: 0.72,
    font: 108
  });

  // Mirrors
  [-1, 1].forEach(side => {
    addPipe(root, [2.1, 1.95, side * 0.82], [2.14, 1.98, side * 1.02], 0.025, dark);
    addBox(root, 0.04, 0.26, 0.16, dark, { x: 2.13, y: 1.92, z: side * 1.06, edge: true });
  });

  // Cab steps and beacons
  [-1, 1].forEach(side => {
    addBox(root, 0.62, 0.06, 0.26, steel, { x: 1.42, y: 0.58, z: side * 0.94 });
    addBox(root, 0.56, 0.05, 0.22, dark, { x: 1.42, y: 0.86, z: side * 0.94 });
  });
  [-0.52, 0.52].forEach(z => {
    addCyl(root, 0.06, 0.06, 0.05, dark, { x: 1.86, y: 2.16, z });
    addSphere(root, 0.06, beacon, { x: 1.86, y: 2.22, z, sy: 0.75 });
  });

  // Rear body
  addBox(root, 2.72, 1.32, 1.78, white, {
    x: -0.64,
    y: 1.48,
    edge: true,
    edgeColor: 0x5e6b64
  });
  addBox(root, 2.8, 0.08, 1.84, whiteShade, { x: -0.64, y: 2.18, edge: true });
  addBox(root, 2.74, 0.15, 1.8, red, { x: -0.64, y: 0.94 });
  addBox(root, 2.74, 0.08, 0.025, red, { x: -0.64, y: 1.12, z: 0.9 });
  addBox(root, 2.74, 0.08, 0.025, red, { x: -0.64, y: 1.12, z: -0.9 });
  [-1, 1].forEach(side => {
    addBox(root, 2.5, 0.86, 0.04, whiteShade, { x: -0.64, y: 1.55, z: side * 0.905 });
    addLouvers(root, 0.68, 0.46, 8, dark, { x: -1.3, y: 1.6, z: side * 0.93 });
    addBox(root, 0.03, 0.5, 0.03, dark, { x: 0.4, y: 1.55, z: side * 0.93 });
    addBox(root, 0.34, 0.05, 0.04, chrome, { x: 0.28, y: 1.3, z: side * 0.93 });
  });
  addBrand(root, {
    lines: ['CHROMA-ATOR', 'MOBILE REFUELLING'],
    x: -0.55,
    y: 1.72,
    z: 0.93,
    w: 1.72
  });
  addBrand(root, {
    lines: ['CHROMA-ATOR', 'CNG CASCADE'],
    x: -0.55,
    y: 1.72,
    z: -0.93,
    ry: PI,
    w: 1.5
  });
  addPlate(root, { text: 'PESO', w: 0.24, x: 0.22, y: 1.38, z: 0.93, font: 74 });

  // Top cylinder cascade
  [-0.48, 0, 0.48].forEach(z => {
    addCyl(root, 0.16, 0.16, 1.92, steel, { x: -0.58, y: 2.34, z, axis: 'x', seg: 26 });
    addTorus(root, 0.162, 0.025, red, { x: 0.1, y: 2.34, z, ry: PI / 2, seg: 24 });
    addTorus(root, 0.162, 0.025, red, { x: -1.2, y: 2.34, z, ry: PI / 2, seg: 24 });
    addCyl(root, 0.05, 0.05, 0.12, chrome, { x: 0.41, y: 2.34, z, axis: 'x', seg: 14 });
    addBox(root, 0.12, 0.06, 0.24, dark, { x: 0.48, y: 2.3, z });
  });
  addBox(root, 2.0, 0.07, 0.08, dark, { x: -0.58, y: 2.48, z: 0.68 });
  addBox(root, 2.0, 0.07, 0.08, dark, { x: -0.58, y: 2.48, z: -0.68 });
  [-1.45, 0.3].forEach(x => {
    addBox(root, 0.08, 0.34, 1.44, dark, { x, y: 2.28 });
  });

  // Rear dispenser, hose reel and lights
  addBox(root, 0.1, 0.6, 0.66, dark, { x: -2.02, y: 1.55, z: 0.42, edge: true });
  addScreen(root, { w: 0.38, h: 0.22, x: -2.075, y: 1.68, z: 0.42, ry: -PI / 2, value: '0.00', unit: 'kg' });
  addBox(root, 0.08, 0.02, 0.5, gold, { x: -2.075, y: 1.5, z: 0.42 });
  addChevrons(root, { w: 0.9, h: 0.4, x: -2.01, y: 1.18, z: -0.18, ry: -PI / 2 });
  addBox(root, 0.08, 0.08, 0.72, red, { x: -2.01, y: 0.94, z: -0.56 });
  addCyl(root, 0.27, 0.27, 0.18, dark, { x: -2.08, y: 1.28, z: -0.5, axis: 'x', seg: 24 });
  addTorus(root, 0.29, 0.032, orange, { x: -2.16, y: 1.28, z: -0.5, ry: PI / 2, seg: 28 });
  addTorus(root, 0.29, 0.032, orange, { x: -2.2, y: 1.28, z: -0.5, ry: PI / 2, seg: 28 });
  addTube(root, [[-2.1, 1.05, -0.46], [-2.06, 0.8, -0.3], [-1.96, 0.66, -0.1], [-1.88, 0.58, 0.06]], 0.03, orange);
  addCyl(root, 0.07, 0.07, 0.2, dark, { x: -1.84, y: 0.58, z: 0.1, rz: 0.5, seg: 14 });
  addBox(root, 0.12, 0.18, 0.1, dark, { x: -1.84, y: 0.48, z: 0.14, edge: true });
  [-1, 1].forEach(side => {
    addBox(root, 0.04, 0.16, 0.26, taillight, { x: -2.04, y: 1.02, z: side * 0.62 });
  });
  addBox(root, 0.12, 0.12, 1.7, steel, { x: -2.3, y: 0.53 });
  addBox(root, 0.06, 0.32, 0.6, dark, { x: -2.32, y: 0.65, z: 0.5 });

  // Fuel tank and exhaust
  addCyl(root, 0.21, 0.21, 0.86, steel, { x: 0.42, y: 0.56, z: -0.72, axis: 'x', seg: 22 });
  addCyl(root, 0.08, 0.08, 0.34, dark, { x: 1.05, y: 0.48, z: 0.5, seg: 16 });
  addCyl(root, 0.055, 0.055, 1.2, darkSteelSafe(), { x: 1.05, y: 1.5, z: 0.68, seg: 16 });

  // Wheels
  addWheelPair(root, 1.72, 0.86, { radius: 0.4, width: 0.28 });
  addWheelPair(root, -0.76, 0.86, { radius: 0.4, width: 0.28 });
  addWheelPair(root, -1.52, 0.86, { radius: 0.4, width: 0.28 });
  [-1, 1].forEach(side => {
    addBox(root, 0.92, 0.06, 0.3, whiteShade, { x: -1.14, y: 0.98, z: side * 0.86 });
  });

  // Front number plate
  addBox(root, 0.03, 0.12, 0.38, paint(0xe8e4cd, 0.2, 0.6), { x: 2.49, y: 0.78, z: 0 });

  root.userData.kind = 'mru';
  return root;
}

function darkSteelSafe() {
  return paint(0x39423d, 0.75, 0.38);
}
