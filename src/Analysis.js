import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Container, Grid, Navbar, Nav, NavItem, Jumbotron, Button } from 'react-bootstrap';
import axios from 'axios';

export class Analysis extends React.Component {
  handleSubmit(e) {
    e.preventDefault();

    axios.get('http://localhost:8080/getSign')
     .then(function(response){
       console.log(response);
   })
     .catch(function(error){
       console.log(error);
     });

    alert('This service is not completely accurate. Please speak with a certified doctor or psychologist before taking further steps.');

    // <Redirect to={"//success"}/>
  }
  render() {
    console.log(this.props.location.state);
    return (
      <div className='container-fluid'>
        <div className='row-fluid text-center analysis'>
          <div className='col-sm-6 col-xs-6'>
            <h3>Your Kid's Writing</h3>
            <div className='displayWindow'>{this.props.location.state.tdata}</div>
          </div>
          <div className='col-sm-6 col-xs-6'>
            <h4>Your Kid's Sentiment Score</h4>
            <div className='sentiment-score'>{this.props.location.state.sentiment}</div>
            <h4>Likelihood of Depression</h4>
            <div className='likelihood-hood'>{this.props.location.state.likelihood}</div>
          </div>
        </div>
        <div>
          <form action="localhost:8080/getSign" method="get"
              className="text-center" onSubmit={this.handleSubmit}>
              <br/><br/><br/>
                  <Button bsStyle="info" type="submit" id="uploadSubmitBtn">Get Help for Your Kid Now!</Button>
          </form>
        </div>
      </div>

    );
  }
}

export default Analysis;