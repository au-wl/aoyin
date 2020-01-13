export default [
  {
    path: '/otc/advertise',
    name: 'advertise',
    meta: {
      title: '发布广告'
    },
    component: () => import('@/views/otc/advertise')
  },
  {
    path: '/otc/deal',
    name: 'deal',
    meta: {
      title: '购买',
      requireAuth: true
    },
    component: () => import('@/views/otc/deal')
  }
];
