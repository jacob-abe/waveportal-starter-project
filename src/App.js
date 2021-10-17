import React , { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/BegContract.json';


export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");

  let contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found");
      }

    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {

      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const beg = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const begPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await begPortalContract.getTotalBegs();
        console.log("Retrieved total beg count...", count.toNumber());

        const begTxn = await begPortalContract.increment();
        console.log("Mining...", begTxn.hash);

        await begTxn.wait();
        console.log("Mined -- ", begTxn.hash);

        count = await begPortalContract.getTotalBegs();
        console.log("Retrieved total beg count after begging...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="webBg">
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          <p className="whiteText">🤢 Greetings weakling!</p>
        </div>

        <div className="bio">
          <p className="whiteText">Press beg to recieve a chance to win some ETH from me.</p>
        </div>

        <button className="waveButton" onClick={beg}>
          🥺 Beg
        </button>
        {currentAccount=="" ?
          <button className="connectButton" onClick={connectWallet}>
            <p className="whiteText">Connect my wallet</p>
          </button> 
        : <p className="whiteText">
            Wallet connected:  {currentAccount}
          </p>}
      </div>
    </div>
    </div>
  );
}
