import styled from 'styled-components';


export default styled.nav`
    display: flex;
    position:fixed;
    flex-direction: column;
    background-color: #ba0c2f;
    width: ${props => props.Width};
    height: 100vh;
    ${props => props.boxShadow}
    transition: width .9s, box-shadow .9s;
    overflow: hidden;

    &:hover {
        cursor: pointer;
    }
    
    span:first-of-type {
        text-align: right;
        font-size: 35px;
        font-weight: bolder;
        margin-right: 10px;

        &:hover {
            cursor: pointer;
        }
    }
`