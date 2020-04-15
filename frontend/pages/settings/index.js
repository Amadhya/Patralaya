import React from 'react';
import Head from 'next/head';
import {Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {Container, Col, Separator} from "../../components/layout";
import General from "./profile";
import Security from "./security";

const Settings = () => (
  <Container>
    <Head>
      <title>Settings</title>
    </Head>
    <Col smOffset={3} sm={6} xs={12}>
      <Typography variant="h5">Settings</Typography>
      <Separator/>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Personal Information</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <General/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Security</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Security/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Col>
  </Container>
);

export default Settings;