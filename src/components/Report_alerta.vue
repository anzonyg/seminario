<template>
  <div>
    <b-container>
      <h3>Generar Alertas IBIS</h3>
      <br />
      <p>
        Seleccione las fiscalias o equipos para la verificacion de crecimiento ó
        nuevos cuadros IBIS y generar un reporte Word.
      </p>

      <b-row>
        <b-form-checkbox
          id="checkbox-1"
          v-model="allSelected"
          name="checkbox-1"
          @change="toggleAll"
          >{{ allSelected ? "Deseleccionar Todo" : "Seleccionar Todo" }}
        </b-form-checkbox>
        <br />
        <br />
      </b-row>
      <div class="text-center">
        <b-button v-b-toggle.collapse-1 variant="outline-primary" pill>
          <b-icon icon="graph-up" aria-hidden="true"></b-icon>
          TIAE</b-button
        >

        <b-button v-b-toggle.collapse-2 variant="outline-secondary" pill>
          <img width="30" height="30" src="@/assets/ico_arma.png" />
          UEV</b-button
        >

        <b-button v-b-toggle.collapse-3 variant="outline-success" pill>
          <img width="30" height="30" src="@/assets/ico_mujer.png" />
          FEMICIDIO</b-button
        >
      </div>
      <div class="accordion">
        <b-collapse id="collapse-1" class="mt-2" accordion="my-accordion">
          <b-card>
            <b-form-checkbox
              v-model="selectTIAE"
              :indeterminate="indeterminate0"
              aria-describedby="options[0]"
              aria-controls="options[0]"
              @change="toggleAll0"
              >TRATAMIENTO DE LA INFORMACION DE ANALISIS ESTRATEGICO
            </b-form-checkbox>
            <br />
            <b-row>
              <b-col md="6">
                <b-form-group v-slot="{ ariaDescribedby }">
                  <b-form-checkbox-group
                    v-model="selected0"
                    :options="options[0]"
                    :aria-describedby="ariaDescribedby"
                  ></b-form-checkbox-group>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group v-slot="{ ariaDescribedby }">
                  <b-form-checkbox-group
                    v-model="selected3"
                    :options="options[1]"
                    :aria-describedby="ariaDescribedby"
                  ></b-form-checkbox-group>
                </b-form-group>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>

        <b-collapse id="collapse-2" class="mt-2" accordion="my-accordion">
          <b-card>
            <b-form-checkbox
              id="checkbox-3"
              v-model="selectUEV"
              :indeterminate="indeterminate1"
              aria-describedby="options[0]"
              aria-controls="options[0]"
              @change="toggleAll1"
              >Fiscalia Delitos Contra la Vida
            </b-form-checkbox>
            <br />
            <b-form-group v-slot="{ ariaDescribedby }">
              <b-form-checkbox-group
                v-model="selected1"
                :options="options[2]"
                :aria-describedby="ariaDescribedby"
              ></b-form-checkbox-group>
            </b-form-group>
          </b-card>
        </b-collapse>

        <b-collapse id="collapse-3" class="mt-2" accordion="my-accordion">
          <b-card>
            <b-form-checkbox
              id="checkbox-2"
              v-model="selectfem"
              :indeterminate="indeterminate2"
              aria-describedby="options[0]"
              aria-controls="options[0]"
              @change="toggleAll2"
              >Fiscalia Contra el Delito de Femicidio
            </b-form-checkbox>
            <br />
            <b-form-group v-slot="{ ariaDescribedby }">
              <b-form-checkbox-group
                v-model="selected2"
                :options="options[3]"
                :aria-describedby="ariaDescribedby"
              ></b-form-checkbox-group>
            </b-form-group>
          </b-card>
        </b-collapse>
      </div>
      <!--<br />
      Selected0: <strong>{{ selected0 }}</strong> Selected1:
      <strong>{{ selected1 }}</strong> Selected2:
      <strong>{{ selected2 }}</strong>
      Selected3:
      <strong>{{ selected3 }}</strong>-->
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
                <b-col>{{ row.item.fiscalia }}</b-col>
              </b-row>

              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-right"
                  ><b>Cuadro en Crecimineto:</b></b-col
                >
                <b-col>{{ row.item.fiscalia }}</b-col>
              </b-row>
            </b-card>
          </template>

          <!--Descargar Archivo-->
          <template #cell(Descarga)="row2">
            <b-button
              pill
              variant="outline-info"
              @click="info(row2.item, row2.index)"
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
import { PdfMakeWrapper, Table, Columns, Txt } from "pdfmake-wrapper";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

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
      mostrar4: true,
      mostrar5: false,
      modalShow: false,
      fields: [
        "#",
        { key: "fiscalia", label: "fiscalia" },
        { key: "c_nuevo_tamaño", label: "Cuadros Nuevos" },
        { key: "c_crecer_tamaño", label: "Cuadros en Crecimiento" },
        "Detalle",
        "Descarga",
      ],
      tablaFiscalia: [],
      selected: [],
      form: {
        fecha1: "",
        fecha2: new Date(),
        fiscalia: "",
      },
      fiscalia: [[], [], [], []],
      max: new Date(),
      consultas: [],
      selected0: [],
      selected1: [],
      selected2: [],
      selected3: [],
      options: [
        [
          { text: "FISCALIA CONTRA EXTORSIONES", value: "EXTORSIONES" },
          {
            text: "FISCALIA DE ADOLESCENTES EN CONFLICTO CON LA LEY, PENAL, GUATEMALA",
            value: "ADOLES_GT",
          },
          {
            text: "FISCALIA DE DISTRITO DE BAJA VERAPAZ",
            value: "DISTRITO_B_VERAPAZ",
          },
          {
            text: "FISCALIA DE LA NIÑEZ Y ADOLESCENCIA, GUATEMALA",
            value: "NIÑEZ_ADOLES_GT",
          },
          {
            text: "FISCALIA DE SECCION CONTRA EL CRIMEN ORGANIZADO",
            value: "CRIMEN_ORGANIZADO",
          },
          {
            text: "FISCALIA DE SECCION CONTRA LA CORRUPCIÓN",
            value: "CORRUPCION",
          },
          {
            text: "FISCALÍA DE SECCION DE DELITOS DE NARCOACTIVIDAD, GUATEMALA",
            value: "NARCO_GT",
          },
          {
            text: "FISCALÍA DE SECCIÓN DE DELITOS DE NARCOACTIVIDAD, QUETZALTENANGO",
            value: "NARCO_QUETZALTENANGO",
          },
          { text: "FISCALIA DISTRITAL ALTA VERAPAZ", value: "A_VERAPAZ" },
          { text: "FISCALIA DISTRITAL DE CHIMALTENANGO", value: "CHIMALTE" },
          { text: "FISCALIA DISTRITAL DE CHIQUIMULA", value: "CHIQUIM" },
          { text: "FISCALIA DISTRITAL DE ESCUINTLA", value: "ESCUINT" },
          { text: "FISCALIA DISTRITAL DE HUEHUETENANGO", value: "HUEHUE" },
          { text: "FISCALIA DISTRITAL DE JALAPA", value: "JALAPA" },
          { text: "FISCALIA DISTRITAL DE JUTIAPA", value: "JUTIAPA" },
          {
            text: "FISCALIA DISTRITAL DE QUETZALTENANGO",
            value: "QUETZALTENANGO",
          },
          { text: "FISCALIA DISTRITAL DE QUICHE", value: "QUICHE" },
          { text: "FISCALIA DISTRITAL DE RETALHULEU", value: "REU" },
          { text: "FISCALIA DISTRITAL DE SACATEPEQUEZ", value: "SACATEPE" },
          {
            text: "FISCALIA DISTRITAL DE SAN BENITO, PETEN",
            value: "BENITO_PETEN",
          },
          { text: "FISCALIA DISTRITAL DE SAN MARCOS", value: "S_MARCOS" },
          { text: "FISCALIA DISTRITAL DE SOLOLA", value: "SOLOLA" },
          { text: "FISCALIA DISTRITAL DE SUCHITEPEQUEZ", value: "SUCHI" },
          { text: "FISCALIA DISTRITAL DE TOTONICAPAN", value: "TOTO" },
          { text: "FISCALIA DISTRITAL DE ZACAPA", value: "ZACAPA1" },
          { text: "FISCALIA DISTRITAL DE ZACAPA", value: "ZACAPA2" },
          { text: "FISCALIA DISTRITAL EL PROGRESO", value: "PROGRESO" },
          { text: "FISCALIA DISTRITAL IZABAL", value: "IZABAL" },
          {
            text: "FISCALIA DISTRITAL MALACATÁN, SAN MARCOS",
            value: "MALACATAN_S_MARCOS",
          },
          { text: "FISCALIA DISTRITAL METROPOLITANA", value: "METRO" },
          { text: "FISCALIA DISTRITAL SANTA ROSA", value: "S_ROSA" },
        ],
        [
          {
            text: "FISCALIA MUNICIAPL DE SANTA ELULAIA, HUEHUETENANGO",
            value: "M_S_ELULAIA_HUEHUE",
          },
          {
            text: "FISCALIA MUNICIAPL DE SANTIAGO ATITLÁN, SOLOLA",
            value: "M_SANTIAGO_SOLOLA",
          },
          {
            text: "FISCALIA MUNICIPAL DE AGUA BLANCA, JUTIAPA",
            value: "M_AGUA_BLANCA_JUTIAPA",
          },
          { text: "FISCALIA MUNICIPAL DE AMATITLAN", value: "M_AMATITLAN1" },
          { text: "FISCALIA MUNICIPAL DE AMATITLAN", value: "M_AMATITLAN2" },
          {
            text: "FISCALIA MUNICIPAL DE ATESCATEMPA, JUTIAPA",
            value: "M_ATESCATEMPA_JUTIAPA",
          },
          {
            text: "FISCALIA MUNICIPAL DE CASILLAS, SANTA ROSA",
            value: "M_CASILLAS_S_ROSA",
          },
          { text: "FISCALIA MUNICIPAL DE CHINAUTLA", value: "M_CHINAUTLA" },
          {
            text: "FISCALIA MUNICIPAL DE COATEPEQUE, QUETZALTENANGO",
            value: "M_COATEPEQUE_XELA",
          },
          {
            text: "FISCALIA MUNICIPAL DE ESQUIPULAS, CHIQUIMULA",
            value: "M_ESQUIPULAS_CHIQUIM",
          },
          {
            text: "FISCALIA MUNICIPAL DE GUALAN, ZACAPA",
            value: "M_GUALAN_ZACAPA",
          },
          {
            text: "FISCALIA MUNICIPAL DE JACALTENANGO, HUEHUETENANGO",
            value: "M_JACALTENAGO_HUEHUE",
          },
          {
            text: "FISCALIA MUNICIPAL DE JOCOTAN, CHIQUIMULA",
            value: "M_JOCOTAN_CHIQUIM",
          },
          {
            text: "FISCALIA MUNICIPAL DE LA BLANCA, SAN MARCOS",
            value: "M_BLANCA_S_MARCOS",
          },
          {
            text: "FISCALIA MUNICIPAL DE LA DEMOCRACIA, HUEHUETENANGO",
            value: "M_DEMO_HUEHUE",
          },
          {
            text: "FISCALIA MUNICIPAL DE LA GOMERA, ESCUINTLA",
            value: "M_GOMERA_ESCUINTLA",
          },
          {
            text: "FISCALIA MUNICIPAL DE LA LIBERTAD, PETEN",
            value: "M_LIBERTAD_PETEN",
          },
          {
            text: "FISCALIA MUNICIPAL DE LIVINGSTON, IZABAL",
            value: "M_IZABAL",
          },
          {
            text: "FISCALIA MUNICIPAL DE MELCHOR DE MENCOS, PETEN",
            value: "M_MELCHOR_PETEN",
          },
          { text: "FISCALIA MUNICIPAL DE MIXCO", value: "M_MIXCO" },
          {
            text: "FISCALIA MUNICIPAL DE MORALES, IZABAL",
            value: "M_MORALES_IZABAL",
          },
          {
            text: "FISCALIA MUNICIPAL DE MOYUTA, JUTIAPA",
            value: "M_MOYUTA_JUTIAPA",
          },
          {
            text: "FISCALIA MUNICIPAL DE NEBAJ, QUICHE",
            value: "M_NEBAJ_QUICHE",
          },
          {
            text: "FISCALIA MUNICIPAL DE NUEVA CONCEPCION, ESCUINTLA",
            value: "M_N_CONCEPCION_ESCUINTLA",
          },
          { text: "FISCALIA MUNICIPAL DE PALENCIA", value: "M_PALENCIA" },
          {
            text: "FISCALIA MUNICIPAL DE PATULUL, SUCHITEPEQUEZ",
            value: "M_PATULUL_SUCHI",
          },
          {
            text: "FISCALIA MUNICIPAL DE POPTUN, PETEN",
            value: "M_POPTUN_PETEN",
          },
          {
            text: "FISCALIA MUNICIPAL DE PUERTO SAN JOSE, ESCUINTLA",
            value: "M_S_JOSE_ESCUINTLA",
          },
          {
            text: "FISCALIA MUNICIPAL DE RABINAL, BAJA VERAPAZ",
            value: "M_RABINAL_B_VERAPAZ",
          },
          {
            text: "FISCALIA MUNICIPAL DE SAN JUAN BAUTISTA, SUCHITEPEQUEZ",
            value: "M_S_JUAN_BAUTISTA_SUCHI",
          },
          {
            text: "FISCALIA MUNICIPAL DE SAN JUAN SACATEPEQUEZ",
            value: "M_S-JUAN_SACATEPEQUEZ",
          },
          {
            text: "FISCALIA MUNICIPAL DE SANTA CATALINA LA TINTA, ALTA VERAPAZ",
            value: "M_S_CATALINA_A_VERAPAZ",
          },
          {
            text: "FISCALIA MUNICIPAL DE SANTA CATARIANA PINULA",
            value: "M_S_CATALINA_PINULA",
          },
          {
            text: "FISCALIA MUNICIPAL DE SANTA LUCIA COTZULMALGUAPA, ESCUINTLA",
            value: "M_S_LUCIA_COTZ_ESCUINTLA",
          },
          {
            text: "FISCALIA MUNICIPAL DE SAYAXCHE, PETEN",
            value: "M_SAYAXCHE_PETEN",
          },
          {
            text: "FISCALIA MUNICIPAL DE TACANA, SAN MARCOS",
            value: "M_TACANA_S_MARCOS",
          },
          {
            text: "FISCALIA MUNICIPAL DE TAXISCO, SANTA ROSA",
            value: "M_TAXISCO_S_ROSA",
          },
          {
            text: "FISCALIA MUNICIPAL DE TECUN UMAN, SAN MARCOS",
            value: "M_TECUN_S_MARCOS",
          },
          {
            text: "FISCALIA MUNICIPAL DE VILLA CANALES, GUATEMALA",
            value: "M_V_CANALES_GT",
          },
          {
            text: "FISCALIA MUNICIPAL DE VILLA NUEVA, GUATEMALA",
            value: "M_V_NUEVA_GT",
          },
        ],
        [
          { text: "Fiscal de Seccion", value: "FS1" },
          { text: "Fiscal de Seccion Adjunta 1", value: "FSA1" },
          { text: "Fiscal de Seccion Adjunta 2", value: "FSA2" },
          { text: "E1 DES-GIC", value: "5" },
          { text: "E1 EPP-GIC", value: "6" },
          { text: "E2 EPP-GIC", value: "7" },
          { text: "E3 EPP-GIC", value: "8" },
          { text: "E4 EPP-GIC", value: "9" },
          { text: "E5 EPP-GIC", value: "10" },
          { text: "E6 EPP-GIC", value: "11" },
          { text: "E1 DESC-SCC", value: "13" },
          { text: "E1 EPP-SCC", value: "14" },
          { text: "E2 EPP-SCC", value: "15" },
          { text: "E3 EPP-SCC", value: "16" },
          { text: "E4 EPP-SCC", value: "17" },
          { text: "Escuintla", value: "UDIESC" },
        ],
        [
          { text: "Fiscal de Seccion", value: "FS2" },
          { text: "Agencia EPP 1", value: "EPP1" },
          { text: "Agencia EPP 2", value: "EPP2" },
          { text: "Agencia EPP 3", value: "EPP3" },
          { text: "Agencia EPP 4", value: "EPP4" },
          { text: "Agencia EPP 5", value: "EPP5" },
        ],
      ],
      allSelected: false,
      selectTIAE: false,
      selectUEV: false,
      selectfem: false,
      indeterminate0: false,
      indeterminate1: false,
      indeterminate2: false,
    };
  },
  methods: {
    info(item, index) {
      var title = `Row index: ${index}`;
      var content = JSON.stringify(item, null, 2);
      var dato = JSON.parse(content);
      console.log(content);
      console.log(title);
      this.descargarPDF(dato);
    },
    toggleAll(checked) {
      const arreglo0 = this.options[0].slice();
      const valores0 = [];
      arreglo0.forEach((dato) => {
        valores0.push(dato.value);
      });
      this.selected0 = checked ? valores0 : [];
      //console.log(this.selected);

      const arreglo3 = this.options[1].slice();
      const valores3 = [];
      arreglo3.forEach((dato3) => {
        valores3.push(dato3.value);
      });
      this.selected3 = checked ? valores3 : [];

      const arreglo1 = this.options[2].slice();
      const valores1 = [];
      arreglo1.forEach((dato1) => {
        valores1.push(dato1.value);
      });
      this.selected1 = checked ? valores1 : [];
      //console.log(this.selected2);

      const arreglo2 = this.options[3].slice();
      const valores2 = [];
      arreglo2.forEach((dato2) => {
        valores2.push(dato2.value);
      });
      this.selected2 = checked ? valores2 : [];
      //console.log(this.selected2);
    },
    toggleAll0(checked) {
      const arreglo = this.options[0].slice();
      const valores = [];
      arreglo.forEach((dato) => {
        valores.push(dato.value);
      });
      this.selected0 = checked ? valores : [];
      //console.log(this.selected);

      const arreglo3 = this.options[1].slice();
      const valores3 = [];
      arreglo3.forEach((dato3) => {
        valores3.push(dato3.value);
      });
      this.selected3 = checked ? valores3 : [];
    },
    toggleAll1(checked) {
      const arreglo = this.options[2].slice();
      const valores = [];
      arreglo.forEach((dato) => {
        valores.push(dato.value);
      });
      this.selected1 = checked ? valores : [];
      //console.log(this.selected);
    },
    toggleAll2(checked) {
      const arreglo = this.options[3].slice();
      const valores = [];
      arreglo.forEach((dato) => {
        valores.push(dato.value);
      });
      this.selected2 = checked ? valores : [];
      //console.log(this.selected2);
    },
    async buscarAlerta() {
      this.mostrar = true;
      this.mostrar2 = false;

      //await axios.post(url, this.form).then((response) => {
      if (this.llenarform()) {
        this.tablaFiscalia = [];
        //console.log(this.fiscalia);
        
            this.form.fiscalia = this.fiscalia;
            console.log(this.form.fiscalia);
            await axios({
              url: url,
              method: "POST",
              data: this.form,
            }).then((response) => {
              this.mostrar = false;
              this.mostrar2 = true;
              //this.tablaFiscalia.push(response.data);
              //console.log(this.tablaFiscalia);
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
      const content2 = datos
      console.log(content2);
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
    listFiscalia() {
      var cont = 1;
      var list = [];
      for (let i in this.selected0) {
        const lista2 = {
          id: cont,
          fiscalia: this.selected0[i],
        };
        list.push(lista2);
        cont++;
      }

      for (let j in this.selected3) {
        const lista2 = {
          id: cont,
          fiscalia: this.selected3[j],
        };
        list.push(lista2);
        cont++;
      }

      for (let k in this.selected1) {
        const lista2 = {
          id: cont,
          fiscalia: this.selected1[k],
        };
        list.push(lista2);
        cont++;
      }

      for (let l in this.selected2) {
        const lista2 = {
          id: cont,
          fiscalia: this.selected2[l],
        };
        list.push(lista2);
        cont++;
      }
      this.tablaFiscalia = list;
      this.modalShow = !this.modalShow;
    },
    llenarform() {
      if (
        (this.selected0.length <= 0) &
          (this.selected1.length <= 0) &
          (this.selected2.length <= 0) &
          (this.selected3.length <= 0) ||
        this.form.fecha1.length <= 0 ||
        this.form.fecha2.length <= 0
      ) {
        return false;
      } else {
        this.fiscalia[0].push(this.selected0);
        this.fiscalia[1].push(this.selected3);
        this.fiscalia[2].push(this.selected1);
        this.fiscalia[3].push(this.selected2);
        return true;
      }
    },




    async reportSeccion() {
      const fecha1 = new Date();
      var dia = fecha1.getDate();
      var mes = fecha1.getMonth() + 1;
      var anio = fecha1.getFullYear();
      var mesp = this.testmes(mes);

      PdfMakeWrapper.setFonts(pdfFonts);
      const pdf = await new PdfMakeWrapper();

      pdf.pageSize("LETTER");
      pdf.pageMargins([60, 110, 60, 60]);

      var logo = this.imgpdf();

      pdf.styles({
        titulo1: {
          fontSize: 12,
          alignment: "left",
          bold: true,
        },
        titulo2: {
          fontSize: 11,
          alignment: "left",
          bold: true,
        },
        texto2: {
          fontSize: 11,
          alignment: "justify",
        },
        headtabla: {
          fillColor: "#7F8DE0",
          bold: true,
        },
      });

      pdf.pageBreakBefore((currentNode, followingNodesOnPage) => {
        return (
          currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
        );
      });
      pdf.footer((currentPage, pageCount) => {
        return {
          text:
            "pagina " +
            currentPage.toString() +
            " de " +
            pageCount +
            "        .",
          fontSize: 9,
          alignment: "right",
        };
      });

      pdf.header({
        margin: [0, 20],
        image: logo,
        width: 90,
        height: 75,
        alignment: "center",
      });

      pdf.add({
        text: "Guatemala, " + dia + " de " + mesp + " de " + anio,
        fontSize: 12,
        alignment: "right",
      });
      pdf.add(pdf.ln(2));

      pdf.add({ text: "<<Profesion>>", style: "titulo2" });
      pdf.add({ text: "<<Nombre>>", style: "titulo2" });
      pdf.add({ text: "<<Puesto>>", style: "titulo2" });
      pdf.add({ text: "Fiscalía de Sección", style: "titulo2" });
      pdf.add({
        text: "Fiscalía Contra el Delito de Femicidío",
        style: "titulo2",
      });
      pdf.add({ text: "Ministerio Público", style: "titulo2" });
      pdf.add(pdf.ln(2));

      pdf.add({
        text:
          "El motivo del presente informe es para hacer de su conocimiento los cuadros IBIS nuevos y en crecimiento que según la actualización número " +
          1 +
          " de INACIF generada el " +
          dia +
          " de " +
          mes +
          " de " +
          anio +
          ", están relacionados a expedientes que pertenecen a todas las Unidades de la Fiscalía Contra el Delito de Femicidio.",
        style: "texto2",
      });
      pdf.add(pdf.ln(2));

      pdf.add({
        text:
          "Se detectaron " +
          1 +
          " cuadros nuevos y " +
          2 +
          " cuadros en crecimiento, relacionados a la fiscalía a su cargo:",
        style: "texto2",
      });
      pdf.add(pdf.ln(2));

      pdf.add({
        text: "Actualizacion IBIS <NO REPORTE>",
        style: "titulo1",
        alignment: "center",
      });
      pdf.add(pdf.ln(1));

      pdf.add(
        new Columns([
          new Txt("").width("*").end,
          new Table([
            ["TOTAL DE CUADROS", "5"],
            ["CUADROS NUEVOS", "6"],
            ["CUADROS EN CRECIMIENTO", "11"],
          ]).width("auto").end,
          new Txt("").width("*").end,
        ]).end
      );

      pdf.add(pdf.ln(3));

      pdf.add({ text: "1. Cuadros IBIS nuevos", style: "titulo1" });
      pdf.add(pdf.ln(1));

      pdf.add({
        text: "A continuación, se presenta una tabla en la cual se puntualiza a que unidades de la fiscalía se vinculan los «CUADROS_NUEVOS» cuadros IBIS nuevos.",
        style: "texto2",
      });
      pdf.add(pdf.ln(1));

      pdf.add({
        text: "La tabla contiene 3 columnas, la primera columna denominada “CUADRO” contiene el número de cuadro IBIS relacionado; en la segunda columna denominada “UNIDAD” se consigna la unidad de la fiscalía que tiene uno o más expedientes relacionados al cuadro; y en la tercera columna “ARMA INDIVIDUALIZADA”, se consigna si en el cuadro IBIS ya fue individualizada el arma de fuego o aún está pendiente.",
        style: "texto2",
        pageBreak: "after",
      });

      pdf.add({ text: "Tabla 1. (Cuadros IBIS Nuevos)", style: "titulo1" });
      pdf.add(pdf.ln(1));

      pdf.add(
        new Columns([
          new Txt("").width("*").end,
          new Table([
            [
              {
                text: "CUADRO",
                style: "headtabla",
              },
              { text: "EPP", fillColor: "#7F8DE0", bold: true },
              {
                text: "ARMA INDIVIDUALIZADA",
                style: "headtabla",
              },
            ],
            ["725", "5", "SI"],
            ["856", "2", "NO"],
          ]).width("auto").end,
          new Txt("").width("*").end,
        ]).end
      );
      pdf.add(pdf.ln(2));

      pdf.add({
        text: "1.1.	Tablas resumen de expedientes por Unidad y por agente fiscal y/o auxiliar fiscal responsable:",
        style: "titulo1",
      });
      pdf.add(pdf.ln(1));

      pdf.add(
        new Columns([
          new Txt("").width("*").end,
          new Table([
            [
              {
                text: "CUADRO",
                style: "headtabla",
              },
              {
                text: "EXPEDIENTE MP",
                style: "headtabla",
              },
              {
                text: "ESTADO",
                style: "headtabla",
              },
              {
                text: "RESPONSABLE",
                style: "headtabla",
              },
              {
                text: "EPP",
                style: "headtabla",
              },
            ],
            [
              "725",
              "MP001-0000-0000",
              "EN INVESTIGACIÓN",
              "ANZONY RAFAEL GONZALEZ RIOS",
              "5",
            ],
            [
              "856",
              "MP001-0000-0000",
              "PROCEDIMIENTO INTERMEDIO",
              "JOSE LUIS PEREZ PEREZ",
              "6",
            ],
          ]).width("auto").end,
          new Txt("").width("*").end,
        ]).end
      );
      pdf.add(pdf.ln());

      pdf.add({ text: "2. Cuadros IBIS en crecimiento", style: "titulo1" });
      pdf.add(pdf.ln(1));

      pdf.add({
        text: "A continuación, se presenta una tabla en la cual se puntualiza a que unidades de la fiscalía se vinculan los «CUADROS_CRECIMIENTO» cuadros IBIS en crecimiento.",
        style: "texto2",
      });
      pdf.add(pdf.ln(1));

      pdf.add({
        text: "A la tabla se le agrega una columna más, denominada “ARMA EN NUEVA ACTUALIZACIÓN”, en la cual se indica si el arma de fuego del cuadro IBIS que creció fue individualizada en esta nueva actualización.",
        style: "texto2",
      });
      pdf.add(pdf.ln(2));

      pdf.add({
        text: "Tabla 2. (Cuadros IBIS en crecimiento)",
        style: "titulo1",
      });
      pdf.add(pdf.ln(1));

      pdf.add(
        new Columns([
          new Txt("").width("*").end,
          new Table([
            [
              {
                text: "CUADRO",
                style: "headtabla",
              },
              { text: "EPP", fillColor: "#7F8DE0", bold: true },
              {
                text: "ARMA INDIVIDUALIZADA",
                style: "headtabla",
              },
              {
                text: "ARMA EN NUEVA ACTUALIZACION",
                style: "headtabla",
              },
            ],
            ["725", "5", "SI", "NO"],
            ["856", "2", "NO", "NO"],
            ["856", "2", "NO", "NO"],
          ]).width("auto").end,
          new Txt("").width("*").end,
        ]).end
      );
      pdf.add(pdf.ln(2));

      pdf.add({
        text: "2.1.	Tablas resumen de expedientes por Unidad y por agente fiscal y/o auxiliar fiscal responsable:",
        style: "titulo1",
      });
      pdf.add(pdf.ln(1));

      pdf.add(
        new Columns([
          new Txt("").width("*").end,
          new Table([
            [
              {
                text: "CUADRO",
                style: "headtabla",
              },
              {
                text: "EXPEDIENTE MP",
                style: "headtabla",
              },
              {
                text: "ESTADO",
                style: "headtabla",
              },
              {
                text: "RESPONSABLE",
                style: "headtabla",
              },
              {
                text: "EPP",
                style: "headtabla",
              },
            ],
            [
              "725",
              "MP001-0000-0000",
              "EN INVESTIGACIÓN",
              "ANZONY RAFAEL GONZALEZ RIOS",
              "5",
            ],
            [
              "856",
              "MP001-0000-0000",
              "PROCEDIMIENTO INTERMEDIO",
              "JOSE LUIS PEREZ PEREZ",
              "6",
            ],
          ]).width("auto").end,
          new Txt("").width("*").end,
        ]).end
      );
      pdf.add(pdf.ln(2));

      pdf.add({ text: "3.Anexos", style: "titulo1" });
      pdf.add(pdf.ln(1));

      pdf.add({
        text: "Con el objeto de proporcionar a detalle toda la información descrita en el presente informe una impresión de cada cuadro IBIS («TOTAL_CUADROS») mencionado.",
        style: "texto2",
      });
      pdf.add(pdf.ln(2));

      pdf.add("Es cuanto se tiene que informar, deferentemente.");
      pdf.add(pdf.ln(10));

      pdf.add({
        text:
          "Lic. Iván Alejandro Sandoval Ochoa \n" +
          "Analista Profesional I\n" +
          "Unidad de Enlace con la Dirección de Análisis Criminal\n" +
          "Fiscalía De Delitos Contra la Vida y la Integridad de las Personas\n",
        alignment: "center",
        bold: true,
      });

      pdf.create().download();
    },
    async reportEquipo() {
      const fecha1 = new Date();
      var dia = fecha1.getDate();
      var mes = fecha1.getMonth() + 1;
      var anio = fecha1.getFullYear();
      var mesp = this.testmes(mes);

      PdfMakeWrapper.setFonts(pdfFonts);
      const pdf = await new PdfMakeWrapper();

      pdf.pageSize("LETTER");
      pdf.pageMargins([60, 110, 60, 60]);

      var logo = this.imgpdf();

      pdf.styles({
        titulo1: {
          fontSize: 12,
          alignment: "left",
          bold: true,
        },
        titulo2: {
          fontSize: 11,
          alignment: "left",
          bold: true,
        },
        texto2: {
          fontSize: 11,
          alignment: "justify",
        },
        headtabla: {
          fillColor: "#7F8DE0",
          bold: true,
        },
      });

      pdf.pageBreakBefore((currentNode, followingNodesOnPage) => {
        return (
          currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0
        );
      });
      pdf.footer((currentPage, pageCount) => {
        return {
          text:
            "pagina " +
            currentPage.toString() +
            " de " +
            pageCount +
            "        .",
          fontSize: 9,
          alignment: "right",
        };
      });

      pdf.header({
        margin: [0, 20],
        image: logo,
        width: 90,
        height: 75,
        alignment: "center",
      });

      pdf.add({
        text: "Guatemala, " + dia + " de " + mesp + " de " + anio,
        fontSize: 12,
        alignment: "right",
      });
      pdf.add(pdf.ln(2));

      pdf.add({ text: "<<Profesion>>", style: "titulo2" });
      pdf.add({ text: "<<Nombre>>", style: "titulo2" });
      pdf.add({ text: "<<Puesto>>", style: "titulo2" });
      pdf.add({ text: "Agencia EPP", style: "titulo2" });
      pdf.add({
        text: "Fiscalía Contra el Delito de Femicidío",
        style: "titulo2",
      });
      pdf.add({ text: "Ministerio Público", style: "titulo2" });
      pdf.add(pdf.ln(2));

      pdf.add({
        text:
          "El motivo del presente informe es para hacer de su conocimiento los cuadros IBIS nuevos y en crecimiento que según la actualización número " +
          1 +
          " de INACIF generada el " +
          dia +
          " de " +
          mes +
          " de " +
          anio +
          ", están relacionados a expedientes que pertenecen a todas las Unidades de la Fiscalía Contra el Delito de Femicidio.",
        style: "texto2",
      });
      pdf.add(pdf.ln(2));

      pdf.add({
        text: "Actualizacion IBIS <NO REPORTE>",
        style: "titulo1",
        alignment: "center",
      });
      pdf.add(pdf.ln(1));

      pdf.add(
        new Columns([
          new Txt("").width("*").end,
          new Table([
            ["TOTAL DE CUADROS", "5"],
            ["CUADROS NUEVOS", "6"],
            ["CUADROS EN CRECIMIENTO", "11"],
          ]).width("auto").end,
          new Txt("").width("*").end,
        ]).end
      );
      pdf.add(pdf.ln(3));

      pdf.add({
        text: "1.Cuadros IBIS nuevos",
        style: "titulo1",
      });
      pdf.add(pdf.ln(1));

      pdf.add(
        new Columns([
          new Txt("").width("*").end,
          new Table([
            [
              {
                text: "CUADRO",
                style: "headtabla",
              },
              {
                text: "EXPEDIENTE MP",
                style: "headtabla",
              },
              {
                text: "ESTADO",
                style: "headtabla",
              },
              {
                text: "RESPONSABLE",
                style: "headtabla",
              },
              {
                text: "EPP",
                style: "headtabla",
              },
            ],
            [
              "725",
              "MP001-0000-0000",
              "EN INVESTIGACIÓN",
              "ANZONY RAFAEL GONZALEZ RIOS",
              "5",
            ],
            [
              "856",
              "MP001-0000-0000",
              "PROCEDIMIENTO INTERMEDIO",
              "JOSE LUIS PEREZ PEREZ",
              "6",
            ],
            [
              "725",
              "MP001-0000-0000",
              "EN INVESTIGACIÓN",
              "ANZONY RAFAEL GONZALEZ RIOS",
              "5",
            ],
          ]).width("auto").end,
          new Txt("").width("*").end,
        ]).end
      );
      pdf.add(pdf.ln(3));

      pdf.add({
        text: "2.Cuadros IBIS en crecimiento",
        style: "titulo1",
      });
      pdf.add(pdf.ln(1));

      pdf.add(
        new Columns([
          new Txt("").width("*").end,
          new Table([
            [
              {
                text: "CUADRO",
                style: "headtabla",
              },
              {
                text: "EXPEDIENTE MP",
                style: "headtabla",
              },
              {
                text: "ESTADO",
                style: "headtabla",
              },
              {
                text: "RESPONSABLE",
                style: "headtabla",
              },
              {
                text: "EPP",
                style: "headtabla",
              },
            ],
            [
              "725",
              "MP001-0000-0000",
              "EN INVESTIGACIÓN",
              "ANZONY RAFAEL GONZALEZ RIOS",
              "5",
            ],
            [
              "856",
              "MP001-0000-0000",
              "PROCEDIMIENTO INTERMEDIO",
              "JOSE LUIS PEREZ PEREZ",
              "6",
            ],
          ]).width("auto").end,
          new Txt("").width("*").end,
        ]).end
      );
      pdf.add(pdf.ln(2));

      pdf.add({ text: "3.Anexos", style: "titulo1" });
      pdf.add(pdf.ln(1));

      pdf.add({
        text: "Con el objeto de proporcionar a detalle toda la información descrita en el presente informe una impresión de cada cuadro IBIS («TOTAL_CUADROS») mencionado.",
        style: "texto2",
      });
      pdf.add(pdf.ln(1));

      pdf.add({
        text:
          "Así también se informa que el día " +
          dia +
          " de " +
          mesp +
          " de " +
          anio +
          ", se remitieron informes a todos los agentes fiscales encargados de todas las Unidades de la Fiscalía, en los que se brindó la alerta de los cuadros IBIS relacionados a expedientes asignados al personal de cada una de las Unidades respectivas, por lo que se adjunta al presente informe, copia de recibido por cada Unidad. ",
        style: "texto2",
      });
      pdf.add(pdf.ln(2));

      pdf.add("Es cuanto se tiene que informar, deferentemente.");
      pdf.add(pdf.ln(10));

      pdf.add({
        text:
          "Lic. Iván Alejandro Sandoval Ochoa \n" +
          "Analista Profesional I\n" +
          "Unidad de Enlace con la Dirección de Análisis Criminal\n" +
          "Fiscalía De Delitos Contra la Vida y la Integridad de las Personas\n",
        alignment: "center",
        bold: true,
      });

      pdf.create("EPP1").download();
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
  watch: {
    selected0(dato) {
      //console.log(dato);
      //console.log(this.selected);
      if (dato.length === 0) {
        //console.log(dato + "valor 0");
        this.allSelected = false;
        this.selectTIAE = false;

        this.indeterminate = false;
      } else if (dato.length === this.options[0].length) {
        this.selectTIAE = true;

        this.indeterminate = false;
        //console.log(dato + "valor 15");
      } else {
        this.indeterminate = true;
        this.allSelected = false;
        this.selectTIAE = false;
        //console.log(dato + "valor ");
      }
    },
    selected1(dato) {
      //console.log(dato);
      //console.log(this.selected);
      if (dato.length === 0) {
        //console.log(dato + "valor 0");
        this.allSelected = false;
        this.selectUEV = false;
        this.indeterminate1 = false;
      } else if (dato.length === this.options[2].length) {
        this.selectUEV = true;
        this.indeterminate1 = false;
        //console.log(dato + "valor 15");
      } else {
        this.indeterminate1 = true;
        this.allSelected = false;
        this.selectUEV = false;
        //console.log(dato + "valor ");
      }
    },
    selected2(dato) {
      if (dato.length === 0) {
        this.selectfem = false;
        this.allSelected = false;
        this.indeterminate2 = false;
      } else if (dato.length === this.options[3].length) {
        this.selectfem = true;
        this.indeterminate2 = false;
      } else {
        this.indeterminate2 = true;
        this.selectfem = false;
        this.allSelected = false;
      }
    },
    selected3(dato) {
      //console.log(dato);
      //console.log(this.selected);
      if (dato.length === 0) {
        //console.log(dato + "valor 0");
        this.allSelected = false;
        this.selectTIAE = false;

        this.indeterminate = false;
      } else if (dato.length === this.options[1].length) {
        this.selectTIAE = true;

        this.indeterminate = false;
        //console.log(dato + "valor 15");
      } else {
        this.indeterminate = true;
        this.allSelected = false;
        this.selectTIAE = false;
        //console.log(dato + "valor ");
      }
    },
  },
};
</script>