import React, { Component } from 'react';
import threeEntryPoint from './components/threeEntryPoint';
import fallBackTweets from './data/coffee.json';

import './index.css';

export default class ThreeContainer extends Component {

    state = {}

    componentDidMount() {   
        const state = this.props.location.state;
        let config = {};
        if(state && state.tweets && state.tweets.length > 0) {
            const { tweets, hashtag, count } = state;
            config = { tweets, hashtag, count };
        } else {
            config.tweets = fallBackTweets;
            config.hashtag = "coffee";
            config.count = fallBackTweets.length;
        }

        this.threeEntryPoint = threeEntryPoint(this.threeRootElement, config);
        this.setState({ ...config });
    }

    componentWillUnmount() {
        if (this.threeEntryPoint) {
            this.threeEntryPoint.cleanup();
        }
    }

    render() {
        const { hashtag } = this.state;
        return (
            <React.Fragment>
                <div className="hasttag-header">{hashtag || ''}</div>
                <div style={{ height: '100vh', width: '100%' }} ref={element => (this.threeRootElement = element)} />
            </React.Fragment>
        );
    }
}
