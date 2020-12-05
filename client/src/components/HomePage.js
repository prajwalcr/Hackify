import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CardList from "./CardList";
class HomePage extends Component {
	render() {
		return <CardList />;
	}
}

HomePage.propTypes = {
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {})(HomePage);
