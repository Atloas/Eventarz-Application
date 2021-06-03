import React from 'react'
import { NavLink } from 'react-router-dom';

class UserEvent extends React.Component {

  render() {
    return (
      <div className="eventHome">
        <div className="eventLabel">Event</div>
        <div className="eventNameDiv">
          <NavLink className="eventName" to={'/event/' + this.props.event.uuid}>{this.props.event.name}</NavLink>
        </div>
      </div>
    )
  }
}

export default UserEvent;