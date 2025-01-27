// script.js
document.addEventListener('DOMContentLoaded', () => {
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const statusText = document.getElementById('statusText');
    const networkText = document.getElementById('networkText');

    let provider;
    let signer;

    // BSC Testnet Ayarları
    const BSC_TESTNET_CONFIG = {
        chainId: '0x61', // 97 ondalık
        chainName: 'Binance Smart Chain Testnet',
        nativeCurrency: {
            name: 'tBNB',
            symbol: 'tBNB',
            decimals: 18,
        },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
        blockExplorerUrls: ['https://testnet.bscscan.com/'],
    };

    // MetaMask Kontrolü
    async function checkMetaMask() {
        if (!window.ethereum) {
            alert('Lütfen MetaMask yükleyin!');
            return false;
        }
        return true;
    }

    // Ağı BSC Testnet'e Ayarla
    async function switchToBSCNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: BSC_TESTNET_CONFIG.chainId }],
            });
            return true;
        } catch (error) {
            if (error.code === 4902) {
                // Ağ yüklü değilse ekle
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [BSC_TESTNET_CONFIG],
                    });
                    return true;
                } catch (addError) {
                    console.error('Ağ eklenemedi:', addError);
                    return false;
                }
            }
            return false;
        }
    }

    // Cüzdanı Bağla
    async function connectWallet() {
        if (!(await checkMetaMask())) return;

        try {
            // BSC Testnet'e geçiş yap
            const isNetworkSwitched = await switchToBSCNetwork();
            if (!isNetworkSwitched) {
                alert('Lütfen BSC Testnet\'e geçiş yapın!');
                return;
            }

            // Provider ve Signer'ı ayarla
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            const address = await signer.getAddress();

            // Arayüzü güncelle
            statusText.textContent = `Bağlı: ${truncateAddress(address)}`;
            networkText.textContent = 'Ağ: BSC Testnet';
            connectWalletBtn.textContent = 'Cüzdan Bağlı';
            connectWalletBtn.disabled = true;

        } catch (error) {
            alert('Bağlantı hatası: ' + error.message);
        }
    }

    // Adresi kısalt (0x1234...5678)
    function truncateAddress(address) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    // Buton Event Listener
    connectWalletBtn.addEventListener('click', connectWallet);
});
