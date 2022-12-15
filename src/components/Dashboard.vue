<template>
  <div>
    <h1>Dashboard IBIS</h1>
    <br />
    <br />
    <div id="app1">
      <b-row>
        <b-col md="12" cols="12" align="center">
          <div ref="tableau" style="width: 800px; height: 700px"></div>
          <br />
        </b-col>
        <br />
        <br />
        <!--<b-col md="12" cols="12" align="center">
          <div v-html="markDetails"></div>
          <div v-html="filterDetails"></div>
        </b-col>-->
      </b-row>
    </div>
  </div>
</template>

<script>
/* global tableau */
var viz;

import axios from "axios";
const cf = require("../DIR");
const url = cf.url + "/tablero";

export default {
  name: "app1",
  data() {
    return {
      //msg: "Hello Tableau Fans!",
      //url: "http://public.tableau.com/views/RegionalSampleWorkbook/College",
      //url: "https://public.tableau.com/views/Tableau1_16669692219010/Dashboard1?:language=es-ES&publish=yes&:display_count=n&:origin=viz_share_link",
      url: "",
      //url: "http://dactableau/views/ArchivodepruebaAnzony/Region?:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link",
      markDetails: "Information about selected marks displays here.",
      filterDetails: "Information about selected filter displays here.",
      headers: {
        Authorization: "",
        idaction: "",
      },
      form: {
        id_cuadro: "",
        bitacora: [],
        token: [],
      },
    };
  },
  methods: {
    carga(){
      this.tablero()
      
    },

    initViz() {
      var containerDiv = this.$refs.tableau;
      let options = {
        hideTabs: false,
        hideToolbar: true,
        onFirstInteractive: () => {
          this.listenToMarksSelection(), this.listenFilterChange();
        },
      };
      viz = new tableau.Viz(containerDiv, this.url, options);
      return viz;
    },

    async tablero() {
      const storage = JSON.parse(localStorage.getItem("datos"));
      this.headers.Authorization = storage.token;
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
          this.url = data.data + "";
          console.log(this.url);
          this.initViz()
        });
    },

    bitacora() {
      const storage = JSON.parse(localStorage.getItem("datos"));

      let bitacora = {
        horafecha: new Date(),
        level: 9,
        message:
          "Consulta de url para tablero:  ",
        busqueda: "TABLERO IBIS",
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
      this.form.bitacora = bitacora;

      return bitacora;
    },

    // Captura Datos Seleccionados del Tablero
    listenToMarksSelection() {
      console.log(viz);
      viz.addEventListener(
        tableau.TableauEventName.MARKS_SELECTION,
        this.onMarksSelection
      );
      return viz;
    },
    onMarksSelection(marksEvent) {
      return marksEvent.getMarksAsync().then(this.reportSelectedMarks);
    },
    reportSelectedMarks(marks) {
      var html = "";
      console.log(marks);
      for (var markIndex = 0; markIndex < marks.length; markIndex++) {
        var pairs = marks[markIndex].getPairs();
        console.log(pairs);
        html += "<b>Mark " + markIndex + ":</b><ul>";

        for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
          var pair = pairs[pairIndex];
          html += "<li><b>Field Name:</b> " + pair.fieldName;
          html += "<br/><b>Value:</b> " + pair.formattedValue + "</li>";
        }

        html += "</ul>";
      }
      console.log(html);
      this.markDetails = html;
    },

    // Captura Filtros del Tablero
    listenFilterChange() {
      console.log(viz);
      viz.addEventListener(
        tableau.TableauEventName.FILTER_CHANGE,
        this.onFilterSelection
      );
      return viz;
    },
    onFilterSelection(filterEvent) {
      return filterEvent.getFilterAsync().then(function (filter) {
        let values = filter.getAppliedValues();
        //let values = filter.getMax()
        //let values = filter.getMin()
        //let values = filter.getPairs()
        console.log(values);
        this.filterDetails = JSON.stringify(values);
      });
    },
  },
  mounted: function () {
    this.carga();
  },
};
</script>