
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/user-management-app/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/user-management-app"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 521, hash: '6f37591389ed981ca706d726611e9aa5a0a52956ead9b4e9996366a21b13dcb1', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1034, hash: 'd7b6bee6c9eafe4d4254fc8a8198e913f95e9cef7e49c289e8d5c2d6f6b1d666', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 21663, hash: '2a47ac85ce9fa2bdc75e5e28bad2dc6be8da77fca1d44e76e1f6012b8a585fcd', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
