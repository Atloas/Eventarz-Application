import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setMessageAction } from '../../redux/actions';
import { DateTime } from 'luxon';
import { eventDateTimeStorageFormat } from '../../scripts/dateFormats';
import Loading from '../common/Loading';

class CreateEventView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
    this.onDropdownSelected = this.onDropdownSelected.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.validateName = this.validateName.bind(this);
    this.validateDescription = this.validateDescription.bind(this);
    this.validateEventDate = this.validateEventDate.bind(this);
    this.validateMaxParticipants = this.validateMaxParticipants.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  state = {
    groups: [],
    values: {
      groupUuid: "",
      name: "",
      description: "",
      maxParticipants: 1,
      eventDate: "",
      participate: false,
    },
    validity: {
      name: false,
      description: true,
      maxParticipants: true,
      eventDate: false
    },
    touched: {
      name: false,
      description: false,
      maxParticipants: false,
      eventDate: false
    },
    rules: {
      name: false,
      description: false,
    },
    loading: true,
    redirect: ""
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
    fetch("https://localhost:8083/gateway/groups", {
      headers: {
        'mode': 'cors',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
      .then(this.handleFetchErrors)
      .then(response => response.json())
      .then(data => {
        if (data.length) {
          this.setState({
            groups: data,
            values: {
              ...this.state.values,
              groupUuid: data[0].uuid
            },
            loading: false
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch(error => console.log(error));
  }

  createGroupOptions() {
    var options = [];
    this.state.groups.forEach(group => {
      options.push(<option key={group.uuid} value={group.uuid}>{group.name}</option>)
    });
    return options;
  }

  onDropdownSelected(event) {
    this.setState({ values: { ...this.state.values, groupUuid: event.target.value } });
  }

  onFieldChange(event) {
    this.setState({
      values: { ...this.state.values, [event.target.name]: event.target.value },
      touched: { ...this.state.touched, [event.target.name]: true }
    });
  }

  onCheckboxChange(event) {
    this.setState({ values: { ...this.state.values, participate: event.target.checked } });
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
    fetch("https://localhost:8083/gateway/events", {
      method: "POST",
      headers: {
        'mode': 'cors',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify({
        groupUuid: this.state.values.groupUuid,
        name: this.state.values.name,
        description: this.state.values.description,
        maxParticipants: this.state.values.maxParticipants,
        eventDate: formattedDate,
        participate: this.state.values.participate,
      })
    })
      .then(this.handleFetchErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({ redirect: "/event/" + data.uuid });
      })
      .catch(error => console.log(error));
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

    var content = null;
    if (this.state.loading) {
      content = <Loading />;
    } else if (this.state.groups.length === 0) {
      content = (
        <div>You need to join a group before you can create an Event!</div>
      )
    } else {
      var buttonDisabled = !this.validate();
      if (this.state.groups) {
        content = (
          <div>
            {this.state.reloading ?
              <Loading />
              :
              null
            }
            <div className="headerPrompt">Create an Event:</div>
            <form onSubmit={this.onSubmit} className="createEventForm">
              <div className="eventCreateGroupSelectPromptDiv">
                <label className="eventCreateGroupSelectPrompt" htmlFor="eventCreateGroupSelectField">Group: </label>
              </div>
              <div className="eventCreateGroupSelectFieldDiv">
                <select className="eventCreateGroupSelectField" id="eventCreateGroupSelectField"
                  value={this.state.values.groupUuid}
                  onChange={this.onDropdownSelected}
                >
                  {this.createGroupOptions()}
                </select>
              </div>
              <div className="eventCreateNamePromptDiv">
                <label className="eventCreateNamePrompt" htmlFor="eventCreateNameField">Name: </label>
              </div>
              <div className="eventCreateNameFieldDiv">
                <input className={"eventCreateNameField " + (this.state.touched.name && !this.state.validity.name ? "invalidInput" : "")} id="eventCreateNameField"
                  name="name"
                  type="text"
                  placeholder="Name"
                  maxLength="64"
                  value={this.state.values.name}
                  onChange={this.onFieldChange}
                  onFocus={this.onFocus}
                  onBlur={(event) => { this.validateName(event); this.onBlur(event) }}
                />
              </div>
              <div className="eventCreateNameRulesDiv">
                <div className={"eventCreateNameRules rules" + (this.state.rules.name ? "" : " hidden")}>An event name has to be at least 5 characters long and can contain only letters, numbers, as well as a few select symbols.</div>
              </div>
              <div className="eventCreateDescriptionPromptDiv">
                <label className="eventCreateDescriptionPrompt" htmlFor="eventCreateDescriptionField">Description: </label>
              </div>
              <div className="eventCreateDescriptionFieldDiv">
                <textarea className={"eventCreateDescriptionField " + (this.state.touched.description && !this.state.validity.description ? "invalidInput" : "")} id="eventCreateDescriptionField"
                  name="description"
                  cols="50"
                  rows="5"
                  maxLength="1024"
                  placeholder="Descritpion"
                  value={this.state.values.description}
                  onChange={this.onFieldChange}
                  onFocus={this.onFocus}
                  onBlur={(event) => { this.validateDescription(event); this.onBlur(event) }}>
                </textarea>
              </div>
              <div className="eventCreateDescriptionRulesDiv">
                <div className={"eventCreateDescriptionRules rules" + (this.state.rules.description ? "" : " hidden")}>An event description can only contain letters, numbers, as well as a few select symbols.</div>
              </div>
              <div className="eventCreateMaxParticipantsPromptDiv">
                <label className="eventCreateMaxParticipantsPrompt" htmlFor="eventCreateMaxParticipantsField">Max participants: </label>
              </div>
              <div className="eventCreateMaxParticipantsFieldDiv">
                <input className={"eventCreateMaxParticipantsField " + (this.state.touched.maxParticipants && !this.state.validity.maxParticipants ? "invalidInput" : "")} id="eventCreateMaxParticipantsField"
                  name="maxParticipants"
                  type="number"
                  min="1"
                  max="100"
                  value={this.state.values.maxParticipants}
                  onChange={this.onFieldChange}
                  onBlur={this.validateMaxParticipants}
                />
              </div>
              <div className="eventCreateEventDatePromptDiv">
                <label className="eventCreateEventDatePrompt" htmlFor="eventCreateEventDateField">Date: </label>
              </div>
              <div className="eventCreateEventDateFieldDiv">
                <input className={"eventCreateEventDateField " + (this.state.touched.eventDate && !this.state.validity.eventDate ? "invalidInput" : "")} id="eventCreateEventDateField"
                  name="eventDate"
                  type="datetime-local"
                  value={this.state.values.date}
                  onChange={this.onFieldChange}
                  onBlur={this.validateEventDate}
                />
              </div>
              <div className="eventCreateParticipateDiv">
                <label htmlFor="eventCreateParticipateField">Participate? </label>
                <input className="eventCreateParticipateField" id="eventCreateParticipateField"
                  name="participate"
                  type="checkbox"
                  checked={this.state.values.participate}
                  onChange={this.onCheckboxChange}
                />
              </div>
              <div className="createEventSubmitButtonDiv">
                <button type="submit" className="buttonNormal createEventSubmitButton" disabled={buttonDisabled}>Create</button>
              </div>
            </form>
          </div>
        )
      } else {
        content = (
          <div>To create an event you must first join a group!</div>
        );
      }
    }

    return content;
  }
}

const mapDispatchToProps = dispatch => ({
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(null, mapDispatchToProps)(CreateEventView);