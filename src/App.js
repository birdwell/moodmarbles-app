import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ThreeEntry  from './components/three-entry';
import Setup from './components/setup';

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Route exact path="/" component={Setup} />
          <Route exact path="/three" component={ThreeEntry}/>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
