import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

export const Student = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState();

    const findStudent = (e) => {
        e.preventDefault();
        console.log(email)
        axios.get(`/student/${email}`).then(data => {
            if(!data) return setError('This email does not exist in Bootcamp Spot!  Please check the email address and try again.  If this error persists please contact your instructor or TA for further assistance.');
            console.log(data)
        })
    }

    return (
        <div className='student-email'>
            <form onSubmit={findStudent}>
                <input
                type='text'
                className='input student-input-email'
                value={email}
                placeholder='Enter your Bootcamp Spot email'
                onChange={(e)=>setEmail(e.target.value)}></input>
            </form>
        </div>
    )
}

export default Student;