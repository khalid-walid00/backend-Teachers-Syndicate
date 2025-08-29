
const mongoose = require('mongoose');
const { users, opts, pages, widgets, widgetCategory, widgetsPage } = require('./schema/index');

module.exports = {
    User: mongoose.model('User', users),
    Otp: mongoose.model('Otp', opts),
    Page: mongoose.model('page', pages),
    Widget: mongoose.model('widget', widgets),
    WidgetCategory: mongoose.model('widgetCategory', widgetCategory),
    WidgetPage: mongoose.model('widgetPage', widgetsPage)
}