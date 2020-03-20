import React, { useEffect, useState, useContext, useRef } from 'react';
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
import { Wrapper, Button, P, Input } from '../styledComponents';
import Modal from '../Modal';
import {useHistory, useLocation, Link} from 'react-router-dom';
import {InstructorContext, UserContext, CurrentInstructorContext} from '../../Context';
import axios from 'axios';
import {HashLoader as Loading} from 'react-spinners';
import {FontAwesomeIcon as FAIcon} from '@fortawesome/react-fontawesome';

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
    const inputRef = useRef(null);
    const {instructors, loading, refresh, setLoading, setRefresh} = useContext(InstructorContext);
    const {currentInstructor} = useContext(CurrentInstructorContext);
    const {user} = useContext(UserContext);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [dateClicked, setDateClicked] = useState();
    const [availableDays, setAvailableDays] = useState([]);
    const [selectedTime, setSelectedTime] = useState();
    const [topic, setTopic] = useState({});
    const [timeToSchedule, setTimeToSchedule] = useState();
    const [timeScheduled, setTimeScheduled] = useState();
    const [error, setError] = useState();
    const history = useHistory();
    let location = useLocation();

    const handleInput = e => {
        e.persist();
        setTopic(prevState => {
            return {...prevState, [e.target.name]: e.target.value}
        });
    };

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
        const available = [];
        const date = availableDays?.days?.map(date => {
                const filtered = date.times.filter(times => !times.studentEmail).length;
                if(filtered){
                    available.push(dateFormat(new Date(date.date), 'd'))
                }
        })

        while(currentDay <= endofWeek){
            for(let i = 0; i < 7; i++){
                const today = currentDay;
                numberedDate = dateFormat(currentDay, 'd');
                const time = available.includes(numberedDate);
                days.push(
                    time ?
                        <Link
                        className='link'
                        key={currentDay}
                        to={`/student/calendar/${currentInstructor.id}/${dateFormat(currentDay, 'MMddyyyy')}`}
                        >
                            <Button
                            className={dateFormat(selectedMonth, 'MMddyyyy') === dateFormat(currentDay, 'MMddyyyy') ? 'today' : ''}
                            onClick={() => setDateClicked(today)}
                            bgColor='#fff'
                            calendar
                            w='100%'
                            fontColor={dateFormat(currentDay, 'MM') === dateFormat(startOfMonth, 'MM') ?
                                '#000' : 'rgba(0,0,0,.2)'}
                            borderRadius='0'
                            borderLeft={i !== 0 ? '.25px solid #ccc' : ''}
                            borderRight={i !== 6 ? '.25px solid #ccc' : ''}
                            h='100%'
                            disp='flex'
                            justifyContent='flex-end'
                            >
                                {numberedDate}
                            </Button>
                        </Link>
                    :
                        <Wrapper w='100%' key={currentDay}>
                            <Button
                            className={dateFormat(selectedMonth, 'MMddyyyy') === dateFormat(currentDay, 'MMddyyyy') ? 'today' : ''}
                            bgColor={dateFormat(currentDay, 'MM') !== dateFormat(startOfMonth, 'MM') ?
                                '#fff' : '#ba0c2f'}
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
            borderTop='1px solid #ccc'
            >
                {week}
            </Wrapper>

        ))
        
    }

    const submitSchedule = time => {
        setLoading(true);
        time.topic = topic[time._id];
        time.studentName = user.name;
        time.email = user.email;
        let daysIdx, timesIdx;

        availableDays.days.map((day, ind) => {
            if(dateFormat(new Date(day.date), 'MMdd') === dateFormat(new Date(dateClicked), 'MMdd')){
                daysIdx = ind;
                return day.times.map((times, ind) => {
                    if(dateFormat(new Date(times.time), 'HHmm') === dateFormat(new Date(time.time), 'HHmm')){
                        return timesIdx = ind;
                    }
                })
            }
        })

        axios.put(`/schedule/${currentInstructor.id}/${user.id}`,
        {
            month: availableDays._id,
            daysIdx,
            timesIdx,
            topic: time.topic,
            studentName: time.studentName,
            studentEmail: time.email,
            timeId: time._id,
            time: time.time
        }).then(data => {
            console.log(data.data)
            if(data.data.staff /* && data.data.student */){
                setLoading(false);
                return setTimeScheduled(true);
            }

            setError('There was a problem scheduling the time.  Please check that the time is still available and try again.')
            setRefresh(!refresh)
        })
    }
        
    const scheduleTime = time => {
        setTopic(prevState => ({...prevState, [time._id]: ''}))
        setTimeToSchedule(time);
        setSelectedTime(true);
    }

    const getTimes = () => {
        const [today] = availableDays.days.filter(days =>
            dateFormat(new Date(days.date), 'dd') === dateFormat(dateClicked, 'dd')
        )
        const sortedTimes = today.times.sort((a,b) => 
            parseInt(dateFormat(new Date(a.time), 'H')) - parseInt(dateFormat(new Date(b.time), 'H'))
        );

        return (
            <>
                <P
                textAlign='center'
                w='100%'
                fontS='25px'
                fontW='bolder'
                position='absolute'
                top='20px'
                >
                    {currentInstructor.name}'s available times for {dateFormat(new Date(dateClicked), 'MMMM dd, yyyy')}
                </P>
            
                <Wrapper
                w='100%'
                flexDirection='unset'
                flexWrap='wrap'
                alignItems='flex-start'
                margin='50px 0 0 0'
                >
                    {sortedTimes.filter(avail => !avail.studentEmail)
                    .map(time => (
                        <Button
                        key={time._id}
                        h='75px'
                        fontS='14px'
                        onClick={selectedTime ? null :
                            () => {scheduleTime(time)}
                        }
                        noCursor={selectedTime}
                        margin='50px'
                        >
                            Schedule time for {dateFormat(new Date(time.time), 'hh:mm a')}
                        </Button>
                    ))}
                </Wrapper>                
            </>
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
    
    useEffect(() => {
        axios.get(`/availability/${selectedMonth}/${currentInstructor.id}`).then(newMonth => {
            setAvailableDays(newMonth.data);
        });
    }, [currentInstructor, selectedMonth, refresh])
    
    useEffect(() => {
        if(!location.pathname.split('/')[4]){
            setDateClicked();
            setSelectedTime();
            setTopic();
            setTimeToSchedule();
        }
    },[location.pathname]);

    useEffect(() => {
        if(selectedTime){
            inputRef.current.focus();
        }
    }, [selectedTime])

    return (
        <>
            {selectedTime && 
            <Modal >
                <P
                opacity={loading ? '.5' : ''}
                textAlign='center'
                >
                    {timeScheduled ?
                        `Your time has been reserved for ${dateFormat(new Date(timeToSchedule.time), 'hh:mm a')} on${' '}
                        ${dateFormat(new Date(timeToSchedule.time), 'MMMM dd, yyyy')}!`
                    :
                        `What would you like to cover on${" "}
                        ${dateFormat(new Date(timeToSchedule.time), 'MMMM dd, yyyy')}${" "}
                        at ${dateFormat(new Date(timeToSchedule.time), 'hh:mm a')}?`
                    }
                </P>
                {!timeScheduled &&
                    <Input
                    ref={inputRef}
                    opacity={loading ? '.5' : ''}
                    onChange={handleInput}
                    value={topic[timeToSchedule._id]}
                    type='text'
                    name={timeToSchedule._id}
                    placeholder='Topic to cover'
                    />
                }
                <Wrapper flexDirection='row'>
                    {loading ?
                        <Loading
                        loading
                        color='#172a55'
                        />
                    :
                        <>
                            {!timeScheduled &&
                                <Button
                                margin='0 15px 0 0'
                                onClick={() => submitSchedule(timeToSchedule)}
                                bgColor='#172a55'
                                >
                                    Schedule Time!
                                </Button>
                            }

                            <Button
                            onClick={() => {
                                setTopic();
                                setSelectedTime();
                                setTimeScheduled();
                                setRefresh(!refresh)
                            }}
                            bgColor='#ba0c2f'
                            >
                                {timeScheduled ?
                                    'Okay!'
                                :
                                    'Cancel'
                                }
                            </Button>
                        </>
                    }
                </Wrapper>
            </Modal>
            }
            <Wrapper
            w='100%'
            h='100%'
            margin='0 0 0 50px'
            bgColor={selectedTime ? '#ccc' : ''}
            onClick={selectedTime && !loading ? () => setSelectedTime() : null}
            >
                <Wrapper
                top='5%'
                position='absolute'
                fontS='32px'
                textAlign='center'
                >
                    Welcome back, {user.name}!
                </Wrapper>


                {!dateClicked &&
                    <P>
                        {`You are viewing ${currentInstructor.name}'s calendar`}
                    </P>
                }
                
                <Wrapper
                maxWidth='980px'
                minWidth='300px'
                grid={location.pathname === `/student/calendar/${currentInstructor.id}` ? 'grid' : ''}
                w='80%'
                border='solid 2px #666'
                h='60%'
                display={location.pathname === `/student/calendar/${currentInstructor.id}` ? 'grid' : ''}
                flexDirection={dateClicked ? 'row' : ''}
                boxShadow='#ccc 10px 10px 15px'
                flexWrap={dateClicked ? 'wrap' : ''}
                position='relative'
                >
                    {location.pathname === `/student/calendar/${currentInstructor.id}` ?
                        <>
                            <Wrapper
                            className='calendar-month'
                            gridColumn='1/8'
                            flexDirection='row'
                            justifyContent='space-around'
                            fontS='200%'
                            position='relative'
                            >
                                <span onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>&lt;</span>
                                <span>{dateFormat(selectedMonth, 'LLLL yyyy')}</span>
                                <span onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}>&gt;</span>
                            </Wrapper>
                            {getDays()}
                            {populateCalendar()}
                        </>
                    : dateClicked &&
                        <>
                        <Button
                        onClick={selectedTime ? null : () => {history.goBack(); setDateClicked()}}
                        noCursor={selectedTime}
                        position='absolute'
                        left='-70px'
                        fontS='50px'
                        w='unset'
                        h='unset'
                        fontColor='#000'
                        bgColor='inherit'
                        top='50%'
                        transform='translateY(-50%)'
                        >
                            <FAIcon
                            icon='angle-double-left'
                            />
                        </Button>
                            {getTimes()}
                        </>
                    }
                </Wrapper>
                
                {location.pathname === `/student/calendar/${currentInstructor.id}` &&
                    <Wrapper
                    maxWidth='980px'
                    position='absolute'
                    bottom='0'
                    w='77%'
                    flexDirection='row'
                    justifyContent='space-around'
                    margin='10px 0'
                    >
                        <Wrapper
                        w='60px'
                        >
                            <Wrapper
                            w='50px'
                            h='50px'
                            border='#000 dotted 3px'
                            className='legend-today'
                            boxShadow='rgba(0,0,0,.8) 0 2px 15px 5px'
                            margin='15px 0'
                            />
                            <span>Current Day</span>
                        </Wrapper>
                        
                        <Wrapper
                        w='60px'
                        >
                            <Wrapper
                            w='50px'
                            h='50px'
                            bgColor='#ba0c2f'
                            boxShadow='rgba(0,0,0,.8) 0 2px 15px 5px'
                            margin='15px 0'
                            />
                            <span>No time available</span>
                        </Wrapper>

                        <Wrapper
                        w='60px'
                        >
                            <Wrapper
                            w='50px'
                            h='50px'
                            bgColor='#fff'
                            boxShadow='rgba(0,0,0,.8) 0 2px 15px 5px'
                            margin='15px 0'
                            />
                            <span>Time available</span>
                        </Wrapper>
                    </Wrapper>
                }
            </Wrapper>
        </>
    )
}

export default Calendar;