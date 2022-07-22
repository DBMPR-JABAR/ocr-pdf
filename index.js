const express = require("express");

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
app.use((error, req, res, next) => {
  console.log("This is the rejected field ->", error.field);
});

app.use(express.json());

app.use("/api/parse-pdf", require("./routes/pdfRoute"));
