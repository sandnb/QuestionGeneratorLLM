"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var llamaindex_1 = require("llamaindex");
var llamaindex_2 = require("llamaindex");
var dotenv_1 = require("dotenv");
var express_1 = require("express");
var app = (0, express_1.default)();
dotenv_1.default.config({ path: "./api.env" });
llamaindex_1.Settings.llm = new llamaindex_1.OpenAI({ model: "gpt4", temperature: 0 });
var reader = new llamaindex_2.SimpleDirectoryReader();
var document = await reader.loadData("./data");
console.log(document);
app.use(express_1.default.json());
app.use(function cb(req, res) {
    if (req.method == "GET") {
        res.status(200).json({
            status: "Success",
            message: "Route Found"
        });
    }
    ;
});
var PORT = 8000;
app.listen(PORT, function () {
    console.log("Server has Started at ".concat(PORT));
});
