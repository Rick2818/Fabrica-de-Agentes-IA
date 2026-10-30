# Fábrica de Agentes IA — Punto 4: auditoría de continuidad (2026-10-30, 06:12 El Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Sin cliente real para aceptación final. Auditoría de solo lectura; no se ejecutó tick manual, no se creó otro ejecutor ni se alteró producción, versiones, cuotas, trabajos, fechas o programación.

## Fuentes y corte
- Consultas directas Supabase del proyecto `udispwzwrebjkanudcoy`: `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, `net._http_response`, funciones e índices. Corte final: **2026-10-30 12:12:35 UTC**.
- Complemento nativo Fábrica `agent_status`: estado del Site, cola, cuota, UUID, ejecutor y pruebas sintéticas anteriores.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y siete workflows de `.github/workflows`, leídos individualmente desde `main`.
- Automations.peek de respaldo `6adbf94d28e8819189c0516c6068457a`.
- Supabase `query_logs` (2026-10-30 11:00–12:12 UTC): consulta exitosa esta vez; fuentes visibles `postgres_logs` y `pgbouncer_logs`. No aparecieron logs internos del Site en esa consulta. La consulta SQL inicialmente equivocada a `created_at` generó el mensaje PostgreSQL «column does not exist» a las 12:11:26 UTC; es un error de esta auditoría, corregido a `scheduled_at`, **no** una regresión del ejecutor.

## Hechos verificados
- Cron principal `fabrica-queue` jobid=1, activo, `* * * * *`, comando `select private.fabrica_scheduler_tick();`. Configuración `enabled=true`, `not_before=null`, `last_error=null`.
- **2,455 ejecuciones SQL `succeeded`**, cero con otro estado, hasta 12:12 UTC. SQL exitoso no demuestra una tarea `done`.
- **1,717 recibos** con UUID de ciclo y request_id únicos, **1,712 verificados**, cinco no verificados: cuatro `network_error` históricos y el ciclo de 12:12 UTC todavía en conciliación. **Cero** recibos sin `checked_at` de más de dos minutos.
- Distribución: `idle=1,695`, `done=9` históricos, `busy=1`, `error=2`, `quota=1`, `waiting=4`, `null=5`. Sin entregas `done` nuevas respecto al control 05:15.
- El UUID de 12:11 UTC `6149a91d-97f1-42ec-875b-f831b971e1ae` estaba aún sin conciliar en el primer corte SQL; el Site registró **`idle`** con ese UUID y fuente `supabase-cron`. En el corte final ya hay 1,712 recibos verificados, sin pendiente antiguo. No atribuir entrega a `idle`.
- Site: 65 trabajos, **60 `done` históricos**, dos `failed`, tres `cancelled`, cero pendientes; cuota **0/20**; `health.next_run_at=null`. Los 60 trabajos `done` del Site no son 60 recibos `done` de Supabase.
- Los cuatro UUID históricos con `network_error` permanecen: `301f7d3c-d7d0-4d74-86de-072dc18f64f4`, `e557300e-1fa9-4015-97f7-4d831ff2b450`, `4dd8d3fe-9de6-40e8-8af7-de813e230d1b`, `904c6e64-4e73-4aea-a569-a11ab7234cd1`. `net._http_response` ya no conserva filas para esos request_id en este control; los registros persistentes siguen sin recibo válido. No se detectó nuevo `network_error` en los últimos 65 minutos.
- Los índices únicos de `cycle_id` y `request_id` siguen presentes. Hashes SQL sin cambios: `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. Inspección de definición confirma `pg_try_advisory_xact_lock`, fila de configuración `FOR UPDATE`, conciliación por UUID y comprobación de recibo, `not_before`, espera por respuesta y backoff de cinco minutos. **No constituye pruebas aisladas de concurrencia, reintento o idempotencia.**
- Los **siete workflows** fueron leídos individualmente: ninguno tiene evento `schedule`. `agent-runner.yml` usa solo `workflow_dispatch`; otros usan `push` y/o `pull_request` para CI. Un historial antiguo de GitHub `schedule` en el Site no demuestra disparo actual.
- Respaldo horario `Respaldo de pendientes Fábrica IA` habilitado; último run visible `no_update` a 2026-10-30 11:25 UTC, sin evidencia de entrega. No se tocó ni ejecutó el respaldo desde esta auditoría.
- `AGENTS.md` vigente leído. Pruebas sintéticas de modelos **anteriores**, no repetidas: primario `gemini-2.5-flash` HTTP 404; backup `gemini-2.5-flash-lite` HTTP 404; tercero `gemini-3.5-flash-lite` HTTP 200. No se certificó fallback E2E ni se modificó proveedor.
- Fuente Site v53 previamente recuperada con SHA nativo `5be977154cc15c9511787d22e28b7367e6f00467` y 122 pruebas históricas. En este control **no se obtuvo acceso nativo de Sites para cotejar la versión efectivamente desplegada**; no se invalida la recuperación anterior. La versión 54 continúa sin activarse por esta auditoría.

## Pendientes
1. Correlacionar trazas internas del Site con los cuatro UUID de transporte y establecer causa; no equiparar timeout con fracaso de ejecución.
2. Pruebas seguras y aisladas de exclusión mutua, idempotencia, pausas, reintentos, recuperación y respeto de `not_before`, sin tocar cola ni cuota reales.
3. Prueba sintética E2E de fallback y `done` con recibo y UUID; no equivale a aceptación del cliente.
4. Acceso nativo a la versión del Site desplegada y comparación sin reemplazar su fuente.
5. Aceptación final con cliente real.

**Decisión:** no hay regresión nueva demostrada ni intervención de producción segura justificada. Mantener principal y respaldo activos. **Punto 4 CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.**
