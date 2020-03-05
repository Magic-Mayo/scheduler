import styled from 'styled-components';

export default styled.div`
    display: flex;
    flex-direction: ${props => props.flexDirection || 'column'};
    justify-content: ${props => props.justifyContent || 'center'};
    align-items: ${props => props.flexDirection ? '' : 'center'};
    width: ${props => props.Width || ''};
    height: ${props => props.Height || ''};
    border: ${props => props.border || ''};
    background-color: ${props => props.bgColor || ''}
`