const user = require('./userRoutes')
const admin = require('./adminRoutes')

module.exports = {
    name: 'base-route',
    version: '1.0.0',
    register: (server, options) => {
        server.route(user);
        server.route(admin);
    }
} 