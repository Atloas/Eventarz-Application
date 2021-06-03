import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setFoundEventsAction, setMessageAction } from '../../redux/actions';
import EventList from '../event/EventList';
import Loading from '../common/Loading';

class FindEventView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {
    name: "",
    searched: false,
    loading: false,
    redirect: "",
    rules: {
      name: false
    }
  }

  handleFetchErrors(response) {
    if (!response.ok) {
      var message = {
        type: "error",
        text: "Something went wrong!"
      };
      this.props.setMessage(message);
      throw Error(message.text);
    }
    return response;
  }

  onChange(event) {
    this.setState({ name: event.target.value })
  }

  onFocus(event) {
    this.setState({ rules: { [event.target.name]: true } })
  }

  onBlur(event) {
    this.setState({ rules: { [event.target.name]: false } })
  }

  onSubmit(event) {
    event.preventDefault()

    this.setState({ loading: true, searched: true })
    fetch("https://localhost:8083/gateway/admin/events?name=" + encodeURIComponent(this.state.name), {
      method: "GET",
      headers: {
        'mode': 'cors',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
      .then(this.handleFetchErrors)
      .then(response => response.json())
      .then(data => {
        this.props.setFoundEvents(data);
        this.setState({ loading: false })
      })
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />
    }

    var results = null;
    if (this.state.loading) {
      results = <Loading />;
    } else if (this.props.foundEvents.length || this.state.searched) {
      results = <EventList events={this.props.foundEvents} noEventsMessage="No Events found!" />
    }

    var buttonDisabled = !this.state.name;

    return (
      <div>
        <div className="headerPrompt">Find an Event:</div>
        <form className="searchForm findEventForm" onSubmit={this.onSubmit}>
          <div className="searchNamePromptDiv">
            <label className="eventSearchNamePrompt" htmlFor="eventSearchNameField">Name: </label>
          </div>
          <div className="searchNameFieldDiv">
            <input className="eventSearchNameField" id="eventSearchNameField"
              name="name"
              type="text"
              placeholder="Name"
              maxLength="64"
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            />
          </div>
          <div className="searchNameRulesDiv">
            <div className={"rules" + (this.state.rules.name ? "" : " hidden")}>An event name has to be at least 5 characters long and can contain only letters, numbers, as well as a few select symbols.</div>
          </div>
          <div className="searchSubmitButtonDiv">
            <button type="submit" className="buttonNormal submitButton" disabled={buttonDisabled}>Search</button>
          </div>
        </form>
        {results}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  foundEvents: state.foundEvents
})

const mapDispatchToProps = dispatch => ({
  setFoundEvents: redirect => dispatch(setFoundEventsAction(redirect)),
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(FindEventView);