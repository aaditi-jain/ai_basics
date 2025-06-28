from mcp.server.fastmcp import FastMCP
import requests
from pathlib import Path
from typing import Any 
import datetime



THIS_FOLDER = Path(__file__).parent.absolute()
ACTIVITY_LOG_FILE = THIS_FOLDER / "data_files/activity.log"
SYMBOL_MAP_FILE = THIS_FOLDER / "data_files/symbol_map.csv"

mcp = FastMCP("Binance MCP")

def get_symbol_from_name(name: str) -> str:
    if name.lower() in ["bitcoin", "btc"]:
        return "BTCUSDT"
    elif name.lower() in ["ethereum", "eth"]:
        return "ETHUSDT"
    else: 
        return name.upper()


@mcp.resource("file://activity.log")
def activity_log() -> str:
    with open(ACTIVITY_LOG_FILE, "r") as f:
        return f.read()
    
@mcp.resource(uri="file://crypto_name_to_symbol_map.csv", mime_type="text/csv")
def name_to_symbol_mapping() -> str:
    with open(SYMBOL_MAP_FILE, "r") as f:
        return f.read()

@mcp.tool()
def get_price(symbol: str) -> Any:
    """
    Get the current price of a crypto asset from Binance.
    Args(str): The symbol of the crypto asset for which we want to get the price
    Returns(Any): The current price of the crypto asset. 
    """
    symbol = get_symbol_from_name(symbol)
    url = f"https://data-api.binance.vision/api/v3/ticker/24hr?symbol={symbol}"
    response = requests.get(url)
    if response.status_code != 200:
        with open(ACTIVITY_LOG_FILE, "a") as f:
            f.write(
                f"Error getting price change for {symbol}: {response.status_code} {response.text}\n"
            )
        raise Exception(
            f"Error getting price change for {symbol}: {response.status_code} {response.text}"
        )
    else:
        price = response.json()["lastPrice"]
        with open(ACTIVITY_LOG_FILE, "a") as f:
            f.write(
                f"Successfully got price for {symbol}. Current price is {price}. Current time is {datetime.datetime.now(datetime.UTC)}\n"
            )
    return response.json()

if __name__ == "__main__":
    if not Path(ACTIVITY_LOG_FILE).exists():
        Path(ACTIVITY_LOG_FILE).touch()
    mcp.run(transport="stdio")