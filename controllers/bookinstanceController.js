const BookInstance = require("../models/bookinstance");
const async = require("async");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");

exports.bookinstance_list = (req, res) => {
  BookInstance.find()
    .populate("book")
    .exec(function (err, list_bookinstances) {
      if (err) {
        return next(err);
      }
      res.render("bookinstance_list", {
        title: "Book Instance List",
        bookinstance_list: list_bookinstances,
      });
    });
};

exports.bookinstance_detail = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec((err, bookinstance) => {
      if (err) {
        return next(err);
      }
      if (bookinstance == null) {
        const err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }
      res.render("bookinstance_detail", {
        title: `Copy ${bookinstance.book.title}`,
        bookinstance,
      });
    });
};

exports.bookinstance_create_get = (req, res, next) => {
  Book.find({}, "title").exec((err, books) => {
    if (err) {
      return next(err);
    }
    res.render("bookinstance_form", {
      title: "Create BookInstance",
      book_list: books,
      bookinstance: "",
    });
  });
};

exports.bookinstance_create_post = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified").trim().isLength({ min: 1 }).escape(),
  body("status").escape(),
  body("due_back", "Invalid date").optional({ checkFalsy: true }).isISO8601().toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });
    if (!errors.isEmpty()) {
      Book.find({}, "title").exec(function (err, books) {
        if (err) {
          return next(err);
        }
        res.render("bookinstance_form", {
          title: "Create BookInstance",
          book_list: books,
          errors: errors.array(),
          bookinstance,
        });
      });
      return;
    }
    bookinstance.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(bookinstance.url);
    });
  },
];

exports.bookinstance_delete_get = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate("book")
    .exec((err, bookinstance) => {
      if (err) {
        return next(err);
      }
      if (bookinstance == null) {
        const err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }
      res.render("bookinstance_delete", {
        title: `Delete Copy ${bookinstance.book.title}`,
        bookinstance,
      });
    });
};

exports.bookinstance_delete_post = (req, res, next) => {
  BookInstance.findById(req.params.id).exec((err, bookinstance) => {
    if (err) {
      return next(err);
    }
    BookInstance.findByIdAndRemove(req.body.bookinstanceid, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/catalog/bookinstances");
    });
  });
};

exports.bookinstance_update_get = (req, res, next) => {
  async.parallel(
    {
      bookinstance(callback) {
        BookInstance.findById(req.params.id).populate("book").exec(callback);
      },
      books(callback) {
        Book.find(callback);
      },
    },
    (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.bookinstance == null) {
        const error = new Error("Book Copy not found");
        err.status = 404;
        return next(err);
      }
      res.render("bookinstance_form", {
        title: "Update book instance",
        bookinstance: result.bookinstance,
        book_list: result.books,
      });
    }
  );
};

exports.bookinstance_update_post = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified").trim().isLength({ min: 1 }).escape(),
  body("status").escape(),
  body("due_back", "Invalid date").optional({ checkFalsy: true }).isISO8601().toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      Book.find({}, "title").exec(function (err, books) {
        if (err) {
          return next(err);
        }
        res.render("bookinstance_form", {
          title: "Create BookInstance",
          book_list: books,
          bookinstance,
          errors: errors.array(),
        });
      });
      return;
    }
    BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, (err, theBookInstance) => {
      if (err) {
        return next(err);
      }
      res.redirect(theBookInstance.url);
    });
  },
];
