import React from 'react';
import {
    startOfMonth as startMonth,
    endOfMonth as endMonth,
    startOfWeek as startWeek,
    endOfWeek as endWeek,
    format as dateFormat,
    fromUnixTime,
    addDays
} from 'date-fns';
import { Wrapper, Button } from '../styledComponents';
import { Link } from 'react-router-dom';

const PopulateCalendar = ({ setDateClicked, selectedMonth, availableDays, userType, currentInstructor, user, error }) => {

    const weeks = [];
    const days = [];
    const currentToday = new Date();
    
    const startOfMonth = startMonth(selectedMonth);
    const endOfMonth = endMonth(startOfMonth);
    const startOfWeek = startWeek(startOfMonth);
    const endofWeek = endWeek(endOfMonth);
    
    let currentDay = startOfWeek;
    let numberedDate;
    const available = [];
    const date = availableDays?.days?.map(date => {
        const filtered = date.times.filter(times => !times.studentEmail).length;
        if(filtered){
            available.push(dateFormat(fromUnixTime(date.date), 'd'))
        }
    })
    
    while(currentDay <= endofWeek){
        for(let i = 0; i < 7; i++){
            const today = currentDay;
            numberedDate = dateFormat(currentDay, 'd');
            const time = available.includes(numberedDate);
            days.push(
                !userType && !time ?
                    <Wrapper w='100%' key={currentDay}>
                        <Button
                        className={dateFormat(selectedMonth, 'MMddyyyy') === dateFormat(currentDay, 'MMddyyyy') ? 'today' : ''}
                        bgColor={dateFormat(currentDay, 'MM') !== dateFormat(startOfMonth, 'MM') ?
                            '#fff' : error ? '#ccc' : '#ba0c2f'
                        }
                        calendar
                        w='100%'
                        fontColor={dateFormat(currentDay, 'MM') === dateFormat(startOfMonth, 'MM') ? '#000' : 'rgba(0,0,0,.2)'}
                        borderRadius='0'
                        borderLeft={i !== 0 ? '.25px solid #ccc' : ''}
                        borderRight={i !== 6 ? '.25px solid #ccc' : ''}
                        h='100%'
                        disp='flex'
                        justifyContent='flex-end'
                        noCursor
                        >
                            <Wrapper>{numberedDate}</Wrapper>
                        </Button>
                    </Wrapper>
                :
                    <Link
                    className='link'
                    key={currentDay}
                    to={`/${userType ? 'staff' : 'student'}/calendar/${userType ? user.id : currentInstructor.id}/${dateFormat(currentDay, 'MMddyyyy')}`}
                    >
                        <Button
                        className={
                            dateFormat(selectedMonth, 'MM') === dateFormat(currentToday, 'MM') ?
                            dateFormat(today, 'MMddyyyy') === dateFormat(currentToday, 'MMddyyyy') ? 'today' : ''
                            : ''}
                        onClick={() => setDateClicked(dateFormat(new Date(today), 't'))}
                        bgColor={error ? '#ccc' : '#fff'}
                        calendar
                        w='100%'
                        padding='0 8px 0 0'
                        fontColor={dateFormat(currentDay, 'MM') === dateFormat(startOfMonth, 'MM') ?
                            '#000' : 'rgba(0,0,0,.2)'}
                        borderRadius='0'
                        borderLeft={i !== 0 ? '.25px solid #ccc' : ''}
                        borderRight={i !== 6 ? '.25px solid #ccc' : ''}
                        h='100%'
                        disp='flex'
                        justifyContent='flex-end'
                        >
                            <Wrapper
                            justifyContent='unset'
                            alignItems='unset'
                            h='100%'
                            >
                                {numberedDate}
                            </Wrapper>
                        </Button>
                    </Link>
            )

            currentDay = addDays(currentDay, 1);
        }

        weeks.push(
            days.map(day => (day))
        );

        days.length = 0;
    }

    return weeks.map((week, ind, arr) => (
        <Wrapper
        key={ind}
        flexDirection='row'
        h='100%'
        gridColumn='1/8'
        justifyContent='space-between'
        borderBottom={ind !== arr.length - 1 ? '1px solid #ccc' : ''}
        borderTop='1px solid #ccc'
        >
            {week}
        </Wrapper>

    ))
    
}

export default PopulateCalendar;