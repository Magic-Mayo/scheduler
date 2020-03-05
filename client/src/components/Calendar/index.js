import React, { useEffect, useState } from 'react';
import { Wrapper } from '../styledComponents';

const year = new Date().getFullYear();

const months = [
    {days: 31, month: 'January', year: year},
    {days: 28, month: 'February', year: year},
    {days: 31, month: 'March', year: year},
    {days: 30, month: 'April', year: year},
    {days: 31, month: 'May', year: year},
    {days: 30, month: 'June', year: year},
    {days: 31, month: 'July', year: year},
    {days: 31, month: 'August', year: year},
    {days: 30, month: 'September', year: year},
    {days: 31, month: 'October', year: year},
    {days: 30, month: 'November', year: year},
    {days: 31, month: 'December', year: year}
]

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
    const [selectedMonth, setSelectedMonth] = useState('March');


    const getDays = () => {
        return (
            <Wrapper flexDirection='row'>
                {days.map(day => (
                    <Wrapper bgColor={'a'/* get date from db */}>
                        hi
                    </Wrapper>
                ))}
            </Wrapper>
        )
    }
        
    return (
        <Wrapper Width='50%' border='solid 2px #ddd'>
            {months.filter(month => {
                if(month.month === selectedMonth){
                    return getDays()
                }
            })}
        </Wrapper>
    )
}

export default Calendar;