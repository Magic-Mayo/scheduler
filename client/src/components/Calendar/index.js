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

const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]


const Calendar = () => {
    const [calendar, setCalendar] = useState();
    const [selectedMonth, setSelectedMonth] = useState(new Date());

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
        const endOfMonth = endMonth(selectedMonth);
        const startOfWeek = startWeek(selectedMonth);
        const endofWeek = endWeek(endOfMonth);

        let currentDay = startOfWeek;
        console.log(endofWeek)
        let numberedDate;

        while(currentDay <= endofWeek){
            for(let i = 0; i < 7; i++){
                numberedDate = dateFormat(currentDay, 'd');
                const day = currentDay;
                days.push(
                    <Button key={currentDay} onClick={dateSelect} color='#000' borderRadius='0' border='.5px solid #ccc' Height='100%' Width='100%' bgColor='#fff'>{numberedDate}</Button>
                )

                currentDay = addDays(currentDay, 1);
            }

            weeks.push(
                <Wrapper flexDirection='row' Height='100%' gridColumn='1/8' justifyContent='space-between'>
                    {days.map(day => (
                        <>
                            {day}
                        </>
                    ))}
                </Wrapper>
                );

            days.length = 0;
        }

        console.log(weeks)

        return weeks.map(week => (
            week
        ))
        
    }
        
    return (
        <Wrapper Width='80%' border='solid 2px #666' Height='60%' display='grid' boxShadow='#ccc 10px 10px 15px'>
            <Wrapper className='calendar-month' gridColumn='1/8' flexDirection='row' justifyContent='space-around' fontSize='200%'>
                <span onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>&lt;</span>
                <span>{dateFormat(selectedMonth, 'LLLL')}</span>
                <span onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}>&gt;</span>
            </Wrapper>
            {getDays()}
            {populateCalendar()}
        </Wrapper>
    )
}

export default Calendar;