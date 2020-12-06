import React, { Component } from "react";
import { loadUser } from "../actions/authActions";
import { getProjects } from "../actions/projectActions";
import { connect } from "react-redux";
import "./profile.css";

class Profile extends Component {
	constructor() {
		super();
		this.mediaQuery = {
			desktop: 1200,
			tablet: 768,
			phone: 576,
		};
		this.state = {
			windowWidth: null,
		};
	}
	componentDidMount() {
		this.props.getProjects();
		window.addEventListener("resize", () => {
			this.setState({ windowWidth: document.body.clientWidth });
		});
	}
	render() {
		return (
			<div className='Card' style={{ width: "100%" }}>
				<header className='header'>
					{this.props.user ? (
						<div className='details'>
							<h1 className='heading'>{this.props.user.name}</h1>
							<div className='location'></div>
							<div className='stats'>
								<div className='col-4'>
									<h4>{this.props.projects.length}</h4>
									<p>Projects</p>
								</div>
								<div className='col-4'>
									<h4>{this.props.user.email}</h4>
									<p>email ID</p>
								</div>
								<div className='col-4'>
									<h4>{this.props.user.phone}</h4>
									<p>phone</p>
								</div>
							</div>
						</div>
					) : (
						<div>Loading...</div>
					)}
				</header>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	projects: state.project.projects,
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user,
});

export default connect(mapStateToProps, {
	loadUser,
	getProjects,
})(Profile);
