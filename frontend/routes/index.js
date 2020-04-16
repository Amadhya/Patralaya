const routes = require('next-routes');
const Routes = routes();

const allRoutes=[
  ['blog','/blog/[id]','/blog'],
  ['write_blog','/write_blog','/write_blog'],
  ['blog_feed', '/blog_feed', '/blog_feed'],
  ['profile', '/profile/[id]', '/profile'],
  ['tag', '/tag/[title]', '/tag'],
  ['settings', '/settings', '/settings'],
];

for (let i = 0; i < allRoutes.length; i += 1) {
  Routes.add(...allRoutes[i]);
}

module.exports = Routes;
