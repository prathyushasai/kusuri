import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Container, Grid, Navbar, Nav, NavItem, Jumbotron, Button } from 'react-bootstrap';

export class Analysis extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <Jumbotron>
          <h1>Worried about your kids' mental wellness?</h1>
          <h2>Analyze their homework</h2>
        </Jumbotron>
      </div>
    );
  }
}

export default Analysis;