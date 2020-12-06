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
		if (projects && this.props.user) {
			projects = projects.filter((project) => {
				return project.author === this.props.user._id;
			});
		}
		return (
			<div>
				{projects && this.props.user ? (
					<div className='grid'>
						{projects.map((project, index) => {
							return (
								<CardPrint
									key={index}
									image={project.coverPic}
									title={project.title}
									view={`/project/${project._id}`}
									edit={`/edit/${project._id}`}
								></CardPrint>
							);
						})}
					</div>
				) : (
					<div>Loading...</div>
				)}
				{/* {this.props.projects.map(function (project, index) {
					return (
						<CardPrint
							key={index}
							image={project.image}
							title={project.title}
						></CardPrint>
					);
				})} */}
			</div>
		);
	}
}
const mapStateToProps = (state) => ({
	projects: state.project.projects,
	user: state.auth.user,
});

export default connect(mapStateToProps, { getProjects })(CardList);
