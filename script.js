let web3;
let userAddress;
let tokenContract;
let saleContract;

// Kontrat Adresleri (Testnet için güncelleyin)
const TOKEN_ADDRESS = "0xB9F682e4Fb701855956F3118521c61666c52a9a3";
const SALE_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const PROJECT_WALLET = "0xc98389a82505bA6cb4e9E11965A26cb74baB5cca";

// ABI'ler
const tokenABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "burnTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const saleABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_projectWalletBNB",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_projectWalletFENO",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenWallet",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenAmount",
				"type": "uint256"
			}
		],
		"name": "buyTokens",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feePercent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "projectWalletBNB",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "projectWalletFENO",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newWallet",
				"type": "address"
			}
		],
		"name": "setProjectWallet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenPriceUSD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenWallet",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawBNB",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

document.getElementById('connectWallet').addEventListener('click', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];
            
            // Cüzdan bilgilerini göster
            document.getElementById('walletInfo').style.display = 'block';
            document.getElementById('address').textContent = userAddress;
            
            // Bakiyeleri güncelle
            updateBalances();
            
            // Satın alma bölümünü aç
            document.getElementById('buySection').style.display = 'block';
        } catch (error) {
            console.error("Cüzdan bağlanamadı:", error);
        }
    } else {
        alert("Lütfen MetaMask yükleyin!");
    }
});

//ağ kontrolü
async function checkag() {
const chainId = await web3.eth.getChainId();
// BSC Mainnet: 56, BSC Testnet: 97
if (chainId !== 56 && chainId !== 97) {
  alert("Lütfen BSC ağına bağlanın!");
  return;
}
	}

async function updateBalances() {
    // tBNB Bakiyesi
    const bnbBalance = await web3.eth.getBalance(userAddress);
    document.getElementById('bnbBalance').textContent = web3.utils.fromWei(bnbBalance, 'ether') + " tBNB";
    
    // FEN Bakiyesi (9 ondalık basamak için gwei kullanıyoruz)
    tokenContract = new web3.eth.Contract(tokenABI, TOKEN_ADDRESS);
    const tokenBalance = await tokenContract.methods.balanceOf(userAddress).call();
    document.getElementById('tokenBalance').textContent = web3.utils.fromWei(tokenBalance, 'gwei') + " FEN"; // Değişiklik burada
}



function calculateBNBWei(tokenAmountWei) {
    const fenDecimals = 9; // FEN decimal'ı 9 olarak ayarlandı
    const conversionFactor = BigInt(30000) * (10n ** BigInt(fenDecimals)); // 30000 * 1e9 = 3e13
    const tokenAmountWeiBigInt = BigInt(tokenAmountWei);
    
    // BNB wei cinsinden hesapla (1 BNB = 1e18 wei)
    const bnbWei = (tokenAmountWeiBigInt * (10n ** 18n)) / conversionFactor;
    
    return bnbWei;
}

async function calculateBNB() {
    const tokenAmountInput = document.getElementById('tokenAmount').value;
    
    // Girdiyi Big Number'a çevir
    const tokenAmount = web3.utils.toBN(tokenAmountInput);
    
    // Sabitler (yukarıdaki hesaplamaya göre)
    const pricePerToken = web3.utils.toBN("33333333333333"); // 33333.333 wei (0.000033333 BNB)
    const feePercentage = web3.utils.toBN(3); // %3 ücret
    
    // Temel BNB miktarı = tokenAmount * pricePerToken
    const baseBNB = tokenAmount.mul(pricePerToken);
    
    // Ücret = baseBNB * 3 / 100
    const feeBNB = baseBNB.mul(feePercentage).div(web3.utils.toBN(100));
    
    // Toplam BNB = baseBNB + feeBNB
    const totalBNB = baseBNB.add(feeBNB);
    
    // Kullanıcıya göster
    document.getElementById('requiredBNB').textContent = 
        `${web3.utils.fromWei(totalBNB, 'ether')} BNB (Ücret dahil)`;
}

async function buyTokens() {
    const tokenAmountInput = document.getElementById('tokenAmount').value;
    
    // Token miktarını 9 decimal ile işle
    const tokenAmountWei = web3.utils.toWei(tokenAmountInput, 'gwei');
    
    // BNB hesaplaması
    const tokenAmountBN = web3.utils.toBN(tokenAmountInput);
    const pricePerToken = web3.utils.toBN("33333333333333"); // 0.000033333 BNB
    const feePercentage = web3.utils.toBN(3);
    
    const baseBNB = tokenAmountBN.mul(pricePerToken);
    const feeBNB = baseBNB.mul(feePercentage).div(web3.utils.toBN(100));
    const totalBNB = baseBNB.add(feeBNB).toString();
     saleContract = new web3.eth.Contract(saleABI, SALE_ADDRESS);
    // İşlemi gönder
    await saleContract.methods.buyTokens(tokenAmountWei).send({
        from: userAddress,
        value: totalBNB,
        gas: 300000
    });
    
    alert("Satın alma başarılı!");
    updateBalances();
}
