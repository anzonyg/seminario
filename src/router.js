
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/components/Home.vue')
    },
    {
        path: '/registro/grado',
        name: 'gradoReg',
        component: () => import('@/components/registro/Grado.vue')
    },
    {
        path: '/registro/curso',
        name: 'cursoReg',
        component: () => import('@/components/registro/Curso.vue')
    },
    {
        path: '/registro/asignacionCurso',
        name: 'asignacionCursoReg',
        component: () => import('@/components/registro/AsignacionCurso.vue')
    },
    {
        path: '/registro/actividad',
        name: 'actividadReg',
        component: () => import('@/components/registro/Actividad.vue')
    },

    {
        path: '/buscador/docente',
        name: 'docenteBus',
        component: () => import('@/components/buscador/Docente.vue')
    },
    {
        path: '/buscador/estudiante',
        name: 'estudianteBus',
        component: () => import('@/components/buscador/Estudiante.vue')
    },

    {
        path: '/reporteria/curso',
        name: 'cursoReport',
        component: () => import('@/components/reporteria/Curso.vue')
    },
    {
        path: '/reporteria/cursoBloque',
        name: 'cursoReportBloque',
        component: () => import('@/components/reporteria/MateriaBloque.vue')
    },
    {
        path: '/reporteria/cursoCiclo',
        name: 'cursoReportCiclo',
        component: () => import('@/components/reporteria/MateriaCiclo.vue')
    },
    {
        path: '/reporteria/estudiante',
        name: 'estudianteReportBloque',
        component: () => import('@/components/reporteria/Estudiante.vue')
    },
    {
        path: '/reporteria/estudianteCiclo',
        name: 'estudianteReportCiclo',
        component: () => import('@/components/reporteria/EstudianteCiclo.vue')
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

    base: '/sistemaNotas/',
    routes
})
export default router