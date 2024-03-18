import { defineConfig } from 'umi';

export default defineConfig({
  proxy: {
    '/api': {
      target: 'http://localhost:3001/',
      changeOrigin: true,
      // pathRewrite: { '^/api': '' },
    },
  },
  routes: [
    { path: '/', component: 'index' },
    { path: '/docs', component: 'docs' },
    { path: '/install', component: 'install' },
  ],
  publicPath: './',
  history: {
    type: 'hash',
  },
  npmClient: 'yarn',
  dva: {},
  plugins: ['@umijs/plugins/dist/dva'],
});
