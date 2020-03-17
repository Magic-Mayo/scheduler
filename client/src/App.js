import React, {useState, useEffect} from 'react';
import {Switch, Route, useLocation, Redirect} from 'react-router-dom';
import Student from './pages/Student';
import Admin from './pages/Admin';
import Home from './components/Home';
import Nav from './components/Nav';
import Calendar from './components/Calendar';
import {Wrapper} from './components/styledComponents';
import {UserContext, InstructorContext, CurrentInstructorContext} from './Context';
import {faSync, faHome, faChalkboardTeacher, faArrowLeft, faArrowRight, faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core';

library.add(faSync, faHome, faChalkboardTeacher, faArrowLeft, faArrowRight, faCalendarAlt);

function App() {
    const [user, setUser] = useState();
    const [instructor, setInstructor] = useState();
    const [currentInstructor, setCurrentInstructor] = useState();
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
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
        <Wrapper flexDirection='row' w='100vw' h='100vh' justifyContent='flex-start'>
            <InstructorContext.Provider value={{instructor, loading, refresh, setInstructor, setLoading, setRefresh}}>
                <CurrentInstructorContext.Provider value={{currentInstructor, setCurrentInstructor}}>
                    <UserContext.Provider value={{user, setUser}}>
                    {location.pathname !== '/' &&
                        <Nav />
                    }
                        <Route exact path='/'>
                            <Redirect to='/student' />
                            {/* <Home /> */}
                        </Route>
                        <Switch>
                            <Route path='/admin'>
                                <Admin />
                            </Route>
                            <Route exact path='/student'>
                                <Student />
                            </Route>
                        </Switch>
                            <Route path='/student/calendar/:instructorId?/:date?'>
                                {user ?
                                    <Calendar />
                                    :
                                    <Redirect to='/student' />
                                }
                            </Route>
                    </UserContext.Provider>
                </CurrentInstructorContext.Provider>
            </InstructorContext.Provider>
        </Wrapper>
    )
}

export default App;
