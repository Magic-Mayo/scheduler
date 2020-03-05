import React, { useState } from 'react';
import axios from 'axios';
import {Button, Input, Label, Form, Wrapper} from '../components/styledComponents/';

const Student = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState();

    const findStudent = (e) => {
        e.preventDefault();
        if(!email) return setError('Please enter a valid email address!');

        axios.get(`/student/${email}`).then(res => {
            if(!res.data) return setError('This email does not exist in Bootcamp Spot!  Please check the email address and try again.  If this error persists please contact your instructor or TA for further assistance.');
            console.log(res.data)
        })
    }

    return (
        <Wrapper Width='80vw'>
            <Form onSubmit={findStudent}>
                <Label>BCS email address: </Label>
                <Input
                type='text'
                name='email'
                className='input student-input-email'
                value={email}
                placeholder='Enter your Bootcamp Spot email'
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setError()}
                />
                <Button>Submit</Button>
            </Form>
            {console.log(error)}
            {error && 
                <span className='error'>{error}</span>
            }
        </Wrapper>
    )
}

export default Student;