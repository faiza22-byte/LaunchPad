// src/hooks/use-toast.js
import { useState } from "react";

export function useToast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  function showToast(msg, duration = 3000) {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), duration);
  }

  const ToastComponent = () =>
    visible ? (
      <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg">
        {message}
      </div>
    ) : null;

  return { showToast, ToastComponent };
}