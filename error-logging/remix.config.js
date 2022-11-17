const { flatRoutes } = require('remix-flat-routes')

/**
 * @type {import("@remix-run/dev").AppConfig}
 */
module.exports = {
  // ignore all files in routes folder to prevent
  // default remix convention from picking up routes
  ignoredRouteFiles: ['**/*'],
  routes: async defineRoutes => {
    return flatRoutes('routes', defineRoutes, {
      basePath: '/', // optional base path (defaults to /)
      paramPrefixChar: '$', // optional specify param prefix
      ignoredRouteFiles: [], // same as remix config
    })
  },
}
