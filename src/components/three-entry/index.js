import React, { Component } from 'react';
import threeEntryPoint from './components/threeEntryPoint';


export default class ThreeContainer extends Component {
    componentDidMount() {
        threeEntryPoint(this.threeRootElement);
    }
    render() {
        return <div style={{ height: '100vh', width: '100%' }} ref={element => (this.threeRootElement = element)} />;
    }
}
