import React, { Component } from 'react';
import { withRouter } from 'react-router';

import { getTweets, getCachedHashTags } from '../../Api';
import './index.css';
import Loading from './loading';

class Setup extends Component {
	state = { 
		count: 1,
		hashtag: '',
		cachedHashTags: [],
		cachedHashTag: '',
		isCached: false,
		isLoading: false,
		error: ''
	}

	componentDidMount = () => {
		getCachedHashTags()
			.then(cachedHashTags => {
				this.setState({ cachedHashTags });
			});
	}
	
	onChange = ({ target: { name, value }}) => {
		this.setState({ [name]: value, error: '' });
	}

	toggleCached = () => {
		this.setState({ isCached: !this.state.isCached });
	}

	onSubmit = async (e) => {
		e.preventDefault();
		const { count, cachedHashTag, isCached } = this.state;
		const hashtag = isCached ? cachedHashTag : this.state.hashtag;

		this.setState({ isLoading: true });

		try {
			const tweets = await getTweets({ hashtag, count });
			const { history } = this.props;
			history.push('/three', { tweets, hashtag, count });
		} catch (error) {
			this.setState({ isLoading: false, error: 'Unable to get tweets.' });
		}


	}

	render() {
		const { count, hashtag, isCached, cachedHashTag, cachedHashTags, error } = this.state;

		return (
			<React.Fragment>
				<div className="row">
					<div className="setup-experience col-lg-6 col-md-8 col-sm-12">
						<h3 className="setup-header">HashTag Experience</h3>
						{error != '' && <p className="alert alert-danger">{ error }</p>}
						<form onSubmit={this.onSubmit}>
							{!isCached && (
								<React.Fragment>
									<div className="form-control">
										<label htmlFor="hashtag">Hashtags</label>
										<input value={hashtag} name="hashtag" onChange={this.onChange} type="text" />
									</div>
									<div className="choose-cached" onClick={this.toggleCached}>
										Choose from cached hashtags (🏎️)
								</div>
								</React.Fragment>
							)}
							{isCached && (
								<React.Fragment>
									<div className="form-control">
										<label>Cached Hashtags</label>
										<select value={cachedHashTag} name="cachedHashTag" onChange={this.onChange}>
											{
												cachedHashTags.map(cachedTag =>
													(<option key={cachedTag} value={cachedTag}>{cachedTag}</option>)
												)
											}
										</select>
									</div>
									<div className="choose-cached" onClick={this.toggleCached}>
										Choose a hashtag (🐌)
								</div>
								</React.Fragment>
							)}

							<div className="form-control">
								<label htmlFor="count">Count</label>
								<input value={count} name="count" type="number" min="1" max="50" onChange={this.onChange} />
							</div>
							<button className="button-primary-outlined" type="submit">👍 Go</button>
						</form>

					</div>
				</div>
				<Loading isLoading={this.state.isLoading} />
			</React.Fragment>
		);
	}
}

export default withRouter(Setup);