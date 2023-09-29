<template>
  <v-container>
    <!-- FORMULARIO BUSQUEDA DE MATERIA -->
    <v-row v-if="respuestaBusquedaMateria">
      <v-col md="3" cols="4" align="center">
        <br />
        <v-select
          :items="itemsMateria"
          label="Seleccionar la materia"
          v-model="materia"
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
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Añadir Actividad
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
                                :items="tipoActividad"
                                label="Tipo de Actividad"
                                v-model="editedItem.tipo"
                                required
                              ></v-select>
                            </v-col>
                            <v-col cols="12">
                              <v-textarea
                                v-model="editedItem.descripcion"
                                label="Descripcion"
                                required
                              ></v-textarea>
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
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
              </template>
              <template v-slot:no-data>
                <v-btn color="primary" @click="initialize"> Reset </v-btn>
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

      progressBuscarGrado: false, //icono spiner para boton buscar grado
      icoBuscarGrado: true, //icono buscar para boton buscar grado
      consultasGrado: [], // ingresa datos del backend
      itemsGrado: [], //selectbox de grado
      grado: "", // valor que se selecciono en selectbox de grado
      respuestaBusquedaGrado: false,

      progressBuscarMateria: false, //icono spiner para boton buscar materia
      icoBuscarMateria: true, //icono buscar para boton buscar materia
      consultasMateria: [], // ingresa datos del backend
      itemsMateria: [], //selectbox de materia
      materia: "", // valor que se selecciono en selectbox de materia
      respuestaBusquedaMateria: false,

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
        { text: "Tipo de Actividad", value: "tipo" },
        { text: "Descripcion", value: "descripcion" },
        { text: "Detalle", value: "actions", sortable: false },
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

      respuesta: {
        data: {
          tabla: [
            {
              tipo: "Nota 1",
              descripcion: "22",
            },
            {
              tipo: "Nota 2",
              descripcion: "16",
            },
            {
              tipo: "Recuperacion 2",
              descripcion: "cambia de carrera",
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
      // Limpieza de datos
      this.itemsGrado = [];

      // Asignar nuevos valores
      this.consultasGrado = this.respuestaGrado.data;
      this.itemsGrado = this.consultasGrado.tabla;

      // Validar datos
      this.validarRestGrado();
    },
    async buscarMateria() {
      // Limpieza de datos
      this.itemsMateria = [];

      // Asignar nuevos valores
      this.consultasMateria = this.respuestaMateria.data;
      this.itemsMateria = this.consultasMateria.tabla;
      this.itemsCiclo = this.generarArrayDeAnios();
      // Validar datos
      this.validarRestMateria();
    },
    async buscarActividad() {
      this.progressBuscarMateria = true;
      this.icoBuscarMateria = false;

      // Limpieza de datos
      this.consultas = [];
      this.tabla = [];

      // Asignar nuevos valores
      this.consultas = this.respuesta.data;
      this.tabla = this.consultas.tabla;

      // Validar datos
      this.validarRestActividad();
    },
    async cuadropdf() {
      // ... (código para descargar PDF)
    },

    validarInputMateria() {
      if (this.materia.length <= 0 || this.ciclo.length <= 0 || this.bloque.length <= 0){
        this.alerta = "Seleccionar Materia, Ciclo, Bloque";
        this.makeToast();
        console.log("no validar input " + this.materia);
      } else {
        this.progressBuscarMateria = true;
        this.icoBuscarMateria = false;
        this.buscarActividad();
        console.log("validar input " + this.materia);
      }
    },

    validarRestMateria() {
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
      } else {
        this.tabla.push(this.editedItem);
      }
      console.log(this.tabla);
      this.close();
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Actividad" : "Editar Actividad";
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
    this.buscarMateria();
  },
};
</script>