"use client";

import { useRef, useState, useId } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { isAcceptableFile, formatFileSize, MAX_FILE_SIZE } from "@/lib/apply";
import { cn } from "@/lib/utils";

/**
 * 재사용 가능한 파일 선택 블록.
 * - PDF · 이미지(jpeg/png/webp)만 허용, 10MB 상한
 * - Phase 1은 클라이언트에서 File 객체만 보유. 제출 시 FormData로 전송.
 */
export function FileUpload({
  label,
  description,
  file,
  onFileChange,
  helperLink,
}: {
  label: string;
  description: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  helperLink?: { href: string; text: string };
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const id = useId();

  function handleFile(next: File | null) {
    setError(null);
    if (!next) {
      onFileChange(null);
      return;
    }
    if (!isAcceptableFile(next)) {
      if (next.size > MAX_FILE_SIZE) {
        setError("파일 크기가 10MB를 초과합니다.");
      } else {
        setError("PDF 또는 이미지(JPG/PNG/WebP) 파일만 업로드할 수 있습니다.");
      }
      return;
    }
    onFileChange(next);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0] ?? null);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0] ?? null);
  }

  function clearFile() {
    onFileChange(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="text-[var(--label-fs-app)] font-bold text-[var(--color-ink-900)]"
        >
          {label}
        </label>
        {helperLink && (
          <a
            href={helperLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[var(--color-ink-900)] underline decoration-[var(--color-ink-300)] underline-offset-2 hover:text-black"
          >
            {helperLink.text}
          </a>
        )}
      </div>
      <p className="mb-3 text-xs leading-5 text-[var(--color-ink-500)]">
        {description}
      </p>

      {file ? (
        <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-ink-900)] bg-[var(--color-ink-50)]/70 p-4">
          <FileText
            size={20}
            className="shrink-0 text-[var(--color-ink-900)]"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[var(--color-ink-900)]">
              {file.name}
            </p>
            <p className="text-xs text-[var(--color-ink-500)]">
              {formatFileSize(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={clearFile}
            aria-label="파일 제거"
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-ink-500)] hover:bg-white hover:text-[var(--color-ink-900)]"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={cn(
            "flex min-h-[112px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed p-6 text-center transition",
            error
              ? "border-[var(--color-accent-red)] bg-[var(--color-accent-red-soft)]/40"
              : "border-[var(--color-border)] bg-[var(--color-surface-muted)] hover:border-[var(--color-ink-900)] hover:bg-[var(--color-ink-50)]/40"
          )}
        >
          <Upload
            size={22}
            className="text-[var(--color-ink-500)]"
            aria-hidden="true"
          />
          <p className="text-base font-bold text-[var(--color-ink-700)]">
            파일을 드래그하거나 클릭하여 선택
          </p>
          <p className="text-xs text-[var(--color-ink-500)]">
            PDF · JPG · PNG · WebP · 최대 10MB
          </p>
        </label>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        onChange={onInputChange}
        className="sr-only"
      />

      {error && (
        <p
          role="alert"
          className="mt-2 flex items-center gap-1 text-xs font-bold text-[var(--color-accent-red)]"
        >
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
