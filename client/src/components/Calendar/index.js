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
import { Wrapper, Button, P, Input } from '../styledComponents';
import Modal from '../Modal';
import {useHistory, useLocation, useParams, Link} from 'react-router-dom';
import {InstructorContext, UserContext, CurrentInstructorContext} from '../../Context';
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
    const {instructor} = useContext(InstructorContext);
    const {currentInstructor, setCurrentInstructor} = useContext(CurrentInstructorContext);
    const {user} = useContext(UserContext);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [dateClicked, setDateClicked] = useState();
    const [availableDays, setAvailableDays] = useState([]);
    const [selectedTime, setSelectedTime] = useState();
    const [topic, setTopic] = useState();
    const history = useHistory();
    let location = useLocation();
    let {instructorId} = useParams();

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
                const today = currentDay;
                const availableDate = availableDays?.days?.filter(date =>
                    dateFormat(new Date(date.date), 'MMddyyyy') === dateFormat(currentDay, 'MMddyyyy')).length;
                numberedDate = dateFormat(currentDay, 'd');
                console.log(availableDate)
                days.push(
                    availableDate ?
                        <Link
                        className='link'
                        key={currentDay}
                        to={`/student/calendar/${instructorId}/${dateFormat(currentDay, 'MMddyyyy')}`}
                        >
                            <Button
                            className={dateFormat(selectedMonth, 'MMddyyyy') === dateFormat(currentDay, 'MMddyyyy') ? 'today' : ''}
                            onClick={availableDate ? () => setDateClicked(today) : null}
                            bgColor={availableDate || dateFormat(currentDay, 'MM') !== dateFormat(startOfMonth, 'MM') ?
                                '#fff' : '#ba0c2f'}
                            calendar
                            w='100%'
                            fontColor={dateFormat(currentDay, 'MM') === dateFormat(startOfMonth, 'MM') ? '#000' : 'rgba(0,0,0,.2)'}
                            borderRadius='0'
                            borderLeft={i !== 0 ? '.25px solid #ccc' : ''}
                            borderRight={i !== 6 ? '.25px solid #ccc' : ''}
                            h='100%'
                            w='100%'
                            disp='flex'
                            justifyContent='flex-end'
                            noCursor={!availableDate}
                            >
                                {numberedDate}
                            </Button>
                        </Link>
                    :
                        <Wrapper w='100%'>
                            <Button
                            className={dateFormat(selectedMonth, 'MMddyyyy') === dateFormat(currentDay, 'MMddyyyy') ? 'today' : ''}
                            onClick={availableDate ? () => setDateClicked(today) : null}
                            bgColor={availableDate || dateFormat(currentDay, 'MM') !== dateFormat(startOfMonth, 'MM') ?
                                '#fff' : '#ba0c2f'}
                            calendar
                            w='100%'
                            fontColor={dateFormat(currentDay, 'MM') === dateFormat(startOfMonth, 'MM') ? '#000' : 'rgba(0,0,0,.2)'}
                            borderRadius='0'
                            borderLeft={i !== 0 ? '.25px solid #ccc' : ''}
                            borderRight={i !== 6 ? '.25px solid #ccc' : ''}
                            h='100%'
                            w='100%'
                            disp='flex'
                            justifyContent='flex-end'
                            noCursor={!availableDate}
                            >
                                {numberedDate}
                            </Button>
                        </Wrapper>
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
            borderTop={ind !== 0 ? '1px solid #ccc' : ''}
            >
                {week}
            </Wrapper>

        ))
        
    }

    const submitSchedule = id => {
        axios.post(`/schedule/${id}/:date/:time`)
    }

    const scheduleTime = (time, date) => {
        setSelectedTime(
            <Modal 
            submitTime={() => {
                axios.post(`/schedule/`)
            }}
            >
                <P>What would you like to cover on {date} at {time.time}?</P>
                <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder='Topic to cover'></Input>
                <Wrapper flexDirection='row'>
                    <Button onClick={() => submitSchedule(time._id)} bgColor='#172a55'>Schedule Time!</Button>
                    <Button onClick={() => setSelectedTime()} bgColor='#ba0c2f'>Cancel</Button>
                </Wrapper>
            </Modal>
        )
    }

    const getTimes = () => {        
        const [today] = availableDays.days.filter(days =>
            dateFormat(new Date(days.date), 'dd') === dateFormat(dateClicked, 'dd')
        );

        return (
            <>
                {/* {dateClicked && */}
                    {/* <> */}
                        <P
                        textAlign='center'
                        w='100%'
                        fontS='25px'
                        fontW='bolder'
                        >
                            {currentInstructor.name}'s available times for {dateFormat(new Date(dateClicked), 'MMMM dd, yyyy')}
                        </P>
                    
                        <Wrapper w='100%'>
                            {today.times.map(time => (
                                <Button
                                key={time._id}
                                h='75px'
                                fontS='14px'
                                onClick={selectedTime ? null :
                                    () => scheduleTime(time, dateFormat(new Date(dateClicked), 'MMMM d'))
                                }
                                noCursor={selectedTime}
                                >
                                    Schedule time for {dateFormat(new Date(time.time), 'hh:mm a')}
                                </Button>
                            ))}
                        </Wrapper>
                    {/* </> */}
                {/* // } */}
                
            </>
        )
    }

    // useEffect(() => {
    //     setDateClicked(date);
    // }, [date]);

    // useEffect(() => {
    //     fetch(`/availability/${dateFormat(selectedMonth, 'MMddyyyy')}/${instructorId}/`).then(dates => {
    //         setAvailability(dates);
    //     })
    // }, [currentInstructor, selectedMonth]);

    // useEffect(() => {
    //     setSelectedMonth(new Date());
    //     fetch(`/availability/${dateFormat(selectedMonth, 'MMyyyy')}/${currentInstructor.id}`).then(newMonth => {
    //         setAvailableDays(newMonth.data.days);
    //     });
    // },[currentInstructor])
    
    useEffect(() => {
        axios.get(`/availability/${selectedMonth}/${currentInstructor.id}`).then(newMonth => {
            setAvailableDays(newMonth.data);
        });
    }, [selectedMonth])
    
    // useEffect(() => {
    //     fetch({
    //         url: `/schedule/${user.id}/${currentInstructor.id}`,
    //         method: 'POST'
    //     }).then(res => {
    //         if(res.data) return setStatus('Your time has been reserved!');
    //         setStatus('There was an error in reserving this time.  Try again and if the error persists please contact your Instructor/TA directly')
    //     })
    // }, [time]);

    useEffect(() => {
        if(location.pathname === `/student/calendar/${instructorId}`){
            setDateClicked();
            setSelectedTime();
        }
    },[location.pathname]);

    return (
        <>
            {selectedTime && selectedTime}
            <Wrapper
            w='100%'
            h='100%'
            margin='0 0 0 35px'
            bgColor={selectedTime ? '#ccc' : ''}
            onClick={selectedTime ? () => setSelectedTime() : null}
            >
                <Wrapper top='5%' position='absolute' fontS='32px'>Welcome back, {user.name}!</Wrapper>
                {dateClicked &&
                    <Button
                    onClick={selectedTime ? null : () => {history.goBack(); setDateClicked()}}
                    noCursor={selectedTime}
                    >Back to Calendar</Button>
                }
                {!dateClicked &&
                    <P>
                        {`${currentInstructor.name}'s calendar`}
                    </P>
                }
                <Wrapper
                grid={location.pathname === `/student/calendar/${instructorId}` ? 'grid' : ''}
                w='80%'
                border='solid 2px #666'
                h='60%'
                display={location.pathname === `/student/calendar/${instructorId}` ? 'grid' : ''}
                flexDirection={dateClicked ? 'row' : ''}
                boxShadow='#ccc 10px 10px 15px'
                flexWrap={dateClicked ? 'wrap' : ''}
                >
                {location.pathname === `/student/calendar/${instructorId}` ?
                    <>
                        <Wrapper
                        className='calendar-month'
                        gridColumn='1/8'
                        flexDirection='row'
                        justifyContent='space-around'
                        fontS='200%'>
                            <span onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>&lt;</span>
                            <span>{dateFormat(selectedMonth, 'LLLL yyyy')}</span>
                            <span onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}>&gt;</span>
                        </Wrapper>
                        {getDays()}
                        {populateCalendar()}
                    </>
                :
                    <>
                        {getTimes()}
                    </>
                }
                </Wrapper>
            </Wrapper>
        </>
    )
}

export default Calendar;