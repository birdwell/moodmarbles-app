import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ThreeEntry from './components/three-entry';
import Setup from './components/setup';
import Nav from './components/nav';
import Insights from './components/insights';

/**
 * App
 * Three routes for the app:
 * / goes to the setup
 * /three goes to the 3D experience
 * /insights goes to the graph insights
 */
const App = () => (
    <Router>
        <React.Fragment>
            <Nav />
            <Route exact path="/" component={Setup} />
            <Route exact path="/three" component={ThreeEntry} />
            <Route path="/insights" component={Insights} />
        </React.Fragment>
    </Router>
);

export default App;
