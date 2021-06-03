import React from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

class LoginStateRedirect extends React.Component {
  render() {
    var loggedIn = this.props.currentUser !== null;
    if (loggedIn) {
      return <Redirect to="/" />;
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

export default connect(mapStateToProps, null)(LoginStateRedirect);