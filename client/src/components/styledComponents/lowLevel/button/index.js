import styled from 'styled-components';

export default styled.button`
    background-color: ${({bgColor}) => bgColor || '#172a55'};
    width: ${({w}) => w || '125px'};
    height: ${({h}) => h || '50px'};
    color: ${({fontColor}) => fontColor || '#fff'};
    border-radius: ${({borderRadius}) => borderRadius || '7px'};
    box-shadow: ${props => props.boxShadow ? '#444 7px 5px 15px' : ''};
    border: ${({border}) => border || 'none'};
    font-size: ${({fontS}) => fontS || '18px'};
    justify-content: ${props => props.justifyContent || ''};
    display: ${({disp}) => disp || ''};
    padding: ${({padding}) => padding || '8px'};
    margin: ${({margin, first}) => first ? '0 0 0 150px' : margin || ''};
    text-align: ${({textAlign}) => textAlign || 'center'};
    border-bottom: ${({borderBottom}) => borderBottom || ''};
    border-top: ${({borderTop}) => borderTop || ''};
    border-left: ${({borderLeft}) => borderLeft || ''};
    border-right: ${({borderRight}) => borderRight || ''};
    position: ${({position}) => position || ''};
    bottom: ${({bottom}) => bottom || ''};
    border-color: ${({borderColor}) => borderColor || ''};
    max-width: ${({maxWidth}) => maxWidth || ''};
    align-items: ${({alignItems}) => alignItems || ''};
    left: ${({left}) => left || ''};
    transform: ${({transform}) => transform || ''};
    top: ${({top}) => top || ''};
    flex-direction: ${({flexDirection}) => flexDirection || ''};
    right: ${({right}) => right || ''};

    &.today {
        border-color: #000;
        border-style: dotted;
        border-width: 3px;
    }
    
    ${({calendar}) => !calendar ?
        `&:active {
            box-shadow: none;
            border-radius: 7px;
        }` : ''
    }

    &:focus {
        outline: none;
    }
    ${({noCursor}) => noCursor ? '' :
        `&:hover {
            cursor: pointer;
        }`
    }
`;