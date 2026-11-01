# Punto 4 — Auditoría de continuidad (2026-10-31 18:10 SV)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de lectura y conservación de evidencia. No representa aprobación, fabricación, entrega ni aceptación de cliente.

## Alcance y fuentes
- Site: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; repositorio `Rick2818/Fabrica-de-Agentes-IA`; Supabase `udispwzwrebjkanudcoy`.
- Consultas directas de solo lectura a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_receipts`, `private.fabrica_scheduler_config`, índices y definiciones de funciones; consulta de estado por complemento Fábrica, siete YAML de GitHub y Automations.peek del respaldo.
- Corte principal de SQL: 2026-11-01T00:09:54Z; consulta posterior de conciliación: después de 00:10Z. Los contadores son instantáneas, no una medición de entregas.
- Referencia comparativa: `docs/ops/point4-supabase-continuity-20261031-1708-sv.md`.

## Evidencia confirmada
- Supabase `cron.jobid=1`, `jobname=fabrica-queue`, `active=true`, `schedule=* * * * *`, comando `select private.fabrica_scheduler_tick();`. Última ejecución SQL del corte: runid 4612, `succeeded`, 00:09Z. **SQL succeeded no acredita trabajo done.**
- 4,612 ejecuciones SQL `succeeded`, 3,869 recibos, 3,863 `verified=true`; +62/+62/+62 frente a la auditoría de las 17:08 SV. Cinco `network_error` históricos sin incremento; nueve `site_status=done` históricos, **cero done nuevos** en los últimos 65 minutos; cero errores de recibos nuevos en ese período; 65 ejecuciones SQL succeeded en la misma ventana.
- Ciclo `574d9e8a-d695-48cf-a6e6-1d26ba7ead6a` de 00:09Z conciliado a 00:10Z: `http_status=200`, `verified=true`, `site_status=idle`, `error_code=NULL`. El ciclo siguiente `c8327490-b1fc-49a1-aabb-8f9f3ef2e383` de 00:10Z aparece `idle` en el estado nativo del Site, pero **seguía pendiente de conciliación SQL** en la consulta posterior; está dentro del margen normal. Ninguno representa entrega nueva.
- Configuración: `enabled=true`, `not_before=NULL`, `last_error=NULL`. Cero UUID duplicados, cero request_id duplicados y cero recibos sin conciliar con antigüedad superior a cinco minutos y sin error. Existen índices únicos para `cycle_id` y `request_id`.
- Inspección estática de `private.fabrica_scheduler_tick`: `pg_try_advisory_xact_lock`, consulta de `enabled`, respeto de `not_before`, espera de recibo anterior y correlación de UUID; `private.fabrica_scheduler_reconcile` verifica fuente, proyecto, schedule, UUID, tiempos y estado del recibo, aplica pausa por errores y maneja `response_missing`. **No se probaron dinámicamente** contención, idempotencia, recuperación ni pausas.
- Estado del Site: 65 trabajos (60 `done`, dos `failed` históricos y tres `cancelled`); cero pendientes, cero leases activos o reintentos vencidos; cuota 0/20. `health.supabase_runner` reciente con `source=supabase-cron`, `status=idle`; `automation.enabled=true`. El respaldo horario existente `Respaldo de pendientes Fábrica IA` está `is_enabled=true` según Automations.peek; no se ejecutó ni creó otro ejecutor.
- Se leyeron los siete YAML actuales en `.github/workflows`; ninguno contiene `schedule:` como disparador. `agent-runner.yml` conserva `workflow_dispatch` manual. No se debe confundir el historial antiguo `github-actions event=schedule` del tablero con un disparador vigente.
- Las seis prácticas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` siguen `done` con recibos de texto y hash, sin nuevas pruebas en esta pasada. No constituyen fabricación ni entrega E2E.
- Modelos declarados en Site: `gemini-2.5-flash` primario, `gemini-2.5-flash-lite` respaldo, `gemini-3.5-flash-lite` tercero. Historial de pruebas: HTTP 404 para los dos primeros y HTTP 200 para el tercero; no se revalidaron ni cambiaron modelos.
- Se consultó la fuente de logs Supabase para 23:00Z–00:10Z: 169 eventos `postgres_logs` y tres `pgbouncer_logs`. El conteo no acredita ausencia de errores ni identifica causa raíz.
- `AGENTS.md` vigente asigna Leo/Ventas, Mila/Servicio, Vera/Finanzas, Alma/Química-Farmacia, Nico/Logística y Lía/Mercadeo. Etiquetas de ejercicios históricos difieren; no alterar identidades ni recibos sin cotejo nativo.

## Límites y trabajo pendiente
1. Cotejar mediante acceso **nativo de Sites** el artefacto efectivamente publicado con la fuente Site v53 recuperada (SHA aportado `5be977154cc15c9511787d22e28b7367e6f00467`). Las 122 pruebas de servidor aprobadas en worktree son evidencia previa; no se repitieron ni se confirma paridad con despliegue. v54 permanece guardada, no desplegada.
2. Ejecutar pruebas sintéticas **aisladas**, sin afectar cola real, de concurrencia, locks, reintentos, idempotencia, pausas, `not_before`, recuperación y fallback. No marcar pendientes como aprobadas.
3. Investigar causa de cinco errores históricos de transporte, según retención real de logs; un timeout no demuestra pérdida de trabajo.
4. Obtener recibos E2E independientes de aprobación, fabricación, aislamiento entre clientes y entrega de los seis agentes; separar simulación de aceptación real.
5. Validación final con cliente real cuando exista, sin reabrir cierre administrativo solo por su ausencia.

**Mutaciones operativas:** ninguna. No se forzaron ticks, no se alteraron cuotas, fechas, trabajos, credenciales, Site, versiones ni ejecutores. No se enviaron mensajes, correos ni pagos. No hay regresión nueva demostrada en esta revisión.
