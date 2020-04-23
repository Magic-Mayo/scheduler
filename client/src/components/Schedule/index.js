import React, { useContext, useEffect, useState } from 'react';
import { Wrapper, P, Button } from '../styledComponents';
import {UserContext, InstructorContext} from '../../Context';
import {format, fromUnixTime} from 'date-fns';
import axios from 'axios';
import Modal from '../Modal';
import { useLocation } from 'react-router-dom';

const Schedule = () => {
    const {user, userType, setUser} = useContext(UserContext);
    const {instructors, refresh} = useContext(InstructorContext);
    const [showTime, setShowTime] = useState();
    const location = useLocation();

    const getTimeToShow = time => {
        const [selectedInstructor] = instructors.filter(ins => ins.id === time.instructorId);
        setShowTime({time: time, instructor: selectedInstructor});
    }

    useEffect(() => {
        if(!userType){
            axios.get(`/api/student/find/${user.email}`).then(student => {
                setUser(student.data);
            })
        }
    }, [refresh])

    useEffect(() => {
        return () => {
            setShowTime();
        }
    },[location.pathname])

    return (
        <>
            {showTime &&
                <Modal>
                    <P
                    w='100%'
                    textAlign='center'
                    >
                        {/* Change topic to input so it can be update in db */}
                        {`You will be discussing "${showTime.time.topic}" with ${showTime.instructor.name}.`}
                    </P>
                </Modal>
            }

            <Wrapper
            w='100%'
            margin='0 0 0 50px'
            justifyContent='center'
            alignItems='center'
            onClick={showTime ? () => setShowTime() : null}
            bgColor={showTime ? '#ccc' : ''}
            margin='0 0 0 50px'
            >
                <P
                position='fixed'
                top='50px'
                fontS='50px'
                fontW='bold'
                >
                    {user.name}'s Schedule
                </P>
                {user.scheduledTimes?.length > 0 ?
                    <>
                        {user.staff.map((staff, ind) => (
                            <Wrapper
                            maxWidth='980px'
                            key={staff.id}
                            flexDirection='row'
                            w='90%'
                            padding='0 20px'
                            justifyContent='flex-start'
                            position='relative'
                            borderBottom='#ccc 2px solid'
                            margin='25px 0'
                            >
                                <P
                                position='absolute'
                                h='100%'
                                w='150px'
                                padding='20px 0'
                                >
                                    {`Schedule with ${staff.name}`}
                                </P>
                                <Wrapper
                                flexDirection='row'
                                justifyContent='flex-start'
                                w='100%'
                                margin='0 0 0 170px'
                                overflowX='hidden'
                                position='relative'
                                >
                                    {user.scheduledTimes
                                    .filter(ins => ins.instructorId === staff.id)
                                    .sort((a,b) => a.time - b.time)
                                    .map(times => (
                                        <Button
                                        onClick={() => getTimeToShow(times)}
                                        key={times.timeId}
                                        h='75px'
                                        disp='flex'
                                        flexDirection='column'
                                        justifyContent='space-evenly'
                                        alignItems='center'
                                        margin='10px 15px'
                                        bgColor={ind % 2 === 0 ? '' : '#ba0c2f'}
                                        >
                                            <span>{format(fromUnixTime(times.time), 'MMMM dd')}</span>
                                            <span>{format(fromUnixTime(times.time), 'hh:mm a')}</span>
                                        </Button>
                                    ))}
                                    {/* <Button
                                    position='absolute'
                                    left='0px'
                                    fontS='40px'
                                    fontColor='#000'
                                    bgColor='inherit'
                                    >
                                        <FAIcon icon='angle-double-left' />
                                    </Button>
                                    <Button
                                    position='absolute'
                                    right='0'
                                    fontS='40px'
                                    fontColor='#000'
                                    bgColor='inherit'
                                    >
                                        <FAIcon icon='angle-double-right' />
                                    </Button> */}
                                </Wrapper>
                            </Wrapper>
                        ))}
                    </>
                :
                    <P>No times currently scheduled</P>
                }
            </Wrapper>
        </>
    )
}

export default Schedule;