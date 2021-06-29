import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from "ethers";
import { Remittance, USDAO } from "./abi.js";
import { Navbar } from "./html";
import Exchangeform from "./components/Exchangeform";
import swal from 'sweetalert';
import { useForm } from "react-hook-form";
import { reset } from 'axe-core';

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
    const [encrypthash, setEncrypthash] = useState('');
    const [userSecret, setUsersecret] = useState(undefined);
    const [usdaobalance, setUSDAObalance] = useState(undefined);
    const [remittance, setRemittance] = useState(0);
    const [viewremittance, setViewremittance] = useState({
        amount: 0,
        deadline: 0,
        address: '',
    });

    const [isError, setError] = useState(false);

    const EXCHANGER = "0x00Dd4cE8a3Ba697a17c079589004446d267435df";

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    let alertMessage ;

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
            // debugger;
            const accounts = await metamaskProvider.listAccounts();
            console.log(accounts[0]);
            setAccounts(accounts[0]);

            if (typeof accounts[0] == "string") {
                setEtherBalance(ethers.utils.formatEther(
                    Number(await metamaskProvider.getBalance(accounts[0])).toString()
                ));
            }

            const remittanceContract1 = await new ethers.Contract(
                Remittance.address[network],
                Remittance.abi,
                signer
            );

            console.log(remittanceContract1)

            setRemittanceContract(remittanceContract1);

            // console.log(remittanceContract);

            const usdaoContract = new ethers.Contract(
                USDAO.address[network],
                USDAO.abi,
                signer
            );

            setUSDAOContract(usdaoContract);

            const usdao_balance = await usdaoContract.balanceOf(accounts[0]);
            console.log(usdao_balance)
            setUSDAObalance(Number(ethers.utils.formatEther(String(usdao_balance))))
            // console.log(remittanceContract.add)
            const remit_balance = await remittanceContract1.balances(String(remittanceContract1.address));
            
            setRemittance(Number(ethers.utils.formatEther(String(remit_balance))));

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
            if(typeof usdaoContract == 'object' && typeof remittanceContract == 'object')  {
                
                const usdao_balance = await usdaoContract.balanceOf(loggedInAccount);
                setUSDAObalance(Number(ethers.utils.formatEther(String(usdao_balance))))
                const remit_balance = await remittanceContract.balances(String(remittanceContract.address));
                setRemittance(Number(ethers.utils.formatEther(String(remit_balance))));
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
        // debugger;
        remittance_amount = Number(remittance_amount);
        if (remittance_amount < 10) {
        // alert("Minimum amount is 10 USDAO");
        swal("Error!", "Minimum amount is 10 USDAO!", "error");
        return false;
        }
        // debugger;
        if (usdaobalance < remittance_amount) {
        // alert("Minimum amount is 10 USDAO");
        swal("Error!", "You Don't have sufficient balance!", "error");
        return false;
        }
        //console.log(remittanceContract);
        const user_secret = ethers.utils.formatBytes32String((String(+ new Date())));
        console.log(user_secret);
        setUsersecret(user_secret)
        // console.log(typeof user_secret);
        // console.log(remittanceContract.encrypt);
        const encrypt_hash = await remittanceContract.encrypt(user_secret, exchangerAddress);
        console.log("encrypt_hash", encrypt_hash);
        setEncrypthash(encrypt_hash)
        // remittanceContract.
        // alert(`Please send ${remittance_amount} USDAO to ${remittanceContract.address} ASAP.
        // here is your Hash : ${encrypt_hash}
        // `);
        if(localStorage.getItem('encrypthash') && localStorage.getItem('userSecret')){
            localStorage.removeItem('encrypthash')
            localStorage.removeItem('userSecret')
        }
        localStorage.setItem('encrypthash', encrypt_hash)
        localStorage.setItem('userSecret', user_secret)
        
        // Send USDAO from sender to the Remittance contract
        const remit_amount = ethers.utils.parseEther(String(remittance_amount));
        console.log("remit_amount", remit_amount);
        console.log("remittanceContract.address", remittanceContract.address);
        // debugger;
        const transfer = await usdaoContract.transfer(remittanceContract.address, remit_amount);
        if(!transfer) {
        setError("Failed to transfer USDAO to Remittance contract.");
        return false;
        }
        
        // Push remittance data in the blockchain
        console.log(remit_amount)
        console.log(Number(remit_amount));
        const remit = await remittanceContract.remit(encrypt_hash, "3600", remit_amount);
        console.log(remit);
        console.log(typeof user_secret)
        swal("Transfer Success!", `Please send ${String(user_secret)} to the reciever!`, "success");
        
        return true;
        
        } catch (error) {
        console.log(error)
        swal("Error!", error, "error");
        }
        }
    
// 0x3136323439353136343334393000000000000000000000000000000000000000
    // const new_remit = async (exchangerAddress, remittance_amount) => {
    //     debugger;
    //     try {

    //         remittance_amount = Number(remittance_amount);
    //         if (remittance_amount < 10) {
    //             // alert("Minimum amount is 10 USDAO");
    //             swal("Error!", "Minimum amount is 10 USDAO!", "error");
    //             return false;
    //         }
    //         // debugger;
    //         if (usdaobalance < remittance_amount) {
    //             // alert("Minimum amount is 10 USDAO");
    //             swal("Error!", "You Don't have sufficient balance!", "error");
    //             return false;
    //         }
    //         //console.log(remittanceContract);
    //         const user_secret = ethers.utils.formatBytes32String((String(+ new Date())));
    //         console.log(user_secret);
    //         setUsersecret(user_secret)
    //         // console.log(typeof user_secret);
    //         // console.log(remittanceContract.encrypt);
    //         const encrypt_hash = await remittanceContract.encrypt(user_secret, exchangerAddress);
    //         console.log("encrypt_hash", encrypt_hash);
            
    //         if(localStorage.getItem('encrypthash')){
    //             localStorage.removeItem('encrypthash')
    //         }
    //         localStorage.setItem('encrypthash', encrypt_hash)
    //         setEncrypthash(encrypt_hash)
    //         // remittanceContract.
    //         alert(`Please send ${remittance_amount} USDAO to ${remittanceContract.address} ASAP.
    //                 here is your Hash : ${encrypt_hash}
    //         `);
            
        
            
    //         return true;

    //     } catch (error) {
    //         console.log(error)
    //         swal("Error!", error, "error");
    //     }
    // }

    const submitdata = (data) => {
        
        setAmount({ amount: data.amount })
        new_remit(data.address, data.amount)
    }

    const exchanger_withdrawal_Submit = data => {
        exchanger_withdrawal(data.address,data.amount)
    }

    const send_remit_request = async (encrypt_hash, remittance_amount) => {
        console.log(encrypt_hash)
        console.log(remittance_amount.amount)
        try {
            if(typeof encrypt_hash === 'string' && remittance_amount.amount > 0 )
            {
                
                const remit_amount = ethers.utils.parseEther(remittance_amount.amount);
                console.log(Number(remit_amount))
                const remit = await remittanceContract.remit(encrypt_hash, "3600", remit_amount);
                console.log(remit);
            }
            else{
                swal("Error Occured!", "Provide correct Information!", "error");
            }
            // console.log('Error')
            //console.log(remittanceContract);
            
        } catch (error) {
            swal("Error Occured!", error, "error");
            console.error(error);
        }
    }

    const view_remittance = async (encrypt_hash) => {
        try {
            const remit = await remittanceContract.remittances(encrypt_hash);
            if(remit.exists)
            {
                var d = new Date(Number(String(remit.deadline))*1000).toString()
                setViewremittance({
                    amount: Number(ethers.utils.formatEther(String(remit.amount))),
                    deadline: d.substring(0, 15),
                    address: remit.remitCreator
                })
            }
            // setViewremittance(Number(ethers.utils.formatEther(String(remit.amount))))
            console.log(remit);
        } catch (error) {
            console.error(error);
        }
    }


    const exchanger_withdrawal = async (user_secret, withdrawal_amount) => {
        console.log(user_secret)
        console.log(withdrawal_amount)
        
        try {

            withdrawal_amount = ethers.utils.parseEther(String(withdrawal_amount));
            if (withdrawal_amount < 0) {
                alert("Withdrawal amount must be greater than 0");
                return;
            }
            debugger;
            const exchange = await remittanceContract.exchange(String(user_secret));

            const exchange_receipt = await exchange.wait(2);
            console.log(exchange_receipt);

            if(exchange_receipt)
            {
                const withdraw = await remittanceContract.withdraw(Number(withdrawal_amount).toString());
                console.log(withdraw);
                let withdraw_receipt =  await withdraw.wait(2);
                console.log(withdraw_receipt);
                swal(`Received ${withdrawal_amount} USDAO!`, `Please transfer USD ${withdrawal_amount} to the receiver!`, "success");
            }

// 0x3136323439353536363330393800000000000000000000000000000000000000

            // Update USDAO balance in UI
            return true;

        } catch (error) {
            console.error(error);
        }
    }

    // const remittance_balance = async () => {
    //     try {
    //         const remit_balance = await remittanceContract.balances("0xd9F05ef1E7EEa7ac0941c27574d4eD7cfd376Dd0");
    //         console.log(Number(remit_balance));
    //         setRemittance(Number(ethers.utils.formatEther(String(remit_balance))));
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // const usdao_balance = async () => {
    //     try {
    //         const usdao_balance = await usdaoContract.balanceOf(loggedInAccount);
    //         console.log(Number(usdao_balance));
    //         setUSDAObalance(Number(ethers.utils.formatEther(String(usdao_balance))))
            
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

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
                {/* <Navbar /> */}
                <div className="container mt-5">
                    
                    {/* {!!encrypthash && (
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Please send </strong>{amount}<strong> USDAO to </strong>{usdaoContract.address}<strong> ASAP .</strong>
                        <strong>Hash : </strong>{encrypthash}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                    )} */}
                

                    <div className="mt-5 text-center">
                        <div>
                            <p>Account : {loggedInAccount}</p>
                            <p>Ether Balance : {etherBalance}</p>
                            <p>USDAO Balance : {usdaobalance}</p>
                            <p>Remittance Balance : {remittance}</p>
                            <p>User Secret : {localStorage.getItem('userSecret')}</p>
                            {/* <p>User Secret : {userSecret}</p> */}
                            <p>Hash : {localStorage.getItem('encrypthash')}</p>
                        </div>
                    </div>
                    <div class="row d-flex justify-content-between ">
                        <div class="col-5">
                            <div className="App">
                                <div class="alert alert-light" role="alert">
                                    Remittance Sender
                                </div>
                                <Exchangeform onSubmit={submitdata} fieldOne='Enter Exchanger Address'/>
                                {/* <button onClick={() => send_remit_request(encrypthash, amount)}>New Remittance</button> */}
                                {/* <button onClick={() => view_remittance(encrypthash.encrypthash)}>View Remittance</button> */}
                                <form onSubmit={handleSubmit((data)=>view_remittance(data.hash))} style={{marginTop: '40px'}}>
                                    <input  type="text" placeholder="Enter Hash" {...register("hash", { required: true })} />    
                                    {/* <input type="submit" /> */}
                                    {/* <button onClick={() => view_remittance("0x0b9fd3c4b0108bfa1d3c781f36f781a64776e24ff682316768b0b9ccc129190e")} type='submit'>View Remittance</button> */}
                                    <button type='submit'>View Remittance</button>
                                </form>
                                
                            </div>
                            <p>Remittance amount : {viewremittance.amount ? viewremittance.amount : 'Remittance value do not Exist' }</p>
                            <p>Remittance deadline: {viewremittance.deadline ? viewremittance.deadline : 'Remitance Expired' }</p>
                            <p>Remittance address: {viewremittance.address ? viewremittance.address : 'Remittance value do not Exist' }</p>
                        </div>
                        <div class="col-5 flex-start">
                            <div className="App">
                                <div class="alert alert-light" role="alert">
                                    Remittance Exchanger
                                </div>
                                <Exchangeform onSubmit={exchanger_withdrawal_Submit} fieldOne='Enter User Hash'/>
                                {/* <button onClick={() => exchanger_withdrawal(
                                    "0x3136323438303135363631353900000000000000000000000000000000000000",
                                    20
                                )}>Withdraw Received Amount</button> */}
                               <form onSubmit={handleSubmit((data)=>view_remittance(data.hash))} style={{marginTop: '40px'}}>
                                    <input  type="text" placeholder="Enter Hash" {...register("hash", { required: true })} />    
                                    
                                    <button type='submit'>View Remittance</button>
                                </form>
                                {/* <button onClick={() => remittance_balance()}>Remittance Balance</button>
                                <button onClick={() => usdao_balance()}>USDAO Balance</button> */}

                            </div>
                        </div>
                    </div>

                </div>
            </>
        );
    }


}

export default App;