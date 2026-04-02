import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-foreground">Sem conexão</h1>
      <p className="mt-3 text-muted">
        Você está offline. Verifique a internet e tente de novo.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
