import React, { useState, useContext, useEffect } from 'react';
import { Nav, Button, P} from '../styledComponents';
import {InstructorContext, UserContext} from '../../Context';
import {Link, useLocation} from 'react-router-dom';
import {FontAwesomeIcon as FAIcon} from '@fortawesome/react-fontawesome';

const NavBar = () => {
    const [expanded, setExpanded] = useState(false);
    const [instructorExpand, setInstructorExpand] = useState(false);
    const {instructor} = useContext(InstructorContext);
    const {user, setUser} = useContext(UserContext);
    const location = useLocation();

    useEffect(() => {
        setExpanded(false);
        setInstructorExpand(false);
    }, [location.pathname])

    return (
        <Nav
        w={expanded ? '200px' : '45px'}
        expanded={expanded}
        boxShadow={expanded ? 
            'box-shadow: rgba(0, 0, 0, .6) 25px 5px 15px 10px;' :
            'box-shadow: #333 3px 5px 15px;'
        }>
            <FAIcon
            size='3x'
            className='icon'
            icon={expanded ? 'arrow-left' : 'arrow-right'}
            onClick={() => {setInstructorExpand(false); setExpanded(!expanded)}}
             />

            <P
            textAlign='left'
            fontS='30px'
            fontW='bold'
            bgColor='#172a55'
            fontColor='#fff'
            margin='15px 0'
            padding='5px 10px 5px 70px'
            >
                {user ? user.name : 'Please Login'}
            </P>
            <Link
            to='/student'
            >
                <Button
                h='50px'
                textAlign='left'
                fontS='24px'
                disp='flex'
                bgColor='inherit'
                >
                    <FAIcon icon='home' />
                    <P fontColor='#fff' fontS='24px' margin='0 0 0 20px' >Home</P>
                </Button>
            </Link>
            <Button
            disp='flex'
            padding='5px'
            w='100%'
            textAlign='left'
            bgColor='inherit'
            fontS='25px'
            onClick={() => {
                setExpanded(instructor ? true : !expanded && false);
                setInstructorExpand(instructor ? !instructorExpand : false)
            }}
            >
                <FAIcon icon='chalkboard-teacher' />
                <P fontS='24px' margin='0 0 0 20px'>Instructor</P>
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
                        whiteSpace='nowrap'
                        >
                            - {ins.name}
                        </P>
                    </Link>
                ))
            }
            {user &&
                <Button
                onClick={() => setUser(null)}
                margin='0 50px'
                position='absolute'
                bottom='50px'
                w='100px'
                >
                    Logout
                </Button>
            }
        </Nav>
    )
}

export default NavBar;