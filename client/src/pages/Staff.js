import React, { useContext, useState } from 'react';
import Calendar from '../components/Calendar';
import { Form, Input, Wrapper, Label, P, Button } from '../components/styledComponents';
import { CurrentInstructorContext, UserContext, InstructorContext } from '../Context';
import axios from 'axios';
import { HashLoader } from 'react-spinners';
import { Redirect } from 'react-router-dom';

export const Admin = () => {
    const {setUser, setUserType} = useContext(UserContext);
    const {loading, setLoading} = useContext(InstructorContext);
    const {setAvailability} = useContext(CurrentInstructorContext);
    const [input, setInput] = useState({email: '', password: '', confirmPassword: '', useEmail: false});
    const [error, setError] = useState();
    const [signupForm, setSignupForm] = useState(false);
    const [redirect, setRedirect] = useState();

    const handleInput = e => {
        e.persist();
        setInput(prevState => 
            ({...prevState, [e.target.name]: e.target.type !== 'checkbox' ? e.target.value : !prevState.useEmail}))
    }

    const findInstructor = async e => {
        setLoading(true);
        e.preventDefault();
        const staff = await axios.post(`/api/staff/find/`, input);
        
        if(!staff.data){
            setLoading(false);
            return setError('The email and password you entered do not match');
        }
        
        setUserType('staff');
        setUser(staff.data);
        setAvailability(staff.data.schedule);
        setLoading(false);
        return setRedirect(true)
    }
    
    const createAccount = async e => {
        e.preventDefault();
        setLoading(true);
        const newStaff = {
            email: input.email,
            password: input.password,
            bcsEmail: input.useEmail ? input.email : input.bcsEmail
        }
        const staff = await axios.post('/api/staff/add', newStaff);
        
        if(!staff.data){
            setLoading(false);
            return setError('Please check that your email and password are correct.  If so, you may either already be in the system or this email does not exist in BCS.');
        }
        
        setUserType('staff');
        setUser(staff.data);
        setLoading(false);
        return setRedirect(true);
    }

    return (
        <>
            {redirect && <Redirect to='/staff/calendar' />}
            <Wrapper
            justifyContent='center'
            alignItems='center'
            w='100%'
            margin='0 0 0 50px'
            >
                <P
                position='fixed'
                top='25px'
                fontS='50px'
                fontW='bold'
                textAlign='center'
                >
                    Instructional Staff Login
                </P>

                <Form alignItems='flex-start' onSubmit={signupForm ? createAccount : findInstructor}>
                    <Label
                    htmlFor='email'
                    >
                        Email Address:
                    </Label>
                    <Input
                    margin='10px 10px 0'
                    value={input.email}
                    onChange={handleInput}
                    name='email'
                    type='email'
                    placeholder='Enter email'
                    />
                    
                    {signupForm && 
                        <>
                            <Label
                            w='230px'
                            position='relative'
                            htmlFor='useEmail'
                            margin='10px 10px 25px'
                            >
                                Same as BCS email:
                                <Input
                                position='absolute'
                                margin='-3px 10px 10px'
                                value={input.useEmail}
                                onChange={handleInput}
                                name='useEmail'
                                type='checkbox'
                                />
                            </Label>
                        

                            {!input.useEmail &&
                                <>
                                <Label
                                htmlFor='email'
                                >
                                Bootcamp Spot Email Address:
                                </Label>
                                <Input
                                margin='10px 10px 0'
                                value={input.bcsEmail}
                                onChange={handleInput}
                                name='bcsEmail'
                                type='email'
                                placeholder='Enter BCS email'
                                />
                                </>
                            }
                        </>
                    }
                    
                    <Label>Password:</Label>
                    <Input
                    value={input.password}
                    onChange={handleInput}
                    name='password'
                    type='password'
                    placeholder='Enter password'
                    />
                    {signupForm &&
                        <>
                            <Label>Confirm Password:</Label>
                            <Input
                            value={input.confirmPassword}
                            onChange={handleInput}
                            name='confirmPassword'
                            type='password'
                            placeholder='Confirm password'
                            />
                        </>
                    }

                    {!loading ?
                        <Wrapper
                        w='100%'
                        alignItems='center'
                        >
                            <Button margin='20px 0 0 0'>{signupForm ? 'Sign up' : 'Login'}</Button>
                        </Wrapper>
                    :
                        <Wrapper
                        w='100%'
                        alignItems='center'
                        justifyContent='center'
                        >
                            <HashLoader
                            loading
                            color='#172a55'
                            />
                        </Wrapper>
                    }
                </Form>
                    
                {error && 
                    <P
                    w='300px'
                    fontColor='red'
                    >{error}</P>
                }
            </Wrapper>
        </>
    )
}

export default Admin;