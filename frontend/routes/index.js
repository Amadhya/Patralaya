const routes = require('next-routes');
const Routes = routes();

const allRoutes=[
  ['login','/login','/login'],
  ['signup','/signup','/SignUp'],
  ['feed', '/feed', '/feed'],
];

for (let i = 0; i < allRoutes.length; i += 1) {
  Routes.add(...allRoutes[i]);
}

module.exports = Routes;
