import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [idToken, setIdToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
        mock: import.meta.env.VITE_LIFF_MOCK === "true",
      })
      .then(async () => {
        setMessage("LIFF init succeeded.");
        if (!liff.isLoggedIn()) {
          liff.login();
        }
        setIdToken(liff.getIDToken() || "");
      })
      .catch((e: Error) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      });
  });

  return (
    <div className="App">
      <h1>create-liff-app</h1>
      {message && <p>{message}</p>}
      {idToken && <p>{idToken}</p>}
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}
      <a
        href="https://developers.line.biz/ja/docs/liff/"
        target="_blank"
        rel="noreferrer"
      >
        LIFF Documentation
      </a>
    </div>
  );
}

export default App;
