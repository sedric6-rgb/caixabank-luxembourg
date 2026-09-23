"use client";

import { useState } from "react";

export function PasswordInput({ id, name, className }: { id: string; name: string; className?: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        required
        className={className || "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-11"}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        tabIndex={-1}
      >
        {visible ? (
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M3 3l14 14M8.5 8.5a2 2 0 002.9 2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6.5 6.5C4.8 7.7 3.5 9.3 3 10c1 1.8 3.5 5 7 5 1.2 0 2.3-.4 3.2-.9M10 5c3.5 0 6 3.2 7 5-.4.7-1 1.5-1.8 2.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M10 5c3.5 0 6 3.2 7 5-1 1.8-3.5 5-7 5s-6-3.2-7-5c1-1.8 3.5-5 7-5z" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        )}
      </button>
    </div>
  );
}
