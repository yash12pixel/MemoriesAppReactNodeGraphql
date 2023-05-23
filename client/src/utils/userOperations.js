import jwtDecode from "jwt-decode";

export const setCurrentUser = (token) => {
  localStorage.setItem("token", token);

  const decodedUser = jwtDecode(token);

  // console.log("login::", decodedUser);

  localStorage.setItem("currentUser", JSON.stringify(decodedUser));
};

export const getCurrentUser = () => {
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(storedUser);
  return currentUser;
};

export const removeCurrentUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
};

export const setEmailLocally = (email) => {
  localStorage.setItem("email", email);
};

export const getEmailLocally = () => {
  return localStorage.getItem("email");
};

export const removeEmailLocally = () => {
  localStorage.removeItem("email");
};
