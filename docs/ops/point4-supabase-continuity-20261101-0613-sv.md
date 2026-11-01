# Fábrica de Agentes IA — Punto 4 — Control 2026-11-01 06:13 (El Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Este control es de solo lectura salvo la escritura de este informe; no representa aceptación del cliente ni certificación de autonomía, fabricación o entrega.

## Fuentes consultadas directamente
- Supabase proyecto `udispwzwrebjkanudcoy`: `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, `pg_proc`, `pg_indexes`, y registros unificados de PostgreSQL.
- Complemento nativo Fábrica IA: `agent_status` (estado de cola, salud, ciclo Supabase, modelos, objetivos y cuota).
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y contenido de los siete archivos de `.github/workflows/` en `main`.
- Automatización existente «Respaldo de pendientes Fábrica IA»: consulta de estado, sin ejecutar ni modificar.

## Hechos comprobados
- `cron.job`: un job `fabrica-queue`, jobid=1, activo, programación `* * * * *`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: 5,335 ejecuciones `succeeded` y 0 con otro estado, al corte; `succeeded` acredita SQL, no ejecución de trabajo `done`.
- `private.fabrica_scheduler_receipts`: 4,592 recibos, 4,586 `verified=true`, 5 `network_error` históricos y 9 `site_status=done` históricos. El último intervalo de 90 minutos tiene 90 recibos, 89 verificados, 0 `done`. Las diferencias acumuladas entre SQL y recibos no se interpretan como entregas.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`; sin pausa activa al corte.
- Ciclo `2a4dae77-a67d-497d-ba1d-3e1970c1e00e`, programado 12:11 UTC: `request_id=4592`, HTTP 200, `verified=true`, `site_status=idle`, conciliado a las 12:12 UTC. No procesó una entrega.
- Ciclo `96dd209b-613a-4de2-b586-90054b231412`, programado 12:12 UTC: el Site reporta `source=supabase-cron`, `status=idle` y el mismo UUID; en lectura SQL simultánea todavía tenía `checked_at=null` y `verified=false`. **Pendiente de conciliación al corte**, no aprobado.
- 0 UUID duplicados, 0 `request_id` duplicados y 0 recibos sin verificar vencidos >3 minutos sin error; índices únicos sobre `cycle_id` y `request_id` presentes.
- Funciones SQL: `pg_try_advisory_xact_lock`, bloqueo de fila, conciliación de recibos por UUID, verificación de campos de origen y tiempo, `not_before` para diferidos y pausa de cinco minutos tras errores. Inspección estática; no se realizaron pruebas dinámicas de concurrencia o recuperación.
- Complemento Site: 65 trabajos (60 `done`, 2 `failed`, 3 `cancelled`), 0 pendientes; cuota usada 0 de 20; último ciclo Supabase `idle`. Estos `done` de cola son trabajos históricos y no equivalen a pedidos fabricados y entregados.
- Modelos: pruebas sintéticas históricas primario `gemini-2.5-flash` HTTP 404, respaldo `gemini-2.5-flash-lite` HTTP 404, tercero `gemini-3.5-flash-lite` HTTP 200. No hay nueva prueba ni recuperación acreditada de los dos primeros.
- GitHub: siete workflows inspeccionados. `agent-runner.yml` solo `workflow_dispatch`; ninguno contiene `schedule`. Los demás usan disparadores manuales, `push` o `pull_request`, no cron.
- Automatización «Respaldo de pendientes Fábrica IA»: `is_enabled=true`; último registro consultado con `recorded_status=no_update` y `last_run_time=2026-11-01T11:07:33Z`. No demuestra que haya procesado un trabajo; no se alteró.
- `AGENTS.md` exige conservar Site, validar el código fuente antes de cambios y no confundir ejecuciones manuales con programadas.

## Brechas y límites
1. Falta cotejar **mediante acceso nativo a Sites** el artefacto desplegado con la fuente original v53 recuperada (commit de referencia `5be977154cc15c9511787d22e28b7367e6f00467`; 122 pruebas históricas), sin asumir que el commit pertenece a GitHub. Esta sesión dispone del estado operativo del complemento, pero no de un editor/lector nativo de fuente y versiones de Sites. No se puede afirmar la versión efectivamente publicada ni resolver las referencias históricas a v54/v58.
2. Pruebas dinámicas seguras, aisladas y todavía pendientes: concurrencia, lease/lock, reintentos, idempotencia, pausas, recuperación, fallback y continuidad entre los seis agentes. La inspección SQL no las certifica.
3. No hay recibos E2E suficientes de aprobación, fabricación, aprovisionamiento de cabina y entrega; las prácticas sintéticas previas no son aceptación de cliente.
4. Los cinco errores históricos de red no tienen causa raíz demostrada. No se alteró cuota ni `not_before` para fabricar éxito.
5. Falta cliente real para aceptación final. Se conserva el cierre administrativo provisional.

## Cambios y prohibiciones observadas
- Ningún tick manual, nuevo ejecutor, trigger, despliegue, versión, envío, pago, modificación de trabajo, cuota, fechas o secretos.
- No se activó la versión 54; tampoco se cambió el código vigente ni se usó una copia anterior.
- Única escritura: este documento de evidencia operativa.
