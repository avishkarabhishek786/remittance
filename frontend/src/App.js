import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { ethers } from "ethers";
import { Remittance, USDAO } from "./abi.js";
import { Navbar } from "./html";
import Exchangeform from "./components/Exchangeform";

function App() {

    let [blockchainProvider, setBlockchainProvider] = useState(undefined);
    let [metamask, setMetamask] = useState(undefined);
    let [metamaskNetwork, setMetamaskNetwork] = useState(undefined);
    let [metamaskSigner, setMetamaskSigner] = useState(undefined);
    const [networkId, setNetworkId] = useState(undefined);
    const [loggedInAccount, setAccounts] = useState(undefined);
    const [remittanceContract, setRemittanceContract] = useState(undefined);
    const [usdaoContract, setUSDAOContract] = useState(undefined);
    const [etherBalance, setEtherBalance] = useState(undefined);
    const [amount, setAmount] = useState(undefined);
    const [encrypthash, setEncrypthash] = useState(undefined);
    const [userSecret, setUsersecret] = useState(undefined);

    const [isError, setError] = useState(false);

    const EXCHANGER = "0x00Dd4cE8a3Ba697a17c079589004446d267435df";

    const connect = async () => {
        try {
            let provider, network, metamaskProvider, signer, accounts;

            if (typeof window.ethereum !== 'undefined') {
                // Connect to RPC  
                console.log('loadNetwork')
                try {

                    //console.log("acc", acc); 
                    //window.ethereum.enable();
                    //await handleAccountsChanged();
                    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    await handleAccountsChanged(accounts);
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

                signer = await metamaskProvider.getSigner(accounts[0])
                setMetamaskSigner(signer)

                metamaskNetwork = await metamaskProvider.getNetwork();
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
        if (typeof accounts !== "string" || accounts.length < 1) {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        console.log("t1", accounts);
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

            if (typeof accounts[0] == "string") {
                setEtherBalance(ethers.utils.formatEther(
                    Number(await metamaskProvider.getBalance(accounts[0])).toString()
                ));
            }

            const remittanceContract = new ethers.Contract(
                Remittance.address[network],
                Remittance.abi,
                signer
            );

            setRemittanceContract(remittanceContract);

            console.log(remittanceContract);

            const usdaoContract = new ethers.Contract(
                USDAO.address[network],
                USDAO.abi,
                signer
            );

            setUSDAOContract(usdaoContract);

            console.log(usdaoContract);

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
            if (typeof metamask == 'object' && typeof metamask.getBalance == 'function'
                && typeof loggedInAccount == "string") {
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

    const new_remit = async (exchangerAddress, remittance_amount) => {
        try {

            remittance_amount = Number(remittance_amount);
            if (remittance_amount < 10) {
                alert("Minimum amount is 10 USDAO");
                return false;
            }
            //console.log(remittanceContract);
            const user_secret = ethers.utils.formatBytes32String((String(+ new Date())));
            console.log(user_secret);
            setUsersecret({ userSecret: user_secret })
            // console.log(typeof user_secret);
            // console.log(remittanceContract.encrypt);
            const encrypt_hash = await remittanceContract.encrypt(user_secret, exchangerAddress);
            console.log("encrypt_hash", encrypt_hash);
            setEncrypthash({ encrypthash: encrypt_hash })
            // remittanceContract.
            alert(`Please send ${remittance_amount} USDAO to ${exchangerAddress} ASAP.`);

            return true;

        } catch (error) {
            console.error(error)
        }
    }

    const submitdata = data => {
        setAmount({ amount: data.amount })
        new_remit(data.address, data.amount)
    }

    const send_remit_request = async (encrypt_hash, remittance_amount) => {
        console.log(encrypt_hash.encrypthash)
        console.log(remittance_amount.amount)
        try {
            //console.log(remittanceContract);
            const remit_amount = ethers.utils.parseEther(remittance_amount.amount);
            const remit = await remittanceContract.remit(encrypt_hash.encrypthash, "3600", remit_amount);
            console.log(remit);
        } catch (error) {
            console.error(error);
        }
    }

    const view_remittance = async (encrypt_hash) => {
        try {
            const remit = await remittanceContract.remittances(encrypt_hash);
            console.log(remit);
        } catch (error) {
            console.error(error);
        }
    }


    const exchanger_withdrawal = async (user_secret, withdrawal_amount) => {
        try {

            withdrawal_amount = ethers.utils.parseEther(String(withdrawal_amount));
            if (withdrawal_amount < 0) {
                alert("Withdrawal amount must be greater than 0");
                return;
            }

            const exchange = await remittanceContract.exchange(user_secret);
            const exchange_receipt = await exchange.wait(2);
            console.log(exchange_receipt);

            const withdraw = await remittanceContract.withdraw(Number(withdrawal_amount).toString());
            console.log(withdraw);
            let withdraw_receipt =  await withdraw.wait(2);
            console.log(withdraw_receipt);

            // Update USDAO balance in UI
            return true;

        } catch (error) {
            console.error(error);
        }
    }

    const remittance_balance = async () => {
        try {
            const remit_balance = await remittanceContract.balances(loggedInAccount);
            console.log(Number(remit_balance));
        } catch (error) {
            console.log(error);
        }
    }

    const usdao_balance = async () => {
        try {
            const usdao_balance = await usdaoContract.balanceOf(loggedInAccount);
            console.log(Number(usdao_balance));
            
        } catch (error) {
            console.error(error);
        }
    }

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
                    <div className="row">
                        <div>
                            <p>Account : {loggedInAccount}</p>
                            <p>Ether Balance : {etherBalance}</p>
                        </div>
                    </div>
                    <div class="row align-items-center">
                        <div class="col-5">
                            <div className="App">
                                <div class="alert alert-light" role="alert">
                                    Remittance Sender
                                </div>
                                <Exchangeform onSubmit={submitdata} />
                                <button onClick={() => send_remit_request(encrypthash, amount)}>New Remittance</button>
                                <button onClick={() => view_remittance(encrypthash.encrypthash)}>View Remittance</button>
                            </div>
                        </div>
                        <div class="col-2">

                        </div>
                        <div class="col-5">
                            <div className="App">
                                <div class="alert alert-light" role="alert">
                                    Remittance Exchanger
                                </div>

                                <button onClick={() => exchanger_withdrawal(
                                    "0x3136323438303135363631353900000000000000000000000000000000000000",
                                    20
                                )}>Withdraw Received Amount</button>
                               
                                <button onClick={() => remittance_balance()}>Remittance Balance</button>
                                <button onClick={() => usdao_balance()}>USDAO Balance</button>

                            </div>
                        </div>
                    </div>

                </div>
            </>
        );
    }


}

export default App;