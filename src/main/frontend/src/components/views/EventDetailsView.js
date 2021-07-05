import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import { setEventDetailsAction, clearEventDetailsAction, setMessageAction } from '../../redux/actions';
import { DateTime } from 'luxon';
import { eventDateTimeStorageFormat, eventDateTimeDisplayFormat } from '../../consts/dateFormats';
import EventParticipantList from '../user/EventParticipantList';
import Loading from '../common/Loading';
import { processEventData } from "../../scripts/eventDataUtils";

class EventDetailsView extends React.Component {
  constructor(props) {
    super(props)

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onAdminDeleteClick = this.onAdminDeleteClick.bind(this);
    this.onJoinClick = this.onJoinClick.bind(this);
    this.onLeaveClick = this.onLeaveClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.state = {
      loading: true,
      reloading: false,
      redirect: ""
    }
  }


  handleFetchErrors(response) {
    if (!response.ok) {
      return response.json().then(body => {
        var message = {
          type: "error",
          text: ""
        };
        switch (body.status) {
          case 401:
            message.text = body.message;
            this.props.logout();
            break;
          case 404:
            message.text = body.message;
            break;
          default:
            message.text = "Something went wrong!";
            break;
        }
        this.setState({ loading: false, reloading: false, redirect: "/" });
        this.props.setMessage(message);
        throw Error(message.text);
      })
    }
    return response;
  }

  componentDidMount() {
    var address = process.env.REACT_APP_GATEWAY_ADDRESS;
    if (this.props.currentUser.role === "ROLE_ADMIN") {
      address += "/admin/events/" + this.props.match.params.uuid;
    } else {
      address += "/events/" + this.props.match.params.uuid;
    }
    fetch(address, {
      headers: {
        'mode': 'cors',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
      .then(this.handleFetchErrors)
      .then(response => response.json())
      .then(data => {
        this.props.setEventDetails(processEventData(data, this.props.currentUser.username));
        this.setState({ loading: false });
      })
      .catch(error => console.log(error));
  }


  onJoinClick(event) {
    event.preventDefault();

    this.setState({ reloading: true });
    fetch(process.env.REACT_APP_GATEWAY_ADDRESS + "/events/" + this.props.eventDetails.uuid + '/participants', {
      method: 'POST',
      headers: {
        'mode': 'cors',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: this.props.currentUser.username
    })
      .then(this.handleFetchErrors)
      .then(response => response.json())
      .then(data => {
        this.props.setEventDetails(processEventData(data, this.props.currentUser.username));
        this.setState({ reloading: false });
      })
      .catch(error => console.log(error));
  }

  onLeaveClick(event) {
    event.preventDefault();

    this.setState({ reloading: true });
    fetch(process.env.REACT_APP_GATEWAY_ADDRESS + "/events/" + this.props.eventDetails.uuid + '/participants/' + this.props.currentUser.username, {
      method: 'DELETE',
      headers: {
        'mode': 'cors',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
      .then(this.handleFetchErrors)
      .then(response => response.json())
      .then(data => {
        this.props.setEventDetails(processEventData(data, this.props.currentUser.username));
        this.setState({ reloading: false });
      })
      .catch(error => console.log(error));
  }

  onEditClick(event) {
    event.preventDefault();

    this.setState({ redirect: "/editEvent" });
  }

  onDeleteClick(event) {
    event.preventDefault();

    this.setState({ reloading: true });
    fetch(process.env.REACT_APP_GATEWAY_ADDRESS + "/events/" + this.props.eventDetails.uuid, {
      method: 'DELETE',
      headers: {
        'mode': 'cors',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
      .then(this.handleFetchErrors)
      .then(() => {
        this.setState({ redirect: "/" });
        this.props.clearEventDetails();
      })
      .catch(error => console.log(error));
  }

  onAdminDeleteClick(event) {
    event.preventDefault();

    this.setState({ reloading: true });
    fetch(process.env.REACT_APP_GATEWAY_ADDRESS + "/admin/events/" + this.props.eventDetails.uuid, {
      method: 'DELETE',
      headers: {
        'mode': 'cors',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
      .then(this.handleFetchErrors)
      .then(() => {
        this.setState({ redirect: "/" });
        this.props.clearEventDetails();
      })
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />
    }

    var content = null;
    if (this.state.loading) {
      content = <Loading />;
    } else {
      var buttons = [];

      if (this.props.currentUser.role === "ROLE_USER") {
        if (!this.props.eventDetails.happened && this.props.eventDetails.allowed) {
          if (this.props.eventDetails.joined) {
            buttons.push(<button key="leaveButton" className="buttonNormal" onClick={this.onLeaveClick}>Leave</button>);
          } else {
            if (this.props.eventDetails.participants.length < this.props.eventDetails.maxParticipants) {
              buttons.push(<button key="joinButton" className="buttonNormal" onClick={this.onJoinClick}>Join</button>);
            }
          }
          if (this.props.eventDetails.organized) {
            buttons.push(<button key="editButton" className="buttonNormal" onClick={this.onEditClick}>Edit</button>);
            buttons.push(<button key="deleteButton" className="buttonDanger" onClick={this.onDeleteClick}>Delete</button>);
          }
        }
      } else if (this.props.currentUser.role === "ROLE_ADMIN") {
        buttons.push(<button key="adminDeleteButton" className="buttonDanger" onClick={this.onAdminDeleteClick}>Delete</button>);
      }
      content = (
        <div className="event">
          {this.state.reloading ?
            <Loading />
            :
            null
          }
          <div className="eventName">{this.props.eventDetails.name}</div>
          <div className="eventGroupDiv">
            <div className="eventGroupLabel">Group: </div>
            <NavLink className="eventGroup" to={"/group/" + this.props.eventDetails.group.uuid}>{this.props.eventDetails.group.name}</NavLink>
          </div>
          <div className="eventDescription">{this.props.eventDetails.description}</div>
          <div className="eventDateDiv">
            <div className="eventDateLabel">Date: </div>
            <div className="eventDate">{DateTime.fromFormat(this.props.eventDetails.eventDate, eventDateTimeStorageFormat).toFormat(eventDateTimeDisplayFormat)}</div>
          </div>
          <div className="eventPublishingDiv">
            <div className="eventOrganizerLabel">Organized by </div>
            <div className="eventOrganizer">{this.props.eventDetails.organizer.username}</div>
            <div className="eventPublishingDateLabel"> on </div>
            <div className="eventPublishingDate">{DateTime.fromFormat(this.props.eventDetails.publishedDate, eventDateTimeStorageFormat).toFormat(eventDateTimeDisplayFormat)}</div>
          </div>
          {this.props.eventDetails.happened ?
            <div className="eventHappenedDiv">
              Expired!
            </div>
            :
            <div className="eventButtonsDiv">
              {buttons}
            </div>
          }
          <div className="eventParticipantsDiv">
            <div className="eventParticipantsCountDiv">
              <div className="eventParticipantsLabel">Participants: </div>
              <div className="eventParticipantCount">{this.props.eventDetails.participants.length}</div>
              <div className="eventParticipantCountDelimiter">/</div>
              <div className="eventMaxParticipants">{this.props.eventDetails.maxParticipants}</div>
            </div>
            <EventParticipantList users={this.props.eventDetails.participants} />
          </div>
        </div>
      )
    }

    return content;
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  eventDetails: state.eventDetails
})

const mapDispatchToProps = dispatch => ({
  setEventDetails: eventDetails => dispatch(setEventDetailsAction(eventDetails)),
  clearEventDetails: () => dispatch(clearEventDetailsAction()),
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(EventDetailsView);