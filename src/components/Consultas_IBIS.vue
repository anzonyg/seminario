<template>
  <div class="consulta">
    <b-container>
      <div class="text-center">
      <br />
      <br />
      <h1>Módulo de Consultas IBIS</h1>
    </div>
      <br>
      <br>
      <b-form-group
        label="Seleccionar tipo de consulta"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-radio-group
          id="radio-slots"
          v-model="selected"
          :options="options"
          :aria-describedby="ariaDescribedby"
          name="radio-options-slots"
          plain
        >
        </b-form-radio-group>
      </b-form-group>
      <br />
      <component :is="selected" />
    </b-container>
  </div>
</template>

<script>
import ConsCuadro from "@/components/Cons_cuadro.vue";
import ConsCorrelativo from "@/components/Cons_correlativo.vue";
import ConsExpediente from "@/components/Cons_expediente.vue";
import ConsArma from "@/components/Cons_arma.vue";

export default {
  name: "Consultas_ibis",
  components: {
    ConsCuadro,
    ConsCorrelativo,
    ConsExpediente,
    ConsArma,
  },
  data() {
    return {
      consultas: [],
      selected: "",
      options: [
        { text: "Consultas por Cuadro", value: "ConsCuadro" },
        { text: "Consultas por Correlativo", value: "ConsCorrelativo" },
        { text: "Consultas por Expediente", value: "ConsExpediente" },
        { text: "Consultas por Arma", value: "ConsArma" },
      ],
    };
  },
};
</script>
