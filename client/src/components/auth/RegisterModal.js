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
		phone: "",
		password: "",
		msg: null,
		formErrors: {
			name: { isError: "", msg: "" },
			email: { isError: "", msg: "" },
			phone: { isError: "", msg: "" },
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
		const emailReg = RegExp(
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		);
		const passReg = RegExp(
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
		);
		const { name, value } = e.target;
		console.log("value", value, typeof value);
		const { formErrors } = this.state;
		switch (name) {
			case "name":
				if (!isNaN(value)) {
					formErrors.name.isError = "invalid";
					formErrors.name.msg = "Enter a valid name";
				} else if (value !== "") {
					formErrors.name.isError = "valid";
					formErrors.name.msg = "";
				} else {
					formErrors.name.isError = "";
					formErrors.name.msg = "";
				}
				break;
			case "email":
				if (!emailReg.test(value)) {
					formErrors.email.msg = "Enter a valid email";
					formErrors.email.isError = "invalid";
				} else if (emailReg.test(value)) {
					formErrors.email.isError = "valid";
					formErrors.email.msg = "";
				} else {
					formErrors.email.isError = "";
					formErrors.email.msg = "";
				}
				break;
			case "phone":
				if (value.length < 10 || value.length === 11 || value.length > 13) {
					formErrors.phone.msg = "Enter a valid phone number";
					formErrors.phone.isError = "invalid";
				} else if (
					value.length === 10 ||
					value.length === 12 ||
					value.length === 13
				) {
					formErrors.phone.isError = "valid";
					formErrors.phone.msg = "";
				} else {
					formErrors.phone.isError = "";
					formErrors.phone.msg = "";
				}
				break;
			case "password":
				if (!passReg.test(value)) {
					formErrors.password.msg = "Enter a valid password";
					formErrors.password.isError = "invalid";
				} else if (passReg.test(value)) {
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

		const { name, email, phone, password } = this.state;
		var errMsg = "";
		if (this.state.formErrors.name.isError === "invalid") {
			errMsg = "Enter a valid name";
		}
		if (this.state.formErrors.email.isError === "invalid") {
			errMsg = "Enter a valid email";
		}
		if (this.state.formErrors.phone.isError === "invalid") {
			errMsg = "Enter a valid phone number";
		}
		if (this.state.formErrors.password.isError === "invalid") {
			errMsg = "Enter a valid password";
		}

		// Create user object
		const newUser = {
			name,
			email,
			phone,
			password,
			errMsg,
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
								<Label for='phone'>Phone</Label>
								<Input
									type='number'
									name='phone'
									id='phone'
									placeholder='Phone'
									className='mb-0'
									onChange={this.onChange}
									invalid={this.state.formErrors.phone.isError === "invalid"}
									valid={this.state.formErrors.phone.isError === "valid"}
								/>
								<FormFeedback invalid>
									{this.state.formErrors.phone.msg}
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
									8 characters or more. Must have atleast 1 Capital letter,
									Small letter, Special character and Number
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
