#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { version } = require("../package.json");
const ACTIVITY_LOG_FILE = path_1.default.join(__dirname, "activity.log");
function getSymbolFromName(name) {
    if (["bitcoin", "btc"].includes(name.toLowerCase()))
        return "BTCUSDT";
    if (["ethereum", "eth"].includes(name.toLowerCase()))
        return "ETHUSDT";
    return typeof name === "string" ? name.toUpperCase() : String(name).toUpperCase();
}
const server = new mcp_js_1.McpServer({
    name: "Binance MCP",
    version
});
server.tool("get_price", { symbol: zod_1.z.string() }, async ({ symbol }) => {
    const resolvedSymbol = getSymbolFromName(symbol);
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${resolvedSymbol}`;
    const response = await fetch(url);
    if (!response.ok) {
        const errorText = await response.text();
        fs_1.default.appendFileSync(ACTIVITY_LOG_FILE, `Error getting price for ${resolvedSymbol}: ${response.status} ${errorText}\n`);
        throw new Error(`Error getting price for ${resolvedSymbol}: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    const price = data.price;
    fs_1.default.appendFileSync(ACTIVITY_LOG_FILE, `Successfully got price for ${resolvedSymbol}. Current price is ${price}. Current time is ${new Date().toISOString()}\n`);
    return { content: [{ type: "text", text: `The current price of ${resolvedSymbol} is ${price}` }] };
});
server.tool("get_price_price_change", { symbol: zod_1.z.string() }, async ({ symbol }) => {
    const resolvedSymbol = getSymbolFromName(symbol);
    const url = `https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${resolvedSymbol}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error getting price change for ${resolvedSymbol}: ${response.status}`);
    }
    const data = await response.json();
    return { content: [{ type: "text", text: JSON.stringify(data) }] };
});
server.resource("file://activity.log", new mcp_js_1.ResourceTemplate("file://activity.log", { list: undefined }), async () => {
    if (!fs_1.default.existsSync(ACTIVITY_LOG_FILE))
        return { contents: [{ uri: "file://activity.log", text: "" }] };
    const text = fs_1.default.readFileSync(ACTIVITY_LOG_FILE, "utf-8");
    return { contents: [{ uri: "file://activity.log", text }] };
});
server.resource("resource://crypto_price/{symbol}", new mcp_js_1.ResourceTemplate("resource://crypto_price/{symbol}", { list: undefined }), async (uri, variables) => {
    const symbol = variables.symbol;
    const resolvedSymbol = getSymbolFromName(symbol);
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${resolvedSymbol}`;
    const response = await fetch(url);
    if (!response.ok) {
        return { contents: [{ uri: uri.href, text: `Error getting price for ${resolvedSymbol}` }] };
    }
    const data = await response.json();
    return { contents: [{ uri: uri.href, text: `The current price of ${resolvedSymbol} is ${data.price}` }] };
});
async function startServer() {
    if (!fs_1.default.existsSync(ACTIVITY_LOG_FILE)) {
        fs_1.default.writeFileSync(ACTIVITY_LOG_FILE, "");
    }
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error(`Binance MCP Server v${version} started`);
    console.error("Tools: get_price, get_price_price_change");
    console.error("Resources: file://activity.log, resource://crypto_price/{symbol}");
}
startServer().catch(err => {
    console.error("Error starting server:", err);
    process.exit(1);
});
