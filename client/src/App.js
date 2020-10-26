import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import HomePage from "./components/HomePage";
import CreateProject from "./components/CreateProject";
import PrivateRoute from "./components/PrivateRoute";
import {loadUser} from "./actions/authActions";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import store from './store';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

class App extends Component {
	componentDidMount(){
		store.dispatch(loadUser());
	}
	render() {
		return (
			<div className="App">
				<AppNavbar />
				<div  >
					<Switch>
						<PrivateRoute exact path="/create/project" component={CreateProject} test="hjkh"/>
						<PrivateRoute exact path="/edit/:id" component={CreateProject} test="hjkh"/>
						<PrivateRoute exact path="/:name/projects" component={HomePage}/>
						<Route path="/" component={HomePage} />
					</Switch>
				</div>
			</div>
		);
	}
}

App.propTypes = {
	loadUser: PropTypes.func.isRequired,
  };
  
  export default connect(null, { loadUser })(App);