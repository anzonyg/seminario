import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        
        {
            path: '/auth/consultasIBIS/token/:token',
            name: 'home',
        },
        /*{
            path: '/consulta',
            name: 'consulta',
            component: () => import('./components/Consultas_IBIS.vue')
        },
        {
            path: '/alert',
            name: 'alert',
            component: () => import('./components/Report_alerta.vue')

        },*/
        {
            path: '/bloqueo',
            name: 'bloqueo',
            component: () => import('./components/Bloqueo.vue')
        },
        {
            path: '/salir',
            name: 'salir',
            component: () => import('./components/Cerrar_Sesion.vue')
        },
        {
            path: '/',
            name: 'bloqueo2',
        },
    ]
})