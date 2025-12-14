"use client";

import Trade from "./Trade";
import TradeMobile from "./TradeMobile";
import { useEffect, useState } from "react";

export default function TradePage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile ? <TradeMobile /> : <Trade />;
}
