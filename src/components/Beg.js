import React from "react";
import '../styles/App.css';

export default function Beg (props) {
    return(
        <div className="card">
            <p className="cardHeaderText">Beggar details</p>
            <p className="normalText">{props.beg.address}</p>
            <p className="normalText">Begged on: {props.beg.timestamp.toDateString()}</p>
            <p className="normalText">BS reason for begging: {props.beg.message}</p>
        </div>
    )
}