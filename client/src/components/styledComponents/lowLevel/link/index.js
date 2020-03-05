import styled from 'styled-components';
import {Link} from 'react-router-dom';

export default styled(Link)`
    display: inline-block;
    text-decoration: none;
    color: #eee;
    font-size: 25px;
    margin: ${props => props.margin || '30px 0 0 30px'};

    &:active {
        color: #ddd
    }
`;