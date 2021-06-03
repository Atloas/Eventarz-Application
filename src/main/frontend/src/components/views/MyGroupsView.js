import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import GroupList from '../group/GroupList';
import { setMessageAction } from '../../redux/actions';
import Loading from '../common/Loading';

class MyGroupsView extends React.Component {
  constructor(props) {
    super(props);

    this.handleFetchErrors = this.handleFetchErrors.bind(this);
  }

  state = {
    groups: [],
    loading: true,
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
    fetch("https://localhost:8083/gateway/groups", {
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
        // this.props.setMyGroups(data);
        this.setState({ loading: false, groups: data })
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
      if (this.state.groups.length) {
        content = (
          <div>
            <div className="headerPrompt">Your Groups:</div>
            <GroupList groups={this.state.groups} />
          </div>
        );
      } else {
        content = <div className="noGroupsText">No Groups!</div>
      }
    }

    return content;
  }
}

const mapStateToProps = state => ({
  // myGroups: state.myGroups
})

const mapDispatchToProps = dispatch => ({
  // setMyGroups: myGroups => dispatch(setMyGroupsAction(myGroups)),
  setMessage: message => dispatch(setMessageAction(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(MyGroupsView);