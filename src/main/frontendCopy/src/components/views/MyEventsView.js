import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import EventHomeList from '../event/EventHomeList';
import { setMessageAction } from "../../redux/actions";
import Loading from '../common/Loading';

class MyEventsView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
  }

  state = {
    events: [],
    loading: true,
    redirect: ""
  }

  handleFetchErrors(response) {
    if (!response.ok) {
      var message = {
        type: "error",
        text: "Something went wrong!"
      };
      this.props.setMessage(message);
      throw Error(message.text);
    }
    return response;
  }

  componentDidMount() {
    fetch("https://localhost:8083/gateway/events", {
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
        // this.props.setMyEvents(data);
        this.setState({ loading: false, events: data });
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
  myEvents: state.myEvents
})

const mapDispatchToProps = dispatch => ({
  // setMyEvents: myEvents => dispatch(setMyEventsAction(myEvents)),
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(MyEventsView);