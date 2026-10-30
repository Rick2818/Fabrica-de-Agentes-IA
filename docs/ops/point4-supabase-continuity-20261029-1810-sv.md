# Fábrica de Agentes IA — Punto 4 — control 2026-10-29 18:10 SV

## Dictamen rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** No hay cliente real para aceptación final. Este control es de solo lectura de Supabase, estado del Site por complemento, GitHub y automatización de respaldo. La única escritura es este registro documental. No se ejecutaron ticks manuales, cola, pruebas con consumo de Gemini, ni se alteraron versiones, cuotas, fechas, trabajos, credenciales, ejecutores o disparadores.

Proyecto Site: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; Supabase: `udispwzwrebjkanudcoy`; repositorio: `Rick2818/Fabrica-de-Agentes-IA`. Corte SQL **2026-10-30 00:10:32.750713 UTC (2026-10-29 18:10:32 SV)**.

## Continuidad comprobada
- Supabase `cron.job`: **un solo job**, id=1, `fabrica-queue`, `active=true`, `* * * * *`, comando `select private.fabrica_scheduler_tick();`. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`.
- `cron.job_run_details`: **1,733** registros `succeeded` (+54 respecto al corte 17:16). Esto prueba ejecuciones SQL, **no** entregas `done`.
- `private.fabrica_scheduler_receipts`: **1,018** recibos (+54), **1,017** `verified=true`, **1** del minuto en curso sin conciliar; **0** no verificados con más de dos minutos. Distribución verificada: **1,000 idle**, **9 done**, **4 waiting**, **2 error**, **1 busy**, **1 quota**. **No hay nuevas entregas `done`** respecto al control anterior.
- `cycle_id` y `request_id` tienen índices UNIQUE; consulta de grupos duplicados de `cycle_id`: **0**. Funciones `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile` presentes; inspección estática confirma `not_before`, `cycle_id`, `request_id`, y el tick contiene advisory lock y `FOR UPDATE`. No equivale a pruebas dinámicas de colisiones o recuperación.
- Correlación HTTP real: `cycle_id=4ddafc8b-eec8-4e05-bb91-3a330229a8db`, `request_id=1018`, `scheduled_at=2026-10-30T00:09:00.036Z`, `net._http_response` HTTP 200, `receipt.supabase.run_id` idéntico, `source=supabase-cron`, `run.status=receipt.status=idle`, `verified=true`. Los otros cuatro ciclos anteriores también devolvieron `idle`; ninguno acredita procesamiento `done`. Ciclo de las 00:10 UTC: HTTP 200 `idle` ya visible, pero todavía no conciliado en el corte; no marcarlo verificado.
- Logs Supabase, 22:00–00:09 UTC: 309 `postgres_logs`, 6 `pgbouncer_logs`; sin coincidencias de `error`/`fatal` en el campo consultado. No extrapolar a todos los servicios ni a otras fechas.

## Site y respaldo
- `agent_status` del complemento: **65 trabajos**, 60 `done`, 2 `failed` históricos, 3 `cancelled`, **0 pendientes**; ninguno de los trabajos listados muestra lease activo. `health.autonomy.status=recent` y ciclo Supabase reciente `idle` con UUID correlacionado. Cuota **20/20**; no consumir más hasta reposición normal.
- Modelos: evidencia sintética persistida de la revisión anterior, **no repetida hoy en esta pasada**: `gemini-2.5-flash` HTTP 404, `gemini-2.5-flash-lite` HTTP 404 y `gemini-3.5-flash-lite` HTTP 200. La disponibilidad y recuperación real del fallback frente a una falla externa siguen sin certificación.
- Complemento conserva nota de despliegue `v58` `succeeded` y hash de fuente `207466f651085ed04ec5ed0cc3cdc1628b17f3a6`; **no se inspeccionó la fuente nativa del Site en esta pasada** ni se certificó equivalencia con GitHub. La fuente v53 recuperada, commit `5be977154cc15c9511787d22e28b7367e6f00467`, y sus **122 pruebas aprobadas previamente** son antecedente, no pruebas reejecutadas. No activar v54.
- Respaldo horario `Respaldo de pendientes Fábrica IA` habilitado. Su último registro visible tiene `recorded_status=no_update` a las 23:33 UTC y `latest_result=null`; **no prueba procesamiento de cola**. No se invocó el respaldo.
- `AGENTS.md` leído desde `main`; conserva las reglas de preservar Site, no confundir proyectos, distinguir programación de ejecución y no ampliar permisos sin autorización.
- Siete workflows GitHub inspeccionados en `main`. **Ninguno contiene `schedule`**; disparadores existentes: manual, push o pull_request. El histórico `github-actions event=schedule` del Site no demuestra que exista un disparador vigente.

## Pendientes / gates sin aprobar
1. Comparación de fuente nativa desplegada v58 contra la versión de referencia y código GitHub; no reemplazar Site con v53.
2. Pruebas aisladas de concurrencia, pausas, reintentos, idempotencia de operaciones y recuperación ante timeout/pérdida HTTP; no realizadas en esta pasada.
3. Validación controlada de fallback con proveedor real cuando haya cuota y sin modificar modelos ni costos; los dos HTTP 404 permanecen como hallazgo técnico.
4. Prueba end-to-end **disparada realmente por Supabase Cron** con un encargo sintético elegible, UUID, recibo de Site, `verified=true` y `done`; la evidencia histórica `done` no se atribuye automáticamente al cron.
5. Aceptación final de un cliente real, inexistente a la fecha; **no reabre el cierre administrativo**.

No se encontró regresión nueva que justifique un cambio de producción. Sin certificación automática.
