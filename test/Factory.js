const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Factory", function () {
  it("should have a name -test", async function () {
    //fetch the contract
    const Factory = await ethers.getContractFactory("Factory");
    //deploy the contract
    const factory = await Factory.deploy();
    //check name
    const name = await factory.name();
    //check name is correct
    expect(name).to.equal("Factory");
  });
});
