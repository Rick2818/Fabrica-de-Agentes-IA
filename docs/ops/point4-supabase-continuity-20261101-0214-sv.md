# Fábrica de Agentes IA — Punto 4: auditoría de continuidad, 2026-11-01 02:14 (El Salvador)

**Estado rector: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** No se reabre el cierre administrativo por ausencia de cliente. Auditoría de solo lectura; sin ejecución manual de cola/tick, sin modificación de Site, código operativo, cron, cuotas, fechas, secretos, órdenes, comunicaciones ni pagos. v54 no activada.

## Evidencia comprobada (corte SQL 2026-11-01T08:14:00.217229Z)

- Supabase proyecto `udispwzwrebjkanudcoy`: `cron.job` tiene un único job `fabrica-queue`, `jobid=1`, `active=true`, `* * * * *`, comando `select private.fabrica_scheduler_tick();`. `cron.job_run_details`: **5,097** `succeeded` acumulados, 90 `succeeded` en últimos 90 minutos, último inicio `08:14:00.022897Z`. **SQL succeeded no significa procesamiento done**.
- `private.fabrica_scheduler_receipts`: **4,354** recibos al corte, **4,348** `verified=true`, **5** `network_error` históricos, **9** `site_status=done` históricos, **0** `done` en últimos 90 minutos. Ningún recibo pendiente de conciliación con antigüedad >3 min. Los cinco errores están fechados 2026-10-30 y 2026-10-31, sin aumento respecto al control 01:10.
- Correlación: ciclo `816fd535-e849-40e4-a6b5-5a051813ab3a`, `request_id=4354`, aparece en el recibo nativo de Site `health.autonomy.primary.last_cycle` con `source=supabase-cron` y `status=idle`; Supabase lo concilió a `08:14:00.028454Z` con `http_status=200`, `verified=true`, `site_status=idle`. **No es una entrega**.
- Ciclo posterior `e267ed27-1c7f-4f44-a997-f27f6dc17da7`, `request_id=4355`, programado `08:14:00.031Z`, estaba `checked_at=NULL`, `verified=false` al corte. No se lo marca aprobado ni fallido.
- Últimos 90 minutos: 89 recibos `verified=true/site_status=idle`, 1 pendiente sin error al corte; 90 ejecuciones SQL `succeeded`.
- Cero `cycle_id` duplicados y cero `request_id` duplicados; índices UNIQUE `fabrica_scheduler_receipts_pkey` y `fabrica_scheduler_receipts_request_id_key` comprobados. Cero conciliaciones pendientes vencidas. `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`.
- Inspección estática de funciones SQL: `fabrica_scheduler_tick` usa `pg_try_advisory_xact_lock`, `FOR UPDATE`, verificación de `not_before`, control de recibos pendientes y UUID; `fabrica_scheduler_reconcile` comprueba identidad, `run_id`, `scheduled_at`, `source`, `status` y maneja errores/reintentos con `not_before`. No se ejecutaron pruebas dinámicas de concurrencia, idempotencia bajo carreras, pausa, recuperación o fallback.
- Logs Supabase entre `06:30Z` y `08:15Z` consultados: 251 `postgres_logs` y 6 `pgbouncer_logs`; el filtro de `error` o `timeout` en `postgres_logs` no devolvió registros. Esto no excluye fallas en otros registros o fuera de la ventana.

## Site y respaldo

- Complemento nativo Fábrica `agent_status`: Site operativo responde, `automation.id=supabase:udispwzwrebjkanudcoy:fabrica-queue`, `automation.enabled=true`, `health.autonomy.primary.recent=true`, último ciclo `idle`; `health.supabase_runner.status=idle`, `pending=0`, `next_at=null`. **65 trabajos**: 60 `done`, 2 `failed` históricos, 3 `cancelled`, cero pendientes. Cuota actual `0/20`. No hay leases/reintentos pendientes en la cola devuelta. El recibo Site se contrastó con el recibo SQL; no se equipara HTTP200 con `done`.
- Respaldo horario ChatGPT `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`; último run `6191940e-2208-8323-a49d-873040224a01` registrado `no_update` y `latest_result=null`. No se deduce `requires_user_action` ni procesamiento desde esa ausencia. No se invocó el respaldo, ni se creó otro ejecutor.
- GitHub `main`: se leyeron `AGENTS.md` y **los siete** archivos de `.github/workflows`. Ninguno contiene evento `schedule`; `agent-runner.yml` es `workflow_dispatch` únicamente. Los runs recientes de GitHub eran `pull_request` o `push`, no acreditan disparo programado.
- `AGENTS.md` confirma preservación del Site original, separación entre ejecución manual/programada y seis identidades: Leo, Mila, Vera, Alma, Nico, Lía. Las seis prácticas sintéticas anteriores figuran `done` como **análisis/redacción**, no como fabricación, aprovisionamiento, entrega E2E ni aceptación de cliente.
- Fuente original asociada a Site v53 recuperada **históricamente** mediante acceso nativo Sites: commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas de servidor aprobadas en ese worktree. En esta auditoría no estuvo disponible la interfaz nativa de fuentes/despliegues de Sites; por tanto no se cotejó el código efectivamente desplegado. El complemento registra una nota histórica de despliegue v58 de 29-10; no equivale a una lectura de la versión actual. v54 se mantiene sin activación por esta tarea.
- Modelos Gemini: antecedente de HTTP404 para primario `gemini-2.5-flash` y respaldo `gemini-2.5-flash-lite`; tercer modelo `gemini-3.5-flash-lite` con HTTP200 en prueba histórica. No se hicieron llamadas nuevas ni se afirma recuperación del primario/respaldo o fallback real completo.

## Pendientes para validación final (NO aprobados)

1. Acceso nativo Sites para comparar la fuente efectiva/despliegue actual con la referencia recuperada, sin sustituir fuente ni publicar v54.
2. Pruebas dinámicas seguras y aisladas de concurrencia/locks, reintentos, idempotencia, pausa, recuperación tras interrupción, respeto a `not_before` y fallback de modelos; sin gastar cuota productiva ni forzar ticks.
3. Diagnóstico causal de los cinco `network_error` históricos con evidencia original si se recupera; su sola ausencia de recurrencia no prueba causa resuelta.
4. Recibos E2E verificables de aprobación, fabricación, aprovisionamiento y entrega con identidad y autorización aisladas; no equiparar pruebas sintéticas de texto a entrega.
5. Aceptación final de cliente real cuando exista. Mantener punto 4 cerrado provisionalmente sin certificación mientras tanto.

**Resultado:** continuidad del cron y conciliación `idle` verificadas; sin nueva regresión operativa observada ni entrega nueva. No se corrigió código por falta de fallo nuevo reproducible y de prueba segura aislada. Ningún cambio operativo efectuado.
