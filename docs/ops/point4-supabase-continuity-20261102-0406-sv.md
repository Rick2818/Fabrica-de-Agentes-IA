# Fábrica de Agentes IA — Punto 4: control de continuidad (2026-11-02, 04:06 CST)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría solo lectura; ninguna ejecución manual de cola, modificación de cuota, fecha, versión, cron, cliente ni transporte externo. Esta auditoría no es la estación 4 ni el issue #4.

## Fuentes observadas

- Supabase proyecto `udispwzwrebjkanudcoy`: `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, funciones `private.fabrica_scheduler_tick()` y `private.fabrica_scheduler_reconcile()`, índices y logs.
- Site: lectura de estado mediante conector Fábrica `agent_status`, no una inspección nativa nueva del código desplegado.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y contenido completo de siete workflows de `main`.
- Automations: consulta privada de estado del respaldo horario y de la tarea auditora.

## Resultados verificables al corte (10:06 UTC / 04:06 CST)

1. Supabase proyecto `ACTIVE_HEALTHY`. Un job `cron.job` llamado `fabrica-queue`, `jobid=1`, calendario `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. Configuración: `enabled=true`, `not_before=NULL`, `last_error=NULL`.
2. `cron.job_run_details`: **6,649** ejecuciones con estado SQL `succeeded`; último fin `2026-11-02 10:06:00.042178+00`. **SQL succeeded no acredita `done` del Site**.
3. `private.fabrica_scheduler_receipts`: **5,906** filas, **5,900** `verified=true`, **6** sin verificar, **5** errores históricos `network_error` y **5,906** UUID distintos. `site_status=done AND verified`: **9** históricos; `idle AND verified`: **5,883** al primer corte. El contador puede crecer por el cron activo durante las lecturas.
4. Ventana de 90 minutos: 90 recibos, **89 `idle` verificados**, cero `done` verificados, uno pendiente de conciliación. No se evidenció procesamiento funcional nuevo.
5. UUID `c9aacaca-0f78-47ad-bfb3-d0f639ef1151`, programado 10:05 UTC, fue conciliado 10:06 UTC: HTTP 200, `verified=true`, `site_status=idle`, sin `error_code`. UUID siguiente `2520a70d-4dac-4e8f-a561-79c5e61bab06`, programado 10:06 UTC, figuraba en el Site como `idle` pero su fila SQL estaba aún sin `checked_at` ni verificación. **No aprobar el último ciclo por anticipado.**
6. No hubo UUID duplicados; cero pendientes sin explicación de más de tres minutos. Los cinco sin verificar antiguos tienen `error_code=network_error`; no son éxitos.
7. Site `agent_status`: 65 trabajos históricos: **60 `done`, 2 `failed`, 3 `cancelled`, cero pendientes**. Último ciclo `supabase-cron` reciente con `status=idle`; no acredita fabricación, aprobación de pedido, entrega ni SLA. Seis prácticas sintéticas históricas `done` no equivalen a aceptación de cliente.
8. El ejecutor `tick()` usa `pg_try_advisory_xact_lock(1432658222,51)`, `FOR UPDATE`, gate `enabled`, `not_before`, pendiente de recibo, UUID y llamada a Site. `reconcile()` coteja proveedor, proyecto, `schedule_id`, UUID, milisegundos programados, estado, tiempos y `job_id` para `done/cancelled`; difiere errores o `next_at`. Índices únicos sobre `cycle_id` y `request_id`. **Inspección estática, no prueba dinámica de carreras, pausa, reintentos ni recuperación.**
9. Los siete workflows en `.github/workflows/` se leyeron. Ninguno incluye evento `schedule`. `agent-runner.yml` es `workflow_dispatch` solamente; otros usan `push`/`pull_request` o `workflow_dispatch`, no cron de GitHub. Los registros históricos `github-actions` con evento schedule no demuestran un disparador vigente.
10. Automations: respaldo `6adbf94d28e8819189c0516c6068457a` habilitado, última ejecución registrada `no_update`; auditoría `6ae238f8b8a081918479f796f34da2b1` habilitada. Ninguno fue modificado.
11. Logs Supabase PostgreSQL, ventana 08:00–10:06:30 UTC: 306 `LOG`, 1 `ERROR`. Ese error corresponde a consulta de auditoría con columna inexistente `created_at` en `fabrica_scheduler_receipts` (09:21 UTC, SQLSTATE 42703), no a evidencia de fallo del ejecutor. No se consultó todo el historial ni se infiere ausencia absoluta de errores.

## Limitaciones y próximos gates

- No se realizó una lectura **nativa nueva** de la versión desplegada del Site ni cotejo de SHA de producción. Existe antecedente de recuperación de fuente asociada a v53, commit `5be977154cc15c9511787d22e28b7367e6f00467`, con 122 pruebas previas aprobadas; no se repitieron hoy. No activar la v54 guardada ni reemplazar código por versiones anteriores. Las notas del Site incluyen referencias históricas a versiones posteriores; no tratarlas como verificación del despliegue actual.
- Falta prueba dinámica aislada y verificable de concurrencia, locks, reintentos, pausa/reanudación, recuperación e idempotencia; no fabricar un `done` ni alterar `not_before` o cuota.
- Persisten antecedentes HTTP 404 en pruebas de Gemini primario y respaldo, sin corrección demostrada; la tercera ruta histórica no certifica las dos primeras.
- Faltan recibos E2E de aprobación, fabricación, aprovisionamiento y entrega, más aceptación final con cliente real. Las pruebas sintéticas pueden continuar con aislamiento y evidencia, pero no equivalen a certificación.
- **No se identificó en esta muestra una regresión nueva que justifique cambiar el ejecutor productivo.** Mantener el cierre administrativo provisional sin certificación y la supervisión separada del respaldo.

