from pathlib import Path

from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client

MCP_FOLDER = Path(__file__).parent.absolute()
server_params = StdioServerParameters(
    command="/Users/aajain/projects/personal/mcp-course/.venv/bin/python",
    args=[str(MCP_FOLDER/"binance_mcp.py")],
    env=None
)

async def run():
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read,write) as session:
            await session.initialize()
            
            tools = await session.list_tools()
            print(f"Tools Available: {tools}")

            result = await session.call_tool(
                "get_price",
                arguments={"symbol":"BTCUSDT"}
            )
            print(f"Result: {result.content[0].text}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(run())