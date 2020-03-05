import React, { useState } from 'react';
import {Link, Nav} from '../styledComponents';

const NavBar = () => {
    const [expanded, setExpanded] = useState(true);

    return (
        <Nav onClick={() => setExpanded(!expanded)} Width={expanded ? '200px' : '50px'} boxShadow={expanded ? 'box-shadow: #333 12px 5px 15px;' : 'box-shadow: #333 3px 5px 15px;'}>
            <span >{expanded ? '<' : '>'}</span>
            <Link to='/' margin='0 0 0 80px;'>
                Home
            </Link>
        </Nav>
    )
}

export default NavBar;