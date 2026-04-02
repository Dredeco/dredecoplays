# Migração: Google AdSense → Google Ad Manager / redes premium

## Quando migrar

- Tráfego estável acima de **50.000 sessões/mês** (ou antes, se o RPM do AdSense estiver abaixo do potencial do nicho).
- Objetivo: **header bidding**, leilões em camadas e parceiros como **Ezoic**, **Mediavine**, **Raptive** (ex-AdThrive).

## Passos técnicos (resumo)

1. **Criar conta GAM** (Google Ad Manager 360 ou conta gratuita conforme elegibilidade).
2. **Substituir** o script único `adsbygoogle.js` por tags **GPT** (`googletag`) ou pelo snippet da rede premium escolhida.
3. **Mapear slots** atuais (`NEXT_PUBLIC_ADSENSE_SLOT_*`) para **ad units** no GAM com os mesmos tamanhos/posições.
4. **Manter** `AdSlot.tsx` como wrapper, trocando apenas a implementação interna (ins/datalayer → slot GAM).
5. **Consentimento** (LGPD / TCF): integrar CMP (Consent Manager Platform) antes de carregar anúncios personalizados.
6. **Testar** em staging: CLS, LCP, receita por slot no relatório GAM.

## Variáveis de ambiente futuras (sugestão)

```
NEXT_PUBLIC_AD_MANAGER_NETWORK_ID=
NEXT_PUBLIC_GAM_SLOT_TOP=
NEXT_PUBLIC_USE_EZOIC=false
```

## Referências

- [Google Ad Manager – Help](https://support.google.com/admanager)
- Políticas de monetização Google Publisher
