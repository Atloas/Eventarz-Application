import React from 'react'
import EventHome from './EventHome';

class EventHomeList extends React.Component {

  render() {
    var eventObjects = [];
    if (this.props.events.length) {
      this.props.events.forEach(event => {
        eventObjects.push(<EventHome event={event} key={event.uuid} />)
      });
    }

    return (
      <div className="eventListDiv">
        {eventObjects}
      </div>
    )
  }
}

export default EventHomeList;