import React from 'react';
import PropTypes from 'prop-types';
import { Dot } from 'recharts';

const ScatterLabel = ({ cx, cy, fill, emoji }) => (
	<g>
		<Dot cx={cx} cy={cy} r={2} fill={fill} />
		<text x={cx} y={cy}>{emoji}</text>
	</g>
);

ScatterLabel.propTypes = {
	cx: PropTypes.number.isRequired,
	cy: PropTypes.number.isRequired,
	fill: PropTypes.string.isRequired,
	emoji: PropTypes.string.isRequired
};

export default ScatterLabel;
