import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import moment from "moment";

import useStyles from "./styles";
import { LIKE_POST, DELETE_POST } from "../../../graphql/Mutation";
import { useMutation } from "@apollo/client";
import { GET_POSTS_BY_USER } from "../../../graphql/Query";

const Post = ({ post, setCurrentId }) => {
  const classes = useStyles();
  // console.log("post_tagss::", post.tags);
  // console.log("post::", post);
  const [likePostApi] = useMutation(LIKE_POST);
  const [deletePostApi] = useMutation(DELETE_POST);

  const likePost = async (id) => {
    console.log("id::", id);
    const result = await likePostApi({
      variables: {
        id,
      },
      refetchQueries: [{ query: GET_POSTS_BY_USER }],
    });
    return result;
  };

  const deletePost = async (id) => {
    const result = await deletePostApi({
      variables: {
        id,
      },
      refetchQueries: [{ query: GET_POSTS_BY_USER }],
    });
    return result;
  };

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={
          post.selectedFile ||
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
        <Button
          style={{ color: "white" }}
          size="small"
          onClick={() => setCurrentId(post.id)}>
          <MoreHorizIcon fontSize="medium" />
        </Button>
      </div>
      <div className={classes.details}>
        <Typography variant="body2" color="textSecondary" component="h2">
          {post.tags.map((tag) => `#${tag} `)}
        </Typography>
      </div>
      <Typography
        className={classes.title}
        gutterBottom
        variant="h5"
        component="h2">
        {post.title}
      </Typography>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {post.message}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" onClick={() => likePost(post.id)}>
          <ThumbUpAltIcon fontSize="small" /> Like {post.likeCount}{" "}
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() => deletePost(post.id)}>
          <DeleteIcon fontSize="small" /> Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default Post;
