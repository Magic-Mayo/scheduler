const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaffSchema = new Schema({
    id: {type: String, require: true},
    name: {type: String, require: true},
    email: {type: String, require: true},
    students: [{
        name: {type: String, require: true},
        email: {type: String, require: true}
    }]
})

const Staff = mongoose.model('Students', StaffSchema);

module.exports = Staff;