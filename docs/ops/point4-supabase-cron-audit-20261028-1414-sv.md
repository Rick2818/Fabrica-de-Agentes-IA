# Fábrica IA — Punto 4: auditoría Supabase Cron (28 oct 2026, 14:14 SV)

## Alcance y fuente
Proyecto Supabase `udispwzwrebjkanudcoy`, Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, repositorio `Rick2818/Fabrica-de-Agentes-IA`. Consultas de solo lectura a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, `net._http_response`, definición de funciones `private.fabrica_scheduler_*`, `agent_status` y archivos GitHub de `main`. No se llamó `fabrica_scheduler_tick` manualmente.

## Evidencia actual
- `cron.job`: **un solo** job activo `fabrica-queue` (jobid 1), `* * * * *`, comando `select private.fabrica_scheduler_tick();`. Al último muestreo `cron.job_run_details` registraba **57 ticks**, todos `succeeded`, último `2026-10-28 20:14:00Z`. Esto solo acredita la invocación SQL, no trabajo `done`.
- `private.fabrica_scheduler_receipts`: **un** ciclo HTTP `97d77278-26db-4069-ad2c-059b2fe6402e`, programado `2026-10-28 19:18:00.180Z`, `request_id=1`, HTTP 200, `verified=true`, `site_status=quota`, `error_code=null`, conciliado a `19:18:10.748Z`. El JSON de `net._http_response` contiene el mismo `run_id`, `schedule_id`, `scheduled_at`, `status=quota`, `pending=1`, `job_id=null`. **Cero** recibos `site_status=done` de este cron. El `verified` acredita correlación/estructura, no ejecución de un trabajo.
- `private.fabrica_scheduler_config`: `enabled=true`, `last_error=null`, `not_before=2026-10-29 07:01:00Z` (01:01 SV). La app informa cuota `20/20`; no alterar `not_before`, cuota ni fecha. `agent_status` muestra 6 tareas nuevas `queued` y 1 `waiting` por cuota; los seis ensayos sintéticos previos figuran `done`, pero no provienen de un `done` de Supabase Cron.
- Definición de `fabrica_scheduler_tick()`: usa `pg_try_advisory_xact_lock`, `FOR UPDATE`, barrera `checked_at is null`, `not_before` y UUID generado por petición. `fabrica_scheduler_reconcile()` contrasta fuente, proyecto, programación, UUID, marca temporal, estados y tiempo del recibo, y difiere en errores. **Inspección estática**, no prueba de carrera simultánea, recuperación real o persistencia E2E.
- El estado de `agent_status.health.autonomy` es `waiting` por cuota. La última ejecución histórica GitHub `schedule` que aparece en `health.cloud_runner` es anterior al cambio de principal y terminó en error; no usarla como evidencia del nuevo principal.
- Site original: `agent_status` registra publicación v52, pero no se obtuvo lectura del editor/fuente vigente ni prueba interactiva E2E: la conexión Browser exigió contexto del navegador de origen. No modificar el Site ni inferir certificación.

## Corrección segura realizada
Se eliminaron los disparadores `on.schedule` de los tres diagnósticos GitHub restantes, manteniendo `workflow_dispatch`, sin crear ejecutores:
- `.github/workflows/diagnostic-a-scheduler.yml` — commit [ff20c60](https://github.com/Rick2818/Fabrica-de-Agentes-IA/commit/ff20c60cb3de5d03db90daca99d5bce222864008)
- `.github/workflows/diagnostic-b-conditions.yml` — commit [16d5247](https://github.com/Rick2818/Fabrica-de-Agentes-IA/commit/16d5247aee94cdfd69e2f55217831c2b9c150e80)
- `.github/workflows/diagnostic-c-actor.yml` — commit [7e47480](https://github.com/Rick2818/Fabrica-de-Agentes-IA/commit/7e47480e2f97627879a1bb55f85d47fef6443ae8)

Se releyeron los seis workflows en `main`: **ninguno conserva `on.schedule`**. `agent-runner.yml` permanece `workflow_dispatch` únicamente; los dos workflows de pruebas mantienen sus eventos `push` y `workflow_dispatch`. La modificación no afectó el código del Site, las credenciales, la cola ni el job Supabase.

## Certificación
**NO CERTIFICADO**. El principal Supabase está instalado y su cron SQL se ejecuta; un ciclo autenticado llegó al Site y fue conciliado correctamente, pero retornó `quota`. No hay aún `done` real originado por este programador, ni prueba de exclusión mutua bajo concurrencia, recuperación E2E o idempotencia de entrega con trabajos reales. Verificar después de `not_before` y del restablecimiento natural de cuota, sin forzar un tick. Exigir `cron.job_run_details` + `private.fabrica_scheduler_receipts.verified=true` + `site_status=done` + recibo Site con mismo UUID y trabajo, y comprobar que no hay duplicados. La auditoría no activó pagos, mensajes externos, nuevos disparadores ni ejecutores.
