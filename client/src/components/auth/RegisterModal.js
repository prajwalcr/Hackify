import React, { Component } from "react";
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	FormGroup,
	FormFeedback,
	FormText,
	Label,
	Input,
	NavLink,
	Alert,
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { register } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";

class RegisterModal extends Component {
	state = {
		modal: false,
		name: "",
		email: "",
		password: "",
		msg: null,
		formErrors: {
			name: { isError: "", msg: "" },
			email: { isError: "", msg: "" },
			password: { isError: "", msg: "" },
		},
	};

	static propTypes = {
		clearErrors: PropTypes.func.isRequired,
		register: PropTypes.func.isRequired,
		isAuthenticated: PropTypes.bool,
		error: PropTypes.object.isRequired,
	};

	componentDidUpdate(prevProps) {
		const { error, isAuthenticated } = this.props;
		if (error !== prevProps.error) {
			// Check for register error
			if (error.id === "REGISTER_FAIL") {
				this.setState({ msg: error.msg.msg });
			} else {
				this.setState({ msg: null });
			}
		}

		if (this.state.modal) {
			if (isAuthenticated) {
				this.toggle();
			}
		}
	}

	toggle = () => {
		// Clear errors
		this.props.clearErrors();
		this.setState({
			modal: !this.state.modal,
		});
	};

	onChange = (e) => {
		const { name, value } = e.target;
		const { formErrors } = this.state;
		switch (name) {
			case "name":
				if (1 /*add validation*/) {
					formErrors.name.isError = "invalid";
					formErrors.name.msg = "Enter a valid name";
				} else if (2 /*add validation*/) {
					formErrors.name.isError = "valid";
					formErrors.name.msg = "";
				} else {
					formErrors.name.isError = "";
					formErrors.name.msg = "";
				}
				break;
			case "email":
				if (1 /*add validation*/) {
					formErrors.email.msg = "Enter a valid email";
					formErrors.email.isError = "invalid";
				} else if (2 /*add validation*/) {
					formErrors.email.isError = "valid";
					formErrors.email.msg = "";
				} else {
					formErrors.email.isError = "";
					formErrors.email.msg = "";
				}
				break;
			case "password":
				if (1 /*add validation*/) {
					formErrors.password.msg = "Enter a valid password";
					formErrors.password.isError = "invalid";
				} else if (2 /*add validation*/) {
					formErrors.password.isError = "valid";
					formErrors.password.msg = "";
				} else {
					formErrors.password.isError = "";
					formErrors.password.msg = "";
				}
				break;
			default:
				break;
		}
		this.setState({ [name]: value, formErrors: formErrors });
	};

	onSubmit = (e) => {
		e.preventDefault();

		const { name, email, password } = this.state;

		// Create user object
		const newUser = {
			name,
			email,
			password,
		};

		// Attempt to register
		this.props.register(newUser);
	};

	render() {
		return (
			<div>
				<NavLink onClick={this.toggle} href='#'>
					Register
				</NavLink>

				<Modal isOpen={this.state.modal} toggle={this.toggle}>
					<ModalHeader toggle={this.toggle}>Register</ModalHeader>
					<ModalBody>
						{this.state.msg ? (
							<Alert color='danger'>{this.state.msg}</Alert>
						) : null}
						<Form onSubmit={this.onSubmit}>
							<FormGroup>
								<Label for='name'>Name</Label>
								<Input
									type='text'
									name='name'
									id='name'
									placeholder='Name'
									className='mb-0'
									onChange={this.onChange}
									maxLength='30'
									invalid={this.state.formErrors.name.isError === "invalid"}
									valid={this.state.formErrors.name.isError === "valid"}
								/>
								<FormFeedback invalid>
									{this.state.formErrors.name.msg}
								</FormFeedback>
								<FormText>Max 30 characters</FormText>
							</FormGroup>
							<FormGroup>
								<Label for='email'>Email</Label>
								<Input
									type='text'
									name='email'
									id='email'
									placeholder='Email'
									className='mb-0'
									onChange={this.onChange}
									invalid={this.state.formErrors.email.isError === "invalid"}
									valid={this.state.formErrors.email.isError === "valid"}
								/>
								<FormFeedback invalid>
									{this.state.formErrors.email.msg}
								</FormFeedback>
							</FormGroup>
							<FormGroup>
								<Label for='password'>Password</Label>
								<Input
									type='password'
									name='password'
									id='password'
									placeholder='Password'
									className='mb-0'
									onChange={this.onChange}
									invalid={this.state.formErrors.password.isError === "invalid"}
									valid={this.state.formErrors.password.isError === "valid"}
								/>
								<FormFeedback invalid>
									{this.state.formErrors.password.msg}
								</FormFeedback>
								<FormFeedback valid>
									{this.state.formErrors.password.msg}
								</FormFeedback>
								<FormText>
									6 characters or more. Must have atleast 1 Capital letter,
									Special character and Number
								</FormText>
							</FormGroup>
							<FormGroup>
								<Button color='dark' style={{ marginTop: "2rem" }} block>
									Register
								</Button>
							</FormGroup>
						</Form>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	error: state.error,
});

export default connect(mapStateToProps, { register, clearErrors })(
	RegisterModal,
);
