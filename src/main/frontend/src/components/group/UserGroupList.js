import React from 'react'
import UserGroup from './UserGroup';

class UserGroupList extends React.Component {

  render() {
    var groupObjects = [];
    if (this.props.groups.length) {
      this.props.groups.forEach(group => {
        groupObjects.push(<UserGroup group={group} key={group.uuid} />)
      });
    }

    return (
      <div className="groupListDiv">
        {groupObjects}
      </div>
    )
  }
}

export default UserGroupList;