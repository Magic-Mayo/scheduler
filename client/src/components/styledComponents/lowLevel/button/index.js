import styled from 'styled-components';

export default styled.button`
    background-color: ${props => props.bgColor || '#172a55'};
    width: ${props => props.Width || '125px'};
    height: ${props => props.Height || '50px'};
    color: ${props => props.Color || '#fff'};
    border-radius: ${props => props.borderRadius || '7px'};
    border: ${props => props.border || 'none'};
    box-shadow: ${props => props.boxShadow ? '#444 7px 5px 15px' : ''};
    font-size: 18px;
    justify-content: ${props => props.justifyContent || ''};
    display: ${props => props.display || ''};
    padding: 8px;
    vertical-align: text-top;

    ${props => !props.calendar ?
        `&:active {
            box-shadow: none;
            border-radius: 7px;
        }` : ''
    }

    &:focus {
        outline: none;
    }

    &:hover {
        cursor: pointer;
    }
`;