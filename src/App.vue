<template>
  <v-app>
    <!--Encabezado-->
    <v-app-bar absolute color="#010326" dark app>
      <v-app-bar-nav-icon
        v-if="menu"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <h1 class="display-2 custom-center"></h1>
      <v-spacer></v-spacer>
      <v-btn
        color="white"
        v-if="botonLogin"
        outlined
        @click="loginDialog = !loginDialog"
        >Iniciar Sesión</v-btn
      >
      <v-dialog v-model="loginDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h6">Iniciar Sesión</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Correo Electrónico"
                v-model="form.correo"
                required
              ></v-text-field>
              <v-text-field
                label="Contraseña"
                v-model="form.clave"
                type="password"
                required
              ></v-text-field>
              <v-card-actions class="justify-end">
                <!-- Añade la clase justify-end aquí -->
                <v-btn text @click="loginDialog = false">Cancelar</v-btn>
                <v-btn color="primary" type="submit" @click="validarLogin"
                  >IniciarSesion</v-btn
                >
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
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
          <v-list-item-content class="white--text">
            <v-list-item-title class="text-h6">
              {{ nombre }} {{ apellidos }}
            </v-list-item-title>
            <v-list-item-subtitle class="white--text">
              {{ correo }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item link to="/" class="white--text">
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
          <div v-if="admin">
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
            <v-list-item
              link
              to="/registro/asignacionCurso"
              class="white--text"
            >
              <v-list-item-title>Asignacion de Curso</v-list-item-title>
              <v-list-item-icon>
                <v-icon class="white--text">mdi-school</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </div>
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
          <v-list-item link to="/reporteria/cursoBloque" class="white--text">
            <v-list-item-title>Curso Bloque</v-list-item-title>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-file-chart</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item link to="/reporteria/cursoCiclo" class="white--text">
            <v-list-item-title>Curso Ciclo</v-list-item-title>
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
          <v-btn block @click="cerrarSesion" color="white" outlined>
            Cerrar Sesion
            <v-icon class="white--text">mdi-account-cancel</v-icon>
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
          <v-col cols="12" md="4">
            <h2 class="white--text">Contáctanos</h2>
            <p class="white--text">Dirección: Calle Principal #123, Ciudad</p>
          </v-col>
          <v-col cols="12" md="4">
            <br />
            <p class="white--text">Email: docentes@escuelaxyz.com</p>
          </v-col>
          <v-col cols="12" md="4">
            <br />
            <p class="white--text">Teléfono: (123) 456-7890</p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>
  
<script>
import swal from "sweetalert";
import axios from "axios";
const cf = require("./components/DIR");
const url = cf.url + "/DocenteLogin";

export default {
  name: "App",
  components: {},
  data: () => ({
    admin: false,
    drawer: false,
    alerta: "",
    menu: false,
    botonLogin: true,
    group: null,
    loginDialog: false, // Inicialmente, el diálogo de inicio de sesión está oculto
    form: {
      correo: "",
      clave: "",
    },
    foto: "https://randomuser.me/portraits/men/1.jpg",
    nombre: "Anzony",
    apellidos: "Gonzalez",
    correo: "gmail.com",
  }),
  methods: {
    makeToast() {
      swal(this.alerta, {
        buttons: false,
        timer: 3000,
        background: "#FAAFFF",
      });
    },
    onRowSelected(items) {
      this.selected = items;
    },
    async validarLogin() {
      await axios.post(url, this.form).then((data) => {
        // Limpieza de datos
        if (data.data.validar) {
          const auxDataUser = data.data.tabla[0];
          localStorage.setItem("datos", JSON.stringify(auxDataUser));
          this.tabla = [];
          this.consultas = data.data;
          this.validarRest();
        } else {
          this.consultas = data.data;
          this.validarRest();
        }
      });
      // Asignar nuevos valores
    },
    validarRest() {
      if (this.consultas.validar == false) {
        this.alerta = "Error de login verificar datos.";
        this.makeToast();
        this.botonLogin = true;
        this.menu = false;
        this.cerrarSesion();
      } else {
        this.botonLogin = false;
        this.loginDialog = false;
        this.menu = true;
        this.alerta = "Login exitoso.";
        this.makeToast();
        this.nombre = this.consultas.tabla[0].Nombre;
        this.apellidos = this.consultas.tabla[0].Apellidos;
        this.correo = this.consultas.tabla[0].CorreoElectronico;
        this.validraAdmin();
      }
    },
   
    verificarLogin() {
      var datos = JSON.parse(localStorage.getItem("datos"));
      if (datos == null) {
        this.cerrarSesion();
      } else {
        this.consultas = datos;
        this.validarRest2();
      }
    },
    validarRest2() {
      console.log(this.consultas);
      if (this.consultas.validar == false) {
        this.alerta = "Error de login verificar datos.";
        this.makeToast();
        this.botonLogin = true;
        this.menu = false;
        this.cerrarSesion();
      } else {
        this.botonLogin = false;
        this.loginDialog = false;
        this.menu = true;
        this.alerta = "Login exitoso.";
        this.makeToast();
        this.nombre = this.consultas.Nombre;
        this.apellidos = this.consultas.Apellido;
        this.correo = this.consultas.CorreoElectronico;
        this.validraAdmin();
      }
    },
    validraAdmin() {
      var datos = JSON.parse(localStorage.getItem("datos"));
      if (datos.idTipo == 1){
        this.admin = true;
      }else{
        this.admin = false;
      }
    },
    cerrarSesion() {
      localStorage.removeItem("datos");
      this.botonLogin = true;
      this.menu = false;
      this.$router.push("/");
    },
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
  created() {
    this.verificarLogin();
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