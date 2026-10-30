# Fábrica de Agentes IA — Punto 4: auditoría de continuidad (2026-10-30, 05:15 El Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Sin aceptación de cliente real. Revisión de solo lectura, sin tick forzado, sin cambios de producción, Site, cuotas, fechas, tareas, permisos ni ejecutores.

## Fuentes y corte
- Supabase proyecto `udispwzwrebjkanudcoy`: consultas SQL directas de `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, `net._http_response` e índices/definiciones SQL. Cortes 2026-10-30 11:14–11:15 UTC.
- Complemento nativo de Fábrica `agent_status`, incluida salud del ejecutor, UUID, cola, cuota y comprobaciones sintéticas de modelos.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y los siete workflows leídos individualmente en `main`.
- Automations.peek del respaldo `6adbf94d28e8819189c0516c6068457a`.
- Consulta de logs unificados Supabase falló dos veces con error interno del servicio; no se puede afirmar ausencia de eventos en ese canal.

## Hechos verificados
- `cron.job`: `fabrica-queue`, jobid 1, `active=true`, `* * * * *`, comando `select private.fabrica_scheduler_tick();`. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`.
- 2,397 registros SQL `succeeded` al corte de 11:14 UTC, 0 fallidos. SQL exitoso **no prueba** una entrega.
- 1,660 recibos y 1,660 UUID de ciclo y request_id distintos en segundo corte; 1,655 `verified=true`, cinco sin verificar (cuatro errores históricos y un ciclo reciente aún en conciliación). No hay recibos sin `checked_at` con más de dos minutos.
- Distribución de `site_status` en segundo corte: `idle=1,638`, `done=9` (históricos), `busy=1`, `error=2`, `quota=1`, `waiting=4`, `null=5`. No hay nuevas entregas `done` respecto al control anterior.
- UUID `a5ce4ea0-509f-4dea-919c-9d5b09e8d268`, ciclo 11:14 UTC, observado por Site como `idle` con `source=supabase-cron`; inicialmente no verificado en SQL, no marcarlo aprobado hasta conciliación. El ciclo 11:13 UTC `e2bfe7c4-c903-413c-8eb0-2f6089116acb` sí tuvo HTTP 200, `verified=true`, `site_status=idle`. Ambos son actividad, no entregas.
- Cuatro `network_error` históricos: `301f7d3c-d7d0-4d74-86de-072dc18f64f4` (00:38 UTC), `e557300e-1fa9-4015-97f7-4d831ff2b450` (03:53 UTC), `4dd8d3fe-9de6-40e8-8af7-de813e230d1b` (05:17 UTC), `904c6e64-4e73-4aea-a569-a11ab7234cd1` (05:54 UTC). Para los dos últimos, `net._http_response` confirma `timed_out=true`, 55,000 ms; los dos anteriores ya no conservan respuesta `net`. No atribuirles trabajo `done` ni causa interna del Site.
- Site: 65 trabajos totales: 60 `done`, 2 `failed`, 3 `cancelled`, cero pendientes; cuota 0/20, `health.next_run_at=null`. Los 60 `done` son histórico del tablero, no 60 entregas Supabase.
- Índices únicos `cycle_id` y `request_id` presentes. Funciones sin variación respecto al control anterior: `fabrica_scheduler_tick` MD5 `7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile` MD5 `78a1057460b103ae1cddfb5d5e0339f0`. Lectura confirma advisory lock, conciliación, `not_before` y backoff de cinco minutos; no constituye prueba de concurrencia/reintento aislada.
- Los siete workflows no contienen disparador `schedule`. `agent-runner.yml` es manual; otros incluyen `push`/`pull_request` según su función.
- Respaldo horario habilitado; último run registrado `no_update`, sin evidencia de entrega. No se creó segundo ejecutor.
- AGENTS.md consultado en `main`.
- Comprobaciones sintéticas previas del Site: primario `gemini-2.5-flash` HTTP 404 (`verified=false`), backup `gemini-2.5-flash-lite` HTTP 404 (`verified=false`), tercero `gemini-3.5-flash-lite` HTTP 200 (`verified=true`). El tablero lista únicamente al tercero como disponible. Es evidencia de prueba sintética previa, **no** una prueba nueva ni certificación del fallback en una tarea real.
- La fuente nativa del Site v53 se documentó previamente como recuperada (`5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas). Ese SHA no es resoluble como commit del repositorio GitHub indicado (422); no invalida la recuperación nativa del Site ni acredita despliegue vigente. No se realizó comparación nativa del Site en este control; v54 no se activó.

## Pendientes y decisión
1. Correlación nativa de los cuatro UUID con trazas internas del Site; diagnóstico causal de los timeouts, diferenciando timeout de transporte de procesamiento efectivo.
2. Pruebas aisladas de exclusión mutua, reintentos, idempotencia, pausa, `not_before`, conciliación y recuperación, sin consumir cuota ni tocar la cola real.
3. Prueba E2E sintética segura que acredite fallback real y entrega de tarea, separada de aceptación de cliente; investigar dos modelos 404 sin cambiarlos ni activarlos sin autorización.
4. Acceso nativo a fuente y versión efectivamente desplegada del Site; cotejar con v53 y la versión guardada sin desplegar.
5. Aceptación final con cliente real.

**Decisión:** no se observó regresión nueva ni intervención segura necesaria sobre producción. Mantener principal y respaldo habilitados. Punto 4 CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.
