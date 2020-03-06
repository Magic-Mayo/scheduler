const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
    months: [{
        month: {type: String, require: true},
        days: [{
            date: {type: Date, require: true},
            times: [{
                time: {type: String, require: true},
                studentName: {type: String, require: true},
                studentEmail: {type: String, require: true}
            }]
        }]
    }],
    name: {type: String, require: true},
    id: {type: Number, require: true}
})

const Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = Schedule;