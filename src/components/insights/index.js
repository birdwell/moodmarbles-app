import React from 'react';
import PropTypes from 'prop-types';
import {
	Radar, RadarChart, PolarGrid,
	PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import coffee from '../three-entry/data/coffee.json';
import ReachMag from './charts/reach-mag';
import './index.css';

const getCount = (tweets, emotion) => tweets.filter(x => x.emotion === emotion).length;

const Insights = ({ location }) => {
	const state = location.state || { tweets: coffee, hashtag: 'coffee' };
	const { tweets, hashtag } = state;

	const counts = [getCount(tweets, 'joy'), getCount(tweets, 'anger'),
					getCount(tweets, 'sadness'), getCount(tweets, 'fear'),
					getCount(tweets, 'disgust')];
	const fullMark = Math.max(...counts);

	const data = [
		{ emotion: '😁', A: counts[0], fullMark },
		{ emotion: '😠', A: counts[1], fullMark },
		{ emotion: '😭', A: counts[2], fullMark },
		{ emotion: '😱', A: counts[3], fullMark },
		{ emotion: '🤮', A: counts[4], fullMark },
	];

	return (
		<div className="data">
			<h3 className="data-title">#{hashtag}</h3>
			<div className="tweet-charts">
				<RadarChart width={500} height={500} data={data}>
					<PolarGrid />
					<PolarAngleAxis dataKey="emotion" />
					<PolarRadiusAxis angle={18} domain={[0, fullMark]} />
					<Radar name={hashtag} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
				</RadarChart>
				<ReachMag tweets={tweets} />
			</div>
		</div>
	);
};

Insights.propTypes = {
	location: PropTypes.shape({
		state: PropTypes.shape({
			tweets: PropTypes.array
		})
	}).isRequired
};

export default Insights;
