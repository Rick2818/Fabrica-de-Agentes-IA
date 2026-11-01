# Punto 4 — continuidad Supabase (2026-11-01 04:07 SV)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de solo lectura. No confundir con estación 4 ni issue #4. No se ejecutaron ticks manuales, no se tocaron cuotas, fechas, trabajos, producción, secretos, ni disparadores.

## Corte comprobado
- Hora DB: 2026-11-01 10:07:42 UTC (04:07:42 America/El_Salvador).
- Proyecto Supabase: `udispwzwrebjkanudcoy`. Único cron registrado: jobid=1, `fabrica-queue`, activo, `* * * * *`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **5,210** ejecuciones SQL `succeeded`; últimas 90 minutos: 90 `succeeded`. Éxito SQL NO prueba entrega funcional.
- `private.fabrica_scheduler_receipts`: **4,467** recibos, **4,461** verificados, **5** con `error_code=network_error` (históricos), **9** estados históricos `done`. En ventana de 90 minutos: 90 recibos, 89 verificados `idle`, cero `done`, un recibo reciente todavía sin conciliar al primer corte. No hay nuevas entregas demostradas.
- Conciliación verificada: ciclo `616c1df3-a76f-4a8f-945c-8d99b1459108`, programado 10:06:00 UTC, comprobado 10:07:00 UTC, HTTP 200, `verified=true`, `site_status=idle`.
- Ciclo posterior `d68d7a8e-59da-4a11-8483-06db123fea1c` (10:07:00 UTC): `idle` en `agent_status.health.supabase_runner` y `health.autonomy.last_scheduled_cycle`, pero **aún sin `checked_at` SQL al corte**. No marcar como verificado.
- Cero UUID de ciclo duplicados, cero `request_id` duplicados, cero recibos sin conciliación vencidos más de 3 minutos sin error.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`. La definición SQL utiliza advisory lock, `FOR UPDATE`, espera de recibo, pausa de cinco minutos tras error y `not_before`; **inspección estática**, no prueba dinámica de carrera/reintento.
- `agent_status` (conector Fábrica): 65 trabajos: **60 done, 2 failed históricos, 3 cancelled, 0 pendientes**; uso 0/20. Las seis prácticas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` siguen `done`, con recibos de ejecución analítica; no constituyen aprobación, fabricación ni entrega de agente real.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true` confirmado mediante Automations.peek; último resultado registrado `no_update`. No se ejecutó ni se modificó.
- Los **siete** YAML de `.github/workflows` fueron leídos en `main`: ninguno contiene trigger `schedule:`; `agent-runner.yml` conserva `workflow_dispatch`. Los workflows de prueba con `push`/`pull_request` no son cron.
- Logs Supabase (2026-11-01 04:00–10:08 UTC): 885 entradas `postgres_logs`, 18 `pgbouncer_logs`; filtro de `error`/`timeout` en `event_message` devolvió 0 registros, lo que no prueba ausencia de fallos fuera del filtro o período.
- `AGENTS.md` revisado en `main`: preservar Site, código fuente y separación; probar servidor con `scripts/test-agent.mjs`; no confundir programación con ejecuciones manuales.

## Alcance, evidencia anterior y pendientes
- Fuente nativa Site asociada a v53: commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas de servidor aprobadas **en ejecución anterior**, no repetidas ahora. No se pudo cotejar nativamente el SHA de fuente efectivamente desplegada en esta auditoría; no inferir que el commit de Sites sea un commit GitHub. Conservar v54 guardada sin desplegar y cualquier versión efectiva existente, sin cambiarla.
- Las notas del Site contienen información histórica de modelos/despliegues, pero no reemplazan una lectura nativa actual de la versión desplegada. No se activó versión alguna.
- Los modelos Gemini 2.5 Flash y 2.5 Flash Lite conservan pruebas históricas HTTP 404; tercera alternativa con prueba histórica HTTP 200. No se realizaron nuevas llamadas al modelo, ni se presume recuperación de primario/respaldo.
- Pendientes sin aprobación: cotejo nativo de fuente Site y despliegue; pruebas dinámicas aisladas de concurrencia, bloqueo, idempotencia, pausa, `not_before`, recuperación y fallback; causa original de cinco `network_error`; recibos E2E de aprobación/fabricación/entrega con aislamiento de cliente; aceptación final con cliente real.
- Sin regresión nueva demostrada ni acción correctiva segura requerida en este corte. Sin certificación. El ejecutor principal y respaldo quedan intactos.
