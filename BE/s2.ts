import { OpenAI, Settings, OpenAIEmbedding } from "llamaindex";
import { serviceContextFromDefaults, SimpleResponseBuilder , ResponseSynthesizer  } from "llamaindex";
import { VectorIndexRetriever, RetrieverQueryEngine  } from "llamaindex";
import { Document, VectorStoreIndex, SimpleDirectoryReader } from "llamaindex";
import { SimpleNodeParser, RouterQueryEngine, SummaryIndex, QueryEngineTool, LLMSingleSelector,TreeSummarize } from "llamaindex";
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
               Given context information,answer the query 
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
  index:{
    serviceContext  : customServiceContext,
    embedModel : customEmbedModel,
  },
  topK : 2,
  serviceContext : customServiceContext,
});


const customQueryEngine = new RetrieverQueryEngine(
  customRetriever,
  customSynthesizer,
);

const summaryQueryEngine = summaryIndex.asQueryEngine();

//console.log(customQueryEngine);

const summaryTool = new QueryEngineTool({
  queryEngine: summaryQueryEngine,
  metadata:{
    name:"Summary Tool",
    description: "Useful for summarizing the data given about OOPS in Python",
   // parameters:{},
  },
});

//console.log(summaryTool.metadata);

const vectorTool = new QueryEngineTool({
  queryEngine: customQueryEngine,
  metadata:{
    name:"Vector Tool",
    description: "Useful for retrieving specific content from the OOPS document",
    //parameters:{},
  },
});

//console.log(vectorTool);



const customLLMSingleSelector = new LLMSingleSelector({
  llm:customLLM,
  //prompt:customPrompt,
});

//console.log(customLLMSingleSelector);

const customTreeSummarize = new TreeSummarize({
    llm: customLLM,
  });

//console.log(customTreeSummarize);

const queryEngine = new RouterQueryEngine({
  selector:customLLMSingleSelector,
  queryEngineTools: [
    summaryTool,
    vectorTool,
  ],
  summarizer: customTreeSummarize,
  verbose: true,
});


//console.log(queryEngine);


const response = await queryEngine.query({
 query: "Tell me about Inheritance in Python on high level in 300 words only.",
}); 

/*try{
  const response = await queryEngine.query({
    query:"Tell me about Python in 300 words.",
  });
  console.log(response.toString());
}catch(e){
  //console.log(e);
  console.log(e);
}*/ 






//console.log(queryEngine);


/*let response = await queryEngine.query({
  query : "Tell me about Python",
});*/ 

//console.log(response.toString());



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


