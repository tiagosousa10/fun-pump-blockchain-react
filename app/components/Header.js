import { ethers } from "ethers";

function Header({ account, setAccount }) {
  return (
    <header>
      <p className="brand">fun.pump</p>
      <button className="btn--fancy">Hello world</button>
    </header>
  );
}

export default Header;
