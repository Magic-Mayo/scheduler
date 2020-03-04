const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
    date: {type: String, require: true},
    time: {type: String, require: true},
    name: {type: String, require: true},
    email: {type: String, require: true}
})

const Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = Schedule;