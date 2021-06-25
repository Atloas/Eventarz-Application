import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logoutAction, setFoundUsersAction, setMessageAction } from '../../redux/actions';
import EventParticipantList from '../user/EventParticipantList';
import Loading from '../common/Loading';
import { gatewayAddress } from "../../consts/addresses";

class FindUserView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {
    username: "",
    searched: false,
    loading: false,
    redirect: "",
    rules: {
      name: false
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
          default:
            message.text = "Something went wrong!";
            break;
        }
        this.props.setMessage(message);
        this.setState({ loading: false });
        throw Error(message.text);
      })
    }
    return response;
  }

  onChange(event) {
    this.setState({ username: event.target.value })
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
    fetch(gatewayAddress + "/admin/users?username=" + encodeURIComponent(this.state.username), {
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
        this.props.setFoundUsers(data);
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
    } else if (this.props.foundUsers.length || this.state.searched) {
      results = <EventParticipantList users={this.props.foundUsers} noUsersMessage="No Users found!" />
    }

    var buttonDisabled = !this.state.username;

    return (
      <div>
        <div className="headerPrompt">Find a User:</div>
        <form className="searchForm findUserForm" onSubmit={this.onSubmit}>
          <div className="searchNamePromptDiv">
            <label className="userSearchNamePrompt" htmlFor="userSearchNameField">Username: </label>
          </div>
          <div className="searchNameFieldDiv">
            <input className="userSearchNameField" id="userSearchNameField"
              name="username"
              type="text"
              placeholder="Username"
              maxLength="32"
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            />
          </div>
          <div className="searchNameRulesDiv">
            <div className={"rules" + (this.state.rules.name ? "" : " hidden")}>A username has to be at least 5 characters long and can contain only letters and numbers.</div>
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
  foundUsers: state.foundUsers
})

const mapDispatchToProps = dispatch => ({
  setFoundUsers: redirect => dispatch(setFoundUsersAction(redirect)),
  setMessage: message => dispatch(setMessageAction(message)),
  logout: () => dispatch(logoutAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(FindUserView);