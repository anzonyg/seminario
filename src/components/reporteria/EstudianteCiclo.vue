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
                                  v-model="editedItem.nombre"
                                  label="Nombre"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="editedItem.apellido"
                                  label="Apellido"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  type="number"
                                  v-model="editedItem.dpi"
                                  label="DPI"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-select
                                  :items="sexo"
                                  label="Sexo"
                                  v-model="editedItem.sexo"
                                  required
                                ></v-select>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  v-model="editedItem.direccion"
                                  label="Dirección"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                  type="number"
                                  v-model="editedItem.telefono"
                                  label="Telefono"
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
                                      v-model="editedItem.fechaNacimiento"
                                      label="Fecha de Nacimiento"
                                      prepend-icon="mdi-calendar"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="editedItem.fechaNacimiento"
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
                                  v-model="editedItem.correo"
                                  label="Correo"
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
                                  :items="grado"
                                  label="Grado"
                                  v-model="editedItem.grado"
                                  required
                                  item-text="nombre"
                                  :disabled="!switchState"
                                ></v-select>
                              </v-col>
                              <v-col cols="12" sm="6" md="6">
                                <v-file-input
                                  label="File input"
                                  accept="image/png, image/jpeg, image/bmp"
                                  filled
                                  prepend-icon="mdi-camera"
                                  @change="getFilePath"
                                ></v-file-input>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
  
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="close">
                            Cancelar
                          </v-btn>
                          <v-btn color="blue darken-1" text @click="saveDocente">
                            Guardar
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-toolbar>
  
                  <v-dialog v-model="dialog2" max-width="1100px">
                    <v-card>
                      <v-card-title>
                        <span class="text-h5"
                          ><v-avatar color="primary">
                            <img :src="editedItem.foto" alt="John" />
                          </v-avatar>
                          {{ editedItem.nombre }} {{ editedItem.apellido }}</span
                        >
                      </v-card-title>
  
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <h4>DPI: {{ editedItem.dpi }}</h4>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <h4>Sexo: {{ editedItem.sexo }}</h4>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <h4>Dirección: {{ editedItem.direccion }}</h4>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <h4>Telefono: {{ editedItem.telefono }}</h4>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <h4>
                                Fecha de Nacimiento :
                                {{ editedItem.fechaNacimiento }}
                              </h4>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <h4>Correo: {{ editedItem.correo }}</h4>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <h4>Ciclo Escolar: {{ editedItem.ciclo }}</h4>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <h4>Grado: {{ editedItem.grado }}</h4>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <h4>Seccion: {{ editedItem.seccion }}</h4>
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
          nombre: "",
          apellido: "",
          dpi: "",
          sexo: "",
          grado: "",
          seccion: "",
          direccion: "",
          telefono: "",
          fechaNacimiento: "",
          correo: "",
          foto: "",
          ciclo: "",
        },
        defaultItem: {
          nombre: "",
          apellido: "",
          dpi: "",
          sexo: "",
          grado: "",
          seccion: "",
          direccion: "",
          telefono: "",
          fechaNacimiento: "",
          correo: "",
          foto: "",
          ciclo: "",
        },
  
        sexo: ["M", "F"],
  
        grado: [
          { nombre: "Primero A", id: 1 },
          { nombre: "Primero B", id: 2 },
        ],
  
        ciclo: [],
  
        activePicker: null,
        date: null,
        menu: false,
  
        consultas: [],
        tabla: [],
        headers: [
          { text: "Nombre", value: "nombre" },
          { text: "Apellido", value: "apellido" },
          { text: "Grado", value: "grado" },
          { text: "Seccion", value: "seccion" },
          { text: "Detalle", value: "actions", sortable: false },
        ],
        encabezado: [],
        form: {
          nombre: "",
          apellido: "",
          idDocente: "",
        },
        respuesta: {
          data: {
            dato_arma: [
              {
                nombre: "Anzony Rafael",
                apellido: "Gonzalez Rios",
                dpi: 1234123451234,
                sexo: "M",
                grado: "Primero",
                seccion: "A",
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
                grado: "Primero",
                seccion: "B",
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
                grado: "Primero",
                seccion: "A",
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
      async buscarEstudiante() {
        // Limpieza de datos
        this.encabezado = [];
        this.tabla = [];
  
        // Asignar nuevos valores
        this.consultas = this.respuesta.data;
        this.tabla = this.consultas.tabla;
        this.ciclo = this.generarArrayDeAnios();
        this.encabezado = this.consultas.dato_arma;
  
        // Validar datos
        this.validarRest();
      },
  
      validarRest() {
        if (this.consultas.valid == false) {
          this.alerta = "El usuario ha expirado.";
          this.makeToast();
          this.respuestaBusqueda = false;
        } else if (this.consultas.tabla.length <= 0) {
          this.alerta = "El nombre no existe en la base de datos";
          this.makeToast();
          this.respuestaBusqueda = false;
        } else {
          this.respuestaBusqueda = true;
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
        console.log(this.tabla);
      },
      verItem(item) {
        this.editedIndex = this.tabla.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog2 = true;
        console.log(this.tabla);
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
  
      saveDocente() {
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
        return this.editedIndex === -1 ? "Nuevo Estudiante" : "Editar Estudiante";
      },
      formSwitch() {
        return this.editedIndex === -1
          ? "¿Cambiar Grado y/o Ciclo Escolar"
          : "Asignar Grado y/o Ciclo Escolar";
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
    },
  };
  </script>
  