import React from 'react';
import {Switch, Route, useLocation} from 'react-router-dom';
import Student from './pages/Student';
import Admin from './pages/Admin';
import Home from './components/Home';
import Nav from './components/Nav';
import {Wrapper} from './components/styledComponents';

function App() {
    let location = useLocation();
    console.log(location)
    return (
        <Wrapper flexDirection='row' Width='100vw' Height='100vh' justifyContent='flex-start'>
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
                <Route path='/student'>
                    <Student />
                </Route>
            </Switch>
        </Wrapper>
    )
}

export default App;
