export const state = () => ({
  collectionLimit: 12
})

export const mutations = {}

export const actions = {
  async nuxtServerInit(ctx, context) {
    await this.$nacelle.nacelleNuxtServerInit(ctx, context)
    await context.$axios.$get('/api')
      .then(result => {
        ctx.commit('weather/setWeather', result)
      })
      .catch(error => {
        console.log(error)
        console.log('error getting weather', error.message)
      })
  }
}
