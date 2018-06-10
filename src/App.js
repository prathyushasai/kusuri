import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Grid, Navbar, Nav, NavItem, Jumbotron, Button } from 'react-bootstrap';

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

const Home = () => (
  <div className="jumbotron landing">
    <h2>Worried about your kids mental wellness?</h2>
    <br/>
    <h3>Analyze their homework!</h3>
    <br/>
    <h4>Using Machine Learning and Natural Language Processing</h4>
    <br/>
    <h3>Better understand your children now!</h3>
    <br/><br/><br/>
    <form action="uploadFile" method="post" encType="multipart/form-data" className="text-center">
      <input type="file" name="uploadedFile" className="inputfile"/>
      <br/>
      <Button bsStyle="info" type="submit" id="uploadSubmitBtn">Upload File</Button>
    </form>
  </div>
);

const Analysis = () => (
  <div className="container-fluid">
    <Jumbotron>
      <h1>Worried about your kids' mental wellness?</h1>
      <h2>Analyze their homework</h2>
    </Jumbotron>
  </div>
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


