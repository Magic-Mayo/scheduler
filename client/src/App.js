import React, {useState, useEffect} from 'react';
import {Switch, Route, useLocation, Redirect} from 'react-router-dom';
import Student from './pages/Student';
import Admin from './pages/Admin';
import Home from './components/Home';
import Nav from './components/Nav';
import Calendar from './components/Calendar';
import {Wrapper} from './components/styledComponents';
import {UserContext, InstructorContext, CurrentInstructorContext} from './Context';

function App() {
    const [user, setUser] = useState();
    const [instructor, setInstructor] = useState([{id: 13786, name: 'Mike Mayo'}, {name: 'you', id: 2}]);
    const [currentInstructor, setCurrentInstructor] = useState();
    let location = useLocation();

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    // useEffect(() => {
    //     if(localStorage.getItem('user')) setUser(localStorage.getItem('user'));
    // }, [])

    return (
        <Wrapper flexDirection='row' w='100vw' h='100vh' justifyContent='flex-start'>
            <InstructorContext.Provider value={{instructor, setInstructor}}>
                <CurrentInstructorContext.Provider value={{currentInstructor, setCurrentInstructor}}>
                    <UserContext.Provider value={{user, setUser}}>
                    {location.pathname !== '/' &&
                        <Nav />
                    }
                        <Route exact path='/'>
                            <Home />
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
