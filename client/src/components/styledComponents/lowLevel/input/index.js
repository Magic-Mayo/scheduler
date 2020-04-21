import styled from 'styled-components';

export default styled.input`
    width: ${({type}) => type === 'checkbox' ? '' : '250px'};
    height: 25px;
    margin: ${({margin}) => margin || '10px'};
    padding: 5px;
    border-radius: 5px;
    font-size: 15px;
    opacity: ${({opacity}) => opacity || ''};
    position: ${({position}) => position || ''};
`