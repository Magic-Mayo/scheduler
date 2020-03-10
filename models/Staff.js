const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaffSchema = new Schema({
    id: {type: String, require: true},
    name: {type: String, require: true},
    email: {type: String, require: true},
    pass: {type: String, required: true},
    students: [{
        name: {type: String, require: true},
        email: {type: String, require: true},
        id: {type: String, require: true}
    }],
    schedule: [{
        month: {type: String, require: true},
        days: [{
            date: {type: Date, require: true},
            times: [{
                time: {type: String, require: true},
                studentName: String,
                studentEmail: String
            }]
        }]
    }]
})

const Staff = mongoose.model('Staff', StaffSchema);

module.exports = Staff;