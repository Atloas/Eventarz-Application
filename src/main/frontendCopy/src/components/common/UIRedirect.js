import React from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { clearRedirectAction } from "../../redux/actions";

class UIRedirect extends React.Component {

  render() {
    var redirectElement;
    if (this.props.redirect) {
      redirectElement = <Redirect push to={this.props.redirect} />;
      this.props.clearRedirect();
    } else {
      redirectElement = null;
    }

    return redirectElement;
  }
}

const mapStateToProps = state => ({
  redirect: state.redirect
})

const mapDispatchToProps = dispatch => ({
  // clearRedirect: () => dispatch(clearRedirectAction())
})

// export default connect(mapStateToProps, mapDispatchToProps)(UIRedirect);