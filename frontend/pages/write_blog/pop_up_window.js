import React, {PureComponent, Fragment} from 'react';
import {
    Dialog, DialogContent, TextField, IconButton, Typography, 
    FormControl, Select, InputLabel, MenuItem, Chip, Avatar, Snackbar
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import styled from 'styled-components';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {Separator, FlexView, Row} from "../../components/layout";
import {CircularProgressWrapper} from "../../components/progress";
import {ButtonLayout} from "../../components/button";
import Theme from "../../constants/theme";
import {Router} from "../../routes";
import fetchNewBlogDetails, {getNewBlog, getNewBlogStatus, getNewBlogError, getNewBlogSuccess} from "../../container/new-blog/saga";

const IconButtonWrapper = styled(IconButton)`
    float: right;
    padding: 0px !important;
`;
const DialogContentWrapper = styled(DialogContent)`
    padding: 1rem 5rem 2rem 5rem !important;
    @media(max-width: 769px){
        padding: 1rem 2rem 1rem 2rem !important;
    }
`;
const CategoryWrapper = styled(FormControl)`
  width: 100%;
`;
const InputLabelWrapper = styled(InputLabel)`
  color: ${Theme.primaryColor} !important;
`;
const ChipWrapper = styled(Chip)`
  border-color: ${Theme.primaryColor} !important; 
  color: ${Theme.primaryColor} !important; 
  margin-right: 1rem;
  margin-bottom: 1rem;
  .MuiChip-deleteIconOutlinedColorPrimary {
    color: ${Theme.primaryColor} !important;
    opacity: 0.7 !important;
  }
`;
const AvatarWrapper = styled(Avatar)`
  background: ${Theme.primaryColor} !important; 
`;

const Categories = ['Entertainment', 'Fashion', 'Food', 'Literature', 'Politics', 'Science', 'Technology', 'Travel'];

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class PopUpWindow extends PureComponent{

    constructor(props){
        super(props);
        this.state ={
            category: '',
            tag: '',
            tagArray: [],
            limitReached: false,
            addedAlready: false,
            isClicked: false,
            openSnackBar: false,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        const {isClicked} = this.state;

        if(isClicked){
            const {pending, success, error, blog, handleClose} = this.props;

            if(typeof pending !== "undefined" && typeof success !== "undefined" && !pending && success){
                this.setState({
                    categories: '',
                    openSnackBar: true,
                    isClicked: false,
                    tagArray: []
                }, () => {handleClose()});
                Router.pushRoute(`/blog/${blog.id}`);
            }else if(error){
                this.setState({
                    openSnackBar: true,
                });
            }
        }
    }

    handleCategorySelect = (e) => {
        this.setState({
          category: e.target.value,
        })
    };

    handleTagChange = (e) => {
        this.setState({
            tag: e.target.value,
            addedAlready: false,
        });
    }

    addTag = () => {
        const {tag, tagArray} = this.state;
        const index = tagArray.indexOf(tag);
        
        if (index > -1) {
            this.setState({
                addedAlready: true,
                tag: '',
            });
        }else if(tagArray.length == 5){
            this.setState({
                limitReached: true,
                addedAlready: false,
            });
        }else{
            this.setState({
                tagArray: [
                    ...tagArray,
                    tag.toLowerCase()
                ],
                tag: '',
                addedAlready: false,
            });
        }
    }

    handleChipDelete = (item) => {
        const {tagArray} = this.state;
        const index = tagArray.indexOf(item);
        
        if (index > -1) {
            tagArray.splice(index, 1);
        }
        
        this.setState({
            tagArray: [
                ...tagArray
            ],
            limitReached: false,
        });
    }

    handleSnackBarClose = () => {
        this.setState({
            openSnackBar: false,
        })
    }

    publishBlog = () => {
        const {actions, title,blogText} = this.props;
        const {tagArray, category} = this.state;

        this.setState({
            isClicked: true,
        });

        if(category!==""){
            actions.fetchNewBlogDetails(title,blogText,category,tagArray);
        }
        
    }

    render(){
        const {open, handleClose, error} = this.props;
        const {category, tag, tagArray, limitReached, addedAlready, isClicked, openSnackBar} = this.state;

        return (
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    autoHideDuration={2000}
                    open={ openSnackBar }
                    onClose={() => this.handleSnackBarClose()}
                >
                    {error ? (
                        <Alert severity="error">There was an error while publishing your blog.</Alert>
                    ):(
                        <Alert severity="success">Blog Successfully Published.</Alert>
                    )}
                </Snackbar>
                <MuiDialogTitle disableTypography>
                    <IconButtonWrapper aria-label="close" onClick={handleClose}>
                        <CloseIcon />
                    </IconButtonWrapper>
                </MuiDialogTitle>
                <DialogContentWrapper>
                    <FlexView reverse alignItems="center">
                        <Typography variant="h5" align="center">
                            Category & Tags
                        </Typography>
                        <Separator/>
                        <Typography variant="body1" color="textSecondary" align="center">
                            Add category and tags (maximum five) to let others know what your blogg is about.
                        </Typography>
                        <Separator/>
                        <CategoryWrapper variant="outlined">
                            <InputLabelWrapper id="category-select-outlined-label">Categories</InputLabelWrapper>
                            <Select
                                labelId="category-select-outlined-label"
                                id="category-select-outlined"
                                value={category}
                                error={isClicked && category===''}
                                onChange={(e) => this.handleCategorySelect(e)}
                                label="Category"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {Categories.map((text) => (
                                    <MenuItem value={text} key={text}>{text}</MenuItem>
                                ))}
                            </Select>
                        </CategoryWrapper>
                        <Separator/>
                        <TextField
                            id="outlined-tag"
                            label="Add a tag..."
                            margin="normal"
                            variant="outlined"
                            value={tag}
                            fullWidth
                            onChange={e => this.handleTagChange(e)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    this.addTag()
                                }
                            }}
                        />
                        <Separator/>
                        {limitReached && (
                            <Fragment>
                                <Typography align="center" variant="caption" color="error">
                                    You can add maximum of 5 tags.
                                </Typography>
                                <Separator/>
                            </Fragment>
                        )}
                        {addedAlready && (
                            <Fragment>
                                <Typography align="center" variant="caption" color="error">
                                    Tag already added.
                                </Typography>
                                <Separator/>
                            </Fragment>
                        )}
                        <Row>
                            {tagArray.map(item => (
                                <ChipWrapper
                                    key={item} 
                                    variant="outlined" 
                                    color="primary" 
                                    label={item}
                                    onDelete={() => this.handleChipDelete(item)} 
                                    avatar={<AvatarWrapper>{item[0]}</AvatarWrapper>}
                                />
                            ))}
                        </Row>
                        <Separator/>
                        <ButtonLayout 
                            variant="contained" 
                            color="primary" 
                            endIcon={isClicked && category !=='' && <CircularProgressWrapper/>}
                            onClick={() => this.publishBlog()}
                        >
                            Publish Now
                        </ButtonLayout>
                    </FlexView>
                </DialogContentWrapper>
            </Dialog>
        )
    }
};

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
)(PopUpWindow);