
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
    {
        path: '/home',
        name: 'home',
        
    },

    {
        path: '/registro/docente',
        name: 'docente',
        component: () => import('@/components/registro/Docente.vue')
    },
    {
        path: '/registro/estudiante',
        name: 'estudiante',
        component: () => import('@/components/registro/Estudiante.vue')
    },

    {
        path: '/registro/grado',
        name: 'grado',
        component: () => import('@/components/registro/Grado.vue')
    },
    {
        path: '/registro/curso',
        name: 'curso',
        component: () => import('@/components/registro/Curso.vue')
    },
    {
        path: '/registro/actividad',
        name: 'actividad',
        component: () => import('@/components/registro/Actividad.vue')
    },

    {
        path: '/buscador/docente',
        name: 'docente',
        component: () => import('@/components/buscador/Docente.vue')
    },
    {
        path: '/buscador/estudiante',
        name: 'estudiante',
        component: () => import('@/components/buscador/Estudiante.vue')
    },

    {
        path: '/reporteria/curso',
        name: 'curso',
        component: () => import('@/components/reporteria/Curso.vue')
    },
    {
        path: '/reporteria/estudiante',
        name: 'estudiante',
        component: () => import('@/components/reporteria/Estudiante.vue')
    },

    {
        path: '/calificaciones',
        name: 'calificaciones',
        component: () => import('@/components/Calificaciones.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/components/Login.vue')
    },

   
]

const router = new VueRouter({

    base: '/consultasIbis/',
    routes
})
export default router