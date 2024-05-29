import { OpenAI, Settings, OpenAIEmbedding } from "llamaindex";
import { serviceContextFromDefaults, SimpleResponseBuilder , ResponseSynthesizer  } from "llamaindex";
import { VectorIndexRetriever, RetrieverQueryEngine  } from "llamaindex";
import { Document, VectorStoreIndex, SimpleDirectoryReader } from "llamaindex";
import dotenv from "dotenv";
import express from "express";

const app = express();

dotenv.config({ path: "./api.env" });


const reader = new SimpleDirectoryReader();

const document = await reader.loadData("./data");

const index = await VectorStoreIndex.fromDocuments(document);



const customLLM = new OpenAI({ model: "gpt-4", temperature: 0 });

const customEmbedModel = new OpenAIEmbedding({
  model: "text-embedding-3-large",
});

//console.log(customLLM,customEmbedModel);

const customServiceContext = new serviceContextFromDefaults({
  llm:customLLM,
  embedModel: customEmbedModel,
});

const customPrompt = function({context="",query=""}){
          return(`context information is provided below
               --------------------------------------------
               ${context},
               ---------------------------------------------
               Given context info. answer query. Include a new random
               fact about origins of Indian Cinema Industry in your answer everytime.
                 Query: ${query}
                Answer:`);
};


const customResponseBuilder = new SimpleResponseBuilder(
  customServiceContext,
  customPrompt
);

//console.log(customResponseBuilder);

const customSynthesizer = new ResponseSynthesizer({
  responseBuilder : customResponseBuilder,
  serviceContext  : customServiceContext
});

//console.log(customSynthesizer);

const customRetriever = new VectorIndexRetriever({index});

//console.log(customRetriever);

const customQueryEngine = new RetrieverQueryEngine(
  customRetriever,
  customSynthesizer
);

//console.log(customQueryEngine);

//let response = await customQueryEngine.query({
 // query : "Summarize the data given to you.",
//});


const response = await customQueryEngine.query({ query:"Give me 10 Questions in the fill in the blancks on the data" });
 console.log(response);

//console.log(response);




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


