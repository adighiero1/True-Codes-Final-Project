import express from "express"; //express sever
const app = express();
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js"; //importing routing and all the functions
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

//middlewares
app.use((req, res, next) => {
  //whenever we make a request we are going to give an access
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json()); // using express that json to be able to send data as an object in all our controllers
app.use(
  //to only allow localhost
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

//multer is used to upload and save files to storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload"); //creating folder where files will be uploaded
  },
  filename: function (req, file, cb) {
    //creating name for picture
    cb(null, Date.now() + file.originalname); //creating unique name by adding date to file name
  },
});
//multer will be using this storage
const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  //endpoint for picture post
  const file = req.file; //if everything is ok we are going to send the file
  res.status(200).json(file.filename);
});
//using the routes that are imported to reach our endpoints
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // when we visit api/users it will go to user Routes on users.js
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);

app.listen(8800, () => {
  // application running on port 8800
  console.log("API working!");
});
