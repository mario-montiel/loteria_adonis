'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GamesSchema extends Schema {
  up () {
    this.create('games', (table) => {
      table.increments()
      table.string('status', 9).defaultTo('inactive') // preparing | playing
    })
  }

  down () {
    this.drop('games')
  }
}

module.exports = GamesSchema
