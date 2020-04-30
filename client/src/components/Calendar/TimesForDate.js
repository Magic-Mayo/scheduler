import React, { useContext } from 'react';
import { Wrapper, P, Button } from '../styledComponents';
import {
    format as dateFormat,
    fromUnixTime,
    startOfMonth
}
from 'date-fns';

const TimesForDate = ({dateClicked, timeToSchedule, selectedTime, scheduleTime, addTimeToSchedule, userType, availability, currentInstructor}) => {
    let sortedTimes;

    if(!userType){
        sortedTimes = availability.schedule.filter(time =>
            !time.studentEmail && dateFormat(fromUnixTime(time.time), 'MMddyyyy') === dateFormat(fromUnixTime(dateClicked), 'MMddyyyy'))
        .sort((a,b) => a - b);
    } else {
        sortedTimes = [
            (parseInt(dateClicked) + 3600 * 9).toString(),
            (parseInt(dateClicked) + 3600 * 10).toString(),
            (parseInt(dateClicked) + 3600 * 11).toString(),
            (parseInt(dateClicked) + 3600 * 12).toString(),
            (parseInt(dateClicked) + 3600 * 13).toString(),
            (parseInt(dateClicked) + 3600 * 14).toString(),
            (parseInt(dateClicked) + 3600 * 15).toString(),
            (parseInt(dateClicked) + 3600 * 16).toString(),
            (parseInt(dateClicked) + 3600 * 17).toString(),
            (parseInt(dateClicked) + 3600 * 18).toString(),
            (parseInt(dateClicked) + 3600 * 19).toString(),
            (parseInt(dateClicked) + 3600 * 20).toString(),
            (parseInt(dateClicked) + 3600 * 21).toString()
        ]

    }

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
                {!userType && `${currentInstructor.name}'s available times for ${dateFormat(fromUnixTime(dateClicked), 'MMMM dd, yyyy')}`}
            </P>
        
            <Wrapper
            w='100%'
            flexDirection='unset'
            flexWrap='wrap'
            alignItems='flex-start'
            margin='50px 0 0 0'
            >
                {!userType ?
                    sortedTimes
                    .map((time, ind) => (
                        <Button
                        key={ind}
                        h='75px'
                        fontS='14px'
                        onClick={selectedTime ? null :
                            () => {scheduleTime(time.time)}
                        }
                        noCursor={selectedTime}
                        margin='25px'
                        >
                            Schedule time for {dateFormat(fromUnixTime(time.time), 'hh:mm a')}
                        </Button>
                    ))
                    :
                    sortedTimes.map(time => (
                        <Button
                        key={time}
                        bgColor={timeToSchedule[dateFormat(startOfMonth(fromUnixTime(time)), 't')].includes(time) ? '' : '#ba0c2f'}
                        h='75px'
                        fontS='14px'
                        onClick={() => addTimeToSchedule(time)}
                        margin='10px'
                        >
                            Make {dateFormat(fromUnixTime(time), 'hh:mm a')} available
                        </Button>
                    ))
                }
            </Wrapper>                
        </>
    )
}

export default TimesForDate;