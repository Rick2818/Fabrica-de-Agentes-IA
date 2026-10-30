# Fábrica de Agentes IA — Punto 4: auditoría de continuidad (2026-10-30 04:15 El Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. No existe aceptación de cliente real. Auditoría de solo lectura; sin disparos manuales, cambios de producción, gastos ni alteración de cuota, fechas o trabajos.

## Fuentes y corte

- Proyecto Supabase `udispwzwrebjkanudcoy`, consulta SQL directa a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_receipts`, `pg_indexes` y metadatos de funciones `private`. Corte aproximadamente 2026-10-30 10:14–10:15 UTC.
- Estado operativo del Site consultado mediante el complemento nativo Fábrica de Agentes IA (`agent_status`), con última ejecución `supabase-cron` y UUID correlacionado.
- `AGENTS.md` y siete archivos de `.github/workflows` leídos en `main`.
- Automatización de respaldo `6adbf94d28e8819189c0516c6068457a` inspeccionada con Automations.peek; sigue habilitada. Último registro: `no_update` (2026-10-30 09:52:22 UTC); no atribuirle una entrega.
- Logs unificados consultados para 09:15–10:15 UTC: 144 registros `postgres_logs` y 3 `pgbouncer_logs`; no hubo `edge_logs` en la consulta agregada. La ausencia de esos logs no demuestra ausencia de errores de transporte.

## Resultado verificable

- Cron `fabrica-queue`: `active=true`, `* * * * *`; 2,337 ejecuciones SQL `succeeded` de 2,337, última 2026-10-30 10:14:00 UTC. **No equivalen a 2,337 entregas.**
- Recibos: 1,599 filas y 1,599 UUID distintos; 1,594 `verified=true`, 5 sin verificar al corte; 9 históricos `site_status=done`, 1,577 `idle`, 4 `network_error`. **No hay nuevas entregas `done` frente al control previo.**
- Recibo del ciclo 10:13 UTC: UUID `0e6bd6ee-b28a-4735-ba10-697b0e24199a`, HTTP 200, `verified=true`, `site_status=idle`; no es una entrega.
- Recibo de 10:14 UTC: UUID `53352893-a8be-4952-9ed9-c87f2b484f36` sin conciliar en el corte SQL, pero el Site registra un ciclo `idle` con el mismo UUID. No marcarlo como `verified` hasta que SQL lo confirme.
- Cuatro recibos históricos `network_error` no verificados: UUID `301f7d3c-d7d0-4d74-86de-072dc18f64f4` (2026-10-30 00:38 UTC), `e557300e-1fa9-4015-97f7-4d831ff2b450` (03:53 UTC), `4dd8d3fe-9de6-40e8-8af7-de813e230d1b` (05:17 UTC), `904c6e64-4e73-4aea-a569-a11ab7234cd1` (05:54 UTC). No adjudicarles entrega ni causalidad sin traza.
- Site: 60 trabajos `done`, 2 `failed` históricos, 3 `cancelled`, 0 pendientes; sin leases activos en la lista; cuota 0/20; `health.next_run_at=null`. Último ciclo consultado `idle` de `supabase-cron`. Los 60 trabajos son el total histórico del tablero, **no** 60 entregas del cron.
- Dos índices únicos persisten en `private.fabrica_scheduler_receipts`: `cycle_id` (PK) y `request_id`. Hashes SQL: `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. Lectura de metadatos confirma referencias a locks de asesoría en tick y `not_before` en ambas funciones; no equivale a prueba formal de concurrencia, pausa ni idempotencia.
- Siete workflows leídos individualmente: **ninguno contiene disparador `schedule`**. El ejecutor de GitHub conserva `workflow_dispatch`; los workflows de regresión incluyen disparadores `push`/`pull_request` según corresponda, no cron.
- Respaldo horario sigue habilitado; no se ejecutó ni se creó otro runner.
- AGENTS.md leído. Nota interna del Site refiere despliegue v58 con modelos Gemini 2.5 (primario y backup) en HTTP 404 en prueba sintética anterior y tercer modelo con HTTP 200. Es **nota del tablero**, no verificación nativa independiente del despliegue actual. Fuente v53 recuperada en commit `5be977154cc15c9511787d22e28b7367e6f00467` con 122 pruebas previas; v54 no debe activarse por esos resultados. No se modificó Site ni versiones.

## Pendientes sin aprobar

1. Diagnóstico causal y trazabilidad de los cuatro timeouts `network_error` y resultado individual de sus UUID; pruebas de transporte/reconciliación aisladas.
2. Pruebas controladas de concurrencia, exclusión mutua, pausas, reintentos, recuperación, `not_before` e idempotencia sin afectar la cola real.
3. Verificación nativa de la fuente y despliegue Site vigentes (no inferir desde notas), más fallback real de modelos y comprobantes E2E de trabajo sintético sin acciones externas.
4. Aceptación final de un cliente real, independiente de pruebas sintéticas.

**Decisión:** sin regresión nueva observada; ninguna intervención de producción justificada en este control. Punto 4 permanece CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.
