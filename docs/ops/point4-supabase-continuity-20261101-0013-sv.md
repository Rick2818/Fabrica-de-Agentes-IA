# Fábrica de Agentes IA — Punto 4: continuidad, 2026-11-01 00:13 (El Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de solo lectura; no ejecutar tick manual, no activar v54, no tocar trabajos, cuotas, correos, pagos, producción ni otros proyectos.

## Corte verificable

- Fuente: Supabase proyecto `udispwzwrebjkanudcoy`, consultas SQL directas, corte `2026-11-01T06:13:07.693807Z`.
- `cron.job`: jobid=1, `fabrica-queue`, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: 4,976 ejecuciones `succeeded` de ese job. En la ventana anterior de 90 minutos, 90 ejecuciones `succeeded`; esto confirma ejecución SQL, no entregas.
- `private.fabrica_scheduler_receipts`: 4,233 recibos, 4,227 `verified=true`, cinco `network_error` históricos. Por estados al corte intermedio: 4,209 `idle`, 9 `done`, 4 `waiting`, 2 `error`, 1 `quota`, 1 `busy` verificados; 5 `network_error` y 1 ciclo aún sin conciliación. El total aumentó un ciclo entre cortes; no mezclar las instantáneas.
- Último ciclo registrado en el corte final: `8d60c481-f15f-46ba-ae49-86bd6aa72ca7`. Último estado verificado `idle`; no atribuir este estado al ciclo todavía no conciliado. `overdue_unchecked` (>3 min): 0.
- Integridad: cero duplicados de `cycle_id` y `request_id`; existen índices únicos para ambos. Últimos 90 minutos: 90 recibos `verified=true/site_status=idle`, cero `verified=true/site_status=done`.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. Las funciones `fabrica_scheduler_tick` y `fabrica_scheduler_reconcile` contienen advisory lock, `FOR UPDATE`, comprobación de recibo/UUID, espera de recibos pendientes, manejo de `not_before` y backoff; **revisión estática**, no prueba dinámica de carreras.
- Cinco errores de transporte: los request_id 1047, 1236, 1314, 1346 y 3323 ya no tienen respuesta recuperable en `net._http_response`; causa raíz no demostrada. Sin incremento frente al control anterior.
- Logs unificados, ventana 2026-11-01T04:00:00Z a 06:14:00Z: 321 entradas `postgres_logs` y 6 `pgbouncer_logs`; filtro de `error`/`timeout` en `postgres_logs` no devolvió resultados. No equivale a ausencia universal de errores.

## Site y agentes

- Lectura mediante complemento Fábrica: `automation.enabled=true`, ID `supabase:udispwzwrebjkanudcoy:fabrica-queue`, `health.supabase_runner.status=idle` y ciclo Site `27e7f81f-3199-417f-b48c-397bc2d272e8` registrado como `idle` a las 06:12 UTC. Este ciclo estaba sin conciliación SQL en la lectura simultánea; no declararlo `verified` por el solo recibo del Site.
- Cola: 65 trabajos; 60 `done`, 2 `failed` históricos, 3 `cancelled`, 0 pendientes. Sin leases activos en los trabajos; cuota `used=0/limit=20`. No hubo entrega nueva.
- Seis ejercicios sintéticos `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}`: todos `done` con evidencia de respuesta de texto; **no** acreditan aprobación, fabricación, entrega E2E ni aceptación del cliente.
- Chequeos históricos de modelos: `gemini-2.5-flash` y `gemini-2.5-flash-lite` devolvieron HTTP 404; no hay nueva prueba que demuestre recuperación. El modelo terciario tuvo una comprobación histórica HTTP 200, que no prueba el fallback completo.
- AGENTS.md leído en `main`; exige preservar Site/datos y separar pruebas manuales de ejecuciones programadas. La fuente nativa del Site v53 fue recuperada previamente en commit `5be977154cc15c9511787d22e28b7367e6f00467` y 122 pruebas históricas pasaron. **No se obtuvo en esta auditoría acceso nativo a la versión efectivamente desplegada para cotejo**, y no se repitieron esas pruebas. v54 guardada, no desplegada.

## Disparadores y respaldo

- Los siete archivos actuales en `.github/workflows/` se leyeron individualmente en `main`: ninguno tiene clave de evento `schedule`. El ejecutor GitHub `agent-runner.yml` conserva `workflow_dispatch` manual.
- La automatización de respaldo `6adbf94d28e8819189c0516c6068457a` continúa `is_enabled=true`. Su último registro era `no_update`; esto **no** acredita un procesamiento nuevo. No se invocó `run_pending_tasks` desde esta auditoría.
- No se creó ni alteró ejecutor, cron, disparador, versión, trabajo o cuota.

## Pendientes sin aprobar

1. Cotejo **nativo** del código realmente desplegado del Site contra fuente v53, preservando trabajo ajeno.
2. Pruebas dinámicas **aisladas** de lock/concurrencia, reintento, idempotencia, pausa, recuperación y `not_before`, con recibos verificables, sin alterar el cron productivo.
3. Diagnóstico causal de los cinco `network_error` históricos si se recupera telemetría suficiente; sin inventar causa.
4. Comprobación real y segura de los dos modelos con HTTP 404 y de fallback, sin evadir cuota ni cambiar proveedores.
5. Recibos E2E de aprobación, fabricación, aprovisionamiento y entrega; posteriormente aceptación de un cliente real. Mantener separados ejercicios sintéticos y certificación.

**Conclusión:** sin regresión nueva demostrada en este corte; punto 4 permanece cerrado provisionalmente, sin certificación.
