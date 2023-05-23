import express from "express";
import cors from "cors";
// import { ApolloServer } from "apollo-server";
import { ApolloServer } from "apollo-server-express";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import typeDefs from "./graphql/typeDefs/index.js";
import resolvers from "./graphql/resolvers/index.js";
import { getPayload } from "./utils/util.js";

const app = express();
app.use(cors());

const MONGODB = process.env.CONNECTION_URL;
const PORT = 5000;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    uploads: false,
    context: ({ req }) => {
      req.headers["content-type"] = "multipart/form-data";
      req.headers["content-type"] = "application/json";
      const token = req.headers.authorization || "";
      // console.log("token", token);
      const { payload: user, loggedIn } = getPayload(token);
      return { user, loggedIn };
    },
    // plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });

  await server.start();

  const app = express();

  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  await new Promise((r) => app.listen({ port: 5001 }, r));

  console.log(`🚀 Server ready at http://localhost:5001${server.graphqlPath}`);
}

startServer();

mongoose.set("strictQuery", true);

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("DB connected");
    // return server.listen({ port: 5001 });
    //   console.log(`Server Running on Port: http://localhost:${PORT}`)
  })
  // .then((res) => {
  //   console.log(`server running on ${res.url}`);
  // })
  .catch((err) => {
    console.log("error:::", err);
  });
