
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/usermanagement-mock/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/usermanagement-mock"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 862, hash: '1e2de2480c2de128b9d25b3797e8025380175c11a8955cc18a527b4256b33dfc', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1034, hash: '89215530d3ab250793c8ce4e202994491cf4fb52749226a5f013c48f354f0b18', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 31567, hash: 'e7f14b951b8cc6c7e0d18655982a1963d1f1c38f2aae652668e9b35d15714bf9', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-XWVXU6OV.css': {size: 405, hash: 'MLbyteK/AU4', text: () => import('./assets-chunks/styles-XWVXU6OV_css.mjs').then(m => m.default)}
  },
};
