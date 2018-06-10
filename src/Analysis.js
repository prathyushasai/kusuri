import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Container, Grid, Navbar, Nav, NavItem, Jumbotron, Button } from 'react-bootstrap';
import axios from 'axios';

export class Analysis extends React.Component {
  handleSubmit(e) {
    var resp = {
      tdata: '',
      sentiment: 0,
      likelihood: 'Error in Processing Data'
    }

    this.state.success = true;
    e.preventDefault();

    axios.get('http://localhost:8080/getSign')
     .then(function(response){
       console.log(response);
   })
     .catch(function(error){
       console.log(error);
     });


     // this.props.history.push({
     //    pathname: '/analysis',
     //    state: {
     //        tdata: resp.tdata,
     //        sentiment: resp.sentiment,
     //        likelihood: resp.likelihood
     //    }
     // });
  }
  render() {
    console.log(this.props.location.state);
    return (
        <div className='row-fluid text-center'>
          <div className='col-sm-8 col-xs-8'>
            <h3>Your kid's Writing</h3>
            {this.props.location.state.tdata}
          </div>
          <div className='col-sm-4 col-xs-4'>
            <h4>Your Kid's Sentiment Score</h4>
              {this.props.location.state.sentiment}
            <h4>Likelihood of Depression</h4>
              {this.props.location.state.likelihood}
          </div>
          <form action="localhost:8080/getSign" method="get"
            className="text-center" onSubmit={this.handleSubmit}>
                <Button bsStyle="info" type="submit" id="uploadSubmitBtn">Get Help for Your Kid Now!</Button>
            </form>
        </div>

    );
  }
}

export default Analysis;