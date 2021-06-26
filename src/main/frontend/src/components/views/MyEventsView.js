import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import EventHomeList from '../event/EventHomeList';
import { setMessageAction } from "../../redux/actions";
import Loading from '../common/Loading';
import { gatewayAddress } from "../../consts/addresses";
import { putHappenedEventsInTheBack } from "../../scripts/eventDataUtils";

class MyEventsView extends React.Component {
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
    fetch(gatewayAddress + "/events?username=" + this.props.currentUser.username, {
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
        var events = putHappenedEventsInTheBack(data);
        this.setState({ loading: false, events: events });
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
      if (this.state.events.length) {
        content = (
          <div>
            <div className="headerPrompt">Your Events:</div>
            <EventHomeList events={this.state.events} />
          </div>
        );
      } else {
        content = <div className="noEventsText">No Events!</div>
      }
    }

    return content;
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

const mapDispatchToProps = dispatch => ({
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(MyEventsView);