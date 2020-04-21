import React from 'react';
import {Wrapper, Button, P} from '../components/styledComponents';
import { Link } from 'react-router-dom';

export const Home = () => {

    return (
        <Wrapper
        w='100vw'
        h='100vh'
        >
            <Wrapper
            w='75vw'
            h='20vh'
            position='absolute'
            top='4vh'
            textAlign='center'
            borderRadius='10px'
            bgColor='#ba0c2f'
            >
                <P
                fontW='bold'
                fontS='40px'
                >
                    Welcome to Virtual Office Hours!
                </P>
            </Wrapper>
            <P>Please select your user type:</P>
            <Link
            to='/student'
            >
                <Button
                margin='20px 0'
                >
                    Student
                </Button>
            </Link>
            <Link
            to='/staff'
            >
                <Button
                margin='20px 0'
                >
                    Staff
                </Button>
            </Link>
        </Wrapper>
    )
}

export default Home;