function checkForStorage() {
  return typeof Storage !== "undefined";
}

const tambahBuku = new Event("tambahBuku");
const itemBuku = JSON.parse(localStorage.getItem("rak")) || [];

window.addEventListener("load", function () {
  tampilData(itemBuku);
  const inputForm = document.querySelector("#inputBook");
  inputForm.addEventListener("submit", inputNilai);
  document.addEventListener("tambahBuku", simpanData);
});

// Event listener untuk tombol pencarian
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', function () {
  const searchInput = document.getElementById('searchBook').value;
  const searchResults = searchBooksByTitle(searchInput);
  displaySearchResults(searchResults);
});

// Fungsi untuk menampilkan hasil pencarian
function displaySearchResults(results) {
  const searchBookshelfList = document.getElementById('searchBookshelfList');
  searchBookshelfList.innerHTML = '';

  if (results.length === 0) {
    searchBookshelfList.innerHTML = '<p>Tidak ada hasil pencarian.</p>';
    return;
  }

  for (const book of results) {
    const bookShelf = makeBookshelf(book);
    searchBookshelfList.appendChild(bookShelf);
  }
}

function inputNilai(e) {
  e.preventDefault();
  const inputBookId = document.querySelector("#inputBookId").value;
  const inputBookTitle = document.querySelector("#inputBookTitle").value;
  const inputBookAuthor = document.querySelector("#inputBookAuthor").value;
  const inputBookYear = document.querySelector("#inputBookYear").value;
  const inputBookIsComplete = document.querySelector("#inputBookIsComplete").checked;
  const inputTarget = document.querySelector("#inputTarget").value;
  const dataBuku = {
    id: inputBookId,
    title: inputBookTitle,
    author: inputBookAuthor,
    year: inputBookYear,
    isComplete: inputBookIsComplete,
    target: inputTarget,
  };
  itemBuku.push(dataBuku);
  document.dispatchEvent(tambahBuku);
  simpanData();
}

function tampilData(itemBuku) {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");
  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';
  for (const data of itemBuku) {
    const itemBukuElement = document.createElement("article");
    itemBukuElement.classList.add("book_item");
    const judul = document.createElement("h2");
    judul.innerText = data.title;
    const penulis = document.createElement("p");
    penulis.innerText = "Penulis: " + data.author;
    const tahun = document.createElement("p");
    tahun.innerText = "Tahun: " + data.year;
    const target = document.createElement("p");
    target.innerText = "Target Selesai: " + data.target;
    const idBuku = document.createElement("p");
    idBuku.innerText = "ID Buku: " + data.id;
    itemBukuElement.appendChild(judul);
    itemBukuElement.appendChild(penulis);
    itemBukuElement.appendChild(tahun);
    itemBukuElement.appendChild(target);
    itemBukuElement.appendChild(idBuku);

    const div = document.createElement("div");
    div.classList.add("action");
    const button1 = document.createElement("button");
    button1.id = data.id;
    button1.innerText = data.isComplete ? "Belum Selesai dibaca" : "Selesai dibaca";
    button1.classList.add("green");
    button1.addEventListener("click", data.isComplete ? pindahRakBelum : pindahRakSelesai);
    const button2 = document.createElement("button");
    button2.id = data.id;
    button2.innerText = "Hapus";
    button2.classList.add("red");
    button2.addEventListener("click", dialogue);
    button2.addEventListener("click", hapusItem);
    div.appendChild(button1);
    div.appendChild(button2);
    itemBukuElement.appendChild(div);

    if (data.isComplete) {
      completeBookshelfList.appendChild(itemBukuElement);
    } else {
      incompleteBookshelfList.appendChild(itemBukuElement);
    }
  }
}

function pindahRakSelesai(inputNilai) {
  const id = inputNilai.target.id;
  const bookIndex = itemBuku.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    itemBuku[bookIndex].isComplete = true;
    simpanData();
  }
}

function pindahRakBelum(inputNilai) {
  const id = inputNilai.target.id;
  const bookIndex = itemBuku.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    itemBuku[bookIndex].isComplete = false;
    simpanData();
  }
}

function dialogue() {
  alert("Anda Telah Menghapus Buku");
}

function hapusItem(inputNilai) {
  const id = inputNilai.target.id;
  const bookIndex = itemBuku.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    itemBuku.splice(bookIndex, 1);
    simpanData();
  }
}

function simpanData() {
  localStorage.setItem("rak", JSON.stringify(itemBuku));
  tampilData(itemBuku);
}

tampilData(itemBuku);


// Fungsi untuk mencari buku berdasarkan judul
function searchBooksByTitle(title) {
  const searchResults = itemBuku.filter((book) => {
    return book.title.toLowerCase().includes(title.toLowerCase());
  });
  return searchResults;
}
