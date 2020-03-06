const controller = require('../controllers')

module.exports = (app) => {
    
    app.get('/admin/students', controller.addNewStudents);
    app.get('/student/:email', controller.findOne);
    app.post('/schedule', controller.schedule);
    app.get('/availability/:date', controller.getAvailability);
}