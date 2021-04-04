const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const config = require('config')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json({ extended: true }))

app.use('/api/employee', require('./routes/employee.routes'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))

  app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || config.get('port')

async function startApp() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    app.listen(PORT, () => {
      console.log(`App has started at PORT ${PORT}`)
    })
  } catch (error) {
    console.log('Server error', error.message)
    process.exit(1)
  }
}

startApp()
