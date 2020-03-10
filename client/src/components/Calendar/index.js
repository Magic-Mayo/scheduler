import React, { useEffect, useState, useContext } from 'react';
import {
    startOfMonth as startMonth,
    endOfMonth as endMonth,
    startOfWeek as startWeek,
    endOfWeek as endWeek,
    format as dateFormat,
    addDays,
    addMonths,
    subMonths,
} from 'date-fns';
import { Wrapper, Button, P } from '../styledComponents';
import {useHistory, useLocation, useParams, Link} from 'react-router-dom';
import {InstructorContext, UserContext, CurrentInstructorContext} from '../../Context';

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
    const {instructor} = useContext(InstructorContext);
    const {currentInstructor, setCurrentInstructor} = useContext(CurrentInstructorContext);
    const {user} = useContext(UserContext);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [availabilty, setAvailability] = useState();
    const [dateClicked, setDateClicked] = useState();
    const [status, setStatus] = useState();
    const [time, setTime] = useState();
    const history = useHistory();
    let location = useLocation();
    let {date, instructorId} = useParams();

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
                    className='link'
                    key={currentDay}
                    to={`/student/calendar/${instructorId}/${dateFormat(currentDay, 'MMddyyyy')}`}
                    >
                        <Button
                        onClick={(e) => setDateClicked(dateFormat(currentDay, 'MMddyyyy'))}
                        value={dateFormat(currentDay, 'MMMM d, yyyy')}
                        calendar
                        w='100%'
                        fontColor={dateFormat(currentDay, 'MM') === dateFormat(startOfMonth, 'MM') ? '#000' : 'rgba(0,0,0,.2)'}
                        borderRadius='0'
                        border={i === 0 || i === 6 ?  '' : '.5px solid #ccc'}
                        borderTop={i === 0 || i === 6 ? '.5px solid #ccc' : ''}
                        borderBottom={i === 0 || i === 6 ? '.5px solid #ccc' : ''}
                        h='100%'
                        w='100%'
                        bgColor='#fff'
                        disp='flex'
                        justifyContent='flex-end'
                        >
                            {numberedDate}
                        </Button>
                    </Link>
                )

                currentDay = addDays(currentDay, 1);
            }

            weeks.push(
                <Wrapper
                key={dateFormat(currentDay, 'w')}
                flexDirection='row'
                h='100%'
                gridColumn='1/8'
                justifyContent='space-between'
                // borderLeft='#666 solid 1px'
                // borderRight='#666 solid 1px'
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
        let month;
        let day;
        let year;

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
        ];

        if(dateClicked){
            const path = location.pathname.split(`calendar/${instructorId}/`)[1].split('');
            month = path.slice(0,2).join('');
            day = path.slice(2,4).join('');
            year = path.slice(4).join('');
        }

        return (
            <>
                {dateClicked &&
                    <P
                    textAlign='center'
                    gridColumn='1/6'
                    fontS='25px'
                    fontW='bolder'
                    >{dateFormat(new Date(year, month, day), 'MMMM dd, yyyy')}</P>
                }
                {times.map(time => (
                    <Wrapper key={time}>
                        <Button
                        h='75px'
                        fontS='14px'
                        // onClick={setStatus}
                        >
                            Schedule time for {time}
                        </Button>
                    </Wrapper>
                ))}
            </>
        )
    }

    useEffect(() => {
        setDateClicked(date);
    }, [date]);

    // useEffect(() => {
    //     fetch(`/availability/${dateFormat(selectedMonth, 'MMddyyyy')}/${instructorId}/`).then(dates => {
    //         setAvailability(dates);
    //     })
    // }, [currentInstructor, selectedMonth]);

    useEffect(() => {
        fetch(`/availability/${dateFormat(selectedMonth, 'MMyyyy')}/${currentInstructor.id}`).then(newMonth => {
            console.log(newMonth)
            const times = []
            times.push(newMonth.data);
            setAvailability(newMonth.data);
        })
    },[currentInstructor])

    useEffect(() => {
        fetch({
            url: `/schedule/${user.id}/${currentInstructor.id}`,
            method: 'POST'
        }).then(res => {
            if(res.data) return setStatus('Your time has been reserved!');
            setStatus('There was an error in reserving this time.  Try again and if the error persists please contact your Instructor/TA directly')
        })
    }, [time])

    return (
        <Wrapper w='100%' margin='0 0 0 35px'>
            <Wrapper top='5%' position='absolute' fontS='32px'>Welcome back, {user.name}!</Wrapper>
            {dateClicked &&
                <Button onClick={() => {history.goBack(); setDateClicked()}}>Back to Calendar</Button>
            }
            {location.pathname === `/student/calendar` ?
                <Wrapper>
                    <P>
                        Please choose an instructor to view their calendar:
                    </P>
                    {instructor.map(ins => (
                        <Link
                        key={ins.id}
                        to={`/student/calendar/${ins.id}`}
                        onClick={() => setCurrentInstructor(ins.id)}
                        >
                            <Button
                            margin='10px 0'
                            bgColor='#172a55'
                            borderRadius='7px'
                            textAlign='center'
                            >
                                {ins.name}
                            </Button>
                        </Link>
                    ))}
                </Wrapper>
            :
                <Wrapper
                grid={location.pathname === `/student/calendar/${instructorId}` ? 'grid' : 'grid1'}
                w='80%'
                border='solid 2px #666'
                h='60%' display='grid'
                boxShadow='#ccc 10px 10px 15px'
                >
                    {location.pathname === `/student/calendar/${instructorId}` ?
                        <>
                            <Wrapper className='calendar-month' gridColumn='1/8' flexDirection='row' justifyContent='space-around' fontS='200%'>
                                <span onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>&lt;</span>
                                <span>{dateFormat(selectedMonth, 'LLLL yyyy')}</span>
                                <span onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}>&gt;</span>
                            </Wrapper>
                            {getDays()}
                            {populateCalendar()}
                        </>
                    : location.pathname === `/student/calendar/${instructorId}/${dateClicked}` &&
                        <>
                            {getTimes()}
                        </>
                    }
                </Wrapper>
            }
        </Wrapper>
    )
}

export default Calendar;