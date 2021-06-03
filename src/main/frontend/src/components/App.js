import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from 'react-redux';
import { loginAction } from '../redux/actions';
import Footer from "./common/Footer";
import Header from "./common/Header";
import Message from "./common/Message";
import EventDetailsView from "./views/EventDetailsView";
import HomeView from "./views/HomeView";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import CreateEventView from "./views/CreateEventView";
import EditEventView from "./views/EditEventView";
import FindGroupView from "./views/FindGroupView";
import FindEventView from "./views/FindEventView";
import FindUserView from "./views/FindUserView";
import MyGroupsView from "./views/MyGroupsView";
import MyEventsView from "./views/MyEventsView";
import CreateGroupView from "./views/CreateGroupView";
import EditGroupView from "./views/EditGroupView";
import GroupDetailsView from "./views/GroupDetailsView";
import UserDetailsView from "./views/UserDetailsView";
import Loading from './common/Loading';

class App extends React.Component {

  state = {
    loading: false
  }

  handleFetchErrors(response) {
    if (!response.ok) {
      throw Error();
    }
    return response;
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.setState({ loading: true })
      fetch("https://localhost:8083/gateway/refreshLogin", {
        method: "POST",
        headers: {
          'mode': 'cors',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
        .then(this.handleFetchErrors)
        .then(response => response.json())
        .then(data => {
          this.setState({ loading: false })
          localStorage.setItem("token", data.token);
          this.props.loginUser({ username: data.username, roles: data.roles });
        })
        .catch(error => {
          localStorage.removeItem("token");
          console.log(error);
        });
    }
  }

  render() {
    var content = null;
    if (this.state.loading) {
      content = <Loading />;
    } else if (this.props.currentUser) {
      content = (
        <Switch>
          {/* From StackOverflow, if you need to pass props outside of the path param:
              <Route exact path="/details/:id" render={(props) => <DetailsPage globalStore={globalStore} {...props} /> } /> */}
          <Route path="/event/:uuid" component={EventDetailsView} />
          <Route path="/group/:uuid" component={GroupDetailsView} />
          <Route path="/user/:username" component={UserDetailsView} />
          <Route path="/myGroups" component={MyGroupsView} />
          <Route path="/myEvents" component={MyEventsView} />
          <Route path="/createEvent" component={CreateEventView} />
          <Route path="/createGroup" component={CreateGroupView} />
          <Route path="/editEvent" component={EditEventView} />
          <Route path="/editGroup" component={EditGroupView} />
          <Route path="/findGroup" component={FindGroupView} />
          <Route path="/findEvent" component={FindEventView} />
          <Route path="/findUser" component={FindUserView} />
          <Route exact path="/" component={HomeView} />
        </Switch>
      );
    } else {
      content = (
        <Switch>
          <Route path="/register" component={RegisterView} />
          <Route path="/" component={LoginView} />
        </Switch>
      )
    }

    return (
      <BrowserRouter>
        <Header />
        <Message />
        <div className="content">
          {content}
        </div>
        <div className="footerPadding"></div>
        <Footer />
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser
})

const mapDispatchToProps = dispatch => ({
  loginUser: userInfo => dispatch(loginAction(userInfo)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App);