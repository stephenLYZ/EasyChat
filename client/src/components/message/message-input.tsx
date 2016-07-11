import { Input } from "antd";
import { useState } from "react";

export function MessageInput({
  onSubmit,
}: {
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<EventTarget>) => {
    if (!e?.ctrlKey && e?.code === "Enter" && e.keyCode === 13) {
      e?.preventDefault();
      onSubmit(value);
      setValue("");
    }
    if (e?.ctrlKey && e?.code === "Enter" && e.keyCode === 13) {
      setValue((text) => `${text}\n`);
    }
  };

  return (
    <div className="input-box">
      <Input.TextArea
        placeholder="send a message"
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        bordered={false}
        autoSize={false}
      />
    </div>
  );
}
