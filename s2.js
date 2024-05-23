"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var llamaindex_1 = require("llamaindex");
var Express_1 = require("Express");
var app = (0, Express_1.default)();
var dotenv = dotenv.config();
llamaindex_1.Settings.llm = new llamaindex_1.OpenAI({ model: "gpt4", temperature: 0 });
app.use(express.json());
var PORT = 3000;
app.listen(PORT, function () {
    console.log("Server has Started at ".concat(PORT));
});
