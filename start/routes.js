'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
| Documentation: http://adonisjs.com/docs/4.1/routing
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('', () => {
  return {
    greeting: "Hello, I'm a loteria API"
  }
})

Route.group(() => {
  Route.post('login', 'AuthController.login')
  Route.post('signup', 'AuthController.signup')
  Route.get('logout', 'AuthController.logout').middleware('auth')
}).prefix('api')

Route.get('board', 'PruebonController.board');
Route.get('board2/', 'PruebonController.userBoard');
