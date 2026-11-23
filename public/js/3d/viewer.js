// Real-time Three.js studio for the Chroma-Ator product range.
import * as THREE from '../../vendor/three.module.js?v=3';
import { disposeObject } from './kit.js?v=3';
import { buildModel } from './models.js?v=3';

const DEFAULT_UNIT = 'generator';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function shadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 8, 128, 128, 126);
  gradient.addColorStop(0, 'rgba(0,0,0,.72)');
  gradient.addColorStop(0.45, 'rgba(0,0,0,.34)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

class ProductViewer {
  constructor(canvas) {
    this.canvas = canvas;
    this.container = canvas.closest('.product-3d-stage') || canvas.parentElement;
    this.models = new Map();
    this.current = null;
    this.currentKey = null;
    this.modelRadius = 2;
    this.visible = true;
    this.spin = canvas.dataset.spin !== 'false';
    this.dragging = false;
    this.lastTime = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.yaw = -0.7;
    this.polar = 1.12;
    this.distance = 10;
    this.goalYaw = -0.7;
    this.goalPolar = 1.12;
    this.goalDistance = 10;
    this.target = new THREE.Vector3(0, 1, 0);
    this.goalTarget = new THREE.Vector3(0, 1, 0);
    this.offset = new THREE.Vector3();

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.04;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x07110c, 15, 30);
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);

    this.modelRoot = new THREE.Group();
    this.scene.add(this.modelRoot);

    this.buildEnvironment();
    this.buildLights();
    this.buildFloor();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.visibilityObserver = new IntersectionObserver(
      entries => {
        this.visible = entries.some(entry => entry.isIntersecting);
      },
      { threshold: 0.02 }
    );
    this.visibilityObserver.observe(this.container);

    this.bindInput();
    this.resize();
    this.tick = this.tick.bind(this);
    this.raf = requestAnimationFrame(this.tick);
  }

  buildEnvironment() {
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const environment = new THREE.Scene();
    environment.background = new THREE.Color(0x08120d);
    const plane = new THREE.PlaneGeometry(12, 12);

    const panel = (color, intensity, position, rotation) => {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(plane, material);
      mesh.position.set(position[0], position[1], position[2]);
      mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
      environment.add(mesh);
    };

    panel(0xe8f1ff, 2.4, [0, 6.5, 0], [Math.PI / 2, 0, 0]);
    panel(0x8be3b3, 1.2, [-6, 3.2, 1], [0, Math.PI / 2, 0]);
    panel(0xffd18a, 0.85, [5.5, 2.2, -2], [0, -Math.PI / 2, 0]);
    panel(0x9fc8ff, 0.7, [0, 2.4, -6], [0, 0, 0]);
    panel(0xffffff, 1.1, [2, 4.6, 5], [0, Math.PI, 0]);

    const target = pmrem.fromScene(environment, 0.035);
    this.scene.environment = target.texture;
    this.environmentTarget = target;
    pmrem.dispose();
    plane.dispose();
    environment.traverse(child => {
      if (child.material) child.material.dispose();
    });
  }

  buildLights() {
    this.scene.add(new THREE.HemisphereLight(0xd7eee1, 0x08130d, 1.1));

    const key = new THREE.DirectionalLight(0xffffff, 3.1);
    key.position.set(6, 9, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -7;
    key.shadow.camera.right = 7;
    key.shadow.camera.top = 7;
    key.shadow.camera.bottom = -7;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 30;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.025;
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0x79e0b0, 1.9);
    rim.position.set(-7, 5, -6);
    this.scene.add(rim);

    const warm = new THREE.PointLight(0xffc45e, 26, 16, 2);
    warm.position.set(0, 2.4, -5);
    this.scene.add(warm);

    const fill = new THREE.PointLight(0x9fd8b8, 12, 14, 2);
    fill.position.set(4.5, 1.5, 3);
    this.scene.add(fill);
  }

  buildFloor() {
    const stage = new THREE.Mesh(
      new THREE.CylinderGeometry(3.72, 3.78, 0.14, 72),
      new THREE.MeshStandardMaterial({ color: 0x08160f, metalness: 0.6, roughness: 0.34 })
    );
    stage.position.y = -0.07;
    stage.receiveShadow = true;
    this.scene.add(stage);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.7, 0.014, 8, 140),
      new THREE.MeshBasicMaterial({ color: 0x3f9d6c, transparent: true, opacity: 0.65 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.012;
    this.scene.add(ring);

    const grid = new THREE.PolarGridHelper(3.64, 12, 6, 72, 0x2b7d55, 0x143a27);
    grid.position.y = 0.014;
    grid.material.transparent = true;
    grid.material.opacity = 0.3;
    this.scene.add(grid);

    const contact = new THREE.Mesh(
      new THREE.CircleGeometry(1, 48),
      new THREE.MeshBasicMaterial({
        map: shadowTexture(),
        transparent: true,
        depthWrite: false,
        opacity: 0.92
      })
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = 0.018;
    contact.renderOrder = 2;
    this.scene.add(contact);
    this.contact = contact;
  }

  bindInput() {
    this.onPointerDown = event => {
      if (event.button !== undefined && event.button !== 0) return;
      this.dragging = true;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      this.container.classList.add('is-dragging');
      try {
        this.canvas.setPointerCapture(event.pointerId);
      } catch (error) {
        /* pointer capture can fail on synthetic events */
      }
    };

    this.onPointerMove = event => {
      if (!this.dragging) return;
      const dx = event.clientX - this.lastX;
      const dy = event.clientY - this.lastY;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      this.goalYaw -= dx * 0.0075;
      if (event.pointerType !== 'touch') {
        this.goalPolar = clamp(this.goalPolar + dy * 0.0048, 0.8, 1.44);
      }
    };

    this.onPointerUp = () => {
      this.dragging = false;
      this.container.classList.remove('is-dragging');
    };

    this.onDoubleClick = () => {
      this.resetView();
    };

    this.onContextLost = event => {
      event.preventDefault();
      this.showFallback();
    };

    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointercancel', this.onPointerUp);
    this.canvas.addEventListener('pointerleave', this.onPointerUp);
    this.canvas.addEventListener('dblclick', this.onDoubleClick);
    this.canvas.addEventListener('webglcontextlost', this.onContextLost);
  }

  resize() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    const width = Math.max(2, Math.round(rect.width));
    const height = Math.max(2, Math.round(rect.height));
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, width < 560 ? 1.75 : 2)
    );
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    // Leave extra room at the bottom on small stages where the caption overlay
    // is proportionally taller.
    this.bottomLimit = width < 560 ? 0.6 : height < 480 ? 0.65 : 0.7;
    if (this.modelSize) {
      this.goalDistance = this.fitDistanceForView();
    }
  }

  fitDistance(radius) {
    const vFov = THREE.MathUtils.degToRad(this.camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * this.camera.aspect);
    const fitFov = Math.min(vFov, hFov);
    return Math.max(4.4, (radius / Math.sin(fitFov / 2)) * 1.06);
  }

  // Projects the bounds of each mesh for a candidate distance and returns how
  // far the unit overflows a framed area. 1 means perfectly fitted. Per-part
  // bounds are far tighter than one merged box, so diagonal views still fill the
  // stage. The frame is biased upwards so the caption never sits on the product.
  projectedOverflow(distance) {
    if (!this.current) return 0;
    const offset = new THREE.Vector3().setFromSphericalCoords(
      distance,
      this.goalPolar,
      this.goalYaw
    );
    this.camera.position.copy(this.goalTarget).add(offset);
    this.camera.lookAt(this.goalTarget);
    this.camera.updateMatrixWorld(true);
    this.current.updateMatrixWorld(true);

    const corner = new THREE.Vector3();
    let overflow = 0;

    this.current.traverse(child => {
      if (!child.isMesh || !child.geometry) return;
      if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
      const bounds = child.geometry.boundingBox;
      if (!bounds) return;
      for (const x of [bounds.min.x, bounds.max.x]) {
        for (const y of [bounds.min.y, bounds.max.y]) {
          for (const z of [bounds.min.z, bounds.max.z]) {
            corner.set(x, y, z).applyMatrix4(child.matrixWorld).project(this.camera);
            const horizontal = Math.abs(corner.x) / 0.98;
            const vertical =
              corner.y > 0 ? corner.y / 0.98 : -corner.y / (this.bottomLimit || 0.7);
            overflow = Math.max(overflow, horizontal, vertical);
          }
        }
      }
    });

    return overflow;
  }

  // Iteratively solves for a camera distance that keeps the whole unit inside the
  // stage with a comfortable margin, whatever its proportions are.
  fitDistanceForView() {
    let distance = this.fitDistance(this.modelRadius);
    for (let i = 0; i < 9; i += 1) {
      const overflow = this.projectedOverflow(distance);
      if (!isFinite(overflow) || overflow <= 0.0001) break;
      const next = Math.max(2.2, Math.min(60, distance * overflow));
      if (Math.abs(next - distance) < 0.015) {
        distance = next;
        break;
      }
      distance = next;
    }
    return distance;
  }

  setUnit(key) {
    const unitKey = key || DEFAULT_UNIT;
    if (this.currentKey === unitKey) {
      this.container.classList.add('is-ready');
      return;
    }

    if (this.current) this.modelRoot.remove(this.current);

    let model = this.models.get(unitKey);
    if (!model) {
      model = buildModel(unitKey);
      this.models.set(unitKey, model);
    }
    this.current = model;
    this.currentKey = unitKey;
    this.modelRoot.add(model);
    this.canvas.dataset.unit = unitKey;

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    this.modelRadius = Math.max(1.2, size.length() * 0.5);
    this.modelSize = size.clone();
    this.goalTarget.copy(center);

    this.fitYaw = -0.66;
    this.fitPolar = size.y > size.x * 0.9 ? 1.2 : 1.16;
    this.yaw = this.goalYaw = this.fitYaw;
    this.polar = this.goalPolar = this.fitPolar;
    this.distance = this.goalDistance = this.fitDistanceForView();
    this.offset.setFromSphericalCoords(this.distance, this.polar, this.yaw);
    this.camera.position.copy(center).add(this.offset);
    this.camera.lookAt(center);
    this.camera.updateMatrixWorld(true);

    this.contact.position.set(center.x, 0.018, center.z);
    const shadowScale = Math.max(size.x, size.z) * 0.54;
    this.contact.scale.set(shadowScale, shadowScale, 1);

    const fallback = this.container.querySelector('.product-3d-fallback');
    if (fallback && this.canvas.dataset.fallback) {
      fallback.src = this.canvas.dataset.fallback;
      fallback.alt = this.canvas.dataset.alt || 'Chroma-Ator product';
    }

    this.container.classList.remove('is-fallback');
    this.container.classList.add('is-ready');
  }

  resetView() {
    this.goalYaw = this.fitYaw;
    this.goalPolar = this.fitPolar;
    this.goalDistance = this.fitDistanceForView();
  }

  setSpin(value) {
    this.spin = !!value;
    this.canvas.dataset.spin = String(this.spin);
  }

  rotateBy(degrees) {
    this.spin = false;
    this.canvas.dataset.spin = 'false';
    this.goalYaw += degrees * (Math.PI / 180);
  }

  showFallback() {
    this.container.classList.add('is-fallback');
    this.container.classList.remove('is-ready');
  }

  tick(now) {
    if (!this.canvas.isConnected) {
      this.destroy();
      return;
    }
    this.raf = requestAnimationFrame(this.tick);

    const dt = Math.min(0.05, this.lastTime ? (now - this.lastTime) / 1000 : 0.016);
    this.lastTime = now;
    if (!this.visible) return;

    if (this.spin && !this.dragging) {
      this.goalYaw += dt * 0.24;
    }

    const easing = Math.min(1, dt * 7.5);
    this.yaw += (this.goalYaw - this.yaw) * easing;
    this.polar += (this.goalPolar - this.polar) * easing;
    this.distance += (this.goalDistance - this.distance) * Math.min(1, dt * 5.5);
    this.target.lerp(this.goalTarget, Math.min(1, dt * 6));

    this.offset.setFromSphericalCoords(this.distance, this.polar, this.yaw);
    this.camera.position.copy(this.target).add(this.offset);
    this.camera.lookAt(this.target);
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.visibilityObserver) this.visibilityObserver.disconnect();
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerUp);
    this.canvas.removeEventListener('pointerleave', this.onPointerUp);
    this.canvas.removeEventListener('dblclick', this.onDoubleClick);
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost);

    this.models.forEach(model => {
      this.modelRoot.remove(model);
      disposeObject(model);
    });
    this.models.clear();
    disposeObject(this.scene);
    if (this.environmentTarget) this.environmentTarget.dispose();
    this.renderer.dispose();
    if (activeViewer === this) activeViewer = null;
  }
}

let activeViewer = null;

function mount(options = {}) {
  const canvas = document.getElementById(options.canvasId || 'product-3d-canvas');
  if (!canvas) return null;
  if (activeViewer && activeViewer.canvas === canvas) {
    if (options.unit) activeViewer.setUnit(options.unit);
    if (typeof options.spin === 'boolean') activeViewer.setSpin(options.spin);
    return activeViewer;
  }

  if (activeViewer) activeViewer.destroy();

  try {
    activeViewer = new ProductViewer(canvas);
    activeViewer.setUnit(options.unit || canvas.dataset.unit || DEFAULT_UNIT);
    if (typeof options.spin === 'boolean') activeViewer.setSpin(options.spin);
    return activeViewer;
  } catch (error) {
    console.warn('Chroma-Ator 3D studio could not start:', error);
    const stage = canvas.closest('.product-3d-stage');
    if (stage) stage.classList.add('is-fallback');
    return null;
  }
}

function autoMount() {
  const canvas = document.getElementById('product-3d-canvas');
  if (!canvas) return;
  mount({
    canvasId: canvas.id,
    unit: canvas.dataset.unit,
    spin: canvas.dataset.spin !== 'false'
  });
}

window.ChromaProduct3D = {
  mount,
  setUnit(unit) {
    if (activeViewer) activeViewer.setUnit(unit);
  },
  setSpin(value) {
    if (activeViewer) activeViewer.setSpin(value);
  },
  rotateBy(degrees) {
    if (activeViewer) activeViewer.rotateBy(degrees);
  },
  reset() {
    if (activeViewer) activeViewer.resetView();
  },
  dispose() {
    if (activeViewer) activeViewer.destroy();
  },
  get ready() {
    return !!activeViewer;
  },
  // Diagnostics hook used by the site QA pass.
  debug() {
    return activeViewer;
  }
};

document.addEventListener('chroma:studio', autoMount);
// app.js owns mounting when it is present; this is only a safety net so the
// studio still starts if the app bundle is stale or the markup is static.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(autoMount, 700), { once: true });
} else {
  setTimeout(autoMount, 700);
}
