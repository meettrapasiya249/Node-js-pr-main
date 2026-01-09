 
 const express = require("express");
  const Book = require("../models/Book");

  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const books = await Book.find();
      res.render("index", { books });
    } catch (error) {
      res.send(" MongoDB not connected. Check Atlas settings.");
    }
  });

  router.post("/add", async (req, res) => {
    try {
      const { title, author, price, genre, publishedYear } = req.body;
      await Book.create({ title, author, price, genre, publishedYear });
      res.redirect("/");
    } catch (error) {
      res.send("Failed to insert data");
    }
  });

  router.get("/edit/:id", async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.redirect("/");
      }
      res.render("edit", { book });
    } catch (error) {
      res.redirect("/");
    }
  });

  router.post("/update/:id", async (req, res) => {
    try {
      const { title, author ,price ,genre ,publishedYear} = req.body;
      await Book.findByIdAndUpdate(req.params.id, {
        title,
        author,
        price,
        genre,
        publishedYear
      });
      res.redirect("/");
    } catch (error) {
      res.send("Failed to update book");
    }
  });

  router.get("/delete/:id", async (req, res) => {
    try {
      await Book.findByIdAndDelete(req.params.id);
      res.redirect("/");
    } catch (error) {
      res.send("Failed to delete book");
    }
  });

  module.exports = router;
