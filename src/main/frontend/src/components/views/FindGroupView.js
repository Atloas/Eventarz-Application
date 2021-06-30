import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setFoundGroupsAction, setMessageAction } from '../../redux/actions';
import GroupList from '../group/GroupList';
import Loading from '../common/Loading';
import { gatewayAddress } from "../../consts/addresses";

class FindGroupView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      name: "",
      searched: false,
      loading: false,
      redirect: "",
      rules: {
        name: false
      }
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
        this.setState({ loading: false });
        this.props.setMessage(message);
        throw Error(message.text);
      })
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

    var address = gatewayAddress;
    if(this.props.currentUser.role === "ROLE_ADMIN") {
      address += "/admin/groups?name=" + encodeURIComponent(this.state.name);
    } else {
      address += "/groups?name=" + encodeURIComponent(this.state.name);
    }

    this.setState({ loading: true, searched: true })
    fetch(address, {
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
        this.props.setFoundGroups(data);
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
    } else if (this.props.foundGroups.length || this.state.searched) {
      results = <GroupList groups={this.props.foundGroups} noGroupsMessage="No Groups found!" />
    }

    var buttonDisabled = !this.state.name;

    return (
      <div>
        <div className="headerPrompt">Find a Group:</div>
        <form className="searchForm findGroupForm" onSubmit={this.onSubmit}>
          <div className="searchNamePromptDiv">
            <label className="groupSearchNamePrompt" htmlFor="groupSearchNameField">Name: </label>
          </div>
          <div className="searchNameFieldDiv">
            <input className="groupSearchNameField" id="groupSearchNameField"
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
            <div className={"rules" + (this.state.rules.name ? "" : " hidden")}>A group name has to be at least 5 characters long and can contain only letters, numbers, as well as a few select symbols.</div>
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
  foundGroups: state.foundGroups,
  currentUser: state.currentUser
})

const mapDispatchToProps = dispatch => ({
  setFoundGroups: redirect => dispatch(setFoundGroupsAction(redirect)),
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(FindGroupView);