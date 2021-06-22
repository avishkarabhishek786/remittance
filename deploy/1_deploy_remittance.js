const main = async function ({ deployments, getNamedAccounts, getChainId }) {
    const { deploy, execute, get, read } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId();

    console.log("chainId", chainId);

    const remittance = await deploy('Remittance', {
        from: deployer,
        deterministicDeployment: true,
        args: [true],
    });

    const remittanceAddress = remittance.address;
    console.log(remittanceAddress);
}

module.exports = main;
module.exports.tags = ["Remittance"];