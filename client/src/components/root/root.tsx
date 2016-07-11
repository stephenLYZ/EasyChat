import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/data-provider";
import { setToken, setMyProfile } from "../../utils";
import generateAvatar from "../../utils/generate-avatar";
import "./root.scss";

export function Root() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const handleClick = async () => {
    const res = await createUser(value, generateAvatar({ blocks: 6 }).base64);
    if (res.data.code === 0) {
      const token = res.data.data.token;
      const user = res.data.data.user;
      setToken(token);
      setMyProfile(
        JSON.stringify(user)
      );
      navigate("/app");
    }
  };

  return (
    <div className="root-main">
      <h1>Enter your name, start chatting!</h1>
      <div className="input">
        <input
          className="text-input"
          type="text"
          placeholder="name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <input
          className="submit-input"
          type="submit"
          value="submit"
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
