import { getActiveInsightPosts } from "@/lib/content";
import FreeAnalysisBlockClient from "./FreeAnalysisBlockClient";

/* Phase 1.2 (A-1) — server wrapper.
 * getActiveInsightPosts() (server-side fs read) → FreeAnalysisBlockClient (interactive). */
export function FreeAnalysisBlock() {
  const posts = getActiveInsightPosts();
  return <FreeAnalysisBlockClient posts={posts} />;
}
