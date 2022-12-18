const express = require("express");
const app = express();
const getRoutes = require("./routes/getRoutes.js");

const PORT = 3001;
//Middelwares
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", getRoutes);

app.listen(PORT, (req, res) => {
  console.log("Backend Running....");
});
