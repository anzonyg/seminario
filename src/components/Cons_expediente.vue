<template>
  <div>
    <!--FORMULARIO DE BUSQUEDA DE CUADRO-->
    <b-row>
      <b-col md="8" cols="12" align="center">
        <br />
        <b-form-input
          type="text"
          v-model="form.id_expediente"
          v-on:keyup.enter="validarInput()"
          placeholder="Ingrese número de expediente: MP001-2021-123"
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

    <!--Modal de Justificacion para la busqueda-->
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
    <div class="table-responsive">
      <table class="table" id="tabla2">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Cuadro</th>
            <th scope="col">Referencia MP</th>
            <th scope="col">Correlativo</th>
            <th scope="col">Indicio</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tabla, index) in tabla" :key="index">
            <th scope="row" v-text="tabla.index"></th>
            <td v-text="tabla.dato"></td>
            <td v-text="tabla.referencia"></td>
            <td v-text="tabla.correlativo"></td>
            <td v-text="tabla.indicio"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";

const cf = require("../DIR");

const url = cf.url + "/expediente";

export default {
  data() {
    return {
      alerta: "",
      mostrar: false, //spinner de buscar
      mostrar2: true, //icon de buscar
      mostrar6: false, //spinner de buscar modal
      mostrar7: true, // icon buscar modal
      consultas: [],
      tabla: [],
      form: {
        id_expediente: "",
      },
      justificacion: "",
      form1: {
        mp: "",
        anio: "",
        num: "",
        bitacora: [],
        token: [],
      },
      headers: {
        Authorization: "",
        idaction: "",
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

    async buscarexpediente() {
      const storage = JSON.parse(localStorage.getItem("datos"));
      this.mostrar = true;
      this.mostrar2 = false;
      this.headers.Authorization = storage.token;
      this.form1.token = storage.token;
      this.bitacora();
      await axios
        .post(url, this.form1, {
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

    validarInput() {
      const idexpediente = this.form.id_expediente;
      const expearray = idexpediente.split("-");
      if (this.form.id_expediente.length > 0) {
        if (expearray.length >= 3) {
          const idfiscalia = expearray[0];
          const idanio = expearray[1];
          const idreferencia = expearray[2];
          this.form1.mp = idfiscalia;
          this.form1.anio = idanio;
          this.form1.num = idreferencia;
          this.Mostrarjustificacion();
        } else {
          this.tabla = [];
          this.alerta = "Ingresar el expediente con el formato MP001-2021-123.";
          this.makeToast();
        }
      } else {
        this.alerta = "Ingresar el expediente.";
        this.makeToast();
      }
    },
    validarJustificacion() {
      this.mostrar6 = true;
      this.mostrar7 = false;
      if (this.justificacion.length > 5) {
        this.buscarexpediente();
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
        this.mostrar4 = false;
        this.mostrar5 = true;
      } else if (this.consultas.tabla.length <= 0) {
        this.alerta = "El expediente no existe en la base de datos";
        this.makeToast();
        this.mostrar = false;
        this.mostrar2 = true;
        this.mostrar4 = false;
        this.mostrar5 = true;
      } else {
        this.tabla = this.consultas.tabla;
        this.mostrar = false;
        this.mostrar2 = true;
        this.mostrar4 = false;
        this.mostrar5 = true;
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
        level: 3,
        message:
          "Consulta de expediente en base de datos. Justificacíon:  " +
          this.justificacion,
        codproceso: this.form1.id,
        busqueda: this.form.id_expediente,
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
        infoDB: "",
      };
      this.form1.bitacora = bitacora;
    },
  },
};
</script> 