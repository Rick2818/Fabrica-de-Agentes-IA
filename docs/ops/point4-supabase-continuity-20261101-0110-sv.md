# Fábrica de Agentes IA — Punto 4: continuidad, 2026-11-01 01:10 (El Salvador)

**Estado rector: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Auditoría de solo lectura. No se ejecutó tick manual, no se activó v54 ni se alteraron ejecutores, cuotas, fechas, trabajos, correos, pagos o producción.

## Corte directo y correlación

- Fuente: Supabase `udispwzwrebjkanudcoy` (proyecto `ACTIVE_HEALTHY`); consulta SQL a `2026-11-01T07:10:41.510357Z`.
- `cron.job`: `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **5,033** ejecuciones `succeeded`, cero fallidas; últimas 90 min: **90** ejecuciones `succeeded`. El último registro a `07:10:00.054105Z`. Esto acredita ejecución SQL, **no** entrega funcional.
- `private.fabrica_scheduler_receipts`: **4,290** recibos, **4,284** verificados, cinco errores históricos `network_error`, un ciclo reciente aún sin conciliación. Por estado: 4,267 `idle` verificados, 9 `done` históricos, 4 `waiting`, 2 `error`, 1 `quota`, 1 `busy`, 5 `network_error` no verificados y 1 no verificado sin error. Últimos 90 min: 89 `verified=true/site_status=idle`, cero `verified=true/site_status=done`. No se acreditó nueva entrega.
- Correlación de ciclo Site–SQL: `f324b193-e8c1-47ce-8975-0b129e0b927e`, `request_id=4291`, figura `idle` en Site a las 07:10 UTC, pero **todavía no estaba verificado en SQL** al corte. El ciclo anterior `dc5941ab-3e80-4ca8-a3b1-0d9e4d94200b` estaba conciliado con HTTP 200, `verified=true`, `site_status=idle`. No atribuir verificación al ciclo pendiente.
- Cero `cycle_id` duplicados, cero `request_id` duplicados, cero recibos no verificados sin error con antigüedad mayor a tres minutos. Índices únicos presentes sobre ambos campos.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. Inspección estática: `fabrica_scheduler_tick` contiene advisory lock, `FOR UPDATE` y `not_before`; `fabrica_scheduler_reconcile` contiene `not_before`. No se realizaron pruebas dinámicas de carreras, pausas o reintentos.
- Cinco errores históricos de transporte: request_id 1047, 1236, 1314, 1346, 3323. No hubo incremento respecto al corte anterior; causa raíz no acreditada.
- Logs unificados entre 05:10 y 07:11 UTC: 291 `postgres_logs`, 6 `pgbouncer_logs`. Filtro textual `error`/`timeout` en `postgres_logs` sin coincidencias; **no** prueba ausencia universal de errores.

## Site y seis agentes

- Complemento nativo de Fábrica (estado operativo): `automation.enabled=true`, ID `supabase:udispwzwrebjkanudcoy:fabrica-queue`, último ciclo `supabase_runner.status=idle`, cola de **65 trabajos**: 60 `done`, 2 `failed` históricos, 3 `cancelled`, cero pendientes; cuota `used=0/limit=20`.
- Las seis prácticas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` figuran `done` con evidencia de respuesta de texto. No son recibos E2E de aprobación, fabricación, aprovisionamiento ni entrega, y no son aceptación del cliente.
- Antecedentes de `gemini-2.5-flash` y `gemini-2.5-flash-lite` HTTP 404; el tercer modelo tuvo HTTP 200 histórico. **No** se verificó recuperación actual ni fallback completo.
- `AGENTS.md` leído en `main`; preservación del Site, identidad de los seis agentes y separación de ejecución manual/programada. Fuente Site v53 recuperada anteriormente en commit nativo `5be977154cc15c9511787d22e28b7367e6f00467` con 122 pruebas históricas aprobadas. En esta auditoría no se obtuvo la fuente **efectivamente desplegada** mediante acceso nativo de Sites para cotejar; no se repitieron las 122 pruebas. v54 sigue guardada sin despliegue.

## Disparadores y respaldo

- Los siete workflows actuales de `.github/workflows/` se leyeron individualmente en `main`: **ninguno** contiene disparador `schedule`. `agent-runner.yml` conserva `workflow_dispatch` manual.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`; último registro `no_update`, ejecutado 2026-11-01 06:49:53–06:49:54 UTC. No equivale a procesamiento nuevo. No se llamó `run_pending_tasks`.
- Repositorio `Rick2818/Fabrica-de-Agentes-IA` en `main` al inicio de la auditoría: `18d274176b2d3384bd77905776b0a9fc5bf44a20`.

## Pendientes sin aprobar

1. Cotejar por acceso nativo de Sites la fuente v53 con el código efectivamente desplegado, sin sustituir trabajo vigente.
2. Ejecutar **en aislamiento seguro**, no en la cola productiva, pruebas dinámicas de concurrencia/locks, idempotencia, pausa, recuperación, reintento y `not_before`, con recibos.
3. Diagnosticar la causa de los cinco errores históricos si se dispone de telemetría suficiente.
4. Probar de forma segura la disponibilidad actual de los dos modelos con HTTP 404 y el fallback real, sin evadir cuotas ni cambiar proveedores.
5. Obtener recibos E2E de aprobación, fabricación, aprovisionamiento y entrega; luego aceptación final con cliente real.

**Conclusión:** continuidad del cron y del Site observada sin regresión nueva demostrada. El punto 4 sigue **cerrado provisionalmente, sin certificación**. Las verificaciones pendientes no se consideran aprobadas.
