import styled from 'styled-components';


export default styled.nav`
    display: flex;
    position:fixed;
    flex-direction: column;
    background-color: #ba0c2f;
    width: ${({w}) => w};
    height: 100vh;
    ${({boxShadow}) => boxShadow}
    transition: width .9s, box-shadow .9s;
    overflow: hidden;
    
    span:first-of-type {
        text-align: right;
        font-size: 35px;
        font-weight: bolder;
        padding: ${({expanded}) => expanded ? '0 10px 0 0' : '0 5px 0 0'};
        transition: padding .9s;

        &:hover {
            cursor: pointer;
        }
    }
`