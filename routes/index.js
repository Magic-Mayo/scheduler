const controller = require('../controllers')

module.exports = (app) => {
    app.post('/staff/:id/getstudents', controller.addNewStudents);
    app.post('/staff/add', controller.addNewStaff);
    app.post('/staff/find', controller.findOne)
    app.get('/student/find/:email', controller.findOne);
    app.get('/availability/:id', controller.getAvailability);
    app.put('/availability/:date/:id', controller.updateAvailability);
    app.post('/availability/:date/:id', controller.setAvailability);
    app.put('/schedule/:instructorId/:studentId', controller.scheduleTime);
    // app.get('/student/instructors', controller.)
}