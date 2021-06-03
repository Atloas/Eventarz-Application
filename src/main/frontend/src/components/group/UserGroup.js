import React from 'react'
import { NavLink } from 'react-router-dom';

class UserGroup extends React.Component {

  render() {
    return (
      <div className="userGroup">
        <div className="groupLabel">Group</div>
        <div className="groupNameDiv">
          <NavLink className="groupName" to={"/group/" + this.props.group.uuid}>{this.props.group.name}</NavLink>
        </div>
      </div>
    )
  }
}

export default UserGroup;