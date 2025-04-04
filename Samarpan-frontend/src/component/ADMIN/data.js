const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NDM2NzAyMTcsImV4cCI6MTc1MTQ0NjIxN30.yZOqLJa1MlBzpRUaWUSgJIgyMgaCh2RabD7Lmw9e6fTfvVjPDJORcJoOMp1jf707FTnnrl2N9m26TpoFFX76Sg";

fetch("http://localhost:8080/api/v1/Batch/getAllBatch", {
  method: "GET",
  headers: {
    "Accept": "*/*",
    "Authorization": `Bearer ${token}` // Attach Bearer Token
  }
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log(response);
    return response.json(); // Convert response to JSON
  })
  .then(data => console.log("Batch Data:", data)) // Handle success
  .catch(error => console.error("Error fetching batch data:", error)); // Handle error
