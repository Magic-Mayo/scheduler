import React, { useEffect, useState, useContext, useRef } from 'react';
import {
    startOfMonth as startMonth,
    format as dateFormat,
    addMonths,
    subMonths,
    fromUnixTime
} from 'date-fns';
import { Wrapper, Button, P, Input } from '../styledComponents';
import Modal from '../Modal';
import {useHistory, useLocation} from 'react-router-dom';
import {InstructorContext, UserContext, CurrentInstructorContext} from '../../Context';
import axios from 'axios';
import {HashLoader as Loading} from 'react-spinners';
import {FontAwesomeIcon as FAIcon} from '@fortawesome/react-fontawesome';
import TimesForDate from './TimesForDate';
import PopulateCalendar from './PopulateCalendar';

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
    const {availability, currentInstructor} = useContext(CurrentInstructorContext);
    const {user, userType} = useContext(UserContext);
    const [selectedMonth, setSelectedMonth] = useState(Date.now());
    const [dateClicked, setDateClicked] = useState();
    const [selectedTime, setSelectedTime] = useState();
    const [topic, setTopic] = useState({});
    const [availableDays, setAvailableDays] = useState([]);
    const [timeToSchedule, setTimeToSchedule] = useState({[dateFormat(startMonth(new Date()), 't')]: []});
    const [timeScheduled, setTimeScheduled] = useState();
    const [modal, setModal] = useState();
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
        const date = parseInt(dateClicked) * 1000;
        time.topic = topic[time._id];
        time.studentName = user.name;
        time.email = user.email;
        let daysIdx, timesIdx;

        availableDays.days.map((day, ind) => {
            if(dateFormat(new Date(day.date), 'MMdd') === dateFormat(new Date(date), 'MMdd')){
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
            time: parseInt(dateFormat(new Date(time.time), 't'))
        }).then(data => {
            if(data.data.staff /* && data.data.student */){
                setLoading(false);
                return setTimeScheduled(true);
            }

            setModal('There was a problem scheduling the time.  Please check that the time is still available and try again.')
            setRefresh(!refresh)
        })
    }

    const addTimeToSchedule = time => {
        setModal(() => {
            if(availableDays.includes(time)) return availableDays[time].topic;
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
        })
    }
        
    const scheduleTime = time => {
        setTopic(prevState => ({...prevState, [time._id]: ''}));
        setTimeToSchedule(() => !userType && time);
        setSelectedTime(true);
    }
    
    useEffect(() => {
        const [schedule] = availability.filter(val => val.month === parseInt(dateFormat(startMonth(selectedMonth), 't')));
        setAvailableDays(schedule);
    }, [currentInstructor, selectedMonth, refresh]);

    useEffect(() => {
        setTimeToSchedule(prevSched => {
            if(userType === 'staff' && !prevSched[dateFormat(startMonth(fromUnixTime(selectedMonth)), 't')]){
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
                    {console.log(timeToSchedule)}
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
            bgColor={selectedTime || modal ? '#ccc' : ''}
            onClick={modal || selectedTime && !loading ? () => {setModal(); setSelectedTime()} : null}
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
                        {!userType ? `You are viewing ${currentInstructor.name}'s calendar` : 'Select a day to choose your availability'}
                    </P>
                }
                
                <Wrapper
                maxWidth='980px'
                minWidth='300px'
                grid={location.pathname === `/${userType ? 'staff' : 'student'}/calendar${!userType ? `/${currentInstructor.id}` : ''}` ? 'grid' : ''}
                w='80%'
                border='solid 2px #666'
                h='60%'
                display={location.pathname === `/${userType ? 'staff' : 'student'}/calendar${!userType ? `/${currentInstructor.id}` : ''}` ? 'grid' : ''}
                flexDirection={dateClicked ? 'row' : ''}
                boxShadow='#ccc 10px 10px 15px'
                flexWrap={dateClicked ? 'wrap' : ''}
                position='relative'
                >

                    {location.pathname === `/${userType ? 'staff' : 'student'}/calendar${!userType ? `/${currentInstructor.id}` : ''}` ?
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
            </Wrapper>
        </>
    )
}

export default Calendar;