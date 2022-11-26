const express = require("express");
const app = express();

const cors=require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authroute = require("./routes/auth");
const userroute = require("./routes/users");
const postroute = require("./routes/posts");
const categoryrouth = require("./routes/categories");
const multer = require("multer");
const path = require("path");

dotenv.config();
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}


app.use(express.json());


app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});


app.use(cors(corsOptions)) // Use this after the variable declaration
app.use("/auth", authroute);
app.use("/user", userroute);
app.use("/posts", postroute);
app.use("/categories", categoryrouth);

if (process.env.NODE_ENV == "production") {
  const path = require("path");

//   app.get("/", (req, res) => {
//     app.use(express.static(path.resolve(__dirname, "my-app", "public")));
//     res.sendFile(path.resolve(__dirname, "my-app", "public", "index.html"));
//   });
// }

app.get("/*", (req, res) => {
  app.use(express.static(path.join(__dirname, "./App/public")));
  res.sendFile(path.join(__dirname, "./App/public", "index.html"));
});
}
const Port = process.env.PORT || 5000;

app.listen(Port, () => console.log("server is running"));
