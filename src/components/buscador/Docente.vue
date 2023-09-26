<template>
  <v-container>
    <!-- FORMULARIO DE BUSQUEDA DE DOCENTE -->
    <v-row>
      <v-col cols="12">
        <br />
        <h1>Buscador de Docente</h1>
        <br />
      </v-col>
      <v-col md="10" cols="12" align="center">
        <br />
        <v-text-field
          type="text"
          v-model="form.nombre"
          @keyup.enter="validarInput"
          placeholder="Ingrese nombre del docente"
          required
        ></v-text-field>
      </v-col>
      <v-col md="2" cols="12" align="center">
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
    </v-row>
    <br />

    <!-- RESPUESTA DE BUSQUEDA DOCENTE -->
    <v-container id="cuadro1" v-if="respuestaBusqueda">
      <v-row>
        <v-col cols="12" md="6">
          <div class="text-center">
            <v-avatar color="primary" size="128">
              <span class="white--text text-h5">AG</span>
            </v-avatar>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          v-for="(encabezado, index2) in encabezado"
          :key="index2"
        >
          <div>
            <h3>
              {{ `Nombre: ${encabezado.nombre}  ${encabezado.apellido}` }}
            </h3>
            <h3>
              {{ `Grado: ${encabezado.dpi}` }}
            </h3>
            <h3>
              {{ `Sexo: ${encabezado.sexo} ` }}
            </h3>
            <h3>
              {{ `Grado: ${encabezado.grado} ` }}
            </h3>
            <h3>
              {{ `Seccion: ${encabezado.seccion} ` }}
            </h3>
            <h3>
              {{ `Direccion: ${encabezado.direccion} ` }}
            </h3>
            <h3>
              {{ `Telefono: ${encabezado.telefono} ` }}
            </h3>
            <h3>
              {{ `Fecha de Nacimiento: ${encabezado.fechaNacimiento} ` }}
            </h3>
            <h3>
              {{ `Correo: ${encabezado.correo} ` }}
            </h3>
          </div>
        </v-col>
        <v-col cols="12">
          <br />
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
              nombre: "Anzony Rafael",
              apellido: "Gonzalez Rios",
              dpi: "1234-12345-1234",
              sexo: "M",
              grado: "6to. Primaria",
              seccion: "A",
              direccion: "Villa Nueva",
              telefono: "12345678",
              fechaNacimiento: "01/01/1996",
              correo: "agonzalez@gmail.com",
            },
          ],
          tabla: [{ dato: 1 }, { dato: 2 }],

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
    async buscarDocente() {
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
        this.alerta = "Ingresar nombre del docente.";
        this.makeToast();
        console.log("no validar input");
      } else {
        this.progressBuscar = true;
        this.icoBuscar = false;
        this.buscarDocente();
        console.log("validar input");
      }
    },

    validarRest() {
      if (this.consultas.valid == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();

        this.progressBuscar = false;
        this.icoBuscar = true;
        this.respuestaBusqueda = false;
      } else if (this.consultas.tabla.length <= 0) {
        this.alerta = "El nombre no existe en la base de datos";
        this.makeToast();

        this.progressBuscar = false;
        this.icoBuscar = true;
        this.respuestaBusqueda = false;
      } else {
        this.progressBuscar = false;
        this.icoBuscar = true;
        this.respuestaBusqueda = true;
      }
    },
  },
};
</script>
