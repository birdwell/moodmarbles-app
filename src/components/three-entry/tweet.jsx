import React from 'react';
import PropTypes from 'prop-types';
import { Tweet as TweetWidget } from 'react-twitter-widgets';

const Tweet = ({ tweet }) => {
	const { tweet: { id } } = tweet;
	const tweetId = id.toString();
	return (
		<TweetWidget tweetId={tweetId} options={{ cards: 'hidden', conversation: 'none', width: 300 }} />
	);
};

Tweet.propTypes = {
	tweet: PropTypes.shape({
		tweet: PropTypes.shape({
			id: PropTypes.string.isRequired
		}).isRequired
	}).isRequired
};

export default Tweet;
