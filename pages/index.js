import Moralis from "moralis";
import { useEffect } from "react";

export default function Home() {
  // Pass the app_id and server_url from moralis page.
  Moralis.initialize(process.env.NEXT_PUBLIC_MORALIS_APP_ID);
  Moralis.serverURL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

  useEffect(() => {
    initMoralis();
  }, {});

  let dex;

  async function initMoralis() {
    await Moralis.initPlugins();

    // This is required to make 'Moralis.Web3API' calls. This along with
    // the correspoding code can be removed if Web3API calls aren't required.
    await Moralis.start({
      serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVER_URL,
      appId: process.env.NEXT_PUBLIC_MORALIS_APP_ID,
    });
    dex = Moralis.Plugins.oneInch;

    const chains = await dex.getSupportedTokens({
      chain: "eth",
    });

    console.log("chains: ", chains);
    const { tokens } = chains;

    // This is to figure out the address of corresponding token. The 'chains' list
    // can be used in the drop down component to avoid another search like this.

    for (const [k, v] of Object.entries(tokens)) {
      if (v.symbol === "BUSD") console.log("value: ", v);
    }

    await Moralis.enableWeb3();
    if (!Moralis.User.current()) await Moralis.authenticate();

    console.log("user: ", Moralis.User.current());

    // To print the balance of all tokens owned by user
    const balances = await Moralis.Web3API.account.getTokenBalances();
    console.log("balances: ", balances);
  }

  async function swap() {
    const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    // const ONEINCH_ADDRESS = "0x111111111117dc0aa78b770fa6a738034120c302";
    const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
    // const BUSD_ADDRESS = "0x4fabb145d64652a948d72533023f6e7a623c7c53";

    const options = {
      chain: "eth",
      fromTokenAddress: NATIVE_ADDRESS,
      toTokenAddress: DAI_ADDRESS,
      amount: Number(Moralis.Units.ETH("0.000001")),
      fromAddress: Moralis.User.current().get("ethAddress"),
      slippage: 1,
    };

    var receipt = await dex.swap(options);
    console.log("receipt: ", receipt);
  }

  return (
    <div className="">
      <button onClick={swap} className="bg-blue-300 p-2 px-4">
        Swap
      </button>
    </div>
  );
}
