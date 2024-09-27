tablelist();
function book() {
  window.location = "index.html";
}
function list() {
  window.location = "booklist.html";
}
function exportfile() {
  window.location = "Export.html";
}
function filter() {
  window.location = "filter.html";
}

function filter_search() {
  const filterCriteria = document.getElementById("Search").value;
  //document.getElementById("test").innerHTML = filterCriteria;
  const searchValue = document.getElementById("value").value;
  //document.getElementById("test").innerHTML = searchValue;
  if (!filterCriteria || !searchValue) {
    document.getElementById("result").innerHTML =
      "Please enter a filter and enter a search term.";
    return;
  }

  const request = new XMLHttpRequest();
  request.open("POST", "http://localhost:5000/filter");

  request.setRequestHeader("Content-Type", "application/json");

  request.onload = function () {
    if (request.status === 200) {
      const response = JSON.parse(request.responseText);
      if (response.length > 0) {
        let resultHTML = "";
        for (let i = 0; response.length > i; i++) {
          resultHTML +=
            "Author: " +
            response[i].author +
            ". Title: " +
            response[i].title +
            " Genre: " +
            response[i].genre +
            "Publication date: " +
            response[i].publication_date +
            "ISBN: " +
            response[i].ISBN +
            "<br>";
        }
        document.getElementById("result").innerHTML = resultHTML;
      } else {
        document.getElementById("result").innerHTML = "No data found";
      }
    }
  };

  request.onerror = function () {
    console.error("Network error occurred");
  };

  request.send(JSON.stringify({ filter: filterCriteria, value: searchValue }));
}

function tablelist() {
  const request = new XMLHttpRequest();

  request.open("GET", "http://localhost:5000/book");

  request.onload = function () {
    if (request.status == 200) {
      const response = JSON.parse(request.responseText);

      const tableBody = document.querySelector("#bookTable tbody");

      response.forEach((book) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.genre}</td>
                    <td>${book.publication_date}</td>
                    <td>${book.ISBN}</td>
                `;

        tableBody.appendChild(row);
      });
    } else {
      console.error("Failed to retrieve data. Status: " + request.status);
    }
  };

  request.onerror = function () {
    console.error("Network error occurred");
  };

  request.send();
}

function addbook() {
  const isbn13Pattern = /^(978|979)-?\d{1,5}-?\d{1,7}-?\d{1,7}-?[\dX]$/; // ISBN
  const yearPattern = /^\d{4}-\d{2}-\d{2}$/; //YYYY-MM-DD
  const valid = isbn13Pattern.test(document.getElementById("ISBN").value);
  const valid2 = yearPattern.test(
    document.getElementById("publication_date").value
  );
  if (!valid || !valid2 || document.getElementById("title").value==="" || document.getElementById("author").value==="" || document.getElementById("genre").value==="" ) {
    alert("incorrect ISBN number or Date format");
  } else {
    var data = {
      title: document.getElementById("title").value,
      author: document.getElementById("author").value,
      genre: document.getElementById("genre").value,
      publication_date: document.getElementById("publication_date").value,
      ISBN: document.getElementById("ISBN").value,
    };
    const request = new XMLHttpRequest();
    request.open("POST", "http://localhost:5000/addbook");

    request.setRequestHeader("Access-Control-Allow-Credentials", "true");
    request.setRequestHeader("Content-Type", "application/json");

    request.send(JSON.stringify(data));
  }
}

function exportdata() {
  const request = new XMLHttpRequest();

  request.open("GET", "http://localhost:5000/JSON");

  request.send();
}
