import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/users.vue'
import Roles from '../components/roles.vue'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
}, {
    path: '/login',
    component: Login
}, {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
    }, {
        path: '/users',
        component: Users
    }, {
        path: '/roles',
        component: Roles
    }]
}]

const router = new VueRouter({
    routes
})
router.beforeEach((to, form, next) => {
    //to到哪去
    //from从哪来
    //next代表还是,放行
    //next()直接方向,next('/login')强制到某个地址
    if (to.path === '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();
})


export default router