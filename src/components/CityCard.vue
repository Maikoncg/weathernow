<template>
  <div class="CityCard" :class="{ 'force-hover': forceHover }">
    <div class="city-header">
      {{ cityName }}
    </div>

    <div v-if="loading">
      <img
        class="city-loader"
        alt="weathernow loader"
        src="../assets/loader.svg"
        height="50"
      />
    </div>

    <div v-else-if="cityInfo?.main?.temp">
      <div
        class="city-temperature"
        :style="`color: ${temperatureColor(cityInfo.main?.temp)}`"
      >
        {{ convertKelvinToCelsius(cityInfo.main?.temp) }}
        <div class="degrees">°</div>
      </div>

      <div class="city-footer">
        <div class="city-humidity">
          <div>HUMIDITY</div>
          <div class="humidity-value">
            {{ cityInfo.main?.humidity }}
            <span class="abb">%</span>
          </div>
        </div>
        <div class="city-pressure">
          <div>PRESSURE</div>
          <div class="pressure-value">
            {{ cityInfo.main?.pressure }}
            <label class="abb">hPa</label>
          </div>
        </div>
        <div class="city-date">
          {{ formatDate(updatedAt || cityInfo.dt) }}
        </div>
      </div>
    </div>

    <div v-else class="city-error">
      <label class="error-message">Something went wrong</label>
      <button @click="tryAgain(cityName)" class="error-button">
        Try Again
      </button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["fetchCity"],
  props: {
    cityInfo: Object,
    cityName: String,
    loading: Boolean,
    forceHover: Boolean,
    updatedAt: Number,
  },

  data: () => {
    return {
      hover: {},
    };
  },

  methods: {
    convertKelvinToCelsius(temp) {
      const celsius = temp - 273.15;
      return `${celsius.toFixed(0)}`;
    },

    temperatureColor(temp) {
      if (temp <= 278.15) {
        return "#69a3ff";
      } else if (temp <= 298.15) {
        return "#ff9632";
      } else {
        return "#ed1946";
      }
    },

    formatTime(time) {
      if (time < 10) {
        time = "0" + time;
      }
      return time;
    },

    formatDate(timestamp) {
      let date = new Date(null);
      date.setSeconds(timestamp);
      const hours = this.formatTime(date.getHours());
      const minutes = this.formatTime(date.getMinutes());
      const seconds = this.formatTime(date.getSeconds());

      const period = hours <= 11 ? "AM" : "PM";

      return `Updated at ${hours}:${minutes}:${seconds} ${period}`;
    },

    tryAgain(cityName) {
      this.$emit("fetchCity", cityName);
    },
  },
};
</script>

<style scoped>
.CityCard {
  color: #737c84;
  background-color: #ffffff;
  border-radius: 5px;
  border: 1px solid #ebebeb;
  width: 250px;
  height: auto;
  box-shadow: 8px 8px 10px -10px rgba(51, 51, 51, 0.1);
}

.CityCard .city-header {
  padding: 12px 12px;
  font-size: 17px;
  border-bottom: 1px solid #ebebeb;
}

.CityCard .city-loader {
  margin: 50px 50px;
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
  background: #f1f1f1;
  opacity: 50%;
  display: grid;
  font-size: 12px;
  padding: 15px 0 15px 0;
}

.CityCard .city-footer .city-humidity {
  grid-column-start: 1;
  grid-column-end: 1;
  display: none;
}

.CityCard .city-footer .city-pressure {
  grid-column-start: 2;
  grid-column-end: 2;
  display: none;
}

.CityCard:hover .city-footer .city-humidity,
.CityCard:hover .city-footer .city-pressure {
  display: block;
  padding-bottom: 10px;
}

.CityCard.force-hover .city-footer .city-humidity,
.CityCard.force-hover .city-footer .city-pressure {
  display: block;
  padding-bottom: 10px;
}

.CityCard .city-footer .humidity-value,
.CityCard .city-footer .pressure-value {
  font-size: 17px;
  display: inline-flex;
  color: #000000;
  font-weight: bold;
}

.CityCard .city-footer .humidity-value .abb,
.CityCard .city-footer .pressure-value .abb {
  font-size: 11px;
  align-self: center;
}

.CityCard .city-footer .city-date {
  grid-column-start: 1;
  grid-column-end: 3;
  font-size: 10px;
}

.CityCard .city-error {
  padding: 40px 40px;
}

.CityCard .error-message {
  color: #ed1946;
}

.CityCard .error-button {
  color: #737c84;
  background-color: #ffffff;
  padding: 10px;
  width: 100px;
  border-radius: 50px;
  border-color: #737c84;
  margin-top: 20px;
  cursor: pointer;
}

@media (max-width: 600px) {
  .CityCard {
    margin-bottom: 30px;
  }

  .CityCard .city-footer {
    border-top: 1px solid #ebebeb;
    background: #f1f1f1;
    opacity: 50%;
    display: grid;

    font-size: 12px;
    padding-top: 15px;
  }
}
</style>
