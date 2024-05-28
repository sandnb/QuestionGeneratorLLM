import { OpenAI, Settings, OpenAIEmbedding } from "llamaindex";
import { Document, VectorStoreIndex, SimpleDirectoryReader } from "llamaindex";
import dotenv from "dotenv";
import express from "express";

const app = express();

dotenv.config({ path: "./api.env" });


const customLLM = new OpenAI({ model: "gpt4", temperature: 0 });

const customEmbedModel = new OpenAIEmbedding({
  model: "text-embedding-3-large",
});

//console.log(customLLM,customEmbedModel);





const reader = new SimpleDirectoryReader();

const document = await reader.loadData("./data");

//console.log(document);



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


