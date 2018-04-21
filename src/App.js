import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import ThreeEntry  from './components/three-entry';
import Setup from './components/setup';

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Route exact path="/setup" component={Setup} />
          <Route exact path="/" component={ThreeEntry}/>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
