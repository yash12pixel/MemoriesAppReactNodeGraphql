import User from "../../models/user.js";
import Post from "../../models/post.js";
import dotenv from "dotenv";
dotenv.config();
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const postResolver = {
  Query: {
    async getPostsByUser(_, { id }, context) {
      // console.log("log", context);
      const user = context.user;
      try {
        if (!context.loggedIn) {
          // console.log("login");
          throw new Error("Please Login Again");
        } else {
          const userByPost = await User.findById({ _id: user.id }).populate(
            "posts"
          );
          // console.log("userPost::", userByPost);
          return userByPost;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async getPost(_, { id }, context) {
      const user = context.user;
      try {
        if (!context.loggedIn) {
          throw new Error("Please Login Again");
        } else {
          const isValidPostId = await Post.findOne({ _id: id });

          if (!isValidPostId) {
            throw new Error(
              `The id: ${id} that you've entered is invalid. Please try again.`
            );
          }

          const post = await Post.findById({ _id: id }).populate("user");
          // console.log("post::", post);
          return post;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Upload: GraphQLUpload,

  Mutation: {
    async createPost(
      _,
      { title, message, creator, tags, selectedFile },
      context
    ) {
      const user = context.user;
      // let url;
      // console.log("user::", user);

      try {
        if (!context.loggedIn) {
          throw new Error("Please Login Again");
        }
        if (!title || !message || !creator || !tags || !selectedFile) {
          throw new Error("All fields are required");
        }

        // if (file) {
        //   const { path } = file;
        //   const newPath = await uploader(path);
        //   url = {
        //     public_id: newPath.public_id,
        //     asset_id: newPath.asset_id,
        //     version_id: newPath.version_id,
        //     width: newPath.width,
        //     height: newPath.height,
        //     format: newPath.format,
        //     original_filename: newPath.original_filename,
        //     url: newPath.url,
        //   };
        //   // console.log("urls::", url);
        //   fs.unlinkSync(path);
        // }
        if (selectedFile) {
          const { createReadStream, mimetype, filename } = await selectedFile;
          // console.log("filess::", selectedFile);
          const uploadResponse = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "memories" },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );

            createReadStream().pipe(stream);
          });

          const image = {
            public_id: uploadResponse.public_id, // Generate a unique ID or use a package like 'uuid' to generate one
            asset_id: uploadResponse.asset_id,
            version_id: uploadResponse.version_id,
            width: uploadResponse.width,
            height: uploadResponse.height,
            format: uploadResponse.format,
            filename: filename,
            url: uploadResponse.url,
            created_at: uploadResponse.created_at,
          };

          const postMessage = await Post.create({
            title,
            message,
            creator,
            tags,
            selectedFile: image,
            user: user.id,
          });
          const result = await postMessage.save();

          await User.findByIdAndUpdate(
            { _id: user.id },
            { $push: { posts: postMessage._id } },
            { new: true }
          );

          //   console.log("result add::", result);

          return result;
        } else {
          const postMessage = await Post.create({
            title,
            message,
            creator,
            tags,
            user: user.id,
          });
          const result = await postMessage.save();

          await User.findByIdAndUpdate(
            { _id: user.id },
            { $push: { posts: postMessage._id } },
            { new: true }
          );

          //   console.log("result add::", result);

          return result;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async updatePost(
      _,
      { id, title, message, creator, tags, selectedFile },
      context
    ) {
      //   const user = context.user.user;
      try {
        if (!context.loggedIn) {
          throw new Error("Please Login Again");
        } else {
          const isPost = await Post.findOne({ _id: id });
          let updated_image = {};
          if (!isPost) {
            throw new Error(
              `The id: ${id} that you've entered is invalid. Please try again.`
            );
          }
          if (selectedFile) {
            const post_public_id = isPost?.selectedFile.public_id;

            const delCloud = await cloudinary.uploader.destroy(
              post_public_id,
              (error, result) => {
                // console.log("result update---", result);

                if (error) {
                  console.log(
                    "error delete file on cloud while update---",
                    error
                  );
                  throw new Error("error while deleting file!");
                }
              }
            );
            if (delCloud.result === "not found") {
              throw new Error("File not found/Already deleted");
            }

            const { createReadStream, mimetype, filename } = await selectedFile;
            // console.log("filess update::", selectedFile);
            const uploadResponse = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "memories" },
                (error, result) => {
                  if (result) {
                    resolve(result);
                  } else {
                    reject(error);
                  }
                }
              );

              createReadStream().pipe(stream);
            });

            updated_image = {
              public_id: uploadResponse.public_id, // Generate a unique ID or use a package like 'uuid' to generate one
              asset_id: uploadResponse.asset_id,
              version_id: uploadResponse.version_id,
              width: uploadResponse.width,
              height: uploadResponse.height,
              format: uploadResponse.format,
              filename: filename,
              url: uploadResponse.url,
              created_at: uploadResponse.created_at,
            };

            const updatedPost = await Post.findByIdAndUpdate(
              { _id: id },
              {
                $set: {
                  title: title,
                  creator: creator,
                  message: message,
                  tags: tags,
                  selectedFile: updated_image,
                },
              },
              { new: true }
            );
            const result = updatedPost;
            // console.log("result:::", result);
            return result;
          } else {
            const updatedPost = await Post.findByIdAndUpdate(
              { _id: id },
              {
                $set: {
                  title: title,
                  creator: creator,
                  message: message,
                  tags: tags,
                },
              },
              { new: true }
            );
            const result = updatedPost;
            // console.log("result:::", result);
            return result;
          }
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async deletePost(_, { id }, context) {
      const user = context.user;
      // console.log("user::", user);
      try {
        if (!context.loggedIn) {
          throw new Error("Please Login Again");
        } else {
          const isPost = await Post.findOne({ _id: id });

          if (!isPost)
            throw new Error(
              `The id: ${id} that you've entered is invalid. Please try again.`
            );

          const delCloud = await cloudinary.uploader.destroy(
            isPost.selectedFile?.public_id,
            (error, result) => {
              // console.log("result---", result);

              if (error) {
                console.log("error delete file on cloud---", error);
                return errorResponse(res, "error while deleting file!", 400);
              }
            }
          );

          if (delCloud.result === "not found") {
            return errorResponse(res, "File not found/Already deleted", 400);
          }

          const delres = await Post.findByIdAndDelete(id);

          // console.log("post data:::", isPost);
          const findUser = await User.findOne({ _id: user.id });
          // console.log("findUser:::", findUser);

          const updatePosts = findUser.posts.filter((posts) => {
            return posts != id;
          });
          // console.log("updatePosts:::", updatePosts);

          const updateUser = await User.findOneAndUpdate(
            { _id: user.id },
            { $set: { posts: updatePosts } }
          );
          // console.log("updateUser:::", updateUser);

          await updateUser.save();
          // console.log("result:::", result);

          // console.log("delres:::", delres);

          return delres;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async likePost(_, { id }, context) {
      try {
        if (!context.loggedIn) {
          throw new Error("Please Login Again");
        } else {
          const isPost = await Post.findOne({ _id: id });

          if (!isPost) {
            throw new Error(
              `The id: ${id} that you've entered is invalid. Please try again.`
            );
          }

          const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likeCount: isPost.likeCount + 1 },
            { new: true }
          );

          const result = updatedPost;
          return result;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

export default postResolver;
