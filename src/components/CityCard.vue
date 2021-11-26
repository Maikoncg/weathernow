<template>
  <div class="CityCard" v-for="(city, index) in cityInfo" :key="city?.id">
    <div class="city-header">
      {{ formatHeader(city.name, city.sys.country) }}
    </div>
    <div class="city-temperature" :style="`color: ${city.temperatureColor}`">
      {{ formatTemperature(index, city.main.temp) }}
      <div class="degrees">°</div>
    </div>
    <div class="city-footer">
      <div class="city-humidity">
        <div>HUMIDITY</div>
        <div class="humidity-value">
          {{ city.main.humidity }}
          <span class="abb">%</span>
        </div>
      </div>
      <div class="city-pressure">
        <div>PRESSURE</div>
        <div class="pressure-value">
          {{ city.main.pressure }}
          <label class="abb">hPa</label>
        </div>
      </div>
      <div class="city-date">{{ formatDate(city.dt) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cityInfo: Object,
  },

  data: () => {
    return {
      temperatureColor: "",
    };
  },

  methods: {
    formatHeader(city, country) {
      return `${city}, ${country}`;
    },

    formatTemperature(index, temp) {
      let temperatureColor = "";
      const celsius = temp - 273.15;
      if (celsius <= 5) {
        temperatureColor = "#69a3ff";
      } else if (celsius <= 25) {
        temperatureColor = "#ff9632";
      } else {
        temperatureColor = "#ed1946";
      }

      // eslint-disable-next-line vue/no-mutating-props
      this.cityInfo[index].temperatureColor = temperatureColor;

      return `${celsius.toFixed(0)}`;
    },

    formatTime(time) {
      if (time < 10) {
        time = "0" + time;
      }
      return time;
    },

    formatDate(timestamp) {
      var date = new Date(null);
      date.setSeconds(timestamp);
      const hours = this.formatTime(date.getHours());
      const minutes = this.formatTime(date.getMinutes());
      const seconds = this.formatTime(date.getSeconds());

      const period = hours <= 11 ? "AM" : "PM";

      return `Updated at ${hours}:${minutes}:${seconds} ${period}`;
    },
  },
};
</script>

<style scoped>
.CityCard {
  color: #767f86;
  background-color: #ffffff;
  border-radius: 5px;
  border: 1px solid #ebebeb;
  width: 250px;
  height: 270px;
  box-shadow: 8px 8px 10px -10px rgba(51, 51, 51, 0.1);
}

.CityCard .city-header {
  padding: 12px 12px;
  font-size: 17px;
  border-bottom: 1px solid #ebebeb;
}

.CityCard .city-temperature {
  padding: 20px 20px;
  font-size: 84px;
  display: inline-flex;
}

.CityCard .city-temperature .degrees {
  font-size: 48px;
  padding-top: 13px;
}

.CityCard .city-footer {
  border-top: 1px solid #ebebeb;
  height: 200px;
  min-height: 250px;
  background: #f1f1f1;
  opacity: 50%;
  display: grid;
  grid-template-rows: auto 160px auto 20px auto;
  font-size: 12px;
  padding-top: 15px;
}

.CityCard .city-footer .city-humidity {
  grid-column-start: 1;
  grid-column-end: 1;
  grid-row-start: 1;
  grid-row-end: 1;
}

.CityCard .city-footer .city-pressure {
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 1;
}

.CityCard .city-footer .humidity-value,
.CityCard .city-footer .pressure-value {
  font-size: 17px;
  display: inline-flex;
  color: #000000;
  font-weight: bold;
}

.CityCard .city-footer .humidity-value .abb,
.CityCard .city-footer .pressure-value .abb{
  font-size: 11px;
  align-self: center;
}

.CityCard .city-footer .city-date {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 2;
  font-size: 10px;
}
</style>
