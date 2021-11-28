import { shallowMount } from "@vue/test-utils";
import CityCard from "@/components/CityCard.vue";

describe("CityCard.vue", () => {
  const wrapper = shallowMount(CityCard);

  it("Should convert a temperature in Celsius", () => {
    const kelvin = 288.15;
    const expectedCelsius = "15";

    const result = wrapper.vm.convertKelvinToCelsius(kelvin);

    expect(result).toEqual(expectedCelsius);
  });

  it("Should return the temperature color", () => {
    const blue = "#69a3ff";
    const orange = "#ff9632";
    const red = "#ed1946";

    const blueTemperature = 277.15;
    const orangeTemperature = 288.15;
    const redTemperature = 303.15;

    const returnBlue = wrapper.vm.temperatureColor(blueTemperature);
    const returnOrange = wrapper.vm.temperatureColor(orangeTemperature);
    const returnRed = wrapper.vm.temperatureColor(redTemperature);

    expect(returnBlue).toEqual(blue);
    expect(returnOrange).toEqual(orange);
    expect(returnRed).toEqual(red);
  });

  it("Should return formatted time", () => {
    const minutes = 7;
    const expectedFormattedMinutes = "07";

    const result = wrapper.vm.formatTime(minutes);

    expect(result).toEqual(expectedFormattedMinutes);
  });

  it("Time already formatted", () => {
    const minutes = 30;
    const expectedFormattedMinutes = 30;

    const result = wrapper.vm.formatTime(minutes);

    expect(result).toEqual(expectedFormattedMinutes);
  });

  it("Should return a date formatted", () => {
    const timestampAM = 1634121101;
    const timestampPM = 1638121172;

    const expectedStringAM = "Updated at 07:31:41 AM";
    const expectedStringPM = "Updated at 14:39:32 PM";

    const resultAM = wrapper.vm.formatDate(timestampAM);
    const resultPM = wrapper.vm.formatDate(timestampPM);

    expect(resultAM).toEqual(expectedStringAM);
    expect(resultPM).toEqual(expectedStringPM);
  });

  it("Should emit fetchCity event", async () => {
    const cityName = "Nuuk, GL";

    wrapper.vm.tryAgain(cityName);

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().fetchCity).toBeTruthy();
    expect(wrapper.emitted().fetchCity.length).toBe(1);
    expect(wrapper.emitted().fetchCity[0][0]).toEqual(cityName);
  });
});
