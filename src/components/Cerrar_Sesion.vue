<template>
  <div class="text-center">
    <br />
    <br />
    <br />
    <b-row>
      <b-col md="3"> </b-col>
      <b-col md="3">
        <b-icon
          font-scale="20"
          animation="throb"
          icon="shield-check"
          variant="danger"
        ></b-icon>
      </b-col>
      <b-col md="3">
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1>Sesion Cerrada!</h1>
      </b-col>
      <b-col md="3"> </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "salir",
  data() {
    return {
      nombrecompleto: "",
    };
  },
  methods: {
    
  },
  beforeCreated: function () {
    
      localStorage.removeItem("datos");
    
  },
};
</script>