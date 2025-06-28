from mcp.server.fastmcp import FastMCP
mcp = FastMCP("Emergency Contacts MCP")


@mcp.resource("resource://emergency_contacts/{username}")
def get_emergency_contacts(username: str) -> list:
    contacts = {
        "aaditi": ["ankita", "niti", "naman"],
        "alice": ["tom", "harry", "jane"]
    }
    return contacts[username]

if __name__ == "__main__":
    mcp.run(transport="stdio")