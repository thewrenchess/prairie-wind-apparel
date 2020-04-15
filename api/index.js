const express = require('express')
const axios = require('axios')

const app = express()
const router = express.Router()

const WEATHER_API_KEY = process.env.WEATHER_API_KEY
if (!WEATHER_API_KEY) {
  throw new Error('missing WEATHER_API_KEY')
}

router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

router.get('/', (req, res) => {
  console.log('got here')

  const ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress

  if (ip) {
    console.log('got ip', ip)
    return axios.get('https://api.weatherapi.com/v1/current.json', {
      headers: {
        'XContent-Type': 'application/json'
      },
      params: {
        q: ip !== '127.0.0.1' ? ip : '18.206.69.11',
        key: WEATHER_API_KEY
      }
    })
      .then(response => {
        const data = response.data || {}
        const current = data.current || {}

        const {
          temp_f: tempF,
          condition
        } = current
        return res.json({
          tempF,
          condition
        })
      })
      .catch(error => {
        console.log('got error')
        console.log(error)
        return res.status(400)
          .json({ message: 'No matching location found by ip address.' })
      })
  } else {
    console.log('no ip found')
    return res.status(400)
      .json({ message: 'no IP address found' })
  }
})

module.exports = {
  path: '/api',
  handler: router
}
