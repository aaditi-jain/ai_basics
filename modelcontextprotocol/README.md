
# Model Context Protocol (MCP) Learning Repository

This section of the repository documents my hands-on learning journey with the Model Context Protocol (MCP), covering how to build, deploy, and use MCP servers .

My learning was guided by the Udemy course: [MCP Bootcamp: Build AI Agents with Model Context Protocol](https://www.udemy.com/course/learn-mcp-model-context-protocol-course-and-a2a-bootcamphands-hands-on/?couponCode=LOCLZDOFFPINCTRL). 

Please find the completion certificate here: https://www.udemy.com/certificate/UC-6ea80d26-7904-4b91-ad0a-2960b5f23bc5/ 


# Index
1. [MCP Concepts](#MCP-Concepts)
1. [Repository Overview](#Repository-Overview)
    1. [python_mcps](#python_mcps)
    1. [my-cloudflare-mcp-server-secure](#my-cloudflare-mcp-server-secure)
    1. [typescript_mcps](#typescript_mcps) 


# MCP Concepts

## What is MCP?
MCP (Model Context Protocol) is an open standard developed by Anthropic that defines how applications can provide additional context and capabilities to large language models (LLMs).

MCP was created to address a fundamental challenge:
LLMs have traditionally operated in isolation, limited to their pre-trained data and capabilites. 
Before MCP, connecting an LLM to a data source, cloud service, or enterprise application typically required building custom integrations and writing specialized prompts—an inefficient, one-off approach. MCP aims to replace this with a single, standardized protocol that streamlines how LLMs can connect with external tools and resources.

From MCP's [offical documentation](https://modelcontextprotocol.io/introduction): "*MCP is an open protocol that standardizes how applications provide context to LLMs. Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect your devices to various peripherals and accessories, MCP provides a standardized way to connect AI models to different data sources and tools.*"

## Key Components

**MCP Hosts**: 
Hosts refers to programs like Claude Desktop, IDEs, or AI tools that want to access data through MCP. The Host creates and and manages multiple client instances.

**MCP Clients**: 
Protocol clients that maintain 1:1 connections with servers. A MCP host application creates and manages multiple clients, with each client having a 1:1 relationship with a particular MCP server.

**MCP Servers**: 
Lightweight programs that each expose specific capabilities and context. Servers are to operate independently with focused responsibilities

**Local Data Sources**: 
Your computer’s files, databases, and services that MCP servers can securely access

**Remote Services**: 
External systems available over the internet (e.g., through APIs) that MCP servers can connect to

## Server Features    
**Tools**: 

Tools enable models to interact with external systems, such as querying databases, calling APIs, or performing computations. 

Each tool is uniquely named and accompanied by metadata that defines its input and output schema.

Tools in MCP are designed to be model-controlled, meaning that the language model can discover and invoke tools automatically based on its contextual understanding and the user’s prompts.

**Resources**: 

Resources enable servers to share contextual data with language models—such as files, database schemas, or application-specific information.

Each resource is uniquely identified by a URI. Resources are designed to be application-driven, enabling the host applications to control when and how context is provided to language models.

**Prompts**: 

Prompts enable MCP servers to offer pre-built templates and instructions for language model interactions. Clients can find available prompts, access their content, and customize them with specific arguments.

Prompts are designed to be user-controlled, meaning they are exposed from servers to clients with the intention of the user being able to explicitly select them for use.

![Server Features](https://substack-post-media.s3.amazonaws.com/public/images/e07df610-fa0b-4e18-bca5-6ade934cb64a_2274x1264.png)

## Client Features
**Roots**

Roots define the boundaries of where servers can operate within the filesystem, allowing them to understand which directories and files they have access to. Servers can request the list of roots from supporting clients and receive notifications when that list changes.

**Sampling**

Sampling is a standardized way for servers to request LLM sampling (“completions” or “generations”) from language models via clients. This flow allows clients to maintain control over model access, selection, and permissions while enabling servers to leverage AI capabilities—with no server API keys necessary

## Transports
MCP uses JSON-RPC 2.0 as its wire format. It defines following standard trnasport mechanism: 

**Standard Input/Output (stdio)**: 

The stdio transport uses standard input and output for communication, which is ideal for integrating with local tools or CLI-based workflows.

**Streamable HTTP**:

The Streamable HTTP transport uses HTTP POST requests for client-to-server communication. Its used for  web-based integrations or connections that need network-based communication. 

## References:
1. [Official Documentation] (https://modelcontextprotocol.io/introduction)
1. MCP usecase: https://www.shakudo.io/blog/mcp-model-context-protocolb
1. MCP Overview: https://wandb.ai/onlineinference/mcp/reports/The-Model-Context-Protocol-MCP-by-Anthropic-Origins-functionality-and-impact--VmlldzoxMTY5NDI4MQ 
1. MCP Workshop By Mahesh Murag: https://www.youtube.com/watch?v=kQmXtrmQ5Zg
1. MCP Overview (Hindi): https://www.youtube.com/watch?v=vYelTr1uQmA&t=160s 
1. LLM Overview (Hindi): https://www.youtube.com/watch?v=K45s2PgywvI
1. Cloudflare Templates: https://github.com/cloudflare/ai/tree/main/demos
1. 3rd Party MCP Servers: 
    - https://smithery.ai/
    - https://github.com/modelcontextprotocol/servers
    - https://cursor.directory/mcp


# Repository Overview:
The repository contains the following sub-directories: 

## python_mcps: 

1. This directory contains my example implementation of MCP servers and MCP client using python sdk.  It explores the Tools, Resources and Prompts features supported by MCP servers.  All of these use the stdio transport. 
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
     
1. Setting up on local: 
    1. Used uv as package manager
        1. Install all the dependencies 
            ```
            uv sync
            ```
        1. Setup Virtual Environment and Activate it
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


## typescript_mcp
1. The directory contains code for my MCP server with stdio transport built using the TypeScript SDK. 
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
1. Setting up on local: 
    1. Install all dependencies: `npm install`
    1. Run and test working: `npx.`
1. Updating Code and publishing: 
    1. `npm version patch`
    1. `npm login`
    1. `npm publish`

## my-cloudflare-mcp-server-secure: 
1. The directory contains my code for a MCP server with SSE and streamable-http transport support. It was built using the [AI demo templates](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) published by cloudflare. 
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
1. Setting up on local and deploying: 
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



