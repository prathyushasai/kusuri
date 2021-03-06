import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Container, Grid, Navbar, Nav, NavItem, Jumbotron, Button } from 'react-bootstrap';
import axios from 'axios';

export class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      success: false,
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }
  handleSubmit(e) {
    var resp = {
<<<<<<< HEAD
      tdata: "I am sad.",
      sentiment: -1,
      likelihood: 'High. Read more info here: https://www.healthline.com/health/depression/risk-factors'
=======
      tdata: "I am sad",
      sentiment: -0.4,
      likelihood: 'Low. Read more info here: https://www.healthline.com/health/depression/risk-factors'
>>>>>>> d7a01ac13c9089fa51bb32e789d81b2905be2908
    }

    this.state.success = true;
    e.preventDefault();

    axios.get('http://localhost:8080/uploadFile', {
      params: {
        uploadedFile: this.state.value
      }
    })
     .then(function(response){
       console.log(response);
       resp.tdata = response.tdata;
        resp.sentiment = response.sentiment;
        resp.likelihood = response.likelihood;
   })
     .catch(function(error){
       console.log(error);
     });


     this.props.history.push({
        pathname: '/analysis',
        state: {
            tdata: resp.tdata,
            sentiment: resp.sentiment,
            likelihood: resp.likelihood
        }
     });
  }

  render() {
    if (!this.state.success) {
        return (
          <div className="jumbotron landing">
            <h2>Worried about your kids' mental wellness?</h2>
            <br/><br/><br/>
            <h4>Using Machine Learning and Natural Language Processing</h4>
            <h4>Analyze your kids' sentiment behind their words</h4>
            <br/>
            <h3>Better understand your kids now!</h3>
            <br/><br/>
            <form action="localhost:8080/uploadFile" method="get" encType="multipart/form-data"
              className="text-center" onSubmit={this.handleSubmit}>
              <input type="file" name="uploadedFile" value={this.state.value}
                className="inputfile" onChange={this.handleChange}/>
              <br/>
              <Button bsStyle="info" type="submit" id="uploadSubmitBtn">Upload File</Button>
            </form>
          </div>
        );
    } return (
      <div className="container-fluid">
        <Jumbotron>
          <h1>Worried about your kids' mental wellness?</h1>
          <h2>Analyze their homework</h2>
        </Jumbotron>
      </div>
    );
  }
}

export default Home;