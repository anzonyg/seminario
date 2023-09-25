<template>
  <v-app>
    <!--Encabezado-->
    <v-app-bar
      absolute
      color="#010326"
      dark
      shrink-on-scroll
      prominent
      src="@/assets/logo.png"
      fade-img-on-scroll
      scroll-target="#scrolling-techniques-4"
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <h1 class="display-2 custom-center">Módulo de Consultas</h1>
    </v-app-bar>
    <!--Menu-->
    <v-navigation-drawer v-model="drawer" absolute bottom temporary app>
      <v-list class="primary">
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img
              src="https://randomuser.me/portraits/men/1.jpg"
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content class="white--text">
            <v-list-item-title class="text-h6">
              Anzony Gonzalez
            </v-list-item-title>
            <v-list-item-subtitle class="white--text"
              >agonzalez@gmail.com</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item link to="/home">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>

        <v-list-group prepend-icon="mdi-file-plus">
          <template v-slot:activator>
            <v-list-item-title>Registro</v-list-item-title>
          </template>

          <v-list-group :value="true" no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Persona</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item link to="/registro/docente">
              <v-list-item-title>Docente</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item link to="/registro/estudiante">
              <v-list-item-title>Estudiante</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
          <v-list-group no-action sub-group>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Colegio</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item link to="/registro/grado">
              <v-list-item-title>Grado</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-school</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item link to="/registro/curso">
              <v-list-item-title>Curso</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-school</v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-list-item link to="/registro/actividad">
              <v-list-item-title>Actividad</v-list-item-title>
              <v-list-item-icon>
                <v-icon>mdi-check</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </v-list-group>

        <v-list-group prepend-icon="mdi-magnify">
          <template v-slot:activator>
            <v-list-item-title>Buscador</v-list-item-title>
          </template>
          <v-list-item link to="/buscador/docente">
            <v-list-item-icon>
              <v-icon>mdi-magnify</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Docente</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/buscador/estudiante">
            <v-list-item-icon>
              <v-icon>mdi-magnify</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Estudiante</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group prepend-icon="mdi-file-find-outline">
          <template v-slot:activator>
            <v-list-item-title>Reporteria</v-list-item-title>
          </template>
          <v-list-item link to="/reporteria/curso">
            <v-list-item-icon>
              <v-icon>mdi-file-chart</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Curso</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/reporteria/estudiante">
            <v-list-item-icon>
              <v-icon>mdi-file-chart</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Estudiante</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item link to="/calificaciones">
          <v-list-item-icon>
            <v-icon>mdi-file-check</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Calificaciones</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!--Paginas-->
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
  
  <script>

//const cf = require("./DIR");
export default {
  name: "App",
  components: {
   
  },
  data: () => ({
    drawer: false,
    group: null,
    
  }),

  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>
  <style>
.custom-center {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>