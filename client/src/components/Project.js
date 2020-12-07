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
			err_id: null,
		};
	}

	componentDidUpdate(prevProps) {
		const { error } = this.props;
		if (error !== prevProps.error) {
			if (error.id !== null) {
				this.setState({ err_id: error.id });
			} else {
				this.setState({ err_id: null });
			}
		}
	}
	render() {
		return (
			<div className='general'>
				{this.props.projects[0] ? (
					<div>
						<h1 className='project-title'>{this.props.projects[0].title}</h1>
						<center>
							<img
								id='foo'
								src={
									this.props.projects[0].coverPic ||
									"http://localhost:5000/uploads\\default.jfif"
								}
								alt='Failed to load cover pic'
								onError='standby()'
								style={{ align: "middle", maxHeight: 350, maxWidth: 350 }}
							></img>
						</center>
						<div
							className='project-text'
							dangerouslySetInnerHTML={{
								__html: this.props.projects[0].content,
							}}
						/>
					</div>
				) : (
					<div>
						{this.state.err_id === "PROJECT_LOAD_FAIL" ? (
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
