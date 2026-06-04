import { useEffect, useState } from "react";
import { defaultContent } from "@/data/site-content";

function useSiteContent() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    let alive = true;

    fetch("/api/site-content")
      .then((response) => response.json())
      .then((result) => {
        if (alive && result?.ok && result.content) setContent(result.content);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  return content;
}

export { useSiteContent };
