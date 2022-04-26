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

            <router-link to="/report" style="text-decoration: none">
              <b-dropdown-item-button @click="alert()">
                <b-icon icon="file-earmark-bar-graph" aria-hidden="true"></b-icon>
                Reporteria
              </b-dropdown-item-button>
            </router-link>
          </b-dropdown>
        </b-col>
      </b-row>
    </b-container>
    <router-view />

    <div v-if="mostrar">
      <Consultas />
    </div>
    <div v-if="mostrar2">
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

import axios from "axios";
const cf = require("./DIR");
const url = cf.url + "/acceso";
const descarga = cf.url2 + "/download";
export default {
  name: "App",
  components: {
    Encabezado,
    Bloqueo,
    Consultas,
  },
  data() {
    return {
      mostrar: false,
      mostrar2: true,
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
    eliminarcache() {
      localStorage.removeItem("datos");
    },
    async downloadPDF() {
      //descarga manual de usuario
      axios({
        url: descarga,
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
          if (res.valid) {
            const auxDataUser = {
              token: this.$route.params.token,
              uid: res.token.user.id,
              userData: res.token.user,
            };
            //console.log(auxDataUser); // ver info
            this.datos(auxDataUser);
            this.validarAcceso(auxDataUser.userData);
          } else {
            this.verificartoken(false);
            //console.log(false);
          }
        });
    },
    bitacora(user) {
      const userlist = user;
      let bitacora = {
        horafecha: new Date(),
        level: 0,
        message: "Inicio de sesion en base de datos.",
        codproceso: "",
        busqueda: "",
        fiscalia_solicitante: "",
        equipo_solicitante: "",
        nombres: userlist.nombres,
        apellidos: userlist.apellidos,
        id: userlist.id,
        rol: userlist.rol,
        grupo: userlist.grupo,
        idGrupo: userlist.idGrupo,
        nipId: userlist.nipId,
        dependencia: userlist.dependencia,
      };
      return bitacora;
    },
    async validarAcceso(user) {
      const userlist = user;
      const list = {
        uid: userlist.id + "",
        rol: userlist.rol.toUpperCase(),
        grupo: userlist.grupo.toUpperCase(),
        dependencia: userlist.dependencia,
        bitacora: this.bitacora(userlist),
      };
      await axios.post(url, list).then((data) => {
        const result1 = data.data;
        //console.log(result1);
        if (result1) {
          this.verificartoken(true);
        } else {
          this.verificartoken(false);
        }
      });
    },
    verificartoken(text) {
      if (text) {
        this.mostrar = true;
        this.mostrar2 = false;
      } else {
        this.mostrar = false;
        this.mostrar2 = true;
      }
    },
    salir() {
      localStorage.removeItem("datos");
      this.mostrar = false;
      this.mostrar2 = true;
      this.sesion = true;
    },
    alert() {
      this.mostrar = false;
      this.mostrar2 = false;
      this.sesion = false;
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