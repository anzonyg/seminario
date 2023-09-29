<template>
  <v-container>
    <!-- FORMULARIO BUSQUEDA DE MATERIA -->
    <v-row v-if="respuestaBusquedaGrado">
      <v-col md="9" cols="12" align="center">
        <br />
        <v-select
          :items="itemsGrado"
          label="Seleccionar grado y seccion"
          v-model="grado"
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
                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="editedItem.nombre"
                                label="Materia"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="editedItem.descripcion"
                                label="Descripcion"
                                required
                              ></v-text-field>
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
        { text: "Materia", value: "nombre" },
        { text: "Descripcion", value: "descripcion" },
        { text: "Detalle", value: "actions", sortable: false },
      ],

      dialog: false,
      dialogDelete: false,
      desserts: [],
      editedIndex: -1,
      editedItem: {
        nombre: "",
        descripcion: "",
      },
      defaultItem: {
        nombre: "",
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
      // Limpieza de datos
      this.itemsGrado = [];

      // Asignar nuevos valores
      this.consultasGrado = this.respuestaGrado.data;
      this.itemsGrado = this.consultasGrado.tabla;

      // Validar datos
      this.validarRestGrado();
    },

    async buscarActividad() {
      this.progressBuscarGrado = true;
      this.icoBuscarGrado = false;

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

    validarInputGrado() {
      if (this.grado.length <= 0) {
        this.alerta = "Seleccionar Grado, Ciclo, Bloque";
        this.makeToast();
        console.log("no validar input " + this.grado);
      } else {
        this.progressBuscarGrado = true;
        this.icoBuscarGrado = false;
        this.buscarActividad();
        console.log("validar input " + this.grado);
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

    validarRestActividad() {
      this.progressBuscarGrado = false;
      this.icoBuscarGrado = true;
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
    this.buscarGrado();
  },
};
</script>