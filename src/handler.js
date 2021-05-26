/* eslint-disable eqeqeq */
const { nanoid } = require('nanoid');
const books = require('./books');
const wrapper = require('./helpers/utils/wrapper');

const { BadRequestError, InternalServerError, NotFoundError } = require('./helpers/error');
const { SUCCESS: http } = require('./helpers/status_code');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount,
    readPage, reading,
  } = request.payload;

  if (!name) {
    return wrapper.response(h, 'fail', wrapper.error(new BadRequestError('Gagal menambahkan buku. Mohon isi nama buku')));
  }

  if (readPage > pageCount) {
    return wrapper.response(h, 'fail', wrapper.error(new BadRequestError(
      'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    )));
  }

  const id = nanoid(16);
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    return wrapper.response(h, 'success', wrapper.data({ bookId: id }), 'Buku berhasil ditambahkan', http.CREATED);
  }

  return wrapper.response(h, 'fail', wrapper.error(new InternalServerError('Buku gagal ditambahkan')));
};

const getBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;

  let resultBooks = [...books];
  if (reading) {
    resultBooks = books.filter((book) => book.reading == reading);
  }

  if (finished) {
    resultBooks = books.filter((book) => book.finished == finished);
  }

  if (name) {
    resultBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  resultBooks = resultBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return wrapper.response(h, 'success', wrapper.data({ books: resultBooks }), 'Berhasil mengambil data buku');
};

const getBookById = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((item) => item.id === bookId);
  if (book.length === 0) {
    return wrapper.response(h, 'fail', wrapper.error(new NotFoundError('Buku tidak ditemukan')));
  }

  return wrapper.response(h, 'success', wrapper.data({ book: book[0] }), 'Berhasil mengambil data buku');
};

const updateBook = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, readPage, pageCount, reading,
  } = request.payload;

  if (!name) {
    return wrapper.response(h, 'fail', wrapper.error(new BadRequestError('Gagal memperbarui buku. Mohon isi nama buku')));
  }

  if (readPage > pageCount) {
    return wrapper.response(h, 'fail', wrapper.error(new BadRequestError('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount')));
  }

  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) return wrapper.response(h, 'fail', wrapper.error(new NotFoundError('Gagal memperbarui buku. Id tidak ditemukan')));

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    readPage,
    pageCount,
    reading,
    updatedAt: new Date().toISOString(),
  };

  return wrapper.response(h, 'success', wrapper.data({}), 'Buku berhasil diperbarui');
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;

  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) return wrapper.response(h, 'fail', wrapper.error(new NotFoundError('Buku gagal dihapus. Id tidak ditemukan')));

  books.splice(bookIndex, 1);
  return wrapper.response(h, 'success', wrapper.data({}), 'Buku berhasil dihapus');
};

module.exports = {
  addBookHandler,
  getBooksHandler,
  getBookById,
  updateBook,
  deleteBook,
};
