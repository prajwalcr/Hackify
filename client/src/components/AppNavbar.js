import React, { Component, Fragment } from "react";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	Container,
	NavbarText,
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";
import Logout from "./auth/Logout";

class AppNavbar extends Component {
	state = {
		isOpen: false,
	};

	static propTypes = {
		auth: PropTypes.object.isRequired,
	};

	toggle = () => {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	};

	render() {
		const { isAuthenticated, user } = this.props.auth;
		let myProjectsPath = "/";
		if (user) {
			myProjectsPath = `/${user.name}/projects`;
		}

		const authLinks = (
			<Fragment>
				<NavItem>
					<NavLink href='/create/project'> + </NavLink>
				</NavItem>
				<NavItem>
					<NavLink href={myProjectsPath}> My Projects </NavLink>
				</NavItem>
				<NavItem>
					<Logout />
				</NavItem>
			</Fragment>
		);

		const authName = (
			<Fragment>
				<NavbarText className='ml-auto'>
					<span>
						<strong>{user ? `Welcome ${user.name}` : ""}</strong>
					</span>
				</NavbarText>
			</Fragment>
		);

		const guestLinks = (
			<Fragment>
				<NavItem>
					<RegisterModal />
				</NavItem>
				<NavItem>
					<LoginModal />
				</NavItem>
			</Fragment>
		);

		return (
			<div>
				<Navbar color='dark' dark fixed='top' expand='sm' className='mb-5'>
					<Container>
						<NavbarBrand href='/'>Hackify</NavbarBrand>
						<NavbarToggler onClick={this.toggle}></NavbarToggler>
						<Collapse isOpen={this.state.isOpen} navbar>
							{isAuthenticated ? authName : null}
							<Nav className='ml-auto' navbar>
								<NavItem>
									<NavLink href='/'> Home </NavLink>
								</NavItem>
								{isAuthenticated ? authLinks : guestLinks}
							</Nav>
						</Collapse>
					</Container>
				</Navbar>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, null)(AppNavbar);
