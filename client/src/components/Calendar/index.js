import React, { useEffect, useState, useContext, useRef } from 'react';
import { Wrapper } from '../styledComponents';
import {InstructorContext, UserContext} from '../../Context';
import StudentCalendar from './StudentCalendar';
import StaffCalendar from './StaffCalendar';

const days = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
]

const Calendar = () => {
    const {loading, setLoading} = useContext(InstructorContext);
    const {user, userType} = useContext(UserContext);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState();

    const getDays = () => {
        return (
            days.map(day => (
                <Wrapper key={day}>
                    {day}
                </Wrapper>
            ))
        )
    }

    // useEffect(() => {
    //     if(selectedTime){
    //         scheduleTime(timeToSchedule);
    //     } 
    //     else {
    //         return () => {
    //             setTopic();
    //             setSelectedTime();
    //         }
    //     }
    // },[topic]);

    // useEffect(() => {
    //     setSelectedMonth(new Date());
    //     fetch(`/availability/${dateFormat(selectedMonth, 'MMyyyy')}/${currentInstructor.id}`).then(newMonth => {
    //         setAvailableDays(newMonth.data.days);
    //     });
    // },[currentInstructor])

    return (
        <>
            <Wrapper
            w='100%'
            h='100%'
            margin='0 0 0 35px'
            bgColor={selectedTime ? '#ccc' : ''}
            onClick={selectedTime && !loading ? () => setSelectedTime() : null}
            justifyContent='space-evenly'
            >
                <Wrapper
                top='5%'
                fontS='32px'
                textAlign='center'
                >
                    Welcome back, {user.name}!
                </Wrapper>

                {userType === 'staff' ?
                    <StaffCalendar />
                :
                    <StudentCalendar
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    getDays={getDays}
                    loading={loading}
                    setLoading={setLoading}
                    userT
                    />
                }
                
            </Wrapper>
        </>
    )
}

export default Calendar;