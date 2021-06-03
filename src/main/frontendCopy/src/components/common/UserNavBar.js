import React from "react";
import { NavLink } from "react-router-dom";

class UserNavBar extends React.Component {
  render() {
    return (
      <nav className="userHeaderDiv">
        <NavLink to="/myGroups">My Groups</NavLink>
        <NavLink to="/createGroup">Create Group</NavLink>
        <NavLink to="/findGroup">Find Group</NavLink>
        <NavLink to="/myEvents">My Events</NavLink>
        <NavLink to="/createEvent">Create Event</NavLink>
      </nav>
    );
  }
}

export default UserNavBar;