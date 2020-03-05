import styled from 'styled-components';

export default styled.button`
    background-color: ${props => props.bgColor || '#172a55'};
    width: 125px;
    height: 50px;
    color: ${props => props.color || '#fff'};
    border-radius: 7px;
    border: none;
    box-shadow: #444 7px 5px 15px;
    font-size: 18px;

    &:active {
        box-shadow: none;
        border-radius: 7px;
    }

    &:hover {
        cursor: pointer;
    }
`;