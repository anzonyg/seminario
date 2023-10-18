<template>
  <v-container>
    <!-- FORMULARIO DE BUSQUEDA DE ESTUDIANTE -->
    <v-row>
      <v-col cols="12">
        <br />
        <h1>Reporteria de Estudiante</h1>
      </v-col>
      <v-col md="4" sm="6" cols="12" align="center">
        <v-select
          :items="tablaEstudianteOptions"
          label="Seleccionar nombre del estudiante"
          v-model="estudiante.ID"
          item-text="nombreSeccion"
          item-value="ID"
          required
        ></v-select>
      </v-col>
      <v-col md="3" sm="6" cols="12" align="center">
        <v-select
          :items="itemsCiclo"
          label="Seleccionar la ciclo"
          v-model="ciclo"
          required
        ></v-select>
      </v-col>
      <v-col md="3" cols="4" align="center">
        <v-select
          :items="itemsBloque"
          label="Seleccionar la bloque"
          v-model="bloque"
          item-text="text"
          item-value="value"
          required
        ></v-select>
      </v-col>
      <v-col md="1" cols="6" align="center">
        <v-btn fab pill @click="validarInput" color="secondary">
          <v-progress-circular
            indeterminate
            :size="25"
            color="light"
            v-show="progressBuscar"
          ></v-progress-circular>
          <v-icon v-show="icoBuscar">mdi-magnify</v-icon>
        </v-btn>
      </v-col>
      <v-col md="1" cols="6" align="center">
        <v-btn
          fab
          @click="generarPDF()"
          pill
          color="primary"
          name="descarga"
          v-show="btDescarga"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <br />

    <!-- RESPUESTA DE BUSQUEDA ESTUDIANTE -->
    <v-container id="cuadro1" v-if="respuestaBusqueda">
      <v-row>
        <v-col cols="12">
          <div>
            <h3>
              {{ `Nombre Estudiante: ${encabezado.Nombre}` }}
            </h3>
            <h3>
              {{ `Grado: ${encabezado.Grado}` }}
            </h3>
            <h3>
              {{ `Codigo Personal: ${encabezado.Codigo} ` }}
            </h3>
          </div>
        </v-col>
        <v-col cols="12">
          <br />
          <div class="table-responsive">
            <v-data-table :headers="headers" :items="tabla" hide-default-footer>
              <template v-slot:item.Total="{ item }">
                <v-chip :color="getColor(item.Total)" dark>
                  {{ item.Total }}
                </v-chip>
              </template>
            </v-data-table>
          </div>
        </v-col>
        <!--
          <v-col cols="6">
          <div>
            <h3>
              {{ `Actividad 1: ${piePagina.nota1}` }}
            </h3>
            <h3>
              {{ `Actividad 2: ${piePagina.nota2}` }}
            </h3>
            <h3>
              {{ `Actividad 3: ${piePagina.nota3} ` }}
            </h3>
            <h3>
              {{ `Actividad 4: ${piePagina.nota4} ` }}
            </h3>
          </div>
        </v-col>
        <v-col cols="6">
          <div>
            <h3>
              {{ `Recuperacion 1: ${piePagina.renota1}` }}
            </h3>
            <h3>
              {{ `Recuperacion 2: ${piePagina.renota2}` }}
            </h3>
            <h3>
              {{ `Recuperacion 3: ${piePagina.renota3} ` }}
            </h3>
            <h3>
              {{ `Recuperacion 4: ${piePagina.renota4} ` }}
            </h3>
          </div>
        </v-col>
      -->
      </v-row>
      <br />
      <br />
    </v-container>
  </v-container>
</template>
  
  <script>
import swal from "sweetalert";
import axios from "axios";
const cf = require("../DIR");
const url = cf.url + "/ListarEstudiante";
const buscarNota = cf.url + "/ListarNotasAlumno";

export default {
  data() {
    return {
      respuestaBusqueda: false,
      alerta: "",
      btDescarga: false,
      progressBuscar: false,
      icoBuscar: true,

      consultas: [],
      tabla: [],
      consultasEstudiante: [],
      tablaEstudiante: [],
      headers: [
        { text: "Curso", value: "NombreCurso" },
        { text: "Actividad 1", value: "NOTA1" },
        { text: "Recuperacion 1", value: "RENOTA1" },
        { text: "Actividad 2", value: "NOTA2" },
        { text: "Recuperacion 2", value: "RENOTA2" },
        { text: "Actividad 3", value: "NOTA3" },
        { text: "Recuperacion 3", value: "RENOTA3" },
        { text: "Actividad 4", value: "NOTA4" },
        { text: "Recuperacion 4", value: "RENOTA4" },
        { text: "Total", value: "Total" },
      ],
      encabezado: {
        Nombre: "ANZONY",
        Grado: "",
        Codigo: "1234",
      },
      piePagina: {
        nota1: "",
        nota2: "",
        nota3: "",
        nota4: "",
        renota1: "",
        renota2: "",
        renota3: "",
        renota4: "",
      },
      estudiante: {
        ID: "",
      },
      itemsCiclo: [], //selectbox de ciclo
      ciclo: "",
      itemsBloque: [
        { text: "Bloque 1", value: 1 },
        { text: "Bloque 2", value: 2 },
        { text: "Bloque 3", value: 3 },
        { text: "Bloque 4", value: 4 },
      ], //selectbox de bloque
      bloque: "",
      form: {
        bloque: "",
        anio: "",
        idalumno: "",
      },
      form2: {
        bitacora: [],
      },
      respuesta: {
        data: {
          dato_arma: [
            {
              nombre: "Anzony Gonzalez",
              grado: "6to. Primaria",
              seccion: "A",
            },
          ],
          tabla: [
            {
              curso: "Matematica",
              bloque1: "21",
              bloque2: "22",
              bloque3: "19",
              bloque4: "20",
              promedio: "21",
            },
            {
              curso: "Lenguaje",
              bloque1: "15",
              bloque2: "16",
              bloque3: "25",
              bloque4: "15",
              promedio: "18",
            },
            {
              curso: "Ciencias Sociales",
              bloque1: "9",
              bloque2: "15",
              bloque3: "7",
              bloque4: "5",
              promedio: "9",
            },
            // ... (otras entradas de tabla)
          ],
          valid: true,
        },
        // ...
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
    onRowSelected(items) {
      this.selected = items;
    },
    async buscarEstudiante() {
      await axios.post(url).then((data) => {
        // Limpieza de datos
        this.tablaEstudiante = [];

        // Asignar nuevos valores
        this.consultasEstudiante = data.data;
        console.log(this.consultasEstudiante);

        this.tablaEstudiante = this.consultasEstudiante.tabla;
        console.log(this.tablaEstudiante);
        this.itemsCiclo = this.generarArrayDeAnios();
      });
      // Validar datos
      this.validarRestEstudiante();
    },

    async buscarcuadro() {
      this.progressBuscar = true;
      this.icoBuscar = false;
      console.log(this.form);
      await axios.post(buscarNota, this.form).then((data) => {
        // Limpieza de datos
        this.tabla = [];

        // Asignar nuevos valores
        this.consultas = data.data;
        this.tabla = this.consultas.tabla;
        this.encabezado.Nombre = this.tabla[0].Nombre;
        this.encabezado.Grado = this.tabla[0].Grado;
        this.encabezado.Codigo = this.tabla[0].Codigo_personal;
        /*this.piePagina.nota1 = this.tabla[0].DESCRIPCIONNOTA1;
        this.piePagina.nota2 = this.tabla[0].DESCRIPCIONNOTA2;
        this.piePagina.nota3 = this.tabla[0].DESCRIPCIONNOTA3;
        this.piePagina.nota4 = this.tabla[0].DESCRIPCIONNOTA4;
        this.piePagina.renota1 = this.tabla[0].DESCRIPCIONRENOTA1;
        this.piePagina.renota2 = this.tabla[0].DESCRIPCIONRENOTA2;
        this.piePagina.renota3 = this.tabla[0].DESCRIPCIONRENOTA3;
        this.piePagina.renota4 = this.tabla[0].DESCRIPCIONRENOTA4;*/
        console.log(this.tabla);
      });
      // Validar datos
      this.validarRest();
    },

    async cuadropdf() {
      // ... (código para descargar PDF)
    },
    validarInput() {
      if (
        this.estudiante.ID.length <= 0 ||
        this.ciclo.length <= 0 ||
        this.bloque.length <= 0
      ) {
        this.alerta = "Seleccionar nombre del estudiante, ciclo o bloque.";
        this.makeToast();
        console.log("no validar input");
      } else {
        this.progressBuscar = true;
        this.icoBuscar = false;
        this.formatNotas();
        this.buscarcuadro();
        console.log("validar input");
      }
    },

    validarRestEstudiante() {
      if (this.consultasEstudiante.validar == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
      } else if (this.consultasEstudiante.tabla.length <= 0) {
        this.alerta = "No hay alumnos en la base de datos";
        this.makeToast();
      } else {
        this.icoBuscar = true;
        this.alerta = "Si hay alumnos.";
        this.makeToast();
      }
    },
    validarRest() {
      if (this.consultas.validar == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
        this.btDescarga = false;
        this.progressBuscar = false;
        this.icoBuscar = true;
        this.respuestaBusqueda = false;
      } else if (this.consultas.tabla.length <= 0) {
        this.alerta = "El cuadro no existe en la base de datos";
        this.makeToast();
        this.btDescarga = false;
        this.progressBuscar = false;
        this.icoBuscar = true;
        this.respuestaBusqueda = false;
      } else {
        this.btDescarga = true;
        this.progressBuscar = false;
        this.icoBuscar = true;
        this.respuestaBusqueda = true;
      }
    },

    getColor(nota) {
      if (nota > 80) return "green";
      else if (nota > 60) return "orange";
      else return "red";
    },
    generarArrayDeAnios() {
      const anioActual = new Date().getFullYear();
      const arrayDeAnios = [];

      for (let anio = 2023; anio <= anioActual; anio++) {
        arrayDeAnios.push(anio);
      }
      return arrayDeAnios;
    },
    formatNotas() {
      this.form.bloque = this.bloque;
      this.form.anio = this.ciclo;
      this.form.idalumno = this.estudiante.ID;
    },
    generarPDF() {
      console.log("validar descarga");
    },
  },
  computed: {
    tablaEstudianteOptions() {
      return Object.values(this.tablaEstudiante).map((item) => ({
        ...item,
        nombreSeccion: `${item.Nombre} ${item.Apellido}`,
      }));
    },
  },
  created() {
    this.buscarEstudiante();
  },
};
</script>
  