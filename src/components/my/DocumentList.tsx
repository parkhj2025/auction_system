import { FileText, Download } from "lucide-react";
import type { DocumentRow } from "@/types/order";

type DocumentWithUrl = DocumentRow & { signedUrl: string | null };

const DOC_LABEL: Record<DocumentRow["doc_type"], string> = {
  esign: "전자본인서명확인서",
  id_card: "신분증 사본",
  other: "기타 서류",
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentList({ documents }: { documents: DocumentWithUrl[] }) {
  if (documents.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
          제출 서류
        </h3>
        <p className="mt-3 text-sm text-[var(--color-ink-500)]">
          등록된 서류가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-sm">
      <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-ink-500)]">
        제출 서류
      </h3>
      <ul className="mt-4 flex flex-col gap-3">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3"
          >
            <FileText
              size={20}
              className="shrink-0 text-[var(--color-ink-500)]"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[var(--color-ink-900)]">
                {DOC_LABEL[doc.doc_type]}
              </p>
              <p className="mt-0.5 truncate text-xs text-[var(--color-ink-500)]">
                {doc.file_name} · {formatFileSize(doc.file_size)}
              </p>
            </div>
            {doc.signedUrl ? (
              <a
                href={doc.signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-3 text-xs font-bold text-[var(--color-ink-900)] hover:border-brand-600 hover:text-brand-700"
              >
                <Download size={14} aria-hidden="true" />
                열기
              </a>
            ) : (
              <span className="text-xs text-[var(--color-ink-500)]">
                링크 만료
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
