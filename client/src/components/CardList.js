import React, { Component } from "react";
import { connect } from "react-redux";
import { getProjects } from "../actions/projectActions";
import CardPrint from "./Cards";

class CardList extends Component {
	componentDidMount() {
		this.props.getProjects();
	}
	render() {
		var projects = this.props.projects;
		if (projects) {
			projects = projects.filter((project) => {
				return project.isPublic === true;
			});
		}
		console.log(this.props.projects);
		return (
			<div className='grid'>
				{projects.map(function (project, index) {
					return (
						<CardPrint
							key={index}
							image={
								project.coverPic ||
								"http://localhost:5000/uploads\\default.jfif"
							}
							title={project.title}
							view={`/project/${project._id}`}
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
