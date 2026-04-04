import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const apiKey = process.env.BREVO_API_KEY;
  const listIdRaw = process.env.BREVO_LIST_ID;

  if (!apiKey || !listIdRaw) {
    return NextResponse.json(
      { error: "Newsletter não configurada no servidor." },
      { status: 503 }
    );
  }

  const listId = parseInt(listIdRaw, 10);
  if (Number.isNaN(listId)) {
    return NextResponse.json(
      { error: "Lista de newsletter inválida." },
      { status: 503 }
    );
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    // 201 = criado, 204 = atualizado / sem conteúdo
    if (res.status === 201 || res.status === 204) {
      return NextResponse.json({ success: true });
    }

    const errJson = (await res.json().catch(() => ({}))) as {
      message?: string;
      code?: string;
    };

    // Contato duplicado — com updateEnabled geralmente não ocorre; se ocorrer, tratamos como sucesso
    if (res.status === 400 && errJson.code === "duplicate_parameter") {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      {
        error:
          errJson.message ||
          "Não foi possível inscrever agora. Tente de novo em instantes.",
      },
      { status: res.status >= 500 ? 502 : 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erro de conexão. Tente novamente." },
      { status: 502 }
    );
  }
}
