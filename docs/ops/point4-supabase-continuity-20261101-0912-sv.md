# Fábrica de Agentes IA — Punto 4 · continuidad (2026-11-01 09:12 CST, El Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN (instrucción 29-10-2026). Auditoría de solo lectura; no ejecutar `private.fabrica_scheduler_tick()`, no crear segundo ejecutor, no modificar cuota, fechas, pedidos, producción ni versión 54.

## Identidad y alcance
- Site original: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`.
- Repositorio: `Rick2818/Fabrica-de-Agentes-IA`, `main`; `AGENTS.md` leído, exige preservar Site y distinguir programación de ejecución.
- Supabase: `udispwzwrebjkanudcoy`. Cron `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`.
- Configuración `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`.
- Respaldo ChatGPT `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`, último intento visible `no_update`, run `52e1a22b-646c-8322-92fb-fb145a771af2` (inicio 2026-11-01 14:20:51 UTC), sin `latest_result`; no inferir entrega ni `requires_user_action`.

## Lecturas y conciliación
- Corte SQL `2026-11-01T15:12:24Z`: `cron.job_run_details` **5,515 succeeded** (último runid 5515, 15:12 UTC); esto prueba ejecución de SQL, **no** trabajo funcional completado.
- `private.fabrica_scheduler_receipts`: **4,772** recibos, **4,766** `verified=true`, **5** `network_error` históricos (último 2026-10-31 14:57 UTC), **1** reciente sin conciliar, **0** sin conciliar con antigüedad mayor a tres minutos.
- **9** `site_status=done AND verified` históricos, **0** nuevos en últimos 90 minutos; **89** `idle AND verified` en esa ventana. Cero UUID duplicados y cero `request_id` duplicados. Índices únicos confirmados en `cycle_id` y `request_id`.
- Ciclo conciliado `9ea10f90-c6e6-42dd-ad3d-8cee6385644c`, 15:11 UTC, `http_status=200`, `verified=true`, `site_status=idle`; **no es entrega**.
- Ciclo `f4e329ae-a648-402e-8f86-21762bfa3421`, 15:12 UTC: `checked_at=NULL` al corte SQL. `agent_status` del Site mostró el mismo UUID y `source=supabase-cron`, `status=idle`, `pending=0`; no se atribuye verificación SQL hasta conciliarlo.
- Complemento Fábrica `agent_status`: 65 trabajos: **60 done**, **2 failed**, **3 cancelled**, **0 pendientes**; cuota **0/20**. Son tareas/prácticas, no 60 agentes fabricados. Seis prácticas sintéticas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` permanecen `done` con evidencias HTTP 200 y hashes, no aceptación de cliente ni E2E de fabricación/entrega.
- Logs unificados Supabase, ventana 2026-11-01 13:45–15:13 UTC: 210 eventos `postgres_logs`, 6 `pgbouncer_logs`, cero coincidencias `error/fatal/failed` en `event_message`; filtro textual limitado, no garantiza ausencia total de errores.

## Salvaguardas y limitaciones
- Se releyeron definiciones SQL: `pg_try_advisory_xact_lock`, `FOR UPDATE`, conciliación del HTTP por UUID/proveedor/fecha/estado, retención, pausas de cinco minutos ante fallo, `not_before` y `next_at`. **Inspección estática**, no prueba dinámica de concurrencia, fallo, idempotencia o recuperación.
- Los siete workflows `.github/workflows/*.yml` de `main` se leyeron individualmente: **ninguno** contiene evento `schedule`. `agent-runner.yml` mantiene `workflow_dispatch`.
- El complemento conserva nota de Site v58 desplegado el 29-10-2026, fuente `207466f651085ed04ec5ed0cc3cdc1628b17f3a6`, URL `agente-ricardo-revision-rick.rick271711.chatgpt.site`; la función SQL llama `agente-ricardo-revision-rick.glassybell1025.chatgpt.site/internal/runner`. **No se pudo cotejar por acceso nativo de Sites la versión efectivamente activa ni equivalencia de URL**. Respuestas válidas del endpoint no prueban equivalencia de despliegue. Fuente v53 recuperada commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas históricas aprobadas; no repetidas en este corte. No activar v54.
- Conexiones Gemini: primario y respaldo tienen comprobaciones históricas HTTP 404; tercero HTTP 200 con texto sintético, sin certificar recuperación integral. Sin nueva llamada de modelo.
- No se ejecutaron pruebas dinámicas nuevas: no hay ambiente aislado de Sites expuesto en este acceso; intento de clonar repositorio público desde contenedor falló por resolución DNS. Esto no implica imposibilidad de inspeccionar la fuente nativa del Site.
- Pendientes: cotejo nativo de despliegue/URLs; pruebas aisladas de locks, reintentos, idempotencia, pausas, `not_before`, recuperación y fallback; recibos E2E de fabricación, provisión y entrega con identidad/aislamiento; aceptación final con cliente real. **No declarar certificación**.

## Fuentes
Supabase SQL de solo lectura (`cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, `pg_proc`, `pg_indexes`), logs unificados, complemento `agent_status`, GitHub `AGENTS.md` y siete workflows, `Automations.peek` del respaldo. Sin cambios de runtime, datos, cron, versión o producción.
