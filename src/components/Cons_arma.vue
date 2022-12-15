<template>
  <div>
    <!--FORMULARIO DE BUSQUEDA DE CUADRO-->
    <b-row>
      <b-col md="8" cols="12" align="center">
        <br />
        <b-form-input
          type="text"
          v-model="form.id_arma"
          v-on:keyup.enter="validarInput()"
          placeholder="Ingrese registro de arma"
          required
        ></b-form-input>
      </b-col>
      <b-col md="4" cols="12" align="center">
        <br />
        <b-button pill v-on:click="validarInput()">
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
    </b-row>

    <!--Modal de Justificacion para descarga de PDF-->
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
      <div class="text-center">
        <b-button
          center
          size="sm"
          variant="outline-info"
          v-on:click="validarJustificacion()"
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
    <!--RESPUESTA DE BUSQUEDA DE CUADRO-->
    <b-table
      id="my-table"
      responsive
      :fields="fields"
      :items="tabla"
      small
    ></b-table>
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
      <b-button variant="outline-primary" align="center">{{ actual }}</b-button>
      <b-button
        :disabled="this.hasNextPage"
        variant="outline-primary"
        align="center"
        v-on:click="despuespage(despues)"
        >{{ despues }}</b-button
      >
      <b-button variant="outline-primary" align="center"
        ><b-icon
          icon="arrow-bar-right"
          aria-hidden="true"
          v-on:click="ultimopage()"
        ></b-icon
      ></b-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";

const cf = require("../DIR");

const url = cf.url + "/arma";

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
          key: "arma",
          label: "Arma",
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
      ],
      limitpage: 1,
      hasPrevPage: true,
      hasNextPage: true,
      antes: "<",
      actual: 1,
      despues: ">",
      perPage: 25,
      mostrar: false, //spinner de buscar
      mostrar2: true, //icon de buscar
      mostrar6: false, //spinner de buscar modal
      mostrar7: true, // icon buscar modal
      consultas: [],
      tabla: [],
      justificacion: "",
      form: {
        id_arma: "",
        bitacora: [],
        token: [],
        page: 1,
      },
      headers: {
        authorization: "",
        idaction: "616da60877ce5e828b018de1",
      },
    };
  },
  methods: {
    makeToast() {
      swal(this.alerta, {
        buttons: false,
        timer: 3000,
        background: "#FAAFFF",
      });
    },

    async buscararma() {
      const storage = JSON.parse(localStorage.getItem("datos"));
      this.mostrar = true;
      this.mostrar2 = false;

      this.headers.authorization = storage.token;
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
          this.validarRest();
          //console.log(this.consultas);
        });
    },
    async buscararma2() {
      const storage = JSON.parse(localStorage.getItem("datos"));
      this.mostrar = true;
      this.mostrar2 = false;

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
          //console.log(this.consultas);
          this.tabla = [];
          this.validarRest();
        });
    },

    validarInput() {
      var serie = "";
      serie = this.form.id_arma + "";
      var regExp = /^[0-9A-Z-]*$/;
      if (serie.length >= 3) {
        if (regExp.test(serie)) {
          this.Mostrarjustificacion();
        } else {
          this.alerta = "Ingresar número correcto de registro del arma.";
          this.makeToast();
        }
      } else {
        this.alerta = "Ingresar número de registro del arma.";
        this.makeToast();
      }
    },

    validarJustificacion() {
      this.mostrar6 = true;
      this.mostrar7 = false;
      if (this.justificacion.length > 5) {
        this.buscararma();
        this.$refs["my-modal2"].hide();
        this.mostrar = false;
        this.mostrar2 = true;
      } else {
        this.alerta = "Ingresar la justificación de la búsqueda.";
        this.makeToast();
      }
      this.mostrar6 = false;
      this.mostrar7 = true;
    },
    validarRest() {
      if (this.consultas.valid == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
        this.mostrar = false;
        this.mostrar2 = true;
        this.tabla = [];
      } else if (this.consultas.tabla.length <= 0) {
        this.alerta = "El registro del arma no existe en la base de datos.";
        this.makeToast();
        this.mostrar = false;
        this.mostrar2 = true;
        this.tabla = [];
      } else {
        this.tabla = this.consultas.tabla;
        this.paginacion();
        this.mostrar = false;
        this.mostrar2 = true;
      }
    },

    Mostrarjustificacion() {
      this.$refs["my-modal2"].show();
      this.mostrar = true;
      this.mostrar2 = false;
    },
    bitacora() {
      const storage = JSON.parse(localStorage.getItem("datos"));
      let bitacora = {
        horafecha: new Date(),
        level: 4,
        message:
          "Consulta de arma en base de datos. Justificacíon:  " +
          this.justificacion,
        codproceso: this.form.id,
        busqueda: this.form.id_arma,
        fiscalia_solicitante: "",
        equipo_solicitante: "",
        nombres: storage.userData.nombres,
        apellidos: storage.userData.apellidos,
        id: storage.userData.id,
        rol: storage.userData.rol,
        grupo: storage.userData.grupo,
        idGrupo: storage.userData.idGrupo,
        nipId: storage.userData.nipId,
        dependencia: storage.userData.dependencia,
        token: storage.token,
      };
      ////console.log(bitacora);
      this.form.bitacora = bitacora;
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
    antespage(page) {
      this.form.page = page;
      this.buscararma2();
    },
    despuespage(page) {
      this.form.page = page;
      this.buscararma2();
    },
    primeropage() {
      this.form.page = 1;
      this.buscararma2();
    },
    ultimopage() {
      this.form.page = this.limitpage;
      this.buscararma2();
    },
  },
  computed: {
    rows() {
      return this.tabla.length;
    },
  },
};
</script> 