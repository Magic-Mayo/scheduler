const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentsSchema = new Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    staff: [{
        id: {type: String, require: true},
        name: {type: String, require: true},
    }]
})

const Students = mongoose.model('Student', StudentsSchema);

module.exports = Students;