import React, { Component } from 'react';

import './legend.css';

import sadness from './components/assets/sad.png';
import joy from './components/assets/joy.png';
import anger from './components/assets/angry.png';
import fear from './components/assets/fear.png';
import disgust from './components/assets/disgust.jpg';
import cx from 'classnames';

const mood = {
	sadness,
	joy,
	anger,
	fear,
	disgust
};

const Legend = ({ tweets, onFilter, filters }) => {
	const emotions = { joy: 0, sadness: 0, anger: 0, fear: 0, disgust: 0 };
	tweets.forEach(tweet => emotions[tweet.emotion] += 1);
	return (
		<div className="legend">
			{
				Object.entries(emotions).map(emotion => { 
					const isActive = filters.includes(emotion[0]);
					return (
						<div
							onClick={() => onFilter(emotion[0])}
							key={emotion[0]} 
							className={cx('emotion', { 'active': isActive })}
						>
							<div style={{ backgroundImage: `url(${mood[emotion[0]]})` }} className="emoji-label" />
							<div className="emotion-count">{emotion[1]}</div>
						</div>
					)
				})
			}
		</div>
	);
};

export default Legend;