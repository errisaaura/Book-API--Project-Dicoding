const { nanoid } = require("nanoid");
const books = require("./books");

//ini untuk menambahkan buku
const addBookHandler = (request, h) => {
  //cara mendapatkan body req di hapi = req.payload
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  //ini mau buat finished (pageCount === readPage)
  const finished = () => {
    if (readPage === pageCount) {
      finished = true;
    } else {
      finished = false;
    }
  };

  //ini if kalau namanya kosong
  const noName = books.filter((book) => book.name === undefined);
  if (noName) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  //ini if kalau page nya
  const page = books.filter((book) => book.readPage > book.pageCount);
  if (page) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  //ini apa saja yg mau dimasukkan ke array
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
    createdAt,
    updatedAt,
  };

  //mengirimkan ke dalam array books
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } else {
    const response = h.response({
      status: "error",
      message: "Buku gagal ditambahkan",
    });
    response.code(500);
    return response;
  }
};

//ini untuk menampilkan semua buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const book = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase)
    );
    const response = h.response({
      status: "success",
      data: {
        books: book.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (reading) {
    const book = books.filter(
      (book) => Number(book.reading) === Number(reading)
    );
    const response = h.response({
      status: "success",
      data: {
        books: book.map((book) => ({
          id: books.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  if (finished) {
    const book = book.filter(
      (book) => Number(book.finished) === Number(finished)
    );
    const response = h.response({
      status: "success",
      data: {
        books: book.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "success",
    books: books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    })),
  });
  response.code(200);
  return response;
};

//ini untuk menampilkan buku berdasarkan id
const getBooksByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((book) => book.id === bookId)[0];

  //pastikan objek buku tidak undefined
  if (book !== undefined) {
    const response = h.response({
      status: "success",
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

// //ini untuk update buku berdasarkan id
// const editBookByIdHandler = (request, h) => {
//     const {bookId} = request.params

//     //mendapatkan data baru
//     const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
//     //mengupdate waktu
//     updatedAt = new Date().toISOString()

//     const index = books.findIndex((book) => book.id === bookId)

//     //jika nama nya kosong / tidak diisi
//     if(!name){
//         const response = h.response ({
//             status : 'fail',
//             message : 'Gagal memperbarui buku. Mohon isi nama buku'

//         })
//         response.code(400)
//         return response

//     }

//     //jika readpage > pageCount
//     if(readPage > pageCount){
//         const response = h.response ({
//             status : 'fail',
//             message : 'Gagal memperbarui buku.readPage tidak boleh lebih besar dari pageCount'

//         })
//         response.code(400)
//         return response
//     }

//     //jika ditemukan akan bernilai index array. Jika tidak akan bernilai -1
//     if(index !== -1){
//         books[index] = {
//             ...books[index],
//             name,
//             year,
//             author,
//             summary,
//             publisher,
//             pageCount,
//             readPage,
//             reading,
//             updatedAt
//         }

//         const response = h.response({
//             status : 'success',
//             message : 'Buku berhasil diperbarui'
//         })
//         response.code(200)
//         return response
//     }

//     const response = h.response({
//         status : 'fail',
//         message : 'Gagal memperbarui buku. id tidak ditemukan'

//     })

// }

//ini untuk menghapus buku berdasarkan id nya
const deleteNoteByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBookByIdHandler,
  deleteNoteByIdHandler,
};
