const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send(`
    <h2>📁 TShare Dosya Sunucusu</h2>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Yükle</button>
    </form>
  `);
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.send("Dosya yok!");

  const fileUrl = `${req.protocol}://${req.get("host")}/file/${req.file.filename}`;
  res.send(`Yüklendi ✅ <br><a href="${fileUrl}">${fileUrl}</a>`);
});

app.get("/file/:name", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.name);
  if (!fs.existsSync(filePath)) return res.status(404).send("Dosya yok");
  res.download(filePath);
});

app.listen(PORT, () => {
  console.log("TShare çalışıyor -> PORT:", PORT);
});
