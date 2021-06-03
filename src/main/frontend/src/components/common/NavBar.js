import React from "react"
import { connect } from 'react-redux'
import UserNavBar from "./UserNavBar"
import AdminNavBar from "./AdminNavBar"

class NavBar extends React.Component {

  render() {
    var bar = null;
    if (this.props.currentUser) {
      if (this.props.currentUser.roles.includes("USER")) {
        bar = <UserNavBar />;
      } else if (this.props.currentUser.roles.includes("ADMIN")) {
        bar = <AdminNavBar />;
      }
    }
    return bar;
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

export default connect(mapStateToProps, null)(NavBar)