import styled, { css } from 'styled-components';
import {Row as FlexRow, Col as FlexCol} from 'react-styled-flexboxgrid';

export const Col=styled(FlexCol)`
    text-align: ${({align})=> align};
    ${({auto})=> auto && css `
        flex: 1;
    `};
    ${({margin})=> margin && css `
        margin: auto;
    `};
`;

export const Row=styled(FlexRow)`
    text-align: ${({align})=> align};
    ${({auto})=> auto && css `
        flex: 1;
    `};
    ${({alignItems})=> alignItems && css `
        align-items: ${alignItems};
    `};
    ${({justify})=> justify && css `
        justify-content: ${justify};
    `};
    flex-direction: ${({reverse})=> (reverse ? 'row-reverse' : 'row')};
`;

export const FlexView=styled.div`
    display: flex;
    flex-direction: ${({reverse})=> (reverse ? 'column' : 'row')};
    ${({alignItems})=> alignItems && css `
        align-items: ${alignItems};
    `};
    ${({justify})=> justify && css `
        justify-content: ${justify};
    `};
`;