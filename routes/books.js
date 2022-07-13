const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];

router.get('/', async (req, res) => {
    let query = Book.find();
    if(req.query.title != null && req.query.title != 'null') {
      query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if(req.query.publishBefore != null && req.query.publishBefore != '') {
      query = query.lte('publishDate', req.query.publishBefore);
    }
    if(req.query.publishAfter != null && req.query.publishAfter != '') {
      query = query.gte('publishDate', req.query.publishAfter);
    }
    try {
      const books = await query.exec();
      res.render('books/index', {
        books: books,
        searchOptions: req.query
      });
    } catch {
      res.redirect('/');
    } 
});

router.get('/new', async (req, res) => {
    renderNewPage(res, new Book()); 
});

router.post('/', async (req, res) => {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      description: req.body.description
    })
    saveCover(book, req.body.cover);
    try {
      const newBook = await book.save()
      // res.redirect(`books/${newBook.id}`)
      res.redirect(`books`)
    } catch(err) {
      console.error(err);
      renderNewPage(res, book, true)
    }
})



function saveCover(book, coverEncoded) {
  if(coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if(cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find();
        const params = {
            authors,
            book
        }
        if(hasError) params.errorMessage = 'Error Creating Book';
        res.render('books/new', params);
    } catch {
        res.redirect('/books');
    }
}

module.exports = router; 