'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GamesSchema extends Schema {
  up () {
    this.create('games', (table) => {
      table.increments()
    })
  }

  down () {
    this.drop('games')
  }
}

module.exports = GamesSchema
