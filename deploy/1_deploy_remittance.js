//const hre = require("hardhat");
//const ethers = hre.ethers;

const main = async function ({ deployments, getNamedAccounts, getChainId }) {
    const { deploy, execute, get, read } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId();

    console.log("chainId", chainId);

    const remittance = await deploy('Remittance', {
        from: deployer,
        deterministicDeployment: true,
        args: ['0x3280b0b8f147bc0E03f1a8eB462edCB77a0635FE', true],
    });

    const remittanceAddress = remittance.address;
    console.log("remittanceAddress", remittanceAddress); // 0xd9F05ef1E7EEa7ac0941c27574d4eD7cfd376Dd0

}

module.exports = main;
module.exports.tags = ["Remittance"];