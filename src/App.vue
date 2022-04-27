<template>
  <div id="app">
    <b-container>
      <Encabezado />
      <br />
      <br />
      <b-row>
        <b-col md="11" align="right">
          <br />
          <h5 class="text-primary">{{ nombre }}</h5>
        </b-col>
        <b-col md="1" align="left">
          <b-dropdown size="sm" variant="link" no-caret>
            <template #button-content>
              <b-img
                blank-color="#777"
                thumbnail
                width="70"
                height="70"
                :src="foto"
              />
            </template>
            <b-dropdown-item-button @click="downloadPDF()">
              <b-icon icon="download" aria-hidden="true"></b-icon>
              Descargar Manual
            </b-dropdown-item-button>

            <div v-if="mostrar">
              <b-dropdown-divider></b-dropdown-divider>

              <router-link
                :to="{
                  name: 'report',
                  params: { token: this.$route.params.token },
                }"
                style="text-decoration: none"
              >
                <b-dropdown-item-button>
                  <b-icon
                    icon="file-earmark-bar-graph"
                    aria-hidden="true"
                  ></b-icon>
                  Reporteria
                </b-dropdown-item-button>
              </router-link>
              <router-link
                :to="{
                  name: 'consulta',
                  params: { token: this.$route.params.token },
                }"
                style="text-decoration: none"
              >
                <b-dropdown-item-button>
                  <b-icon icon="diagram3" aria-hidden="true"></b-icon>
                  Consultas
                </b-dropdown-item-button>
              </router-link>
            </div>
          </b-dropdown>
        </b-col>
      </b-row>
    </b-container>
    <router-view />
  </div>
</template>

<script>
import Encabezado from "./components/Encabezado.vue";

import axios from "axios";
const cf = require("./DIR");
const url = cf.url + "/acceso";
const url2 = cf.url + "/accessreport";
const descarga = cf.url2 + "/download";
export default {
  name: "App",
  components: {
    Encabezado,
  },
  data() {
    return {
      mostrar: false,
      nombre: "",
      id: "",
      dependencia: "",
      grupo: "",
      foto: "",
    };
  },
  methods: {
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
      let verificar = false;

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
            this.foto = res.token.user.dirFoto;
            this.datos(auxDataUser);
            this.validarAcceso(auxDataUser.userData);
            verificar = true;
          }
        });
      if (verificar == false) {
        this.$router.replace("/bloqueo");
      }
    },
    datos(datos) {
      localStorage.setItem("datos", JSON.stringify(datos));
      var nombrecompleto =
        datos.userData.nombres + " " + datos.userData.apellidos;
      this.nombre = nombrecompleto;
    },
    async validarAcceso(user) {
      const userlist = user;
      const list = {
        uid: userlist.id + "",
        rol: userlist.rol.toUpperCase(),
        grupo: userlist.grupo.toUpperCase(),
        dependencia: userlist.dependencia,
        bitacora: this.bitacora(userlist, "Inicio de sesion en base de datos."),
      };
      await axios.post(url, list).then((data) => {
        const result1 = data.data;
        //console.log(result1);
        if (result1) {
          this.validarAccesorReporte(userlist);
        } else {
          this.$router.replace("/bloqueo");
        }
      });
    },
    async validarAccesorReporte(user) {
      const userlist = user;
      const list = {
        uid: userlist.id + "",
        bitacora: this.bitacora(userlist, "Acceso a Reporteria"),
      };
      await axios.post(url2, list).then((data) => {
        const result1 = data.data;
        //console.log(result1);
        if (result1) {
          this.mostrar = true;
          console.log(this.mostrar);
          console.log("SI TIENE ACCESO");
        } else {
          console.log(this.mostrar);
          console.log("NO TIENE ACCESO");
          this.$router.push({
            name: "consulta",
            params: { token: this.$route.params.token },
          });
        }
      });
    },
    bitacora(user, text) {
      const userlist = user;
      let bitacora = {
        horafecha: new Date(),
        level: 0,
        message: text,
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
  },
  beforeCreated: function () {
    //localStorage.removeItem("datos");
  },
  created() {},
  mounted() {
    this.verToken();
  },
  updated() {
    this.verToken();
    console.log("Componente actualizado");
  },
};
</script>