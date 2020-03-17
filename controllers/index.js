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
                    name: `${me.data.userAccount.firstName} ${me.data.userAccount.lastName}`,
                    id: me.data.userAccount.id
                }]
            });
        });
        
        Students.create(email, {new: true}).then(data => {
            res.json(data)
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
        }).then(staff =>
            axios.post(`${req.protocol}://${req.get('host')}/staff/${staff.id}/getstudents`, {authToken: authToken})
            .catch(err=>console.error(err)));

    },

    findOne: (req, res) => {
        Students.findOne({email: req.params.email}).then(data => {
            res.json({name: data.name, email: data.email, staff: data.staff});
        }).catch(err => {
            console.error(err);
            return res.json(false);
        })
    },

    getAvailability: (req,res) => {
        Staff.findOne({id: req.params.id}).then(data => {
            if(data){
                const [schedule] = data.schedule.filter(val => {
                    return format(new Date(val.month), 'MMyyyy') === format(new Date(req.params.date), 'MMyyyy')})

                return res.json(schedule);
            }

            res.json(null);
        })
    },

    setAvailability: (req, res) => {
        const {id, date} = req.params;

        Staff.findOneAndUpdate({id: id, 'schedule._id': date}, {'schedule': req.body}, {new: true}).then(data => {
            res.json(data);
        }).catch(err => {
            res.json(err);
        })
    },

    scheduleTime: (req, res) => {
        const {topic, studentName, studentEmail, month, daysIdx, timesIdx, timeId, time} = req.body;
        const {studentId, instructorId} = req.params;
        const set = {$set: {}};
        set.$set[`schedule.$.days.${daysIdx}.times.${timesIdx}`] = {
            topic: topic,
            studentEmail: studentEmail,
            studentName: studentName,
            time: time
        };
        
        Staff.findOneAndUpdate(
            {id: instructorId, 'schedule._id': month},
            set,
            {new: true}
            ).then(data => {
                Students.findOneAndUpdate(
                    {id: studentId},
                    {scheduledTimes: {
                        $push: {
                            instructorId: instructorId,
                            timeId: timeId,
                            time: time
                        }
                    }},
                    {new:true}
                ).then(student => res.json({student, data}))
            }
        )
    },

    updateAvailability: (req, res) => {
        Staff.findOneAndUpdate({id: req.params.id}, {schedule: [req.body]}, {new:true}).then(data => {
            res.json(data)
        })
    }
}