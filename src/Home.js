import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Container, Grid, Navbar, Nav, NavItem, Jumbotron, Button } from 'react-bootstrap';

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
    alert('submit' + this.state.value);
    // fetch('send the data', { with: 'some options' })
    //   .then(res => res.json())
    //   .then(jsonRes => {
    //     const { success } = jsonRes;
    //     this.setState({ success });
    //   })
    //   .catch(err => console.log(err))

    this.state.success = true;
    //this.props.history.push('/analysis');
  }
  render() {
    if (!this.state.success) {
        return (
          <div className="jumbotron landing">
            <h2>Worried about your kids mental wellness?</h2>
            <br/>
            <h3>Analyze their homework!</h3>
            <br/>
            <h4>Using Machine Learning and Natural Language Processing</h4>
            <br/>
            <h3>Better understand your children now!</h3>
            <br/><br/><br/>
            <form action="uploadFile" method="get" encType="multipart/form-data"
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