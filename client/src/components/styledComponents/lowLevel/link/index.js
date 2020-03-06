import styled from 'styled-components';
import {Link} from 'react-router-dom';

export default styled(Link)`
    display: inline-block;
    text-decoration: none;
    color: #eee;
    font-size: 25px;
    padding: ${({padding}) => padding || '10px'};
    margin: ${({margin}) => margin || '0'};
    width: ${({Width}) => Width || ''};
    
    &:active {
        color: #ddd
    }
    
    &:hover {
        background-color: #172a55;
    }
`;