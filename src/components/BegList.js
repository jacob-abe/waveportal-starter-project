import React from "react";
import Beg from "./Beg";

export default function BegList(props) {
    return(
        <div>
            {props.begs && 
                props.begs.map(beg=>
                    <Beg key={beg.timestamp} beg={beg}/>
                )
            }
        </div>
    );
}