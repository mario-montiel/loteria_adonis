'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CardsSchema extends Schema {
  up () {
    this.create('cards', (table) => {
      table.increments()
      table.string('name', 16)
      table.string('path', 30)
    })
  }

  down () {
    this.drop('cards')
  }
}

module.exports = CardsSchema
