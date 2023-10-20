<template>
  <v-container>
    <!-- RESPUESTA DE BUSQUEDA ACTIVIDAD -->
    <v-container id="cuadro1" v-if="respuestaBusqueda">
      <v-row>
        <v-col cols="12">
          <br />
          <div class="table-responsive">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscador"
              single-line
              hide-details
            ></v-text-field>

            <v-data-table :headers="headers" :items="tabla" :search="search">
              <template v-slot:top>
                <br />
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
                        v-if="admin"
                      >
                        Añadir Estudiante
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.Codigo_personal"
                                label="Codigo Personal"
                                :disabled="switchState"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.Nombre"
                                label="Nombre"
                                :disabled="switchState"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.Apellido"
                                label="Apellido"
                                :disabled="switchState"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.Nombre_mama"
                                label="Nombre de la Madre"
                                :disabled="switchState"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.Nombre_papa"
                                label="Nombre del Padre"
                                :disabled="switchState"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                :items="tablaGradoOptions"
                                label="Seleccionar grado y seccion"
                                v-model="editedItem.Grado"
                                item-text="nombreSeccion"
                                item-value="ID"
                                :disabled="switchState"
                                required
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-select
                                :items="sexo"
                                label="Sexo"
                                v-model="editedItem.Sexo"
                                item-text="text"
                                item-value="value"
                                :disabled="switchState"
                                required
                              ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                type="number"
                                v-model="editedItem.Telefono"
                                label="Telefono"
                                :disabled="switchState"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="editedItem.FechaNacimiento"
                                    label="Fecha de Nacimiento"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                    :disabled="switchState"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="editedItem.FechaNacimiento"
                                  :active-picker.sync="activePicker"
                                  locale="es-US"
                                  :max="
                                    new Date(
                                      Date.now() -
                                        new Date().getTimezoneOffset() * 60000
                                    )
                                      .toISOString()
                                      .substring(0, 10)
                                  "
                                  min="1950-01-01"
                                  @change="save"
                                ></v-date-picker>
                              </v-menu>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-text-field
                                v-model="editedItem.Direccion"
                                label="Dirección"
                                :disabled="switchState"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <v-switch
                                v-model="switchState"
                                :label="formSwitch"
                              ></v-switch>
                              <v-select
                                :items="ciclo"
                                label="Ciclo Escolar"
                                v-model="editedItem.ciclo"
                                required
                                :disabled="!switchState"
                              ></v-select>
                              <v-select
                                :items="tablaGradoOptions"
                                label="Seleccionar grado y seccion"
                                v-model="editedItem.Grado"
                                item-text="nombreSeccion"
                                item-value="ID"
                                required
                                :disabled="!switchState"
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
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="saveEstudiante"
                        >
                          Guardar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>

                <!-- VER DATOS -->
                <v-dialog v-model="dialog2" max-width="1100px">
                  <v-card>
                    <v-card-title>
                      <span class="text-h5"
                        >
                        {{ editedItem.Nombre }} {{ editedItem.Apellido }}</span
                      >
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="6">
                            <h4>
                              Codigo Personal: {{ editedItem.Codigo_personal }}
                            </h4>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <h4>Telefono: {{ editedItem.Telefono }}</h4>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <h4>Sexo: {{ editedItem.FechaNacimiento }}</h4>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <h4>Dirección: {{ editedItem.Direccion }}</h4>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <h4>Nombre de la Madre: {{ editedItem.Nombre_mama }}</h4>
                          </v-col>
                          <v-col cols="12" sm="6" md="6">
                            <h4>Nombre del Padre: {{ editedItem.Nombre_papa }}</h4>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close2">
                        Cerrar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="verItem(item)">
                  mdi-eye
                </v-icon>
                <v-icon v-if="admin" small class="mr-2" @click="editItem(item)">
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
const urlGrado = cf.url + "/ListarGrado";
const url = cf.url + "/ListarEstudiante";
const AddEstudiante = cf.url + "/AgregarEstudiante";
const uEstudiante = cf.url + "/ModificarAlumnosDatos";
const uGrado = cf.url + "/ModificarGradoAlumno";

export default {
  data() {
    return {
      admin: false,
      tablaGrado: [], //selectbox de grado
      grado: {
        ID: "",
      }, // valor que se selecciono en selectbox de grado

      consultasGrado: [], // ingresa datos del backend

      respuestaBusqueda: false,
      alerta: "",
      progressBuscar: false,
      icoBuscar: true,

      switchState: false,
      imagePath: null,

      search: "",

      dialog: false,
      dialog2: false,
      dialogDelete: false,
      desserts: [],
      editedIndex: -1,
      editedItem: {
        ID: "",
        Codigo_personal: "",
        Nombre: "",
        foto: "",
        Apellido: "",
        Grado: "",
        Direccion: "",
        Telefono: "",
        Nombre_papa: "",
        Nombre_mama: "",
        FechaNacimiento: "",
        Sexo: "",
        ciclo: "",
      },
      defaultItem: {
        ID: "",
        Codigo_personal: "",
        Nombre: "",
        foto: "",
        Apellido: "",
        Grado: "",
        Direccion: "",
        Telefono: "",
        Nombre_papa: "",
        Nombre_mama: "",
        FechaNacimiento: "",
        Sexo: "",
        ciclo: "",
      },
      formEditar: {
        Codigo_personal: "",
        Nombre: "",
        foto: "",
        Apellido: "",
        Grado: "",
        Direccion: "",
        Telefono: "",
        Nombre_papa: "",
        Nombre_mama: "",
        FechaNacimiento: "",
        Sexo: "",
      },

      sexo: [
        { text: "F", value: 0 },
        { text: "M", value: 1 },
      ],

      ciclo: [],

      formEditarGrado: {
        Id_alumno: "",
        anio: "",
        grado: "",
      },

      activePicker: null,
      date: null,
      menu: false,

      consultas: [],
      tabla: [],
      headers: [
        { text: "Nombre", value: "Nombre" },
        { text: "Apellido", value: "Apellido" },
        { text: "Detalle", value: "actions", sortable: false },
      ],
      encabezado: [],
      form: {
        Nombre: "",
        Apellido: "",
      },
      respuesta: {
        data: {
          dato_arma: [
            {
              nombre: "Anzony Rafael",
              apellido: "Gonzalez Rios",
              dpi: 1234123451234,
              sexo: "M",
              grado1: "Primero",
              seccion1: "A",
              ciclo: "2023",
              direccion: "Villa Nueva",
              telefono: "12345678",
              fechaNacimiento: "1996-04-01",
              correo: "agonzalez@gmail.com",
              foto: "https://randomuser.me/portraits/men/1.jpg",
            },
          ],
          tabla: [
            {
              nombre: "Anzony Rafael",
              apellido: "Gonzalez Rios",
              dpi: 1234123451234,
              sexo: "M",
              grado1: "Primero",
              seccion1: "B",
              ciclo: "2023",
              direccion: "Villa Nueva",
              telefono: "12345678",
              fechaNacimiento: "1996-04-01",
              correo: "agonzalez@gmail.com",
              foto: "https://randomuser.me/portraits/men/1.jpg",
            },
            {
              nombre: "Anzony Rafael",
              apellido: "Gonzalez Rios",
              dpi: 1234123451234,
              sexo: "M",
              grado1: "Primero",
              seccion1: "A",
              ciclo: "2023",
              direccion: "Villa Nueva",
              telefono: "12345678",
              fechaNacimiento: "1996-04-01",
              correo: "agonzalez@gmail.com",
              foto: "https://randomuser.me/portraits/men/1.jpg",
            },
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
        this.admin = true;
      } else {
        this.admin = false;
      }
    },
    async buscarEstudiante() {
      await axios.post(url, this.formEditar).then((data) => {
        // Limpieza de datos
        this.tabla = [];

        // Asignar nuevos valores
        this.consultas = data.data;
        this.tabla = this.consultas.tabla;
        this.ciclo = this.generarArrayDeAnios();
      });
      // Validar datos
      this.validarRest();
    },
    async actualizarEstudiante() {
      await axios.post(uEstudiante, this.formEditar).then((data) => {
        // Limpieza de datos
        this.encabezado = [];
        this.tabla = [];
        // Asignar nuevos valores
        this.consultas = data.data;
      });
      // Validar datos
      this.validarRestEditar();
    },
    async crearEstudiante() {
      await axios.post(AddEstudiante, this.formEditar).then((data) => {
        this.consultas = data.data;
      });
      // Validar datos
      this.validarRestCrear();
    },
    async actualizarGrado() {
      await axios.post(uGrado, this.formEditarGrado).then((data) => {
        // Asignar nuevos valores
        this.consultas = data.data;
      });
      // Validar datos
      this.validarRestEditarGrado();
    },

    validarRest() {
      if (this.consultas.validar == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
        this.icoBuscar = true;
        this.respuestaBusqueda = false;
      } else if (this.consultas.tabla.length <= 0) {
        this.alerta = "No hay alumnos en la base de datos";
        this.makeToast();
        this.icoBuscar = true;
        this.respuestaBusqueda = true;
      } else {
        this.icoBuscar = true;
        this.respuestaBusqueda = true;
        this.validraAdmin();
      }
    },
    validarRestCrear() {
      if (this.consultas.validar == false) {
        this.alerta = "El estudiante no se ha registrado.";
        this.makeToast();
      } else {
        this.alerta = "El estudiante se ha registrado";
        this.makeToast();
        this.buscarEstudiante();
      }
    },
    validarRestEditar() {
      if (this.consultas.validar == false) {
        this.alerta = "El estudiante no se ha editado.";
        this.makeToast();
      } else {
        this.alerta = "El estudiante se ha editado";
        this.makeToast();
        this.buscarEstudiante();
      }
    },
    validarRestEditarGrado() {
      if (this.consultas.validar == false) {
        this.alerta = "El grado no se ha editado.";
        this.makeToast();
      } else {
        this.alerta = "El grado se ha editado";
        this.makeToast();
        this.buscarEstudiante();
      }
    },

    validarInputEditarGrado() {
      if (
        this.formEditarGrado.Id_alumno <= 0 ||
        this.formEditarGrado.anio <= 0 ||
        this.formEditarGrado.anio == "undefined" ||
        this.formEditarGrado.grado <= 0
      ) {
        return false;
      } else {
        return true;
      }
    },

    async buscarGrado() {
      await axios.post(urlGrado, this.formEditar).then((data) => {
        // Limpieza de datos

        // Asignar nuevos valores
        this.consultasGrado = data.data;
        this.tablaGrado = this.consultasGrado.tabla;
      });
      this.itemsCiclo = this.generarArrayDeAnios();
      // Validar datos
      this.validarRestGrado();
    },
    validarRestGrado() {
      if (this.consultasGrado.valid == false) {
        this.alerta = "El usuario ha expirado.";
        this.makeToast();
      } else if (this.consultasGrado.tabla.length <= 0) {
        this.alerta = "La grado no existe en la base de datos";
        this.makeToast();
      }
    },

    generarArrayDeAnios() {
      const anioActual = new Date().getFullYear();
      const anioSiguiente = anioActual + 1;
      const arrayDeAnios = [];

      for (let anio = 2023; anio <= anioSiguiente; anio++) {
        arrayDeAnios.push(anio);
      }

      return arrayDeAnios;
    },

    getFilePath() {
      const fileInput = this.$refs.fileInput;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const filePath = URL.createObjectURL(file);
        this.imagePath = filePath;
      } else {
        console.error("No se pudo obtener el archivo seleccionado.");
      }
    },

    editItem(item) {
      this.editedIndex = this.tabla.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    verItem(item) {
      this.editedIndex = this.tabla.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog2 = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    close2() {
      this.dialog2 = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save(date) {
      this.$refs.menu.save(date);
    },

    saveEstudiante() {
      if (this.editedIndex > -1) {
        if (this.switchState) {
          this.formEditarGrado.Id_alumno = this.editedItem.ID + "";
          this.formEditarGrado.anio = this.editedItem.ciclo + "";
          this.formEditarGrado.grado = this.editedItem.Grado + "";
          if (this.validarInputEditarGrado()) {
            this.actualizarGrado();
          } else {
            this.alerta = "Seleccionar ciclo escolar o grado";
            this.makeToast();
          }
        } else {
          Object.assign(this.tabla[this.editedIndex], this.editedItem);

          this.formEditar.ID = this.editedItem.ID + "";
          this.formEditar.Codigo_personal =
            this.editedItem.Codigo_personal + "";
          this.formEditar.Nombre = this.editedItem.Nombre + "";
          this.formEditar.foto = this.editedItem.foto + " ";
          this.formEditar.Apellido = this.editedItem.Apellido + "";
          this.formEditar.Grado = this.editedItem.Grado + "";
          this.formEditar.Direccion = this.editedItem.Direccion + "";
          this.formEditar.Telefono = this.editedItem.Telefono + "";
          this.formEditar.Nombre_papa = this.editedItem.Nombre_papa + "";
          this.formEditar.Nombre_mama = this.editedItem.Nombre_mama + "";
          this.formEditar.FechaNacimiento =
            this.editedItem.FechaNacimiento + "";
          this.formEditar.Sexo = this.editedItem.Sexo + "";
          this.actualizarEstudiante();
        }
      } else {
        this.formEditar.Codigo_personal = this.editedItem.Codigo_personal + "";
        this.formEditar.Nombre = this.editedItem.Nombre + "";
        this.formEditar.foto = this.editedItem.foto + " ";
        this.formEditar.Apellido = this.editedItem.Apellido + "";
        this.formEditar.Direccion = this.editedItem.Direccion + "";
        this.formEditar.Grado = this.editedItem.Grado + "";
        this.formEditar.Telefono = this.editedItem.Telefono + "";
        this.formEditar.Nombre_papa = this.editedItem.Nombre_papa + "";
        this.formEditar.Nombre_mama = this.editedItem.Nombre_mama + "";
        this.formEditar.FechaNacimiento = this.editedItem.FechaNacimiento + "";
        this.formEditar.Sexo = this.editedItem.Sexo + "";
        this.crearEstudiante();
      }
      this.close();
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Estudiante" : "Editar Estudiante";
    },
    formSwitch() {
      return this.editedIndex === -1
        ? "¿Cambiar Grado y/o Ciclo Escolar"
        : "Asignar Grado y/o Ciclo Escolar";
    },
    tablaGradoOptions() {
      return Object.values(this.tablaGrado).map((item) => ({
        ...item,
        nombreSeccion: `${item.NombreGrado} ${item.SECCION}`,
      }));
    },
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.buscarEstudiante();
    this.buscarGrado();
  },
};
</script>