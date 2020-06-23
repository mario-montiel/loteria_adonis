'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StadisticsSchema extends Schema {
  up () {
    this.create('stadistics', (table) => {
      table.increments()
      table.integer('wins')
      table.integer('lost')
      table.integer('user_id').unsigned().references('id').inTable('users')
    })
  }

  down () {
    this.drop('stadistics')
  }
}

module.exports = StadisticsSchema
