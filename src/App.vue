<template>
  <div id="app">
    <b-container>
      <Encabezado />
      <br />
      <b-row>
        <b-col md="2">
          <!--
          <router-link to="/consulta">Consultas IBIS</router-link>
          <br />
          <router-link to="/alert">Alertas IBIS</router-link>
          <br />
          <br />
          -->
        </b-col>
        <b-col md="9" align="right">
          <h5 class="text-primary">{{ nombre }}</h5>
          <!--<token @nombrecompleto = "nombre = $event"></token>-->
        </b-col>
        <b-col md="1" align="left">
          <b-dropdown size="sm" variant="info">
            <template #button-content>
              <b-icon icon="person-fill" aria-hidden="true"></b-icon>
            </template>
            <b-dropdown-item-button @click="downloadPDF()">
              <b-icon icon="download" aria-hidden="true"></b-icon>
              Descargar Manual
            </b-dropdown-item-button>
            <b-dropdown-divider></b-dropdown-divider>
            <router-link to="salir">
              <b-dropdown-item-button @click="salir()">
                <b-icon icon="x-circle" aria-hidden="true"></b-icon>
                Salir
              </b-dropdown-item-button>
            </router-link>
          </b-dropdown>
        </b-col>
      </b-row>
    </b-container>
    <router-view />
    <div class="text-center">
      <br />
      <br />
      <h1>Módulo de Consultas IBIS</h1>
    </div>
    <div v-if="mostrar">
      <Consultas />
    </div>
    <div v-else>
      <Bloqueo />
    </div>
    <div v-if="sesion" class="text-center">
      <br />
      <br />
      <p>Iniciar sesión en Dacs</p>
      <b-button variant="outline-primary" href="https://www.google.com"
        >Ir a Inicio</b-button
      >
    </div>
  </div>
</template>

<script>
import Encabezado from "./components/Encabezado.vue";
import Consultas from "./components/Consultas_IBIS.vue";
import Bloqueo from "./components/Bloqueo.vue";
//import Salir from "./components/Cerrar_Session.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    Encabezado,
    Bloqueo,
    Consultas,
    //Salir,
  },
  data() {
    return {
      mostrar: false,
      sesion: false,
      nombre: "",
      id: "",
      dependencia: "",
      grupo: "",
    };
  },
  methods: {
    datos(datos) {
      localStorage.setItem("datos", JSON.stringify(datos));
      var nombrecompleto =
        datos.userData.nombres + " " + datos.userData.apellidos;
      this.nombre = nombrecompleto;
    },
    verificartoken(text) {
      if (text) {
        this.mostrar = true;
      } else {
        this.mostrar = false;
      }
    },
    eliminarcache() {
      localStorage.removeItem("datos");
    },
    async downloadPDF() {
      //descarga manual de usuario
      axios({
        url: "http://172.18.232.193:9080/download",
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", "Manual_Usuario.pdf");
        document.body.appendChild(fileLink);

        fileLink.click();
      });
    },
    async verToken() {
      //verifica token
      await axios
        .get("http://172.18.230.112:9001/sigeemp/revisarToken/", {
          //donde realiza la consulta
          headers: { Authorization: this.$route.params.token }, // el token
        })
        .then((r) => r.data)
        .then((res) => {
          //console.log(res);
          //console.log(res.valid);
          if (res.valid) {
            const auxDataUser = {
              token: this.$route.params.token,
              uid: res.token.user.id,
              userData: res.token.user,
            };
            //console.log(auxDataUser); // ver info
            this.datos(auxDataUser);
            this.verificartoken(res.valid);
          } else {
            this.verificartoken(false);
            console.log(false);
          }
        });
    },
    salir() {
      localStorage.removeItem("datos");
      this.mostrar = false;
      this.sesion = true;
    },
  },
  beforeCreated: function () {
    localStorage.removeItem("datos");
  },
  created: function () {
    this.verToken();
  },
  updated() {
    console.log("Componente actualizado");
  },
};
</script>