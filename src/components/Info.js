import React, { Component } from "react";
import { connect } from "react-redux";
import "./Info.css";

class Info extends Component {
  componentDidMount() {
    console.log(this.props.currentGif);
    if (!this.props.currentGif.type) {
      this.props.history.push("/");
    }
  }
  render() {
    return (
      <div className="container mr-auto ml-auto w-4/5">
        <div class=" mt-16 mb-4">
          <div class=" imgs-holder w-full bg-gray-500 rounded-lg shadow-lg ">
            <img
              src={
                this.props.currentGif.type
                  ? this.props.currentGif.images.downsized.url
                  : null
              }
              alt=""
              className="gify w-full  imgs-holder rounded-lg shadow-lg"
            />
          </div>
          <div class="w-full bg-gray-400 text-white shadow-lg mt-8 pt-2 pb-2 rounded-lg ">
            <h3 class="font-semibold mb-2 text-xl leading-tight sm:leading-normal">
              The Coldest Sunset
            </h3>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentGif: state.currentGif
  };
};

export default connect(mapStateToProps)(Info);
