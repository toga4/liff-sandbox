import { useCallback, useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [idToken, setIdToken] = useState<string | null>("");
  const [idTokenClaims, setIdTokenClaims] = useState("");
  const [hasFriendship, setHasFriendShip] = useState(false);
  const [error, setError] = useState("");

  let isLoggedIn = false;
  try {
    isLoggedIn = liff.isLoggedIn();
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    if (isLoggedIn) {
      setIdToken(liff.getIDToken());
      const f = async () => {
        const friendship = await liff.getFriendship();
        setHasFriendShip(friendship.friendFlag);
      };
      f();
    }
  }, [isLoggedIn]);

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
      <p>
        {isLoggedIn ? (
          <button
            onClick={() => {
              liff.logout();
              setTimeout(() => location.reload(), 200);
            }}
          >
            logout
          </button>
        ) : (
          <button onClick={() => liff.login()}>login</button>
        )}
      </p>
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
            <textarea readOnly value={idToken} />
          </p>
          <p>
            <button onClick={onClickVerify}>verify</button>
          </p>
        </>
      )}
      <p>LINE Bot が友だちに追加されていま{hasFriendship ? "す" : "せん"}</p>
      <p>
        <a
          href="https://line.me/R/ti/p/@879nkzzv"
          target="_blank"
          rel="noreferrer"
        >
          LINE Bot を友だちに追加
        </a>
      </p>
      {idTokenClaims && (
        <p>
          <pre>{idTokenClaims}</pre>
        </p>
      )}
    </div>
  );
}

export default App;
