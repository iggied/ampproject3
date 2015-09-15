var _ = require('lodash');
var LoginModel = require('./client/models/loginmodel');
var loginOptions = require('./client/config/loginoptions');
var RegisterModel = require('./client/models/registermodel');
var registerOpts = require('./client/config/registerOpts');
var Q = require('q');

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


exports.register = function (server, options, next) {
    server.route({
        method: ['POST', 'PUT'],
        path: '/api/user/{action}',
        handler: function (request, reply) {
console.log(request.payload);

            switch (request.params.action) {
               case 'login': {

                  var user = request.payload;
                  user.loginOptions = loginOptions;
                  var loginModel = new LoginModel(user);
                  if (loginModel.fetchUser(users)) {
                     loginModel.password = 'V@l1dated>';		// We are not sending the real password back on wire
                  };

                  reply(loginModel).code(loginModel ? 200 : 404).state('userid', loginModel.userId);
                  break;
               }

               case 'register': {
                  var profile = request.payload;
                  profile.registerOpts = registerOpts;
                  var registerModel = new RegisterModel(profile);

                  registerModel.validateModel();

                  registerModel.asyncChecksCompleted().then(function() {
//setTimeout( function() {
                     if (registerModel.isModelValid()) {
                        registerModel.id = '11111';
                     } else { registerModel.id = ''; }

                     reply(registerModel).code(200);
//}, 20);
                    }, function(err){
                       reply(err).code(404);
                    }
                  );
                  break;
               }
            };
        }
    });

    server.route({
       method: 'GET',
       path: '/api/user/{action}',
       handler: function(request, reply) {
console.log(request.params, request.query);
          var found = request.query.email == 'ignatius'; 

var stop = new Date().getTime();
  while(new Date().getTime() < stop + 100) {
     ;
};

          reply(found).code(200);
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
