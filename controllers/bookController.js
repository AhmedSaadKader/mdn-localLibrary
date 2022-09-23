const Book = require("../models/book");

exports.index = (req, res) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
};

exports.book_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Book list");
};

exports.book_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Book detail: ${req.params.id}`);
};

exports.book_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book create GET");
};

// Handle book create on POST.
exports.book_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book create POST");
};

// Display book delete form on GET.
exports.book_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST.
exports.book_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
exports.book_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST.
exports.book_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update POST");
};
