// Model registry for the 3D product studio.
import { buildGenerator, buildEngine } from './models-power.js?v=3';
import { buildDFS, buildCDU } from './models-gas.js?v=3';
import { buildMRU } from './models-mru.js?v=3';

export const MODEL_BUILDERS = {
  generator: buildGenerator,
  engine: buildEngine,
  dfs: buildDFS,
  cdu: buildCDU,
  mru: buildMRU
};

export function buildModel(key) {
  const builder = MODEL_BUILDERS[key] || MODEL_BUILDERS.generator;
  return builder();
}
