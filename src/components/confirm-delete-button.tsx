"use client";

import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  message?: string;
  className?: string;
  style?: React.CSSProperties;
};

export function ConfirmDeleteButton({
  children,
  message = "정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
  className,
  style,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      type="submit"
      className={className}
      style={style}
      onClick={(e) => {
        if (!window.confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
