import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => (
    <nav>
        <div className="nav-container">
            <div className="nav-logo">
                <a href="/">Home</a>
            </div>
            <ul className="nav-links">
                <li>
                    <NavLink exact to="/">
                        Choose Hashtag
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/three">Experience</NavLink>
                </li>
                <li>
                    <NavLink to="/insights">Insights</NavLink>
                </li>
            </ul>
        </div>
    </nav>
);

export default Nav;
