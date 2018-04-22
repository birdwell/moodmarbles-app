import React from 'react';
import { Tweet as TweetWidget } from 'react-twitter-widgets';

const Tweet = ({ tweet }) => {
	const { tweet: { username, tweetUrl, createdAt, profileUrl, name, id }} = tweet;
	const tweetId = id.toString();
	return (
		<TweetWidget tweetId={tweetId} options={{ cards: 'hidden', conversation: 'none', width: 300 }} />
	);
};

export default Tweet;
