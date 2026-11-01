# Fábrica de Agentes IA — Punto 4: continuidad (31-10-2026, 23:14 SV)

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** No reabrir por falta de cliente real. Esta auditoría no equivale a aceptación ni a certificación; no activó v54 ni modificó el Site, trabajos, cuotas, cron, correos o pagos.

## Fuentes consultadas directamente
- Supabase proyecto `udispwzwrebjkanudcoy`: `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, `pg_indexes`, definición SQL de `private.fabrica_scheduler_tick()` y `private.fabrica_scheduler_reconcile()`, logs PostgreSQL.
- MCP de la Fábrica: `agent_status`, salud del ejecutor y ciclos con UUID.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y los siete YAML vigentes en `.github/workflows`.
- Automatización existente `Respaldo de pendientes Fábrica IA`: lectura de estado, sin ejecutarla ni cambiarla.

## Corte comprobado: 2026-11-01 05:14:42 UTC (31-10 23:14:42 SV)
- Supabase project: `ACTIVE_HEALTHY`.
- Cron job 1 `fabrica-queue`: `active=true`, expresión `* * * * *`, comando `select private.fabrica_scheduler_tick();`. 4,917 ejecuciones SQL `succeeded`; 0 SQL de otro estado. **SQL succeeded no prueba procesamiento de trabajo**.
- 4,174 recibos, 4,168 con `verified=true`, cinco `network_error` históricos y uno de conciliación pendiente dentro de ventana; **cero pendientes vencidos más de tres minutos**. 4,174 UUID únicos y 4,174 `request_id` únicos en el corte anterior de 4,173; índices únicos sobre ambos campos presentes.
- Último ciclo conciliado: `fdc758a4-da76-49ad-81a8-42f2714ecf84` (05:13 UTC), `verified=true`, `site_status=idle`, HTTP 200. No representa `done` ni entrega nueva.
- Distribución inmediatamente antes del corte: 4,150 `idle`, 9 `done` históricos, 4 `waiting`, 2 `error`, 1 `quota`, 1 `busy`, 5 `network_error` y 1 sin conciliar. No inferir entregas actuales.
- Configuración: `enabled=true`, `not_before=null`, `last_error=null`. El SQL utiliza advisory transaction lock, `FOR UPDATE`, barrera de recibos pendientes, `not_before`, reconciliación con `run_id`/UUID, verificación de procedencia y de estado, pausa de cinco minutos ante error, y retención de siete días. Inspección **estática**, no prueba dinámica de concurrencia/reintentos.
- Site MCP: 65 trabajos, 60 `done`, 2 `failed`, 3 `cancelled`, 0 pendientes; cuota 0/20. La salud declara un ciclo reciente `source=supabase-cron` con estado `idle`. No hubo nueva entrega comprobada.
- Respaldo horario: automatización `6adbf94d28e8819189c0516c6068457a` `is_enabled=true`; última ejecución registrada 2026-11-01 04:16:07 UTC con `no_update`. Estar habilitada no demuestra procesamiento reciente; no se modificó.
- GitHub: los siete workflows (`agent-runner`, `diagnostic-a-scheduler`, `diagnostic-b-conditions`, `diagnostic-c-actor`, `factory-regression`, `training-regression`, `verify-training`) fueron leídos individualmente. **Ninguno contiene `schedule`**; sí existen triggers manuales y de push/PR según el archivo.
- Logs Supabase 2026-10-31 23:00 a 2026-11-01 05:14 UTC: 903 eventos `postgres_logs` y 18 `pgbouncer_logs`; una línea `syntax error at or near "hour"` a las 01:08:28 UTC. No se atribuye al ejecutor cron sin correlación. Cinco errores históricos de transporte siguen sin causa demostrada.
- Modelos según salud del Site: `gemini-2.5-flash` y `gemini-2.5-flash-lite` con últimas comprobaciones sintéticas HTTP 404, no recuperados; `gemini-3.5-flash-lite` con comprobación sintética HTTP 200. No equivale a fallback E2E probado.
- `AGENTS.md` actual asigna Leo/Ventas, Mila/Servicio, Vera/Finanzas, Alma/Química-Farmacia, Nico/Logística y Lía/Mercadeo. Algunos resultados sintéticos históricos del Site usan otras etiquetas de Alma/Lía: requieren cotejo con perfiles efectivamente desplegados; no editar recibos históricos.

## Límites y pendientes sin aprobar
1. Cotejar mediante acceso **nativo a Sites** el código de v53 efectivamente desplegado contra la fuente recuperada (commit `5be977154cc15c9511787d22e28b7367e6f00467`); las 122 pruebas anteriores son evidencia histórica, no pruebas repetidas aquí. v54 sigue guardada sin despliegue.
2. Pruebas dinámicas aisladas y reproducibles: concurrencia, idempotencia, locks, pausa/deferred/`not_before`, reintentos, recuperación y fallback real de los seis agentes. No forzar ticks ni cuotas.
3. Investigar cinco `network_error` históricos y el log SQL aislado sin atribución no sustentada.
4. Recibos verificables de fabricación y entrega E2E; separar práctica sintética de aceptación del cliente real.
5. Validación final con cliente real (pendiente, no causa para reabrir el cierre administrativo).

**Sin cambios operativos:** no se activó segundo ejecutor ni otro disparador; no se tocaron fuentes, producción, versiones, cuotas, fechas, pedidos ni automatizaciones.
