'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Game extends Model {
	cards(){
		return this
		.belongsToMany('App/Models/Card')
		.pivotTable('games_has_cards')
	}
	users(){
		return this
		.belongsToMany('App/Models/User')
		.pivotTable('users_has_games')
	}
	static get createdAtColumn () {
		return null
	}
	static get updatedAtColumn () {
		return null
	}
}

module.exports = Game
