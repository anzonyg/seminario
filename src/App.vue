<template>
  <v-app>
    <!--Encabezado-->
    <v-app-bar
      absolute
      color="#010326"
      dark
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <h1 class="display-2 custom-center"></h1>
      <v-spacer></v-spacer>
      <v-btn color="white" outlined>Registrarse</v-btn>
      <v-btn color="white" outlined>Iniciar Sesión</v-btn>
    </v-app-bar>
    <!--Menu-->

    <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      temporary
      app
      class="primary"
      dark
    >
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/portraits/men/1.jpg"></v-img>
          </v-list-item-avatar>
          <v-list-item-content class="white--text">
            <v-list-item-title class="text-h6">
              Anzony Gonzalez
            </v-list-item-title>
            <v-list-item-subtitle class="white--text">
              agonzalez@gmail.com
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item link to="/home" class="white--text">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>

        <v-list-group>
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-file-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="white--text">Registro</v-list-item-title>
          </template>

          <v-list-item link to="/registro/grado" class="white--text">
            <v-list-item-title>Grado</v-list-item-title>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-school</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item link to="/registro/curso" class="white--text">
            <v-list-item-title>Curso</v-list-item-title>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-school</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item link to="/registro/actividad" class="white--text">
            <v-list-item-title class="white--text">Actividad</v-list-item-title>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-check</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-magnify</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="white--text">Buscador</v-list-item-title>
          </template>
          <v-list-item link to="/buscador/docente" class="white--text">
            <v-list-item-title>Docente</v-list-item-title>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-magnify</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item link to="/buscador/estudiante" class="white--text">
            <v-list-item-title>Estudiante</v-list-item-title>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-magnify</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-file-find-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="white--text"
              >Reporteria</v-list-item-title
            >
          </template>
          <v-list-item link to="/reporteria/curso" class="white--text">
            <v-list-item-title>Curso</v-list-item-title>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-file-chart</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item link to="/reporteria/estudiante" class="white--text">
            <v-list-item-title>Estudiante Bloque</v-list-item-title>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-file-chart</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item
            link
            to="/reporteria/estudianteCiclo"
            class="white--text"
          >
            <v-list-item-title>Estudiante Ciclo</v-list-item-title>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-file-chart</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <v-list-item link to="/calificaciones" class="white--text">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-file-check</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Calificaciones</v-list-item-title>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block>
            Cerrar Sesion
            <v-icon class="primary--text">mdi-account-cancel</v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!--Paginas-->
    <v-main>
      <router-view></router-view>
    </v-main>

    <!--Pie de Pagina-->
    <v-footer app class="primary">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <h2 class="white--text">Contáctanos</h2>
            <p class="white--text">Dirección: Calle Principal #123, Ciudad</p>
            <p class="white--text">Email: docentes@escuelaxyz.com</p>
            <p class="white--text">Teléfono: (123) 456-7890</p>
          </v-col>
          <v-col cols="12" md="6">
            <h2 class="white--text">Enlaces Rápidos</h2>
            <ul>
              <li><a href="#" class="white--text">Inicio</a></li>
              <li><a href="#" class="white--text">Recursos</a></li>
              <li><a href="#" class="white--text">Comunidad</a></li>
              <li><a href="#" class="white--text">Contacto</a></li>
            </ul>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>
  
  <script>
//const cf = require("./DIR");
export default {
  name: "App",
  components: {},
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