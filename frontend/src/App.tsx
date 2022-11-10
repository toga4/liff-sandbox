import { useCallback, useState } from "react";
import liff from "@line/liff";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [idToken, setIdToken] = useState<string | null>("");
  const [idTokenClaims, setIdTokenClaims] = useState("");
  const [error, setError] = useState("");

  useState(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
        mock: import.meta.env.VITE_LIFF_MOCK === "true",
        withLoginOnExternalBrowser: true,
      })
      .then(async () => {
        setMessage("LIFF init succeeded.");
        setIdToken(liff.getIDToken());
      })
      .catch((e: Error) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      });
  });

  const onClickVerify = useCallback(async () => {
    try {
      const response = await fetch(
        "https://toga4-liff-sandbox-ki6hejsv5q-an.a.run.app/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      if (response.ok) {
        const resp = await response.json();
        setIdTokenClaims(JSON.stringify(resp, null, "  "));
      } else {
        setMessage("ID token verify failed.");
      }
    } catch (e) {
      setError(`${e}`);
    }
  }, [idToken]);

  return (
    <div className="App">
      <h1>toga4-liff-sandbox</h1>
      {message && <p>{message}</p>}
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}
      <p>
        <a
          href="https://github.com/toga4/liff-sandbox"
          target="_blank"
          rel="noreferrer"
        >
          github.com/toga4/liff-sandbox
        </a>
      </p>
      {idToken && (
        <>
          <p>
            <textarea readOnly>{idToken}</textarea>
          </p>
          <p>
            <button onClick={onClickVerify}>verify</button>
          </p>
        </>
      )}
      {idTokenClaims && (
        <p>
          <pre>{idTokenClaims}</pre>
        </p>
      )}
    </div>
  );
}

export default App;
