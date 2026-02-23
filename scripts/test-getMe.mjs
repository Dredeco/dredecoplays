/**
 * Script para testar GET /api/auth/me
 * Uso: node scripts/test-getMe.mjs <TOKEN>
 * O token pode ser obtido fazendo login via API ou copiando do localStorage após login no painel
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.dredecoplays.com.br";
const token = process.argv[2];

if (!token) {
  console.error("Uso: node scripts/test-getMe.mjs <TOKEN>");
  console.error("Obtenha o token fazendo login no painel e copiando de localStorage.auth_token");
  process.exit(1);
}

async function testGetMe() {
  console.log("Chamando", `${API_URL}/api/auth/me`);
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  console.log("Status:", res.status);
  console.log("Resposta:", JSON.stringify(json, null, 2));
  if (res.ok && json.user) {
    console.log("\n✓ Dados recebidos corretamente:");
    console.log("  Nome:", json.user.name);
    console.log("  Email:", json.user.email);
  } else {
    console.error("\n✗ Erro ou formato inesperado");
  }
}

testGetMe().catch(console.error);
