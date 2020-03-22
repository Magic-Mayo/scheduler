const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaffSchema = new Schema({
    id: {type: String, require: true},
    name: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    pass: {type: String, required: true},
    bcsEmail: {type: String, required: true, unique: true},
    schedule: [{
        month: {type: Date, require: true},
        days: [{
            date: {type: Date, require: true},
            times: [{
                time: {type: Date, require: true},
                studentName: String,
                studentEmail: String,
                topic: String
            }]
        }]
    }]
})

const Staff = mongoose.model('Staff', StaffSchema);

module.exports = Staff;