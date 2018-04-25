import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Label } from 'recharts';
import ScatterLabel from './scatter-label';

const getData = (tweets, emotion) => {
	return tweets.filter(x => x.emotion === emotion)
	.map((x) => {
		const y = (x.tweet.favorites || 0) + (x.tweet.retweets || 0)
		return { x: (x.magnitude || 0), y: y }
	});
}
 
const SimpleScatterChart = ({ tweets }) => {
	if (!tweets[0].tweet) {
		return null;
	}

	const joyData = getData(tweets, 'joy');
	const angerData = getData(tweets, 'anger');
	const sadnessData = getData(tweets, 'sadness')
	const fearData = getData(tweets, 'fear');
	const disgustData = getData(tweets, 'disgust');

	return (
		<ScatterChart width={400} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
			<CartesianGrid />
			<XAxis dataKey={'x'} type="number" name="Emotion Magnitude">
				<Label position='bottom'>
					Emotional Magnitude
    			</Label>
			</XAxis>
			<YAxis dataKey={'y'} type="number" name='Interaction'>
				<Label angle={270} position='left' style={{ textAnchor: 'middle' }}>
					Interaction
    			</Label>
			</YAxis>
			<Scatter name='Joy' data={joyData} shape={<ScatterLabel emoji="😁" />} />
			<Scatter name='Anger' data={angerData} shape={<ScatterLabel emoji="😠" />} />
			<Scatter name='Sadness' data={sadnessData} shape={<ScatterLabel emoji="😭" />} />
			<Scatter name='Fear' data={fearData} shape={<ScatterLabel emoji="😱" />} />
			<Scatter name='Disgust' data={disgustData} shape={<ScatterLabel emoji="🤮" />} /> */}
			<Tooltip cursor={{ strokeDasharray: '3 3' }} />
		</ScatterChart>
	);
};

export default SimpleScatterChart;