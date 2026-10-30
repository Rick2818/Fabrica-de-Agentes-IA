# Fábrica de Agentes IA — Punto 4 · control de continuidad

**Corte:** 2026-10-30 03:06:31 America/El_Salvador (2026-10-30T09:06:31Z).  
**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Sin cliente real para aceptación final.  
**Ámbito:** Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, Supabase `udispwzwrebjkanudcoy`, GitHub `Rick2818/Fabrica-de-Agentes-IA`. Solo auditoría de lectura; sin activar código ni crear ejecuciones.

## Evidencia directa
- `cron.job`: exactamente una entrada `fabrica-queue` (jobid=1), activa, `* * * * *`. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`.
- `cron.job_run_details`: 2,269 ejecuciones SQL, 2,269 `succeeded`, ninguna fallida; última a 2026-10-30T09:06:00Z. **El éxito SQL solo indica ejecución de la función, no trabajo terminado.**
- `private.fabrica_scheduler_receipts`: 1,531 recibos, 1,531 UUID de ciclo distintos, 1,526 `verified=true`, cinco sin verificar. Nueve `site_status=done` históricos, sin nuevos `done` respecto al control anterior; 1,509 `idle` al corte. Cuatro `network_error` no verificados y un ciclo reciente aún pendiente de conciliación.
- Incidentes de transporte sin recibo de entrega: `301f7d3c-d7d0-4d74-86de-072dc18f64f4` (2026-10-30T00:38Z), `e557300e-1fa9-4015-97f7-4d831ff2b450` (03:53Z), `4dd8d3fe-9de6-40e8-8af7-de813e230d1b` (05:17Z), `904c6e64-4e73-4aea-a569-a11ab7234cd1` (05:54Z). Sin nuevos incidentes desde el corte anterior.
- Ciclo `771f69d1-abad-4b34-84e5-ecece2d7df4d` (09:06Z): `private.fabrica_scheduler_receipts` todavía `verified=false` en el corte; `agent_status.health.supabase_runner` y `health.autonomy.primary.last_cycle` muestran ese mismo UUID, `source=supabase-cron`, `status=idle`. Reconciliación SQL todavía pendiente al corte, no `done`.
- Complemento nativo `agent_status`: 65 trabajos históricos (60 `done`, dos `failed`, tres `cancelled`), **cero pendientes**; uso diario 0/20. `health.autonomy.stalled=false`; `health.autonomy.primary.recent=true`; `health.supabase_runner.status=idle`.
- Índices únicos verificados en SQL: `fabrica_scheduler_receipts_pkey(cycle_id)`, `fabrica_scheduler_receipts_request_id_key(request_id)`. Hashes de funciones SQL (lectura, sin ejecución): `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`, `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. Esto prueba presencia de restricciones, **no** pruebas formales de concurrencia ni idempotencia E2E.
- `AGENTS.md` leído de `main` (blob `9cc3c0f8d3ae365f0802145b2d279839d7a8e4e2`): preservar Site, datos, audiencia, runtime y pruebas; no declarar autonomía o paridad sin evidencia.
- Los siete archivos de `.github/workflows/` leídos individualmente en `main`: ninguno tiene `on.schedule`; `agent-runner.yml` solo `workflow_dispatch`; otros disparadores `push`/`pull_request` son CI, no programación del ejecutor.
- Respaldo ChatGPT `6adbf94d28e8819189c0516c6068457a`: habilitado; último intento registrado `no_update` (`57b481c8-50e0-832a-b739-a51a05407547`), no prueba procesamiento. Sin alteraciones.
- Pruebas de modelos guardadas en Site (anteriores, sintéticas): Gemini `2.5-flash` HTTP 404, `2.5-flash-lite` HTTP 404, `3.5-flash-lite` HTTP 200. Fallback real ante fallo de proveedor **no certificado**. No se consumió cuota en esta auditoría.
- Logs Supabase de `edge_logs`, `function_edge_logs` y `function_logs` consultados: no proporcionan evidencia concluyente de causa de los cuatro `network_error` del programador. No inferir causa a partir de ausencia de entradas.
- El Site contiene una nota de despliegue `v58` con estado `succeeded`, pero **no** se verificó el hash de producción mediante acceso nativo al código/despliegue en esta pasada. La fuente recuperada v53 (`5be977154cc15c9511787d22e28b7367e6f00467`) y sus 122 pruebas históricas no prueban por sí solas paridad con la versión vigente. No activar v54 ni reemplazar fuente.

## Pendiente para validación
1. Inspección nativa del hash efectivamente desplegado, sin alterar versión ni audiencia.
2. Pruebas aisladas y no competitivas de locks, idempotencia, reintentos, pausas y recuperación ante timeouts, con UUID y recibos correlacionados; las funciones/índices presentes no bastan.
3. Diagnóstico causal de los cuatro `network_error` y conciliación de sus resultados sin inventar entregas.
4. Prueba real controlada del fallback de modelos y recorrido E2E para seis agentes, sin agotar cuota ni enviar mensajes/pagos reales.
5. Aceptación final con cliente real, inexistente todavía; no reabrir por esa ausencia.

**Decisión:** Sin cambios de producción, cron, Site, cuota, fechas, trabajos, disparadores ni respaldo. Punto 4 continúa cerrado provisionalmente, sin certificación.
