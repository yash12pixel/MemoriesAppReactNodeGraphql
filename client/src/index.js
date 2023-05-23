import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import configureStore from "./reducers/store";

import {
  ApolloClient,
  InMemoryCache,
  // createHttpLink,
  ApolloProvider,
} from "@apollo/client";

import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createUploadLink({
  uri: "http://localhost:5001/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "Apollo-Require-Preflight": "true",
      authorization: token,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),

  cache: new InMemoryCache(),
});

const store = configureStore(window.__PRELOADED_STATE__);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<ApolloProvider client={client}>
  <Provider store={store}>
    <App />
    </Provider>
 </ApolloProvider>
);


