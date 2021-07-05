import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setMessageAction } from '../../redux/actions';
import EventHomeList from '../event/EventHomeList';
import Loading from '../common/Loading';
import { putHappenedEventsInTheBack } from "../../scripts/eventDataUtils";

class HomeView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
    this.state = {
      events: [],
      loading: true,
      redirect: ""
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

  componentDidMount() {
    if (this.props.currentUser.role === "ROLE_USER") {
      fetch(process.env.REACT_APP_GATEWAY_ADDRESS + "/events?username=" + this.props.currentUser.username + "&home", {
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
          data = putHappenedEventsInTheBack(data);
          this.setState({ loading: false, events: data })
        })
        .catch(error => console.log(error));
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />
    }

    var content = null;
    if (this.props.currentUser.role === "ROLE_USER") {
      if (this.state.loading) {
        content = <Loading />;
      } else {
        if (this.state.events.length) {
          content = (
            <div>
              <div className="headerPrompt">Here are your Events for the coming week:</div>
              <EventHomeList events={this.state.events} />
            </div>
          );
        } else {
          content = <div className="noEventsText">You have no Events set for the coming week!</div>
        }
      }
    }

    return (
      <div>
        <div className="headerPrompt">
          <div className="homeWelcomeText">Hello, </div>
          <div className="homeWelcomeUsername">{' ' + this.props.currentUser.username + '!'}</div>
        </div>
        {content}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
})

const mapDispatchToProps = dispatch => ({
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);