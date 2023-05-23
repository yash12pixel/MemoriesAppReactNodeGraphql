import React from "react";
import { Grid, CircularProgress, Typography } from "@mui/material";
// import { useSelector } from "react-redux";
import Post from "./Post/Post";
import useStyles from "./styles";
// import { GET_POSTS_BY_USER } from "../../graphql/Query";
// import { useQuery } from "@apollo/client";

const Posts = ({ setCurrentId, data, loading }) => {
  // const posts = useSelector((state) => state.posts.posts);
  // const { data, loading, error } = useQuery(GET_POSTS_BY_USER);
  // const loadingState = useSelector((state) => state.loading);
  // console.log("posts", data?.getPostsByUser?.posts);
  // const postsData = posts.data;
  // const allPost = postsData.post;
  // console.log("posts:::", posts);
  const classes = useStyles();
  // if (error) {
  //   console.log("error", error);
  // }

  // useEffect(() => {
  //   return data;
  // }, []);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   helloHandeler();
  // }, []);

  // const helloHandeler = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 3000);
  // };

  // if (loading) {
  //   return <CircularProgress />;
  // }

  // return !posts.length ? (
  //   <CircularProgress />
  // ) : (
  //   <Grid
  //     className={classes.container}
  //     container
  //     alignItems="stretch"
  //     spacing={3}>
  //     {posts.map((post) => (
  //       <Grid key={post._id} item xs={12} sm={6} md={6}>
  //         <Post post={post} setCurrentId={setCurrentId} />
  //       </Grid>
  //     ))}
  //   </Grid>
  // );
  return (
    <div>
      {/* {loading && <CircularProgress />}
      {!posts.length ? (
        <Typography variant="h3">No Post Availabe</Typography>
      ) : (
        <Grid
          className={classes.container}
          container
          alignItems="stretch"
          spacing={3}>
          {posts.map((post) => (
            <Grid key={post._id} item xs={12} sm={6} md={6}>
              <Post post={post} setCurrentId={setCurrentId} />
            </Grid>
          ))}
        </Grid>
      )} */}
      {loading ? (
        <CircularProgress />
      ) : !data?.getPostsByUser?.posts.length ? (
        <Typography variant="h3">No Post Availabe</Typography>
      ) : (
        <Grid
          className={classes.container}
          container
          alignItems="stretch"
          spacing={3}
        >
          {data?.getPostsByUser?.posts.map((post, id) => (
            <Grid key={id} item xs={12} sm={6} md={6}>
              <Post post={post} setCurrentId={setCurrentId} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Posts;
