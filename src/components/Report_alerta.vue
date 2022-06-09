<template>
  <div>
    <b-container>
      <h3>Generar Alertas IBIS</h3>
      <br />
      <p>
        Seleccione las fiscalias o equipos para la verificacion de crecimiento ó
        nuevos cuadros IBIS y generar un reporte Word.
      </p>
      <br />
      <br />

      <div align="center">
        <b-form-group v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            id="radio-slots"
            v-model="form.fiscalia"
            :options="options"
            :aria-describedby="ariaDescribedby"
            name="radio-options-slots"
            plain
          >
          </b-form-radio-group>
        </b-form-group>
      </div>
      <br />
      <br />
      <br />
      <div>
        <b-form>
          <b-row>
            <b-col md="6">
              <label for="example-datepicker">Escoger fecha de inicio</label>
              <b-form-datepicker
                id="example-datepicker"
                v-model="form.fecha1"
                class="mb-2"
                :max="form.fecha2"
                placeholder="Escoge fecha"
                aria-required="true"
              ></b-form-datepicker>
              <!--<p>Value: '{{ form.fecha1 }}'</p>-->
            </b-col>
            <b-col md="6">
              <label for="example-datepicker2">Escoger fecha final</label>
              <b-form-datepicker
                id="example-datepicker2"
                v-model="form.fecha2"
                class="mb-2"
                :min="form.fecha1"
                :max="max"
                placeholder="Escoge fecha"
                aria-required="true"
              ></b-form-datepicker>
              <!--<p>Value: '{{ form.fecha2 }}'</p>
            <p>Value max: '{{ max }}'</p>-->
            </b-col>
          </b-row>
        </b-form>
      </div>
      <br />
      <br />
      <b-col align="center">
        <!--<b-button pill variant="outline-info" @click="descargarPDF()">-->
        <b-button pill variant="outline-info" @click="buscarAlerta()">
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
    </b-container>
    <br />

    <strong>{{ form }}</strong>
    <br />
    <strong>{{ fiscalia }}</strong>

    <div>
      <b-modal
        id="modalPopover"
        v-model="modalShow"
        title="Creacion de Reporte de Alertas IBIS"
        size="xl"
        ok-only
        scrollable
      >
        <b-table striped :fields="fields" hover :items="tablaFiscalia">
          <template #cell(#)="data">
            {{ data.index + 1 }}
          </template>

          <!--Mostrar detalle de busqueda de alertas-->
          <template #cell(Detalle)="row">
            <b-button
              pill
              variant="outline-secondary"
              size="sm"
              @click="row.toggleDetails"
              class="mr-2"
            >
              {{ row.detailsShowing ? "Ocultar" : "Mostrar" }} Detalles
            </b-button>
          </template>

          <template #row-details="row">
            <b-card>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"
                  ><b>Cuadros Nuevos:</b></b-col
                >
                <b-col>{{ row.item.list_nuevo_cuadro }}</b-col>
              </b-row>

              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"
                  ><b>Cuadro en Crecimineto:</b></b-col
                >
                <b-col>{{ row.item.list_crecer_cuadro }}</b-col>
              </b-row>
            </b-card>
          </template>

          <!--Descargar Archivo-->
          <template #cell(Descarga)="row2">
            <b-button
              pill
              variant="outline-info"
              @click="info(row2.item)"
            >
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                v-show="mostrar"
              ></span>
              <b-icon
                icon="download"
                v-show="mostrar2"
                aria-hidden="true"
              ></b-icon>
              Descargar</b-button
            >
          </template>
        </b-table>
        <!--MODALo-->
        <template #modal-footer>
          <div class="w-100" align="right">
            <b-button
              size="sm"
              class="float-right"
              @click="show = false"
              pill
              variant="outline-primary"
            >
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                v-show="mostrar"
              ></span>
              <b-icon
                icon="download"
                v-show="mostrar2"
                aria-hidden="true"
              ></b-icon>
              Descargar Todo
            </b-button>
          </div>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from "axios";


const cf = require("../DIR");
const url = cf.url + "/alerta";
const url2 = cf.url + "/archivo";

export default {
  name: "Reporteria_ibis",
  components: {},
  data() {
    return {
      mostrar: false,
      mostrar2: true,
      modalShow: false,
      fields: [
        "#",
        { key: "fiscalia", label: "Ubicacion Cuadro" },
        { key: "c_nuevo_tamaño", label: "Cuadros Nuevos" },
        { key: "c_crecer_tamaño", label: "Cuadros en Crecimiento" },
        "Detalle",
        "Descarga",
      ],
      tablaFiscalia: [],
      form: {
        fecha1: "",
        fecha2: new Date(),
        fiscalia: "",
        bitacora: [],
      },
      fiscalia: [[], [], [], []],
      max: new Date(),
      consultas: [],
      options: [
        { text: "TIAE", value: "TIAE" },
        { text: "UNIDAD DE ENLACE VIDA", value: "UEV" },
        { text: "UNIDAD DE ENLACE FEMICIDIO", value: "FEM" },
      ],
    };
  },
  methods: {
    info(item) {
      
      var content = JSON.stringify(item, null, 2);
      var dato = JSON.parse(content);
      this.descargarPDF(dato);
    },
    async buscarAlerta() {
      this.mostrar = true;
      this.mostrar2 = false;

      //await axios.post(url, this.form).then((response) => {
      if (this.llenarform()) {
        this.tablaFiscalia = [];
        //console.log(this.fiscalia);
        this.bitacora();
        await axios({
          url: url,
          method: "POST",
          data: this.form,
        }).then((response) => {
          this.mostrar = false;
          this.mostrar2 = true;

          var listData = JSON.stringify(response.data);
          var listData2 = JSON.parse(listData);
          this.tablaFiscalia = listData2;
          
          console.log(response.data);
        });

        this.fiscalia = [[], [], [], []];
        this.modalShow = !this.modalShow;
      } else {
        alert("Ingresar todos los campos!!!");
        this.mostrar = false;
        this.mostrar2 = true;
      }
    },
    async descargarPDF(datos) {
      const content2 = datos;
      await axios({
        url: url2,
        method: "POST",
        data: content2,
        responseType: "blob",
      }).then((response) => {
        this.mostrar = false;
        this.mostrar2 = true;
        this.download(response.data);
      });
    },
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "input.docx");

      document.body.appendChild(link);
      link.click();
    },

    llenarform() {
      if (
        this.form.fiscalia.length <= 0 ||
        this.form.fecha1.length <= 0 ||
        this.form.fecha2.length <= 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    bitacora() {
      var lista = JSON.parse(localStorage.getItem("datos"));
      
      let bitacora = {
        horafecha: new Date(),
        level: 7,
        message:
          "Generar reporte de alertas. Justificacíon:  " /*+ this.justificacion*/,
        busqueda: this.form.fiscalia,
        nombres: lista.userData.nombres,
        apellidos: lista.userData.apellidos,
        id: lista.userData.id,
        rol: lista.userData.rol,
        grupo: lista.userData.grupo,
        idGrupo: lista.userData.idGrupo,
        nipId: lista.userData.nipId,
        dependencia: lista.userData.dependencia,
        token: lista.userData.token,
        infoDB: ""
      };
      //console.log(bitacora);
      this.form.bitacora = bitacora;
    },

    testmes(num) {
      if (num == "1") {
        return "enero";
      } else if (num == "2") {
        return "febrero";
      } else if (num == "3") {
        return "marzo";
      } else if (num == "4") {
        return "abril";
      } else if (num == "5") {
        return "mayo";
      } else if (num == "6") {
        return "junio";
      } else if (num == "7") {
        return "julio";
      } else if (num == "8") {
        return "agosto";
      } else if (num == "9") {
        return "septiembre";
      } else if (num == "10") {
        return "octubre";
      } else if (num == "11") {
        return "noviembre";
      } else if (num == "12") {
        return "diciembre";
      }
    },
  },
};
</script>