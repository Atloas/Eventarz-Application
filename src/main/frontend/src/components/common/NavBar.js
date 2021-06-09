import React from "react";
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class NavBar extends React.Component {

  render() {
    var bar = null;
    if (this.props.currentUser) {
      if (this.props.currentUser.role === "USER") {
        bar = (
          <nav className="navBar">
            <NavLink to="/">Home</NavLink>
            <div className="dropdown">
              <div>Groups</div>
              <ul className="dropdown-content">
                <li><NavLink to="/myGroups">My Groups</NavLink></li>
                <li><NavLink to="/createGroup">Create Group</NavLink></li>
                <li><NavLink to="/findGroup">Find Group</NavLink></li>
              </ul>
            </div>
            <div className="dropdown">
              <div>Events</div>
              <ul className="dropdown-content">
                <li><NavLink to="/myEvents">My Events</NavLink></li>
                <li><NavLink to="/createEvent">Create Event</NavLink></li>
              </ul>
            </div>
            <NavLink to={"/user/" + this.props.currentUser.username}>Profile</NavLink>
          </nav>
        )
      } else if (this.props.currentUser.role === "ADMIN") {
        bar = (
          <nav className="navBar">
            <NavLink to="/findGroup">Find Group</NavLink>
            <NavLink to="/findEvent">Find Event</NavLink>
            <NavLink to="/findUser">Find User</NavLink>
          </nav>
        )
      }
    }
    return bar;
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

export default connect(mapStateToProps, null)(NavBar)