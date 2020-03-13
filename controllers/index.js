require('dotenv').config()
const Staff = require('../models/Staff');
const Students = require('../models/Students');
const axios = require('axios');
const bcrypt = require('bcrypt');
const {format} = require('date-fns');

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
                    name: me.data.userAccount.name,
                    id: me.data.userAccount.id
                }]
            });
        });
        
        Students.create(email, {new: true}).then(data => {
        
            Staff.findOneAndUpdate(req.params.id, {$push: {students: email}}, {new: true, upsert: true}).then(data => {
                return res.json(data);
            }).catch(err => {
                console.error(err)
                return res.json(err);
            });
        }).catch(err => console.error(err))
    },

    addNewStaff: async (req, res) => {
        const staff = await Staff.findOne({email: req.body.email});

        let login = await axios({
            url: 'https://bootcampspot.com/api/instructor/v1/login',
            method: 'post',
            data: {email: req.body.email, password: req.body.secret}
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

        
        const hashed = await bcrypt.hash(req.body.secret, 16);
        
        Staff.create({
            id: me.data.userAccount.id,
            name: me.data.userAccount.name,
            email: me.data.userAccount.email,
            pass: hashed,
            students: [],
            schedule: []
        }).then(staff => res.json(staff));

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
        Staff.findOne({id: req.params.id}).then(data => {
            if(data){
                const openDays = {};
                const [schedule] = data.schedule.filter(val => 
                    format(new Date(val.month), 'MMyyy') === format(new Date(req.params.date), 'MMyyyy'));

                return res.json(schedule);
            }

            res.json(null);
        })
    },

    setAvailability: (req, res) => {
        Staff.findOneAndUpdate({id: req.params.id, 'schedule.month': req.params.date}, {'schedule': req.body}, {new: true, upsert: true}).then(data => {
            res.json(data);
        }).catch(err => {
            res.json(err);
        })
    },

    scheduleTime: (req, res) => {
        const id = req.params.id;
        const date = req.params.date;
        const time = req.params.time;
        const formattedDate = date.split('').slice(-6).join('');

        Staff.findOne({id: id}).then(data => {
            const [schedule] = data.schedule.filter(val => val.month === formattedDate)
            schedule.days.filter(val => console.log(val));
        })
    },

    updateAvailability: (req, res) => {

    }
}