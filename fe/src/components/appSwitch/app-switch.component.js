import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
	getAppChoice,
	setAppChoice,
} from "./../../services/applicationChoice/app-choice";

import { Button, Radio, FormControlLabel, RadioGroup } from "@material-ui/core";

// Could create a Static directory.
const BASIC = "/basic";
const FULL = "/full";

const checkPreselect = async () => {
	const selection = await getAppChoice();

	if (typeof selection !== "undefined") {
		return selection;
	}
	return null;
};
/**
 * I'm thinking here I ask which app the user would like to use.
 * Save the choice in the indexedDB.
 *
 * Also have choices for them to switch even after they've selected.
 */
export default class AppSwitch extends Component {
	constructor() {
		super();

		this.state = {
			isModernApp: false,
			redirect: false,
			location: "",
		};

		this.onRadioChange = this.onRadioChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		checkPreselect().then((selection) => {
			if (selection) {
				this.setState({ redirect: true, location: selection });
			}
		});
	}

	onRadioChange = (e) => {
		let res = false;

		if (e.target.value === "true") {
			res = true;
		}
		this.setState({
			isModernApp: res,
		});
	};

	onSubmit = (e) => {
		e.preventDefault();
		const res = this.state.isModernApp;

		this.setState({ redirect: true });
		if (res) {
			// New app
			setAppChoice(FULL);
			this.setState({ location: FULL });
		} else {
			// Basic app
			setAppChoice(BASIC);
			this.setState({ location: BASIC });
		}
	};

	render() {
		if (this.state.redirect) {
			return <Redirect to={this.state.location} />;
		}
		return (
			<div>
				<h1>Welcome to my first PWA!</h1>
				<p>
					Just to expalin, there are 2 applications. A basic todo
					application and a Task Sharing Application. The Basic
					application requires nothing to start, just click the button
					and you are on your way! The Task sharing application will
					require an email login to get the full functionality.
				</p>
				<h3>Which app would you like start out with?</h3>
				<h5>
					Don't worry, you can always switch between the applications
					:)
				</h5>
				<form onSubmit={this.onSubmit}>
					<RadioGroup onChange={this.onRadioChange}>
						<FormControlLabel
							checked={!this.state.isModernApp}
							value={false}
							control={<Radio />}
							label="Basic ToDo App"
						/>
						<FormControlLabel
							checked={this.state.isModernApp}
							value={true}
							control={<Radio />}
							label="Task Sharing App"
						/>
					</RadioGroup>

					<Button variant="contained" color="primary" type="submit">
						Choose App
					</Button>
				</form>
			</div>
		);
	}
}
