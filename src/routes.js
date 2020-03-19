
const routes = [
  {path: '/', redirect: '/relationMap'},
  {
    path: '/relationChart',
    name: 'relationChart',
    component:(resolve) => require(['@/components/relationChart.vue'], resolve),
    meta: {
      title: '力导向图',
      hidden: false
    }
  },
  {
    path: '/demo',
    name: 'demo',
    component:(resolve) => require(['@/components/demo-canvas.vue'], resolve),
    meta: {
      title: '测试',
      hidden: false
    }
  },
  {
    path: '/histogram',
    name: 'histogram',
    component:(resolve) => require(['@/components/histogram.vue'], resolve),
    meta: {
      title: '柱状图',
      hidden: false
    }
  },
  {
    path: '/pieChart',
    name: 'pieChart',
    component:(resolve) => require(['@/components/pieChart.vue'], resolve),
    meta: {
      title: '饼图',
      hidden: false
    }
  },
  {
    path: '/dendrogram',
    name: 'dendrogram',
    component:(resolve) => require(['@/components/dendrogram.vue'], resolve),
    meta: {
      title: '树状图',
      hidden: false
    }
  },
  {
    path: '/relationMap',
    name: 'relationMap',
    component:(resolve) => require(['@/components/relationMap.vue'], resolve),
    meta: {
      title: '关系地图',
      hidden: false
    }
  }
]
export default routes
