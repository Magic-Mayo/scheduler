import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.scss';
import Student from './pages/Student';
import Admin from './pages/Admin';
import Home from './components/Home';

function App() {

    return (
        <Router>
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
        </Router>
    )
}

export default App;
