import { OpenAI, Settings } from "llamaindex";
import { Document, VectorStoreIndex, SimpleDirectoryReader } from "llamaindex";
import dotenv from "dotenv";
import express from "express";

const app = express();

dotenv.config({ path: "./api.env" });


Settings.llm = new OpenAI({ model: "gpt4", temperature: 0 });

//const Document = SimpleDirectoryReader.load('./data');

//const index = VectorStoreIndex.fromDocuments(document);






app.use(express.json());

app.use(function cb(req, res) {
  if (req.method == "GET") {
    res.status(200).json({
      status: "Success",
      message: "Route Found"
    });
  };
});



const PORT = 8000;


app.listen(PORT, function() {
  console.log(`Server has Started at ${PORT}`);
});


