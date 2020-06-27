'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Game extends Model {
	static get createdAtColumn () {
		return null
	}
	static get updatedAtColumn () {
		return null
	}
}

module.exports = Game
