import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper, Input } from "@mui/material";
import { useSelector } from "react-redux";

import useStyles from "./styles";
import ErrorMessageAlert from "../Alert/index";
import { CREATE_POST, UPDATE_POST } from "../../graphql/Mutation";

import { useMutation, useQuery } from "@apollo/client";
import { GET_POSTS_BY_USER, GET_POST } from "../../graphql/Query";

const Form = ({ currentId, setCurrentId }) => {
  // console.log("currentId::::", currentId);
  const [postData, setPostData] = useState({
    creator: "",
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });
  // console.log("files:::", postData.selectedFile);
  const [validatedObject, setValidatedObject] = useState({
    isWarning: false,
    message: "",
  });

  const [loadingObject, setLoadingObject] = useState({
    isLoading: false,
    isDisable: false,
  });

  const post = useSelector((state) =>
    currentId
      ? state.posts.posts.find((message) => message._id === currentId)
      : null
  );
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
        tags: postData?.getPost.tags,
        title: postData?.getPost.title,
      });
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
    } else if (
      postData.tags === "" ||
      postData.tags === null ||
      postData.tags === undefined
    ) {
      return setValidatedObject({
        ...validatedObject,
        isWarning: true,
        message: "Tags is missing",
      });
    }
    // else if (
    //   postData.selectedFile === "" ||
    //   postData.selectedFile === null ||
    //   postData.selectedFile === undefined
    // ) {
    //   return setValidatedObject({
    //     ...validatedObject,
    //     isWarning: true,
    //     message: "Image file is missing",
    //   });
    // }
    else {
      if (currentId === 0) {
        setLoadingObject({
          ...loadingObject,
          isDisable: true,
          isLoading: true,
        });
        console.log("postdata", postData);
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
        const { title, message, creator, tags, selectedFile } = postData;
        console.log("post::", selectedFile);
        const result = createPost({
          variables: {
            title: title,
            message: message,
            creator: creator,
            tags: tags,
            selectedFile: selectedFile,
          },
          refetchQueries: [{ query: GET_POSTS_BY_USER }],
          fetchPolicy: "no-cache",
        });
        console.log("result add:::", result);
        setLoadingObject({
          ...loadingObject,
          isDisable: false,
          isLoading: false,
        });
        clear();
      } else {
        console.log("ye upfdaa");
        setLoadingObject({
          ...loadingObject,
          isDisable: true,
          isLoading: true,
        });
        // dispatch(updatePost(currentId, postData));
        const { title, message, creator, tags } = postData;
        // console.log("currentId:::1111", currentId);
        const id = currentId;
        const result = updatePost({
          variables: {
            id,
            title,
            message,
            creator,
            tags,
          },
          refetchQueries: [{ query: GET_POSTS_BY_USER }],
        });
        console.log("result add:::", result);
        setLoadingObject({
          ...loadingObject,
          isDisable: false,
          isLoading: false,
        });
        clear();
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
        onSubmit={handleSubmit}>
        {validatedObject.isWarning && (
          <ErrorMessageAlert
            message={validatedObject.message}></ErrorMessageAlert>
        )}
        {loading && <p>loading</p>}
        <Typography variant="h6">
          {currentId ? `Editing "${postData.title}"` : "Creating a Memory"}
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
        <TextField
          name="tags"
          variant="outlined"
          fullWidth
          placeholder="Tags (coma separated)"
          value={postData.tags}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(",") })
          }
        />
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
          id="file"
          onChange={(e) =>
            setPostData({ ...postData, selectedFile: e.target.files[0] })
          }
          style={{ margin: "5px 20px 8px 0" }}
        />
        <Button
          disabled={loadingObject.isDisable}
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          style={{ margin: "8px 0 0 0" }}
          fullWidth>
          {currentId ? "Update" : "Submit"}
        </Button>

        <Button
          variant="outlined"
          color="primary"
          size="medium"
          style={{ margin: "10px 0 0 0" }}
          onClick={clear}
          fullWidth>
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
