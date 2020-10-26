import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class HomePage extends Component {

  render() {
    return (
      <div>
          HomePage
      </div>
    );
  }
}

HomePage.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {  })(HomePage);
