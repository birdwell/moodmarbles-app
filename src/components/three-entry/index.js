import React, { Component } from 'react';
import PropTypes from 'prop-types';

import threeEntryPoint from './components/threeEntryPoint';
import fallBackTweets from './data/coffee.json';

import Legend from './legend';
import './index.css';
import Tweet from './tweet';

export default class ThreeContainer extends Component {
    static propTypes = {
        location: PropTypes.shape({
            state: PropTypes.shape({
                tweets: PropTypes.array
            })
        }).isRequired
    }
    state = {
        tweets: [],
        filters: [],
        filteredTweets: []
    }

    componentDidMount() {
        const { state } = this.props.location;
        let config = {};
        if (state && state.tweets && state.tweets.length > 0) {
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

    onFilter = (emotion) => {
        const { filters, tweets } = this.state;

        if (filters.includes(emotion)) {
            const newFilters = filters.filter(filter => filter !== emotion);
            const newTweets = tweets.filter(x => newFilters.includes(x.emotion));

            this.setState({ filters: newFilters, filteredTweets: newTweets });
            //this.threeEntryPoint.updateTweets(newFilters.length === 0 ? tweets : newTweets);
        } else {
            const newFilters = [...filters, emotion];
            const newTweets = tweets.filter(x => newFilters.includes(x.emotion));

            this.setState({ filters: newFilters, filteredTweets: newTweets });
            //this.threeEntryPoint.updateTweets(newTweets);
        }
    }

    render() {
        const { hashtag, tweets, filters, filteredTweets } = this.state;

        return (
            <React.Fragment>
                <h3 className="hasttag-header">#{hashtag || ''}</h3>
                {tweets.length > 0 && (
                    <Legend onFilter={this.onFilter} filters={filters} tweets={tweets} />
                )}
                <div style={{ height: '100vh', width: '100%' }} ref={(element) => { this.threeRootElement = element; }} />
                <div className="timeline-column">
                    {
                        filteredTweets
                            .filter(x => (x.tweet ? !!x.tweet.id : false))
                            .map(tweet => <Tweet key={tweet.tweet.id} tweet={tweet} />)
                    }
                </div>
            </React.Fragment>
        );
    }
}
