import styled from 'styled-components';

export default styled.form`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: ${({alignItems}) => alignItems || 'center'};
    padding: 10px;
`