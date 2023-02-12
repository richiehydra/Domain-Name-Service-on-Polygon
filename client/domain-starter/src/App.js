import React from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { useEffect, useState } from 'react';
import ContractABI from "./DomainName.json"
const TWITTER_HANDLE = '_buildspace';
const { ethers } = require("ethers");
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const tld = ".ninja"
const App = () => {
	const contractAddress = "0xa81C2311c8762cd5F0C0bECa7Abe6262aEA07a99";
	const abi = ContractABI.abi;
	const [currentAccount, setAccount] = useState("");
	const [currentDomain, setDomain] = useState("");
	const [currentRecord, setRecord] = useState("")
    const [currentDisplay,setDisplay]=useState([]);
   
	const connectWallet = async () => {
		const { ethereum } = window;
		try {

			if (!ethereum) {
				alert("Get MetaMask -> https://metamask.io/");
				return;
			}
			else {
				console.log("Ethereum Object found", ethereum);
			}
		}
		catch (error) {
			console.log(error)
		}


		if (ethereum) {
			const accounts = await ethereum.request({ method: "eth_requestAccounts" });
			if (accounts.length != 0) {
				let account = accounts[0];
				
				setAccount(account);
				window.ethereum.on("chainChanged", () => {
					window.location.reload();
				  })
		
				  window.ethereum.on("accountsChanged", () => {
					window.location.reload();
				  })
			}
			else {
				console.log('No authorized account found');
			}

		}
	}

	const renderNotConnectedContainer = () => (
		<div className="connect-wallet-container">
			<img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja donut gif" />
			{/* Call the connectWallet function we just wrote when the button is clicked */}
			<button onClick={connectWallet} className="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
	);
	const mintData = async () => {
		console.log(currentDomain)
		let price = '0';
		if (currentDomain) {

			let len = currentDomain.length;
			if (len <= 1) {
				alert("Please Provide Domain Name Of Length More than 1 or Atleast 3");
				return;
			}
			if (len <= 5) {
				price = '0.1';
			}
			else if (len === 6) {
				price = '0.1';
			}
			else if (len === 7) {
				price = '0.2';
			}
			else {
				price = '0.3';
			}
			console.log(price)
		}
		try {
			const { ethereum } = window;

			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(contractAddress, abi, signer);
			alert(`Paying  ${price} matic ethers`);
			const txn = await contract.register(currentDomain, { value: ethers.utils.parseEther(price) });
			const receipt = await txn.wait();
			if (receipt.status === 1) {
				console.log("Domain minted! https://mumbai.polygonscan.com/tx/" + txn.hash);
			}
			console.log(currentDomain);
			console.log(currentRecord);
			const tx = await contract.setRecords(currentDomain, currentRecord);
			const receipt2 = await tx.wait();
			if (receipt2.status == 1) {
				console.log("Record Set! https://mumbai.polygonscan.com/tx/" + tx.hash);
			}

			setDomain(' ');
			setRecord(' ');

		} catch (err) {
			console.log(err);
		}


	}
	const renderInputForm = () => {
		return (
			<div className="form-container">
				<div className="first-row">
					<input
						type="text"
						value={currentDomain}
						placeholder='domain'
						onChange={e => setDomain(e.target.value)}
					/>
					<p className='tld'> {tld} </p>
				</div>

				<input
					type="text"
					value={currentRecord}
					placeholder='whats ur ninja power'
					onChange={e => setRecord(e.target.value)}
				/>

				<div className="button-container">
					<button className='cta-button mint-button' onClick={mintData} >
						Mint
					</button>
					
				</div>

			</div>
		);
	}

	const Withdraw=async()=>
	{
		try
		{
			const { ethereum } = window;
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(contractAddress, abi, signer);
			const tx=await contract.connect(signer).WithDrawal();
			let receipt=await tx.wait();
			if(receipt.status==1)
			{
				alert("SuccesFully Withdrawed the Amount");
			}
			else
			{
				alert("Transaction Error");
			}
		}catch(err)
		{
			console.log(err);
		}
	}


const renderDetails=async()=>
{
	return(
		<div className='footer-container'>
				{currentDisplay}
				</div>
	)
}



   const renderRecords=async()=>
   {
	try
	{
		const { ethereum } = window;
		const provider = new ethers.providers.Web3Provider(ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, abi, signer);
		let display=await contract.getRecords(currentDomain);
		setDisplay(display);
		
	}catch(err)
	{
		console.log(err);
	}
   }

	useEffect(() => {
		connectWallet();
		renderDetails();
	}, [])


	return (
		<div className="App">
			<div className="container">

				<div className="header-container">
					<header>
						<div className="left">
						<p className="subtitle">Current Address:{currentAccount}</p>
							<p className="title">🐱‍👤 Ninja Name Service</p>
							<p className="subtitle">Your immortal API on the blockchain!</p>
						</div>
					</header>
				</div>
				{!currentAccount && renderNotConnectedContainer()}
				{currentAccount && renderInputForm()}

				<div className='footer-container'>
				<button className='cta-button mint-button' onClick={Withdraw} >
						WithDraw Amount(Owner Only)
					</button>
				</div>
				<div className='footer-container'>
				<button className='cta-button mint-button' onClick={renderRecords} >
						Get Current  Power
					</button>

					<button className='cta-button mint-button' onClick={renderRecords} >
						Your Current Ninja Power is:{currentDisplay}
					</button>
				</div> 
				

				

				
				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built with @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
}

export default App;
