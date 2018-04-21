import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getTweets } from '../../Api';
import './index.css';

class Setup extends Component {
	state = { 
		count: 0,
		hashtag: ''
	}
	
	onChange = ({ target: { name, value }}) => {
		this.setState({ [name]: value });
	}

	onSubmit = async (e) => {
		e.preventDefault();
		const tweets = await getTweets(this.state);
		const { history } = this.props;
		history.push('/three', { tweets });
	}

	render() {
		const { count, hashtag } = this.state;
		return (
			<div className="row">
				<div className="setup-experience col-lg-6 col-md-8 col-sm-12">
					<h3 className="setup-header">Mood Marbles Experience</h3>
					<form onSubmit={this.onSubmit}>
						<div className="form-control">
							<label htmlFor="hashtag">Hashtash</label>
							<input value={hashtag} name="hashtag" onChange={this.onChange} type="text" />
						</div>

						<div className="form-control">
							<label htmlFor="count">Count</label>
							<input value={count} name="count" type="number" min="1" max="50" onChange={this.onChange} />
						</div>
						<button className="button-primary-outlined" type="submit">Start Experience</button>
					</form>
				</div>
			</div>
		);
	}
}

export default withRouter(Setup);