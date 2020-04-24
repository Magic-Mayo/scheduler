import styled from 'styled-components';

export default styled.p`
    font-size: ${({fontS}) => fontS || '18px'};
    font-weight: ${({fontW}) => fontW || ''};
    font-style: ${({fontStyle}) => fontStyle || ''};
    grid-column: ${({gridColumn}) => gridColumn || ''};
    text-align: ${({textAlign}) => textAlign || 'left'};
    width: ${({w}) => w || ''};
    height: ${({h}) => h || ''};
    background-color: ${({bgColor}) => bgColor || ''};
    color: ${({fontColor}) => fontColor || ''};
    margin: ${({margin}) => margin || ''};
    padding: ${({padding}) => padding || ''};
    white-space: ${({whiteSpace}) => whiteSpace || ''};
    opacity: ${({opacity}) => opacity || ''};
    position: ${({position}) => position || ''};
    top: ${({top}) => top || ''};
    ${({border}) => border || ''};
    line-height: ${({lineHeight}) => lineHeight || ''};
    max-width: ${({maxWidth}) => maxWidth || ''};
    `