const routes = require('next-routes');
const Routes = routes();

const allRoutes=[
  ['blog','/blog/[id]','/blog'],
  ['write_blog','/write_blog','/write_blog'],
  ['blog_feed', '/blog_feed', '/blog_feed'],
  ['profile', '/profile/[id]', '/profile'],
  ['settings', '/settings', '/settings'],
];

for (let i = 0; i < allRoutes.length; i += 1) {
  Routes.add(...allRoutes[i]);
}

module.exports = Routes;
