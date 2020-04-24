import React, { useState, useEffect } from 'react';
import { Button, Wrapper, P } from '../styledComponents';
import { format as dateFormat, fromUnixTime, startOfDay } from 'date-fns';
import { HashLoader as Loading } from 'react-spinners';

const Review = ({timeToSchedule, addTimeToSchedule, schedule, setSchedule}) => {    
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        setSchedule(() => {
            const toSchedule = {};
            for(let month in timeToSchedule){
                timeToSchedule[month].map(time => {
                    if(!toSchedule[dateFormat(startOfDay(fromUnixTime(time)), 't')]){
                        return toSchedule[dateFormat(startOfDay(fromUnixTime(time)), 't')] = [time];
                    }
                    
                    toSchedule[dateFormat(startOfDay(fromUnixTime(time)), 't')].push(time);
                })
                
            }
            return toSchedule;
        });

        setLoading(false);

    }, [timeToSchedule])
    
    return (
        <Wrapper
        w='90%'
        justifyContent={schedule && Object.keys(schedule).length > 0 ? 'flex-start' : ''}
        flexWrap='wrap'
        padding='20px'
        >

            {loading ?
                
                <Loading loading={loading} />
            
            : 
            
            schedule && Object.keys(schedule).length > 0 ?
                Object.keys(schedule).map((day, ind) => (
                    <Wrapper
                    key={ind}
                    w='100%'
                    margin='15px 0'
                    borderBottom='1px solid #ddd'
                    >
                        <P
                        fontS='20px'
                        fontW='bold'
                        >
                            
                            {dateFormat(fromUnixTime(schedule[Object.keys(schedule)[ind]][0]), 'MMMM dd')}
                        </P>
                        <Wrapper
                        flexDirection='row'
                        padding='10px 0'
                        w='100%'
                        >
                            {schedule[Object.keys(schedule)[ind]]
                            .sort((a,b) => a - b)
                            .map(time =>
                                <Button
                                key={time}
                                padding='15px'
                                margin='0 10px'
                                h='75px'
                                onClick={() => addTimeToSchedule(time)}
                                >
                                    {dateFormat(fromUnixTime(time), 'hh:mm a')}
                                </Button>
                        )}
                        </Wrapper>
                    </Wrapper>
                ))
            :
                <P
                textAlign='center'
                fontW='bold'
                fontS='32px'
                fontStyle='italic'
                >
                    No times selected!
                </P>
            }
        </Wrapper>
    )

}

export default Review;