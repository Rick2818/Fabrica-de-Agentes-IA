# Punto 4 — continuidad de solo lectura — 2026-10-31 07:09 SV

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** No hay cliente real para aceptación final; su ausencia no reabre el cierre. Auditoría exclusiva de Fábrica de Agentes IA, Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, repositorio `Rick2818/Fabrica-de-Agentes-IA`, Supabase `udispwzwrebjkanudcoy`. No se alteraron ejecutores, trabajos, fechas, cuota, proveedores ni producción; no se activó v54 guardada.

## Lecturas verificadas
- **Supabase, 2026-10-31 13:09:20 UTC (07:09:20 SV):** proyecto `ACTIVE_HEALTHY`. Único trabajo de `cron.job`: `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`, `select private.fabrica_scheduler_tick();`. Configuración privada: `enabled=true`, `not_before=NULL`, `last_error=NULL`. `cron.job_run_details`: **3,952** ejecuciones `succeeded` históricas; 240 `succeeded` en cuatro horas al primer corte. SQL `succeeded` no acredita trabajo `done`.
- **Recibos SQL:** **3,214** ciclos en `private.fabrica_scheduler_receipts`, **3,209** `verified=true`, **9** `site_status=done` históricos, **4** `error_code=network_error` históricos. En la última hora: **0** `done` y **0** errores nuevos. **0** UUID duplicados; **0** request_id duplicados; **0** no verificados con más de tres minutos sin código de error. Índices únicos `fabrica_scheduler_receipts_pkey(cycle_id)` y `fabrica_scheduler_receipts_request_id_key(request_id)` presentes.
- **Correlación:** UUID `599c4d1f-654a-4ed6-9ce1-c52d6e74d7ac` (13:08 UTC) coincide con el `run_id` reportado por el Site en una lectura anterior; conciliado en SQL a las 13:09 UTC, HTTP 200, `verified=true`, `site_status=idle`. UUID `5149236e-71cd-4b36-8f07-945871b0796d` (13:09 UTC) coincide con el Site, estado `idle`, pero aún no estaba conciliado en SQL al corte de las 13:09:20 UTC. No atribuirle error ni entrega.
- **Integridad de funciones:** hashes MD5 `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d` y `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`, iguales al control anterior. Inspección estática: `tick` contiene referencias a advisory lock, `not_before` y recibos; `reconcile` contiene `not_before` y recibos. **Esto no sustituye una prueba dinámica de concurrencia/recuperación.**
- **Site (conector operativo `agent_status`):** 65 trabajos, **60 `done` / 2 `failed` históricos / 3 `cancelled` / 0 pendientes**; 0 leases activos y 0 reintentos vencidos en los trabajos visibles. `health.autonomy.primary.recent=true`, `health.supabase_runner.status=idle`, `pending=0`, `next_at=NULL`, cuota **0/20**. Dos fallos históricos: HTTP 503 y timeout de Gemini. Ningún `idle` demuestra procesamiento `done`.
- **Respaldo horario:** `Automations.peek` confirmó `is_enabled=true` para `6adbf94d28e8819189c0516c6068457a`; último registro `2026-10-31T12:25:36Z`, `recorded_status=no_update`. No se ejecutó un segundo ciclo.
- **GitHub:** `AGENTS.md` leído. Se leyeron individualmente los siete workflows: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno conserva `on.schedule`**; `agent-runner` usa `workflow_dispatch` únicamente. Los workflows `push`/`pull_request` son pruebas, no ejecutores de cola programados.
- **Logs:** ventana `2026-10-31T11:10:00Z` a `13:10:00Z`: 285 `postgres_logs` y 6 `pgbouncer_logs`, sin coincidencias textuales `error`/`timeout` en `event_message` con el filtro consultado. No demuestra ausencia de todo fallo.
- **Errores históricos de transporte:** cuatro `network_error` programados en UTC: 2026-10-30 00:38, 03:53, 05:17, 05:54. Sin causa raíz acreditada. No se forzó una repetición ni se manipuló cuota.
- **Modelos:** `agent_status` mantiene principal `gemini-2.5-flash` (chequeo sintético histórico HTTP 404), respaldo `gemini-2.5-flash-lite` (HTTP 404) y tercero `gemini-3.5-flash-lite` (HTTP 200). No se probó fallback nuevo. La discrepancia entre el `MODEL='gemini-3.6-flash'` de `worker/runtime.mjs` en GitHub y el estado operativo del Site sigue pendiente de conciliación.
- **Fuentes/versiones:** el runner manual de GitHub apunta a `https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site`, diferente de la URL atribuida al Site en una nota operativa anterior (`https://agente-ricardo-revision-rick.rick271711.chatgpt.site`). No se deduce cuál es el despliegue efectivo. La lectura nativa de Sites no estuvo disponible en este contexto; esto **no** significa que la fuente sea inaccesible: se recuperó la fuente nativa v53 en commit `5be977154cc15c9511787d22e28b7367e6f00467` con 122 pruebas de servidor aprobadas en worktree histórico. v54 sigue guardada, sin desplegar.

## Diferencias respecto a 06:12 SV
- SQL `succeeded`: **3,894 → 3,952** (+58).
- Recibos: **3,156 → 3,214** (+58); verificados **3,151 → 3,209** (+58).
- `done` históricos **9 → 9**; `network_error` **4 → 4**; trabajos Site **60 done / 2 failed / 3 cancelled / 0 pendientes**, sin cambio.
- **No se identificó una regresión nueva que requiera cambio inmediato.**

## Pendientes — no aprobados
1. Comparar mediante acceso nativo de Sites la fuente y versión efectivamente desplegadas, las URLs y la cadena de modelos, preservando los cambios actuales.
2. Ejecutar **en entorno aislado** pruebas dinámicas de concurrencia, locks, reintentos, idempotencia, pausa, `not_before`, recuperación persistente y fallback. En este control se hicieron verificaciones de integridad de solo lectura, no esas pruebas.
3. Determinar causa raíz de cuatro errores históricos `network_error`.
4. Validar recorrido E2E con recibos operativos por cada uno de los seis agentes y, por separado, aceptación final de cliente real. Las prácticas sintéticas no son aceptación de cliente.

**Acción:** consultas de solo lectura a Supabase, conector operativo del Site, GitHub y estado de respaldo; creación de este registro de evidencia. Sin cambios a producción ni nuevos disparadores. **Punto 4 permanece cerrado provisionalmente, sin certificación.**
