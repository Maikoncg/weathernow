<template>
  <div>
    <div class="scrollable-topbar">
      <img
        class="img-logo"
        alt="weathernow logo"
        src="../assets/logo.svg"
        height="24"
      />
    </div>
    <div class="cities-container">
      <CityCard
        v-for="(cityData, index) of citiesInfo"
        :key="cityData.id"
        :cityInfo="cityData"
        :cityName="cities[index]"
        :loading="loading[index]"
        v-on:fetchCity="fetchByCity($event, index)"
      />
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
      cities: ["Nuuk, GL", "Urubici, BR", "Nairobi, KE"],
      promises: [],
      loading: {},
    };
  },

  components: {
    CityCard,
  },

  created() {
    this.loadCitiesData();
    this.updateEachTenMinutes();
  },

  methods: {
    fetch(city) {
      return fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.appid}`
      ).then((response) => response.json());
    },

    async loadCitiesData() {
      this.promises = this.cities.map((city, index) => {
        this.loading[index] = true;
        return this.fetch(city);
      });

      this.citiesInfo = await Promise.all(this.promises);
      this.cities.forEach((item, index) => {
        this.loading[index] = false;
      });
    },

    async fetchByCity(city, index) {
      this.loading[index] = true;
      const cityData = await this.fetch(city);
      this.citiesInfo[index] = cityData;
      this.loading[index] = false;
    },

    updateEachTenMinutes() {
      const tenMinutes = 60000;
      window.setInterval(this.loadCitiesData, tenMinutes);
    },
  },
};
</script>

<style scoped>
@media (min-width: 600px) {
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

  .img-logo {
    margin-top: 15px;
  }
}

@media (max-width: 600px) {
  .scrollable-topbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: block;
    background-color: #ffffff;
    z-index: 2;
  }

  .img-logo {
    margin: 15px 0 10px 0;
  }

  .cities-container {
    background: #f1f1f1;
    align-items: center;
    justify-content: space-evenly;
    display: grid;
    padding-top: 80px;
  }
}
</style>
