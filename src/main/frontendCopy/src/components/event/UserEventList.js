import React from 'react'
import UserEvent from './UserEvent';

class UserEventList extends React.Component {

  render() {
    var eventObjects = [];
    if (this.props.events.length) {
      this.props.events.forEach(event => {
        eventObjects.push(<UserEvent event={event} key={event.uuid} />)
      });
    }

    return (
      <div className="eventListDiv">
        {eventObjects}
      </div>
    )
  }
}

export default UserEventList;