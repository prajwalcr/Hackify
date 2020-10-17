import React, { Component } from "react";
import AppNavbar from "./components/AppNavbar";
import { container } from "reactstrap";

import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/authActions";

import "./App.css";

class App extends Component {
	componentDidMount() {
		store.dispatch(loadUser);
	}
	render() {
		return (
			<div className="App">
				<Provider store={store}>
					<h1>Let's do this</h1>
				</Provider>
			</div>
		);
	}
}

export default App;
