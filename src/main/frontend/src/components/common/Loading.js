import React from 'react';

class Loading extends React.Component {

  render() {
    return (
      <div className="loading">
        <div className="loadingBackground"></div>
        <div className="loadingBox">
          <div className="loadingText">
            LOADING
          </div>
        </div>
      </div>
    )
  }
}

export default Loading;