# Fábrica de Agentes IA — Punto 4 · auditoría de continuidad (2026-11-01 08:12 CST, El Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN, según instrucción del 29-10-2026. Auditoría de solo lectura de Supabase, Site mediante el complemento de Fábrica, GitHub y programación de respaldo. No se ejecutó `private.fabrica_scheduler_tick()` manualmente ni se activó v54; no se tocaron trabajos, cuota, fechas, secretos, ejecutores, despliegues o datos de terceros.

## Identidad y alcance
- Site: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`.
- Supabase: `udispwzwrebjkanudcoy`, proyecto `Fábrica de Agentes IA`, estado `ACTIVE_HEALTHY`.
- Cron: jobid 1 `fabrica-queue`, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL` a 2026-11-01 14:10:55.916922 UTC.
- Respaldo ChatGPT `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`; último registro `no_update`, run `1d9a7a15-2c40-832b-be18-fab7953fef96`, `latest_result=null`. No inferir `requires_user_action` de resultado ausente.

## Datos contrastados
Lectura SQL a 2026-11-01 14:11:37.321339 UTC:
- `cron.job_run_details`: 5,454 `succeeded` (último `14:11 UTC`); esto **no** equivale a trabajo `done`.
- `private.fabrica_scheduler_receipts`: 4,711 recibos; 4,705 `verified=true`; nueve `site_status=done AND verified` históricos; cinco `network_error` históricos (30 y 31 octubre); uno pendiente reciente; cero pendientes de conciliación con antigüedad superior a tres minutos.
- 90 minutos anteriores al primer corte: 89 `idle` verificados y un recibo reciente sin conciliar; cero `done` nuevos.
- No hay UUID de ciclo duplicados ni `request_id` duplicados. Índices únicos confirmados en `cycle_id` y `request_id`.
- Último ciclo verificado al corte: `a85066ee-a726-40b5-b8c4-9fe52a1ac680`, `14:10 UTC`, `http_status=200`, `site_status=idle`. El siguiente `f4c3f19b-a125-4c51-ac21-76be371a5df5` estaba `idle` en el Site a `14:11 UTC` pero aún sin `checked_at` SQL al corte: **no se marca verificado**.
- El Site, consultado con `agent_status`, devuelve 65 trabajos: 60 `done`, 2 `failed`, 3 `cancelled`, cero pendientes; cuota diaria 0/20. Sus recibos `supabase_runner` contienen `source=supabase-cron` y UUID coincidentes. Los 60 `done` incluyen prácticas/texto históricos; no son 60 fabricaciones/entregas.
- Logs unificados de Supabase 12:00–14:12 UTC: 317 eventos `postgres_logs`, seis `pgbouncer_logs`; ninguna coincidencia textual `error`, `failed` o `fatal` en `event_message` en esa ventana. No equivale a ausencia universal de fallos.

## Salvaguardas verificadas estáticamente
- `private.fabrica_scheduler_tick`: `pg_try_advisory_xact_lock(1432658222,51)`, conciliación previa, `FOR UPDATE` de config, `enabled`, `not_before`, espera por recibo anterior, verificación de credenciales, UUID nuevo, HTTP post al runner, inserción de recibo.
- `private.fabrica_scheduler_reconcile`: valida `source`, `provider`, `project_id`, `schedule_id`, UUID, fecha y estado, y diferencia `done` de `idle`; impone pausa cinco minutos tras fallo y respeta `next_at`. Revisión de código SQL, **no** prueba dinámica de fallos, locks, pausas o idempotencia.
- Los siete archivos `.github/workflows/*.yml` actuales se leyeron individualmente en `main`: ninguno tiene evento `schedule`. `agent-runner.yml` conserva `workflow_dispatch`. Los otros workflows pueden tener `push`/`pull_request`; no son cron.
- `AGENTS.md` consultado: preservar Site existente, ejecutar pruebas sobre código fuente y distinguir programación de ejecución.

## Hallazgos y límites
- La nota persistente del complemento refiere un despliegue Site **v58** (29-10-2026) y URL `agente-ricardo-revision-rick.rick271711.chatgpt.site`; la función SQL activa apunta a `agente-ricardo-revision-rick.glassybell1025.chatgpt.site/internal/runner`. **No se verificó el despliegue efectivo ni si ambas URLs son aliases del mismo Site**; los recibos coincidentes muestran que el endpoint de cron devuelve respuestas válidas, pero no acreditan equivalencia de versión. Requiere cotejo por acceso nativo de Sites. La fuente v53 recuperada, commit `5be977154cc15c9511787d22e28b7367e6f00467`, y sus 122 pruebas de servidor son evidencia previa, no prueba repetida en este corte. No activar v54.
- Las pruebas de conexión históricas de modelos Gemini primario y secundario dieron HTTP 404; la tercera dio HTTP 200 con texto sintético. No se hizo nueva prueba con cuota.
- Falta prueba aislada y reproducible de concurrencia/lock, reintentos, `not_before`, idempotencia, recuperación y fallback; cotejo de fuente y versión nativa del Site; recibos de fabricación y entrega E2E con aislamiento por cliente; aceptación real final. No certificar ni usar resultados sintéticos como aceptación.
- Ningún cambio de runtime, despliegue, esquema, ejecución de cola o producción realizado. No hay regresión nueva demostrada en esta lectura.

## Fuentes y consultas
- Supabase SQL read-only: `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, `pg_proc/pg_get_functiondef`, `pg_indexes`.
- Complemento Fábrica: `agent_status`, campos `jobs`, `usage`, `health.autonomy`, `health.supabase_runner`, `notes`.
- GitHub: `AGENTS.md` y siete workflows en `main`.
- Automations: `peek` del respaldo horario.
