<template>
  <div id="app">
    <!--ENCABEZADO-->
    <b-container>
      <Encabezado />
      <br />
      <br />
      <div>
        <b-row>
          <b-col md="10" xl="11" align="right" align-self="end" order="2" order-md="1">
            <br />
            <h4 class="text-primary ">{{ nombre }}</h4>
          </b-col>
          <b-col md="2" xl="1" class="p-0"  align="right" order="1" order-md="2">
            <b-dropdown size="md" variant="link" right text="Right align" no-caret>
              <template #button-content>
                <div v-if="imgmostrar">
                  <b-img
                    blank-color="black"
                    thumbnail
                    width="75%"
                    height= "auto"
                    :src="foto"
                  />
                </div>
                <div v-else>
                  <b-icon icon="person" style="width: 70; height: 70"> </b-icon>
                </div>
              </template>
              <b-dropdown-item-button @click="downloadPDF()">
                <b-icon icon="download" aria-hidden="true"></b-icon>
                Descargar Manual
              </b-dropdown-item-button>

              <div v-if="mostrar">
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item-button @click="link('consulta')">
                  <b-icon icon="diagram3" aria-hidden="true"></b-icon>
                  Consultas
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="link('report')">
                  <b-icon
                    icon="file-earmark-word"
                    aria-hidden="true"
                  ></b-icon>
                  Reporteria
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="link('dashboard')">
                  <b-icon
                    icon="file-earmark-bar-graph"
                    aria-hidden="true"
                  ></b-icon>
                  Dashboard
                </b-dropdown-item-button>
              </div>
            </b-dropdown>
          </b-col>
        </b-row>
      </div>
    </b-container>
    <br/>
    <!--CONTENIDO-->
    <b-container>
      <div v-if="mostrar_Consulta">
        <Consultas />
      </div>
      <div v-else-if="mostrar_Alertas">
        <Alertas />
      </div>
      <div v-else-if="mostrar_Dashboard">
        <Dashboard />
      </div>
      <div v-else-if="mostrar_Bloqueo">
        <Bloqueo />
      </div>
    </b-container>
  </div>
</template>

<script>

import Encabezado from "@/components/Encabezado.vue";
import Consultas from "@/components/Consultas_IBIS.vue";
import Alertas from "@/components/Report_alerta.vue";
import Bloqueo from "@/components/Bloqueo.vue";
import Dashboard from "@/components/Dashboard.vue"

import axios from "axios";
const cf = require("./DIR");
const url = cf.url + "/acceso";
const descarga = cf.url2 + "/download";
export default {
  name: "App",
  components: {
    Encabezado,
    Consultas,
    Alertas,
    Bloqueo,
    Dashboard,
  },
  data() {
    return {
      mostrar: true,
      mostrar_Consulta: true,
      mostrar_Alertas: false,
      mostrar_Bloqueo: false,
      mostrar_Dashboard : false,
      imgmostrar: false,
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
      //console.log(this.$route.params.token);
      await axios
        //.get("http://172.18.230.112:9001/sigeemp/revisarToken/", {
          .get("https://apidac.mp.gob.gt/sigeemp//sigeemp/revisarToken/", {
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
            this.imgmostrar = true;
            localStorage.setItem("datos", JSON.stringify(auxDataUser));
            var nombrecompleto =
              auxDataUser.userData.nombres +
              " " +
              auxDataUser.userData.apellidos;
            this.nombre = nombrecompleto;
            this.validarAcceso(auxDataUser.userData);
            verificar = true;
          }
        });
      //.catch(error => console.log(error))

      if (verificar == false) {
        console.log(verificar);
        this.mostrar_Bloqueo = true;
      }
    },
    async validarAcceso(user) {
      const userlist = user;
      var dato = userlist.grupo;
      if(dato == null){
        dato = userlist.dependencia;
      }
      const list = {
        uid: userlist.id + "",
        rol: userlist.rol.toUpperCase(),
        grupo: dato.toUpperCase(),
        dependencia: userlist.dependencia,
        bitacora: this.bitacora(userlist, "Inicio de sesion en base de datos."),
      };
      await axios.post(url, list).then((data) => {
        const result1 = data.data;
        console.log(result1);
        if (result1 == "report") {
          console.log("acceso a reporte consedido!");
          this.mostrar = true;
          this.mostrar_Consulta = true;
          this.mostrar_Bloqueo = false;
          this.mostrar_Alertas = false;
        } else if (result1 == "consult") {
          console.log("acceso a consulta consedido!");
          this.mostrar_Consulta = true;
          this.mostrar_Bloqueo = false;
          this.mostrar_Alertas = false;
        } else if (result1 == "negativo") {
          console.log("acceso a negativo!");
          this.mostrar_Bloqueo = true;
          this.mostrar_Consulta = false;
          this.mostrar_Alertas = false;
        } else {
          this.mostrar_Bloqueo = true;
          this.mostrar_Consulta = false;
          this.mostrar_Alertas = false;
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

    link(dato) {
      var option = dato;
      //console.log(option);
      if (option == "report") {
        this.mostrar_Consulta = false;
        this.mostrar_Bloqueo = false;
        this.mostrar_Alertas = true;
        this.mostrar_Dashboard = false;
      } else if (option == "consulta") {
        this.mostrar_Consulta = true;
        this.mostrar_Bloqueo = false;
        this.mostrar_Alertas = false;
        this.mostrar_Dashboard = false;
      } else if (option == "dashboard") {
        this.mostrar_Consulta = false;
        this.mostrar_Bloqueo = false;
        this.mostrar_Alertas = false;
        this.mostrar_Dashboard = true;
      }else {
        this.mostrar_Consulta = false;
        this.mostrar_Bloqueo = true;
        this.mostrar_Alertas = false;
        this.mostrar_Dashboard = false;
      }
    },
  },
  created() {
    //console.log("eliminacion de registro!!!");
    localStorage.removeItem("datos");
    /*console.log(this.$route.params.token);
    console.log("inicio montaje!!!");
    console.log(window.location);
    this.verToken();
    console.log(this.$route.params.token + "  " + cont++);*/
  },
  mounted() {
    //console.log(this.$route.params.token + "  " + cont++);
    //console.log("inicio montaje!!!");
    //console.log(window.location);
    
    
    //this.verToken();
  },
  updated() {
    /*console.log("inicio actualizacion!!!");
    this.verToken();
    console.log("actualizado!!!");
    console.log(this.$route.params.token + "  " + cont++);*/
  },
};
</script>