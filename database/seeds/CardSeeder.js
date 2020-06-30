'use strict'

/*
|--------------------------------------------------------------------------
| CardSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const db = use('Database')

class CardSeeder {
  static async run() {
    await db.table('cards').insert([{
        'id': '40',
        'name': 'El alacran',
        'path': 'img/cards/alacran.png'
      },
      {
        'id': '38',
        'name': 'El apache',
        'path': 'img/cards/apache.png'
      },
      {
        'id': '33',
        'name': 'La araña',
        'path': 'img/cards/arania.png'
      },
      {
        'id': '10',
        'name': 'El arbol',
        'path': 'img/cards/arbol.png'
      },
      {
        'id': '53',
        'name': 'El arpa',
        'path': 'img/cards/arpa.png'
      },
      {
        'id': '16',
        'name': 'La bandera',
        'path': 'img/cards/bandera.png'
      },
      {
        'id': '17',
        'name': 'El bandolon',
        'path': 'img/cards/bandolon.png'
      },
      {
        'id': '9',
        'name': 'El barril',
        'path': 'img/cards/barril.png'
      },
      {
        'id': '25',
        'name': 'El borracho',
        'path': 'img/cards/borracho.png'
      },
      {
        'id': '22',
        'name': 'La bota',
        'path': 'img/cards/bota.png'
      },
      {
        'id': '8',
        'name': 'La botella',
        'path': 'img/cards/botella.png'
      },
      {
        'id': '42',
        'name': 'La calavera',
        'path': 'img/cards/calavera.png'
      },
      {
        'id': '30',
        'name': 'El camaron',
        'path': 'img/cards/camaron.png'
      },
      {
        'id': '43',
        'name': 'La campana',
        'path': 'img/cards/campana.png'
      },
      {
        'id': '4',
        'name': 'El catrin',
        'path': 'img/cards/catrin.png'
      },
      {
        'id': '36',
        'name': 'El cazo',
        'path': 'img/cards/cazo.png'
      },
      {
        'id': '48',
        'name': 'La chalupa',
        'path': 'img/cards/chalupa.png'
      },
      {
        'id': '27',
        'name': 'El corazon',
        'path': 'img/cards/corazon.png'
      },
      {
        'id': '47',
        'name': 'La corona',
        'path': 'img/cards/corona.png'
      },
      {
        'id': '24',
        'name': 'El cotorro',
        'path': 'img/cards/cotorro.png'
      },
      {
        'id': '3',
        'name': 'La dama',
        'path': 'img/cards/dama.png'
      },
      {
        'id': '2',
        'name': 'El diablo',
        'path': 'img/cards/diablo.png'
      },
      {
        'id': '7',
        'name': 'La escalera',
        'path': 'img/cards/escalera.png'
      },
      {
        'id': '35',
        'name': 'La estrella',
        'path': 'img/cards/estrella.png'
      },
      {
        'id': '1',
        'name': 'El gallo',
        'path': 'img/cards/gallo.png'
      },
      {
        'id': '19',
        'name': 'La garza',
        'path': 'img/cards/garza.png'
      },
      {
        'id': '13',
        'name': 'El gorrito',
        'path': 'img/cards/gorrito.png'
      },
      {
        'id': '31',
        'name': 'Las jaras',
        'path': 'img/cards/jaras.png'
      },
      {
        'id': '23',
        'name': 'La luna',
        'path': 'img/cards/luna.png'
      },
      {
        'id': '52',
        'name': 'La maceta',
        'path': 'img/cards/maceta.png'
      },
      {
        'id': '21',
        'name': 'La mano',
        'path': 'img/cards/mano.png'
      },
      {
        'id': '11',
        'name': 'El melon',
        'path': 'img/cards/melon.png'
      },
      {
        'id': '14',
        'name': 'La muerte',
        'path': 'img/cards/muerte.png'
      },
      {
        'id': '37',
        'name': 'El mundo',
        'path': 'img/cards/mundo.png'
      },
      {
        'id': '32',
        'name': 'El musico',
        'path': 'img/cards/musico.png'
      },
      {
        'id': '26',
        'name': 'El negrito',
        'path': 'img/cards/negrito.png'
      },
      {
        'id': '39',
        'name': 'El nopal',
        'path': 'img/cards/nopal.png'
      },
      {
        'id': '20',
        'name': 'El pajaro',
        'path': 'img/cards/pajaro.png'
      },
      {
        'id': '51',
        'name': 'La palma',
        'path': 'img/cards/palma.png'
      },
      {
        'id': '5',
        'name': 'El paraguas',
        'path': 'img/cards/paraguas.png'
      },
      {
        'id': '15',
        'name': 'La pera',
        'path': 'img/cards/pera.png'
      },
      {
        'id': '50',
        'name': 'El pescado',
        'path': 'img/cards/pescado.png'
      },
      {
        'id': '49',
        'name': 'El pino',
        'path': 'img/cards/pino.png'
      },
      {
        'id': '54',
        'name': 'La rana',
        'path': 'img/cards/rana.png'
      },
      {
        'id': '41',
        'name': 'rosa',
        'path': 'img/cards/rosa.png'
      },
      {
        'id': '28',
        'name': 'La sandia',
        'path': 'img/cards/sandia.png'
      },
      {
        'id': '6',
        'name': 'La sirena',
        'path': 'img/cards/sirena.png'
      },
      {
        'id': '46',
        'name': 'El sol',
        'path': 'img/cards/sol.png'
      },
      {
        'id': '34',
        'name': 'El soldado',
        'path': 'img/cards/soldado.png'
      },
      {
        'id': '29',
        'name': 'El tambor',
        'path': 'img/cards/tambor.png'
      },
      {
        'id': '12',
        'name': 'El valiente',
        'path': 'img/cards/valiente.png'
      },
      {
        'id': '45',
        'name': 'El venado',
        'path': 'img/cards/venado.png'
      },
      {
        'id': '18',
        'name': 'El violonchello',
        'path': 'img/cards/violonchello.png'
      },
    ]);
  }
}

module.exports = CardSeeder
