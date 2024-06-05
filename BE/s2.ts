import { OpenAI, Settings, OpenAIEmbedding } from "llamaindex";
import { serviceContextFromDefaults, SimpleResponseBuilder , ResponseSynthesizer  } from "llamaindex";
import { VectorIndexRetriever, RetrieverQueryEngine  } from "llamaindex";
import { Document, VectorStoreIndex, SimpleDirectoryReader } from "llamaindex";
import { SimpleNodeParser, RouterQueryEngine, SummaryIndex } from "llamaindex";
import dotenv from "dotenv";
import express from "express";

const app = express();

dotenv.config({ path: "./api.env" });

const customLLM = new OpenAI({ model: "gpt-4", temperature: 0, topP:2 });

const customEmbedModel = new OpenAIEmbedding({
  model: "text-embedding-3-large",
});

Settings.nodeParser = new SimpleNodeParser({
  chunkSize:1024,
  splitLongSentences:true,
});

//console.log(Settings.nodeParser);

const document = await new SimpleDirectoryReader().loadData({
  directoryPath: "./data",
});

const vectorIndex = await VectorStoreIndex.fromDocuments(document);

//console.log(vectorIndex);

const summaryIndex = await SummaryIndex.fromDocuments(document);

const customServiceContext = new serviceContextFromDefaults({
  llm:customLLM,
  embedModel: customEmbedModel,
  nodeParser: Settings.nodeParser,
});

//console.log(customServiceContext);

const customPrompt = function({context="",query=""}){
          return(`context information is provided below
               --------------------------------------------
               ${context},
               ---------------------------------------------
               Given context info,answer query
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
  serviceContext  : customServiceContext ,
});

//console.log(customSynthesizer);

const customRetriever = new VectorIndexRetriever({ 
  index:vectorIndex,
  serviceContext: customServiceContext,
});


const customQueryEngine = new RetrieverQueryEngine(
  customRetriever,
  customSynthesizer,
);

const summaryQueryEngine = summaryIndex.asQueryEngine();

//console.log(customQueryEngine);


const queryEngine = RouterQueryEngine.fromDefaults({
  queryEngineTools : [
    {
      queryEngine: customQueryEngine,
      description: "Useful for retrieving specific questions related to given data",
    },
    {
      queryEngine: summaryQueryEngine,
      description: "Useful for summarization questions related to given data",
    },
  ],
});


let response = await queryEngine.query({
  query : "Tell me what is polymorphism on a high-level",
});

console.log(response.toString());



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


