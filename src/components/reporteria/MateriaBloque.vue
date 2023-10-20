<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <br />
        <h1>Reporteria de Materia</h1>
      </v-col>
    </v-row>
    <!-- FORMULARIO BUSQUEDA DE MATERIA -->
    <v-row v-if="respuestaBusquedaGrado">
      <v-col md="9" cols="12" align="center">
        <br />
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
        <br />
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
    <v-row v-if="respuestaBusquedaMateria">
      <v-col md="3" cols="4" align="center">
        <br />
        <v-select
          :items="tablaMateriaOptions"
          label="Seleccionar la materia"
          v-model="materia"
          item-text="nombreCurso"
          item-value="ID"
          required
        ></v-select>
      </v-col>
      <v-col md="3" cols="4" align="center">
        <br />
        <v-select
          :items="itemsCiclo"
          label="Seleccionar la ciclo"
          v-model="ciclo"
          required
        ></v-select>
      </v-col>
      <v-col md="3" cols="4" align="center">
        <br />
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
        <br />
        <v-btn fab pill @click="validarInputMateria" color="secondary">
          <v-progress-circular
            indeterminate
            :size="25"
            color="light"
            v-show="progressBuscarMateria"
          ></v-progress-circular>
          <v-icon v-show="icoBuscarMateria">mdi-magnify</v-icon>
        </v-btn>
      </v-col>
      <v-col md="1" cols="6" align="center">
        <br />
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
          <div class="table-responsive">
            <v-data-table :headers="headers" :items="tabla">
              <template v-slot:item.promedio="{ item }">
                <v-chip :color="getColor(item.promedio)" dark>
                  {{ item.promedio }}
                </v-chip>
              </template>
              <template v-slot:top>
                <v-toolbar flat>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="1100px">
                    <v-card>
                      <v-card-title>
                        <span class="text-h5"
                          >{{ formTitle }} de {{ editedItem.Alumno }}</span
                        >
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" md="6">
                              <v-row>
                                <v-col cols="12"><h4>Bloque 1</h4></v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-text-field
                                    type="number"
                                    v-model="editedItem.NOTA1"
                                    label="Actividad 1"
                                    max="25"
                                    required
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-text-field
                                    type="number"
                                    v-model="editedItem.RENOTA1"
                                    label="Recuperacion 1"
                                    max="25"
                                    required
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-row>
                                <v-col cols="12"><h4>Bloque 2</h4></v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-text-field
                                    type="number"
                                    v-model="editedItem.NOTA2"
                                    label="Actividad 2"
                                    max="25"
                                    required
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-text-field
                                    type="number"
                                    v-model="editedItem.RENOTA2"
                                    label="Recuperacion 2"
                                    max="25"
                                    required
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" md="6">
                              <v-row>
                                <v-col cols="12"><h4>Bloque 3</h4></v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-text-field
                                    type="number"
                                    v-model="editedItem.NOTA3"
                                    label="Actividad 3"
                                    max="25"
                                    required
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-text-field
                                    type="number"
                                    v-model="editedItem.RENOTA3"
                                    label="Recuperacion 3"
                                    max="25"
                                    required
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-row>
                                <v-col cols="12"><h4>Bloque 4</h4></v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-text-field
                                    type="number"
                                    v-model="editedItem.NOTA4"
                                    label="Actividad 4"
                                    max="25"
                                    required
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-text-field
                                    type="number"
                                    v-model="editedItem.RENOTA4"
                                    label="Recuperacion 4"
                                    max="25"
                                    required
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">
                          Cancelar
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="save">
                          Guardar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="text-h5"
                        >Esta seguro de borrar la actividad?</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete"
                          >Cancelar</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteItemConfirm"
                          >OK</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
            </v-data-table>
          </div>
        </v-col>
      </v-row>
      <br />
      <br />
      <v-row>
        <v-col cols="6">
          <div>
            <h3>
              {{ `Actividad 1: ${piePagina.DESCRIPCIONNOTA1}` }}
            </h3>
            <h3>
              {{ `Actividad 2: ${piePagina.DESCRIPCIONNOTA2}` }}
            </h3>
            <h3>
              {{ `Actividad 3: ${piePagina.DESCRIPCIONNOTA3} ` }}
            </h3>
            <h3>
              {{ `Actividad 4: ${piePagina.DESCRIPCIONNOTA4} ` }}
            </h3>
          </div>
        </v-col>
        <v-col cols="6">
          <div>
            <h3>
              {{ `Recuperacion 1: ${piePagina.DESCRIPCIONRENOTA1}` }}
            </h3>
            <h3>
              {{ `Recuperacion 2: ${piePagina.DESCRIPCIONRENOTA2}` }}
            </h3>
            <h3>
              {{ `Recuperacion 3: ${piePagina.DESCRIPCIONRENOTA3} ` }}
            </h3>
            <h3>
              {{ `Recuperacion 4: ${piePagina.DESCRIPCIONRENOTA4} ` }}
            </h3>
          </div>
        </v-col>
      </v-row>
      <br />
    </v-container>
  </v-container>
</template>
  
  <script>
import swal from "sweetalert";
import axios from "axios";
const cf = require("../DIR");
const url = cf.url + "/ListarGrado";
const url2 = cf.url + "/Documentos";
const listaAsignacionCurso = cf.url + "/ListarCursosPorGrado";
const listarEstudiante = cf.url + "/LitarnotasporCurso";
const notas = cf.url + "/ModificarNotas";
const listarDescripcion = cf.url + "/LitarnotasporCursoConDescrip";

export default {
  data() {
    return {
      admin: false,
      respuestaBusqueda: false,
      alerta: "",
      btDescarga: false,

      progressBuscarGrado: false, //icono spiner para boton buscar grado
      icoBuscarGrado: true, //icono buscar para boton buscar grado
      consultasGrado: [], // ingresa datos del backend
      tablaGrado: [], //selectbox de grado
      grado: {
        ID: "",
      }, // valor que se selecciono en selectbox de grado
      respuestaBusquedaGrado: false,

      progressBuscarMateria: false, //icono spiner para boton buscar materia
      icoBuscarMateria: true, //icono buscar para boton buscar materia
      consultasMateria: [], // ingresa datos del backend
      itemsMateria: [], //selectbox de materia
      materia: "", // valor que se selecciono en selectbox de materia
      respuestaBusquedaMateria: false,

      progressBuscarActividad: false, //icono spiner para boton buscar actividad
      icoBuscarActividad: true, //icono buscar para boton buscar actividad
      consultasActividad: [], // ingresa datos del backend
      itemsActividad: [], //selectbox de actividad
      actividad: "", // valor que se selecciono en selectbox de actividad
      respuestaBusquedaActividad: false,

      itemsCiclo: [], //selectbox de ciclo
      ciclo: "",

      itemsBloque: [
        { text: "Bloque 1", value: 1 },
        { text: "Bloque 2", value: 2 },
        { text: "Bloque 3", value: 3 },
        { text: "Bloque 4", value: 4 },
      ], //selectbox de bloque
      bloque: "",

      fomr1: {
        idcurso: "",
        idgrado: "",
        anio: "",
        id_bloque: "",
      },

      consultas: [], //ingresa datos del backend
      tabla: [],
      headers: [
        { text: "Nombre del Estudiante", value: "Alumno" },
        { text: "Actividad 1", value: "NOTA1" },
        { text: "Recuperacion 1", value: "RENOTA1" },
        { text: "Actividad 2", value: "NOTA2" },
        { text: "Recuperacion 2", value: "RENOTA2" },
        { text: "Actividad 3", value: "NOTA3" },
        { text: "Recuperacion 3", value: "RENOTA3" },
        { text: "Actividad 4", value: "NOTA4" },
        { text: "Recuperacion 4", value: "RENOTA4" },
        { text: "Total", value: "promedio" },
      ],

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

      dialog: false,
      dialogDelete: false,
      desserts: [],
      editedIndex: -1,
      editedItem: {
        Alumno: "",
        Año: "",
        ID: "",
        ID_alumno: "",
        ID_asignacion: "",
        ID_bloque: "",
        NOTA1: "",
        NOTA2: "",
        NOTA3: "",
        NOTA4: "",
        RENOTA1: "",
        RENOTA2: "",
        RENOTA3: "",
        RENOTA4: "",
      },
      defaultItem: {
        Alumno: "",
        Año: "",
        ID: "",
        ID_alumno: "",
        ID_asignacion: "",
        ID_bloque: "",
        NOTA1: "",
        NOTA2: "",
        NOTA3: "",
        NOTA4: "",
        RENOTA1: "",
        RENOTA2: "",
        RENOTA3: "",
        RENOTA4: "",
      },
      encabezado: [],

      formGrado: {
        nombre: "",
        bitacora: [],
        token: [],
      },

      tipoActividad: [
        "Nota 1",
        "Nota 2",
        "Nota 3",
        "Nota 4",
        "Recuperacion 1",
        "Recuperacion 2",
        "Recuperacion 3",
        "Recuperacion 4",
      ],

      respuesta: {
        data: {
          tabla: [
            {
              nombre: "Anzony Gonzalez",
              nota1: "10",
              recuperacion1: "10",
              nota2: "10",
              recuperacion2: "10",
              nota3: "10",
              recuperacion3: "10",
              nota4: "10",
              recuperacion4: "10",
              promedio: "10",
            },
            {
              nombre: "Rafael Gonzalez",
              nota1: "10",
              recuperacion1: "10",
              nota2: "10",
              recuperacion2: "10",
              nota3: "10",
              recuperacion3: "10",
              nota4: "10",
              recuperacion4: "10",
              promedio: "10",
            },
            {
              nombre: "Actividad no. 3",
              nota1: "10",
              recuperacion1: "10",
              nota2: "10",
              recuperacion2: "10",
              nota3: "10",
              recuperacion3: "10",
              nota4: "10",
              recuperacion4: "10",
              promedio: "10",
            },
            // ... (otras entradas de tabla)
          ],
          valid: true,
        },
        // ...
      },
      respuestaGrado: {
        data: {
          tabla: [
            "Primero A",
            "Primero B",
            "Segundo A",
            "Segundo B",
            // ... (otras entradas de tabla)
          ],
          valid: true,
        },
        // ...
      },
      respuestaMateria: {
        data: {
          tabla: [
            "Matematicas",
            "Lenguaje",
            "Ciencias Sociales",
            "Ciencias Naturales",
            // ... (otras entradas de tabla)
          ],
          valid: true,
        },
        // ...
      },
      respuestaActividad: {
        data: {
          tabla: [
            { nombre: "Nota 1", descripcion: "descripcion de la actividad 1" },
            { nombre: "Nota 2", descripcion: "descripcion de la actividad 2" },
            { nombre: "Nota 3", descripcion: "descripcion de la actividad 3" },
            { nombre: "Nota 4", descripcion: "descripcion de la actividad 4" },
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
      } else {
        this.respuestaBusquedaGrado = false;
        this.respuestaBusquedaMateria = true;
        this.grado.ID = datos.Id_grado + "";
        this.buscarMateria();
      }
    },
    async buscarcuadro() {
      this.progressBuscarGrado = true;
      this.icoBuscarGrado = false;

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
    async buscarGrado() {
      await axios.post(url, this.formEditar).then((data) => {
        // Limpieza de datos
        //console.log(data);
        this.encabezado = [];
        this.tabla = [];

        // Asignar nuevos valores
        this.consultasGrado = data.data;
        this.tablaGrado = this.consultasGrado.tabla;
      });

      // Validar datos
      this.validarRestGrado();
    },
    async buscarMateria() {
      await axios.post(listaAsignacionCurso, this.grado).then((data) => {
        // Limpieza de datos
        this.itemsMateria = [];

        // Asignar nuevos valores
        this.consultasMateria = data.data;
        this.itemsMateria = this.consultasMateria.tabla;
        this.itemsCiclo = this.generarArrayDeAnios();
      });
      // Validar datos
      this.validarRestMateria();
    },
    async buscarActividad() {
      this.progressBuscarMateria = true;
      this.icoBuscarMateria = false;

      // Limpieza de datos
      this.itemsActividad = [];

      // Asignar nuevos valores
      this.consultasActividad = this.respuestaActividad.data;
      this.itemsActividad = this.consultasActividad.tabla;

      // Validar datos
      this.validarRestActividad();
    },
    async buscarEstudiante() {
      this.progressBuscarMateria = true;
      this.icoBuscarMateria = false;
      await axios.post(listarEstudiante, this.fomr1).then((data) => {
        // Limpieza de datos
        this.consultas = [];
        this.tabla = [];

        // Asignar nuevos valores
        this.consultas = data.data;
        this.tabla = this.consultas.tabla;
      });
      await axios.post(listarDescripcion, this.fomr1).then((data) => {
        // Limpieza de datos
        this.piePagina = [];

        // Asignar nuevos valores
        data.data;
        this.piePagina = data.data.piePagina[0];
      });
      // Validar datos
      this.validarRestEstudiante();
    },
    async calificaciones() {
      await axios.post(notas, this.editedItem).then((data) => {
        console.log(data.data);
        if (data.data.validar == false) {
          this.alerta = "No se logro actualizar.";
          this.makeToast();
        } else {
          this.alerta = "Se guardo las calificaciones con exito!";
          this.makeToast();
          this.buscarEstudiante();
        }
      });
    },

    validarInputGrado() {
      if (this.grado.ID.length <= 0) {
        this.alerta = "Seleccionar Grado y Seccion";
        this.makeToast();
      } else {
        this.progressBuscarGrado = true;
        this.icoBuscarGrado = false;
        this.buscarMateria();
      }
    },
    validarInputMateria() {
      if (
        this.materia.length <= 0 ||
        this.ciclo.length <= 0 ||
        this.bloque.length <= 0
      ) {
        this.alerta = "Seleccionar Materia, Ciclo o Bloque";
        this.makeToast();
      } else {
        this.progressBuscarMateria = true;
        this.icoBuscarMateria = false;
        this.crearForm();
        this.buscarEstudiante();
      }
    },
    validarInputActividad() {
      if (this.actividad.length <= 0) {
        this.alerta = "Seleccionar Actividad";
        this.makeToast();
      } else {
        this.progressBuscarActividad = true;
        this.icoBuscarActividad = false;
        this.buscarEstudiante();
      }
    },

    validarRestGrado() {
      if (this.consultasGrado.valid == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
      } else if (this.consultasGrado.tabla.length <= 0) {
        this.alerta = "El grado no existe en la base de datos";
        this.makeToast();
      } else {
        //console.log('funciona respuesta en Grado')
      }
    },
    validarRestMateria() {
      this.progressBuscarGrado = false;
      this.icoBuscarGrado = true;
      this.respuestaBusquedaMateria = true;
      if (this.consultasMateria.valid == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
        this.respuestaBusquedaMateria = false;
      } else if (this.consultasMateria.tabla.length <= 0) {
        this.alerta = "La materia no existe en la base de datos";
        this.makeToast();
        this.respuestaBusquedaMateria = false;
      } else {
        this.respuestaBusquedaMateria = true;
      }
    },
    validarRestActividad() {
      this.progressBuscarMateria = false;
      this.icoBuscarMateria = true;
      if (this.consultasActividad.valid == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
        this.respuestaBusquedaActividad = false;
      } else if (this.consultasActividad.tabla.length <= 0) {
        this.alerta = "La actividad no existe en la base de datos";
        this.makeToast();
        this.respuestaBusquedaActividad = false;
      } else {
        this.respuestaBusquedaActividad = true;
      }
    },
    validarRestEstudiante() {
      this.progressBuscarMateria = false;
      this.icoBuscarMateria = true;
      if (this.consultas.validar == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
        this.respuestaBusquedaMateria = false;
        this.btDescarga = false;
      } else if (this.consultas.tabla.length <= 0) {
        this.alerta = "Los estudiantes no existe en la base de datos";
        this.makeToast();
        this.respuestaBusqueda = false;
        this.btDescarga = false;
      } else {
        this.respuestaBusqueda = true;
        this.btDescarga = true;
      }
    },

    crearForm() {
      this.fomr1.idgrado = this.grado.ID;
      this.fomr1.idcurso = this.materia;
      this.fomr1.anio = this.ciclo;
      this.fomr1.id_bloque = this.bloque;
    },
    getColor(nota) {
      if (nota > 80) return "green";
      else if (nota > 61) return "orange";
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
    generarJson() {
      var datos = JSON.parse(localStorage.getItem("datos"));
      var materia1 = this.nombreMateria(this.materia);
      var grado = this.nombreGrado(this.grado.ID);
      var descripcion= this.piePagina;
      var lista = {
        catedratico: datos.Nombre + " " + datos.Apellido,
        nombreGrado: grado.nombre,
        seccionGrado: grado.seccion,
        materia: materia1.nombreCurso,
        bloque : this.bloque,
        AÑO: descripcion.AÑO,
        alumno: this.nombreAlumno(),
        creador: "MateriaBloque",
        DESCRIPCIONNOTA1: descripcion.DESCRIPCIONNOTA1,
        DESCRIPCIONRENOTA1: descripcion.DESCRIPCIONRENOTA1,
        DESCRIPCIONNOTA2: descripcion.DESCRIPCIONNOTA2,
        DESCRIPCIONRENOTA2: descripcion.DESCRIPCIONRENOTA2,
        DESCRIPCIONNOTA3: descripcion.DESCRIPCIONNOTA3,
        DESCRIPCIONRENOTA3: descripcion.DESCRIPCIONRENOTA3,
        DESCRIPCIONNOTA4: descripcion.DESCRIPCIONNOTA4,
        DESCRIPCIONRENOTA4: descripcion.DESCRIPCIONRENOTA4,
      };
      return lista;
    },
    nombreGrado(idBuscado) {
      var datos = this.tablaGrado;
      for (let i = 0; i < datos.length; i++) {
        if (datos[i].ID === idBuscado) {
          return {
            nombre: datos[i].NombreGrado,
            seccion: datos[i].SECCION,
          };
        }
      }
      return null; // Retorna null si no se encuentra el id
    },
    nombreMateria(idBuscado) {
      var datos = this.itemsMateria;
      for (let i = 0; i < datos.length; i++) {
        if (datos[i].ID === idBuscado) {
          return {
            nombreCurso: datos[i].NombreCurso,
          };
        }
      }
      return null; // Retorna null si no se encuentra el id
    },
    
    nombreBloque(idBuscado) {
      var datos = this.itemsBloque;
      for (let i = 0; i < datos.length; i++) {
        if (datos[i].ID === idBuscado) {
          return {
            nombreCurso: datos[i].NombreCurso,
          };
        }
      }
      return null; // Retorna null si no se encuentra el id
    },
    nombreAlumno() {
      var datos = this.tabla;
      var listNuevo = [];
      for (let i = 0; i < datos.length; i++) {
        var cuadronuevo = {
          nombreAlumno: datos[i].Alumno,
          nota1: datos[i].NOTA1,
          nota2: datos[i].NOTA2,
          nota3: datos[i].NOTA3,
          nota4: datos[i].NOTA4,
          renota1: datos[i].RENOTA1,
          renota2: datos[i].RENOTA2,
          renota3: datos[i].RENOTA3,
          renota4: datos[i].RENOTA4,
          promedio: datos[i].promedio,
          contador: i + 1,
          codigo: datos[i].Codigo_personal,
        };
        listNuevo.push(cuadronuevo);
      }
      return listNuevo; // Retorna null si no se encuentra el id
    },

    editItem(item) {
      this.editedIndex = this.tabla.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.tabla.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.tabla.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.tabla[this.editedIndex], this.editedItem);
        this.calificaciones();
      } else {
        this.tabla.push(this.editedItem);
        this.calificaciones();
      }
      this.close();
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
      console.log(datos);
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
        lista.nombreGrado + "_" + lista.materia + ".docx"
      );

      document.body.appendChild(link);
      link.click();
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Actividad" : "Editar Notas";
    },
    descripcionSeleccionada() {
      const actividadSeleccionada = this.itemsActividad.find(
        (item) => item.nombre === this.actividad
      );

      return actividadSeleccionada ? actividadSeleccionada.descripcion : "";
    },
    tablaGradoOptions() {
      return Object.values(this.tablaGrado).map((item) => ({
        ...item,
        nombreSeccion: `${item.NombreGrado} ${item.SECCION}`,
      }));
    },
    tablaMateriaOptions() {
      return Object.values(this.itemsMateria).map((item) => ({
        ...item,
        nombreCurso: `${item.NombreCurso}`,
      }));
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.validraAdmin();
  },
};
</script>