import React from 'react';
import PropTypes from 'prop-types';
import { HashLoader } from 'react-spinners';

const Loader = ({ isLoading }) => {
	if (!isLoading) return null;

	return (
		<div className="loading-spinner">
			<h4 className="loading-header">Building results...</h4>
			<HashLoader
				color="#ffc107"
				size={100}
				loading={isLoading}
			/>
		</div>
	);
};

Loader.propTypes = {
	isLoading: PropTypes.bool.isRequired
};

export default Loader;
