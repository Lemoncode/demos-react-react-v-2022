import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
import { CenterLayout } from "@/layouts";
import { ProfileContext } from "@/core/profile";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { setUserProfile } = React.useContext(ProfileContext);

  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === "admin" && password === "test") {
      setUserProfile({ userName: username });
      navigate(routes.list);
    } else {
      alert("User / password not valid, psst... admin / test");
    }
  };

  return (
    <CenterLayout>
      <form onSubmit={handleNavigation}>
        <div className="login-container">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">login</button>
        </div>
      </form>
    </CenterLayout>
  );
};
