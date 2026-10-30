# Punto 4 — auditoría de continuidad (29-10-2026, 19:09–19:10 SV)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. La aceptación con cliente real sigue pendiente; los ensayos sintéticos no la sustituyen. Auditoría de solo lectura, sin ejecutar `tick`, alterar cuota, `not_before`, trabajos, credenciales, Site, versiones ni disparadores.

## Fuentes consultadas
- Supabase proyecto `udispwzwrebjkanudcoy`: consultas de solo lectura a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, `net._http_response`, `pg_get_functiondef` e índices.
- Complemento de la Fábrica: `agent_status` para trabajos, recibos y último ciclo; fuente nativa del Site **no leída directamente en este control**.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y contenido de los siete YAML de `.github/workflows` en `main`.

## Estado verificado
- `cron.job`: `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`.
- `cron.job_run_details`: **1792** ejecuciones del job, **1792** `succeeded`, última `2026-10-30 01:09:00.033822+00`. Esto acredita ejecución SQL del cron, **no** entrega `done`.
- `private.fabrica_scheduler_receipts`: **1071** ciclos/UUID únicos, **1069** `verified=true`, **9** `site_status=done` históricos, **1052** `idle`, 4 `waiting`, 2 `error`, 1 `quota`, 1 `busy` y 2 sin `site_status`. Cero UUID duplicados; índices únicos sobre `cycle_id` y `request_id`.
- Último ciclo SQL de la instantánea: `22e08401-bd4e-4163-80b8-1d420d7b6e8d` a `01:09 UTC` sin conciliar aún; el Site sí lo registra como `idle` en su lista de ciclos. El ciclo SQL anterior `412e2341-c2d8-4a5f-9e93-e45a518f4d46` está `verified=true`, HTTP 200 y `site_status=idle`; UUID correlacionado con Site. No hubo nueva entrega `done` en este corte.
- Site vía complemento: 65 trabajos: 60 `done`, 2 `failed` históricos, 3 `cancelled`; **0 pendientes**, sin leases activos en la instantánea; cuota **20/20**. Último ciclo de Site de `supabase-cron` reciente y `idle`. No se dispararon pruebas sintéticas nuevas ni se consumió cuota por esta auditoría.
- GitHub: siete YAML inspeccionados; ninguno tiene disparador `schedule`. `agent-runner.yml` usa `workflow_dispatch`; otros YAML usan `push`, `pull_request` o `workflow_dispatch` para CI, no como ejecutor programado de cola.
- `AGENTS.md` revisado: preservación del Site, separación de proyectos, evidencia antes de declarar funciones, nombres correctos de seis mascotas y límites de autonomía.

## Hallazgo nuevo: timeout y recuperación automática
- Ciclo `301f7d3c-d7d0-4d74-86de-072dc18f64f4`, programado **2026-10-30 00:38:00.034 UTC (18:38 SV)**, `request_id=1047`: `net._http_response.timed_out=true`, `error_msg=Timeout of 55000 ms reached`, sin HTTP status, `verified=false`, `error_code=network_error`, sin `site_status`. **No clasificar como entrega ni como ejecución fallida del trabajo**: el transporte no produjo recibo verificable; el resultado del lado Site de ese UUID es desconocido.
- `private.fabrica_scheduler_reconcile()` marca errores de transporte y establece `not_before` +5 minutos. No hay nuevos recibos entre 00:39 y 00:44 UTC; primer recibo posterior a **00:45 UTC**, ciclo `26d7280f-22c6-49e4-8a07-29a58248b63e`, HTTP 200, `verified=true`, `site_status=idle`. Los siguientes ciclos 00:46–00:49 UTC también son `idle` verificados. Configuración actual sin error ni diferimiento: **recuperación operativa observada**, no certificación formal de recuperación de trabajos en curso.
- No hay evidencia de duplicación de trabajo ni de pérdida en este corte, pero no puede descartarse un efecto de lado Site para el UUID con timeout sin recibo de ese ciclo. **No reintentar manualmente el UUID** ni fabricar un `done`.

## Antecedentes y pendientes
- Fuente nativa Site asociada a v53 recuperada previamente, commit `5be977154cc15c9511787d22e28b7367e6f00467`; 122 pruebas históricas aprobadas, no repetidas aquí. El Site conserva una nota de despliegue v58 con `deployment_status=succeeded`, pero este control no inspeccionó directamente el artefacto nativo desplegado ni comparó su hash. v54 no fue activada en este control.
- Las sondas sintéticas previas de Gemini 2.5 principal y respaldo devolvieron HTTP 404; tercera alternativa HTTP 200. Sin nuevas sondas por cuota 20/20; fallback real no certificado.
- Pendientes: correlación del ciclo de timeout con logs/recibo nativo completo del Site si se conserva; pruebas aisladas y seguras de concurrencia, pausas y recuperación de transporte; comparación fuente/despliegue nativo vigente; aceptación final con cliente real. No marcar pruebas pendientes como aprobadas.
- El respaldo horario de cola no fue invocado, detenido ni modificado. No se crearon ejecutores, programaciones, pagos, correos ni contactos.

**Decisión:** no modificar producción ante un timeout aislado con recuperación observada. Mantener monitoreo de regresiones y cierre provisional SIN CERTIFICACIÓN.
