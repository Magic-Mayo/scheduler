import React, { useState, useContext } from 'react';
import axios from 'axios';
import {Button, Input, Label, Form, Wrapper} from '../components/styledComponents/';
import Calendar from '../components/Calendar'
import { Redirect, useLocation, useParams } from 'react-router-dom';
import {UserContext} from '../UserContext';

const Student = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState();
    const {user, setUser} = useContext(UserContext);
    let location = useLocation();
    let {date} = useParams();

    const findStudent = (e) => {
        e.preventDefault();
        if(!email) return setError('Please enter a valid email address!');

        axios.get(`/student/${email}`).then(res => {
            if(!res.data) return setError('This email does not exist in Bootcamp Spot!  Please check the email address and try again.  If this error persists please contact your instructor or TA for further assistance.');
            console.log(res.data)
            setUser({name: res.data.name, email: res.data.email});
        })
    }

    return (
        <Wrapper Width='100%' margin='0 0 0 50px'>
            {!user ?
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
                    <Button>Login</Button>
                </Form>
            :
                <Redirect to='/student/calendar' />
            }
            {error && 
                <span className='error'>{error}</span>
            }
        </Wrapper>
    )
}

export default Student;