import React from 'react';
import {Wrapper} from '../styledComponents';

const Modal = props => {
    return (
        <Wrapper
        position='fixed'
        margin='0 auto'
        top='25%'
        left='50%'
        transform='translateX(-47%)'
        w='400px'
        h='240px'
        bgColor='#fff'
        boxShadow='rgba(0,0,0,.7) 0 20px 15px 10px'
        padding='10px'
        justifyContent='space-evenly'
        maxWidth='70vw'
        zIndex='1000'
        >
            {props.children}
        </Wrapper>
    )
}

export default Modal;