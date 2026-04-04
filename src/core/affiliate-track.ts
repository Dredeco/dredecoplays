const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.dredecoplays.com.br";

export async function trackAffiliateClick(params: {
  productId?: number;
  postId?: number;
  targetUrl?: string;
}): Promise<void> {
  try {
    await fetch(`${API_URL}/api/affiliate-clicks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: params.productId,
        post_id: params.postId,
        target_url: params.targetUrl,
      }),
      keepalive: true,
    });
  } catch {
    // silencioso — não bloquear navegação
  }
}
