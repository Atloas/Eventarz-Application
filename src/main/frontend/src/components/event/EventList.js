import React from 'react'
import EventHome from './EventShort';

class EventList extends React.Component {

  render() {
    var eventObjects = [];
    if (this.props.events.length) {
      this.props.events.forEach(event => {
        eventObjects.push(<EventHome event={event} key={event.uuid}/>)
      });
    }

    return (
      <div className="eventListDiv">
        {eventObjects.length ?
          eventObjects
          :
          <div className="noEventsText">{this.props.noEventsMessage}</div>}
      </div>
    )
  }
}

export default EventList;