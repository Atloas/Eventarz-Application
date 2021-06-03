import React from "react";
import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom';
import { logoutAction } from '../../redux/actions';


class Logout extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  state = {
    redirect: ""
  }

  componentDidUpdate() {
    if (this.state.redirect) {
      this.setState({ redirect: "" });
    }
  }

  logout(event) {
    event.preventDefault();

    localStorage.removeItem("token");
    this.props.logoutUser();
    this.setState({ redirect: "/" });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    var content = null;
    if (this.props.currentUser) {
      content = (
        <div className="usernameLogoutDiv">
          <div>{this.props.currentUser.username}</div>
          <button className="buttonNormal" onClick={this.logout}>Logout</button>
        </div>
      )
    }

    return content;
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
