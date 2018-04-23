import React from 'react';
import { Dot } from 'recharts';

const ScatterLabel = (props) => {
	const { cx, cy, fill, emoji } = props;
	return (
		<g>
			<Dot cx={cx} cy={cy} r={2} fill={fill} />
			<text x={cx} y={cy}>{emoji}</text>
		</g>
	);
};

export default ScatterLabel;