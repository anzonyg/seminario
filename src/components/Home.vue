<template>
  <v-app>
    <v-container fluid style="min-height: 434px">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-img src="@/assets/home.jpg" height="350" class="grey darken-4">
              <v-row align="center" justify="center" class="pa-6">
                <v-col cols="12" sm="8" md="6">
                  <v-card class="elevation-12">
                    <v-card-text>
                      <h1 class="display-3 text-center">Bienvenido, Docente</h1>
                      <p class="subtitle-1 text-center">
                        Escuela Oficial Urbana Mixta No. 460 Santa Luisa
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-img>
          </v-card>
          <!-- Sección de Breves Reseñas -->
          <v-container class="mt-10">
            <h2 class="text-center">Nuestra Misión y Visión</h2>
            <br/>
            <v-row justify="center">
              <v-col
                cols="12"
                md="3"
                v-for="(review, index) in reviews"
                :key="index"
              >
                <v-card class="elevation-6">
                  <v-card-title>{{ review.title }}</v-card-title>
                  <v-card-text>
                    {{ review.content }}
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "DocenteLandingPage",
  data() {
    return {
      reviews: [
        {
          title: "Misión",
          content:
            "Somos una institución que realiza con excelencia y de forma integral el proceso educativo, fundamentado en valores, principios y el temor de Dios; incorporando a la sociedad hombres y mujeres de éxito, proporcionándoles las herramientas necesarias para que sean competitivos en todas las áreas productivas de nuestro país.",
        },
        {
          title: "Visión",
          content:
            "Brindar un servicio educativo de calidad, cumpliendo responsablemente con las normas del Ministerio de Educación, para cubrir las expectativas y necesidades de la comunidad educativa y formar ciudadanos con conciencia crítica de su entorno.",
        },
        {
          title: "MISIÓN MINEDUC",
          content:
            "Somos una institución evolutiva, organizada, eficiente y eficaz, generadora de oportunidades de enseñanza-aprendizaje, orientada a resultados, que aprovecha diligentemente las oportunidades que el siglo XXI le brinda y comprometida con una Guatemala mejor.",
        },
        {
          title: "VISIÓN MINEDUC",
          content:
            "Formar ciudadanos con carácter, capaces de aprender por sí mismos, orgullosos de ser guatemaltecos, empeñados en conseguir su desarrollo integral, con principios, valores y convicciones que fundamentan su conducta.",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Estilos personalizados según tus preferencias */
</style>
