const controller = require('../controllers')

module.exports = (app) => {
    app.post('/admin/:id/getstudents', controller.addNewStudents);
    app.post('/admin/add', controller.addNewStaff);
    app.get('/student/:email', controller.findOne);
    app.get('/availability/:date/:id', controller.getAvailability);
    app.put('/availability/:date/:id', controller.updateAvailability);
    app.post('/availability/:date/:id', controller.setAvailability);
    app.put('/schedule/:id/:date/:time', controller.scheduleTime);
    // app.get('/student/instructors', controller.)
}