import { ReactNode, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import liff from "@line/liff";
import { css } from "@emotion/react";

export const Home = () => {
  const [message, setMessage] = useState("");
  const [idToken, setIdToken] = useState<string | null>("");
  const [idTokenClaims, setIdTokenClaims] = useState("");
  const [hasFriendship, setHasFriendShip] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!liff.isLoggedIn()) {
      navigate("/", { replace: true });
    } else {
      setIdToken(liff.getIDToken());
      const f = async () => {
        try {
          const friendship = await liff.getFriendship();
          setHasFriendShip(friendship.friendFlag);
        } catch (e) {
          console.error(`liff.getFriendship: ${e}`);
        }
      };
      f();
    }
  }, [navigate]);

  const logout = useCallback(() => {
    liff.logout();
    setTimeout(() => navigate("/"), 200);
  }, [navigate]);

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
    <>
      <h1>toga4-liff-sandbox</h1>
      {message && <p>{message}</p>}
      <p>
        <button onClick={logout}>logout</button>
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
          <StyledPre>{idTokenClaims}</StyledPre>
        </p>
      )}
    </>
  );
};

const StyledPre = ({ children }: { children: ReactNode }) => {
  const style = css({
    fontFamily: "monospace",
    textAlign: "left",
  });
  return <pre css={style}>{children}</pre>;
};
