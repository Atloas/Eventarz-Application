import React from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

class LoginStateRedirect extends React.Component {
  render() {
    var loggedIn = this.props.currentUser !== null;
    var redirect;
    if (loggedIn) {
      // Logged in, from /login and /register to /
      redirect = <Redirect from={/\/(login|register)/g} to="/" />;
    } else {
      // TODO: Neither regex works here. Does Redirect not work with regex??
      // Not logged in, from anything other than /login and /register to /login
      redirect = <Redirect from={/\/(?!(login|register))/g} to="/login" />;
    }

    return redirect;
  }
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, null)(LoginStateRedirect);