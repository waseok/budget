"use client";

import { useState } from "react";

type Props = {
  name: string;
  defaultValue?: number;
  placeholder?: string;
  required?: boolean;
};

export function CurrencyInput({ name, defaultValue, placeholder, required }: Props) {
  const [display, setDisplay] = useState(
    defaultValue ? defaultValue.toLocaleString("ko-KR") : ""
  );

  return (
    <>
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9]/g, "");
          setDisplay(raw ? Number(raw).toLocaleString("ko-KR") : "");
        }}
        placeholder={placeholder}
        required={required}
      />
      <input type="hidden" name={name} value={display.replace(/,/g, "") || ""} />
    </>
  );
}
