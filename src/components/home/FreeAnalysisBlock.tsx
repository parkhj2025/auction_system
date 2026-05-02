import { getActiveInsightPosts } from "@/lib/content";
import FreeAnalysisBlockClient from "./FreeAnalysisBlockClient";

/* Phase 1.2 (A-1-2) v4 — FreeAnalysisBlock (server wrapper).
 * getActiveInsightPosts() (analysis + guide + news 통합 + status published + DESC) → client component pass. */

export function FreeAnalysisBlock() {
  const posts = getActiveInsightPosts();
  return <FreeAnalysisBlockClient posts={posts} />;
}
