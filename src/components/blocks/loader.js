import React from "react";

class Loader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  componentWillUnmount() {}

  render() {
    return (
      <>
        {/* <div className="cell">
          <div className="circle gelatine"></div>
        </div> */}
        <div
          style={{
            position: "fixed",
            top: "0",
            right: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            zIndex: "99999999999999999",
            opacity: "1",
            animation: `fadeOut 2s`,
          }}
        ></div>
      </>
    );
  }
}

export default Loader;
