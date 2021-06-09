import React from 'react'
import { NavLink } from 'react-router-dom';
import { DateTime } from 'luxon';
import { eventDateTimeStorageFormat, eventDateTimeDisplayFormat } from '../../consts/dateFormats';

class EventHome extends React.Component {

  render() {
    return (
      <div className="eventHome">
        <div className="eventNameDiv">
          <NavLink className="eventName" to={'/event/' + this.props.event.uuid}>{this.props.event.name}</NavLink>
        </div>
        <div className="eventDescription">{this.props.event.description}</div>
        {this.props.event.happened ?
          <div className="eventHappenedDiv">
            Expired!
          </div>
          :
          <div className="eventDateDiv">
            <div className="eventDateLabel">Date: </div>
            <div className="eventDate">{DateTime.fromFormat(this.props.event.eventDate, eventDateTimeStorageFormat).toFormat(eventDateTimeDisplayFormat)}</div>
          </div>
        }
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