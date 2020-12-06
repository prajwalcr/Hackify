import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getProject } from "../actions/projectActions";
import "./project.css";

class Project extends Component {
	componentDidMount() {
		if (this.props.match.params.id) {
			const projectId = this.props.match.params.id;
			if (projectId) {
				this.props.getProject(projectId);
			}
		}
	}

	constructor(props) {
		super(props);
		this.state = {
			success: true,
		};
	}

	componentDidUpdate(prevProps) {
		const { error } = this.props;
		if (error !== prevProps.error) {
			if (error.id !== null) {
				this.setState({ success: error.msg.success });
			} else {
				this.setState({ success: null });
			}
		}
	}
	render() {
		return (
			<div>
				{this.props.projects[0] ? (
					<div>
						<h1 id='project-title'>{this.props.projects[0].title}</h1>
						<img
							src={this.props.projects[0].coverPic}
							alt='Failed to load cover pic'
						></img>
						<div
							className='project-text'
							dangerouslySetInnerHTML={{
								__html: this.props.projects[0].content,
							}}
						/>
					</div>
				) : (
					<div>
						{!this.state.success ? (
							<div>
								<Redirect to='/'></Redirect>
							</div>
						) : (
							<div>Loading...</div>
						)}
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	projects: state.project.projects,
	error: state.error,
});

export default connect(mapStateToProps, { getProject })(Project);
