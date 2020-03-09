import React, {useState} from 'react';
import {Switch, Route, useLocation, Redirect} from 'react-router-dom';
import Student from './pages/Student';
import Admin from './pages/Admin';
import Home from './components/Home';
import Nav from './components/Nav';
import Calendar from './components/Calendar';
import {Wrapper} from './components/styledComponents';
import {UserContext} from './UserContext';

function App() {
    const [user, setUser] = useState();
    let location = useLocation();

    return (
        <Wrapper flexDirection='row' Width='100vw' Height='100vh' justifyContent='flex-start'>
            {location.pathname !== '/' &&
                <Nav />
            }
            <UserContext.Provider value={{user, setUser}}>
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
                <Route exact path='/student/calendar/'>
                    {user ?
                        <Calendar />
                    :
                        <Redirect to='/student' />
                    }
                </Route>
            </UserContext.Provider>
        </Wrapper>
    )
}

export default App;
