import React from "react";
import { NavLink } from "react-router-dom"
import NavBar from "./NavBar";
import Logout from "./Logout";

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="titleLogoutDiv">
          <div className="titleDiv">
            <NavLink to="/">EVENTARZ</NavLink>
          </div>
          <Logout />
        </div>
        <div className="navDiv">
          <NavBar />
        </div>
      </div>
    );
  }
}

export default Header;