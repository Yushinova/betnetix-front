"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./SelectDropdown.module.css";

interface SelectDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

export default function SelectDropdown({ value, onChange }: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const options = [4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button className={styles.selectButton} onClick={() => setIsOpen(!isOpen)}>
        <span className="text-xs">Показывать на странице <span className={styles.number}>{value}</span></span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006FEE" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <ul className={styles.dropdownList}>
          {options.map((option) => (
            <li
              key={option}
              className={`${styles.dropdownItem} ${value === option ? styles.active : ""}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              <span>{option}</span>
              {value === option && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#006FEE" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}