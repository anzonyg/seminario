<template>
  <v-container>
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
      <v-col md="3" cols="12" align="center">
        <br />
        <v-btn pill @click="validarInputMateria" color="secondary">
          <v-progress-circular
            indeterminate
            :size="25"
            color="light"
            v-show="progressBuscarMateria"
          ></v-progress-circular>
          <v-icon v-show="icoBuscarMateria">mdi-magnify</v-icon>
          Buscar
        </v-btn>
      </v-col>
    </v-row>
    <br />

    <!-- RESPUESTA DE BUSQUEDA ACTIVIDAD -->
    <v-container id="cuadro1" v-if="respuestaBusqueda">
      <v-row>
        <v-col cols="12">
          <br />
          <div class="table-responsive">
            <v-data-table :headers="headers" :items="tabla" hide-default-footer>
              <template v-slot:top>
                <v-toolbar flat>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="1100px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Añadir Descripcion
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" md="6">
                              <v-row>
                                <v-col cols="12" sm="6" md="6">
                                  <v-textarea
                                    v-model="listDescripcion.nota1"
                                    label="Nota 1"
                                    required
                                  ></v-textarea>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-textarea
                                    v-model="listDescripcion.recuperacion1"
                                    label="Recuperacion 1"
                                    required
                                  ></v-textarea>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-row>
                                <v-col cols="12" sm="6" md="6">
                                  <v-textarea
                                    v-model="listDescripcion.nota2"
                                    label="Nota 2"
                                    required
                                  ></v-textarea>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-textarea
                                    v-model="listDescripcion.recuperacion2"
                                    label="Recuperacion 2"
                                    required
                                  ></v-textarea>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" md="6">
                              <v-row>
                                <v-col cols="12" sm="6" md="6">
                                  <v-textarea
                                    v-model="listDescripcion.nota3"
                                    label="Nota 3"
                                    required
                                  ></v-textarea>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-textarea
                                    v-model="listDescripcion.recuperacion3"
                                    label="Recuperacion 3"
                                    required
                                  ></v-textarea>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-row>
                                <v-col cols="12" sm="6" md="6">
                                  <v-textarea
                                    v-model="listDescripcion.nota4"
                                    label="Nota 4"
                                    required
                                  ></v-textarea>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                  <v-textarea
                                    v-model="listDescripcion.recuperacion4"
                                    label="Recuperacion 4"
                                    required
                                  ></v-textarea>
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
    </v-container>
  </v-container>
</template>

<script>
import swal from "sweetalert";
import axios from "axios";
const cf = require("../DIR");
const url = cf.url + "/ListarGrado";
const listaAsignacionCurso = cf.url + "/ListarCursosPorGrado";
const listaDescripcion = cf.url + "/ListarDescrip";
const idAsignacion = cf.url + "/ExtraIdasig";
const guardarDesc = cf.url + "/aggDescripcionesGradocurso";

export default {
  data() {
    return {
      respuestaBusqueda: false,
      alerta: "",

      progressBuscarGrado: false, //icono spiner para boton buscar grado
      icoBuscarGrado: true, //icono buscar para boton buscar grado
      consultasGrado: [], // ingresa datos del backend
      itemsGrado: [], //selectbox de grado
      grado: {
        ID: "",
      }, // valor que se selecciono en selectbox de grado
      respuestaBusquedaGrado: false,
      tablaGrado: [],

      progressBuscarMateria: false, //icono spiner para boton buscar materia
      icoBuscarMateria: true, //icono buscar para boton buscar materia
      consultasMateria: [], // ingresa datos del backend
      itemsMateria: [], //selectbox de materia
      materia: "", // valor que se selecciono en selectbox de materia
      respuestaBusquedaMateria: false,

      itemsCiclo: [], //selectbox de ciclo
      ciclo: "",

      itemsBloque: [
        { text: "Bloque 1", value: 1 },
        { text: "Bloque 2", value: 2 },
        { text: "Bloque 3", value: 3 },
        { text: "Bloque 4", value: 4 },
      ], //selectbox de bloque
      bloque: "",

      consultasAsignacion: [],
      tablaAsignacion: [],
      asignacion: "",
      idDescripcionAsignacion: "",

      consultas: [], //ingresa datos del backend
      tablaActividad: [],
      tabla: [],
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
      headers: [
        { text: "Tipo de Actividad", value: "tipo" },
        { text: "Descripcion", value: "descripcion" },
      ],

      dialog: false,
      dialogDelete: false,
      desserts: [],
      editedIndex: -1,
      editedItem: {
        nombre: "",
        tipo: "",
        descripcion: "",
      },
      defaultItem: {
        nombre: "",
        tipo: "",
        descripcion: "",
      },
      encabezado: [],
      formMateria: {
        nombre: "",
        idDocente: "",
      },
      form: {
        ID_Asignacion: "",
        ID_bloque: "",
        AÑO: "",
      },
      formAsignacion: {
        ID_curso: "",
        ID_grado: "",
      },
      listDescripcion: {
        nota1: "",
        nota2: "",
        nota3: "",
        nota4: "",
        recuperacion1: "",
        recuperacion2: "",
        recuperacion3: "",
        recuperacion4: "",
      },
      formDescripcion: {
        id: "",
        des1: "",
        des2: "",
        des3: "",
        des4: "",
        desr1: "",
        desr2: "",
        desr3: "",
        desr4: "",
      },
      consultasDescripcion: [],
      tablaDescripcion: [],
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
    validarAdmin() {
      var datos = JSON.parse(localStorage.getItem("datos"));
      if (datos.idTipo == 1) {
        this.respuestaBusquedaGrado = true;
        this.respuestaBusquedaMateria = false;
        this.buscarGrado();
      } else {
        this.respuestaBusquedaGrado = false;
        this.respuestaBusquedaMateria = true;
        this.grado.ID = datos.Id_grado + '';
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
      await axios.post(url).then((data) => {
        // Limpieza de datos
        this.consultasGrado = [];
        this.tablaGrado = [];

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
    async buscarAsignacion() {
      //var datos = JSON.parse(localStorage.getItem("datos"));
      //this.formAsignacion.ID_grado = datos.idGrado;
      this.formAsignacion.ID_curso = this.materia;
      this.formAsignacion.ID_grado = this.grado.ID;
      await axios.post(idAsignacion, this.formAsignacion).then((data) => {
        // Limpieza de datos
        this.asignacion = "";
        this.consultasAsignacion = [];
        this.tablaAsignaicon = [];
        // Asignar nuevos valores
        this.consultasAsignacion = data.data;
        this.tablaAsignacion = this.consultasAsignacion.tabla;
        //
      });
      // Validar datos
      this.validarRestAsignacion();
    },
    async buscarActividad() {
      this.progressBuscarMateria = true;
      this.icoBuscarMateria = false;
      this.form.ID_Asignacion = this.asignacion;
      this.form.ID_bloque = this.bloque;
      this.form.AÑO = this.ciclo;
      await axios.post(listaDescripcion, this.form).then((data) => {
        // Limpieza de datos
        this.consultas = [];
        this.tabla = [];

        // Asignar nuevos valores
        this.consultas = data.data;
        this.tablaActividad = this.consultas.tabla[0];
        this.idDescripcionAsignacion = this.tablaActividad.ID;
      });
      // Validar datos
      this.validarRestActividad();
    },
    async guardarDescripcion() {
      await axios.post(guardarDesc, this.formDescripcion).then((data) => {
        // Limpieza de datos
        this.consultasDescripcion = [];
        this.tablaDescripcion = [];

        // Asignar nuevos valores
        this.consultasDescripcion = data.data;
      });
      // Validar datos
      this.validarRestDescripcion();
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
        this.alerta = "Seleccionar Materia, Ciclo, Bloque";
        this.makeToast();
        console.log("no validar input " + this.materia);
      } else {
        this.progressBuscarMateria = true;
        this.icoBuscarMateria = false;
        this.buscarAsignacion();
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
      if (this.consultas.valid == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
        this.respuestaBusqueda = false;
      } else if (this.consultas.tabla.length <= 0) {
        this.alerta = "La actividad no existe en la base de datos";
        this.makeToast();
        this.respuestaBusqueda = false;
      } else {
        this.respuestaBusqueda = true;
        this.estructurar();
        this.listarEstructura();
      }
    },
    validarRestDescripcion() {
      if (this.consultasDescripcion.validar == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
      } else {
        this.alerta = "Las descripciones se han guardado";
        this.makeToast();
        this.buscarActividad();
      }
    },
    validarRestAsignacion() {
      if (this.consultasAsignacion.validar == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
      } else if (this.consultasAsignacion.tabla.length <= 0) {
        this.alerta = "La materia no existe en la base de datos";
        this.makeToast();
      } else {
        this.asignacion = this.tablaAsignacion[0].ID;
        this.buscarActividad();
      }
    },

    generarArrayDeAnios() {
      const anioActual = new Date().getFullYear();
      const arrayDeAnios = [];

      for (let anio = 2023; anio <= anioActual; anio++) {
        arrayDeAnios.push(anio);
      }
      return arrayDeAnios;
    },

    estructurar() {
      var list = this.tablaActividad;
      var newList = [
        { tipo: "NOTA 1", descripcion: list.DESCRIPCIONNOTA1 },
        { tipo: "NOTA 2", descripcion: list.DESCRIPCIONNOTA2 },
        { tipo: "NOTA 3", descripcion: list.DESCRIPCIONNOTA3 },
        { tipo: "NOTA 4", descripcion: list.DESCRIPCIONNOTA4 },
        { tipo: "RECUPERACION 1", descripcion: list.DESCRIPCIONRENOTA1 },
        { tipo: "RECUPERACION 2", descripcion: list.DESCRIPCIONRENOTA2 },
        { tipo: "RECUPERACION 3", descripcion: list.DESCRIPCIONRENOTA3 },
        { tipo: "RECUPERACION 4", descripcion: list.DESCRIPCIONRENOTA4 },
      ];
      this.tabla = newList;
    },
    descripcionEstructura() {
      if (
        this.listDescripcion.nota1 == "" ||
        this.listDescripcion.nota2 == "" ||
        this.listDescripcion.nota3 == "" ||
        this.listDescripcion.nota4 == "" ||
        this.listDescripcion.recuperacion1 == "" ||
        this.listDescripcion.recuperacion2 == "" ||
        this.listDescripcion.recuperacion3 == "" ||
        this.listDescripcion.recuperacion4 == "" ||
        this.listDescripcion.nota1 == null ||
        this.listDescripcion.nota2 == null ||
        this.listDescripcion.nota3 == null ||
        this.listDescripcion.nota4 == null ||
        this.listDescripcion.recuperacion1 == null ||
        this.listDescripcion.recuperacion2 == null ||
        this.listDescripcion.recuperacion3 == null ||
        this.listDescripcion.recuperacion4 == null
      ) {
        return false;
      } else {
        this.formDescripcion.id = this.idDescripcionAsignacion;
        this.formDescripcion.des1 = this.listDescripcion.nota1;
        this.formDescripcion.des2 = this.listDescripcion.nota2;
        this.formDescripcion.des3 = this.listDescripcion.nota3;
        this.formDescripcion.des4 = this.listDescripcion.nota4;
        this.formDescripcion.desr1 = this.listDescripcion.recuperacion1;
        this.formDescripcion.desr2 = this.listDescripcion.recuperacion2;
        this.formDescripcion.desr3 = this.listDescripcion.recuperacion3;
        this.formDescripcion.desr4 = this.listDescripcion.recuperacion4;
        return true;
      }
    },
    listarEstructura() {
      this.listDescripcion.nota1 = this.tabla[0].descripcion;
      this.listDescripcion.nota2 = this.tabla[1].descripcion;
      this.listDescripcion.nota3 = this.tabla[2].descripcion;
      this.listDescripcion.nota4 = this.tabla[3].descripcion;
      this.listDescripcion.recuperacion1 = this.tabla[4].descripcion;
      this.listDescripcion.recuperacion2 = this.tabla[5].descripcion;
      this.listDescripcion.recuperacion3 = this.tabla[6].descripcion;
      this.listDescripcion.recuperacion4 = this.tabla[7].descripcion;
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
      } else {
        console.log(this.listDescripcion);
        if (this.descripcionEstructura()) {
          console.log(this.formDescripcion);
          this.guardarDescripcion();
        } else {
          this.alerta = "Los campos estan vacios.";
          this.makeToast();
        }
      }
      console.log(this.tabla);
      this.close();
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Editar Descripcion"
        : "Nueva Descripcion";
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
    this.validarAdmin();
  },
};
</script>