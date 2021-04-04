const seeder = require('mongoose-seed')
const config = require('config')
const getDataForSeeding = require('./data')
const data = getDataForSeeding()

seeder.connect(config.get('mongoUri'), function () {
  seeder.loadModels(['./models/Employee.js'])

  seeder.clearModels(['Employees'], function () {
    seeder.populateModels(data, function () {
      seeder.disconnect()
    })
  })
})
