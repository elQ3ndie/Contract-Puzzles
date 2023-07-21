const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const threshold = '0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf';
    let wallet = await ethers.Wallet.createRandom().connect(ethers.provider); // Generate a random wallet

    // Keep generating random addresses until one satisfies the condition
    while (ethers.utils.getAddress(wallet.address) >= ethers.utils.getAddress(threshold)) {
      wallet = await ethers.Wallet.createRandom().connect(ethers.provider);
    }

    const address = await wallet.getAddress();

    //Since the random address does not have gas, let's send gas to enable it carry out transactions
    const signer = ethers.provider.getSigner(0);
    await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther('1')
    });

    return { game, wallet, address };
  }
  it('should be a winner', async function () {
    const { game, wallet} = await loadFixture(deployContractAndSetVariables);


    // good luck
    const tx = await game.connect(wallet).win();
    await tx.wait()    

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
