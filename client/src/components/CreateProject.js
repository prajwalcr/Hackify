import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";
import QuillEditor from "./QuillEditor";
import { loadUser } from "../actions/authActions";
import {
	getProject,
	addProject,
	updateProject,
} from "../actions/projectActions";
import { clearErrors } from "../actions/errorActions";
import { Redirect } from "react-router-dom";

import axios from "axios";

class CreateProject extends Component {
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
			coverPic: "",
			content: "",
			files: [],
			title: "",
			action: "",
			err_msg: "",
			msg: "",
		};

		this.coverPicRef = React.createRef();
	}

	componentDidUpdate(prevProps) {
		const { error } = this.props;
		console.log(error.msg.msg);
		if (error !== prevProps.error) {
			if (error.id !== null) {
				this.setState({ err_msg: error.msg.msg });
			} else {
				this.setState({ err_msg: null });
			}
		}

		if (this.props.projects !== prevProps.projects) {
			if (this.props.projects[0]) {
				this.setState({
					coverPic: this.props.projects[0].coverPic,
					content: this.props.projects[0].content,
					title: this.props.projects[0].title,
					author: this.props.projects[0].author,
					isExisting: true,
				});
			}
		}
	}

	myChange = (e) => {
		this.setState({ title: e.target.value });
	};

	onEditorChange = (content) => {
		this.setState({ content: content });
		console.log("Content:", content);
	};

	onFilesChange = (files) => {
		this.setState({ files: files });
	};

	coverImageHandler = () => {
		this.coverPicRef.current.click();
	};

	onCoverChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			let formData = new FormData();
			const config = {
				header: { "content-type": "multipart/form-data" },
			};
			formData.append("file", file);

			axios.post("/api/projects/uploadfiles", formData, config).then((res) => {
				if (res.data.success) {
					console.log("cover pic updated");
					this.setState(
						{ coverPic: "http://localhost:5000/" + res.data.url },
						() => console.log(this.state.coverPic),
					);
				} else {
					return alert("Failed to upload cover picture!");
				}
			});
		}
	};

	myAction = (e) => {
		this.setState({ action: e.target.name });
	};

	onSubmit = (e) => {
		e.preventDefault();
		this.props.clearErrors();
		this.setState({ msg: "" });

		let isPublic = false;
		const { title, content } = this.state;

		const isExisting = this.props.location.pathname !== "/create/project";

		if (isExisting) {
			this.props.getProject(this.props.match.params.id);
			isPublic =
				this.state.action === "publish" || this.props.projects[0].isPublic;
		}

		const _id = this.props.match.params.id || "";

		const project = {
			_id: _id,
			title: title,
			coverPic: this.state.coverPic,
			content: content,
			author: this.props.user._id,
			isPublic: isPublic,
		};
		if (!isExisting) {
			this.props.addProject(project);
		} else {
			this.props.updateProject(project);
		}

		if (isExisting) this.setState({ msg: "Project updated successfully" });
		else this.setState({ msg: "Project created successfully" });
	};

	render() {
		const addCoverPic = (
			<Fragment>
				<button type='button' onClick={this.coverImageHandler}>
					Choose File
				</button>
			</Fragment>
		);
		const editCoverPic = (
			<Fragment>
				<button type='button' onClick={this.coverImageHandler}>
					Edit
				</button>
				<button
					type='button'
					onClick={() => {
						this.setState({ coverPic: "" });
					}}
				>
					Remove
				</button>
			</Fragment>
		);
		return (
			<div>
				{this.props.location.pathname === "/create/project" &&
				this.props.projects[0] ? (
					<Redirect to={`/edit/${this.props.projects[0]._id}`} />
				) : null}
				<form onSubmit={this.onSubmit}>
					<p>title:</p>
					<input
						type='text'
						name='title'
						onChange={this.myChange}
						value={this.state.title}
					/>
					<br />
					<p>Cover Image</p>
					{/* Might have to modify this condition */}
					{this.state.coverPic ? editCoverPic : addCoverPic}
					<input
						type='file'
						accept='image/*'
						onChange={this.onCoverChange}
						ref={this.coverPicRef}
						style={{ display: "none" }}
					/>
					{/* modify alt later */}
					<img src={this.state.coverPic} alt='alt'></img>
					<QuillEditor
						placeholder={"Start Posting Something"}
						onEditorChange={this.onEditorChange}
						onFilesChange={this.onFilesChange}
					/>
					{this.state.msg && !this.state.err_msg ? (
						<Alert color='success'>{this.state.msg}</Alert>
					) : null}
					{this.state.err_msg ? (
						<Alert color='danger'>{this.state.err_msg}</Alert>
					) : null}
					<input
						type='submit'
						name='save'
						value='Save'
						onClick={this.myAction}
					/>
					<input
						type='submit'
						name='publish'
						value='Publish'
						onClick={this.myAction}
					/>
				</form>
			</div>
		);
	}
}

CreateProject.propTypes = {
	clearErrors: PropTypes.func.isRequired,
	updateProject: PropTypes.func.isRequired,
	addProject: PropTypes.func.isRequired,
	getProject: PropTypes.func.isRequired,
	loadUser: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
	projects: PropTypes.array.isRequired,
	user: PropTypes.object,
};

const mapStateToProps = (state) => ({
	projects: state.project.projects,
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user,
	error: state.error,
});

export default connect(mapStateToProps, {
	loadUser,
	getProject,
	addProject,
	updateProject,
	clearErrors,
})(CreateProject);
