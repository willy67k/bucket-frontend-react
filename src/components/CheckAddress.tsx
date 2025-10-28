import { useState, useMemo, useCallback } from "react";
import Pagination from "./Pagination";
import { api } from "../api/axios";

interface CoinData {
  coinType: string;
  balance: string;
}

interface ApiResult {
  address?: string;
  suiBalance?: string;
  otherCoins?: CoinData[];
  error?: string;
  details?: any;
}

export default function CheckAddress() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleCheck = async () => {
    try {
      if (!address) return;

      setLoading(true);

      const { data } = await api.get(`/balance/${address}`);
      if (data.error) {
        setResult({ error: data.error, details: data.details });
      } else {
        setResult(data);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error(err);
      setResult({ error: "查詢失敗：" + (err as any).message });
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalCoins = useMemo(() => result?.otherCoins?.length || 0, [result?.otherCoins?.length]);
  const totalPages = useMemo(() => Math.ceil(totalCoins / itemsPerPage), [totalCoins, itemsPerPage]);
  const currentCoins = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return result?.otherCoins?.slice(startIndex, endIndex) || [];
  }, [result?.otherCoins, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages],
  );

  const getCoinTypeName = useCallback((coinType: string): string => {
    const parts = coinType.split("::");
    if (parts.length >= 3) {
      return parts[2];
    }
    return coinType;
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
      <h3>UserStory 2 查詢錢包帳戶資料 (Mainnet)</h3>
      <input type="text" placeholder="輸入錢包地址" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} />
      <button onClick={handleCheck} disabled={loading}>
        {loading ? "查詢中..." : "查詢"}
      </button>

      {result && (
        <div style={{ marginTop: 16, padding: 12, border: "1px dashed #ccc", borderRadius: 6 }}>
          {result.error ? (
            <div style={{ color: "red", padding: "12px", backgroundColor: "#ffe6e6", borderRadius: 4 }}>
              <strong>Error:</strong> {result.error}
              {result.details && <pre style={{ marginTop: 8, fontSize: "12px", overflow: "auto" }}>{JSON.stringify(result.details, null, 2)}</pre>}
            </div>
          ) : (
            <>
              <div>
                <strong>Address:</strong> {result.address}
              </div>
              <div>
                <strong>SUI Balance:</strong> {result.suiBalance}
              </div>

              {result.otherCoins && result.otherCoins.length > 0 && (
                <>
                  <div style={{ marginTop: 16 }}>
                    <strong>Other Coin ({totalCoins}):</strong>
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
                    {currentCoins.map((c: CoinData) => (
                      <li
                        key={c.coinType}
                        style={{
                          padding: "8px 12px",
                          marginBottom: 8,
                          backgroundColor: "#f9f9f9",
                          borderRadius: 4,
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <div style={{ fontWeight: 600, color: "#333", marginBottom: 4 }}>{getCoinTypeName(c.coinType)}</div>
                        <div style={{ fontSize: "12px", color: "#666", wordBreak: "break-all" }}>{c.coinType}</div>
                        <div style={{ marginTop: 4, color: "#2196F3" }}>
                          Balance: <b>{c.balance}</b>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Pagination currentPage={currentPage} totalPages={totalPages} itemsPerPage={itemsPerPage} totalItems={totalCoins} onPageChange={handlePageChange} onItemsPerPageChange={setItemsPerPage} />
                </>
              )}

              {(!result.otherCoins || result.otherCoins.length === 0) && (
                <div style={{ marginTop: 16 }}>
                  <strong>Other Coin:</strong> None
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
