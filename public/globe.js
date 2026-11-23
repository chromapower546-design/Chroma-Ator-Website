// Chroma-Ator 3D Interactive Global Presence Globe
(function (window) {
  const DEFAULT_NODES = [
    { name: "New Delhi (Global HQ & Manufacturing)", type: "hq", lat: 28.6139, lon: 77.2090, desc: "Chroma Power Systems HQ, Engineering Centre & Assembly Works" },
    { name: "Dubai, UAE (Middle East Hub)", type: "office", lat: 25.2048, lon: 55.2708, desc: "Middle East regional sales, spare parts warehouse & technical dispatch" },
    { name: "Singapore (Southeast Asia)", type: "partner", lat: 1.3521, lon: 103.8198, desc: "Off-grid gas power & microgrid projects" },
    { name: "Frankfurt, Germany (European Engineering)", type: "partner", lat: 50.1109, lon: 8.6821, desc: "Gas combustion sensor & AFR valve technology partners" },
    { name: "Nairobi, Kenya (East Africa Operations)", type: "office", lat: -1.2921, lon: 36.8219, desc: "Biogas power generation & tea estate mini-grids" },
    { name: "Dhaka, Bangladesh", type: "partner", lat: 23.8103, lon: 90.4125, desc: "Textile mill captive gas power plants (2 MW to 10 MW)" }
  ];

  const LAND_POLYGONS = [
    [[-168, 72], [-145, 70], [-132, 58], [-125, 50], [-123, 42], [-117, 32], [-108, 27], [-105, 22], [-97, 18], [-90, 16], [-84, 10], [-78, 8], [-80, 20], [-90, 23], [-98, 27], [-106, 31], [-112, 42], [-122, 50], [-132, 56], [-145, 62], [-158, 66], [-168, 72]],
    [[-60, 82], [-42, 82], [-20, 72], [-28, 60], [-48, 58], [-60, 66], [-60, 82]],
    [[-81, 12], [-70, 10], [-60, 6], [-52, 1], [-46, -8], [-50, -17], [-55, -23], [-60, -30], [-67, -41], [-72, -55], [-77, -48], [-75, -35], [-70, -20], [-75, -5], [-81, 0], [-81, 12]],
    [[-10, 36], [-10, 50], [-5, 58], [10, 60], [20, 70], [40, 68], [55, 65], [70, 72], [95, 75], [120, 70], [145, 60], [165, 62], [180, 55], [180, 10], [160, 5], [145, 10], [135, 20], [130, 30], [120, 30], [115, 20], [110, 10], [105, 5], [100, 10], [95, 15], [85, 20], [78, 8], [80, 5], [90, 5], [92, 20], [80, 25], [75, 35], [60, 30], [55, 15], [45, 12], [40, 20], [35, 25], [30, 35], [20, 36], [10, 37], [-10, 36]],
    [[-17, 37], [12, 37], [32, 31], [51, 12], [43, -12], [35, -25], [25, -35], [18, -34], [10, -20], [0, -5], [-10, 5], [-17, 14], [-17, 37]],
    [[112, -11], [130, -10], [145, -15], [154, -26], [150, -38], [140, -40], [130, -35], [115, -30], [112, -20], [112, -11]]
  ];

  function isLandPoint(longitude, latitude) {
    return LAND_POLYGONS.some(polygon => {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [x1, y1] = polygon[i];
        const [x2, y2] = polygon[j];
        const intersects = ((y1 > latitude) !== (y2 > latitude)) &&
          (longitude < ((x2 - x1) * (latitude - y1)) / (y2 - y1) + x1);
        if (intersects) inside = !inside;
      }
      return inside;
    });
  }

  const LAND_DOTS = [];
  const LAND_DOT_SPACING = 5.5;
  for (let latitude = -55; latitude <= 82; latitude += LAND_DOT_SPACING) {
    const rowOffset = Math.round((latitude + 55) / LAND_DOT_SPACING) % 2 ? LAND_DOT_SPACING / 2 : 0;
    for (let longitude = -180 + rowOffset; longitude <= 180; longitude += LAND_DOT_SPACING) {
      if (isLandPoint(longitude, latitude)) LAND_DOTS.push({ latitude, longitude });
    }
  }

  function initGlobe(canvasId, options = {}) {
    const NODES = options.nodes || DEFAULT_NODES;
    const internationalMode = options.mode === 'international';
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let angle = (77 - 90) * Math.PI / 180; // Start centered around India (77° E)
    const tilt = 0.35; // Tilt axis
    let isDragging = false;
    let lastX = 0;
    let hoveredNode = -1;
    let mousePos = { x: -999, y: -999 };
    let pulseTime = 0;

    // Pointer events for smooth dragging
    canvas.onpointerdown = (e) => {
      isDragging = true;
      lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    };

    canvas.onpointerup = (e) => {
      isDragging = false;
      canvas.style.cursor = 'grab';
    };

    canvas.onpointermove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scale = canvas.width / rect.width;
      mousePos.x = (e.clientX - rect.left) * scale;
      mousePos.y = (e.clientY - rect.top) * scale;

      if (isDragging) {
        const delta = e.clientX - lastX;
        angle += delta * 0.007;
        lastX = e.clientX;
      }
    };

    canvas.onpointerleave = () => {
      mousePos = { x: -999, y: -999 };
      hoveredNode = -1;
    };

    // 3D Spherical Projection Helper
    function project(latDeg, lonDeg, radius) {
      const lat = (latDeg * Math.PI) / 180;
      const lon = (lonDeg * Math.PI) / 180;

      // Unrotated spherical coordinates
      const x = radius * Math.cos(lat) * Math.sin(lon);
      const y = -radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.cos(lon);

      // Rotate around Y axis by 'angle'
      const xr = x * Math.cos(angle) + z * Math.sin(angle);
      const zr = -x * Math.sin(angle) + z * Math.cos(angle);

      // Tilt around X axis
      const yr = y * Math.cos(tilt) - zr * Math.sin(tilt);
      const zfinal = y * Math.sin(tilt) + zr * Math.cos(tilt);

      return { x: xr, y: yr, z: zfinal };
    }

    // Main Draw Frame
    function render() {
      if (!canvas.isConnected) return;
      requestAnimationFrame(render);

      const dpr = window.devicePixelRatio || 1;
      const size = Math.round(canvas.clientWidth * dpr);
      if (canvas.width !== size) {
        canvas.width = size;
        canvas.height = size;
      }

      const R = size * 0.40;
      const cx = size / 2;
      const cy = size / 2;

      ctx.clearRect(0, 0, size, size);

      // 1. Globe Ambient Atmospheric Halo
      const haloGrad = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.15);
      haloGrad.addColorStop(0, "rgba(0, 230, 118, 0.20)");
      haloGrad.addColorStop(0.6, "rgba(7, 143, 74, 0.08)");
      haloGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // 2. Globe Sphere Body
      const sphereGrad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.1, cx, cy, R);
      sphereGrad.addColorStop(0, "#152a20");
      sphereGrad.addColorStop(0.7, "#0c1813");
      sphereGrad.addColorStop(1, "#07100c");
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // Globe Rim Ring
      ctx.strokeStyle = "rgba(0, 230, 118, 0.35)";
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      // 3. Latitude & Longitude Grids (Vector wireframe)
      ctx.strokeStyle = internationalMode ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 0.8 * dpr;

      // Parallels (Latitudes)
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let first = true;
        for (let lon = 0; lon <= 360; lon += 6) {
          const p = project(lat, lon, R);
          if (p.z > 0) { // Only front hemisphere
            if (first) { ctx.moveTo(cx + p.x, cy + p.y); first = false; }
            else { ctx.lineTo(cx + p.x, cy + p.y); }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Meridians (Longitudes)
      for (let lon = 0; lon < 360; lon += 45) {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 5) {
          const p = project(lat, lon, R);
          if (p.z > 0) {
            if (first) { ctx.moveTo(cx + p.x, cy + p.y); first = false; }
            else { ctx.lineTo(cx + p.x, cy + p.y); }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Land is sampled once from simplified continent outlines, then rotated with the globe.
      LAND_DOTS.forEach(dot => {
        const point = project(dot.latitude, dot.longitude, R);
        if (point.z <= 0) return;

        const depth = point.z / R;
        ctx.beginPath();
        ctx.arc(cx + point.x, cy + point.y, (0.65 + depth * 0.45) * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(231, 239, 234, ${0.22 + depth * 0.48})`;
        ctx.fill();
      });

      // 4. Draw Connecting Energy Arcs from New Delhi HQ to International Hubs
      const hq = NODES[0];
      const hqProj = project(hq.lat, hq.lon, R);
      pulseTime += 0.035;

      NODES.slice(1).forEach(dest => {
        const destProj = project(dest.lat, dest.lon, R);
        if (hqProj.z > -R * 0.2 || destProj.z > -R * 0.2) {
          ctx.beginPath();
          ctx.moveTo(cx + hqProj.x, cy + hqProj.y);

          // Control point curving higher in 3D arc
          const midX = (hqProj.x + destProj.x) / 2 * 1.18;
          const midY = (hqProj.y + destProj.y) / 2 * 1.18 - (R * 0.15);
          ctx.quadraticCurveTo(cx + midX, cy + midY, cx + destProj.x, cy + destProj.y);

          ctx.strokeStyle = internationalMode && dest.type === 'customer'
            ? "rgba(245, 201, 40, 0.38)"
            : "rgba(0, 230, 118, 0.4)";
          ctx.lineWidth = 1.2 * dpr;
          ctx.stroke();
        }
      });

      // 5. Draw Location Nodes & Pulsating Radar Rings
      hoveredNode = -1;

      NODES.forEach((node, idx) => {
        const p = project(node.lat, node.lon, R);
        if (p.z <= 0) return; // Behind globe

        const screenX = cx + p.x + ((internationalMode ? node.screenOffsetX || 0 : 0) * dpr);
        const screenY = cy + p.y;

        // Hover test
        const dist = Math.hypot(mousePos.x - screenX, mousePos.y - screenY);
        const isHovered = dist < 22 * dpr;
        if (isHovered) hoveredNode = idx;

        const isHq = node.type === 'hq';
        const isOffice = isHq || node.type === 'office';
        const markerColor = internationalMode && node.type === 'customer'
          ? "#f5c928"
          : isHq ? "#f5c928" : "#00e676";

        // Pulsing radar ring
        const pulseR = ((pulseTime * 18 + idx * 8) % 24) * dpr;
        const pulseAlpha = Math.max(0, 1 - pulseR / (24 * dpr));
        ctx.beginPath();
        ctx.arc(screenX, screenY, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = node.type === 'customer'
          ? `rgba(245, 201, 40, ${pulseAlpha})`
          : isHq ? `rgba(245, 201, 40, ${pulseAlpha})` : `rgba(0, 230, 118, ${pulseAlpha})`;
        ctx.lineWidth = 1.5 * dpr;
        ctx.stroke();

        // Core Pin Dot
        ctx.beginPath();
        ctx.arc(screenX, screenY, (isOffice ? 5.5 : 4.0) * dpr, 0, Math.PI * 2);
        ctx.fillStyle = markerColor;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.2 * dpr;
        ctx.stroke();

        if (options.showLabels !== false || isHovered) {
          ctx.font = `600 ${isOffice ? 11 : 9.5}px 'Inter', sans-serif`;
          ctx.fillStyle = isHovered ? markerColor : "#f4f6f2";
          ctx.textAlign = "left";
          const label = options.showLabels === false ? node.name : node.name.split(" ")[0];
          ctx.fillText(label, screenX + 9 * dpr, screenY + 4 * dpr);
        }
      });

      // Auto-rotation when not dragging
      if (!isDragging) {
        angle += 0.0018;
      }
    }

    render();
  }

  window.ChromaGlobe = { init: initGlobe, nodes: DEFAULT_NODES };
})(window);
