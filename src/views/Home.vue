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
        v-on:fetchCity="fetch($event)"
        v-on:fetchCities="citiesPromises()"
        :cityInfo="citiesInfo"
        :loading="loading"
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
      loading: false,
    };
  },

  components: {
    CityCard,
  },

  mounted() {
    this.citiesPromises();
  },

  methods: {
    fetch(city) {
      this.loading = true;
      this.promises.push(
        fetch(`
        https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.appid}`)
      );
    },

    citiesPromises() {
      this.cities.map(async (city, index) => {
        this.fetch(city);

        this.citiesInfo = [];
        await Promise.all(this.promises).then((data) => {
          data[index].json().then((cityInfo) => {
            this.citiesInfo.push({ [city]: cityInfo });
            this.loading = false;
            localStorage.setItem("cities", JSON.stringify(this.citiesInfo));
          });
        });
        this.promises = [];
      });
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
