import React, {PureComponent} from 'react';
import {TextField, Typography, InputLabel, FormControl, Select, Snackbar} from "@material-ui/core";
import styled from 'styled-components';
import MuiAlert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {Router} from "../../routes";
import Theme from "../../constants/theme";
import {Container, Col, Separator, FlexView} from "../../components/layout";
import {ButtonLayout} from "../../components/button";
import {CircularProgressWrapper} from "../../components/progress";
import fetchNewBlogDetails, {getNewBlog, getNewBlogStatus, getNewBlogError, getNewBlogSuccess} from "../../container/new-blog/saga";

const Categories = ['Entertainment', 'Fashion', 'Food', 'Literature', 'Politics', 'Science', 'Technology', 'Travel'];

const CategoryWrapper = styled(FormControl)`
  margin: 0 1.5rem !important;
`;
const InputLabelWrapper = styled(InputLabel)`
  color: ${Theme.primaryColor} !important;
`;

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class WriteBlog extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            title: '',
            blog: '',
            category: '',
            publish: false,
            openSnackBar: false,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        const {publish} = this.state;

        if(publish){
            const {pending, success, error, blog} = this.props;

            if(typeof pending !== "undefined" && typeof success !== "undefined" && !pending && success){
                this.setState({
                    title: '',
                    blog: '',
                    category: '',
                    publish: false,
                });
                Router.pushRoute(`/blog/${blog.id}`);
            }
            if(error){
                this.setState({
                    publish: false,
                });
            }
        }
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

    handleCategorySelect = (e) => {
        this.setState({
          category: e.target.value,
        })
    };

    onPublish = () => {
        const {title, blog, category} = this.state;
        const {actions} = this.props;

        this.setState({
            publish: true,
            openSnackBar: true,
        });

        actions.fetchNewBlogDetails(title,blog,category);
    }

    handleSnackBarClose = () => {
        this.setState({
            openSnackBar: false,
        })
    }

    render() {
        const {title, blog, category, publish, openSnackBar} = this.state;
        const {pending, success, error} = this.props;

        return (
            <Container>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    autoHideDuration={2000}
                    open={
                        openSnackBar && ((typeof pending !== "undefined" && typeof success !== "undefined"&& !pending && success) || error)
                    }
                    onClose={() => this.handleSnackBarClose()}
                >
                    {error ? (
                        <Alert severity="error">There was an error while publishing your blog.</Alert>
                    ):(
                        <Alert severity="success">Blog Successfully Published.</Alert>
                    )}
                </Snackbar>
                <Col smOffset={2} sm={8} xs={12}>
                    <TextField
                        id="blog-title"
                        label="Title"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        value={title}
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
                        onChange={e => this.handleBlogChange(e)}
                    />
                    <FlexView justify="space-between" alignItems="baseline">
                        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                            Write on Patralaya
                        </Typography>
                        <FlexView alignItems="baseline">
                            <CategoryWrapper>
                                <InputLabelWrapper margin="dense" htmlFor="outlined-age-native-simple">
                                    Category
                                </InputLabelWrapper>
                                <Select
                                    native
                                    value={category}
                                    onChange={(e) => this.handleCategorySelect(e)}
                                >
                                    <option value="" disabled>

                                    </option>
                                    {Categories.map((text) => (
                                        <option value={text} key={text}>{text}</option>
                                    ))}
                                </Select>
                            </CategoryWrapper>
                            <ButtonLayout 
                                variant="contained" 
                                color="primary" 
                                onClick={() => this.onPublish()}
                                disabled={title==="" || blog==="" || category===""}
                                endIcon={
                                    publish && (!error || (typeof pending !== "undefined" && !pending && typeof success !== "undefined" && !success))
                                    && 
                                    <CircularProgressWrapper size={18}/>
                                }
                            >
                                Publish
                            </ButtonLayout>
                        </FlexView>
                    </FlexView>
                </Col>
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    error: getNewBlogError(state),
    pending: getNewBlogStatus(state),
    success: getNewBlogSuccess(state),
    blog: getNewBlog(state),
  });
  
  export default connect(
      mapStateToProps,
      dispatch => ({
        actions: bindActionCreators({fetchNewBlogDetails}, dispatch)
      }),
  )(WriteBlog);