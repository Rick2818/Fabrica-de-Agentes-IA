# Fábrica IA — Punto 4: control de continuidad (28 oct 2026, 15:12 SV)

## Alcance y método
Auditoría de solo lectura del proyecto Supabase `udispwzwrebjkanudcoy`, `agent_status` del complemento Fábrica, `AGENTS.md`, seis workflows GitHub `main` y el informe anterior de las 14:14 SV. Sin ejecutar `private.fabrica_scheduler_tick()` manualmente, sin alterar cuota, fechas, credenciales, Site, tareas ni disparadores.

## Evidencia nueva
- `cron.job`: **un solo job activo**, id 1, `fabrica-queue`, expresión `* * * * *`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **114 invocaciones**, **0 failed**, último `runid=114`, `2026-10-28 21:11:00Z` (15:11 SV), `succeeded`. Comparación con el informe previo: 57 invocaciones adicionales. `succeeded` indica ejecución SQL, no entrega de trabajo.
- `private.fabrica_scheduler_receipts`: **un solo recibo**, ciclo `97d77278-26db-4069-ad2c-059b2fe6402e`, `scheduled_at=2026-10-28 19:18:00.180Z`, `request_id=1`, `http_status=200`, `verified=true`, `site_status=quota`, `error_code=null`. El `run_id` del JSON `net._http_response` coincide exactamente, y `receipt.supabase.schedule_id=supabase:udispwzwrebjkanudcoy:fabrica-queue`. El JSON indica `run.status=quota`, `receipt.job_id=null`. **0 recibos `verified=true` y `site_status=done`**; **0 recibos sin conciliar**.
- `private.fabrica_scheduler_config`: `enabled=true`, `last_error=null`, `not_before=2026-10-29 07:01:00Z` (01:01 SV). El muestreo SQL a `2026-10-28 21:12:29Z` confirma que todavía no venció el diferimiento.
- `agent_status`: `usage.used=20`, `limit=20`; autonomía `waiting`; **6 jobs queued**, **1 waiting** (objetivo E2E diferido hasta 01:01 SV). El tablero también contiene 50 trabajos `done` históricos, 2 `failed` y 3 `cancelled`; estos no acreditan `done` originado por Supabase Cron.
- Inspección de `pg_get_functiondef(private.fabrica_scheduler_tick/reconcile)`: existe `pg_try_advisory_xact_lock`, `FOR UPDATE`, barrera de recibo pendiente, verificación de identidad y UUID, validación del estado, tratamiento de errores y respeto a `not_before`. Son garantías **observadas en código**, no pruebas de carrera, fallo recuperado o entrega E2E.
- Se releyeron los seis archivos de `.github/workflows/` en `main`: `agent-runner.yml` y diagnósticos A/B/C solo `workflow_dispatch`; `training-regression.yml` y `verify-training.yml` tienen `push`/`workflow_dispatch`. **Ninguno tiene `schedule`**.
- El Site original sigue identificado por `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, pero en este control no se obtuvo acceso al código fuente vigente de Sites ni prueba interactiva E2E. No se reemplazó ni publicó nada.

## Evaluación
**NO CERTIFICADO / diferido por cuota.** Se confirma continuidad de invocaciones SQL y correlación correcta de la única respuesta HTTP, pero no hay una entrega `done` causada por el programador principal. El número creciente de ticks sin nuevas peticiones es coherente con `not_before`, no evidencia por sí mismo fallo ni recuperación. No se fuerza un ciclo para producir una aparente certificación.

## Próximo control sin intervención manual
Después del restablecimiento natural de cuota a las **01:01 SV del 29 oct**, verificar secuencialmente: (1) `cron.job_run_details` con tick programado, (2) nuevo `private.fabrica_scheduler_receipts` verificado con `site_status=done`, (3) mismo UUID en recibo JSON del Site y `job_id` no nulo, (4) job correspondiente `done` con evidencia y sin duplicación, (5) recuperación/locks/pausa/reintentos probados bajo condiciones seguras, (6) Site original E2E. Un `quota`, `busy`, `waiting`, `HTTP 200` o `cron succeeded` aislado no cumple el criterio.
