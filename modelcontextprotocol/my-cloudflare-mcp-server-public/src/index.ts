import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Trial MCP Server",
		version: "1.0.0",
	});

	async init() {
		// Simple addition tool
		this.server.tool(
			"add",
			{ a: z.number(), b: z.number() },
			async ({ a, b }) => ({
				content: [{ type: "text", text: String(a + b) }],
			})
		);

		// Get Crypto Price from Binance tool
		this.server.tool(
			"get_price",
			{ symbol: z.string() },
			async ({ symbol }) => {
				const url = `https://mcp-course.s3.eu-central-1.amazonaws.com/public/hard-coded-price.json`;
				const response = await fetch(url);
				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`Error getting price for ${symbol}: ${response.status} ${errorText}`);
				}

				const data = await response.json() as any;
				const price = data.price;
				return { content: [{ type: "text", text: `The current price of ${symbol} is ${price}` }] };
			}
		);


	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
