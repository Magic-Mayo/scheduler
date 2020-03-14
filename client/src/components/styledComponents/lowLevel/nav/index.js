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
    z-index: 1000;
    
    .icon {
        text-align: right;
        padding-right: 9px;
        margin: ${({expanded}) => expanded ? '5px 0 0 150px' : '5px 0 0 5px'};
        transition: margin .9s;

        &:hover {
            cursor: pointer;
        }
    }
`