export default [
  {
    path: '/my/security',
    name: 'security',
    meta: {
      title: '安全设置',
      requireAuth: true
    },
    component: () => import('@/views/my/security')
  },
  {
    path: '/my/help',
    name: 'help',
    meta: {
      title: '帮助中心'
    },
    component: () => import('@/views/my/help')
  },
  {
    path: '/my/invite',
    name: 'invite',
    meta: {
      title: '邀请好友',
      requireAuth: true
    },
    component: () => import('@/views/my/invite')
  },
  {
    path: '/my/share',
    name: 'share',
    meta: {
      title: '分享邀请链接',
      requireAuth: true
    },
    component: () => import('@/views/my/invite_share')
  }
];
