fetch("http://localhost:3000/exercises")
  .then(response => response.json())
  .then(data => renderPage(data)
  );
