import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node22',
  clean: true,
  // El paquete compartido se publica como TypeScript, así que se incluye en el bundle.
  noExternal: ['@snail/shared'],
});
