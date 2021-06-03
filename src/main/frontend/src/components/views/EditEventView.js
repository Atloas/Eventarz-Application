import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setMessageAction } from '../../redux/actions';
import { DateTime } from 'luxon';
import { eventDateTimeStorageFormat, eventDateTimeInputFormat } from '../../scripts/dateFormats';
import Loading from '../common/Loading';

class EditEventView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.validateName = this.validateName.bind(this);
    this.validateDescription = this.validateDescription.bind(this);
    this.validateEventDate = this.validateEventDate.bind(this);
    this.validateMaxParticipants = this.validateMaxParticipants.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  state = {
    eventName: "",
    values: {
      name: "",
      description: "",
      maxParticipants: 1,
      eventDate: "",
    },
    validity: {
      name: true,
      description: true,
      maxParticipants: true,
      eventDate: true
    },
    rules: {
      name: false,
      description: false,
    },
    redirect: "",
    reloading: false
  }

  handleFetchErrors(response) {
    if (!response.ok) {
      return response.json().then(body => {
        var message = {
          type: "error",
          text: ""
        };
        switch (body.status) {
          case 400:
            message.text = body.message;
            break;
          // case 403:
          //   // TODO token expiration
          //   break;
          default:
            message.text = "Something went wrong!";
            break;
        }
        this.setState({ reloading: false });
        this.props.setMessage(message);
        throw Error(message.text);
      })
    }
    return response;
  }

  componentDidMount() {
    this.setState({
      eventName: this.props.eventDetails.name,
      values: {
        name: this.props.eventDetails.name,
        description: this.props.eventDetails.description,
        maxParticipants: this.props.eventDetails.maxParticipants,
        // Giving up on this ever displaying properly
        eventDate: DateTime.fromFormat(this.props.eventDetails.eventDate, eventDateTimeStorageFormat).toFormat(eventDateTimeInputFormat)
      }
    })
  }

  onFieldChange(event) {
    this.setState({
      values: { ...this.state.values, [event.target.name]: event.target.value },
    });
  }

  onFocus(event) {
    this.setState({ rules: { ...this.state.rules, [event.target.name]: true } });
  }

  onBlur(event) {
    this.setState({ rules: { ...this.state.rules, [event.target.name]: false } });
  }

  onSubmit(event) {
    event.preventDefault()

    var date = DateTime.fromISO(this.state.values.eventDate);
    var formattedDate = date.toFormat(eventDateTimeStorageFormat);

    this.setState({ reloading: true });
    // fetch("https://localhost:8083/gateway/events/" + this.props.eventDetails.uuid, {
    fetch("http://localhost:8070/events/" + this.props.eventDetails.uuid, {
    method: "PUT",
      headers: {
        'mode': 'cors',
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify({
        groupUuid: this.props.eventDetails.group.uuid,
        name: this.state.values.name,
        description: this.state.values.description,
        maxParticipants: this.state.values.maxParticipants,
        eventDate: formattedDate,
      })
    })
      .then(this.handleFetchErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({ redirect: "/event/" + data.uuid })
      })
      .catch(error => console.log(error));
  }

  onCancelClick(event) {
    this.setState({ redirect: '/event/' + this.props.eventDetails.uuid })
  }

  validate() {
    return this.state.validity.name && this.state.validity.description && this.state.validity.maxParticipants && this.state.validity.eventDate
  }

  validateName(event) {
    var name = this.state.values.name;
    var found = name.match(/[^a-zA-Z0-9\s\-\:\(\).,!?$&*'"]+/g);
    if (name.length < 5 || found != null) {
      this.setState({ validity: { ...this.state.validity, name: false } });
    }
    else {
      this.setState({ validity: { ...this.state.validity, name: true } });
    }
  }

  validateDescription(event) {
    var found = this.state.values.description.match(/[^a-zA-Z0-9\s\-\:\(\).,!?$&*'"]+/g);
    if (found != null) {
      this.setState({ validity: { ...this.state.validity, description: false } });
    }
    else {
      this.setState({ validity: { ...this.state.validity, description: true } });
    }
  }

  validateMaxParticipants(event) {
    var value = this.state.values.maxParticipants;
    if (value < 1 || value > 100) {
      this.setState({ validity: { ...this.state.validity, maxParticipants: false } });
    }
    else {
      this.setState({ validity: { ...this.state.validity, maxParticipants: true } });
    }
  }

  validateEventDate(event) {
    var eventDateString = this.state.values.eventDate;
    var eventDate = new Date(eventDateString);
    var currentDate = new Date();
    if (currentDate > eventDate) {
      this.setState({ validity: { ...this.state.validity, eventDate: false } });
    }
    else {
      this.setState({ validity: { ...this.state.validity, eventDate: true } });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />
    }
    if (!this.props.eventDetails) {
      return <Redirect push to="/" />
    }

    var content = null;
    var buttonDisabled = !this.validate();
    content = (
      <div>
        {this.state.reloading ?
          <Loading />
          :
          null
        }
        <div className="headerPrompt">Edit Event {this.state.eventName}:</div>
        <form onSubmit={this.onSubmit} className="editEventForm">
          <div className="editEventNamePromptDiv">
            <label className="editEventNamePrompt" htmlFor="editEventNameField">Name: </label>
          </div>
          <div className="editEventNameFieldDiv">
            <input className={"editEventNameField " + (!this.state.validity.name ? "invalidInput" : "")} id="editEventNameField"
              name="name"
              type="text"
              maxLength="64"
              value={this.state.values.name}
              onChange={this.onFieldChange}
              onFocus={this.onFocus}
              onBlur={(event) => { this.validateName(event); this.onBlur(event) }}
            />
          </div>
          <div className="editEventNameRulesDiv">
            <div className={"editEventNameRules rules" + (this.state.rules.name ? "" : " hidden")}>An event name has to be at least 5 characters long and can contain only letters, numbers, as well as a few select symbols.</div>
          </div>
          <div className="editEventDescriptionPromptDiv">
            <label className="editEventDescriptionPrompt" htmlFor="editEventDescriptionField">Description: </label>
          </div>
          <div className="editEventDescriptionFieldDiv">
            <textarea className={"editEventDescriptionField " + (!this.state.validity.description ? "invalidInput" : "")} id="editEventDescriptionField"
              name="description"
              cols="50"
              rows="5"
              maxLength="1024"
              value={this.state.values.description}
              onChange={this.onFieldChange}
              onFocus={this.onFocus}
              onBlur={(event) => { this.validateDescription(event); this.onBlur(event) }}>
            </textarea>
          </div>
          <div className="editEventDescriptionRulesDiv">
            <div className={"editEventDescriptionRules rules" + (this.state.rules.description ? "" : " hidden")}>An event description can only contain letters, numbers, as well as a few select symbols.</div>
          </div>
          <div className="editEventMaxParticipantsPromptDiv">
            <label className="editEventMaxParticipantsPrompt" htmlFor="editEventMaxParticipantsField">Max participants: </label>
          </div>
          <div className="editEventMaxParticipantsFieldDiv">
            <input className={"editEventMaxParticipantsField " + (!this.state.validity.maxParticipants ? "invalidInput" : "")} id="editEventMaxParticipantsField"
              name="maxParticipants"
              type="number"
              min="1"
              max="100"
              value={this.state.values.maxParticipants}
              onChange={this.onFieldChange}
              onBlur={this.validateMaxParticipants}
            />
          </div>
          <div className="editEventEventDatePromptDiv">
            <label className="editEventEventDatePrompt" htmlFor="editEventEventDateField">Date: </label>
          </div>
          <div className="editEventEventDateFieldDiv">
            <input className={"eventCreateEventDateField " + (!this.state.validity.eventDate ? "invalidInput" : "")} id="eventCreateEventDateField"
              name="eventDate"
              type="datetime-local"
              value={this.state.values.date}
              onChange={this.onFieldChange}
              onBlur={this.validateEventDate}
            />
          </div>
          <div className="editEventButtonDiv">
            <button type="submit" className="buttonNormal editEventSubmitButton" disabled={buttonDisabled}>Save</button>
            <button className="buttonNormal editEventCancelButton" onClick={this.onCancelClick}>Cancel</button>
          </div>
        </form>
      </div>
    )

    return content;
  }
}

const mapStateToProps = state => ({
  eventDetails: state.eventDetails
})

const mapDispatchToProps = dispatch => ({
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditEventView);