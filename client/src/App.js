import React, {useState} from 'react';
import {Switch, Route, useLocation, Redirect} from 'react-router-dom';
import Student from './pages/Student';
import Staff from './pages/Staff';
import Home from './pages/Home';
import Nav from './components/Nav';
import Schedule from './components/Schedule';
import Calendar from './components/Calendar';
import {Wrapper} from './components/styledComponents';
import {UserContext, InstructorContext, CurrentInstructorContext} from './Context';
import {
    faSync,
    faHome,
    faChalkboardTeacher,
    faArrowLeft,
    faArrowRight,
    faCalendarAlt,
    faAngleDoubleLeft,
    faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core';

library.add(
    faSync,
    faHome,
    faChalkboardTeacher,
    faArrowLeft,
    faArrowRight,
    faCalendarAlt,
    faAngleDoubleLeft,
    faAngleDoubleRight
);

function App() {
    const [user, setUser] = useState();
    const [instructors, setInstructors] = useState();
    const [currentInstructor, setCurrentInstructor] = useState();
    const [availability, setAvailability] = useState();
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [userType, setUserType] = useState();
    let location = useLocation();

    // useEffect(() => {
    //     // if(user === null){
    //     //     localStorage.removeItem('user')
    //     // }
    //     if(localStorage.getItem('user')){
    //         setUser(JSON.parse(localStorage.getItem('user')))
    //     }
    // }, [user]);

    // useEffect(() => {
    //     if(localStorage.getItem('user')) setUser(localStorage.getItem('user'));
    // }, [])

    return (
        <Wrapper flexDirection='row' w='100vw' h='100vh' justifyContent='flex-start' overflowX='hidden'>
            <InstructorContext.Provider value={{instructors, loading, refresh, setInstructors, setLoading, setRefresh}}>
                <CurrentInstructorContext.Provider value={{currentInstructor, availability, setCurrentInstructor, setAvailability}}>
                    <UserContext.Provider value={{user, userType, setUser, setUserType}}>
                    {location.pathname !== '/' &&
                        <Nav />
                    }
                        <Route exact path='/'>
                            <Home />
                        </Route>
                        <Switch>
                            <Route exact path='/student'>
                                <Student />
                            </Route>
                            <Route exact path='/staff'>
                                <Staff />
                            </Route>
                        </Switch>
                        <Switch>
                            <Route path='/(student|staff)/calendar/:instructorId?/:date?'>
                                {user ?
                                    <Calendar />
                                :
                                    <Redirect to={location.pathname.split('/')[1] === 'staff' ? '/staff' : '/student'} />
                                }
                            </Route>
                            <Route path='/(student|staff)/myschedule'>
                                {user ?
                                    <Schedule />
                                :
                                    <Redirect to={location.pathname.split('/')[1] === 'staff' ? '/staff' : '/student'} />
                                }
                            </Route>
                        </Switch>
                    </UserContext.Provider>
                </CurrentInstructorContext.Provider>
            </InstructorContext.Provider>
        </Wrapper>
    )
}

export default App;
