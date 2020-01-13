export default [
  {
    path: '/order/list',
    name: 'order/list',
    meta: {
      title: '我的订单'
    },
    component: () => import('@/views/order')
  },
  {
    path: '/order/doing/buyer',
    name: 'doing/buyer',
    meta: {
      title: '订单详情',
      requireAuth: true
    },
    component: () => import('@/views/order/order_doing_buyer')
  },
  {
    path: '/order/done/buyer',
    name: 'done/buyer',
    meta: {
      title: '订单详情',
      requireAuth: true
    },
    component: () => import('@/views/order/order_done_buyer')
  },
  {
    path: '/order/doing/seller',
    name: 'doing/seller',
    meta: {
      title: '订单详情',
      requireAuth: true
    },
    component: () => import('@/views/order/order_doing_seller')
  },
  {
    path: '/order/done/seller',
    name: 'done/seller',
    meta: {
      title: '订单详情',
      requireAuth: true
    },
    component: () => import('@/views/order/order_done_seller')
  }
];
