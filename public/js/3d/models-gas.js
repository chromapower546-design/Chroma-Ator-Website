// Gas-refuelling models: dual-fuel system skid and composite dispensing unit.
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
  addValveWheel,
  addBolts,
  addEdges
} from './kit.js?v=3';

export function buildDFS() {
  const root = new THREE.Group();
  const dark = paint(0x141a17, 0.45, 0.52);
  const iron = paint(0x2a322e, 0.78, 0.44);
  const steel = paint(0xaab4af, 0.88, 0.24);
  const chrome = paint(0xd9e0dc, 0.95, 0.16);
  const orange = paint(0xe25822, 0.25, 0.55);
  const green = paint(0x0e7a3c, 0.4, 0.38);
  const black = paint(0x0b0f0d, 0.1, 0.85);
  const gold = paint(0xd9a21b, 0.55, 0.32);
  const gaugeFace = paint(0xf1f4f0, 0.05, 0.6);
  const gaugeRim = paint(0x1a211d, 0.6, 0.4);

  // Skid frame
  addBox(root, 2.32, 0.14, 1.16, iron, { y: 0.08, edge: true });
  addBox(root, 2.2, 0.1, 0.14, dark, { y: 0.17, z: 0.44 });
  addBox(root, 2.2, 0.1, 0.14, dark, { y: 0.17, z: -0.44 });
  [-1.0, 1.0].forEach(x => {
    [-0.42, 0.42].forEach(z => {
      addBox(root, 0.2, 0.12, 0.2, dark, { x, y: 0.04, z });
    });
  });
  [-1.05, 1.05].forEach(x => {
    addBox(root, 0.12, 0.06, 1.02, gold, { x, y: 0.19, z: 0, cast: false });
  });

  // Intake runner with end flanges
  addCyl(root, 0.15, 0.15, 1.42, steel, { y: 0.84, axis: 'x', seg: 26 });
  addCyl(root, 0.19, 0.19, 0.07, iron, { x: -0.71, y: 0.84, axis: 'x', seg: 26 });
  addCyl(root, 0.19, 0.19, 0.07, iron, { x: 0.71, y: 0.84, axis: 'x', seg: 26 });
  [-0.56, 0.56].forEach(x => {
    addBox(root, 0.16, 0.48, 0.3, iron, { x, y: 0.48, z: 0, edge: true });
    addBox(root, 0.24, 0.08, 0.36, dark, { x, y: 0.23, z: 0 });
  });
  addBox(root, 1.3, 0.05, 0.18, dark, { y: 1.0, z: -0.34 });
  addBrand(root, {
    lines: ['CHROMA-ATOR', 'DUAL FUEL'],
    x: -0.1,
    y: 0.88,
    z: 0.153,
    w: 1.1
  });

  // Injector rail
  addCyl(root, 0.062, 0.062, 1.28, steel, { y: 1.44, axis: 'x', seg: 20 });
  addCyl(root, 0.08, 0.08, 0.06, gold, { x: 0.65, y: 1.44, axis: 'x', seg: 18 });
  const injectors = [-0.45, -0.15, 0.15, 0.45];
  injectors.forEach(x => {
    addCyl(root, 0.05, 0.05, 0.18, iron, { x, y: 1.32, seg: 16 });
    addCyl(root, 0.06, 0.06, 0.07, orange, { x, y: 1.44, seg: 16 });
    addPipe(root, [x, 1.23, 0], [x, 1.0, 0], 0.018, steel);
    addCyl(root, 0.028, 0.028, 0.04, chrome, { x, y: 1.02, seg: 10 });
  });
  addBox(root, 0.08, 0.26, 0.08, iron, { x: -0.68, y: 1.29 });
  addBox(root, 0.08, 0.26, 0.08, iron, { x: 0.68, y: 1.29 });

  // ECU controller on a post
  addBox(root, 0.07, 0.98, 0.07, dark, { x: -0.88, y: 0.55, z: -0.4 });
  addBox(root, 0.54, 0.44, 0.26, paint(0x1d2622, 0.5, 0.42), {
    x: -0.88,
    y: 1.55,
    z: -0.4,
    edge: true
  });
  addBox(root, 0.5, 0.4, 0.02, dark, { x: -0.88, y: 1.55, z: -0.26 });
  addScreen(root, { w: 0.34, h: 0.2, x: -0.88, y: 1.61, z: -0.247, value: 'DF', unit: 'ECU' });
  addCyl(root, 0.026, 0.026, 0.04, paint(0x47e08c, 0.2, 0.5), {
    x: -0.7,
    y: 1.68,
    z: -0.245,
    axis: 'z'
  });
  addCyl(root, 0.026, 0.026, 0.04, paint(0xc0392b, 0.2, 0.5), {
    x: -0.7,
    y: 1.6,
    z: -0.245,
    axis: 'z'
  });
  addPlate(root, { text: 'ECU', w: 0.14, x: -1.0, y: 1.42, z: -0.245, font: 74 });

  // Pressure regulator and gauge
  addBox(root, 0.22, 0.3, 0.18, iron, { x: 0.78, y: 1.18, z: -0.32 });
  addCyl(root, 0.17, 0.17, 0.46, steel, { x: 0.78, y: 1.12, z: -0.32, seg: 22 });
  addCyl(root, 0.2, 0.2, 0.05, iron, { x: 0.78, y: 1.37, z: -0.32, seg: 22 });
  addCyl(root, 0.2, 0.2, 0.05, iron, { x: 0.78, y: 0.87, z: -0.32, seg: 22 });
  addCyl(root, 0.11, 0.11, 0.035, gaugeRim, { x: 0.78, y: 1.28, z: -0.135, axis: 'z', seg: 24 });
  addCyl(root, 0.09, 0.09, 0.02, gaugeFace, { x: 0.78, y: 1.28, z: -0.115, axis: 'z', seg: 24 });
  addBox(root, 0.012, 0.075, 0.008, paint(0x222222, 0.2, 0.6), {
    x: 0.805,
    y: 1.31,
    z: -0.104,
    rz: -0.7,
    cast: false
  });
  addValveWheel(root, { x: 0.78, y: 0.79, z: -0.1, radius: 0.08, rz: 0 });

  // Gas cylinder
  addCyl(root, 0.22, 0.22, 0.95, green, { x: 0.98, y: 0.62, z: 0.32, seg: 26 });
  addSphere(root, 0.22, green, { x: 0.98, y: 1.1, z: 0.32, sy: 0.55 });
  addCyl(root, 0.07, 0.07, 0.14, steel, { x: 0.98, y: 1.24, z: 0.32, seg: 16 });
  addCyl(root, 0.1, 0.1, 0.035, gold, { x: 0.98, y: 1.32, z: 0.32, seg: 16 });
  addTorus(root, 0.11, 0.014, steel, { x: 0.98, y: 1.25, z: 0.32, rx: PI / 2, seg: 20 });
  addBox(root, 0.4, 0.05, 0.4, dark, { x: 0.98, y: 0.16, z: 0.32 });
  addPipe(root, [0.98, 0.62, 0.54], [0.98, 0.62, 0.62], 0.03, steel);
  addPipe(root, [0.98, 0.62, 0.62], [0.9, 1.07, 0.62], 0.03, steel);
  addPipe(root, [0.9, 1.07, 0.62], [0.78, 1.12, 0.02], 0.03, steel);

  // Orange gas hose coil
  addBox(root, 0.06, 0.7, 0.06, dark, { x: -1.03, y: 0.55, z: 0.32 });
  addCyl(root, 0.06, 0.06, 0.22, iron, { x: -0.99, y: 1.04, z: 0.32, axis: 'z', seg: 14 });
  addTorus(root, 0.26, 0.035, orange, { x: -1.0, y: 1.03, z: 0.38, seg: 28 });
  addTorus(root, 0.26, 0.035, orange, { x: -1.0, y: 1.03, z: 0.43, seg: 28 });
  addTorus(root, 0.26, 0.035, orange, { x: -1.0, y: 1.03, z: 0.48, seg: 28 });
  addTube(root, [[-0.74, 1.18, 0.49], [-0.35, 1.38, 0.42], [-0.05, 1.46, 0.16], [0.3, 1.46, 0.04]], 0.032, orange);
  addTube(root, [[-0.72, 0.9, 0.49], [-0.52, 0.73, 0.58], [-0.2, 0.66, 0.62]], 0.032, orange);
  addCyl(root, 0.06, 0.06, 0.14, chrome, { x: -0.15, y: 0.65, z: 0.63, axis: 'x', seg: 14 });

  // Wiring harness and sensors
  addTube(root, [[-0.88, 1.33, -0.3], [-0.82, 1.21, -0.1], [-0.6, 1.22, 0.04], [-0.45, 1.22, 0.02]], 0.022, black);
  addTube(root, [[-0.63, 1.22, 0], [-0.3, 1.22, 0], [0.0, 1.22, 0], [0.45, 1.22, 0]], 0.018, black);
  addBox(root, 0.12, 0.09, 0.1, dark, { x: 0.12, y: 1.55, z: 0.26 });
  addPipe(root, [0.12, 1.5, 0.26], [0.12, 1.3, 0.2], 0.012, steel);
  addBox(root, 0.08, 0.06, 0.08, gold, { x: 0.12, y: 1.25, z: 0.2, cast: false });

  // Small pressure gauge on the rail
  addCyl(root, 0.075, 0.075, 0.03, gaugeRim, { x: 0.63, y: 1.44, z: 0.09, axis: 'z', seg: 20 });
  addCyl(root, 0.06, 0.06, 0.015, gaugeFace, { x: 0.63, y: 1.44, z: 0.108, axis: 'z', seg: 20 });

  root.userData.kind = 'dfs';
  return root;
}

export function buildCDU() {
  const root = new THREE.Group();
  const shell = paint(0xb7bfba, 0.55, 0.36);
  const shellDark = paint(0x7f8a84, 0.6, 0.4);
  const dark = paint(0x111713, 0.4, 0.5);
  const black = paint(0x070b09, 0.25, 0.62);
  const yellow = paint(0xdfa211, 0.45, 0.4);
  const gold = paint(0xf0c553, 0.4, 0.34);
  const steel = paint(0xaab4af, 0.88, 0.24);
  const chrome = paint(0xd8dfdb, 0.95, 0.16);
  const orange = paint(0xd9661f, 0.3, 0.55);
  const glass = paint(0x0a1d15, 0.5, 0.1);

  // Skid and feet
  addBox(root, 1.34, 0.14, 1.16, dark, { y: 0.08, edge: true });
  addBox(root, 1.22, 0.08, 1.04, black, { y: 0.18 });
  [-0.5, 0.5].forEach(x => {
    [-0.42, 0.42].forEach(z => {
      addBox(root, 0.18, 0.1, 0.18, black, { x, y: 0.04, z });
    });
  });

  // Cabinet
  addBox(root, 1.02, 1.94, 0.96, shell, { y: 1.17, edge: true, edgeColor: 0x414c46, edgeOpacity: 0.45 });
  addBox(root, 1.14, 0.14, 1.08, shellDark, { y: 2.21, edge: true });
  addBox(root, 1.08, 0.06, 1.02, black, { y: 2.3 });
  addBox(root, 0.82, 0.28, 0.74, shellDark, { y: 2.44, edge: true });
  addLouvers(root, 0.6, 0.16, 5, dark, { x: 0, y: 2.44, z: 0.375 });
  addBox(root, 0.86, 0.05, 0.78, dark, { y: 2.59 });

  // Yellow dispensing door
  addBox(root, 0.8, 1.68, 0.055, yellow, {
    y: 1.16,
    z: 0.49,
    edge: true,
    edgeColor: 0x6b4b05,
    edgeOpacity: 0.5
  });
  addBox(root, 0.72, 0.04, 0.02, gold, { y: 0.96, z: 0.523 });
  addBox(root, 0.72, 0.04, 0.02, gold, { y: 0.38, z: 0.523 });

  // Hinges and handle
  [0.52, 1.12, 1.72].forEach(y => {
    addBox(root, 0.05, 0.16, 0.05, steel, { x: -0.4, y, z: 0.53 });
    addCyl(root, 0.018, 0.018, 0.18, chrome, { x: -0.4, y, z: 0.53, seg: 10 });
  });
  addBox(root, 0.04, 0.36, 0.06, chrome, { x: 0.34, y: 1.13, z: 0.545 });
  addBox(root, 0.04, 0.05, 0.1, chrome, { x: 0.34, y: 0.98, z: 0.53 });
  addBox(root, 0.04, 0.05, 0.1, chrome, { x: 0.34, y: 1.28, z: 0.53 });

  // Display head
  addBox(root, 0.64, 0.48, 0.1, dark, { y: 1.72, z: 0.53, edge: true });
  addBox(root, 0.58, 0.42, 0.02, black, { y: 1.72, z: 0.585 });
  addScreen(root, { w: 0.38, h: 0.22, x: 0, y: 1.77, z: 0.599, value: '0.00', unit: 'kg' });
  addBox(root, 0.5, 0.04, 0.015, gold, { y: 1.59, z: 0.599 });

  // Keypad
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      addBox(root, 0.1, 0.048, 0.022, row === 3 && col === 2 ? gold : steel, {
        x: -0.11 + col * 0.11,
        y: 1.45 - row * 0.075,
        z: 0.59,
        cast: false
      });
    }
  }

  // Card reader and emergency stop
  addBox(root, 0.2, 0.07, 0.03, black, { x: 0.24, y: 1.56, z: 0.592 });
  addBox(root, 0.16, 0.012, 0.01, paint(0x47e08c, 0.2, 0.5), {
    x: 0.24,
    y: 1.56,
    z: 0.609,
    cast: false
  });
  addCyl(root, 0.07, 0.07, 0.035, paint(0xa3261b, 0.3, 0.42), {
    x: 0.28,
    y: 1.9,
    z: 0.58,
    axis: 'z',
    seg: 22
  });
  addCyl(root, 0.052, 0.052, 0.02, paint(0xe04a34, 0.2, 0.4), {
    x: 0.28,
    y: 1.9,
    z: 0.6,
    axis: 'z',
    seg: 22
  });

  // Lower ventilation
  addLouvers(root, 0.6, 0.3, 8, dark, { x: 0, y: 0.6, z: 0.525 });
  addBox(root, 0.14, 0.18, 0.02, paint(0xe9eee9, 0.2, 0.5), { x: -0.3, y: 0.46, z: 0.525 });
  addPlate(root, { text: 'PESO', w: 0.18, x: 0.25, y: 0.46, z: 0.526, font: 74 });

  // Branding
  addBrand(root, {
    lines: ['CHROMA-ATOR'],
    x: 0,
    y: 2.08,
    z: 0.523,
    w: 0.72,
    font: 104
  });
  addBrand(root, {
    lines: ['CDU', 'COMPOSITE DISPENSING'],
    x: 0,
    y: 2.44,
    z: 0.377,
    w: 0.52,
    font: 152
  });
  addPlate(root, { text: 'CDU 200-45', w: 0.3, x: -0.22, y: 0.33, z: 0.523, font: 46 });

  // Roof beacon
  addCyl(root, 0.055, 0.055, 0.05, black, { x: 0.32, y: 2.63, seg: 16 });
  addSphere(root, 0.055, paint(0x2ee27f, 0.2, 0.3, { emissive: 0x1fc46a, emissiveIntensity: 1.4 }), {
    x: 0.32,
    y: 2.69,
    z: 0,
    sy: 0.8
  });

  // Side hose reel
  addBox(root, 0.12, 0.42, 0.3, shellDark, { x: 0.58, y: 1.16, z: 0.06, edge: true });
  addCyl(root, 0.25, 0.25, 0.16, dark, { x: 0.69, y: 1.16, z: 0.06, axis: 'x', seg: 26 });
  addTorus(root, 0.28, 0.032, orange, { x: 0.73, y: 1.16, z: 0.06, ry: PI / 2, seg: 30 });
  addTorus(root, 0.28, 0.032, orange, { x: 0.77, y: 1.16, z: 0.06, ry: PI / 2, seg: 30 });
  addTorus(root, 0.28, 0.032, orange, { x: 0.81, y: 1.16, z: 0.06, ry: PI / 2, seg: 30 });
  addCyl(root, 0.1, 0.1, 0.06, chrome, { x: 0.84, y: 1.16, z: 0.06, axis: 'x', seg: 20 });
  addTube(root, [[0.72, 0.9, 0.14], [0.66, 0.62, 0.34], [0.58, 0.42, 0.46], [0.5, 0.28, 0.48]], 0.028, orange);
  addCyl(root, 0.075, 0.075, 0.22, dark, { x: 0.47, y: 0.33, z: 0.48, rz: 0.45, seg: 14 });
  addBox(root, 0.12, 0.2, 0.1, shellDark, { x: 0.5, y: 0.36, z: 0.52, edge: true });
  addBox(root, 0.03, 0.16, 0.03, gold, { x: 0.43, y: 0.47, z: 0.47, rz: 0.4 });

  // Rear service connections
  addBox(root, 0.62, 0.34, 0.14, dark, { y: 0.48, z: -0.55, edge: true });
  addCyl(root, 0.045, 0.045, 0.16, steel, { x: -0.2, y: 0.5, z: -0.64, axis: 'z', seg: 14 });
  addCyl(root, 0.045, 0.045, 0.16, steel, { x: 0, y: 0.5, z: -0.64, axis: 'z', seg: 14 });
  addCyl(root, 0.045, 0.045, 0.16, gold, { x: 0.2, y: 0.5, z: -0.64, axis: 'z', seg: 14 });
  addPipe(root, [-0.24, 0.36, -0.6], [-0.24, 1.4, -0.55], 0.026, steel);
  addPipe(root, [0.24, 0.36, -0.6], [0.24, 1.4, -0.55], 0.026, steel);
  addValveWheel(root, { x: -0.24, y: 1.28, z: -0.51, radius: 0.08, ry: 0 });
  addValveWheel(root, { x: 0.24, y: 1.28, z: -0.51, radius: 0.08, ry: 0 });

  root.userData.kind = 'cdu';
  return root;
}
