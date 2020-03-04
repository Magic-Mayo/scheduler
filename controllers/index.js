const Students = require('../models/Students');
const Schedule = require('../models/Schedule');

module.exports = {
    create: async (req, res) => {
        console.log('hi')
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
        })

        Students.create(email).then(data => {
            return res.json(data)
        }).catch(err => {
            console.error(err)
            return res.json(err);
        });
    },

    findOne: (req, res) => {
        console.log(req.body)
        Students.findOne({email: req.params.email}).then(data => {
            console.log("controller: ", data)
            if(data) return res.json(data);
            return res.json(false);
        }).catch(err => {
            console.error(err);
            return res.json(false);
        })
    },

    schedule: (req, res) => {
        
    }
}