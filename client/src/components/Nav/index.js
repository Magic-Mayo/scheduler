import React, { useState, useContext, useEffect } from 'react';
import { Nav, Button, P, Wrapper} from '../styledComponents';
import {InstructorContext, UserContext, CurrentInstructorContext} from '../../Context';
import {Link, useLocation} from 'react-router-dom';
import {FontAwesomeIcon as FAIcon} from '@fortawesome/react-fontawesome';

const NavBar = () => {
    const [expanded, setExpanded] = useState(false);
    const [instructorExpand, setInstructorExpand] = useState(false);
    const {instructors, loading, refresh, setLoading, setRefresh} = useContext(InstructorContext);
    const {setCurrentInstructor} = useContext(CurrentInstructorContext);
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
            padding='5px 10px 5px 53px'
            >
                {user ? user.name : 'Please Login'}
            </P>
            <Link
            to={loading ? location.pathname : '/student'}
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
            fontS='24px'
            onClick={() => {
                setExpanded(instructors ? true : !expanded && false);
                setInstructorExpand(instructors ? !instructorExpand : false)
            }}
            >
                <FAIcon icon='chalkboard-teacher' />
                <P fontS='24px' margin='0 0 0 20px'>Instructor</P>
            </Button>
            {instructorExpand &&
                instructors.map(ins => (
                    <Link
                    to={loading ? location.pathname : `/student/calendar/${ins.id}`}
                    key={ins.id}
                    onClick={() => setCurrentInstructor(ins)}
                    >
                        <P
                        margin='5px 0 10px 50px'
                        fontS='18px'
                        fontColor='#fff'
                        whiteSpace='nowrap'
                        >
                            - {ins.name}
                        </P>
                    </Link>
                ))
            }
            {user ?
                <Link
                to={loading ? location.pathname : '/student/myschedule'}
                >
                    <Button
                    bgColor='inherit'
                    padding='5px 0 5px 12px'
                    disp='flex'
                    w='100%'
                    fontS='24px'
                    >
                        <FAIcon icon='calendar-alt' color='#fff' />
                        <P
                        margin='0 0 0 23px'
                        fontS='24px'
                        whiteSpace='nowrap'
                        >
                            My Schedule
                        </P>
                    </Button>
                </Link>
            :
                <Wrapper
                w='100%'
                >
                    <Button
                    bgColor='inherit'
                    padding='5px 0 5px 12px'
                    disp='flex'
                    w='100%'
                    fontS='24px'
                    >
                        <FAIcon icon='calendar-alt' color='#fff' />
                        <P
                        margin='0 0 0 23px'
                        fontS='24px'
                        whiteSpace='nowrap'
                        >
                            My Schedule
                        </P>
                    </Button>
                </Wrapper>
            }
            {location.pathname.split('student/')[1] &&
                <Wrapper
                position='absolute'
                bottom='145px'
                w='100%'
                disp='flex'
                flexDirection='row'
                alignItems='flex-end'
                fontColor='#fff'
                onClick={() => setRefresh(!refresh)}
                >
                    <Button
                    w='100%'
                    padding='5px 0 5px 9px'
                    fontS='24px'
                    bgColor='inherit'
                    disp='flex'
                    flexDirection='row'
                    alignItems='center'
                    >
                        <FAIcon
                        className='refresh'
                        icon='sync'
                        />
                        <P
                        margin='0 0 0 26px'
                        fontS='24px'
                        
                        >
                            Refresh Calendar
                        </P>
                    </Button>
                </Wrapper>
            }
            {user &&
                <Button
                onClick={loading ? null : () => setUser(null)}
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