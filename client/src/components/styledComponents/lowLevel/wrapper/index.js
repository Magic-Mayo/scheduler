import styled from 'styled-components';

export default styled.div`
    display: flex;
    flex-direction: ${props => props.flexDirection || 'column'};
    justify-content: center;
    align-items: ${props => props.flexDirection ? '' : 'center'};
    width: ${props => props.width};
    height: ${props => props.height};
    margin: 0 auto;
`