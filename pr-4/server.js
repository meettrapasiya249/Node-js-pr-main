
   const express = require("express");
    const mongoose = require("mongoose");

    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static("public"));

    app.set("view engine", "ejs");

    mongoose.connect(
      "mongodb+srv://meet:meet%401232@cluster0.aipj3q6.mongodb.net/books"
    )
    .then(() => console.log("MongoDB Atlas CONNECTED"))
    .catch(err => console.log("Mongo ERROR:", err.message));

    const bookRoutes = require("./routes/bookRoutes");
    app.use("/", bookRoutes);

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000"); 
    });
 