const { Schema, model } = require('mongoose')

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  country: { type: String, required: true },
  company: { type: String, required: true },
})

module.exports = model('Employees', schema)
