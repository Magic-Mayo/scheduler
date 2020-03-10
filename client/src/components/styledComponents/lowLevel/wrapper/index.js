import styled from 'styled-components';

export default styled.div`
    display: ${props => props.display || 'flex'};
    ${({grid}) => grid && grid === 'grid' ? `grid-template-columns: repeat(7, 1fr)`
    : grid === 'grid1' ? `grid-template-columns: repeat(5, 1fr)`
    : ''};
    flex-direction: ${props => props.flexDirection || 'column'};
    justify-content: ${props => props.justifyContent || 'center'};
    align-items: ${props => props.alignItems ? props.alignItems : props.flexDirection ? '' : 'center'};
    width: ${({w}) => w || ''};
    height: ${({h}) => h || ''};
    border: ${props => props.border || ''};
    background-color: ${props => props.bgColor || ''};
    box-shadow: ${props => props.boxShadow || ''};
    grid-column: ${props => props.gridColumn || ''};
    ${({fontS}) => fontS ? `font-size: ${fontS}` : '' };
    border-left: ${props => props.borderLeft || ''};
    border-right: ${props => props.borderRight || ''};
    border-bottom: ${props => props.borderBottom || ''};
    margin: ${props => props.margin || ''};
    position: ${({position}) => position || ''};
    top: ${({top}) => top || ''};


    &.calendar-month {
        span:first-of-type:hover, span:last-of-type:hover {
            cursor: pointer
        }
    }
`