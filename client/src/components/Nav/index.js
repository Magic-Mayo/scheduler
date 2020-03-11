import React, { useState, useContext } from 'react';
import { Nav, Button, P} from '../styledComponents';
import {InstructorContext, UserContext} from '../../Context';
import {Link} from 'react-router-dom';

const NavBar = () => {
    const [expanded, setExpanded] = useState(true);
    const [instructorExpand, setInstructorExpand] = useState(false);
    const {instructor} = useContext(InstructorContext);
    const {user, setUser} = useContext(UserContext);

    return (
        <Nav
        w={expanded ? '200px' : '35px'}
        expanded={expanded}
        boxShadow={expanded ? 
            'box-shadow: rgba(0, 0, 0, .6) 25px 5px 15px 10px;' :
            'box-shadow: #333 3px 5px 15px;'
        }>
            <span
            onClick={() => {setInstructorExpand(false); setExpanded(!expanded)}}
            >
                {expanded ? '<' : '>'}
            </span>
            <P
            
            fontS='30px'
            fontW='bold'
            bgColor='#172a55'
            fontColor='#fff'
            margin='15px 0'
            padding='5px 0 5px 38px'
            >
                {user ? user.name : 'Please Login'}
            </P>
            <Link
            to='/'
            >
                <P
                padding='0 0 0 50px;'
                h='50px'
                lineHeight='50px'
                textAlign='left'
                fontColor='#fff'
                fontS='24px'
                >
                    Home
                </P>
            </Link>
            <Button
            w='100%'
            padding='0 0 0 50px'
            display='inline-block'
            textAlign='left'
            bgColor='inherit'
            fontS='25px'
            onClick={() => setInstructorExpand(!instructorExpand)}
            >
                Instructor
            </Button>
            {instructorExpand &&
                instructor.map(ins => (
                    <Link
                    to={`/student/calendar/${ins.id}`}
                    key={ins.id}
                    >
                        <P
                        margin='0 0 0 50px'
                        fontS='18px'
                        fontColor='#fff'
                        >
                            - {ins.name}
                        </P>
                    </Link>
                ))
            }
            {user &&
                    <Button
                    onClick={() => setUser(null)}
                    margin='0 0 0 25px'
                    >
                        Logout
                    </Button>
            }
        </Nav>
    )
}

export default NavBar;