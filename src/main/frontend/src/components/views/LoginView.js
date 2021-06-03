import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { loginAction, setMessageAction } from '../../redux/actions';
import Loading from '../common/Loading';

class LoginView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    username: "",
    password: "",
    reloading: false
  }

  handleFormChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleFetchErrors(response) {
    if (!response.ok) {
      return response.json().then(body => {
        var message = {
          type: "error",
          text: ""
        };
        switch (body.status) {
          case 400 | 401:
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

  handleSubmit(event) {
    event.preventDefault()

    this.setState({ reloading: true });
    fetch("https://localhost:8083/gateway/login", {
    // fetch("https://localhost:8070/login", {
      method: "POST",
      headers: {
        'mode': 'cors',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(this.handleFetchErrors)
      .then(response => response.json())
      .then(data => {
        localStorage.setItem("token", data.token)
        this.props.loginUser({ username: data.username, roles: data.roles })
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        {this.state.reloading ?
          <Loading />
          :
          null
        }
        <div className="headerPrompt" >Log in:</div>
        <form className="loginForm" name="loginForm" onSubmit={this.handleSubmit}>
          <div className="loginUsernamePromptDiv">
            <label className="loginUsernameFieldPrompt" htmlFor="loginUsernameField">Username:</label>
          </div>
          <div className="loginUsernameFieldDiv">
            <input className="loginUsernameField" id="loginUsernameField"
              name="username"
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={this.handleFormChange}
            />
          </div>
          <div className="loginPasswordPromptDiv">
            <label className="loginPasswordFieldPrompt" htmlFor="loginPasswordField">Password:</label>
          </div>
          <div className="loginPasswordFieldDiv">
            <input className="loginPasswordField" id="loginPasswordField"
              name="password"
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleFormChange}
            />
          </div>
          <div className="loginSubmitButtonDiv">
            <button type="submit" className="buttonNormal loginSubmitButton" >Login</button>
          </div>
        </form>
        <div className="registerLinkDiv">
          <NavLink className="registerLink" to="/register">Register</NavLink>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  loginUser: userInfo => dispatch(loginAction(userInfo)),
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(null, mapDispatchToProps)(LoginView);