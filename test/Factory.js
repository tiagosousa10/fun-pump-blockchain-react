const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Factory", function () {
  const FEE = ethers.parseUnits("0.01", 18);

  async function deployFactoryFixture() {
    //fetch the accounts
    const [deployer, creator] = await ethers.getSigners();
    //fetch the contract
    const Factory = await ethers.getContractFactory("Factory");
    //deploy the contract

    const factory = await Factory.deploy(FEE);

    //create token
    const transaction = await factory
      .connect(creator)
      .create("Dapp Uni", "DAPP", { value: FEE });

    await transaction.wait();

    //get token address
    const tokenAddress = await factory.tokens(0);
    const token = await ethers.getContractAt("Token", tokenAddress);

    return { factory, deployer, creator, token };
  }

  describe("Deployment", function () {
    it("Should set the fee", async function () {
      const { factory } = await loadFixture(deployFactoryFixture);

      expect(await factory.fee()).to.equal(FEE);
    });

    it("Should set the owner", async function () {
      const { factory, deployer } = await loadFixture(deployFactoryFixture);

      expect(await factory.owner()).to.equal(deployer.address);
    });
  });

  describe("Creating", function () {
    it("Should set the owner", async function () {
      const { factory, token } = await loadFixture(deployFactoryFixture);
      expect(await token.owner()).to.equal(await factory.getAddress());
    });

    it("Should set the creator", async function () {
      const { creator, token } = await loadFixture(deployFactoryFixture);
      expect(await token.creator()).to.equal(creator.address);
    });

    it("Should set the supply", async function () {
      const { factory, token } = await loadFixture(deployFactoryFixture);
      const totalSupply = ethers.parseUnits("1000000", 18);

      expect(await token.balanceOf(await factory.getAddress())).to.equal(
        totalSupply
      );
    });

    it("Should update ETH balance", async function () {
      const { factory } = await loadFixture(deployFactoryFixture);
      const balance = await ethers.provider.getBalance(
        await factory.getAddress()
      );
      expect(balance).to.equal(FEE);
    });

    it("Should create the sale", async function () {
      const { factory, token, creator } = await loadFixture(
        deployFactoryFixture
      );

      const count = await factory.totalTokens();
      expect(count).to.equal(1);

      const sale = await factory.getTokenSale(0);
      expect(sale.token).to.equal(token.address);
      expect(sale.creator).to.equal(creator.address);
      expect(sale.sold).to.equal(0);
      expect(sale.raised).to.equal(0);
      expect(sale.active).to.equal(true);
    });
  });
});
