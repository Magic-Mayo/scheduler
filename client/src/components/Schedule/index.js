import React, { useContext, useEffect } from 'react';
import { Wrapper, P, Button } from '../styledComponents';
import {UserContext, InstructorContext} from '../../Context';
import {format} from 'date-fns';
import axios from 'axios';

const Schedule = () => {
    const {user, setUser} = useContext(UserContext);
    const {refresh} = useContext(InstructorContext);

    useEffect(() => {
        axios.get(`/student/find/${user.email}`).then(student => {
            setUser(student.data);
        })
    }, [refresh])

    return (
        <Wrapper
        w='90%'
        margin='0 0 0 50px'
        justifyContent='space-evenly'
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
                    {user.staff.map(staff => (
                        <Wrapper
                        key={staff.id}
                        flexDirection='row'
                        w='100%'
                        padding='0 20px'
                        justifyContent='flex-start'
                        border='#ccc solid 2px'
                        h='100px'
                        position='relative'
                        borderRadius='5px'
                        margin='0 0 0 50px'
                        >
                            <P
                            border='border-right: #ccc solid 1px'
                            position='absolute'
                            h='100%'
                            w='125px'
                            padding='20px 0'
                            >
                                {`Schedule with ${staff.name}`}
                            </P>
                            {user.scheduledTimes.filter(ins => ins.instructorId === staff.id).map((times, ind) => (
                                <Button
                                key={times.timeId}
                                h='100%'
                                first={ind === 0}
                                >
                                    {format(new Date(times.time), 'MMM dd')}{'\n'}{format(new Date(times.time), 'hh:mm a')}
                                </Button>
                            ))}
                        </Wrapper>
                    ))}
                </>
            :
                <P>No times currently scheduled</P>
            }
        </Wrapper>
    )
}

export default Schedule;