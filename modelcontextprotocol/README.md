
I have used this section of the repository, to learn about ModelContextProtocol (MCP) and gain a hands-on in building, deploying and using ModelContextProtocol Servers .

For this purpose, I have followed and [completed](https://www.udemy.com/certificate/UC-6ea80d26-7904-4b91-ad0a-2960b5f23bc5/) an Udemy Course - [MCP Bootcamp: Build AI Agents with Model Context Protocol](https://www.udemy.com/course/learn-mcp-model-context-protocol-course-and-a2a-bootcamphands-hands-on/?couponCode=LOCLZDOFFPINCTRL) . 

## Repository Overview:
The repository contains the following sub-directories: 
### python_mcps: 

1. This directory contains example implemetation of MCP servers and MCP client using python sdk.  It explores the Tools, Resources and Prompts features supported by MCP servers.  All of these use the stdio transport. 
1. As part of the course I also built and deployed a sample MCP server with SSE transport:    
    - Source Code: https://github.com/aaditi-jain/binance_py_mcp
    - Server: https://aaditi-binance-py-mcp.onrender.com/sse 
    - Test using it in your Claude Desktop: 
        - Edit the `claude_desktop_config.json` file to be: 
            ```
            {
                "mcpServers": {            
                    "binance_mcp_render": {
                        "command": "npx",
                        "args": [
                            "mcp-remote",
                            "https://aaditi-binance-py-mcp.onrender.com/sse"
                        ]
                    },
                }
            }    
            ``` 
        - restart Claude desktop. 
     
1. Setting up: 
    1. Used uv as package manager
        1. Install all the dependencies 
            ```
            uv sync
            ```
        1. Setup Virtual Environment and Activat it
            ```
            uv virtualenv .venv
            ```

            ```
            source .venv/bin/activate
            ```
    1. Used MCP inspector to test each server implemetation: 
        ```
        npx @modelcontextprotocol/inspector <output-of-which-python> <path-to-python-file>
        ```

        For example:
        ```
        npx @modelcontextprotocol /Users/aajain/projects/personal/ai_basics/modelcontextprotocol/python_mcps/.venv/bin/python /Users/aajain/projects/personal/ai_basics/modelcontextprotocol/python_mcps/binance_mcp.py
        
        ```
    1. Test usage at Claude Desktop: 
        - Edit the `claude_desktop_config.json` file to be: 
            ```
            {
                "mcpServers": {            
                    "binance-mcp": {
                        "command": "/Users/aajain/projects/personal/ai_basics/modelcontextprotocol/python_mcps/.venv/bin/python",
                        "args": [
                            "/Users/aajain/projects/personal/ai_basics/modelcontextprotocol/python_mcps/binance_mcp.py"
                        ]
                    },
                }
            }    
            ``` 
        - restart Claude desktop.   


### typescript_mcp
1. The directory contains an MCP server with stdio transport built using typescript SDK. 
1. The MCP server is also published here: https://www.npmjs.com/package/aaditi_binance_ts_mcp
1. Test usage at Claude Desktop: 
    - Edit the `claude_desktop_config.json` file to be: 
        ```
        {
            "mcpServers": {    
                "binance-ts-mcp": {
                    "command": "npx",
                    "args": [
                        "aaditi_binance_ts_mcp"
                    ]
                },
            }
        }
    ```    
    - restart Claude Desktop
1. Setting up: 
    1. Install all dependencies: `npm install`
    1. Run and test working: `npx.`
1. Updating Code: 
    1. `npm version patch`
    1. `npm login`
    1. `npm publish`

### my-cloudflare-mcp-server-secure: 
1. The directory contains a MCP server with SSE and streamable-http transport support. It was built using the [AI demo templates](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) published by cloudflare. 

1. The Server also uses Oauth Authentication supported by MCP. It uses Github's Oauth. 
1. The server is live here: https://my-cloudflare-mcp-server-secure.aaditi2290.workers.dev/sse
1. Test usage at Claude Desktop: 
    - Edit the `claude_desktop_config.json` file to be: 
        ```
        {
            "mcpServers": {    
                "cloudfare-binance-github-oauth-mcp": {
                    "command": "npx",
                    "args": [
                        "mcp-remote",
                        "https://my-cloudflare-mcp-server-secure.aaditi2290.workers.dev/sse"
                    ]
                }
            }
        }
        ```    
    - restart Claude Desktop
1. Setting up: 
    1. Create Repository using cloudflare template: 
        ```
        npm create cloudflare@latest -- my-cloudflare-mcp-server-secure --template=cloudflare/ai/demos/remote-mcp-github-oauth
        ```
    1. `cd my-cloudflare-mcp-server-secure`
    1. Generate [github's client ID and Secret](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app). For the time being use http://localhost as url and callbacl-url. Its updated in later steps
    1. Add secrets. COOKIE_ENCRYPTION_KEY can be any random string: 
        ```
        npx wrangler secret put GITHUB_CLIENT_ID
        npx wrangler secret put GITHUB_CLIENT_SECRET
        npx wrangler secret put COOKIE_ENCRYPTION_KEY
        ```
    1. Create Oauth KV `npx wrangler kv namespace create "OAUTH_KV"`
    1. Update the wrangler.jsonc file with the OAUTH_KV value obtained. 
    1. Deploy to cloudflare: `npx wrangler deploy`
    1. Update Github Oauth Application with the URL obtained after deployment. Callback url is <%url-obtained%>/callback
