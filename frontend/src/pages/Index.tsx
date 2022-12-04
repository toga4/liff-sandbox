import liff from "@line/liff";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (liff.isLoggedIn()) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  return (
    <p>
      <button onClick={() => liff.login()}>login</button>
    </p>
  );
};
