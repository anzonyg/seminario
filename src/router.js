
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
    {
        path: '/auth/consultasIBIS/token/:token',
        name: 'home',

    },
    {
        path: '/salir',
        name: 'salir',
        component: () => import('@/components/Cerrar_Sesion.vue')
    },
    {
        path: '/report/token/:token',
        name: 'report',
        component: () => import('@/components/Report_alerta.vue')
    },
    {
        path: '/bloqueo',
        name: 'bloqueo',
        component: () => import('@/components/Bloqueo.vue')
    },
    {
        path: '/consulta/token/:token',
        name: 'consulta',
        component: () => import('./components/Consultas_IBIS.vue')
    },
]

const router = new VueRouter({

    base: '/consultasIbis/',
    routes
})
export default router