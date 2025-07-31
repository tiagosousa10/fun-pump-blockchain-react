"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Header from "./components/Header";
import List from "./components/List";
import Token from "./components/Token";
import Trade from "./components/Trade";

// ABIs & Config
import Factory from "./abis/Factory.json";
import config from "./config.json";
import images from "./images.json";

export default function Home() {
  return (
    <div className="page">
      <Header
        account={"0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}
        setAccount={""}
      />
    </div>
  );
}
