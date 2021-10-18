import React , { useEffect, useState } from "react";
import { ethers } from "ethers";
import './styles/App.css';
import abi from './utils/BegContract.json';
import BegList from "./components/BegList"


export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [inputText, setInputText] = useState("");
  const [allBegs, setAllBegs] = useState([]);

  let contractAddress = "0xC7f8ecdeaE3C44C99C0D5A05154251912c7db3ba"

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

  const getAllBegs = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const begPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const begs = await begPortalContract.getAllBegs();
        
        let begsCleaned = [];
        begs.forEach(beg => {
          begsCleaned.push({
            address: beg.begger,
            timestamp: new Date(beg.timestamp * 1000),
            message: beg.message
          });
        });

        setAllBegs(begsCleaned);

        listenForNewBeg(begPortalContract);
      } else {
        alert("Ethereum object doesn't exist!")
      }
    } catch (error) {
      alert(error);
    }
  }

  const listenForNewBeg = async (begPortalContract) => {
    begPortalContract.on("NewBeg", (from, timestamp, message) => {
      console.log("NewBeg", from, timestamp, message);

      setAllBegs(prevState => [...prevState, {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message
      }]);
    });
  }

  const beg = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const begPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await begPortalContract.getTotalBegs();
        console.log("Retrieved total beg count...", count.toNumber());

        const begTxn = await begPortalContract.increment(inputText,{ gasLimit: 300000 });
        console.log("Mining...", begTxn.hash);

        await begTxn.wait();
        console.log("Mined -- ", begTxn.hash);

        count = await begPortalContract.getTotalBegs();
        console.log("Retrieved total beg count after begging...", count.toNumber());

        await getAllBegs()
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      alert("Please wait till the cooldown completes you greedy loser");
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllBegs();
  }, [])

  const setInput =(e) =>{
    setInputText(e.target.value)
  }
  
  return (
    <div>
    <div className="webBg">
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          <p className="whiteText">🤢 Greetings weakling!</p>
        </div>

        <div className="bio">
          <p className="whiteText">Press beg to recieve a chance to win some ETH from me.</p>
        </div>
        <input className="inputBox" type="text" onChange={setInput} placeholder="Share why you're such an ETH slut"></input>
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
    <div className="webBg">
      <div className="mainContainer">
      {allBegs && 
        <div className="dataContainer">
          <div className="header">
            <p className="whiteText">👇 Take a look at the beggars below!</p>
          </div>

          <div className="bio">
            <p className="whiteText">You know you wanna be one of them. UwU.</p>
          </div>
            <BegList begs={allBegs}/>
          </div>
      }
      </div>
    </div>
    </div>
  );
}
