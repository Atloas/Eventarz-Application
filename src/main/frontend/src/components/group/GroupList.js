import React from 'react'
import GroupSearched from './GroupSearched';

class GroupList extends React.Component {

  render() {
    var groupObjects = [];
    if (this.props.groups.length) {
      this.props.groups.forEach(group => {
        groupObjects.push(<GroupSearched group={group} key={group.uuid} />)
      });
    }

    return (
      <div className="groupListDiv">
        {groupObjects.length ?
          groupObjects
          :
          <div className="noGroupsText">{this.props.noGroupsMessage}</div>
        }
      </div>
    )
  }
}

export default GroupList;