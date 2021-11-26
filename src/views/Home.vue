<template>
  <div>
    <img
      class="img-logo"
      alt="Weathernow logo"
      src="../assets/logo.svg"
      height="24"
    />
    <div class="cities-container">
      <CityCard :cityInfo="citiesInfo" />
    </div>
  </div>
</template>

<script>
import CityCard from "@/components/CityCard.vue";

export default {
  data() {
    return {
      appid: "8b3d125c075cfa693aff93c73387be0f",
      citiesInfo: [],
      cities: ["Nuuk", "Urubici", "Nairobi"],
    };
  },

  components: {
    CityCard,
  },

  mounted() {
    for (let city of this.cities) {
      this.fetchCity(city);
    }
  },

  methods: {
    fetchCity(city) {
      fetch(`
        https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.appid}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.citiesInfo.push(data);
        });
    },
  },
};
</script>

<style scoped>
.img-logo {
  margin-top: 10px;
}

.cities-container {
  background: #f1f1f1;
  border: 1px solid #ebebeb;
  width: 1024px;
  height: 835px;
  margin: 0 auto;
  margin-top: 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
