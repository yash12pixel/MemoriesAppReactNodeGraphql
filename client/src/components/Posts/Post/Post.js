import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  // TextField,
} from "@mui/material";
// import Menu from "@mui/material";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import DeleteIcon from "@material-ui/icons/Delete";
// import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import moment from "moment";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import useStyles from "./styles";
import { LIKE_POST, DELETE_POST } from "../../../graphql/Mutation";
import { useMutation } from "@apollo/client";
import { GET_POSTS_BY_USER } from "../../../graphql/Query";
import { getCurrentUser } from "../../../utils/userOperations";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";

// import { useSelector } from "react-redux";

const ITEM_HEIGHT = 48;

const Post = ({ post, setCurrentId }) => {
  const classes = useStyles();
  // const user = useSelector((state) => state.loginReducer.user);
  // const storedUser = localStorage.getItem("currentUser");
  const currentUser = getCurrentUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const [loadingObject, setLoadingObject] = useState({
    isLoading: false,
    isDisable: false,
  });

  // const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setOpen(true);

    setAnchorEl(event.currentTarget);
    // setOpen(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  // console.log("post_tagss::", post.tags);
  // console.log("post::", post);
  const [likePostApi] = useMutation(LIKE_POST);
  const [deletePostApi] = useMutation(DELETE_POST);

  const likePost = async (id) => {
    // console.log("id::", id);
    const result = await likePostApi({
      variables: {
        id,
      },
      refetchQueries: [
        {
          query: GET_POSTS_BY_USER,
          variables: {
            id: currentUser.id,
          },
        },
      ],
    });
    return result;
  };

  const deletePost = async (id) => {
    setLoadingObject({
      ...loadingObject,
      isLoading: true,
      isDisable: true,
    });
    const result = await deletePostApi({
      variables: {
        id,
      },
      refetchQueries: [
        {
          query: GET_POSTS_BY_USER,
          variables: {
            id: currentUser.id,
          },
        },
      ],
    });
    setLoadingObject({
      ...loadingObject,
      isLoading: false,
      isDisable: false,
    });
    return result;
  };

  // const textFieldStyles = {
  //   border: "none",
  // };

  return (
    <>
      <Card className={classes.card} sx={{ maxWidth: 345 }}>
        <CardMedia
          className={classes.media}
          image={
            post.selectedFile?.url ||
            "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
          }
          title={post.title}
        />
        <div className={classes.overlay}>
          <Typography variant="h6">{post.creator}</Typography>
          <Typography variant="body2">
            {moment(post.createdAt).fromNow()}
          </Typography>
        </div>
        <div className={classes.overlay2}>
          {/* <Button
      style={{ color: "white" }}
      size="small"
      onClick={() => setCurrentId(post.id)}
    >
      <MoreVertIcon fontSize="large" />
    </Button> */}
          <IconButton
            color="default"
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon fontSize="large" sx={{ color: "white" }} />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: "20ch",
              },
            }}
          >
            <MenuItem
              key="Edit"
              // selected={option === "Pyxis"}
              onClick={() => {
                setCurrentId(post.id);
                handleClose();
              }}
              className="gap-2"
            >
              <EditIcon />
              Edit
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              key="Remove"
              // selected={option === "Pyxis"}
              // onClick={() => setCurrentId(post.id)}
              onClick={() => {
                deletePost(post.id);
                handleClose();
              }}
              className="gap-2"
            >
              <DeleteIcon fontSize="small" />
              Remove
            </MenuItem>
          </Menu>
        </div>
        <div className={classes.details}>
          <Typography
            variant="body2"
            className="gap-3"
            color="textSecondary"
            component="h2"
          >
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
        </div>
        <Typography
          className={classes.title}
          gutterBottom
          variant="h5"
          component="h2"
        >
          {post.title}
        </Typography>
        <CardContent>
          <Typography
            variant="body1"
            color="textSecondary"
            // component="te"
            style={{
              whiteSpace: "pre-wrap",
              border: "none",
              resize: "none",
              width: "100%",
              height: "200px",
              overflow: "hidden",
              textAlign: "justify",
            }}
            gutterBottom
          >
            {post.message}
          </Typography>
          {/* <textarea
            style={{
              border: "none",
              resize: "none",
              width: "100%",
              height: "200px",
            }}
          >
            {post.message}
          </textarea> */}
          {/* <TextField
            name="message"
            variant="outlined"
            fullWidth
            multiline
            placeholder="Message"
            rows={4}
            sx={{
              border: "none",
              resize: "none",
              height: "200px",
              width: "100%",
            }}
            value={post.message}
            inputProps={{ style: textFieldStyles }}
          /> */}
        </CardContent>
        <CardActions
          className={classes.cardActions}
          sx={{
            display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            height: "50px",
            width: "100%",
            position: "absolute",
            bottom: "0",
            top: "400px",
          }}
        >
          <Button
            size="small"
            color="primary"
            onClick={() => likePost(post.id)}
          >
            <ThumbUpAltIcon fontSize="small" /> Like {post.likeCount}{" "}
          </Button>
          {/* <Button
      size="small"
      color="primary"
      onClick={() => deletePost(post.id)}
    >
      <DeleteIcon fontSize="small" /> Delete
    </Button> */}
        </CardActions>
      </Card>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingObject.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Post;
