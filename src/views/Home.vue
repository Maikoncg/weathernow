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
        :forceHover="index === 1"
        :updatedAt="updatedAt"
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
      updatedAt: null,
    };
  },

  components: {
    CityCard,
  },

  created() {
    this.updateEachTenMinutes();
    const cities = window.localStorage.getItem("cities");

    if (!cities) {
      this.loadCitiesData();
    } else {
      this.getLocalStorageData(cities);
    }
  },

  methods: {
    fetch(city) {
      this.updatedAt = new Date().getTime() / 1000;
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
        if (this.citiesInfo[index].cod === 200) {
          this.setLocalStorageData();
        }
        this.loading[index] = false;
      });
    },

    async fetchByCity(city, index) {
      this.loading[index] = true;
      const cityData = await this.fetch(city);

      if (cityData.cod === 200) {
        this.updatedLocalStorageData(cityData, index);
      }

      this.citiesInfo[index] = cityData;
      this.loading[index] = false;
    },

    updateEachTenMinutes() {
      const tenMinutes = 600000;
      window.setInterval(() => {
        this.loadCitiesData();

        let requestError = this.citiesInfo.find((city) => city.cod !== 200);
        if (!requestError) {
          this.setLocalStorageData();
        }
      }, tenMinutes);
    },

    getLocalStorageData(cities) {
      this.citiesInfo = JSON.parse(cities);
    },

    setLocalStorageData() {
      window.localStorage.setItem("cities", JSON.stringify(this.citiesInfo));
    },

    updatedLocalStorageData(cityData, index) {
      const cities = window.localStorage.getItem("cities");
      const parsedData = JSON.parse(cities);
      parsedData[index] = cityData;
      window.localStorage.setItem("cities", JSON.stringify(parsedData));
    },
  },
};
</script>

<style scoped>
.cities-container {
  background: #f1f1f1;
  align-items: center;
  justify-content: space-evenly;
  display: grid;
  padding-top: 80px;
}

.scrollable-topbar {
  position: fixed;
  z-index: 2;
  width: 100%;
  height: 55px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 600px) {
  .cities-container {
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    width: 100%;
    position: absolute;
    padding-top: 0px;
  }
}
</style>
