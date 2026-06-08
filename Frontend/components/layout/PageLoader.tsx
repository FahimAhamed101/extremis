"use client";

import { useEffect, useRef } from "react";

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loaderRef.current?.classList.add("hidden");
  }, []);

  return (
    <div className="page-loader" id="page-loader" ref={loaderRef}>
      <div className="loader">
        {Array.from({ length: 10 }, (_, index) => (
          <span className="loader-item" key={index}></span>
        ))}
      </div>
    </div>
  );
}
