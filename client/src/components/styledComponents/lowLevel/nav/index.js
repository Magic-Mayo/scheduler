import styled, { keyframes } from 'styled-components';


export default styled.nav`
    display: flex;
    flex-direction: column;
    left: 0;
    background-color: #ba0c2f;
    width: ${props => props.Width};
    height: 100vh;
    padding-right: 10px;
    ${props => props.boxShadow}
    transition: width .9s, box-shadow .9s;
    overflow: hidden;
    
    span:first-of-type {
        text-align: right;
        font-size: 35px;
        font-weight: bolder;

        &:hover {
            cursor: pointer;
        }
    }
`