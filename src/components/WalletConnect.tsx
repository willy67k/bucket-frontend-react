import { useState, useEffect } from "react";
import { ConnectButton, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import Decimal from "decimal.js";

const WALLETS = [
  {
    name: "Suiet",
    link: "https://chromewebstore.google.com/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd",
  },
  {
    name: "Slush",
    link: "https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil",
  },
  {
    name: "Binance Wallet",
    link: "https://chromewebstore.google.com/detail/binance-wallet/cadiboklkpojfamcoggejbbdjcoiljjk",
  },
];
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

export default function WalletConnect() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [balance, setBalance] = useState<string | null>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [installedExtensions, setInstalledExtensions] = useState({});

  const walletFilterHandler = (wallet) => {
    const { name } = wallet;
    setInstalledExtensions((prev) => {
      prev[name] = true;
      return prev;
    });
    return true;
  };

  useEffect(() => {
    async function fetchBalance() {
      if (!account) {
        setBalance(null);
        return;
      }
      try {
        const res = await client.getBalance({ owner: account.address });
        setBalance(new Decimal(res.totalBalance).div(1e9).toFixed(9));
      } catch (err) {
        console.error("取得餘額失敗", err);
        setBalance("Error");
      }
    }
    fetchBalance();
  }, [account, client]);

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3>UserStory 1 連結錢包</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <ConnectButton walletFilter={walletFilterHandler} />

        {account ? (
          <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", width: "900px" }}>
            <p>Env: {account.chains[0].split(":")[1].toUpperCase()}</p>
            <p>Address: {account.address}</p>
            <p style={{ color: "#2196F3" }}>SUI Balance: {balance ? <b>{balance}</b> : "Loading..."}</p>
          </div>
        ) : (
          <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", width: "900px", backgroundColor: "#f9f9f9" }}>
            {!isChrome && (
              <div style={{ padding: "12px", marginBottom: "16px", backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: "6px", color: "#856404" }}>
                <strong>建議使用 Chrome 瀏覽器</strong>
                <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>為獲得最佳體驗，建議使用 Google Chrome 瀏覽器安裝錢包擴充功能。</p>
              </div>
            )}

            <p style={{ marginBottom: "12px" }}>尚未連接錢包</p>

            {!showInstallGuide ? (
              <button onClick={() => setShowInstallGuide(true)} style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "14px" }}>
                查看如何安裝錢包 →
              </button>
            ) : (
              <div style={{ marginTop: "16px" }}>
                <button onClick={() => setShowInstallGuide(false)} style={{ padding: "4px 8px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", marginBottom: "12px" }}>
                  收起
                </button>

                <div style={{ marginTop: "16px" }}>
                  <h4 style={{ marginBottom: "12px", fontSize: "16px" }}>推薦的 Sui 錢包擴充功能(安裝後請重新整理頁面)：</h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {WALLETS.map((wallet) => (
                      <a
                        key={wallet.name}
                        href={wallet.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          backgroundColor: "white",
                          textDecoration: "none",
                          color: "inherit",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#007bff";
                          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,123,255,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#ddd";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div style={{ fontWeight: "600" }}>{wallet.name}</div>
                        {installedExtensions[wallet.name] ? <div style={{ fontSize: "14px", color: "#54cf69ff" }}>已安裝</div> : <div style={{ fontSize: "14px", color: "#007bff" }}>前往安裝 →</div>}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
