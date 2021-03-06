const Sequelize = require('sequelize')
const db = require('../db')

const Order = db.define('order', {
  boughtStatus: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  shippingAddress: {
    type: Sequelize.TEXT
  },
  billingAddress: {
    type: Sequelize.TEXT
  }
})

module.exports = Order
// Creating this change in order to push again and hopefully resolve the communication issue between Travis and GitHub.
