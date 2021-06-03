import React from "react"
import { connect } from 'react-redux'
import { clearMessageAction } from '../../redux/actions';

class Message extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();

    this.props.clearMessage();
  }

  render() {
    if (this.props.message) {
      // message.type with capitalized first letter.
      var classNameFragment = this.props.message.type.charAt(0).toUpperCase() + this.props.message.type.slice(1);
      return (
        <div className="message">
          <div className="messageBackground"></div>
          <div className={"messageBox message" + classNameFragment}>
            <div className={"message" + classNameFragment + "Text"}>{this.props.message.text}</div>
            <button className="buttonNormal messageButton" onClick={this.handleClick}>OK</button>
          </div>
        </div>
      )
    } else {
      return (
        null
      );
    }
  }
}

const mapStateToProps = state => ({
  message: state.message
})

const mapDispatchToProps = dispatch => ({
  clearMessage: () => dispatch(clearMessageAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(Message);
