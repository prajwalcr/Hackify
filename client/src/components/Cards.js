import React from "react";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "./grid.css";
import { Component } from "react";

export default class CardPrint extends Component {
	render() {
		return (
			<div className='Box'>
				<Card style={{ width: "18rem" }}>
					<Card.Img variant='top' src={this.props.image} />
					<Card.Body>
						<Card.Title>{this.props.title}</Card.Title>
						<Button variant='primary' href={this.props.view}>
							Open Project
						</Button>
						{this.props.edit ? (
							<Button variant='primary' href={this.props.edit}>
								Edit Project
							</Button>
						) : null}
					</Card.Body>
				</Card>
			</div>
		);
	}
}
