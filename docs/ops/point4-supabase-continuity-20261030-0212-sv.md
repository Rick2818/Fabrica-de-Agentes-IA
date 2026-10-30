# Punto 4 — continuidad del ejecutor (2026-10-30 02:12 America/El_Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Control aislado, solo lectura, sin cliente real. No corresponde a la estación 4 de diseño ni a GitHub issue #4.

## Fuentes y corte
- Supabase `udispwzwrebjkanudcoy`: SELECT de `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_receipts`, `private.fabrica_scheduler_config`, funciones e índices; corte de agregados **2026-10-30 08:11:58 UTC**, comprobación adicional de recibos **08:12:25 UTC**.
- Complemento nativo de operación de Fábrica `agent_status`, asociado al Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`: lectura aprox. 08:12 UTC. Esta interfaz acredita estado de operación, **no** hash del artefacto desplegado.
- `AGENTS.md` y **los siete YAML** de `.github/workflows/` leídos individualmente en `Rick2818/Fabrica-de-Agentes-IA/main`.
- Respaldo `6adbf94d28e8819189c0516c6068457a` consultado por Automations.peek: habilitado; último registro `no_update` (inicio 07:17 UTC). No equivale a prueba de procesamiento.
- Logs unificados de Supabase, 07:10–08:10 UTC: 144 eventos `postgres_logs`, 3 `pgbouncer_logs`; consulta textual por ERROR/FATAL en `postgres_logs`: cero coincidencias. Esto no descarta errores fuera de la ventana ni mensajes con otro formato.

## Resultados verificados
1. Cron principal: `fabrica-queue`, `jobid=1`, activo, expresión `* * * * *`, comando `select private.fabrica_scheduler_tick();`. A las 08:11:58 UTC había **2,214** registros SQL, **2,214 succeeded**, cero con otro estado; **65** registros en 65 minutos, último inicio 08:11:00 UTC. El éxito SQL **no** equivale a entrega `done`.
2. Recibos SQL al mismo corte: **1,476** recibos y **1,476 UUID únicos**, **1,471 verified**, **5 sin verificar**, **9 `done` históricos verificados**, **1,454 `idle` verificados**. En 65 minutos: 65 recibos, 64 verificados, cero `error_code` nuevos. El último UUID a ese corte `bf4eed7c-75fe-4467-81da-82b616d7d7a7` (08:11 UTC) aún no estaba conciliado; a las 08:12:25 UTC ya constaba `verified=true,site_status=idle,http_status=200`. El ciclo 08:12 UTC `d23b4e41-f8ff-4265-bd6e-d7e679d89c61` estaba `idle` en el Site pero seguía pendiente de verificación SQL a las 08:12:25; no se lo marcó manualmente.
3. Los **cuatro `network_error` históricos** siguen sin recibo individual verificable: UUID `301f7d3c-d7d0-4d74-86de-072dc18f64f4` (00:38 UTC), `e557300e-1fa9-4015-97f7-4d831ff2b450` (03:53 UTC), `4dd8d3fe-9de6-40e8-8af7-de813e230d1b` (05:17 UTC), `904c6e64-4e73-4aea-a569-a11ab7234cd1` (05:54 UTC). Ninguno fue convertido en `done` por inferencia. No se detectó quinto error en este corte.
4. Site: **65 trabajos históricos: 60 `done`, 2 `failed`, 3 `cancelled`**, cero pendientes, cero leases activos por estado de tareas. La cuota es **0/20**. El último ciclo del Site está identificado como `supabase-cron`, `idle`, con UUID `d23b4e41-f8ff-4265-bd6e-d7e679d89c61`, distinto de entrega funcional. `health.autonomy.primary.recent=true`, `health.supabase_runner.status=idle`; no hay `next_run_at` ni `deferred_until` activos.
5. Configuración SQL: `enabled=true`, `not_before=null`, `last_error=null`. Los MD5 de funciones coinciden con el control anterior: `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. Índices únicos persistentes sobre `cycle_id` y `request_id`. No son pruebas dinámicas de carreras ni idempotencia funcional.
6. GitHub: siete workflows inspeccionados individualmente; **ninguno tiene `on.schedule`**. `agent-runner.yml` se activa solo mediante `workflow_dispatch`; otros workflows contienen eventos de CI o disparo manual, no un segundo cron de cola.
7. `AGENTS.md` leído y preservado. Se mantiene la referencia histórica a la fuente Site v53 recuperada en `5be977154cc15c9511787d22e28b7367e6f00467` y 122 pruebas de servidor aprobadas previamente sobre worktree; **no** se reejecutaron ni se asume que v53 sea la versión desplegada. No hay acceso a herramienta nativa de lectura de fuente/versiones de Sites en este control; falta comparar el despliegue real. No se activó v54 ni otra versión.
8. Modelos reportados por Site: `gemini-2.5-flash` principal, `gemini-2.5-flash-lite` respaldo, `gemini-3.5-flash-lite` tercero. Permanecen sondas sintéticas históricas 404/404/200, sin nueva prueba de fallback extremo a extremo. Ninguna prueba sintética nueva ni consumo de cuota.

## Pendientes para validación final
- Conciliar el resultado exacto de los cuatro ciclos con `network_error` y diagnosticar timeouts del Site sin forzar ejecuciones.
- Comparar código y artefacto **realmente desplegados** del Site mediante acceso nativo con la fuente vigente; preservar cambios posteriores a v53.
- Pruebas aisladas reproducibles de concurrencia, locks, idempotencia, pausas/`not_before`, reintentos, recuperación de transporte y fallback; **pendientes, no aprobadas**.
- Evidencia E2E de ejecución funcional, con recibos vinculados a trabajos, separada de `idle`, HTTP200 y éxito SQL.
- Aceptación final con cliente real, todavía inexistente.

**Acciones del control:** consultas de solo lectura y creación de este documento. Sin ejecutar ticks, crear encargos, cambiar cuotas/fechas, desplegar Site, tocar ejecutores, jobs, respaldos, credenciales, clientes, pagos ni terceros. Cierre administrativo provisional intacto.
