<template>
  <div>
    <b-row>
      <b-col md="10">
        <b-form-input
          type="text"
          v-model="form.id_correlativo"
          v-on:keyup.enter="justificar()"
          placeholder="Ingrese número de correlativo: BAL-00-0000"
          required
        ></b-form-input>
      </b-col>
      <b-col md="2">
        <b-button pill v-on:click="justificar()">
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-show="mostrar"
          ></span>
          <b-icon icon="search" v-show="mostrar2" aria-hidden="true"></b-icon>
          Buscar</b-button
        >
      </b-col>
      <b-col md="10">
        <b-alert
          :show="dismissCountDown"
          variant="danger"
          @dismissed="dismissCountDown = 0"
          @dismiss-count-down="countDownChanged"
        >
          <p>{{ alerta }}</p>
        </b-alert>
      </b-col>
    </b-row>
    <b-modal
      ref="my-modal2"
      id="modal-2"
      header-bg-variant="info"
      title="Ingresar Justificacion de Busqueda"
      hide-footer
    >
      <div class="form-group col-12">
        <b-form-group
          label="Justificación:"
          label-for="name-input"
          invalid-feedback="Name is required"
        >
          <b-form-textarea
            id="name-input"
            rows="3"
            v-model="justificacion"
            required
          ></b-form-textarea>
        </b-form-group>
        <br />
      </div>
      <br />
      <b-alert
        :show="dismissCountDown3"
        variant="danger"
        @dismissed="dismissCountDown3 = 0"
        @dismiss-count-down="countDownChanged3"
      >
        <p>Datos Incorrectos!!</p>
      </b-alert>
      <div class="text-center">
        <b-button
          center
          size="sm"
          variant="outline-info"
          v-on:click="validarcuadro3()"
          ><span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-show="mostrar6"
          ></span>
          <b-icon icon="search" aria-hidden="true" v-show="mostrar7"></b-icon>
          Buscar
        </b-button>
      </div>
    </b-modal>
    <br />
    <br />
    <div id="tabla1">
      <b-table id="my-table" :fields="fields" :items="tabla" small></b-table>
      <br />

      <div class="overflow-auto" align="center">
        <b-button
          variant="outline-primary"
          align="center"
          v-on:click="primeropage()"
          ><b-icon icon="arrow-bar-left" aria-hidden="true"></b-icon
        ></b-button>
        <b-button
          :disabled="this.hasPrevPage"
          variant="outline-primary"
          align="center"
          v-on:click="antespage(antes)"
          >{{ antes }}</b-button
        >
        <b-button variant="outline-primary" align="center">{{
          actual
        }}</b-button>
        <b-button
          :disabled="this.hasNextPage"
          variant="outline-primary"
          align="center"
          v-on:click="despuespage(despues)"
          >{{ despues }}</b-button
        >
        <b-button variant="outline-primary" align="center" v-on:click="ultimopage()"
          ><b-icon
            icon="arrow-bar-right"
            aria-hidden="true"
            
          ></b-icon
        ></b-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const cf = require("../DIR");

const url = cf.url + "/correlativo";
export default {
  data() {
    return {
      alerta: "",
      fields: [
        {
          key: "index",
          label: "#",
        },
        {
          key: "dato",
          label: "Cuadro",
        },
        {
          key: "referencia",
          label: "Referencia MP",
        },
        {
          key: "correlativo",
          label: "Correlativo",
        },
        {
          key: "indicio",
          label: "Indicio",
        },
        {
          key: "dictamen",
          label: "Dictamen",
        },
      ],
      limitpage: 1,
      hasPrevPage: true,
      hasNextPage: true,
      antes: "<",
      actual: 1,
      despues: ">",
      perPage: 25,
      currentPage: 1,
      contador: [],
      tabla: [],
      mostrar: false, //spinner de buscar
      mostrar2: true,  //icon de buscar
      mostrar6: false, //spinner de buscar modal
      mostrar7: true, // icon buscar modal
      dismissSecs: 4,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      dismissSecs3: 4,
      dismissCountDown3: 0,
      showDismissibleAlert3: false,
      consultas: [],
      arreporte: [],
      rmax: null,
      num_correlativo: null,
      justificacion: "",
      form: {
        id_correlativo: "",
        bitacora: [],
        token: [],
        page: 1,
      },
      headers: {
        Authorization: "",
        idaction: "",
      },
    };
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    countDownChanged3(dismissCountDown3) {
      this.dismissCountDown3 = dismissCountDown3;
    },
    showAlert3() {
      this.dismissCountDown3 = this.dismissSecs3;
    },
    async buscarcorrelativo() {
      const storage = JSON.parse(localStorage.getItem("datos"));
      this.mostrar = true;
      this.mostrar2 = false;
      if (this.validarform()) {
        this.headers.Authorization = storage.token;
        this.form.token = storage.token;
        this.form.page = 1;
        this.bitacora();
        await axios
          .post(url, this.form, {
            headers: {
              authorization: storage.token,
              idaction: "616da60877ce5e828b018de1",
            },
          })
          .then((data) => {
            this.consultas = data.data;
            this.tabla = [];
            ////console.log(this.consultas);
            this.validarcuadro();
          });
      } else {
        this.alerta = "Caracteres Incorrectos!!";
        this.showAlert();
        this.mostrar = false;
        this.mostrar2 = true;
      }
    },
    async buscarcorrelativo2() {
      const storage = JSON.parse(localStorage.getItem("datos"));
      this.mostrar = true;
      this.mostrar2 = false;
      if (this.validarform()) {
        this.form.token = storage.token;
        this.bitacora();
        await axios
          .post(url, this.form, {
            headers: {
              authorization: storage.token,
              idaction: "616da60877ce5e828b018de1",
            },
          })
          .then((data) => {
            this.consultas = data.data;
            this.tabla = [];
            this.validarcuadro();
            //console.log(this.consultas);
          });
      } else {
        this.alerta = "Caracteres Incorrectos!!";
        this.showAlert();
        this.mostrar = false;
        this.mostrar2 = true;
      }
    },
    paginacion() {
      this.limitpage = this.consultas.pagination.totalPages;
      this.actual = this.consultas.pagination.page;
      this.hasNextPage = this.consultas.pagination.hasNextPage;

      if (this.consultas.pagination.prevPage == null) {
        this.antes = "<";
      } else {
        this.antes = this.consultas.pagination.prevPage;
      }
      if (this.consultas.pagination.nextPage == null) {
        this.despues = ">";
      } else {
        this.despues = this.consultas.pagination.nextPage;
      }

      if (this.consultas.pagination.hasPrevPage == false) {
        this.hasPrevPage = true;
      } else {
        this.hasPrevPage = false;
      }
      if (this.consultas.pagination.hasNextPage == false) {
        this.hasNextPage = true;
      } else {
        this.hasNextPage = false;
      }
    },
    validarform() {
      const idexpediente = this.form.id_correlativo;
      const expearray = idexpediente.split("-");

      if (expearray.length >= 2) {
        const idbal = expearray[0];
        const idanio = parseInt(expearray[1]);
        if (idbal == "BAL") {
          if (idanio >= 1 && idanio < 30) {
            return true;
          } else {
            this.tabla = [];
            return false;
          }
        } else {
          this.tabla = [];
          return false;
        }
      } else {
        this.tabla = [];
        return false;
      }
    },
    validarcuadro() {
      if (this.consultas.valid == false) {
        this.alerta = "El usuario ha expirado.";
        this.showAlert();
        this.mostrar = false;
        this.mostrar2 = true;
        this.mostrar4 = false;
        this.mostrar5 = true;
      } else if (this.consultas.tabla.length <= 0) {
        this.alerta = "El correlativo no existe en la base de datos";
        this.showAlert();
        this.mostrar = false;
        this.mostrar2 = true;
        this.mostrar4 = false;
        this.mostrar5 = true;
      } else {
        this.tabla = this.consultas.tabla;
        this.paginacion();
        this.mostrar = false;
        this.mostrar2 = true;
        this.mostrar4 = false;
        this.mostrar5 = false;
      }
    },
    validarcuadro3() {
      this.mostrar6 = true;
      this.mostrar7 = false;
      if (this.justificacion.length > 5) {
        this.buscarcorrelativo();
        this.$refs["my-modal2"].hide();
        this.mostrar = false;
        this.mostrar2 = true;
      } else {
        
        this.showAlert3();
      }
      this.mostrar6 = false;
      this.mostrar7 = true;
    },
    justificar() {
      this.$refs["my-modal2"].show();
      this.mostrar = true;
      this.mostrar2 = false;
    },
    bitacora() {
      var lista = JSON.parse(localStorage.getItem("datos"));
      let bitacora = {
        horafecha: new Date(),
        level: 2,
        message:
          "Consulta de correlativo en base de datos. Justificacíon:  " + this.justificacion,
        codproceso: this.form.id,
        busqueda: this.form.id_correlativo,
        fiscalia_solicitante: "",
        equipo_solicitante: "",
        nombres: lista.nombres,
        apellidos: lista.apellidos,
        id: lista.id,
        rol: lista.rol,
        grupo: lista.grupo,
        idGrupo: lista.idGrupo,
        nipId: lista.nipId,
        dependencia: lista.dependencia,
        token: lista.token,
      };
      //console.log(bitacora);
      this.form.bitacora = bitacora;
    },
    antespage(page) {
      this.form.page = page;
      this.buscarcorrelativo2();
    },
    despuespage(page) {
      this.form.page = page;
      this.buscarcorrelativo2();
    },
    primeropage() {
      this.form.page = 1;
      this.buscarcorrelativo2();
    },
    ultimopage() {
      this.form.page = this.limitpage;
      this.buscarcorrelativo2();
    },
  },
  computed: {
    rows() {
      return this.tabla.length;
    },
  },
};
</script> 