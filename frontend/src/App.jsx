import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
// Pages
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import Register from './pages/register'
import Quiz from './pages/quiz'
import Question from './pages/question'

function App () {
  return (
    <BrowserRouter>
      <div className = "App">
        <Switch>
          <Route exact path = "/">
            <Login />
          </Route>
          <Route exact path = "/dashboard">
            <Dashboard />
          </Route>
          <Route exact path = "/quiz/:id">
            <Quiz />
          </Route>
          <Route exact path = "/quiz/:id/:qid">
            <Question />
          </Route>
          <Route exact path = "/register">
            <Register />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
