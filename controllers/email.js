require('dotenv').config();
const mail = require('nodemailer');
const {format, fromUnixTime} = require('date-fns');


module.exports = {
    sendConfirmation: async (studentName, studentEmail, staffName, staffEmail, time, topic) => {
        const transport = mail.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASS
            }
        })

        const message = {
            from: 'Virtual Office Hours',
            replyTo: staffEmail,
            to: studentEmail,
            cc: staffEmail,
            subject: `Office Hours Scheduled!`,
            text: `${studentName}, you have been scheduled for virtual office hours with ${staffName} on ${format(fromUnixTime(time), 'MMMM d, yyyy hh:mm a')}.  You will be discussing "${topic}".  If you feel this has been scheduled in error please respond to this email and I will delete the time for you!`,
        };

        transport.sendMail(message, (err, res)=>{
            if(err){
                console.error(err)
            }

        })
    }
}