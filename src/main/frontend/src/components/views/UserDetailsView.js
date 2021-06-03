import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setMessageAction } from '../../redux/actions';
import UserEventList from "../event/UserEventList";
import UserGroupList from "../group/UserGroupList";
import Loading from '../common/Loading';

class UserDetailsView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
    this.onBanClick = this.onBanClick.bind(this);
    this.onUnbanClick = this.onUnbanClick.bind(this);
  }

  state = {
    user: null,
    loading: true,
    reloading: false,
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
          // case 403:
          //   // TODO token expiration
          //   break;
          case 404:
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
    fetch("https://localhost:8083/gateway/admin/users/" + this.props.match.params.username, {
      headers: {
        'mode': 'cors',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
      .then(this.handleFetchErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({ loading: false, user: data });
      })
      .catch(error => console.log(error));
  }

  onBanClick(event) {
    event.preventDefault();

    this.setState({ reloading: true });
    fetch("https://localhost:8083/gateway/admin/users/" + this.state.user.username + '/banned', {
      method: 'PUT',
      headers: {
        'mode': 'cors',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify({ banned: true })
    })
      .then(this.handleFetchErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({ reloading: false, user: data });
      })
      .catch(error => console.log(error));
  }

  onUnbanClick(event) {
    event.preventDefault();

    this.setState({ reloading: true });
    fetch("https://localhost:8083/gateway/admin/users/" + this.state.user.username + '/banned', {
      method: 'PUT',
      headers: {
        'mode': 'cors',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify({ banned: false })
    })
      .then(this.handleFetchErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({ reloading: false, user: data });
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
      var buttonDiv = null;
      if (this.props.currentUser.roles.includes("ADMIN")) {
        if (this.state.user.banned) {
          buttonDiv = (
            <div className="userButtonsDiv" >
              <button className="buttonDanger" onClick={this.onUnbanClick}>Unban</button>
            </div>
          )
        } else {
          buttonDiv = (
            <div className="userButtonsDiv" >
              <button className="buttonDanger" onClick={this.onBanClick}>Ban</button>
            </div>
          )
        }
      }

      var foundedGroupsDiv = null;
      if (this.state.user.foundedGroups.length) {
        foundedGroupsDiv = (
          <div className="userFoundedGroupsDiv">
            <div className="userFoundedGroupsLabel">Founded Groups:</div>
            <UserGroupList groups={this.state.user.foundedGroups} />
          </div>
        )
      } else {
        foundedGroupsDiv = (
          <div className="userFoundedGroupsDiv">
            <div className="userFoundedGroupsLabel">No founded Groups.</div>
          </div>
        )
      }

      var joinedGroupsDiv = null;
      if (this.state.user.joinedGroups.length) {
        joinedGroupsDiv = (
          <div className="userJoinedGroupsDiv">
            <div className="userJoinedGroupsLabel">Joined Groups:</div>
            <UserGroupList groups={this.state.user.joinedGroups} />
          </div>
        )
      } else {
        joinedGroupsDiv = (
          <div className="userJoinedGroupsDiv">
            <div className="userJoinedGroupsLabel">No joined Groups.</div>
          </div>
        )
      }

      var organizedEventsDiv = null;
      if (this.state.user.organizedEvents.length) {
        organizedEventsDiv = (
          <div className="userOrganizedEventsDiv">
            <div className="userOrganizedEventsLabel">Organized Events:</div>
            <UserEventList events={this.state.user.organizedEvents} />
          </div>
        )
      } else {
        organizedEventsDiv = (
          <div className="userOrganizedEventsDiv">
            <div className="userOrganizedEventsLabel">No organized Events.</div>
          </div>
        )
      }

      var joinedEventsDiv = null;
      if (this.state.user.joinedEvents.length) {
        joinedEventsDiv = (
          <div className="userJoinedEventsDiv">
            <div className="userJoinedEventsLabel">Joined Events:</div>
            <UserEventList events={this.state.user.joinedEvents} />
          </div>
        )
      } else {
        joinedEventsDiv = (
          <div className="userJoinedEventsDiv">
            <div className="userJoinedEventsLabel">No joined Events.</div>
          </div>
        )
      }
      content = (
        <div className="user">
          <div className="userLabel">User</div>
          <div className="username">{this.state.user.username}</div>
          <div className="userRegisterDateDiv">
            <div className="userRegisterDateLabel">Registered on </div>
            <div className="userRegisterDate">{this.state.user.registerDate}</div>
          </div>
          {buttonDiv}
          {foundedGroupsDiv}
          {joinedGroupsDiv}
          {organizedEventsDiv}
          {joinedEventsDiv}
        </div>
      )
    }

    return content;
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
})

const mapDispatchToProps = dispatch => ({
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsView);