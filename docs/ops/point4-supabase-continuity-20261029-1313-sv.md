# Fábrica de Agentes IA — Punto 4 — control de continuidad 2026-10-29 13:13 SV

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** No hay cliente real para aceptación final. La ausencia de cliente no reabre el cierre administrativo. La presente es una auditoría de solo lectura; no se disparó tick, no se crearon tareas ni ejecutores, no se alteró cuota, fecha, cron, Site, locks, reintentos ni trabajo ajeno. Sin envíos, pagos o contacto a terceros.

Proyecto Site: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`. Supabase: `udispwzwrebjkanudcoy`. Repositorio: `Rick2818/Fabrica-de-Agentes-IA`.

## Supabase real — corte 2026-10-29 19:13:17 UTC / 13:13:17 SV
- `cron.job`: exactamente un `fabrica-queue`, jobid 1, activo, cada minuto (`* * * * *`), comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **1436** filas `succeeded`, sin otros estados observados; último inicio 19:13:00 UTC. Frente a 12:10 SV: **+64**. Un SQL `succeeded` no acredita un trabajo `done`.
- `private.fabrica_scheduler_receipts`: **721** filas, 721 UUID distintos en el corte previo inmediato (720/720; la fila nueva usa UUID distinto en respuesta Site), 720 `verified=true`, 1 `verified=false` reciente aún sin `checked_at`, 0 `error_code` no nulos. **9 `done` verificados históricos, sin nuevos `done`**. Distribución de los 720 verificados en la consulta previa de 19:12:28 UTC: 702 `idle`, 9 `done`, 4 `waiting`, 2 `error`, 1 `quota`, 1 `busy` (719 verificados en ese instante); un ciclo adicional `idle` fue conciliado antes de 19:13:17. Los estados `error`, `quota` y `busy` históricos no implican fallo actual de configuración; `verified=true` verifica el recibo, no que el trabajo terminó.
- Correlación de tres respuestas HTTP recientes (19:10–19:12 UTC): HTTP 200, `receipt.source=supabase-cron`, `receipt.supabase.run_id=cycle_id`, `receipt.status=run.status=idle`, sin `job_id`, y `site_status=idle` verificado. Ejemplo: ciclo `dfcfe0dd-6dc1-4b5f-a1b3-a8eb957a0c6a` (19:12 UTC), cotejado contra `net._http_response` y contra el Site. **No es entrega funcional**.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`. No se forzó diferimiento ni cuota.
- Funciones `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile` inspeccionadas: advisory transaction lock `(1432658222,51)`, `FOR UPDATE`, guardas de `enabled`, `not_before` y recibo sin conciliar, verificación de origen/proyecto/schedule/UUID/tiempos/estado/job_id, pausa de 5 minutos ante error y expiración de respuesta. Índices únicos de `cycle_id` y `request_id`; instantánea `pg_locks` sin advisory lock activo. Inspección estática, no prueba de concurrencia ni recuperación con fallo inyectado.
- Logs unificados consultados para 18:00–19:13 UTC: 179 `postgres_logs`, 3 `pgbouncer_logs`; entradas de arranque del cron cada minuto hasta 19:12 UTC. No se infiere salud funcional de mensajes de arranque.

## Site / continuidad de los seis agentes
- Complemento conectado `agent_status` leído directamente en esta ejecución. **65 trabajos**: 60 `done`, 2 `failed`, 3 `cancelled`; **0 pendientes** y **0 leases activos** en la instantánea. Dos `failed` son históricos: un plan del objetivo de pedidos con HTTP 503 tras 5 intentos y una práctica de registro sanitario con timeout tras 3 intentos. No se alteraron ni reintentaron. La cola vacía no certifica recuperación ante fallos.
- Cuota actual **17/20**, distinta del control previo (15/20); no se atribuye este consumo al cron ni a esta auditoría. `health.supabase_runner` indica ciclo reciente `idle`, `pending=0`, `source=supabase-cron`; UUID `6a8d6e28-bdc5-480b-8138-7c4edfa0baa1` a las 19:13 UTC, coincidente con el ciclo programado más reciente. La ejecución de `cloud_runner` que conserva `event=schedule` de GitHub es **histórica** y no demuestra disparador schedule vigente.
- Las nueve entregas `done` históricas de Supabase siguen verificadas; las prácticas de seis especialidades documentadas anteriormente no equivalen a aceptación de cliente. No se creó prueba sintética nueva ni se declaró aprobación/fabricación a partir del ejercicio textual del pedido #4.

## GitHub / respaldo / fuente
- `AGENTS.md` leído en `main`: preservar Site y datos, aislar especialidades y proyectos, exigir evidencia real para autonomía.
- **Siete** archivos YAML de workflow actualmente en `main`, no seis: `agent-runner`, tres diagnósticos, `factory-regression`, `training-regression`, `verify-training`. Los siete inspeccionados; **ninguno contiene evento `schedule`**. `factory-regression` es un workflow de pruebas por PR/manual, no un segundo ejecutor.
- Se observó merge de PR #10 en `main`, commit `8f238b189d0ecc4071a4dc2fab8dcc05c9e2be71` del 29-10 a las 18:27 UTC, con cambios de motor. Un merge de repositorio **no prueba despliegue del Site**.
- Respaldo horario `Respaldo de pendientes Fábrica IA` (`6adbf94d28e8819189c0516c6068457a`) verificado `is_enabled=true`; no se ejecutó desde esta auditoría ni se creó competidor.
- Se respeta el antecedente de recuperación de fuente nativa Site v53 y 122 pruebas de servidor aprobadas en su worktree, informado por el propietario. El SHA nativo `5be977154cc15c9511787d22e28b7367e6f00467` no está resoluble como commit de **este** repositorio GitHub (API 422), lo que no invalida su procedencia nativa Sites. No se reejecutaron las 122 pruebas, ni se inspeccionó en este control la fuente efectiva desplegada. La v54 permanece guardada sin desplegar según instrucción; no se activó.

## Pendientes — NO certificados
1. Contrastar por acceso nativo Sites el hash/versión realmente desplegado frente a la fuente v53 recuperada y la v54 guardada, sin sobrescribir el Site vigente.
2. Pruebas aisladas reproducibles de concurrencia, pausas/reanudación, lease vencido, reintento e idempotencia ante pérdida HTTP, sin alterar la cola real, cuotas ni `not_before`.
3. Prueba E2E sintética adicional **solo si** se dispone de aislamiento seguro, trazabilidad de UUID y cero competencia con el cron/respaldo; no fue realizada hoy.
4. Aceptación final con cliente real y sus recibos verificables, cuando exista y esté autorizada. No marcar pruebas pendientes como aprobadas.

**Dictamen:** sin regresión nueva confirmada en continuidad Supabase y Site durante este corte; sin intervención productiva necesaria. **Punto 4 cerrado provisionalmente, sin certificación**. Registro exclusivamente documental.
