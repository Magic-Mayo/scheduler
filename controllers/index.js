require('dotenv').config()
const Staff = require('../models/Staff');
const Students = require('../models/Students');
const axios = require('axios');
const bcrypt = require('bcrypt');
const {format} = require('date-fns');
const {sendConfirmation} = require('./email');

module.exports = {
    addNewStudents: async (req, res) => {
        let authToken = req.body.authToken || null;

        if(!req.body.authToken){
            let login = await axios({
                url: 'https://bootcampspot.com/api/instructor/v1/login',
                method: 'post',
                data: {email: req.body.email, password: req.body.secret}
            });

            authToken = login.data.authenticationInfo.authToken;
        }
        
        let me = await axios({
            url: 'https://bootcampspot.com/api/instructor/v1/me',
            method: 'get',
            headers: {'Content-type': "application/json", authToken: authToken}
        })
        let sessions = await axios({
            url: 'https://bootcampspot.com/api/instructor/v1/sessions',
            method: 'post',
            headers: {'Content-type': "application/json", authToken: authToken},
            data: {enrollmentId: me.data.enrollments[0].id}
        })
        let students = await axios({
            url: 'https://bootcampspot.com/api/instructor/v1/sessionDetail',
            method: 'post',
            headers: {'Content-type': "application/json", authToken: authToken},
            data: {sessionId: sessions.data.currentWeekSessions[0].session.id}
        })
        
        const email = [];
        
        students.data.students.map(val => {
            const student = val.student;
            email.push({
                id: student.id,
                name: `${student.firstName} ${student.lastName}`,
                email: student.email,
                staff: [{
                    name: `${me.data.userAccount.firstName} ${me.data.userAccount.lastName}`,
                    id: me.data.userAccount.id
                }],
                scheduledTimes: []
            });
        });

        email.map(async student => {
            const newStudent = await Students.findOne({id: student.id});

            if(newStudent){
                const toUpdate = newStudent.staff.filter(staff => staff.id === me.data.userAccount.id).length;

                if(toUpdate === 0) return Students.findByIdAndUpdate(student._id, {$push: {staff: student.staff[0]}});
            }

            Students.create(email);
        })

        const allStudents = await Students.find({'staff.id': me.data.userAccount.id})
        return res.json(allStudents)
    },

    addNewStaff: async (req, res) => {
        const staff = await Staff.findOne({email: req.body.email});

        let login = await axios({
            url: 'https://bootcampspot.com/api/instructor/v1/login',
            method: 'post',
            data: {email: req.body.email, password: req.body.bcsPassword}
        });

        if(!login.data.success || staff){
            return res.json(false);
        }

        const authToken = login.data.authenticationInfo.authToken;

        let me = await axios({
            url: 'https://bootcampspot.com/api/instructor/v1/me',
            method: 'get',
            headers: {'Content-type': "application/json", authToken: authToken}
        });

        
        const hashed = await bcrypt.hash(req.body.password, 16);
        
        Staff.create({
            id: me.data.userAccount.id,
            name: `${me.data.userAccount.firstName} ${me.data.userAccount.lastName}`,
            email: me.data.userAccount.email,
            pass: hashed,
            bcsEmail: req.body.bcsEmail,
            students: [],
            schedule: []
        }).then(async staff => {
            const students = await axios.post(`${req.protocol}://${req.get('host')}/staff/${staff.id}/getstudents`, {authToken: authToken});
            res.json(students.data)
        })
        .catch(err=>console.error(err));

    },

    findOne: async (req, res) => {
        if(req.body.password){
            const staff = await Staff.findOne({email: req.body.email});
            let match;
            
            if(staff){
                match = await bcrypt.compare(req.body.password, staff.pass);
            }
            
            if(match){
                staff.pass = undefined;
                return res.json(staff);
            }
            return res.json(false);
        }

        Students.findOne({email: req.params.email}).then(student => {
            res.json(student);
        }).catch(err => {
            console.error(err);
            return res.json(false);
        })
    },

    getAvailability: (req,res) => {
        Staff.findOne({id: req.params.id}).then(data => {
            res.json(data.schedule);
        })
    },

    setAvailability: (req, res) => {
        const {id} = req.params;

        Staff.findOneAndUpdate({id: id}, {$push: {schedule: req.body}}, {new: true}).then(data => {
            res.json(data);
        }).catch(err => {
            res.json(err);
        })
    },

    scheduleTime: async (req, res) => {
        const {topic, studentName, studentEmail, month, daysIdx, timesIdx, timeId, time} = req.body;
        const {studentId, instructorId} = req.params;
        const set = {$set: {}};

        set.$set[`schedule.$.days.${daysIdx}.times.${timesIdx}`] = {
            topic: topic,
            studentEmail: studentEmail,
            studentName: studentName,
            time: time
        };
        
        const staff = await Staff.findOneAndUpdate(
            {id: instructorId, 'schedule._id': month},
            set,
            {new: true})

        const student = await Students.findOneAndUpdate(
            {id: studentId},
            {$push: {
                scheduledTimes: {
                    instructorId: instructorId,
                    timeId: timeId,
                    time: time,
                    topic: topic
                }
            }},
            {new:true})

        sendConfirmation(studentName, studentEmail, staff.name, staff.email, time, topic);
        return res.json({student: await student.scheduledTimes, staff: await staff.schedule})
    },

    updateAvailability: (req, res) => {
        Staff.findOneAndUpdate({id: req.params.id}, {schedule: [req.body]}, {new:true}).then(data => {
            res.json(data)
        })
    }
}