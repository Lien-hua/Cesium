const routes = [{
    path:"/",
    redirect:'/home'
}, {
    name: 'home',
    path: '/home',
    component: () => import('../views/Home.vue')
},{
    name: 'globe',
    path: '/globe',
    component: () => import('../components/Globe.vue')
},

];

export default routes//导出