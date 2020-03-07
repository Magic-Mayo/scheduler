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
import { Wrapper, Button, P, Link } from '../styledComponents';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

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
    const [dateClicked, setDateClicked] = useState();
    const history = useHistory();

    const dateSelect = e => {
        setDateClicked(e.target.value);
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
                    <Link
                    key={currentDay}
                    padding='0'
                    to={`/student/calendar/${dateFormat(currentDay, 'MMdd')}`}
                    >
                        <Button
                        calendar
                        value={dateFormat(currentDay, 'MMMM d, yyyy')}
                        onClick={dateSelect}
                        Color='#000'
                        borderRadius='0'
                        border='.5px solid #ccc'
                        Height='100%'
                        Width='100%'
                        bgColor='#fff'
                        display='flex'
                        justifyContent='flex-end'
                        >{numberedDate}</Button>
                    </Link>
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
                borderLeft='#666 solid 1px'
                borderRight='#666 solid 1px'
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

    const getTimes = () => {
        const times = [
            '09:00am',
            '10:00am',
            '11:00am',
            '12:00pm',
            '1:00pm',
            '2:00pm',
            '3:00pm',
            '4:00pm',
            '5:00pm',
            '6:00pm',
            '7:00pm',
            '8:00pm',
            '9:00pm'
        ]
        return (
            <>
                <P>{dateClicked}</P>
                {times.map(time => (
                    <Wrapper key={time}>
                        <span>Schedule time for {time}</span>
                    </Wrapper>
                ))}
            </>
        )
    }

    useEffect(() => {
        axios.get(`/availability/${dateFormat(selectedMonth, 'MMMM%20yyyy')}`).then(newMonth =>
            setAvailability(newMonth.data)
        )
    },[selectedMonth])

    return (
        <Wrapper Width='100%' margin='0 0 0 50px'>
            {dateClicked &&
                <Button onClick={() => {history.goBack(); setDateClicked()}}>Back to Calendar</Button>
            }
            <Wrapper Width='80%' border='solid 2px #666' Height='60%' display='grid' boxShadow='#ccc 10px 10px 15px'>
                {!dateClicked ?
                    <>
                        <Wrapper className='calendar-month' gridColumn='1/8' flexDirection='row' justifyContent='space-around' fontSize='200%'>
                            <span onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>&lt;</span>
                            <span>{dateFormat(selectedMonth, 'LLLL yyyy')}</span>
                            <span onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}>&gt;</span>
                        </Wrapper>
                        {getDays()}
                        {populateCalendar()}
                    </>
                :
                    <Wrapper>
                        {getTimes()}
                    </Wrapper>
                }
            </Wrapper>
        </Wrapper>
    )
}

export default Calendar;