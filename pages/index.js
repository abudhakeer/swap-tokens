import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import Moralis from "moralis";
import { useEffect } from "react";

export default function Home() {
  Moralis.initialize(process.env.NEXT_PUBLIC_MORALIS_APP_ID);
  Moralis.serverURL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

  useEffect(() => {
    initMoralis();
  }, {});

  let dex;

  async function initMoralis() {
    await Moralis.initPlugins();
    await Moralis.start({
      serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVER_URL,
      appId: process.env.NEXT_PUBLIC_MORALIS_APP_ID,
    });
    dex = Moralis.Plugins.oneInch;

    console.log("dex: ", dex);

    const chains = await dex.getSupportedTokens({ chain: "eth" });
    console.log("chains: ", chains);
    const { tokens } = chains;

    for (const [k, v] of Object.entries(tokens)) {
      if (v.symbol === "BUSD") console.log("value: ", v);
    }

    await Moralis.enableWeb3();
    if (!Moralis.User.current()) await Moralis.authenticate();

    console.log("user: ", Moralis.User.current());

    const options = {
      chain: "0x1",
      address: "0xC1d9dD2ea13984ef0E6223081F6DdEA90C4f0d45",
    };
    const balances = await Moralis.Web3API.account.getTokenBalances();
    console.log("balances: ", balances);

    const nbalance = await Moralis.Web3API.account.getNativeBalance();
    console.log("nbalance: ", nbalance);
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
