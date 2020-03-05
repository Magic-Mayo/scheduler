import styled from 'styled-components';

export default styled.label`
    font-size: ${props => props.fontSize || '13px'};
    font-weight: bold;
    margin: ${props => props.margin || '10px'}
`