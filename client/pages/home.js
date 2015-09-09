var PageView = require('./baseview');
var templates = require('../templates');


module.exports = PageView.extend({
    pageTitle: 'home',
    template: templates.pages.home
});
