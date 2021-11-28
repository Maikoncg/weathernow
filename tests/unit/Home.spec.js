import Home from "@/views/Home.vue";
import { shallowMount } from "@vue/test-utils";

const makeFetchResp = (value) => ({ json: () => Promise.resolve(value) });

global.fetch = jest
  .fn()
  .mockResolvedValue(makeFetchResp({ cod: 200 }))
  .mockResolvedValueOnce(makeFetchResp({ cod: 201 }));

beforeAll(() => {
  fetch.mockClear();
});

describe("Home.vue", () => {
  const wrapper = shallowMount(Home);

  it("Should get localStorageData through created", async () => {
    const data = { test: {} };
    window.localStorage.setItem("cities", JSON.stringify(data));
    shallowMount(Home);
    const result = JSON.parse(window.localStorage.getItem("cities"));

    expect(result.test).toEqual({});
  });

  it("Should fetch main city", async () => {
    global.fetch = jest.fn().mockResolvedValue(makeFetchResp({ cod: 200 }));

    const cityName = "Nuuk,GL";
    await wrapper.vm.fetchByCity(cityName, 0);

    expect(wrapper.vm.citiesInfo[0].cod).toEqual(200);
  });

  it("Should fetch non-main cities", async () => {
    global.fetch = jest.fn().mockResolvedValue(makeFetchResp({ cod: 201 }));

    const cityName = "Joinville,SC";
    await wrapper.vm.fetchByCity(cityName, 0);

    expect(wrapper.vm.citiesInfo[0].cod).toEqual(201);
  });

  it("Should get localStorage data", () => {
    const data = { test: {} };
    window.localStorage.setItem("cities", JSON.stringify(data));
    const result = window.localStorage.getItem("cities");

    wrapper.vm.getLocalStorageData(result);
    expect(wrapper.vm.citiesInfo).toEqual(data);
  });

  it("Should set localStorage data", () => {
    const data = { test: {} };

    wrapper.vm.citiesInfo = data;
    wrapper.vm.setLocalStorageData();

    const result = JSON.parse(window.localStorage.getItem("cities"));

    expect(result).toEqual(data);
  });

  it("Should update localStorage data", () => {
    const data = {
      0: { name: "Joinville" },
      1: { name: "Blumenau" },
    };

    const newInput = { name: "Recife" };

    wrapper.vm.citiesInfo = data;
    wrapper.vm.setLocalStorageData();
    wrapper.vm.updatedLocalStorageData(newInput, 1);

    const names = JSON.parse(window.localStorage.getItem("cities"));
    expect(names[1]).toEqual(newInput);
  });

  it("Should NOT set localStorage city information after ten minutes", () => {
    const oldData = { data: 0 };
    const localStorageData = JSON.parse(window.localStorage.getItem("cities"));

    window.localStorage.setItem("cities", JSON.stringify(oldData));

    jest.useFakeTimers();
    wrapper.vm.citiesInfo = [];
    wrapper.vm.updateEachTenMinutes();
    jest.advanceTimersByTime(600000);

    expect(localStorageData).not.toEqual(oldData);
  });

  it("Should set localStorage city information after ten minutes", () => {
    const oldData = { data: 0 };

    window.localStorage.setItem("cities", JSON.stringify(oldData));
    const localStorageData = JSON.parse(window.localStorage.getItem("cities"));

    jest.useFakeTimers();
    wrapper.vm.loadCitiesData();
    wrapper.vm.updateEachTenMinutes();
    jest.advanceTimersByTime(600000);

    expect(localStorageData).toEqual(oldData);
  });
});
