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
                        Explora nuestras oportunidades educativas
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-img>
          </v-card>
          <!-- Sección de Breves Reseñas -->
          <v-container class="mt-10">
            <h2 class="text-center">Breves Reseñas</h2>
            <br/>
            <v-row justify="center">
              <v-col
                cols="12"
                md="4"
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
          title: "Excelentes Recursos",
          content:
            "Encontré una amplia gama de recursos educativos que enriquecieron mi enseñanza.",
        },
        {
          title: "Comunidad Activa",
          content:
            "La comunidad docente aquí es increíblemente activa y útil para compartir experiencias.",
        },
        {
          title: "Soporte de Calidad",
          content:
            "Recibí un soporte de alta calidad que me ayudó a resolver desafíos educativos.",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Estilos personalizados según tus preferencias */
</style>
