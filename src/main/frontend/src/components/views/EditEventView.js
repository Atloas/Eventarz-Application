import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setMessageAction } from '../../redux/actions';
import { DateTime } from 'luxon';
import { eventDateTimeStorageFormat, eventDateTimeInputFormat } from '../../consts/dateFormats';
import Loading from '../common/Loading';
import { gatewayAddress } from "../../consts/addresses";
import is from "is_js";

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
    this.state = {
      eventName: "",
      values: {
        name: "",
        description: "",
        maxParticipants: 1,
        eventDate: "",
        firefoxEventDate: "",
        firefoxEventTime: ""
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
      loading: false,
      firefox: is.firefox()
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
          case 400:
          case 404:
            message.text = body.message;
            break;
          case 401:
            message.text = body.message;
            this.props.logout();
            break;
          default:
            message.text = "Something went wrong!";
            break;
        }
        this.setState({ loading: false });
        this.props.setMessage(message);
        throw Error(message.text);
      })
    }
    return response;
  }

  componentDidMount() {
    if (!this.props.eventDetails) {
      this.setState({ redirect: "/" });
    } else {
      var eventDateString = DateTime.fromFormat(this.props.eventDetails.eventDate, eventDateTimeStorageFormat).toFormat(eventDateTimeInputFormat);
      var eventDate;
      if (this.state.firefox) {
        var strings = eventDateString.split("T");
        eventDate = {
          firefoxEventDate: strings[0],
          firefoxEventTime: strings[1]
        }
      } else {
        eventDate = { eventDate: eventDateString };
      }
      this.setState({
        eventName: this.props.eventDetails.name,
        values: {
          ...this.state.values,
          name: this.props.eventDetails.name,
          description: this.props.eventDetails.description,
          maxParticipants: this.props.eventDetails.maxParticipants,
          ...eventDate
        }
      })
    }
  }

  onFieldChange(event, validator) {
    if (this.state.firefox && (event.target.name === "firefoxEventDate" || event.target.name === "firefoxEventTime")) {
      var value;
      if (event.target.value === undefined) {
        value = "";
      } else {
        value = event.target.value;
      }
      this.setState(
        { values: { ...this.state.values, [event.target.name]: value } },
        validator
      );
    } else {
      this.setState(
        { values: { ...this.state.values, [event.target.name]: event.target.value } },
        validator
      );
    }
  }

  onFocus(event) {
    this.setState({ rules: { ...this.state.rules, [event.target.name]: true } });
  }

  onBlur(event) {
    this.setState({ rules: { ...this.state.rules, [event.target.name]: false } });
  }

  onSubmit(event) {
    event.preventDefault()

    var date;
    if (this.state.firefox) {
      date = DateTime.fromISO(this.state.values.firefoxEventDate + "T" + this.state.values.firefoxEventTime);
    } else {
      date = DateTime.fromISO(this.state.values.eventDate);
    }
    var formattedDate = date.toFormat(eventDateTimeStorageFormat);

    this.setState({ loading: true });
    fetch(gatewayAddress + "/events/" + this.props.eventDetails.uuid, {
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
        organizerUsername: this.props.currentUser.username
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

  validateName() {
    var name = this.state.values.name;
    var found = name.match(/[^a-zA-Z0-9\s\-\:\(\).,!?$&*'"]+/g);
    if (name.length < 5 || found != null) {
      this.setState({ validity: { ...this.state.validity, name: false } });
    }
    else {
      this.setState({ validity: { ...this.state.validity, name: true } });
    }
  }

  validateDescription() {
    var found = this.state.values.description.match(/[^a-zA-Z0-9\s\-\:\(\).,!?$&*'"]+/g);
    if (found != null) {
      this.setState({ validity: { ...this.state.validity, description: false } });
    }
    else {
      this.setState({ validity: { ...this.state.validity, description: true } });
    }
  }

  validateMaxParticipants() {
    var value = this.state.values.maxParticipants;
    if (value < 1 || value > 100) {
      this.setState({ validity: { ...this.state.validity, maxParticipants: false } });
    }
    else {
      this.setState({ validity: { ...this.state.validity, maxParticipants: true } });
    }
  }

  validateEventDate() {
    var eventDateString = "";
    if (this.state.firefox) {
      if (this.state.values.firefoxEventDate === "" || this.state.values.firefoxEventTime === "") {
        this.setState({ validity: { ...this.state.validity, eventDate: false } });
        return;
      } else {
        eventDateString = this.state.values.firefoxEventDate + "T" + this.state.values.firefoxEventTime;
      }
    } else {
      eventDateString = this.state.values.eventDate;
    }
    var eventDate = new Date(eventDateString);
    var currentDate = new Date();
    if (currentDate > eventDate) {
      this.setState({ validity: { ...this.state.validity, eventDate: false } });
    } else {
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
    var dateInput = null;
    if (this.state.firefox) {
      dateInput = (
        <div className="eventCreateEventDateFieldDiv">
          <input className={"eventCreateEventDateField " + (!this.state.validity.eventDate ? "invalidInput" : "")} id="eventCreateEventDateField"
            name="firefoxEventDate"
            type="date"
            value={this.state.values.firefoxEventDate}
            onChange={(event) => { this.onFieldChange(event, this.validateEventDate); }}
          />
          <input className={"eventCreateEventTimeField " + (!this.state.validity.eventDate ? "invalidInput" : "")} id="eventCreateEventDateField"
            name="firefoxEventTime"
            type="time"
            value={this.state.values.firefoxEventTime}
            onChange={(event) => { this.onFieldChange(event, this.validateEventDate); }}
          />
        </div>
      )
    } else {
      dateInput = (
        <div className="eventCreateEventDateFieldDiv">
          <input className={"eventCreateEventDateField " + (!this.state.validity.eventDate ? "invalidInput" : "")} id="eventCreateEventDateField"
            name="eventDate"
            type="datetime-local"
            value={this.state.values.eventDate}
            onChange={(event) => { this.onFieldChange(event, this.validateEventDate); }}
          />
        </div>
      )
    }
    content = (
      <div>
        {this.state.loading ?
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
              onChange={(event) => { this.onFieldChange(event, this.validateName); }}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
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
              onChange={(event) => { this.onFieldChange(event, this.validateDescription); }}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            >
            </textarea>
          </div>
          <div className="editEventDescriptionRulesDiv">
            <div className={"editEventDescriptionRules rules" + (this.state.rules.description ? "" : " hidden")}>An event description can only contain letters, numbers, as well as a few select symbols.</div>
          </div>
          <div className="editEventMaxParticipantsWarningPromptDiv">
            Warning:
          </div>
          <div className="editEventMaxParticipantsWarningTextDiv">
            Lowering the maximum participants number will remove all participants from this event!
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
              onChange={(event) => { this.onFieldChange(event, this.validateMaxParticipants); }}
            />
          </div>
          <div className="editEventEventDatePromptDiv">
            <label className="editEventEventDatePrompt" htmlFor="editEventEventDateField">Date: </label>
          </div>
          {dateInput}
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
  eventDetails: state.eventDetails,
  currentUser: state.currentUser
})

const mapDispatchToProps = dispatch => ({
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditEventView);