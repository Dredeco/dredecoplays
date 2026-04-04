export type FaqItem = {
  question: string;
  answer: string;
};

export type HowToStep = {
  name: string;
  text: string;
};

export function parseFaqJson(
  raw: string | null | undefined,
): FaqItem[] | null {
  if (!raw?.trim()) return null;
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return null;
    const items: FaqItem[] = [];
    for (const row of data) {
      if (
        row &&
        typeof row === "object" &&
        "question" in row &&
        "answer" in row &&
        typeof (row as { question: string }).question === "string" &&
        typeof (row as { answer: string }).answer === "string"
      ) {
        items.push({
          question: (row as { question: string }).question,
          answer: (row as { answer: string }).answer,
        });
      }
    }
    return items.length ? items : null;
  } catch {
    return null;
  }
}

export function parseVideoJson(raw: string | null | undefined): {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  uploadDate?: string;
  duration?: string;
} | null {
  if (!raw?.trim()) return null;
  try {
    const v = JSON.parse(raw) as Record<string, string>;
    if (!v.name || !v.contentUrl) return null;
    return {
      name: v.name,
      description: v.description ?? "",
      thumbnailUrl: v.thumbnailUrl ?? v.thumbnail_url ?? "",
      contentUrl: v.contentUrl ?? v.content_url ?? "",
      uploadDate: v.uploadDate ?? v.upload_date,
      duration: v.duration,
    };
  } catch {
    return null;
  }
}

export function parseHowToJson(
  raw: string | null | undefined,
): { name: string; description?: string; steps: HowToStep[] } | null {
  if (!raw?.trim()) return null;
  try {
    const data = JSON.parse(raw) as {
      name?: string;
      description?: string;
      steps?: { name: string; text: string }[];
    };
    if (!data.name || !Array.isArray(data.steps)) return null;
    const steps: HowToStep[] = data.steps
      .filter((s) => s?.name && s?.text)
      .map((s) => ({ name: s.name, text: s.text }));
    if (!steps.length) return null;
    return {
      name: data.name,
      description: data.description,
      steps,
    };
  } catch {
    return null;
  }
}
