'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StadisticsSchema extends Schema {
  up () {
    this.create('stadistics', (table) => {
      table.increments()
      table.integer('wins')
      table.integer('lost')
    })
  }

  down () {
    this.drop('stadistics')
  }
}

module.exports = StadisticsSchema
