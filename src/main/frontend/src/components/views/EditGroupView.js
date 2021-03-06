import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setGroupDetailsAction, setMessageAction } from '../../redux/actions';
import Loading from '../common/Loading';

class EditGroupView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
    this.onChange = this.onChange.bind(this);
    this.validateName = this.validateName.bind(this);
    this.validateDescription = this.validateDescription.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.state = {
      groupName: "",
      values: {
        name: "",
        description: ""
      },
      validity: {
        name: true,
        description: true
      },
      rules: {
        name: false,
        description: false,
      },
      redirect: ""
    }
  }


  componentDidMount() {
    if (!this.props.groupDetails) {
      this.setState({ redirect: "/" });
    } else {
      this.setState({
        groupName: this.props.groupDetails.name,
        values: {
          name: this.props.groupDetails.name,
          description: this.props.groupDetails.description,
        }
      })
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

  onSubmit(event) {
    event.preventDefault()

    this.setState({ loading: true });
    fetch(process.env.REACT_APP_GATEWAY_ADDRESS + "/groups/" + this.props.groupDetails.uuid, {
      method: "PUT",
      headers: {
        'mode': 'cors',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify({
        name: this.state.values.name,
        description: this.state.values.description,
        founderUsername: this.props.currentUser.username
      })
    })
      .then(this.handleFetchErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({ redirect: "/group/" + data.uuid });
      })
      .catch(error => console.log(error));
  }

  onCancelClick(event) {
    this.setState({ redirect: "/group/" + this.props.groupDetails.uuid })
  }

  onChange(event, validator) {
    this.setState({
      values: { ...this.state.values, [event.target.name]: event.target.value },
    }, validator);
  }

  onFocus(event) {
    this.setState({ rules: { ...this.state.rules, [event.target.name]: true } });
  }

  onBlur(event) {
    this.setState({ rules: { ...this.state.rules, [event.target.name]: false } });
  }

  validate() {
    return this.state.validity.name && this.state.validity.description;
  }

  validateName() {
    var name = this.state.values.name;
    var found = name.match(/[^a-zA-Z0-9\s\-:().,!?$&*'"]+/g);
    if (name.length < 5 || found != null) {
      this.setState({ validity: { ...this.state.validity, name: false } });
    }
    else {
      this.setState({ validity: { ...this.state.validity, name: true } });
    }
  }

  validateDescription() {
    var found = this.state.values.description.match(/[^a-zA-Z0-9\s\-:().,!?$&*'"]+/g);
    if (found != null) {
      this.setState({ validity: { ...this.state.validity, description: false } });
    }
    else {
      this.setState({ validity: { ...this.state.validity, description: true } });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />
    }
    if (!this.props.groupDetails) {
      return <Redirect push to="/" />
    }

    var buttonDisabled = !this.validate();
    return (
      <div>
        {this.state.loading ?
          <Loading />
          :
          null
        }
        <div className="headerPrompt">Edit Group {this.props.groupName}:</div>
        <form className="editGroupForm" onSubmit={this.onSubmit}>
          <div className="editGroupNamePromptDiv">
            <label className="editGroupNamePrompt" htmlFor="editGroupNameField">Name: </label>
          </div>
          <div className="editGroupNameFieldDiv">
            <input className={"editGroupNameField " + (!this.state.validity.name ? "invalidInput" : "")} id="editGroupNameField"
              name="name"
              type="text"
              maxLength="64"
              value={this.state.values.name}
              onChange={(event) => { this.onChange(event, this.validateName) }}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            />
          </div>
          <div className="editGroupNameRulesDiv">
            <div className={"editGroupNameRules rules" + (this.state.rules.name ? "" : " hidden")}>A group name has to be at least 5 characters long and can contain only letters, numbers, as well as a few select symbols.</div>
          </div>
          <div className="editGroupDescriptionPromptDiv">
            <label className="editGroupDescriptionPrompt" htmlFor="editGroupDescriptionField">Description: </label>
          </div>
          <div className="editGroupDescriptionFieldDiv">
            <textarea className={"editGroupDescriptionField " + (!this.state.validity.description ? "invalidInput" : "")} id="editGroupDescriptionField"
              name="description"
              cols="50"
              rows="5"
              maxLength="1024"
              value={this.state.values.description}
              onChange={(event) => { this.onChange(event, this.validateDescription) }}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            >
            </textarea>
          </div>
          <div className="editGroupDescriptionRulesDiv">
            <div className={"editGroupDescriptionRules rules" + (this.state.rules.description ? "" : " hidden")}>A group description can only contain letters, numbers, as well as a few select symbols.</div>
          </div>
          <div className="editGroupButtonDiv">
            <button type="submit" className="buttonNormal editGroupSubmitButton" disabled={buttonDisabled}>Save</button>
            <button className="buttonNormal editGroupCancelButton" onClick={this.onCancelClick}>Cancel</button>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  groupDetails: state.groupDetails,
  currentUser: state.currentUser
})

const mapDispatchToProps = dispatch => ({
  setGroupDetails: groupDetails => dispatch(setGroupDetailsAction(groupDetails)),
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditGroupView);