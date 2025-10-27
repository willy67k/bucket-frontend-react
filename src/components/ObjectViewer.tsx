import { useState } from "react";

interface Data {
  admin?: string;
  id?: string;
  balance?: string;
  objectId?: string;
  error?: string;
  details?: any;
}

const BACKEND_URL = "http://localhost:4000";

export default function ObjectViewer() {
  // const [objectId, setObjectId] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);

  // const handleFetch = async () => {
  //   try {
  //     if (!objectId) return;
  //     setLoading(true);
  //     const res = await fetch(`${BACKEND_URL}/api/object/${objectId}`);
  //     const json = await res.json();
  //     setData(json);
  //   } catch (err) {
  //     console.error(err);
  //     setData({ error: "查詢失敗" });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleFetch = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/object`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setData({ error: "查詢失敗" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
      <h3>UserStory 3 讀取 Object (Testnet)</h3>
      <p style={{ fontSize: "12px", color: "#666", wordBreak: "break-all" }}>0xeeb34a78eaf4ae873c679db294296778676de4a335f222856716d1ad6ed54e45</p>
      {/* <input type="text" placeholder="輸入 Object ID" value={objectId} onChange={(e) => setObjectId(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} /> */}
      <button onClick={handleFetch} disabled={loading}>
        {loading ? "查詢中..." : "查詢 Object"}
      </button>

      {data && (
        <div style={{ marginTop: 16, padding: 12, border: "1px dashed #ccc", borderRadius: 6 }}>
          {data.error ? (
            <div style={{ color: "red" }}>{data.error}</div>
          ) : (
            <>
              <div>
                <strong>Admin:</strong> {data.admin}
              </div>
              <div>
                <strong>Id:</strong> {data.id}
              </div>
              <div>
                <strong>Balance:</strong> {data.balance}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
