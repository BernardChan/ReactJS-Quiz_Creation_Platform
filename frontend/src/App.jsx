import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
// Pages
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import Register from './pages/register'

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
          <Route exact path = "/register">
            <Register />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
