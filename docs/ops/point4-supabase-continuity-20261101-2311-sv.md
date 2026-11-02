# Fábrica de Agentes IA — Punto 4 — auditoría de continuidad (2026-11-01 23:11 CST, UTC−06)

## Estado rector y límites
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN**, según instrucción del 29-10-2026. Auditoría aislada y de solo lectura de Supabase, GitHub, conector de Fábrica y automatizaciones. Única escritura: este informe documental. No se ejecutó manualmente el tick ni se procesó la cola, ni se alteraron fechas, cuotas, trabajos, proveedores, versiones, ejecutores o Site. v54 no activada. Proyecto Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, Supabase `udispwzwrebjkanudcoy`, GitHub `Rick2818/Fabrica-de-Agentes-IA`.

## Evidencia comprobada
- Corte SQL final: `2026-11-02T05:11:23.463974Z` (23:11:23 CST). Proyecto Supabase `ACTIVE_HEALTHY`.
- `cron.job`: único job identificado para Fábrica `jobid=1`, `fabrica-queue`, `active=true`, cada minuto, comando `select private.fabrica_scheduler_tick();`. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`. Ningún tick forzado.
- `cron.job_run_details`: **6,354** ejecuciones SQL `succeeded`. No interpretar `succeeded` como procesamiento `done`.
- `private.fabrica_scheduler_receipts`: **5,611** recibos, **5,605** `verified=true`, cinco `network_error` históricos, un ciclo reciente pendiente de conciliación. **Cero** recibos sin conciliación y sin error con más de tres minutos de antigüedad. Cero grupos de UUID de ciclo o request ID duplicados; índices únicos de ambos identificadores inspeccionados.
- Último ciclo verificado al corte: `c2319bd7-9f00-4edb-8d6b-340d7e2734b6`, `site_status=idle`, HTTP 200 y `verified=true`, cotejado con `health.autonomy.last_scheduled_cycle` del conector Site. Ciclo posterior `9456ded5-1466-41bb-bf33-6b9c8ce5a6e2` pendiente de conciliación al corte: no declararlo aprobado ni fallido.
- Ventana de 90 minutos: 89 recibos `idle` verificados y uno pendiente, **cero `done` nuevos**. Historial de estados verificados observado: `idle=5,588`, `done=9`, `waiting=4`, `error=2`, `quota=1`, `busy=1`; las nueve marcas `done` son históricas.
- Estado Site por `agent_status`: 65 trabajos, 60 `done`, dos `failed`, tres `cancelled`, cero pendientes; cuota `0/20`. `health.supabase_runner.status=idle` y `health.autonomy.status=recent`. Las seis prácticas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` están `done` con recibos de generación de texto Gemini; **no** son aprobación, fabricación, entrega E2E ni aceptación real. No se hicieron nuevas pruebas sintéticas.
- Respaldo horario `Respaldo de pendientes Fábrica IA` (`6adbf94d28e8819189c0516c6068457a`) comprobado `is_enabled=true`; último registro `2026-11-02T04:53:09.384883Z`. Auditoría Punto 4 también habilitada. No se modificaron.
- Los siete workflows `.github/workflows/*.yml` se leyeron individualmente desde `main`: **ninguno contiene `schedule:`**. El runner de GitHub es `workflow_dispatch` manual; no confundir con el cron real de Supabase.
- `AGENTS.md` actual: Leo Ventas, Mila Servicio al cliente, Vera Finanzas, Alma Química y farmacia, Nico Logística, Lía Mercadeo. Registros históricos de especialidades difieren en Alma/Lía; no reescribirlos ni asumir paridad sin cotejo del Site desplegado.
- Funciones `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile` inspeccionadas estáticamente: presentes bloqueo advisory, `FOR UPDATE`, `not_before`, conciliación HTTP y validaciones. Esto **no** acredita pruebas dinámicas de simultaneidad, idempotencia ni recuperación.
- Logs Supabase, ventana `2026-11-02T03:40:00Z`–`05:10:00Z`: 218 `postgres_logs`, seis `pgbouncer_logs`; cero coincidencias del filtro textual `error/fatal` sobre `log_attributes.event_message`. Cobertura limitada; no equivale a ausencia absoluta de errores.
- Modelos: `health.model_checks` histórico muestra primario `gemini-2.5-flash` HTTP 404 no verificado y respaldo `gemini-2.5-flash-lite` HTTP 404 no verificado; tercer modelo `gemini-3.5-flash-lite` HTTP 200 verificado en prueba sintética histórica. Los recibos `gemini-3.6-flash` de prácticas no acreditan recuperación de los dos modelos fallidos.

## Pendientes para validación final
1. Cotejar **nativamente** la versión realmente desplegada del Site y su fuente. Fuente histórica v53 recuperada en commit `5be977154cc15c9511787d22e28b7367e6f00467` con 122 pruebas de servidor aprobadas en worktree, sin reejecución en esta auditoría. El conector `agent_status` no expone versión desplegada; no atribuir v53 ni v54 al runtime actual sin prueba.
2. Pruebas dinámicas seguras y aisladas de locks, reintentos, `not_before`, cuota/deferred, recuperación, idempotencia y continuidad de los seis agentes: no ejecutadas en esta revisión.
3. Resolver y comprobar recuperación de modelos primario/respaldo con HTTP 404, sin cambio de proveedor o costo no autorizado.
4. Recibos operativos persistidos de aprobación, fabricación, aprovisionamiento y entrega E2E, con UUID e identidad de cliente: no demostrados. Pruebas sintéticas de texto no los sustituyen.
5. Aceptación de cliente real: pendiente por falta de cliente, **sin reabrir cierre administrativo**.

**Conclusión:** continuidad reciente del programador y cola vacía verificadas en las fuentes examinadas, sin regresión nueva observada. No se demuestra autonomía funcional completa, fabricación ni entrega. **Punto 4 CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.**
