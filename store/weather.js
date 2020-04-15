export const state = () => ({
  weather: {}
})

export const mutations = {
  setWeather(state, weather) {
    state.weather = weather
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
