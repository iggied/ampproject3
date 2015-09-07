var _ = require('lodash');

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

function get(id) {
    console.log('id='+id);
    return _.findWhere(people, {id: parseInt(id + '', 10)});
};

function getByName(fname, lname) {
    console.log('fname='+fname);
    console.log('lname='+lname);
    return _.findWhere(people, {firstName: fname, lastName: lname});
};

exports.register = function (server, options, next) {
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
            console.log(found);
            reply(found).code(found ? 200 : 404);
        }
    });

    server.route({
        method: 'GET',
        path: '/api/people/{fname}/{lname}',
        handler: function (request, reply) {
           var found = getByName(request.params.fname, request.params.lname);
           console.log(found);
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
