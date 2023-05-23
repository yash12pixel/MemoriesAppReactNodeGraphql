import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Input,
  Grid,
} from "@mui/material";
import { useSelector } from "react-redux";

import useStyles from "./styles";
import ErrorMessageAlert from "../Alert/index";
import { CREATE_POST, UPDATE_POST } from "../../graphql/Mutation";

import { useMutation, useQuery } from "@apollo/client";
import { GET_POSTS_BY_USER, GET_POST } from "../../graphql/Query";
import { getCurrentUser } from "../../utils/userOperations";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Form = ({ currentId, setCurrentId }) => {
  // console.log("currentId::::", currentId);
  const [postData, setPostData] = useState({
    creator: "",
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });
  const [tags, setTags] = useState([]);
  const [editTags, setEditTags] = useState([]);
  // console.log("files:::", postData);
  const [validatedObject, setValidatedObject] = useState({
    isWarning: false,
    message: "",
  });

  const [loadingObject, setLoadingObject] = useState({
    isLoading: false,
    isDisable: false,
  });

  // const [open, setOpen] = useState(false);

  const post = useSelector((state) =>
    currentId
      ? state.posts.posts.find((message) => message._id === currentId)
      : null
  );
  // const user = useSelector((state) => state.loginReducer.user);
  // const storedUser = localStorage.getItem("currentUser");
  const currentUser = getCurrentUser();
  const inputFileRef = useRef(null);

  // const postState = useSelector((state) => state.posts);
  const classes = useStyles();
  const [createPost] = useMutation(CREATE_POST);
  const [updatePost] = useMutation(UPDATE_POST);
  const { data, loading, error } = useQuery(GET_POST, {
    variables: {
      id: currentId,
    },
    onCompleted: (postData) => {
      setPostData({
        creator: postData?.getPost.creator,
        message: postData?.getPost.message,
        // tags: postData?.getPost.tags,
        title: postData?.getPost.title,
      });
      setEditTags(postData?.getPost.tags);
      return data;
    },
  });

  if (error) {
    // console.log("error", error);
  }
  // console.log("post data form::", data?.getPost);
  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  useEffect(() => {
    setPostData({
      creator: data?.getPost?.creator,
      message: data?.getPost?.message,
      // tags: data?.getPost?.tags,
      title: data?.getPost?.title,
      // selectedFile: data?.getPost?.selectedFile?.filename,
    });
    setEditTags(data?.getPost?.tags);
  }, [data?.getPost]);

  const clear = () => {
    setCurrentId(0);
    setPostData({
      creator: "",
      title: "",
      message: "",
      tags: "",
      selectedFile: null,
    });
  };

  // const handleFileChange = (e) => {
  //   if (e.target.files) {
  //     // const file = e.target.files[0];

  //     setPostData({ ...postData, selectedFile: e.target.files[0] });
  //     //   const lastModified = file.lastModified;
  //     //   const lastModifiedDate = file.lastModifiedDate;
  //     //   const name = file.name;
  //     //   const size = file.size;
  //     //   const type = file.type;
  //     //   const webkitRelativePath = file.webkitRelativePath;

  //     //   const reader = new FileReader();
  //     //   reader.onload = (event) => {
  //     //     const fileContents = event.target.result;
  //     //     //   console.log("result::", event);
  //     //     const fileData = {
  //     //       filename: name,
  //     //       fileType: type,
  //     //       filesize: size,
  //     //       filewebkitRelativePath: webkitRelativePath,
  //     //       filelastModified: lastModified,
  //     //       filelastModifiedDate: lastModifiedDate,
  //     //     };

  //     //     const jsonString = JSON.stringify(fileData);
  //     //     setPostData({ ...postData, selectedFile: jsonString });
  //     //     console.log(jsonString);
  //     //   };
  //     //   reader.readAsText(file);
  //   }
  // };

  let handleAddTags = async (e) => {
    e.preventDefault();
    if (tags.length > 2) {
      setPostData({ ...postData, tags: "" });
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "You can not add more than 3 tags",
      });
    }
    // console.log("target", e.target);
    // setFeatures([...features, e.target[0].value]);
    if (tags === undefined) {
      setTags([postData.tags]);
    } else {
      setTags([...tags, postData.tags]);
    }
    setPostData({ ...postData, tags: "" });
    console.log("tags", tags);
  };

  let handleEditTags = async (e) => {
    e.preventDefault();
    if (editTags.length > 2) {
      setPostData({ ...postData, tags: "" });

      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "You can not add more than 3 tags",
      });
    }
    console.log("edit");
    // setFeatures([...features, e.target[0].value]);
    if (editTags === undefined) {
      setEditTags([postData.tags]);
    } else {
      setEditTags([...editTags, postData.tags]);
    }
    setPostData({ ...postData, tags: "" });
    // console.log("tags", tags);
  };

  let removeAddTags = (index) => {
    // e.preventDefault();
    setTags(tags.filter((item, i) => i !== index));
  };

  let removeEditTags = (index) => {
    console.log("index", index);
    // e.preventDefault();
    setEditTags(editTags.filter((item, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      postData.creator === "" ||
      postData.creator === null ||
      postData.creator === undefined
    ) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Creator is missing",
      });
    } else if (
      postData.title === "" ||
      postData.title === null ||
      postData.title === undefined
    ) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Title is missing",
      });
    } else if (
      postData.message === "" ||
      postData.message === null ||
      postData.message === undefined
    ) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Message is missing",
      });
    } else if (tags === "" || tags === null || tags === undefined) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Tags is missing",
      });
    } else if (tags.length > 3) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "You can not add more than 3 tags",
      });
    } else if (
      currentId === 0 &&
      postData.selectedFile === undefined
      // postData.selectedFile === undefined
    ) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Image file is missing",
      });
    } else if (currentId !== 0 && editTags.length > 3) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "You can not add more than 3 tags",
      });
    } else {
      if (currentId === 0) {
        try {
          setLoadingObject({
            ...loadingObject,
            isDisable: true,
            isLoading: true,
          });
          setValidatedObject({
            ...validatedObject,
            isWarning: false,
            message: "",
          });

          const { title, message, creator, selectedFile } = postData;
          // console.log("post::", selectedFile);
          await createPost({
            variables: {
              title: title,
              message: message,
              creator: creator,
              tags: tags,
              selectedFile: selectedFile,
            },
            refetchQueries: [
              {
                query: GET_POSTS_BY_USER,
                variables: {
                  id: currentUser.id,
                },
              },
            ],
            fetchPolicy: "no-cache",
          });
          // console.log("result add:::", result);
          // setOpen(false);

          setLoadingObject({
            ...loadingObject,
            isDisable: false,
            isLoading: false,
          });
          setTags([]);
          if (inputFileRef.current) {
            inputFileRef.current.value = "";
          }
          clear();
        } catch (error) {
          setValidatedObject({
            ...validatedObject,
            isWarning: true,
            message: error?.message,
          });
        }

        // setOpen(true);
        // console.log("postdata", postData);
        // dispatch(createPost(postData));
        // const formData = new FormData();
        // const selectedFile = formData.append(
        //   "selectedFile",
        //   postData.selectedFile
        // );
        // const creator = formData.append("creator", postData.creator);
        // const message = formData.append("message", postData.message);
        // const tags = formData.append("tags", postData.tags);
        // const title = formData.append("title", postData.title);
      } else {
        try {
          setLoadingObject({
            ...loadingObject,
            isDisable: true,
            isLoading: true,
          });
          setValidatedObject({
            ...validatedObject,
            isWarning: false,
            message: "",
          });

          const { title, message, creator, selectedFile } = postData;
          // console.log("currentId:::1111", currentId);
          const id = currentId;
          console.log("edittdags::::", editTags);
          await updatePost({
            variables: {
              id,
              title,
              message,
              creator,
              tags: editTags,
              selectedFile,
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
          // console.log("result add:::", result);
          setLoadingObject({
            ...loadingObject,
            isDisable: false,
            isLoading: false,
          });
          // setOpen(false);
          setTags([]);
          setEditTags([]);
          setPostData({ ...postData, tags: "" });
          if (inputFileRef.current) {
            inputFileRef.current.value = "";
          }
          clear();
        } catch (error) {
          setValidatedObject({
            ...validatedObject,
            isWarning: true,
            message: error?.message,
          });
        }
        // console.log("ye upfdaa");

        // setOpen(true);

        // dispatch(updatePost(currentId, postData));
      }
    }
  };

  return (
    <Paper className={classes.paper}>
      <form
        autoComplete="off"
        noValidate
        method="post"
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        {validatedObject.isWarning && (
          <ErrorMessageAlert
            message={validatedObject.message}
          ></ErrorMessageAlert>
        )}
        {loading && <p>loading</p>}
        <Typography variant="h6">
          {currentId ? `Editing "${postData.title}"` : "Creating a Memories"}
        </Typography>
        <TextField
          name="creator"
          variant="outlined"
          placeholder="Enter Creator"
          fullWidth
          value={postData.creator}
          onChange={(e) =>
            setPostData({ ...postData, creator: e.target.value })
          }
        />
        <TextField
          name="title"
          variant="outlined"
          fullWidth
          placeholder="Title"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <TextField
          name="message"
          variant="outlined"
          fullWidth
          multiline
          placeholder="Message"
          rows={4}
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />
        {/* <TextField
          name="tags"
          variant="outlined"
          fullWidth
          placeholder="Tags (coma separated)"
          value={postData.tags}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(",") })
          }
        /> */}
        {/* <form onSubmit={handleFeature}> */}
        {currentId ? (
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <TextField
                name="tags"
                // variant="outlined"
                placeholder="Tags"
                fullWidth
                value={postData.tags}
                onChange={(e) =>
                  setPostData({ ...postData, tags: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                // type="submit"
                onClick={handleEditTags}
              >
                Add Tag
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <TextField
                name="tags"
                // variant="outlined"
                placeholder="Tags"
                fullWidth
                value={postData.tags}
                onChange={(e) =>
                  setPostData({ ...postData, tags: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                // type="submit"
                onClick={handleAddTags}
              >
                Add Tag
              </Button>
            </Grid>
          </Grid>
        )}

        <div className="addedFeatures" style={{ display: "flex", gap: "8px" }}>
          {tags &&
            tags?.map((feature, index) => (
              <div className="item" key={index}>
                <button
                  style={{
                    height: "50px",
                    fontSize: "20px",
                    fontWeight: "400",
                    background: "transparent",
                    color: "blue",
                    border: "1px solid blue",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "20px",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                  onClick={() =>
                    //   dispatch({ type: "REMOVE_FEATURE", payload: f })
                    removeAddTags(index)
                  }
                >
                  {feature}
                  <span>X</span>
                </button>
              </div>
            ))}
          {editTags &&
            editTags?.map((feature, index) => (
              <div className="item" key={index}>
                <button
                  style={{
                    height: "50px",
                    fontSize: "20px",
                    fontWeight: "400",
                    background: "transparent",
                    color: "blue",
                    border: "1px solid blue",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                  onClick={() =>
                    //   dispatch({ type: "REMOVE_FEATURE", payload: f })
                    removeEditTags(index)
                  }
                >
                  {feature}
                  <span>X</span>
                </button>
              </div>
            ))}
        </div>
        {/* </form> */}
        {/* <div className={classes.fileInput}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div> */}
        <Input
          type="file"
          id="selectedFile"
          inputRef={inputFileRef}
          onChange={(e) =>
            setPostData({ ...postData, selectedFile: e.target.files[0] })
          }
          style={{ margin: "5px 20px 8px 0" }}
        />
        {/* <input
          type="file"
          id="selectedFile"
          ref={inputFileRef}
          onChange={(e) =>
            setPostData({ ...postData, selectedFile: e.target.files[0] })
          }
          style={{ margin: "5px 20px 8px 0" }}
        /> */}
        <Button
          disabled={loadingObject.isDisable}
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          style={{ margin: "8px 0 0 0" }}
          fullWidth
        >
          {currentId ? "Update" : "Submit"}
        </Button>

        <Button
          variant="outlined"
          color="primary"
          size="medium"
          style={{ margin: "10px 0 0 0" }}
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loadingObject.isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </form>
    </Paper>
  );
};

export default Form;
