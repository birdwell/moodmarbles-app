// http://localhost:5001/twitter/tweets?hashtag=thunderup
import queryString from 'query-string';

export const getTweets = async ({ hashtag, count = 15} ) => {
	const query = queryString.stringify({ hashtag, count });
	const response = await fetch('/twitter/tweets?' + query);
	const tweets = await response.json();
	return tweets;
};