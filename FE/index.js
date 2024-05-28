import * as mod from "https://deno.land/std@0.213.0/dotenv/mod.ts";
//import { Document, VectorStoreIndex, SimpleDirectoryReader } from "npm:llamaindex@0.1.3"
const keys = await mod.load({
  envPath:"./api.env",
  export:true
}) // read API key from .env

console.log(keys);
