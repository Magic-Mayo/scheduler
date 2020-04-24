import React, { useEffect, useState, useContext, useRef } from 'react';
import {
    startOfMonth as startMonth,
    format as dateFormat,
    addMonths,
    subMonths,
    fromUnixTime,
    startOfDay
} from 'date-fns';
import { Wrapper, Button, P, Input } from '../styledComponents';
import Modal from '../Modal';
import {useHistory, useLocation, Link} from 'react-router-dom';
import {InstructorContext, UserContext, CurrentInstructorContext} from '../../Context';
import axios from 'axios';
import {HashLoader as Loading} from 'react-spinners';
import {FontAwesomeIcon as FAIcon} from '@fortawesome/react-fontawesome';
import TimesForDate from './TimesForDate';
import PopulateCalendar from './PopulateCalendar';
import Review from './Review';

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
    const {loading, refresh, setLoading, setRefresh} = useContext(InstructorContext);
    const {availability, currentInstructor, setAvailability} = useContext(CurrentInstructorContext);
    const {user, userType} = useContext(UserContext);
    const [selectedMonth, setSelectedMonth] = useState(Date.now());
    const [dateClicked, setDateClicked] = useState();
    const [selectedTime, setSelectedTime] = useState();
    const [topic, setTopic] = useState({});
    const [availableDays, setAvailableDays] = useState([]);
    const [timeToSchedule, setTimeToSchedule] = useState({[dateFormat(startMonth(new Date()), 't')]: []});
    const [timeScheduled, setTimeScheduled] = useState();
    const [schedule, setSchedule] = useState();
    const [modal, setModal] = useState();
    const [review, setReview] = useState();
    const [error, setError] = useState();
    const history = useHistory();
    let location = useLocation();

    const handleInput = e => {
        e.persist();
        setTopic(prevState => {
            return {...prevState, [e.target.name]: e.target.value}
        });
    };

    const requestScheduledTime = time => {
        setLoading(true);
        const date = parseInt(dateClicked);
        time.topic = topic[time._id];
        time.studentName = user.name;
        time.email = user.email;
        let daysIdx, timesIdx;

        availableDays.days.map((day, ind) => {
            if(dateFormat(fromUnixTime(day.date), 'MMdd') === dateFormat(fromUnixTime(date), 'MMdd')){
                daysIdx = ind;
                return day.times.map((times, ind) => {
                    if(dateFormat(fromUnixTime(times.time), 'HHmm') === dateFormat(fromUnixTime(time.time), 'HHmm')){
                        return timesIdx = ind;
                    }
                })
            }
        })

        axios.put(`/api/schedule/${currentInstructor.id}/${user.id}`,
        {
            month: parseInt(dateFormat(startMonth(fromUnixTime(date)), 't')),
            daysIdx,
            timesIdx,
            topic: time.topic,
            studentName: time.studentName,
            studentEmail: time.email,
            timeId: time._id,
            time: time.time
        }).then(data => {
            setLoading(false);
            setTimeScheduled(true);
            if(data.data.staff /* && data.data.student */){
                return;
            }
            
            setError('There was a problem scheduling the time.  Please hit the refresh button to check that the time is still available and try again.')
            setRefresh(!refresh)
        })
    }

    const addTimeToSchedule = time => {
        setModal(() => {
            if(!userType && availableDays.includes(time)) return availableDays[time].topic;
            return;
        });

        setTimeToSchedule(prevState => {
            if(timeToSchedule[dateFormat(startMonth(fromUnixTime(time)), 't')].includes(time)){
                const newTime = {...prevState}
                const reference = newTime[dateFormat(startMonth(fromUnixTime(time)), 't')];
                const index = reference.indexOf(time);
                if(index !== -1){
                    reference.splice(index, 1);
                }
                return newTime;
            }
            
            return {...prevState, [dateFormat(startMonth(fromUnixTime(time)), 't')]: [...prevState[dateFormat(startMonth(fromUnixTime(time)), 't')], time]}
        });
    }

    const submitSchedule = () => {
        const schedToSend = {};
        for(let month in timeToSchedule){
            if(!timeToSchedule[month].length) continue;
            
            const monthInObj = timeToSchedule[month];
            schedToSend[month] = {days: []};
            let lastDate;
            
            monthInObj.map(time => {
                const day = dateFormat(startOfDay(fromUnixTime(time)), 't');
                const findDay = schedToSend[month].days.filter((time, ind) => {
                    lastDate = ind;
                    return time.date === day
                });

                if(!findDay.length){
                    schedToSend[month].days.push({date: day, times: [{time: time}]});
                    return lastDate = day;
                }

                return schedToSend[month].days[lastDate].times.push({time: time})
            })
        }

        axios.post(`/api/availability/${user.id}`, schedToSend).then(res => console.log(res))
    }
        
    const scheduleTime = time => {
        setTopic(prevState => ({...prevState, [time._id]: ''}));
        setTimeToSchedule(() => !userType && time);
        setSelectedTime(true);
    }
    
    useEffect(() => {
        if(availability){
            const [schedule] = availability.filter(val => val.month === parseInt(dateFormat(startMonth(selectedMonth), 't')));
            setAvailableDays(schedule);
        }
    }, [currentInstructor, selectedMonth, availability]);

    useEffect(() => {
        setTimeToSchedule(prevSched => {
            if(userType !== 'staff'){
                return prevSched;
            }

            if(!prevSched[dateFormat(startMonth(new Date(selectedMonth)), 't')]){
                const newSched = {...prevSched};
                newSched[dateFormat(startMonth(new Date(selectedMonth)), 't')] = [];
                return newSched;
            }

            return prevSched;
        });
    }, [selectedMonth])
    
    useEffect(() => {
        if(!userType && !location.pathname.split('/')[4]){
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
    }, [selectedTime]);

    useEffect(() => {
        if(location.pathname.split('student/')[1]){
            axios.get(`/api/availability/${currentInstructor.id}`).then(schedule => {
                setAvailability(schedule.data);
            });
        }
    }, [refresh])

    useEffect(() => {
        if(location.pathname !== '/staff/calendar/review') setReview();
    }, [location.pathname])

    return (
        <>
            {modal &&
                <Modal>
                    {modal}
                    <Button onClick={() => setModal()}>Continue</Button>
                </Modal>
            }

            {selectedTime &&
                <Modal >
                    <P
                    opacity={loading ? '.5' : ''}
                    textAlign='center'
                    >
                        {!error ?
                            timeScheduled ?
                                `Your time has been reserved for ${dateFormat(fromUnixTime(timeToSchedule.time), 'hh:mm a')} on${' '}
                                ${dateFormat(fromUnixTime(timeToSchedule.time), 'MMMM dd, yyyy')}!`
                            :
                                `What would you like to cover on${" "}
                                ${dateFormat(fromUnixTime(timeToSchedule.time), 'MMMM dd, yyyy')}${" "}
                                at ${dateFormat(fromUnixTime(timeToSchedule.time), 'hh:mm a')}?`
                        :
                            error
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
                                    onClick={() => requestScheduledTime(timeToSchedule)}
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
                                    {error ?
                                        'Back'
                                    :

                                    timeScheduled ?
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
            bgColor={selectedTime || modal ? '#ccc' : ''}
            onClick={(modal || selectedTime) && !loading ? () => {setModal(); setSelectedTime()} : null}
            >
                <Wrapper
                top='5%'
                position='absolute'
                fontS='32px'
                textAlign='center'
                >
                    Welcome back, {user.name}!
                </Wrapper>

                <P>
                    {!userType ?
                        !dateClicked && `You are viewing ${currentInstructor.name}'s calendar`
                    
                    :

                        review ?
                            'Please review your selected dates and times before submitting.  Click any time to remove it.'
                        :
                            `Select ${dateClicked ? 'times' : 'a day to choose your availability'}`
                    }
                </P>
                
                <Wrapper
                maxWidth='980px'
                minWidth='300px'
                grid={location.pathname === `/${userType ? 'staff' : 'student'}/calendar${!userType ? `/${currentInstructor.id}` : ''}` ? 'grid' : ''}
                w='80%'
                border='solid 2px #666'
                h='60%'
                display={review ? '' : location.pathname === `/${userType ? 'staff' : 'student'}/calendar${!userType ? `/${currentInstructor.id}` : ''}` ? 'grid' : ''}
                flexDirection={dateClicked ? 'row' : ''}
                boxShadow='#ccc 10px 10px 15px'
                flexWrap={dateClicked ? 'wrap' : ''}
                position='relative'
                >

                    {!review ?
                    location.pathname === `/${userType ? 'staff' : 'student'}/calendar${!userType ? `/${currentInstructor.id}` : ''}` ?
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

                            {days.map(day => (
                                <Wrapper key={day}>
                                    {day}
                                </Wrapper>
                            ))}

                            <PopulateCalendar
                            selectedMonth={selectedMonth}
                            availableDays={availableDays}
                            userType={userType}
                            currentInstructor={currentInstructor}
                            setDateClicked={setDateClicked}
                            user={user}
                            error={modal}
                            />
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
                            
                            <TimesForDate
                            dateClicked={dateClicked}
                            timeToSchedule={timeToSchedule}
                            selectedTime={selectedTime}
                            scheduleTime={scheduleTime}
                            addTimeToSchedule={addTimeToSchedule}
                            userType={userType}
                            availableDays={availableDays}
                            currentInstructor={currentInstructor}
                            />
                        </>
                    :
                        <Review
                        timeToSchedule={timeToSchedule}
                        addTimeToSchedule={addTimeToSchedule}
                        schedule={schedule}
                        setSchedule={setSchedule}
                        />
                    }
                    {review &&
                        <Button
                        onClick={history.goBack}
                        // noCursor={selectedTime}
                        position='absolute'
                        left='-70px'
                        fontS='50px'
                        w='unset'
                        h='unset'
                        fontColor='#000'
                        bgColor='inherit'
                        top='50%'
                        transform='translateY(-50%)'
                        className='hello'
                        >
                            <FAIcon
                            icon='angle-double-left'
                            />
                        </Button>
                    }
                </Wrapper>
                
                {!userType && location.pathname === `/student/calendar/${currentInstructor.id}` &&
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
                {userType === 'staff' &&
                    <Button
                    onClick={review ? submitSchedule : () => {setReview(true); history.push('/staff/calendar/review')}}
                    margin='35px 0'
                    w='200px'
                    h='75px'
                    >
                        {review ?  'Submit Schedule' : 'Review Schedule'}
                    </Button>
                }
            </Wrapper>
        </>
    )
}

export default Calendar;