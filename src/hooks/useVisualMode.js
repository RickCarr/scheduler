import { useState } from "react";

export default function useVisualMode(FIRST) {
  const [mode, setMode] = useState(FIRST);
  const [history, setHistory] = useState([FIRST]);
  const newHistory = [...history];
  const transition = (SECOND, replace = false) => {
    if (!replace) {
      setHistory(prev => [...prev, SECOND]);
    }
    setMode(SECOND);
  };
  const back = () => {
    if (history.length > 1) {
      newHistory.pop();
      setHistory(newHistory);
      setMode(newHistory[newHistory.length - 1]);
    }
  };
  return {
    mode,
    transition,
    back
  };
}

