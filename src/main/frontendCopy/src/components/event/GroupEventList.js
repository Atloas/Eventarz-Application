import React from 'react'
import GroupEvent from './GroupEvent';

class GroupEventList extends React.Component {

  render() {
    var eventObjects = [];
    if (this.props.events.length) {
      this.props.events.forEach(event => {
        eventObjects.push(<GroupEvent event={event} key={event.uuid}/>)
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

export default GroupEventList;