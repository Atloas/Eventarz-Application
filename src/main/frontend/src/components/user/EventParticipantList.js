import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

class EventParticipantList extends React.Component {

  render() {

    var userElements = [];
    if (this.props.currentUser.roles.includes("ADMIN")) {
      this.props.users.forEach(user => {
        userElements.push(<li className="username" key={user.username}><NavLink to={'/user/' + user.username}>{user.username}</NavLink></li>)
      });
    } else {
      this.props.users.forEach(user => {
        userElements.push(<li className="username" key={user.username}>{user.username}</li>)
      });
    }

    return (
      <div className="userListDiv">
        <ul className="userList">
          {userElements.length ?
            userElements
            :
            null
          }
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

export default connect(mapStateToProps, null)(EventParticipantList);