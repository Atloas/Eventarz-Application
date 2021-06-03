import React from "react";
import { connect } from 'react-redux';
import { NavLink, Redirect } from "react-router-dom";
import { setMessageAction } from "../../redux/actions";
import Loading from "../common/Loading";

class RegisterView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.validateRepeatPassword = this.validateRepeatPassword.bind(this);
  }

  state = {
    values: {
      username: "",
      password: "",
      repeatPassword: ""
    },
    validity: {
      username: false,
      password: false,
      repeatPassword: false
    },
    touched: {
      username: false,
      password: false,
      repeatPassword: false
    },
    rules: {
      username: false,
      password: false
    },
    redirect: "",
    reloading: false
  }

  onChange(event) {
    this.setState({
      values: { ...this.state.values, [event.target.name]: event.target.value },
      touched: { ...this.state.touched, [event.target.name]: true }
    });
  }

  onFocus(event) {
    this.setState({ rules: { ...this.state.rules, [event.target.name]: true } });
  }

  onBlur(event) {
    this.setState({ rules: { ...this.state.rules, [event.target.name]: false } });
  }

  validate() {
    return this.state.validity.username && this.state.validity.password && this.state.validity.repeatPassword;
  }

  validateUsername(event) {
    var username = this.state.values.username;
    var found = username.match(/[^a-zA-Z0-9]+/g);
    if (username.length < 5 || found != null) {
      this.setState({ validity: { ...this.state.validity, username: false } });
    }
    else {
      this.setState({ validity: { ...this.state.validity, username: true } });
    }
  }

  validatePassword(event) {
    var password = this.state.values.password;
    //At least one upper case, one lower case, one number
    if (password.length < 8 ||
      password.match(/[a-z]+/g) == null ||
      password.match(/[A-Z]+/g) == null ||
      password.match(/[0-9]+/g) == null) {
      this.setState({ validity: { ...this.state.validity, password: false } });
    }
    else {
      this.setState({ validity: { ...this.state.validity, password: true } });
    }
  }

  validateRepeatPassword(event) {
    var password = this.state.values.password;
    var repeatPassword = this.state.values.repeatPassword;
    if (repeatPassword !== password) {
      this.setState({ validity: { ...this.state.validity, repeatPassword: false } });
    }
    else {
      this.setState({ validity: { ...this.state.validity, repeatPassword: true } });
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

  onSubmit(event) {
    event.preventDefault()

    this.setState({ reloading: true });
    fetch("https://localhost:8083/gateway/users", {
      method: "POST",
      headers: {
        'mode': 'cors',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.values.username,
        password: this.state.values.password,
        repeatPassword: this.state.values.repeatPassword
      })
    })
      .then(this.handleFetchErrors)
      .then(() => {
        this.props.setMessage({
          type: "info",
          text: "Registered!"
        });
        this.setState({ redirect: "/" });
      })
      .catch(error => console.log(error));
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />
    }

    var buttonDisabled = !this.validate();

    return (
      <div>
        {this.state.reloading ?
          <Loading />
          :
          null
        }
        <div className="headerPrompt">Register:</div>
        <form className="registrationForm" onSubmit={this.onSubmit}>
          <div className="registrationUsernamePromptDiv">
            <label className="registrationUsernamePrompt" htmlFor="registrationUsernameField">Username:</label>
          </div>
          <div className="registrationUsernameFieldDiv">
            <input className={"registrationUsernameField " + (this.state.touched.username && !this.state.validity.username ? "invalidInput" : "")} id="registrationUsernameField"
              name="username"
              type="text"
              placeholder="Username"
              maxLength="16"
              value={this.state.username}
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={(event) => { this.validateUsername(event); this.onBlur(event) }}
            />
          </div>
          <div className="registrationUsernameRulesDiv">
            <div className={"registrationUsernameRules rules " + (this.state.rules.username ? "" : "hidden")}>A username has to be at least 5 characters long and can contain only letters and numbers.</div>
          </div>
          <div className="registrationPasswordPromptDiv">
            <label className="registrationPasswordPrompt" htmlFor="registrationPasswordField">Password:</label>
          </div>
          <div className="registrationPasswordFieldDiv">
            <input className={"registrationPasswordField " + (this.state.touched.password && !this.state.validity.password ? "invalidInput" : "")} id="registrationPasswordField"
              name="password"
              type="password"
              placeholder="Password"
              maxLength="128"
              value={this.state.password}
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={(event) => { this.validatePassword(event); this.onBlur(event) }}
            />
          </div>
          <div className="registrationPasswordRulesDiv">
            <div className={"registrationPasswordRules rules " + (this.state.rules.password ? "" : "hidden")}>A password has to be at least 8 characters long, and must contain at least one lower-case letter, upper-case letter, and a number.</div>
          </div>
          <div className="registrationRepeatPasswordPromptDiv">
            <label className="registrationRepeatPasswordPrompt" htmlFor="registrationRepeatPasswordField">Repeat password:</label>
          </div>
          <div className="registrationRepeatPasswordFieldDiv">
            <input className={"registrationRepeatPasswordField " + (this.state.touched.repeatPassword && !this.state.validity.repeatPassword ? "invalidInput" : "")} id="registrationRepeatPasswordField"
              name="repeatPassword"
              type="password"
              placeholder="Repeat password"
              maxLength="128"
              value={this.state.repeatPassword}
              onChange={this.onChange}
              onBlur={this.validateRepeatPassword}
            />
          </div>
          <div className="registrationSubmitButtonDiv">
            <button type="submit" className="buttonNormal registrationSubmitButton" disabled={buttonDisabled}>Submit</button>
          </div>
        </form>
        <div className="loginLinkDiv">
          <NavLink className="loginLink" to="/">Login</NavLink>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  setMessage: message => dispatch(setMessageAction(message)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterView);
