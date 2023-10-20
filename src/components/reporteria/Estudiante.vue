<template>
  <v-container>
    <!-- FORMULARIO DE BUSQUEDA DE ESTUDIANTE -->
    <v-row>
      <v-col cols="12">
        <br />
        <h1>Reporteria de Estudiante</h1>
      </v-col>
    </v-row>
    <!-- FORMULARIO BUSQUEDA DE MATERIA -->
    <v-row v-if="respuestaBusquedaGrado">
      <v-col md="9" sm="12" cols="12" align="center">
        <v-select
          :items="tablaGradoOptions"
          label="Seleccionar grado y seccion"
          v-model="grado.ID"
          item-text="nombreSeccion"
          item-value="ID"
          required
        ></v-select>
      </v-col>
      <v-col md="3" cols="12" align="center">
        <v-btn pill @click="validarInputGrado" color="secondary">
          <v-progress-circular
            indeterminate
            :size="25"
            color="light"
            v-show="progressBuscarGrado"
          ></v-progress-circular>
          <v-icon v-show="icoBuscarGrado">mdi-magnify</v-icon>
          Buscar
        </v-btn>
      </v-col>
    </v-row>
    <br />
    <!-- FORMULARIO DE BUSQUEDA DE ESTUDIANTE -->
    <v-row v-if="respuestaBusquedaMateria">
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
const uGrado = cf.url + "/ListarGrado";
const url = cf.url + "/ListarEstudianteGrado";
const url2 = cf.url + "/Documentos";
const buscarNota = cf.url + "/ListarNotasAlumno";

export default {
  data() {
    return {
      respuestaBusqueda: false,
      alerta: "",
      btDescarga: false,
      progressBuscar: false,
      icoBuscar: true,

      cicloVal: true,
      progressBuscarGrado: false, //icono spiner para boton buscar grado
      icoBuscarGrado: true, //icono buscar para boton buscar grado
      consultasGrado: [], // ingresa datos del backend
      tablaGrado: [], //selectbox de grado
      grado: {
        ID: "",
      }, // valor que se selecciono en selectbox de grado
      respuestaBusquedaGrado: false,
      formGrado1: {
        Grado: "",
      },

      progressBuscarMateria: false, //icono spiner para boton buscar materia
      icoBuscarMateria: true, //icono buscar para boton buscar materia
      consultasMateria: [], // ingresa datos del backend
      itemsMateria: [], //selectbox de materia
      materia: "", // valor que se selecciono en selectbox de materia
      respuestaBusquedaMateria: false,

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
    validraAdmin() {
      var datos = JSON.parse(localStorage.getItem("datos"));
      if (datos.idTipo == 1) {
        this.buscarGrado();
        this.respuestaBusquedaGrado = true;
        this.respuestaBusquedaMateria = false;
        this.cicloVal = true;
      } else {
        this.respuestaBusquedaGrado = false;
        this.respuestaBusquedaMateria = true;
        this.cicloVal = false;
        this.formGrado1.Grado = datos.Id_grado + "";
        this.buscarEstudiante();
      }
    },
    async buscarGrado() {
      await axios.post(uGrado, this.formEditar).then((data) => {
        // Limpieza de datos
        this.encabezadoGrado = [];
        this.tablaGrado = [];

        // Asignar nuevos valores
        this.consultasGrado = data.data;
        this.tablaGrado = this.consultasGrado.tabla;
      });
      this.itemsCiclo = this.generarArrayDeAnios();
      // Validar datos
      this.validarRestGrado();
    },
    async buscarEstudiante() {
      await axios.post(url, this.formGrado1).then((data) => {
        // Limpieza de datos
        this.tablaEstudiante = [];

        // Asignar nuevos valores
        this.consultasEstudiante = data.data;

        this.tablaEstudiante = this.consultasEstudiante.tabla;
        this.itemsCiclo = this.generarArrayDeAnios();
      });
      // Validar datos
      this.validarRestEstudiante();
    },

    async buscarcuadro() {
      this.progressBuscar = true;
      this.icoBuscar = false;
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
      });
      // Validar datos
      this.validarRest();
    },

    async cuadropdf() {
      // ... (código para descargar PDF)
    },
    validarInputGrado() {
      if (this.grado.length <= 0) {
        this.alerta = "Seleccionar Grado, Ciclo, Bloque";
        this.makeToast();
      } else {
        this.progressBuscarGrado = true;
        this.icoBuscarGrado = false;
        this.formGrado1.Grado = this.grado.ID + "";
        this.buscarEstudiante();
      }
    },
    validarInput() {
      if (
        this.estudiante.ID.length <= 0 ||
        this.ciclo.length <= 0 ||
        this.bloque.length <= 0
      ) {
        this.alerta = "Seleccionar nombre del estudiante, ciclo o bloque.";
        this.makeToast();
      } else {
        this.progressBuscar = true;
        this.icoBuscar = false;
        this.formatNotas();
        this.buscarcuadro();
      }
    },

    validarRestGrado() {
      if (this.consultasGrado.valid == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
        this.respuestaBusquedaGrado = false;
      } else if (this.consultasGrado.tabla.length <= 0) {
        this.alerta = "La grado no existe en la base de datos";
        this.makeToast();
        this.respuestaBusquedaGrado = false;
      } else {
        this.respuestaBusquedaGrado = true;
      }
    },
    validarRestEstudiante() {
      this.progressBuscarGrado = false;
      this.icoBuscarGrado = true;
      if (this.consultasEstudiante.validar == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
        this.respuestaBusquedaMateria = false;
      } else if (this.consultasEstudiante.tabla.length <= 0) {
        this.alerta = "No hay alumnos en la base de datos";
        this.makeToast();
        this.respuestaBusquedaMateria = false;
      } else {
        this.icoBuscar = true;
        this.alerta = "Si hay alumnos.";
        this.makeToast();
        this.respuestaBusquedaMateria = true;
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
    generarJson() {
      var datos = JSON.parse(localStorage.getItem("datos"));

      //var grado = this.nombreGrado(this.grado.ID);
      var encabezado2 = this.nombreEncabezado();
      var materia2 = this.nombreMateria();
      var lista = {
        catedratico: datos.Nombre + " " + datos.Apellido,
        AÑO: this.ciclo,
        bloque: this.bloque,
        creador: "EstudianteBloque",
        nombreAlumno: encabezado2.nombreAlumno,
        nombreGrado: encabezado2.nombreGrado,
        codigo: encabezado2.codigo,
        materia: materia2,
      };
      return lista;
    },

    nombreMateria() {
      var datos = this.tabla;
      var listNuevo = [];
      for (let i = 0; i < datos.length; i++) {
        var cuadronuevo = {
          materia: datos[i].NombreCurso,
          nota1: datos[i].NOTA1,
          nota2: datos[i].NOTA2,
          nota3: datos[i].NOTA3,
          nota4: datos[i].NOTA4,
          renota1: datos[i].RENOTA1,
          renota2: datos[i].RENOTA2,
          renota3: datos[i].RENOTA3,
          renota4: datos[i].RENOTA4,
          promedio: datos[i].Total,
          contador: i + 1,
        };
        listNuevo.push(cuadronuevo);
      }
      return listNuevo; // Retorna null si no se encuentra el id
    },
    nombreEncabezado() {
      var datos = this.encabezado;
      var cuadronuevo = {
        nombreAlumno: datos.Nombre,
        nombreGrado: datos.Grado,
        codigo: datos.Codigo,
      };
      return cuadronuevo; // Retorna null si no se encuentra el id
    },

    generarPDF2() {
      var content2 = {
        lista: this.generarJson(),
      };
      console.log(content2);
    },
    async generarPDF() {
      console.log("imprimir");
      var datos = this.generarJson();
      var content2 = {
        lista: datos,
      };
      await axios({
        url: url2,
        method: "POST",
        data: content2,
        responseType: "blob",
      }).then((response) => {
        this.mostrar = false;
        this.mostrar2 = true;
        this.download(response.data, datos);
      });
    },
    download(data, lista) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute(
        "download",
        lista.nombreGrado + "_" + lista.nombreAlumno + ".docx"
      );

      document.body.appendChild(link);
      link.click();
    },
  },
  computed: {
    tablaEstudianteOptions() {
      return Object.values(this.tablaEstudiante).map((item) => ({
        ...item,
        nombreSeccion: `${item.Nombre} ${item.Apellido}`,
      }));
    },
    tablaGradoOptions() {
      return Object.values(this.tablaGrado).map((item) => ({
        ...item,
        nombreSeccion: `${item.NombreGrado} ${item.SECCION}`,
      }));
    },
  },
  created() {
    this.validraAdmin();
  },
};
</script>
  