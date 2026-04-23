import { useState } from "react";

type TableName = "public_feedback" | "sessions";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [table, setTable] = useState<TableName>("public_feedback");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const download = async () => {
    if (!password || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, table }),
      });
      if (res.status === 401) {
        setError("密碼錯誤 / Wrong password");
        return;
      }
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        setError(`Server error (${res.status}): ${detail.slice(0, 200)}`);
        return;
      }
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") || "";
      const match = cd.match(/filename="([^"]+)"/);
      const filename = match ? match[1] : `CrimsonWise_${table}.csv`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError("網路錯誤 / Network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: 'system-ui, -apple-system, "Noto Sans TC", sans-serif',
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 360,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#b91c1c",
            marginBottom: 4,
          }}
        >
          🔒 CrimsonWise Admin
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
          下載 CSV 資料 / Export CSV
        </div>

        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 700,
            color: "#374151",
            marginBottom: 6,
          }}
        >
          資料表 / Table
        </label>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {(["public_feedback", "sessions"] as TableName[]).map((tb) => (
            <button
              key={tb}
              onClick={() => setTable(tb)}
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: 10,
                border: `2px solid ${table === tb ? "#dc2626" : "#e5e7eb"}`,
                background: table === tb ? "#fef2f2" : "#fff",
                color: table === tb ? "#b91c1c" : "#6b7280",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {tb === "public_feedback" ? "民眾衛教" : "醫護版"}
            </button>
          ))}
        </div>

        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 700,
            color: "#374151",
            marginBottom: 6,
          }}
        >
          管理員密碼 / Password
        </label>
        <input
          type="password"
          value={password}
          autoFocus
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") void download();
          }}
          placeholder="••••••••"
          style={{
            width: "100%",
            padding: "11px 12px",
            fontSize: 14,
            borderRadius: 10,
            border: `2px solid ${error ? "#dc2626" : "#e5e7eb"}`,
            boxSizing: "border-box",
            marginBottom: error ? 4 : 14,
            outline: "none",
          }}
        />

        {error && (
          <div style={{ color: "#dc2626", fontSize: 12, marginBottom: 12 }}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={download}
          disabled={!password || busy}
          style={{
            width: "100%",
            padding: 13,
            borderRadius: 12,
            border: "none",
            background:
              password && !busy
                ? "linear-gradient(135deg,#dc2626,#b91c1c)"
                : "#e5e7eb",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
            cursor: password && !busy ? "pointer" : "not-allowed",
          }}
        >
          {busy ? "⏳ …" : "📥 下載 / Download CSV"}
        </button>

        <div
          style={{
            marginTop: 16,
            fontSize: 11,
            color: "#9ca3af",
            lineHeight: 1.5,
          }}
        >
          密碼由伺服器端{" "}
          <code
            style={{
              background: "#f3f4f6",
              padding: "1px 4px",
              borderRadius: 3,
            }}
          >
            ADMIN_PASSWORD
          </code>{" "}
          環境變數驗證，不會出現在前端程式碼中。
        </div>
      </div>
    </div>
  );
}
