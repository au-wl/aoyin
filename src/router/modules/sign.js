export default [
  {
    path: '/sign/reloginpwd',
    name: 'reloginpwd',
    meta: {
      title: '重置登录密码',
      requireAuth: true
    },
    component: () => import('@/views/sign/set_relogin_pwd')
  },
  {
    path: '/sign/forgetpwd',
    name: 'forgetpwd',
    meta: {
      title: '忘记登录密码'
    },
    component: () => import('@/views/sign/set_relogin_pwd')
  },
  {
    path: '/sign/fundpwd',
    name: 'fundpwd',
    meta: {
      title: '设置资金密码',
      requireAuth: true
    },
    component: () => import('@/views/sign/set_fund_pwd')
  },
  {
    path: '/sign/fundpwdnp',
    name: 'fundpwdnp',
    meta: {
      title: '设置资金密码',
      requireAuth: true
    },
    component: () => import('@/views/sign/set_fund_pwd_noph')
  },
  {
    path: '/sign/upfundpwdnp',
    name: 'upfundpwdnp',
    meta: {
      title: '重置资金密码',
      requireAuth: true
    },
    component: () => import('@/views/sign/update_fund_pwd_noph')
  }
];
