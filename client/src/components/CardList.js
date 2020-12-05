import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProjects } from "../actions/projectActions";
import CardPrint from "./Cards";

class CardList extends Component {
	componentDidMount() {
		this.props.getProjects();
	}
	render() {
		console.log(this.props.projects);
		return (
			<div>
				{this.props.projects.map(function (project, index) {
					return (
						<CardPrint
							key={index}
							image={project.image}
							title={project.title}
						></CardPrint>
					);
				})}
			</div>
		);
	}
}
const mapStateToProps = (state) => ({
	projects: state.project.projects,
});

export default connect(mapStateToProps, { getProjects })(CardList);
