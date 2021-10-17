import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        🤢 Greetings weakling!
        </div>

        <div className="bio">
        Press beg to recieve a chance to win some ETH from me.
        </div>

        <button className="waveButton" onClick={wave}>
        🥺 Beg
        </button>
      </div>
    </div>
  );
}
