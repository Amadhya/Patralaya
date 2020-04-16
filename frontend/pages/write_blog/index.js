import React, {PureComponent} from 'react';
import {TextField, Typography} from "@material-ui/core";

import PopUpWindow from "./pop_up_window"
import {Container, Col, Separator, FlexView} from "../../components/layout";
import {ButtonLayout} from "../../components/button";

class WriteBlog extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            title: '',
            blog: '',
            popUpWindow: false,
            isClicked: false,
        };
    }

    handleTitleChange = (e) => {
        this.setState({
            title: e.target.value,
        });
    };

    handleBlogChange = (e) => {
        this.setState({
            blog: e.target.value,
        });
    };

    onPublish = () => {
        const {title, blog} = this.state;

        if(title!=="" && blog!==""){
            this.setState({
                popUpWindow: true,
            });
        }else{
            this.setState({
                isClicked: true,
            });
        }
    }

    closePopUpWindow = () => {
        this.setState({
            popUpWindow: false,
            isClicked: false,
        });
    }

    render() {
        const {title, blog, popUpWindow, isClicked} = this.state;

        return (
            <Container>
                <Col smOffset={2} sm={8} xs={12}>
                    <TextField
                        id="blog-title"
                        label="Title"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        value={title}
                        error={isClicked && title==""}
                        onChange={e => this.handleTitleChange(e)}
                    />
                    <Separator/>
                    <TextField
                        id="blog-textarea"
                        label="Create a blog...."
                        multiline
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        rows="22"
                        value={blog}
                        error={isClicked && blog==""}
                        onChange={e => this.handleBlogChange(e)}
                    />
                    <FlexView justify="space-between" alignItems="baseline">
                        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                            Write on Patralaya
                        </Typography>
                        <FlexView alignItems="baseline">
                            <ButtonLayout 
                                variant="contained" 
                                color="primary" 
                                onClick={() => this.onPublish()}
                            >
                                Publish
                            </ButtonLayout>
                        </FlexView>
                    </FlexView>
                </Col>
                <PopUpWindow blogText={blog} title={title} open={popUpWindow} handleClose={() => this.closePopUpWindow()}/>
            </Container>
        );
    }
}
  
export default WriteBlog;