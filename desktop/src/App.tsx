import { useEffect, useState } from "react";
import "./App.css";

type Share = {
  id: number;
  content: string;
  created_at: string;
};

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [content, setContent] = useState("");
  const [shares, setShares] = useState<Share[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchShares();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function copyShare(content: string) {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  async function deleteShare(id: number) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/shares/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete share");
      }

      await fetchShares();
    } catch (err) {
      setError("Could not delete share.");
      console.error(err);
    }
  }

  async function deleteShare(id: number) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/shares/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete share");
      }

      await fetchShares();
    } catch (err) {
      setError("Could not delete share.");
      console.error(err);
    }
  }

  async function fetchShares() {
    try {
      setError("");

      const response = await fetch(`${API_URL}/shares`);

      if (!response.ok) {
        throw new Error("Failed to fetch shares");
      }

      const data = await response.json();
      setShares(data);
    } catch (err) {
      setError("Could not connect to Setu backend.");
      console.error(err);
    }
  }

  function detectShareType(value: string): "text" | "link" {
    try {
      const url = new URL(value.trim());

      if (url.protocol === "http:" || url.protocol === "https:") {
        return "link";
      }
    } catch {
      // Not a valid URL
    }

    return "text";
  }

  async function createShare() {
    if (!content.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/shares`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          type: detectShareType(content),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create share");
      }

      setContent("");
      await fetchShares();
    } catch (err) {
      console.error("Create share error:", err);

      if (err instanceof TypeError) {
        setError("Setu can't connect to the backend.");
      } else {
        setError("Could not create share. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchShares();
  }, []);

  return (
    <main className="container">
      <h1>Setu</h1>

      <p className="subtitle">
        Share text and links between your devices.
      </p>

      <form
        className="share-form"
        onSubmit={(event) => {
          event.preventDefault();
          createShare();
        }}
      >
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={(event) => {
            if (event.ctrlKey && event.key === "Enter") {
              event.preventDefault();
              createShare();
            }
          }}
          placeholder="Paste text or a link..."
          rows={5}
        />

        <button type="submit" disabled={loading || !content.trim()}>
          {loading ? "Sharing..." : "Share"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <section className="shares-section">
        <div className="section-header">
          <h2>Recent Shares</h2>

          <button onClick={fetchShares} className="refresh-button">
            Refresh
          </button>
        </div>

        {shares.length === 0 ? (
          <p className="empty">No shares yet.</p>
        ) : (
          <div className="shares-list">
            {shares.map((share) => (
              <article className="share-card" key={share.id}>
                <span className="share-type">
                  {share.type.toUpperCase()}
                </span>{share.type === "link" ? (
                  <a
                    href={share.content}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {share.content}
                  </a>
                ) : (
                  <p>{share.content}</p>
                )}

                <div className="share-footer">
                  <small>
                    {new Date(share.created_at).toLocaleString()}
                  </small>

                  <div className="share-actions">
                    <button
                      className="copy-button"
                      onClick={() => copyShare(share.content)}
                    >
                      Copy
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteShare(share.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;