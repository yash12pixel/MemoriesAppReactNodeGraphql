import express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import mongoose from "mongoose";
import typeDefs from "./graphql/typeDefs/index.js";
import resolvers from "./graphql/resolvers/index.js";

import { getPayload } from "./utils/util.js";
const app = express();
// const httpServer = http.createServer(app);
app.use(cors());

// var corsOptions = {
//   origin: "http://localhost:3000/",
//   credentials: true,
// };

const MONGODB =
  "mongodb+srv://akshay:akshay@cluster0.n1rgdfb.mongodb.net/test4";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: true,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    // console.log("token", token);
    const { payload: user, loggedIn } = getPayload(token);
    return { user, loggedIn };
  },
  // plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// app.use(
//   cors({
//     methods: ["GET", "POST", "OPTIONS"],
//     credentials: true,
//     maxAge: 600,
//     origin: ["http://localhost:3000", "https://studio.apollographql.com"],
//   })
// );

// const { url } = await startStandaloneServer(server, {
//   listen: { port: 5001 },
//   // context: ({ req }) => {
//   //   const token = req.headers.authorization || "";
//   //   // console.log("token", token);
//   //   const { payload: user, loggedIn } = getPayload(token);
//   //   return { user, loggedIn };
//   // },
// });
// await server.start();
// server.applyMiddleware({ app });
// app.listen({ port: 5001 }, () =>
//   console.log(`http://localhost:4000${server.graphqlPath}`)
// );

// console.info(`🚀 Server ready at ${url}`);

// mongoose.set("strictQuery", false);

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("connected");
    return server.listen({ port: 5001 });
  })
  .then((res) => {
    console.log(`server running on ${res.url}`);
  })
  .catch((err) => {
    console.log("error:::", err);
  });
