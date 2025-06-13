import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";

export default function useWebContainer() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);

  const initWebContainer = async () => {
    const webcontainerInstance = await WebContainer.boot();
    setWebcontainer(webcontainerInstance);
  };

  useEffect(() => {
    initWebContainer();
    console.log("WebContainer initialized");
  }, []);

  return webcontainer;
}
