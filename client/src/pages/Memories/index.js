import React, { useState, useEffect } from "react";
import { Container, Grow, Grid } from "@material-ui/core";
import "./memories.css";
import Posts from "../../components/Posts/Posts";
import Form from "../../components/Form/Form";
// import { getPosts } from "../../actions/posts";
// import { useSelector } from "react-redux";
import NavBar from "../../components/Navbar";
import WarningModal from "../../components/ToastModal/WarningModal";
import { useNavigate } from "react-router-dom";
import { GET_POSTS_BY_USER } from "../../graphql/Query";
import { useQuery } from "@apollo/client";
import { getCurrentUser } from "../../utils/userOperations";

const Memories = () => {
  // console.log("post data:::", data?.getPostsByUser.posts);
  // console.log("post data1:::", userPosts);
  const [currentId, setCurrentId] = useState(0);
  // console.log("current id::", currentId);
  const navigate = useNavigate();
  const [showModalObject, setShowModalObject] = useState({
    showSuccessModal: false,
    ShowWarningModal: false,
    msg: "",
  });

  const [userId, setUserId] = useState("");

  // const storedUser = localStorage.getItem("currentUser");
  const currentUser = getCurrentUser();

  // const user = useSelector((state) => state.loginReducer.user);
  // console.log("user:::", currentUser);

  const { data, loading, error } = useQuery(GET_POSTS_BY_USER, {
    variables: {
      id: userId,
    },
    onCompleted: () => {
      return data;
    },
  });

  if (error) {
    console.log("error", error);
  }

  useEffect(() => {
    // console.log("yes");
    LoginCheck();
  }, []);

  // useEffect(() => {
  //   setUserId(currentUser.id);
  // });

  useEffect(() => {
    setUserId(currentUser.id);
  }, [currentUser]);

  const LoginCheck = () => {
    if (!localStorage.getItem("token")) {
      setShowModalObject({
        showSuccessModal: false,
        ShowWarningModal: true,
        msg: "Login First",
      });
    }
  };
  let onCloseErrorModalLogin = () => {
    setShowModalObject({
      ...showModalObject,
      showSuccessModal: false,
      ShowWarningModal: false,
      msg: "",
    });
    navigate("/login");
  };

  // useEffect(() => {
  //   // dispatch(getPosts());
  // }, [currentId, dispatch]);

  return (
    <Container maxWidth="lg">
      <NavBar />
      <Grow in>
        <Container>
          <Grid
            container
            justifycontent="space-between"
            alignItems="stretch"
            spacing={4}
          >
            <Grid item xs={12} sm={7}>
              <Posts
                setCurrentId={setCurrentId}
                data={data}
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Form currentId={currentId} setCurrentId={setCurrentId} />
            </Grid>
          </Grid>
        </Container>
      </Grow>
      <WarningModal
        showModal={showModalObject.ShowWarningModal}
        btnText="Login"
        msg={showModalObject.msg}
        onCloseModal={() => {
          onCloseErrorModalLogin();
        }}
      ></WarningModal>
    </Container>
  );
};

export default Memories;
