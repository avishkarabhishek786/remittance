import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { ethers } from "ethers";
import { Remittance } from "./abi.js";
import {Navbar} from "./html";

function App() {

    let [blockchainProvider, setBlockchainProvider] = useState(undefined);
    let [metamask, setMetamask] = useState(undefined);
    let [metamaskNetwork, setMetamaskNetwork] = useState(undefined);
    let [metamaskSigner, setMetamaskSigner] = useState(undefined);
    const [networkId, setNetworkId] = useState(undefined);
    const [loggedInAccount, setAccounts] = useState(undefined);
    const [remittanceContract, setRemittanceContract] = useState(undefined);
    const [etherBalance, setEtherBalance] = useState(undefined);

    const [isError, setError] = useState(false);

    const connect = async () => {
        try {
            let provider, network, metamaskProvider, signer;

            if (typeof window.ethereum !== 'undefined') {
                // Connect to RPC  
                console.log('loadNetwork')
                try {
                    const acc = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    await handleAccountsChanged(acc);
                } catch (err) {
                    if (err.code === 4001) {
                        // EIP-1193 userRejectedRequest error
                        // If this happens, the user rejected the connection request.
                        console.log('Please connect to MetaMask.');
                    } else {
                        console.error(err);
                    }
                }
                provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/09dc2ddad4014a219f84c8125b0ab7cc`)
                // const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545")
                setBlockchainProvider(provider);
                network = await provider.getNetwork()
                console.log(network.chainId);
                setNetworkId(network.chainId);

                // Connect to Metamask  
                metamaskProvider = new ethers.providers.Web3Provider(window.ethereum)
                setMetamask(metamaskProvider)

                signer = await provider.getSigner()
                setMetamaskSigner(signer)

                metamaskNetwork = await provider.getNetwork();
                setMetamaskNetwork(metamaskNetwork.chainId);

                console.log(network);

                if (network.chainId !== metamaskNetwork.chainId) {
                    alert("Your Metamask wallet is not connected to " + network.name);

                    setError("Metamask not connected to RPC network");
                }

            } else setError("Could not connect to any blockchain!!");

            return {
                provider, metamaskProvider, signer,
                network: network.chainId
            }

        } catch (e) {
            console.error(e);
            setError(e);
        }

    }


    const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
            // MetaMask is locked or the user has not connected any accounts
            alert('Please connect to MetaMask.');
        } else if (accounts[0] !== loggedInAccount) {
            setAccounts(accounts[0]);
        }
    }

    useEffect(() => {
        const init = async () => {

            const { provider, metamaskProvider, signer, network } = await connect();

            const accounts = await metamaskProvider.listAccounts();
            console.log(accounts[0]);
            setAccounts(accounts[0]);

            setEtherBalance(ethers.utils.formatEther(
                Number(await metamaskProvider.getBalance(accounts[0])).toString()
            ));

            const remittanceContract = new ethers.Contract(
                Remittance.address[network],
                Remittance.abi,
                signer
            );

            setRemittanceContract(remittanceContract);

            console.log(remittanceContract);

        }

        init();

        window.ethereum.on('accountsChanged', handleAccountsChanged);

        window.ethereum.on('chainChanged', function (networkId) {
            // Time to reload your interface with the new networkId
            //window.location.reload();
            unsetStates();
        })

    }, []);

    useEffect(() => {
        (async () => {
            if (typeof metamask == 'object' && typeof metamask.getBalance == 'function') {
                setEtherBalance(ethers.utils.formatEther(
                    Number(await metamask.getBalance(loggedInAccount)).toString()
                ));
            }
        })()
    }, [loggedInAccount]);

    const unsetStates = useCallback(() => {
        setBlockchainProvider(undefined);
        setMetamask(undefined);
        setMetamaskNetwork(undefined);
        setMetamaskSigner(undefined);
        setNetworkId(undefined);
        setAccounts(undefined);
        setRemittanceContract(undefined);
        setEtherBalance(undefined);
    }, []);

    const isReady = useCallback(() => {

        return (
            typeof blockchainProvider !== 'undefined'
            && typeof metamask !== 'undefined'
            && typeof metamaskNetwork !== 'undefined'
            && typeof metamaskSigner !== 'undefined'
            && typeof networkId !== 'undefined'
            && typeof loggedInAccount !== 'undefined'
            && typeof remittanceContract !== 'undefined'
        );
    }, [
        blockchainProvider,
        metamask,
        metamaskNetwork,
        metamaskSigner,
        networkId,
        loggedInAccount,
        remittanceContract
    ]);

    if (isError) {
        return (
            <>
                <Navbar /> 
                <div className="alert alert-danger" role="alert">Error</div>;
            </>
        )
    } else if (!isReady()) {

        return (<p>Loading...</p>)

    } else {
        return (
            <>
                <Navbar /> 
                <div className="container">
                    <div className="App">
                        <p>loggedInAccount : {loggedInAccount}</p>
                        <p>etherBalance : {etherBalance}</p>
                    </div>
                </div>
            </>
        );
    }


}

export default App;
