<template>
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
                      Añadir Grado
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
                            <v-text-field
                              v-model="editedItem.NombreGrado"
                              label="Grado"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-text-field
                              v-model="editedItem.SECCION"
                              label="Seccion"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-select
                              :items="tablaDocenteOptions"
                              label="Docente"
                              v-model="editedItem.ID_docente"
                              item-text="nombreApellido"
                              item-value="ID"
                              required
                            ></v-select>
                            <p>
                              Selected Docente ID: {{ editedItem.ID_docente }}
                            </p>
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
</template>

<script>
import swal from "sweetalert";
import axios from "axios";
const cf = require("../DIR");
const url = cf.url + "/ListarGrado";
const listDocente = cf.url + "/listarDocente";
const AddGrado = cf.url + "/AggGrado";
const uGrado = cf.url + "/ModtGrado";

export default {
  data() {
    return {
      respuestaBusqueda: false,
      alerta: "",

      itemsCiclo: [], //selectbox de ciclo
      ciclo: "",

      itemsBloque: ["Bloque 1", "Bloque 2", "Bloque 3", "Bloque 4"], //selectbox de bloque
      bloque: "",

      consultas: [], //ingresa datos del backend
      tabla: [],
      consultasDocente: [], //ingresa datos del backend
      tablaDocente: [],
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
        { text: "Grado", value: "NombreGrado" },
        { text: "Seccion", value: "SECCION" },
        { text: "Nombre", value: "Nombre" },
        { text: "Apellidos", value: "Apellido" },
        { text: "Detalle", value: "actions", sortable: false },
      ],
      selectedDocenteID: null,
      dialog: false,
      dialogDelete: false,
      desserts: [],
      editedIndex: -1,
      editedItem: {
        ID: "",
        ID_docente: null,
        NombreGrado: "",
        SECCION: "",
        Nombre: "",
        Apellido: "",
      },
      itemSelect: [],
      defaultItem: {
        ID: "",
        ID_docente: "",
        NombreGrado: "",
        SECCION: "",
        Nombre: "",
        Apellido: "",
      },
      encabezado: [],
      formMateria: {
        nombre: "",
        idDocente: "",
      },
      formEditar: {
        ID: "",
        IdDocente: "",
        NombreG: "",
        Seccion: "",
      },

      respuesta: {
        data: {
          tabla: [
            {
              grado: "Primero",
              seccion: "A",
            },
            {
              grado: "Primero",
              seccion: "B",
            },
            {
              grado: "Segundo",
              seccion: "A",
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

    async buscarDocente() {
      await axios.post(listDocente, this.formEditar).then((data) => {
        // Limpieza de datos
        this.tablaDocente = [];
        // Asignar nuevos valores
        this.consultasDocente = data.data;

        this.tablaDocente = this.consultasDocente.tabla;
      });
      // Validar datos
      this.validarRestDocente();
    },
    async buscarGrado() {
      await axios.post(url, this.formEditar).then((data) => {
        // Limpieza de datos
        this.encabezado = [];
        this.tabla = [];
        // Asignar nuevos valores
        this.consultas = data.data;
        this.tabla = this.consultas.tabla;
      });
      this.itemsCiclo = this.generarArrayDeAnios();
      // Validar datos
      this.validarRestGrado();
    },
    async actualizarGrado() {
      await axios.post(uGrado, this.formEditar).then((data) => {
        // Limpieza de datos
        this.encabezado = [];
        this.tabla = [];
        // Asignar nuevos valores
        this.consultas = data.data;
      });
      // Validar datos
      this.validarRestEditar();
      this.buscarGrado();
      this.buscarDocente();
    },
    async crearGrado() {
      await axios.post(AddGrado, this.formEditar).then((data) => {
        // Limpieza de datos
        this.encabezado = [];
        this.tabla = [];
        // Asignar nuevos valores
        this.consultas = data.data;
      });
      // Validar datos
      this.validarRestCrear();
      this.buscarGrado();
      this.buscarDocente();
    },

    validarRestDocente() {
      if (this.consultasDocente.validar == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
      } else if (this.consultasDocente.tabla.length <= 0) {
        this.alerta = "El nombre no existe en la base de datos";
        this.makeToast();
      }
    },
    validarRestGrado() {
      if (this.consultas.validar == false) {
        this.alerta = "Error en listar grados.";
        this.makeToast();
        this.respuestaBusqueda = false;
      } else if (this.consultas.tabla.length <= 0) {
        this.alerta = "Los grados no existe en la base de datos";
        this.makeToast();
        this.respuestaBusqueda = false;
      } else {
        this.respuestaBusqueda = true;
      }
    },
    validarRestCrear() {
      if (this.consultas.validar == false) {
        this.alerta = "El grado no se ha registrado.";
        this.makeToast();
      } else {
        this.alerta = "El grado se ha registrado";
        this.makeToast();
      }
    },
    validarRestEditar() {
      if (this.consultas.validar == false) {
        this.alerta = "El grado no se ha editado.";
        this.makeToast();
      } else {
        this.alerta = "El grado se ha editado";
        this.makeToast();
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
        this.formEditar.ID = this.editedItem.ID + "";
        this.formEditar.IdDocente = this.editedItem.ID_docente + "";
        this.formEditar.NombreG = this.editedItem.NombreGrado + "";
        this.formEditar.Seccion = this.editedItem.SECCION + "";
        this.actualizarGrado();
      } else {
        this.formEditar.IdDocente = this.editedItem.ID_docente + "";
        this.formEditar.NombreG = this.editedItem.NombreGrado + "";
        this.formEditar.Seccion = this.editedItem.SECCION + "";
        this.crearGrado();
        this.tabla.push(this.editedItem);
      }
      this.close();
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Grado" : "Editar Grado";
    },
    tablaDocenteOptions() {
      return Object.values(this.tablaDocente).map((item) => ({
        ...item,
        nombreApellido: `${item.Nombre} ${item.Apellido}`,
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
    selectedDocente(newDocente) {
      this.editedItem.ID_docente = newDocente.ID;
    },
  },

  created() {
    this.buscarGrado();
    this.buscarDocente();
  },
};
</script>