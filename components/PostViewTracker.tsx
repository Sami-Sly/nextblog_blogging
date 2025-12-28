"use client";

import { useEffect } from "react";

const URL = "http://localhost:3000";
export default function PostViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    fetch(`${URL}/api/posts/${postId}/view`, {
      method: "POST",
    });
  }, [postId]);

  return null; // invisible component
}
