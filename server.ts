import * as mod from "dotenv";
import { Document, VectorStoreIndex, SimpleDirectoryReader } from "llamaindex";
const keys = mod.config();// read API key from .env

const documents = await new SimpleDirectoryReader().loadData({ directoryPath: "./data" })
const index = await VectorStoreIndex.fromDocuments(documents)
const queryEngine = index.asQueryEngine()

const handler2 = async (req: Request) => {
  if (req.method == "POST") {
    // we'll expect the incoming query to be a JSON object of the form {query: ...}
    console.log(req)
    let data = await req.json()
    let answer = await queryEngine.query({ query: data.query })
    // and our response will be a JSON object of the form {response: ...}
    let responseObj = {
      response: answer.toString()
    }
    return new Response(JSON.stringify(responseObj), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      }
    })
  } else if (req.method == "OPTIONS") {
    return new Response("", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      }
    })
  } else {
    return new Response("Not found", { status: 404 })
  }
}


