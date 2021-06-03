import React from 'react'
import { NavLink } from 'react-router-dom';

class GroupSearched extends React.Component {

  render() {
    return (
      <div className="groupSearched">
        <div className="groupLabel">Group</div>
        <div className="groupNameDiv">
          <NavLink className="groupName" to={"/group/" + this.props.group.uuid}>{this.props.group.name}</NavLink>
        </div>
        <div className="groupDescription">{this.props.group.description}</div>
        <div className="groupMemberCountDiv">
          <div className="groupMemberCountLabel">Members: </div>
          <div className="groupMemberCount">{this.props.group.memberCount}</div>
        </div>
        <div className="groupEventCountDiv">
          <div className="groupEventCountLabel">Events: </div>
          <div className="groupEventCount">{this.props.group.eventCount}</div>
        </div>
      </div>
    )
  }
}

export default GroupSearched;