<template>
  <div class="text-center">
    <br />
    <br />
    <br />
    <b-row>
      <b-col md="3"> </b-col>
      <b-col md="3">
        <b-icon font-scale="20" animation="throb" icon="exclamation-circle" variant="danger"></b-icon>
      </b-col>
      <b-col md="3">
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1>Acceso Denegado!</h1>
      </b-col>
      <b-col md="3"> </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "bloqueo",
  data() {
    return {
      nombrecompleto: "",
    };
  },
  methods: {},
  mounted: function () {},
};
</script>