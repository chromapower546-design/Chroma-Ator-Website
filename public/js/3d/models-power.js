// Power-generation models: acoustic gas generator set and open gas engine.
import {
  THREE,
  PI,
  paint,
  addBox,
  addCyl,
  addTorus,
  addPipe,
  addTube,
  addLouvers,
  addBrand,
  addPlate,
  addScreen,
  addValveWheel,
  addBolts
} from './kit.js?v=3';

export function buildGenerator() {
  const root = new THREE.Group();
  const green = paint(0x0d6d35, 0.4, 0.38);
  const greenDeep = paint(0x084525, 0.45, 0.46);
  const black = paint(0x101614, 0.3, 0.55);
  const dark = paint(0x080d0a, 0.3, 0.6);
  const steel = paint(0xa7b1ac, 0.88, 0.24);
  const darkSteel = paint(0x3b4640, 0.78, 0.34);
  const gold = paint(0xd9a21b, 0.55, 0.32);
  const glass = paint(0x0b1d16, 0.45, 0.12);

  // Transport skid
  addBox(root, 4.58, 0.16, 1.98, darkSteel, { y: 0.1, edge: true });
  addBox(root, 4.3, 0.1, 1.8, black, { y: 0.23 });
  [-1.72, 1.72].forEach(x => {
    [-0.76, 0.76].forEach(z => {
      addBox(root, 0.3, 0.14, 0.28, dark, { x, y: 0.05, z });
    });
  });
  [-1.15, 1.15].forEach(x => {
    addBox(root, 0.52, 0.14, 1.84, dark, { x, y: 0.15 });
  });

  // Acoustic enclosure
  addBox(root, 4.2, 1.74, 1.7, green, {
    y: 1.16,
    edge: true,
    edgeColor: 0x03200f,
    edgeOpacity: 0.42
  });
  addBox(root, 4.34, 0.14, 1.8, greenDeep, { y: 2.08, edge: true });
  addBox(root, 4.36, 0.05, 1.82, black, { y: 1.99 });

  // Corner trim
  [-2.06, 2.06].forEach(x => {
    [-0.83, 0.83].forEach(z => {
      addBox(root, 0.055, 1.68, 0.055, greenDeep, { x, y: 1.16, z });
    });
  });

  // Panel seams and lower band
  [-1.45, 0.05, 1.0].forEach(x => {
    addBox(root, 0.026, 1.6, 0.014, dark, { x, y: 1.14, z: 0.856 });
    addBox(root, 0.026, 1.6, 0.014, dark, { x, y: 1.14, z: -0.856 });
  });
  addBox(root, 4.16, 0.055, 0.02, gold, { y: 0.46, z: 0.862 });
  addBox(root, 4.16, 0.055, 0.02, gold, { y: 0.46, z: -0.862 });

  // Louvered ventilation doors
  addLouvers(root, 0.86, 0.82, 13, darkSteel, { x: -1.05, y: 1.02, z: 0.874 });
  addLouvers(root, 0.72, 0.82, 12, darkSteel, { x: -0.2, y: 1.02, z: 0.874 });
  addLouvers(root, 1.25, 0.76, 12, darkSteel, { x: -0.35, y: 1.06, z: -0.874 });

  // Door handles and hinges
  [-1.5, -0.58, 0.1].forEach(x => {
    addBox(root, 0.035, 0.34, 0.05, steel, { x, y: 1.18, z: 0.892 });
    addBox(root, 0.04, 0.06, 0.07, steel, { x, y: 1.05, z: 0.896 });
    addBox(root, 0.04, 0.06, 0.07, steel, { x, y: 1.31, z: 0.896 });
  });

  // Control panel
  addBox(root, 0.66, 0.6, 0.07, dark, { x: 1.46, y: 1.44, z: 0.87, edge: true });
  addBox(root, 0.58, 0.5, 0.02, paint(0x1c2420, 0.4, 0.4), { x: 1.46, y: 1.44, z: 0.906 });
  addScreen(root, { w: 0.42, h: 0.22, x: 1.46, y: 1.52, z: 0.918, value: '400', unit: 'kVA' });
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      addBox(root, 0.07, 0.035, 0.02, col === 0 && row === 0 ? gold : steel, {
        x: 1.25 + col * 0.13,
        y: 1.33 - row * 0.08,
        z: 0.92,
        cast: false
      });
    }
  }
  addCyl(root, 0.035, 0.035, 0.035, paint(0xc0392b, 0.3, 0.4), {
    x: 1.69,
    y: 1.34,
    z: 0.918,
    axis: 'z'
  });
  addPlate(root, { text: 'PESO', w: 0.16, x: 1.46, y: 1.18, z: 0.912, font: 74 });

  // Branding
  addBrand(root, {
    lines: ['CHROMA-ATOR', 'GAS POWER SYSTEMS'],
    x: -0.7,
    y: 1.78,
    z: 0.865,
    w: 1.66
  });
  addBrand(root, {
    lines: ['CHROMA-ATOR'],
    x: -0.5,
    y: 1.5,
    z: -0.865,
    ry: PI,
    w: 1.3
  });

  // Radiator end
  addBox(root, 0.16, 1.44, 1.62, darkSteel, { x: 2.11, y: 1.14, edge: true });
  addBox(root, 0.08, 1.22, 1.44, dark, { x: 2.19, y: 1.14 });
  for (let i = 0; i < 11; i += 1) {
    addBox(root, 0.028, 1.2, 0.03, steel, {
      x: 2.245,
      y: 1.14,
      z: -0.65 + i * 0.13,
      cast: false
    });
  }
  addBox(root, 0.2, 0.1, 1.64, gold, { x: 2.12, y: 1.9 });
  addCyl(root, 0.1, 0.1, 0.18, steel, { x: 2.12, y: 2.16, z: 0.58, seg: 16 });

  // Exhaust stack
  addCyl(root, 0.1, 0.1, 1.34, darkSteel, { x: -1.72, y: 2.74, z: -0.42, seg: 20 });
  addCyl(root, 0.14, 0.14, 0.08, dark, { x: -1.72, y: 2.16, z: -0.42, seg: 20 });
  addCyl(root, 0.13, 0.13, 0.06, dark, { x: -1.72, y: 3.12, z: -0.42, seg: 20 });
  addCyl(root, 0.03, 0.18, 0.18, darkSteel, { x: -1.72, y: 3.34, z: -0.42, seg: 20 });
  addCyl(root, 0.19, 0.19, 0.035, dark, { x: -1.72, y: 3.43, z: -0.42, seg: 20 });
  addBox(root, 0.06, 0.72, 0.06, darkSteel, { x: -1.55, y: 2.42, z: -0.42, rz: -0.5 });

  // Roof lifting eyes and vents
  [-1.55, 1.55].forEach(x => {
    [-0.62, 0.62].forEach(z => {
      addTorus(root, 0.065, 0.013, steel, { x, y: 2.18, z, rx: PI / 2, seg: 18 });
    });
  });
  addBox(root, 0.7, 0.07, 0.44, darkSteel, { x: 0.35, y: 2.16, z: 0.18, edge: true });
  addLouvers(root, 0.56, 0.24, 7, steel, { x: 0.35, y: 2.22, z: 0.18, rx: -PI / 2 });

  // Gas train and valves on the front face
  addPipe(root, [-1.95, 0.63, 0.9], [0.55, 0.63, 0.9], 0.036, steel);
  addPipe(root, [-1.95, 0.52, 0.79], [0.55, 0.52, 0.79], 0.028, steel);
  addValveWheel(root, { x: -1.55, y: 0.65, z: 0.93, radius: 0.1 });
  addValveWheel(root, { x: -0.1, y: 0.65, z: 0.93, radius: 0.09 });
  addCyl(root, 0.07, 0.07, 0.16, darkSteel, { x: 0.55, y: 0.58, z: 0.86, axis: 'z' });
  addPipe(root, [0.58, 0.58, 0.94], [0.58, 0.9, 1.02], 0.028, steel);
  addCyl(root, 0.09, 0.09, 0.05, gold, { x: 0.58, y: 0.95, z: 1.02, axis: 'z' });

  // Side inspection hatches
  addBox(root, 0.64, 0.42, 0.03, greenDeep, { x: 1.55, y: 0.86, z: 0.87, edge: true });
  addBolts(root, [[1.28, 0.7, 0.888], [1.82, 0.7, 0.888], [1.28, 1.02, 0.888], [1.82, 1.02, 0.888]], 0.016, steel);

  // Misc. details
  addBox(root, 0.28, 0.2, 0.16, dark, { x: -2.08, y: 0.78, z: 0.6 });
  addCyl(root, 0.03, 0.03, 0.3, steel, { x: -2.08, y: 0.98, z: 0.6 });
  addBox(root, 0.02, 0.16, 0.22, gold, { x: 2.255, y: 0.64, z: -0.55 });
  addBox(root, 0.02, 0.24, 0.3, paint(0xd8d28a, 0.2, 0.6), { x: 2.255, y: 0.92, z: 0.55 });

  root.userData.kind = 'generator';
  return root;
}

export function buildEngine() {
  const root = new THREE.Group();
  const iron = paint(0x252c28, 0.82, 0.5);
  const ironDark = paint(0x161c19, 0.78, 0.56);
  const green = paint(0x0d6d35, 0.48, 0.4);
  const steel = paint(0xaeb8b3, 0.9, 0.24);
  const chrome = paint(0xd8dfdb, 0.95, 0.14);
  const copper = paint(0xb87333, 0.85, 0.3);
  const rubber = paint(0x101412, 0.05, 0.9);
  const gold = paint(0xd9a21b, 0.55, 0.32);

  // Skid and feet
  addBox(root, 2.72, 0.16, 1.14, ironDark, { y: 0.09, edge: true });
  addBox(root, 2.5, 0.12, 0.16, iron, { y: 0.2, z: 0.45 });
  addBox(root, 2.5, 0.12, 0.16, iron, { y: 0.2, z: -0.45 });
  [-1.08, 1.08].forEach(x => {
    [-0.44, 0.44].forEach(z => {
      addBox(root, 0.24, 0.14, 0.22, ironDark, { x, y: 0.04, z });
    });
  });

  // Crankcase, block and oil pan
  addBox(root, 1.92, 0.34, 0.74, iron, { y: 0.4, edge: true });
  addBox(root, 2.02, 0.5, 0.82, iron, { y: 0.83, edge: true });
  addBox(root, 1.76, 0.46, 0.68, iron, { y: 1.27, edge: true });
  addBox(root, 0.74, 0.26, 0.035, steel, { x: -0.08, y: 0.82, z: 0.43, edge: true });
  addBolts(root, [[-0.4, 0.72, 0.45], [0.24, 0.72, 0.45], [-0.4, 0.92, 0.45], [0.24, 0.92, 0.45]], 0.018, chrome);
  addCyl(root, 0.08, 0.08, 0.08, steel, { x: -0.3, y: 0.24, z: 0, axis: 'y' });

  // Cylinder head and green valve covers
  addBox(root, 1.68, 0.16, 0.62, iron, { y: 1.58 });
  const cylinders = [-0.63, -0.21, 0.21, 0.63];
  cylinders.forEach(x => {
    addBox(root, 0.32, 0.2, 0.58, iron, { x, y: 1.75, edge: true });
    addBox(root, 0.29, 0.14, 0.53, green, { x, y: 1.92, edge: true });
    for (let rib = 0; rib < 3; rib += 1) {
      addBox(root, 0.022, 0.05, 0.5, paint(0x0a5128, 0.4, 0.5), {
        x: x - 0.09 + rib * 0.09,
        y: 2.0,
        cast: false
      });
    }
    addPipe(root, [x, 1.98, 0.27], [x, 1.62, 0.34], 0.012, copper);
    addCyl(root, 0.034, 0.034, 0.06, steel, { x, y: 2.01, z: -0.2, seg: 12 });
  });

  // Flywheel housing and flywheel
  addCyl(root, 0.47, 0.47, 0.26, iron, { x: -1.09, y: 0.95, axis: 'x', seg: 30, edge: true });
  addTorus(root, 0.42, 0.032, green, { x: -1.23, y: 0.95, ry: PI / 2, seg: 30 });
  addCyl(root, 0.33, 0.33, 0.09, steel, { x: -1.27, y: 0.95, axis: 'x', seg: 28 });
  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * PI * 2;
    addCyl(root, 0.026, 0.026, 0.05, chrome, {
      x: -1.32,
      y: 0.95 + Math.sin(angle) * 0.25,
      z: Math.cos(angle) * 0.25,
      axis: 'x',
      seg: 8,
      cast: false
    });
  }
  addBox(root, 0.16, 0.55, 0.16, iron, { x: -1.16, y: 0.32, z: 0.5, rz: 0.16 });
  addBox(root, 0.16, 0.55, 0.16, iron, { x: -1.16, y: 0.32, z: -0.5, rz: 0.16 });

  // Radiator and fan
  addBox(root, 0.16, 1.18, 0.96, ironDark, { x: 1.36, y: 1.0, edge: true });
  addBox(root, 0.08, 0.92, 0.8, iron, { x: 1.44, y: 1.0 });
  for (let i = 0; i < 9; i += 1) {
    addBox(root, 0.02, 0.9, 0.028, steel, {
      x: 1.49,
      y: 1.0,
      z: -0.35 + i * 0.088,
      cast: false
    });
  }
  addBox(root, 0.18, 0.14, 0.96, steel, { x: 1.36, y: 1.64 });
  addBox(root, 0.18, 0.14, 0.96, steel, { x: 1.36, y: 0.36 });
  addCyl(root, 0.37, 0.37, 0.1, ironDark, { x: 1.26, y: 1.0, axis: 'x', seg: 28, open: true });
  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * PI * 2;
    addBox(root, 0.025, 0.3, 0.1, steel, {
      x: 1.25,
      y: 1.0 + Math.sin(angle) * 0.19,
      z: Math.cos(angle) * 0.19,
      rx: angle,
      cast: false
    });
  }
  addTube(root, [[1.34, 1.66, 0.3], [1.16, 1.7, 0.38], [0.88, 1.6, 0.38]], 0.045, rubber);
  addTube(root, [[1.34, 0.38, 0.3], [1.16, 0.4, 0.38], [0.9, 0.5, 0.38]], 0.042, rubber);

  // Intake and exhaust manifolds
  addCyl(root, 0.115, 0.115, 1.56, steel, { x: 0.08, y: 1.48, z: -0.43, axis: 'x', seg: 20 });
  cylinders.forEach(x => {
    addPipe(root, [x, 1.5, -0.4], [x, 1.7, -0.2], 0.042, steel);
  });
  addCyl(root, 0.14, 0.14, 0.34, steel, { x: 0.96, y: 1.5, z: -0.46, axis: 'x', seg: 18 });
  addCyl(root, 0.2, 0.2, 0.28, ironDark, { x: 1.16, y: 1.5, z: -0.46, axis: 'x', seg: 20 });
  addCyl(root, 0.125, 0.125, 1.46, ironDark, { x: 0.02, y: 1.62, z: 0.42, axis: 'x', seg: 20 });
  cylinders.forEach(x => {
    addPipe(root, [x, 1.64, 0.4], [x, 1.78, 0.22], 0.044, ironDark);
  });
  addBox(root, 1.5, 0.06, 0.26, paint(0x6f5a2a, 0.7, 0.35), { x: 0.02, y: 1.82, z: 0.42 });

  // Turbocharger and exhaust stack
  addCyl(root, 0.22, 0.22, 0.22, steel, { x: -0.9, y: 1.64, z: 0.48, axis: 'z', seg: 24 });
  addTorus(root, 0.27, 0.075, ironDark, { x: -0.9, y: 1.64, z: 0.58, seg: 24 });
  addCyl(root, 0.07, 0.07, 0.3, steel, { x: -0.9, y: 1.88, z: 0.48 });
  addCyl(root, 0.075, 0.075, 1.15, ironDark, { x: -1.05, y: 2.36, z: 0.48, seg: 20 });
  addCyl(root, 0.03, 0.14, 0.15, ironDark, { x: -1.05, y: 3.02, z: 0.48, seg: 20 });
  addCyl(root, 0.145, 0.145, 0.03, ironDark, { x: -1.05, y: 3.1, z: 0.48, seg: 20 });

  // Fuel system, governor and belts
  addBox(root, 0.26, 0.2, 0.18, steel, { x: -0.48, y: 1.36, z: 0.44, edge: true });
  addPipe(root, [-0.48, 1.46, 0.44], [0.55, 1.58, 0.3], 0.014, copper);
  addCyl(root, 0.055, 0.055, 0.09, gold, { x: -0.48, y: 1.25, z: 0.44, axis: 'z' });
  addCyl(root, 0.2, 0.2, 0.06, steel, { x: 1.04, y: 1.14, z: -0.26, axis: 'x', seg: 22 });
  addCyl(root, 0.12, 0.12, 0.07, chrome, { x: 1.04, y: 0.84, z: -0.26, axis: 'x', seg: 18 });
  addTorus(root, 0.2, 0.026, rubber, { x: 1.02, y: 1.14, z: -0.26, ry: PI / 2, seg: 28 });
  addTorus(root, 0.12, 0.026, rubber, { x: 1.02, y: 0.84, z: -0.26, ry: PI / 2, seg: 24 });
  addBox(root, 0.3, 0.22, 0.18, paint(0x1c2521, 0.45, 0.44), { x: 0.42, y: 1.42, z: -0.42, edge: true });
  addCyl(root, 0.026, 0.026, 0.2, steel, { x: 0.42, y: 1.28, z: -0.42 });

  // Branding and plates
  addBrand(root, {
    lines: ['CHROMA-ATOR', 'GAS ENGINE'],
    x: -0.36,
    y: 0.83,
    z: 0.435,
    w: 1.02,
    font: 108
  });
  addPlate(root, { text: 'CPCB', w: 0.18, x: 0.72, y: 0.9, z: 0.435, font: 80 });
  addBox(root, 0.02, 0.12, 0.18, gold, { x: 0.86, y: 1.15, z: 0.36 });
  addBox(root, 0.02, 0.16, 0.24, paint(0xd8d28a, 0.2, 0.6), { x: 0.86, y: 1.38, z: 0.36 });

  root.userData.kind = 'engine';
  return root;
}
