import styled, { css } from 'styled-components';
import {Row as FlexRow, Col as FlexCol} from 'react-styled-flexboxgrid';

import Theme from "../constants/theme";

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
    width: 100%;
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

export const Container = styled(FlexView)`
    min-height: 80vh;
    padding: 6rem 2rem 2rem 2rem;
    @media(max-width: 769px){
        padding: 6rem 1rem 2rem 1rem;
    }
`;

export const Separator = styled.div`
    padding-top: 1rem;
`;

export const HrWrapper = styled.hr`
    background: ${Theme.grey};
    margin: 0 0.1rem;
`;