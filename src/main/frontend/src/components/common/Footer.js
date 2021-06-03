import React from "react";

class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        {/* <div className="localeChangeDiv">
          <select className="locales">
            <option value="">Language</option>
            <option value="en">English</option>
            <option value="pl">Polski</option>
          </select>
        </div> */}
        <div className="credits">Michał Zbrożek</div>
      </div>
    );
  }
}

export default Footer;