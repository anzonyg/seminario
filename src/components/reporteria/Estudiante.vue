<template>
  <v-container>
    <!-- FORMULARIO DE BUSQUEDA DE ESTUDIANTE -->
    <v-row>
      <v-col cols="12">
        <br />
        <h1>Reporteria de Estudiante</h1>
        <br />
      </v-col>
      <v-col md="8" cols="12" align="center">
        <br />
        <v-text-field
          type="text"
          v-model="form.nombre"
          @keyup.enter="validarInput"
          placeholder="Ingrese nombre del estudiante"
          required
        ></v-text-field>
      </v-col>
      <v-col md="2" cols="6" align="center">
        <br />
        <v-btn pill @click="validarInput" color="secondary">
          <v-progress-circular
            indeterminate
            :size="25"
            color="light"
            v-show="progressBuscar"
          ></v-progress-circular>
          <v-icon v-show="icoBuscar">mdi-magnify</v-icon>
          Buscar
        </v-btn>
      </v-col>
      <v-col md="2" cols="6" align="center">
        <br />
        <v-btn
          @click="generarPDF()"
          pill
          color="primary"
          name="descarga"
          v-show="btDescarga"
        >
          <v-icon>mdi-download</v-icon> Exportar Word
        </v-btn>
      </v-col>
    </v-row>
    <br />

    <!-- RESPUESTA DE BUSQUEDA ESTUDIANTE -->
    <v-container id="cuadro1" v-if="respuestaBusqueda">
      <v-row>
        <v-col cols="6">
          <div class="text-center">
            <v-avatar color="primary" size="128">
              <span class="white--text text-h5">AG</span>
            </v-avatar>
          </div>
        </v-col>
        <v-col
          cols="6"
          v-for="(encabezado, index2) in encabezado"
          :key="index2"
        >
          <div>
            <h3>
              {{ `Nombre Estudiante: ${encabezado.nombre}` }}
            </h3>
            <h3>
              {{ `Grado: ${encabezado.grado}` }}
            </h3>
            <h3>
              {{ `Seccion: ${encabezado.seccion} ` }}
            </h3>
          </div>
        </v-col>
        <v-col cols="12">
          <br />
          <div class="table-responsive">
            <v-data-table :headers="headers" :items="tabla" hide-default-footer>
              <template v-slot:item.promedio="{ item }">
                <v-chip :color="getColor(item.promedio)" dark>
                  {{ item.promedio }}
                </v-chip>
              </template>
            </v-data-table>
          </div>
        </v-col>
      </v-row>
      <br />
      <br />
    </v-container>
  </v-container>
</template>

<script>
import swal from "sweetalert";

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
      headers: [
        { text: "#", value: "index" },
        { text: "Curso", value: "curso" },
        { text: "Nota 1", value: "nota1" },
        { text: "Nota 2", value: "nota2" },
        { text: "Nota 3", value: "nota3" },
        { text: "Nota 4", value: "nota4" },
        { text: "Promedio", value: "promedio" },
      ],
      encabezado: [],
      form: {
        nombre: "",
        bitacora: [],
        token: [],
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
              index: 1,
              curso: "Matematica",
              nota1: "21",
              nota2: "22",
              nota3: "19",
              nota4: "20",
              promedio: "21",
            },
            {
              index: 1,
              curso: "Lenguaje",
              nota1: "15",
              nota2: "16",
              nota3: "25",
              nota4: "15",
              promedio: "18",
            },
            {
              index: 1,
              curso: "Ciencias Sociales",
              nota1: "9",
              nota2: "15",
              nota3: "7",
              nota4: "5",
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
    async buscarcuadro() {
      this.progressBuscar = true;
      this.icoBuscar = false;

      // Limpieza de datos
      this.encabezado = [];
      this.tabla = [];

      // Asignar nuevos valores
      this.consultas = this.respuesta.data;
      this.tabla = this.consultas.tabla;
      this.encabezado = this.consultas.dato_arma;

      // Validar datos
      this.validarRest();
    },
    async cuadropdf() {
      // ... (código para descargar PDF)
    },
    validarInput() {
      if (this.form.nombre.length <= 0) {
        this.alerta = "Ingresar nombre del estudiante.";
        this.makeToast();
        console.log("no validar input");
      } else {
        this.progressBuscar = true;
        this.icoBuscar = false;
        this.buscarcuadro();
        console.log("validar input");
      }
    },

    validarRest() {
      if (this.consultas.valid == false) {
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
      if (nota > 20) return "green";
      else if (nota > 15) return "orange";
      else return "red";
    },
    generarPDF() {
      console.log("validar descarga");
    },
  },
};
</script>
