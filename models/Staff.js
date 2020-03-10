const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaffSchema = new Schema({
    id: {type: String, require: true},
    name: {type: String, require: true},
    email: {type: String, require: true},
    students: [{
        name: {type: String, require: true},
        email: {type: String, require: true}
    }],
    schedule: [{
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
    }]
})

const Staff = mongoose.model('Students', StaffSchema);

module.exports = Staff;