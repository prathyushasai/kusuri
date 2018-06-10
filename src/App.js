import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Container, Grid, Navbar, Nav, NavItem, Jumbotron, Button } from 'react-bootstrap';
import { Analysis } from "./Analysis.js";
import { Home } from "./Home.js";

const App = () => (
  <Router>
    <div className="container-fluid">
    <br />
      <div className='row-fluid text-center'>
        <div className='col-sm-4 col-xs-4'><Link to="/">Home</Link></div>
        <div className='col-sm-4 col-xs-4'><Link to="/analysis">Analysis</Link></div>
        <div className='col-sm-4 col-xs-4'><Link to="/permission">Permission</Link></div>
      </div>

      <br /><br />
      <Route exact path="/" component={Home} />
      <Route path="/analysis" component={Analysis} />
      <Route path="/permission" component={Permission} />
    </div>
  </Router>
);

const Permission = ({ match }) => (
  <div>
    <h2>Permission</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>Rendering with React</Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic} />
    <Route
      exact
      path={match.url}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

export default App;


