import styled from 'styled-components';

export default styled.div`
    display: ${props => props.display || 'flex'};
    ${props => props.display === 'grid' ? 
    `grid-template-columns: repeat(7, 1fr)`
    : ''};
    flex-direction: ${props => props.flexDirection || 'column'};
    justify-content: ${props => props.justifyContent || 'center'};
    align-items: ${props => props.alignItems ? props.alignItems : props.flexDirection ? '' : 'center'};
    width: ${props => props.Width || ''};
    height: ${props => props.Height || ''};
    border: ${props => props.border || ''};
    background-color: ${props => props.bgColor || ''};
    box-shadow: ${props => props.boxShadow || ''};
    grid-column: ${props => props.gridColumn || ''};
    ${props => props.fontSize ? `font-size: ${props.fontSize};` : '' }
    border-left: ${props => props.borderLeft || ''};
    border-right: ${props => props.borderRight || ''};
    border-bottom: ${props => props.borderBottom || ''};


    &.calendar-month {
        span:first-of-type:hover, span:last-of-type:hover {
            cursor: pointer
        }
    }
`