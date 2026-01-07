const express = require("express");
const connectDB = require("./db");

const Book = require("./models/book");
const User = require("./models/user");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

connectDB();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/books", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.put("/books/:id", async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedBook);
});

app.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book Deleted" });
});


app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
