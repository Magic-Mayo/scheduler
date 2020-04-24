require('dotenv').config()
const Staff = require('../models/Staff');
const Students = require('../models/Students');
const axios = require('axios');
const bcrypt = require('bcrypt');
const {format} = require('date-fns');
const {sendConfirmation} = require('./email');

module.exports = {
    addNewStudents: async ({body, params}, res) => {
        let authToken = body.authToken || null;

        if(!body.authToken){
            let login = await axios({
                url: 'https://bootcampspot.com/api/instructor/v1/login',
                method: 'post',
                data: {email: body.email, password: body.secret}
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

    addNewStaff: async ({body, get, protocol}, res) => {
        const staff = await Staff.findOne({email: body.email});

        let login = await axios({
            url: 'https://bootcampspot.com/api/instructor/v1/login',
            method: 'post',
            data: {email: body.email, password: body.bcsPassword}
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

        
        const hashed = await bcrypt.hash(body.password, 16);
        
        Staff.create({
            id: me.data.userAccount.id,
            name: `${me.data.userAccount.firstName} ${me.data.userAccount.lastName}`,
            email: me.data.userAccount.email,
            pass: hashed,
            bcsEmail: body.bcsEmail,
            students: [],
            schedule: []
        }).then(async staff => {
            const students = await axios.post(`${protocol}://${get('host')}/staff/${staff.id}/getstudents`, {authToken: authToken});
            res.json(students.data)
        })
        .catch(err=>console.error(err));

    },

    findOne: async ({body, params}, res) => {
        if(body.password){
            const staff = await Staff.findOne({email: body.email});
            let match;
            
            if(staff){
                match = await bcrypt.compare(body.password, staff.pass);
            }
            
            if(match){
                staff.pass = undefined;
                return res.json(staff);
            }
            return res.json(false);
        }

        Students.findOne({email: params.email}).then(student => {
            res.json(student);
        }).catch(err => {
            console.error(err);
            return res.json(false);
        })
    },

    getAvailability: ({params},res) => {
        Staff.findOne({id: params.id}).then(data => {
            res.json(data.schedule);
        })
    },

    setAvailability: ({body, params}, res) => {
        const {id} = params;
        let error;
        const data = [];

        for(let month in body){
            Staff.findOne({id: id})
            .then(staff => {
                if(staff.schedule.filter(sched => sched.month == month).length){
                    Staff.findOneAndUpdate({id: id, 'schedule.month': body.month}, {$set: {'schedule.$.days': body[month].days}}, {new: true})
                    .then(staff => data.push(staff.schedule))
                    .catch(err => error = err)
                } else {
                    Staff.findOneAndUpdate({id: id}, {$push: {schedule: {month: month, days: body[month].days}}}, {new: true, upsert: true})
                    .then(staff => data.push(staff.schedule))
                    // .then(staff => console.log('else', staff))
                    .catch(err => error = err)
                }
            })
            .catch(err => error = err);
            if(error) return res.json(error);
        }
        console.log(data)

        res.json(data)
    },

    scheduleTime: async ({body, params}, res) => {
        const {topic, studentName, studentEmail, month, daysIdx, timesIdx, timeId, time} = body;
        const {studentId, instructorId} = params;
        const set = {$set: {}};
        let timeNotAvail;

        await Staff.findOne({id: instructorId}).then(staff => {
            let findMonth;

            for(let i=0; i < staff.schedule.length; i++){
                const schedule = staff.schedule;
                if(schedule[i].month == month){
                    findMonth = i;
                    break;
                }
            }

            if(staff.schedule[findMonth].days[daysIdx].times[timesIdx].studentEmail){
                return timeNotAvail = true;
            }
            
        })
        
        if(timeNotAvail) return res.json(false);

        set.$set[`schedule.$.days.${daysIdx}.times.${timesIdx}`] = {
            topic: topic,
            studentEmail: studentEmail,
            studentName: studentName,
            time: time
        };
        
        const staff = await Staff.findOneAndUpdate(
            {id: instructorId, 'schedule.month': month},
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

    updateAvailability: ({body, params}, res) => {
        Staff.findOneAndUpdate({id: params.id}, {schedule: [body]}, {new:true}).then(data => {
            res.json(data)
        })
    }
}