'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
const baseRouter = require('./src/Routes');
const Connection = require('./DB/Connection');
const { seedRoles } = require("./Seeders/roleSeeder.js")
require('dotenv').config();


const server = Hapi.server({
    port: process.env.APP_PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
        cors: {
            origin: ['*'], // Allow all origins
            headers: ['Authorization', 'Content-Type', 'If-None-Match'],
            exposedHeaders: ['WWW-Authenticate', 'Server-Authorization'],
            additionalExposedHeaders: ['X-Custom-Header'],
            maxAge: 60,
            credentials: true
        }
    }
});

const init = async () => {
    const swaggerOptions = {
        info: {
            title: 'Bussiness_DB API Documentation',
            version: Pack.version,
        },
        schemes: ['http', 'https'],
        grouping: 'tags',
        // consumes: ['multipart/form-data'],
        consumes: ['application/json'],
        produces: ['application/json'],
        securityDefinitions: {
            jwt: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
                description: 'JWT authorization header using the Bearer scheme'
            }
        }
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return '<h3>Hello!</h3>'
        }
    });
    Connection();
    // seedRoles();
    // Adding plugins for swagger docs;
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                ...swaggerOptions,
                security: [{ jwt: [] }]
            }
        }
    ])

    await server.register(baseRouter, {
        routes: {
            prefix: '/api'
        }
    });


    // Serve static files from the uploads directory
    server.route({
        method: 'GET',
        path: '/uploads/{param*}',
        handler: {
            directory: {
                path: './src/uploads',
                redirectToSlash: true,
                index: false,
            }
        }
    });
    // http://localhost:3000/uploads/1740231972449_bulb1.jpg


    await server.start();
    console.log('Server running on %s', server.info.uri);
    console.log('Check swagger on %s', `${server.info.uri}/documentation`);
};

init();