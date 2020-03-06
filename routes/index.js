const controller = require('../controllers')

module.exports = (app) => {
    app.get('/admin/:id/students/', controller.addNewStudents);
    app.get('/student/:email', controller.findOne);
    app.get('/availability/:date/:id', controller.getAvailability);
    app.put('/availability/:date/:id', controller.updateAvailability);
    app.post('/availability/:date/:id', controller.setAvailability);
}