import styled from 'styled-components';
import {Link} from 'react-router-dom';

export default styled(Link)`
    display: inline-block;
    text-decoration: none;
    color: #eee;
    font-size: 25px;
    padding: 10px;
    margin: ${props => props.margin || '0'};
    z-index: 1;
    
    &:active {
        color: #ddd
    }
    
    &:hover:before {
        background-color: #172a55;
    }
    
    ${props => props.expanded ?
        
        `&:before {
            content: 'Home';
            position: absolute;
            width: 190px;
            height: 53px;
        }`
        :
        ""
    }

`;