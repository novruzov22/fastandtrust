"use client";
import React from "react";

export default function SearchBar({ searchTerm, onSearchChange, lang, className }) {
  const placeholderText = lang === 'az' ? 'Məhsul axtar...' : 'Поиск товаров...';

  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder={placeholderText}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={className || "w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"}
      />
    </div>
  );
}