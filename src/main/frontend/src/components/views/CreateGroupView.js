import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setMessageAction } from '../../redux/actions';
import Loading from '../common/Loading';
import { gatewayAddress } from "../../consts/addresses";

class CreateGroupView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
    this.onChange = this.onChange.bind(this);
    this.validateName = this.validateName.bind(this);
    this.validateDescription = this.validateDescription.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.state = {
      groups: [],
      values: {
        name: "",
        description: ""
      },
      validity: {
        name: false,
        description: true
      },
      touched: {
        name: false,
        description: false
      },
      rules: {
        name: false,
        description: false,
      },
      redirect: "",
      loading: false
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
    fetch(gatewayAddress + "/groups", {
      method: "POST",
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
        this.setState({ redirect: "/group/" + data.uuid })
      })
      .catch(error => console.log(error));
  }

  onChange(event, validator) {
    this.setState({
      values: { ...this.state.values, [event.target.name]: event.target.value },
      touched: { ...this.state.touched, [event.target.name]: true }
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

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />
    }

    var buttonDisabled = !this.validate();
    return (
      <div>
        {this.state.loading ?
          <Loading />
          :
          null
        }
        <div className="headerPrompt">Create a Group:</div>
        <form className="createGroupForm" onSubmit={this.onSubmit}>
          <div className="groupCreateNamePromptDiv">
            <label className="groupCreateNamePrompt" htmlFor="groupCreateNameField">Name: </label>
          </div>
          <div className="groupCreateNameFieldDiv">
            <input className={"groupCreateNameField " + (this.state.touched.name && !this.state.validity.name ? "invalidInput" : "")} id="groupCreateNameField"
              name="name"
              type="text"
              placeholder="Name"
              maxLength="32"
              value={this.state.values.name}
              onChange={(event) => { this.onChange(event, this.validateName) }}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            />
          </div>
          <div className="groupCreateNameRulesDiv">
            <div className={"groupCreateNameRules rules" + (this.state.rules.name ? "" : " hidden")}>A group name has to be at least 5 characters long and can contain only letters, numbers, as well as a few select symbols.</div>
          </div>
          <div className="groupCreateDescriptionPromptDiv">
            <label className="groupCreateDescriptionPrompt" htmlFor="groupCreateDescriptionField">Description: </label>
          </div>
          <div className="groupCreateDescriptionFieldDiv">
            <textarea className={"groupCreateDescriptionField " + (this.state.touched.description && !this.state.validity.description ? "invalidInput" : "")} id="groupCreateDescriptionField"
              name="description"
              cols="50"
              rows="5"
              placeholder="Description"
              maxLength="1024"
              value={this.state.values.description}
              onChange={(event) => { this.onChange(event, this.validateDescription) }}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
            >
            </textarea>
          </div>
          <div className="groupCreateDescriptionRulesDiv">
            <div className={"groupCreateDescriptionRules rules" + (this.state.rules.description ? "" : " hidden")}>A group description can only contain letters, numbers, as well as a few select symbols.</div>
          </div>
          <div className="createGroupSubmitButtonDiv">
            <button type="submit" className="buttonNormal createGroupSubmitButton" disabled={buttonDisabled}>Create</button>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

const mapDispatchToProps = dispatch => ({
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupView);