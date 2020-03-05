import React, { useState } from 'react';
import {Link, Nav} from '../styledComponents';

const NavBar = () => {
    const [expanded, setExpanded] = useState(true);

    return (
        <Nav Width={expanded ? '20vw' : '5vw'} boxShadow={expanded ? 'box-shadow: #333 12px 2px 15px;' : ''}>
            <span onClick={() => setExpanded(!expanded)}>{expanded ? '<' : '>'}</span>
            <Link to='/' margin='20px 0 0 100px'>
                Home
            </Link>
        </Nav>
    )
}

export default NavBar;