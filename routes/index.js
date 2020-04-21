const controller = require('../controllers')

module.exports = (app) => {
    app.post('/api/staff/:id/getstudents', controller.addNewStudents);
    app.post('/api/staff/add', controller.addNewStaff);
    app.post('/api/staff/find', controller.findOne)
    app.get('/api/student/find/:email', controller.findOne);
    app.get('/api/availability/:id', controller.getAvailability);
    app.put('/api/availability/:date/:id', controller.updateAvailability);
    app.post('/api/availability/:id', controller.setAvailability);
    app.put('/api/schedule/:instructorId/:studentId', controller.scheduleTime);
    // app.get('/student/instructors', controller.)
}