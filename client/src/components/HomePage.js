import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import CardList from "./CardList";
import MyCardList from "./MyCardList";
class HomePage extends Component {
	render() {
		return (
			<div>
				{this.props.location.pathname === "/" ? <CardList /> : <MyCardList />}
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

export default connect(mapStateToProps, {})(HomePage);
