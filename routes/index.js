require('dotenv').config()
const axios = require('axios');
const controller = require('../controllers')

module.exports = (app) => {
    
    app.get('/admin/students', controller.create);
    app.get('/student/:email', controller.findOne);
    app.post('/schedule', controller.schedule);
}