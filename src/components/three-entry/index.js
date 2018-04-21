import React, { Component } from 'react';
import threeEntryPoint from './components/threeEntryPoint';
import fallBackTweets from './data/coffee.json';

export default class ThreeContainer extends Component {
    componentDidMount() {

        const tweets = [];
        const state = this.props.location.state;
        if(state && state.tweets && state.tweets.length > 0) {
            tweets = state.tweet;
        } else {
            tweets = fallBackTweets;
        }

        threeEntryPoint(this.threeRootElement, tweets);
    }
    render() {
        return <div style={{ height: '100vh', width: '100%' }} ref={element => (this.threeRootElement = element)} />;
    }
}
