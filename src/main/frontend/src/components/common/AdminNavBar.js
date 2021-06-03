import React from "react";
import { NavLink } from "react-router-dom";

class AdminNavBar extends React.Component {
  render() {
    return (
      <nav className="adminHeaderDiv">
        <NavLink to="/findGroup">Find Group</NavLink>
        <NavLink to="/findEvent">Find Event</NavLink>
        <NavLink to="/findUser">Find User</NavLink>
      </nav>
    );
  }
}

export default AdminNavBar;