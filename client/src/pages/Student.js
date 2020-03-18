import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import {Button, Input, Label, Form, Wrapper, P} from '../components/styledComponents/';
import { Link } from 'react-router-dom';
import {UserContext, InstructorContext, CurrentInstructorContext} from '../Context';

const Student = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState();
    const {user, setUser} = useContext(UserContext);
    const {instructor, setInstructor} = useContext(InstructorContext);
    const {setCurrentInstructor} = useContext(CurrentInstructorContext);
    const inputRef = useRef(null);

    const findStudent = (e) => {
        e.preventDefault();
        if(!email) return setError('Please enter a valid email address!');

        axios.get(`/student/find/${email}`).then(res => {
            if(!res.data) return setError('This email does not exist in Bootcamp Spot!  Please check the email address and try again.  If this error persists please contact your instructor or TA for further assistance.');
            setInstructor(res.data.staff);
            setUser({name: res.data.name, email: res.data.email});
        })
    }
    
    useEffect(() => {
        if(!user){
            inputRef.current.focus();
        }
    }, [user])

    return (
        <Wrapper w='100%' margin='0 0 0 50px'>
            {!user ?
                <Form onSubmit={findStudent}>
                    <Label>BCS email address: </Label>
                    <Input
                    ref={inputRef}
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
                <Wrapper>
                    <P>
                        Please choose an instructor to view their calendar:
                    </P>
                    {instructor.map(ins => (
                        <Link
                        key={ins.id}
                        to={`/student/calendar/${ins.id}`}
                        onClick={() => setCurrentInstructor(ins)}
                        >
                            <Button
                            margin='10px 0'
                            bgColor='#172a55'
                            borderRadius='7px'
                            textAlign='center'
                            w='auto'
                            maxWidth='150px'
                            h='auto'
                            >
                                {ins.name}
                            </Button>
                        </Link>
                    ))}
                </Wrapper>
            }
            {error &&
                <span className='error'>{error}</span>
            }
        </Wrapper>
    )
}

export default Student;