var _ = require('lodash');
var LoginModel = require('./client/models/loginmodel');
var loginOptions = require('./client/config/loginoptions');

var people = [
    {
        id: 1,
        firstName: 'Henrik',
        lastName: 'Joreteg',
        coolnessFactor: 11
    },
    {
        id: 2,
        firstName: 'Bob',
        lastName: 'Saget',
        coolnessFactor: 2
    },
    {
        id: 3,
        firstName: 'Larry',
        lastName: 'King',
        coolnessFactor: 4
    },
    {
        id: 4,
        firstName: 'Diana',
        lastName: 'Ross',
        coolnessFactor: 6
    },
    {
        id: 5,
        firstName: 'Crazy',
        lastName: 'Dave',
        coolnessFactor: 8
    },
    {
        id: 6,
        firstName: 'Larry',
        lastName: 'Johannson',
        coolnessFactor: 4
    }
];
var id = 7;

var users = [
    {
        token:    1,
        userId:   'ignatius',
        password: 'dmello00'
    },
    {   token:    2,
        userId:   'graceee',
        password: '00dmello'
    }
];

function get(id) {
    return _.findWhere(people, {id: parseInt(id + '', 10)});
}


function getUser(userId, password) {
    return _.findWhere(users, {userId: userId, password: password});
}

exports.register = function (server, options, next) {
    server.route({
        method: 'POST',
        path: '/api/user',
        handler: function (request, reply) {
            var user = request.payload;

            console.log(request.payload);

            //loginOptions.getToken = getToken;   // I WANT TO CALL A FUNCTION DEFINED HERE FROM A MODEL METHOD ??

            var loginModel = new LoginModel({loginOptions: loginOptions, getUser: getUser});
            loginModel.set( user );
            var found = loginModel.fetchModel();
            
            loginModel.validateModel(users);

            reply(loginModel).code(loginModel? 200 : 404).state('userid', found.userId);
        }
    });

    server.route({
       method: 'GET',
       path: '/api/user/{userId}/{password}',
       handler: function(request, reply) {
          var found = getUser( request.params.userId, request.params.password );
          reply(found).code(found ? 200 : 404);
       }
    });

    server.route({
        method: 'GET',
        path: '/api/people',
        handler: function (request, reply) {
            reply(people);
        }
    });

    server.route({
        method: 'POST',
        path: '/api/people',
        handler: function (request, reply) {
            var person = request.payload;
            person.id = id++;
            people.push(person);
            reply(person).code(201);
        }
    });

    server.route({
        method: 'GET',
        path: '/api/people/{id}',
        handler: function (request, reply) {
            var found = get(request.params.id);
            reply(found).code(found ? 200 : 404);
        }
    });

    server.route({
        method: 'DELETE',
        path: '/api/people/{id}',
        handler: function (request, reply) {
            var found = get(request.params.id);
            if (found) people = _.without(people, found);
            reply(found).code(found ? 200 : 404);
        }
    });

    server.route({
        method: 'PUT',
        path: '/api/people/{id}',
        handler: function (request, reply) {
            var found = get(request.params.id);
            if (found) _.extend(found, request.payload);
            reply(found).code(found ? 200 : 404);
        }
    });

    next();
};

exports.register.attributes = {
    version: '0.0.0',
    name: 'fake_api'
};
