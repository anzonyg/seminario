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
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Añadir Materia
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-select
                                :items="tablaMateriaOptions"
                                label="Seleccionar curso"
                                v-model="editedItem.ID"
                                item-text="nombreCurso"
                                item-value="ID"
                                required
                              ></v-select>
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
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
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
const listaCurso = cf.url + "/ListarCursos";
const listaAsignacionCurso = cf.url + "/ListarCursosPorGrado";
const AddCurso = cf.url + "/AddAsigGradoCurso";
const uCurso = cf.url + "/ModAsigGradocurso";

export default {
  data() {
    return {
      respuestaBusqueda: false,
      alerta: "",

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
      materia: {
        ID: "",
      }, // valor que se selecciono en selectbox de materia
      respuestaBusquedaMateria: false,

      cursosArray: [],

      itemsCiclo: [], //selectbox de ciclo
      ciclo: "",

      itemsBloque: ["Bloque 1", "Bloque 2", "Bloque 3", "Bloque 4"], //selectbox de bloque
      bloque: "",

      consultas: [], //ingresa datos del backend
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
        { text: "Materia", value: "NombreCurso" },
        { text: "Descripcion", value: "DescripcionCurso" },
        { text: "Detalle", value: "actions", sortable: false },
      ],

      dialog: false,
      dialogDelete: false,
      desserts: [],
      editedIndex: -1,
      editedItem: {
        ID: "",
        NombreCurso: "",
        DescripcionCurso: "",
      },
      defaultItem: {
        ID: "",
        NombreCurso: "",
        DescripcionCurso: "",
      },
      encabezado: [],
      formEditar: {
        id: "",
        idcurso: "",
        idgrado: "",
      },

      respuesta: {
        data: {
          tabla: [
            {
              nombre: "Matematicas",
              descripcion: "lorem ipsum dolor sit amet",
            },
            {
              nombre: "Lenguaje",
              descripcion: "lorem eget",
            },
            {
              nombre: "Fisica",
              descripcion: "lorem ipsum dolor sit amet",
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
    async buscarGrado() {
      await axios.post(url, this.formEditar).then((data) => {
        // Limpieza de datos
        //console.log(data);
        this.encabezado = [];
        this.tabla = [];

        // Asignar nuevos valores
        this.consultasGrado = data.data;
        this.tablaGrado = this.consultasGrado.tabla;
        console.log(this.tablaGrado);
      });
      this.itemsCiclo = this.generarArrayDeAnios();
      // Validar datos
      this.validarRestGrado();
    },
    async buscarListaCurso() {
      await axios.post(listaCurso).then((data) => {
        // Limpieza de datos
        //console.log(data);
        this.itemsMateria = [];

        // Asignar nuevos valores
        this.consultasMateria = data.data;
        this.itemsMateria = this.consultasMateria.tabla;
        console.log(this.itemsMateria);
      });
      // Validar datos
      this.validarRestListaCurso();
      console.log(this.consultasMateria);
      console.log(this.itemsMateria);
    },

    async buscarActividad() {
      this.progressBuscarGrado = true;
      this.icoBuscarGrado = false;
      var listado = JSON.stringify(this.grado);
      console.log(listado);
      await axios.post(listaAsignacionCurso, this.grado).then((data) => {
        // Limpieza de datos
        this.consultas = [];
        this.tabla = [];

        // Asignar nuevos valores
        this.consultas = data.data;
        this.tabla = this.consultas.tabla;
        console.log(this.tabla);
      });
      // Validar datos
      this.validarRestActividad();
    },

    validarInputGrado() {
      if (this.grado.length <= 0) {
        this.alerta = "Seleccionar Grado, Ciclo, Bloque";
        this.makeToast();
        console.log("no validar input " + this.grado);
      } else {
        this.progressBuscarGrado = true;
        this.icoBuscarGrado = false;

        console.log("validar input " + this.grado);
        this.buscarActividad();
      }
    },

    async actualizarCurso() {
      await axios.post(uCurso, this.formEditar).then((data) => {
        // Limpieza de datos
        this.consultas = [];
        this.tabla = [];
        // Asignar nuevos valores
        this.consultas = data.data;
        this.tabla = this.consultas.tabla;
        console.log(this.consultas);
      });
      // Validar datos
      this.validarRestEditar();
      this.buscarGrado();
      this.buscarListaCurso();
      this.buscarActividad();
    },
    async crearCurso() {
      await axios.post(AddCurso, this.formEditar).then((data) => {
        // Limpieza de datos
        this.consultas = [];
        this.tabla = [];
        // Asignar nuevos valores
        this.consultas = data.data;
        this.tabla = this.consultas.tabla;
        console.log(this.consultas);
      });
      // Validar datos
      console.log(this.consultas);
      this.validarRestCrear();
      this.buscarGrado();
      this.buscarListaCurso();
      this.buscarActividad();
    },

    validarRestGrado() {
      if (this.consultasMateria.valid == false) {
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

    validarRestListaCurso() {
      if (this.consultasMateria.valid == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
        this.respuestaBusquedaMateria = false;
      } else if (this.consultasMateria.tabla.length <= 0) {
        this.alerta = "El curso no existe en la base de datos";
        this.makeToast();
        this.respuestaBusquedaMateria = false;
      } else {
        this.respuestaBusquedaMateria = true;
      }
    },

    validarRestActividad() {
      this.progressBuscarGrado = false;
      this.icoBuscarGrado = true;
      if (this.consultas.valid == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
        this.respuestaBusqueda = false;
      } else if (this.consultas.tabla.length <= 0) {
        this.alerta = "No hay cursos registrados en el grado seleccionado";
        this.makeToast();
        this.respuestaBusqueda = true;
      } else {
        this.respuestaBusqueda = true;
      }
    },

    validarRestCrear() {
      if (this.consultas.validar == false) {
        this.alerta = "El curso no se ha registrado.";
        this.makeToast();
      } else {
        this.alerta = "El curso se ha registrado";
        this.makeToast();
      }
    },
    validarRestEditar() {
      if (this.consultas.validar == false) {
        this.alerta = "El curso no se ha editado.";
        this.makeToast();
      } else {
        this.alerta = "El curso se ha editado";
        this.makeToast();
      }
    },

    generarArrayDeAnios() {
      const anioActual = new Date().getFullYear();
      const arrayDeAnios = [];

      for (let anio = 2023; anio <= anioActual; anio++) {
        arrayDeAnios.push(anio);
      }
      console.log(arrayDeAnios + " de ");
      return arrayDeAnios;
    },

    editItem(item) {
      this.editedIndex = this.tabla.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      console.log(this.tabla);
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
        this.formEditar.id = this.editedItem.ID_R + "";
        this.formEditar.idcurso = this.editedItem.ID + "";
        this.formEditar.idgrado = this.grado.ID + "";

        this.actualizarCurso();
      } else {
        
        this.formEditar.idcurso = this.editedItem.ID + "";
        this.formEditar.idgrado = this.grado.ID + "";
        this.crearCurso();
        this.tabla.push(this.editedItem);
      }
      console.log(this.tabla);
      console.log(this.formEditar);
      this.close();
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Actividad" : "Editar Actividad";
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
    selectedGrado(newGrado) {
      console.log(newGrado);
      this.materia.ID = newDocente.ID;
    },
  },

  created() {
    this.buscarGrado();
    this.buscarListaCurso();
  },
};
</script>