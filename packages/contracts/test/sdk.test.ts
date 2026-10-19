// Updated test descriptions for clarity
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Simple, Simple__factory } from "../typechain-types";
import { createWallet, tx2contract } from "./sdk";
const hre = require('hardhat');

describe("Simple", function () {

  let owner: SignerWithAddress;
  let c : Simple

  before(async () => {
    const signers = await ethers.getSigners()
    owner = signers[0];
    console.log("owner : ", owner.address)

  });

  it("Deploy", async function () {
    c = await new Simple__factory(owner).deploy()
    console.log("c address : ", c.address)
  });

  it("test sdk", async function () {

    let signer
		if (hre.hardhatArguments.network == "localhost") {
      console.log("Pre-request Run : yarn hardhat node")
      const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      const RPC_URL = "http://localhost:8545"
      signer = await createWallet(
        PRIVATE_KEY,
        RPC_URL
      )
    } else {
      signer = owner
    }

    // https://docs.ethers.org/v5/api/utils/abi/formats/#abi-formats--human-readable-abi
    const abi = [
      "function deposit(address) external payable"
    ]
  
    const TX_VALUE = ethers.utils.parseEther("0.001")
    const TX_GAS_LIMIT = BigInt(100000)
    await tx2contract(
      c.address,
      abi,
      "deposit",
      [signer.address],
      signer,
      TX_VALUE.toBigInt(),
      TX_GAS_LIMIT
    )

    expect(await (await c.balance(signer.address)).toNumber()).eq(TX_VALUE.toNumber())
  });

});
