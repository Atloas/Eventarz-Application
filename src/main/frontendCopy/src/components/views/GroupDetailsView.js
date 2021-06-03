import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setGroupDetailsAction, clearGroupDetailsAction, setMessageAction } from '../../redux/actions';
import { DateTime } from 'luxon';
import { groupDateStorageFormat, groupDateDisplayFormat } from '../../scripts/dateFormats';
import { processGroupData } from "../../scripts/groupDataUtils";
import GroupEventList from "../event/GroupEventList";
import Loading from '../common/Loading';
import GroupMemberList from '../user/GroupMemberList';

class GroupDetailsView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onAdminDeleteClick = this.onAdminDeleteClick.bind(this);
    this.onJoinClick = this.onJoinClick.bind(this);
    this.onLeaveClick = this.onLeaveClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
  }

  state = {
    loading: true,
    reloading: false,
    redirect: ""
  }

  handleFetchErrors(response) {
    if (!response.ok) {
      var message = {
        type: "error",
        text: "Something went wrong!"
      };
      this.setState({ reloading: false });
      this.props.setMessage(message);
      throw Error(message.text);
    }
    return response;
  }

  componentDidMount() {
    fetch("https://localhost:8083/gateway/groups/" + this.props.match.params.uuid, {
      headers: {
        'mode': 'cors',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
      .then(this.handleFetchErrors)
      .then(response => response.json())
      .then(data => {
        this.props.setGroupDetails(processGroupData(data, this.props.currentUser.username));
        this.setState({ loading: false });
      })
      .catch(error => console.log(error));
  }

  onJoinClick(event) {
    event.preventDefault();

    this.setState({ reloading: true });
    fetch("https://localhost:8083/gateway/groups/" + this.props.groupDetails.uuid + '/members', {
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
        this.props.setGroupDetails(processGroupData(data, this.props.currentUser.username));
        this.setState({ reloading: false });
      })
      .catch(error => console.log(error));
  }

  onLeaveClick(event) {
    event.preventDefault();

    this.setState({ reloading: true });
    fetch("https://localhost:8083/gateway/groups/" + this.props.groupDetails.uuid + '/members/' + this.props.currentUser.username, {
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
        this.props.setGroupDetails(processGroupData(data, this.props.currentUser.username));
        this.setState({ reloading: false });
      })
      .catch(error => console.log(error));
  }

  onEditClick(event) {
    event.preventDefault();

    this.setState({ redirect: "/editGroup" });
  }

  onDeleteClick(event) {
    event.preventDefault();

    this.setState({ reloading: true });
    fetch("https://localhost:8083/gateway/groups/" + this.props.groupDetails.uuid, {
      method: 'DELETE',
      headers: {
        'mode': 'cors',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
      .then(this.handleFetchErrors)
      .then(() => {
        this.props.clearGroupDetails();
        this.setState({ redirect: "/" });
      })
      .catch(error => console.log(error));
  }

  onAdminDeleteClick(event) {
    event.preventDefault();

    this.setState({ reloading: true });
    fetch("https://localhost:8083/gateway/admin/groups/" + this.props.groupDetails.uuid, {
      method: 'DELETE',
      headers: {
        'mode': 'cors',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }
    })
      .then(this.handleFetchErrors)
      .then(() => {
        this.props.clearGroupDetails();
        this.setState({ redirect: "/" });
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

      if (this.props.currentUser.roles.includes("USER")) {
        if (this.props.groupDetails.founded) {
          buttons.push(<button key="editButton" className="buttonNormal" onClick={this.onEditClick}>Edit</button>);
          buttons.push(<button key="deleteButton" className="buttonDanger" onClick={this.onDeleteClick}>Delete</button>);
        } else {
          if (this.props.groupDetails.joined) {
            buttons.push(<button key="leaveButton" className="buttonNormal" onClick={this.onLeaveClick}>Leave</button>);
          } else {
            buttons.push(<button key="joinButton" className="buttonNormal" onClick={this.onJoinClick}>Join</button>);
          }
        }
      } else if (this.props.currentUser.roles.includes("ADMIN")) {
        buttons.push(<button key="adminDeleteButton" className="buttonDanger" onClick={this.onAdminDeleteClick}>Delete</button>);
      }
      content = (
        <div className="group">
          {this.state.reloading ?
            <Loading />
            :
            null
          }
          <div className="groupLabel">Group</div>
          <div className="groupName">{this.props.groupDetails.name}</div>
          <div className="groupDescription">{this.props.groupDetails.description}</div>
          <div className="groupFoundingDiv">
            <div className="groupFounderLabel">Founded by </div>
            <div className="groupFounder">{this.props.groupDetails.founder.username}</div>
            <div className="groupFoundingDateLabel"> on </div>
            <div className="groupFoundingDate">{DateTime.fromFormat(this.props.groupDetails.createdDate, groupDateStorageFormat).toFormat(groupDateDisplayFormat)}</div>
          </div>
          <div className="groupButtonsDiv">
            {buttons}
          </div>
          <div>Members: {this.props.groupDetails.members.length}</div>
          <GroupMemberList users={this.props.groupDetails.members} />
          <div>Events: {this.props.groupDetails.events.length}</div>
          <GroupEventList events={this.props.groupDetails.events} noEventsMessage="No Events!" />
        </div>
      )
    }

    return content;
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  groupDetails: state.groupDetails
})

const mapDispatchToProps = dispatch => ({
  setGroupDetails: groupDetails => dispatch(setGroupDetailsAction(groupDetails)),
  clearGroupDetails: () => dispatch(clearGroupDetailsAction()),
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetailsView);