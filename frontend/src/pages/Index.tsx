import liff from "@line/liff";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isMocked } from "../mock";

export const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (liff.isLoggedIn()) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const login = () => {
    liff.login();
    if (isMocked) {
      liff.$mock.set((p) => ({ ...p, isLoggedIn: true }));
      navigate("/home");
    }
  };

  return (
    <p>
      <button onClick={login}>login</button>
    </p>
  );
};
