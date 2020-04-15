import React, {Fragment} from 'react';
import {
    FacebookShareButton, LinkedinShareButton, TwitterShareButton,
} from "react-share";
import {
    FacebookIcon, LinkedinIcon, TwitterIcon
} from "react-share";
import styled from 'styled-components';

import {Row} from "./layout";

const LinkedInWrapper = styled(LinkedinShareButton)`
    margin: 0 0.5rem;
    outline: none;
`;
const FbWrapper = styled(FacebookShareButton)`
    outline: none;
`;
const TwitterWrapper = styled(TwitterShareButton)`
    outline: none;
`;
const RowWrapper = styled(Row)`
    margin-top: ${props => props.disp == 'desktop' ? '0':'1rem'} !important;
    @media(min-width: 769px){
        display: ${props => props.disp == 'mobile' ? 'none' : 'flex'} !important;
    }
    @media(max-width: 769px){
        display:  ${props => props.disp == 'desktop' ? 'none': 'flex'} !important;
        justify-content: flex-start;
    }
`;

const SocialShare = ({url, text, title, disp}) => (
    <RowWrapper disp={disp} justify="flex-end">
        <FbWrapper url={url} quote={text}>
            <FacebookIcon size={32} round={true}/>
        </FbWrapper>
        <LinkedInWrapper url={url} summary={text} title={title}>
            <LinkedinIcon size={32} round={true}/>
        </LinkedInWrapper>
        <TwitterWrapper url={url} title={title}>
            <TwitterIcon size={32} round={true}/>
        </TwitterWrapper>
    </RowWrapper>
);

export default SocialShare;