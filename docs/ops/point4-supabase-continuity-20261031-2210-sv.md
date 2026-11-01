# Fábrica de Agentes IA — Punto 4 · auditoría 2026-10-31 22:10 America/El_Salvador

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** No existe aceptación final con cliente real. Esta revisión es de solo lectura sobre el Site y Supabase; no activó v54, no cambió producción, no creó jobs ni ejecutores, no forzó tick, no modificó cuota/not_before ni envió mensajes.

## Evidencia directa del control
- Proyecto Supabase: `udispwzwrebjkanudcoy`, activo y saludable. Cron jobid=1 `fabrica-queue` activo, `* * * * *`, comando `select private.fabrica_scheduler_tick();`.
- Corte SQL 2026-11-01 04:09:25 UTC: `cron.job_run_details`: 4,852 `succeeded`, 0 estados distintos; 4,109 filas en `private.fabrica_scheduler_receipts`, 4,103 con `verified=true`, 5 `network_error` históricos, 9 `site_status=done` históricos. Cero UUID de ciclo o request_id duplicados. Cero conciliaciones no verificadas de más de cinco minutos sin error.
- `c3671cf4-f5dd-49eb-b33b-3faa5f0af771` aparece en el Site como último ciclo `source=supabase-cron`, `status=idle`, sin job_id; su recibo SQL se concilió a 2026-11-01 04:10:00 UTC: HTTP 200, `verified=true`, `site_status=idle`, `error_code=null`. No acredita entrega.
- `d55ad108-dfec-4964-bd00-e95fb74b19ea`, programado 04:10 UTC, aún no conciliado en el corte 04:10:20 UTC; no marcar aprobado.
- Site (complemento conectado): 60 `done`, 2 `failed` históricos, 3 `cancelled`, 0 pendientes, 0 leases activos, 0 reintentos vencidos, uso 0/20; `health.autonomy.primary.recent=true` y `health.supabase_runner.status=idle`. Los seis trabajos sintéticos `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` constan `done` con evidencia de respuesta de modelo, no de fabricación ni entrega real.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`; última ejecución registrada `no_update` a 2026-11-01 03:54 UTC. No confundir respaldo ChatGPT con cron Supabase.
- Los siete YAML vigentes en `.github/workflows/` fueron leídos individualmente: ninguno tiene evento `schedule`. `agent-runner.yml` es `workflow_dispatch` manual.
- Índices SQL únicos `fabrica_scheduler_receipts_pkey(cycle_id)` y `fabrica_scheduler_receipts_request_id_key(request_id)` presentes. Inspección estática: `fabrica_scheduler_tick` usa `pg_try_advisory_xact_lock` y contiene lógica `not_before`; `fabrica_scheduler_reconcile` contempla `checked_at`, `error_code`, `not_before` y reanudación. Esto no sustituye pruebas dinámicas.
- Logs Supabase últimas seis horas: 872 eventos postgres y 18 pgbouncer; un evento `syntax error at or near "hour"` a 01:08:28 UTC, sin prueba de relación con el ejecutor. No se atribuye causalidad.
- Modelos: pruebas sintéticas anteriores `gemini-2.5-flash` y `gemini-2.5-flash-lite` HTTP 404, sin prueba nueva de recuperación; tercer modelo `gemini-3.5-flash-lite` HTTP 200 histórico. No se probó fallback en esta pasada.
- `AGENTS.md` vigente: Leo Ventas, Mila Servicio al cliente, Vera Finanzas, Alma Química/Farmacia, Nico Logística, Lía Mercadeo. Algunas prácticas antiguas reflejan asignaciones distintas; se conserva sin modificar evidencia histórica.
- Fuente nativa Site v53: antecedente aportado `5be977154cc15c9511787d22e28b7367e6f00467` y 122 tests previos; la API GitHub del repositorio no encuentra ese SHA (422), compatible con que sea un commit nativo del Site y no de este repositorio. **No se realizó cotejo nativo del despliegue Site**, por falta de operación de lectura de código/versiones Site en el complemento disponible. No inferir inaccesibilidad general ni activar v54.

## Pendientes sin aprobar
1. Cotejo de fuente nativa efectivamente desplegada y versión v53, preservando la fuente original; v54 permanece guardada sin desplegar.
2. Pruebas dinámicas aisladas de lock/concurrencia, idempotencia, pausa, recuperación, reintento y `not_before`, sin manipular la cola productiva.
3. Diagnóstico causal de cinco `network_error` históricos y validación actual del fallback de modelos.
4. Recibos E2E de aprobación, fabricación, aprovisionamiento, entrega y recuperación, separados de las seis respuestas sintéticas.
5. Aceptación final con cliente real, sin reabrir el cierre administrativo por su ausencia.

**Conclusión:** cron SQL y conciliación reciente verificables; cola vacía y ningún error operativo nuevo demostrado. No certificación ni nuevas entregas demostradas.
