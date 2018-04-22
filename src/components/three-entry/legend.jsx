import React, { Component } from 'react';

import './legend.css';

import sadness from './components/assets/sad.svg';
import joy from './components/assets/joy.png';
import anger from './components/assets/angry.png';
import fear from './components/assets/fear.png';
import disgust from './components/assets/disgust.jpg';

const mood = {
	sadness,
	joy,
	anger,
	fear,
	disgust
};

const Legend = ({ tweets }) => {
	const emotions = { joy: 0, sadness: 0, anger: 0, fear: 0, disgust: 0 };
	tweets.forEach(tweet => emotions[tweet.emotion] += 1);
	return (
		<div className="legend">
			{
				Object.entries(emotions).map(emotion => (
					<div key={emotion[0]} className="emotion">
						<div style={{ backgroundImage: `url(${mood[emotion[0]]})` }} className="emoji-label" />
						<div className="emotion-count">{emotion[1]}</div>
					</div>
				))
			}
		</div>
	);
};

export default Legend;