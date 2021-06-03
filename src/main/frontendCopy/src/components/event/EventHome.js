import React from 'react'
import { NavLink } from 'react-router-dom';
import { DateTime } from 'luxon';
import { eventDateTimeStorageFormat, eventDateTimeDisplayFormat } from '../../scripts/dateFormats';

class EventHome extends React.Component {

  render() {
    return (
      <div className="eventHome">
        <div className="eventLabel">Event</div>
        <div className="eventNameDiv">
          <NavLink className="eventName" to={'/event/' + this.props.event.uuid}>{this.props.event.name}</NavLink>
        </div>
        <div className="eventGroupDiv">
          <div className="eventGroupLabel">Group: </div>
          <NavLink className="eventGroup" to={"/group/" + this.props.event.group.uuid}>{this.props.event.group.name}</NavLink>
        </div>
        <div className="eventDescription">{this.props.event.description}</div>
        <div className="eventDateDiv">
          <div className="eventDateLabel">Date: </div>
          <div className="eventDate">{DateTime.fromFormat(this.props.event.eventDate, eventDateTimeStorageFormat).toFormat(eventDateTimeDisplayFormat)}</div>
        </div>
        <div className="eventParticipantsCountDiv">
          <div className="eventParticipantsLabel">Participants: </div>
          <div className="eventParticipantCount">{this.props.event.participantCount}</div>
          <div className="eventParticipantCountDelimiter">/</div>
          <div className="eventMaxParticipants">{this.props.event.maxParticipants}</div>
        </div>
      </div>
    )
  }
}

export default EventHome;