import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
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

        <button className="waveButton" onClick={wave}>
        🥺 Beg
        </button>
      </div>
    </div>
    </div>
  );
}
