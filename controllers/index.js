require('dotenv').config()
const Staff = require('../models/Staff');
const Students = require('../models/Students');
const axios = require('axios');

module.exports = {
    addNewStudents: async (req, res) => {
        let login = await axios({
            url: 'https://bootcampspot.com/api/instructor/v1/login',
            method: 'post',
            data: {email: process.env.EMAIL, password: process.env.SECRETSAUCE}
        });
        let me = await axios({
            url: 'https://bootcampspot.com/api/instructor/v1/me',
            method: 'get',
            headers: {'Content-type': "application/json", authToken: login.data.authenticationInfo.authToken}
        })
        let sessions = await axios({
            url: 'https://bootcampspot.com/api/instructor/v1/sessions',
            method: 'post',
            headers: {'Content-type': "application/json", authToken: login.data.authenticationInfo.authToken},
            data: {enrollmentId: me.data.enrollments[0].id}
        })
        let students = await axios({
            url: 'https://bootcampspot.com/api/instructor/v1/sessionDetail',
            method: 'post',
            headers: {'Content-type': "application/json", authToken: login.data.authenticationInfo.authToken},
            data: {sessionId: sessions.data.currentWeekSessions[0].session.id}
        })

        const email = [];

        students.data.students.map((val,ind)=>{
            const student = val.student;
            email.push({name: `${student.firstName} ${student.lastName}`, email: student.email});
        });

        Students.create(email, {new: true}).then(data => {
            
            Staff.findOneAndUpdate(req.params.id, {$push: {students: email}}, {new: true, upsert: true}).then(data => {
                return res.json(data);
            }).catch(err => {
                console.error(err)
                return res.json(err);
            });
        })
        
    },

    findOne: (req, res) => {
        Students.findOne({email: req.params.email}).then(data => {
            res.json({name: data.name, email: data.email});
        }).catch(err => {
            console.error(err);
            return res.json(false);
        })
    },

    getAvailability: (req,res) => {
        Staff.findOne({id: req.params.id, 'schedule.months.month': req.params.date}).then(data => {
            res.json(data);
        })
    },

    setAvailability: (req, res) => {
        Staff.findOneAndUpdate({id: req.params.id, 'schedule.months.month': req.params.date}, {schedule: req.body}, {new: true, upsert: true}).then(data => {
            res.json(data);
        }).catch(err => {
            res.json(err);
        })
    },

    updateAvailability: (req, res) => {

    }
}