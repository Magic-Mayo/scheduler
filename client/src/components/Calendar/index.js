import React, { useEffect, useState } from 'react';
import {
    startOfMonth as startMonth,
    endOfMonth as endMonth,
    startOfWeek as startWeek,
    endOfWeek as endWeek,
    format as dateFormat,
    addDays,
    addMonths,
    subMonths
} from 'date-fns';
import { Wrapper, Button } from '../styledComponents';
import axios from 'axios';

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
    const [calendar, setCalendar] = useState();
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [availabilty, setAvailability] = useState();

    const dateSelect = e => {
        
    }

    const getDays = () => {
        return (
            days.map(day => (
                <Wrapper key={day}>
                    {day}
                </Wrapper>
            ))
        )
    }

    const populateCalendar = () => {
        const weeks = [];
        const days = [];

        const startOfMonth = startMonth(selectedMonth);
        const endOfMonth = endMonth(startOfMonth);
        const startOfWeek = startWeek(startOfMonth);
        const endofWeek = endWeek(endOfMonth);

        let currentDay = startOfWeek;
        let numberedDate;

        while(currentDay <= endofWeek){
            for(let i = 0; i < 7; i++){
                numberedDate = dateFormat(currentDay, 'd');
                days.push(
                    <Button
                    calendar
                    value={dateFormat(currentDay, 'MMMM d, yyyy')}
                    key={currentDay}
                    onClick={dateSelect}
                    color='#000' borderRadius='0'
                    border='.5px solid #ccc'
                    Height='100%'
                    Width='100%'
                    bgColor='#fff'
                    >{numberedDate}</Button>
                )

                currentDay = addDays(currentDay, 1);
            }

            weeks.push(
                <Wrapper
                key={dateFormat(currentDay, 'w')}
                flexDirection='row'
                Height='100%'
                gridColumn='1/8'
                justifyContent='space-between'
                borderLeft='#000 solid 1px'
                borderRight='#000 solid 1px'
                >
                    {days.map(day => (
                        day
                    ))}
                </Wrapper>
                );

            days.length = 0;
        }

        return weeks.map(week => (
            week
        ))
        
    }

    useEffect(() => {
        axios.get(`/availability/${dateFormat(selectedMonth, 'MMMM%20yyyy')}`).then(newMonth =>
            setAvailability(newMonth.data)
        )
    },[selectedMonth])
    
    return (
        <Wrapper Width='80%' border='solid 2px #666' Height='60%' display='grid' boxShadow='#ccc 10px 10px 15px'>
            <Wrapper className='calendar-month' gridColumn='1/8' flexDirection='row' justifyContent='space-around' fontSize='200%'>
                <span onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>&lt;</span>
                <span>{dateFormat(selectedMonth, 'LLLL yyyy')}</span>
                <span onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}>&gt;</span>
            </Wrapper>
            {getDays()}
            {populateCalendar()}
        </Wrapper>
    )
}

export default Calendar;