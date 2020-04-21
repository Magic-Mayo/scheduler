const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentsSchema = new Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    id: {type: String, require: true},
    staff: [{
        id: {type: String, require: true},
        name: {type: String, require: true}
    }],
    scheduledTimes: [{
        time: {type: Number, required: true},
        instructorId: {type: String, require: true},
        timeId: {type: String, require: true},
        topic: String,
        satisfied: Boolean
    }]
})

const Students = mongoose.model('Students', StudentsSchema);

module.exports = Students;