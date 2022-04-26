<template>
  <div>
    <b-row>
      <b-col md="10">
        <b-form-input
          type="text"
          v-model="form.id_expediente"
          v-on:keyup.enter="justificar()"
          placeholder="Ingrese número de expediente: MP001-2021-123"
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
          <p>{{alerta}}</p>
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
    <table class="table" id="tabla2">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Cuadro</th>
          <th scope="col">Referencia MP</th>
          <th scope="col">Correlativo</th>
          <th scope="col">Indicio</th>
          <th scope="col">Dictamen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tabla, index) in tabla" :key="index">
          <th scope="row" v-text="tabla.index"></th>
          <td v-text="tabla.dato"></td>
          <td v-text="tabla.referencia"></td>
          <td v-text="tabla.correlativo"></td>
          <td v-text="tabla.indicio"></td>
          <td v-text="tabla.dictamen"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
const cf = require('../DIR')


const url = cf.url+"/expediente";

export default {
  data() {
    return {
      alerta: "",
      dismissSecs: 4,
      dismissCountDown: 0,
      showDismissibleAlert: false,
      dismissSecs3: 4,
      dismissCountDown3: 0,
      showDismissibleAlert3: false,
      mostrar: false, //spinner de buscar
      mostrar2: true,  //icon de buscar
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
      headers:{
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
    async buscarexpediente() {
      const storage = JSON.parse(localStorage.getItem("datos"));
      this.mostrar = true;
      this.mostrar2 = false;
      if (this.validarform()) {
        this.headers.Authorization = storage.token;
        this.form1.token = storage.token;
        this.bitacora();
        await axios.post(url, this.form1, {
            headers: {
              authorization: storage.token,
              idaction: "616da60877ce5e828b018de1",
            },
          }).then((data) => {
          this.consultas = data.data;
          this.tabla = [];
          this.validarcuadro();
          //console.log(this.consultas);
        });
      } else {
        this.alerta = "El formato del expediente es incorrecito: MP001-2021-123";
        this.showAlert();
        this.mostrar = false;
        this.mostrar2 = true;
      } 
    },
    validarform() {
      const idexpediente = this.form.id_expediente;
      const expearray = idexpediente.split("-");
      if (expearray.length >= 3) {
        const idfiscalia = expearray[0];
        const idanio = expearray[1];
        const idreferencia = expearray[2];
        this.form1.mp = idfiscalia;
        this.form1.anio = idanio;
        this.form1.num = idreferencia;
        return true;
      } else {
        this.tabla = [];
        return false;
      }
    },
    validarcuadro() {
      if(this.consultas.valid == false){
        this.alerta = "El usuario ha expirado.";
        this.showAlert();
        this.mostrar = false;
        this.mostrar2 = true;
        this.mostrar4 = false;
        this.mostrar5 = true;
      }else if (this.consultas.tabla.length <= 0) {
        this.alerta = "El cuadro no existe en la base de datos";
        this.showAlert();
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
     validarcuadro3() {
      this.mostrar6 = true;
      this.mostrar7 = false;
      if (this.justificacion.length > 5) {
        this.buscarexpediente();
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
      const storage = JSON.parse(localStorage.getItem("datos"));
        let bitacora = {
          horafecha: new Date(),
          level: 3,
          message: "Consulta de expediente en base de datos. Justificacíon:  " + this.justificacion,
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
        };
        this.form1.bitacora = bitacora;
    },
  },
};
</script> 