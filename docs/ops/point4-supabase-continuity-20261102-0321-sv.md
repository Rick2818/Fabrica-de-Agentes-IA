# Fábrica de Agentes IA — Punto 4 — continuidad (2026-11-02 03:21 CST, UTC−06)

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Verificación de solo lectura sobre Supabase, el conector del Site, AGENTS.md, GitHub y la automatización de respaldo. No se invocaron ejecutores, tareas, pruebas con gasto ni endpoints de tick; no se alteraron Site, cuota, fechas, `not_before`, modelos, permisos, cron ni versión 54. La única escritura es este documento.

## Evidencia observada
- Proyecto Supabase `udispwzwrebjkanudcoy`. Corte: `2026-11-02T09:21:00Z` aproximadamente. `cron.job`: **un solo job**, ID 1, `fabrica-queue`, `* * * * *`, `active=true`, `select private.fabrica_scheduler_tick();`. Configuración: `enabled=true`, `not_before=null`, `last_error=null`.
- `cron.job_run_details`: **6,604** ejecuciones SQL, **6,604** `succeeded`, último `runid=6604` a `09:21:00Z`. Esto demuestra ejecución SQL, no procesamiento `done`. Frente al control 02:25: +56 ejecuciones.
- `private.fabrica_scheduler_receipts`: **5,861** filas, **5,855** verificadas, seis no verificadas (cinco `network_error` históricos y un ciclo aún sin conciliar al corte). Frente a 02:25: +56 recibos y +56 verificados. Distribución histórica verificada: `idle=5839`, `done=9`, `waiting=4`, `error=2`, `busy=1`, `quota=1`. En últimos 90 minutos: 90 `idle` verificados, cero `done`, cero `error` y cero `error_code` nuevos.
- Último UUID **conciliado** entre SQL y Site: `0f56e18f-c259-43c6-9d1d-d49050364fc9` (09:20Z), HTTP 200, `verified=true`, `site_status=idle`. UUID siguiente `16c46a5f-bd13-40b7-8faa-5f7a511e9a62` (09:21Z) figura `idle` en el historial de Site, pero estaba sin `checked_at` SQL al corte: **no se declara conciliado**. El conector Site mostraba un ciclo incluso posterior `4592532b-48b0-4b98-9e90-3d81b16445ae`; no se atribuye a este corte SQL.
- Índices únicos en `cycle_id` y `request_id`. Consultas: cero grupos duplicados de ambos y cero recibos sin conciliación con antigüedad superior a tres minutos.
- Código SQL leído: `fabrica_scheduler_tick` utiliza `pg_try_advisory_xact_lock`, `enabled`, `not_before`, comprobación de recibos pendientes y credenciales. `fabrica_scheduler_reconcile` coteja proyecto, UUID, origen, estado y tiempos; diferencia `idle` de `done`, aplica diferimiento por fallos y `next_at`. Inspección **estática**, no ensayo dinámico de concurrencia/reintentos.
- Site vía `agent_status`: **65** trabajos (60 `done`, 2 `failed` históricos, 3 `cancelled`, cero pendientes), cuota **0/20**, ejecutor Supabase `idle`, continuidad reciente. Seis prácticas sintéticas históricas `done`: solo redacción/análisis, **no** fabricación, aprovisionamiento, entrega ni aceptación.
- Salud de modelos: sondas **históricas** del Site con HTTP 404 para Gemini principal y respaldo, HTTP 200 para tercer modelo. No se efectuaron sondas nuevas.
- `AGENTS.md` leído: Leo/Ventas, Mila/Servicio al cliente, Vera/Finanzas, Alma/Química y farmacia, Nico/Logística, Lía/Mercadeo.
- GitHub: se leyeron **los siete** workflows de `main`; **ninguno** contiene trigger `schedule`. El workflow del runner solo permite `workflow_dispatch`. No se lanzó workflow.
- Respaldo horario `Respaldo de pendientes Fábrica IA` confirmado **habilitado**; último estado registrado `no_update` a `2026-11-02T08:37:18Z`. Auditoría Punto 4 también habilitada. No se alteró ninguna programación.
- Logs PostgreSQL consultados en una muestra 07:50–09:21Z: entradas recientes de inicio/final de cron y checkpoints, sin fallo de ejecutor observado en esa muestra. Una consulta de **esta auditoría** a `private.fabrica_scheduler_receipts.created_at` falló por columna inexistente; se corrigió inmediatamente usando `scheduled_at`/`checked_at`. Es error de consulta de auditoría, no prueba de fallo del runner.

## Pendientes que NO están aprobados
1. Cotejar en la **interfaz nativa de Sites** el despliegue y la fuente efectivos del proyecto `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`. La fuente histórica v53 fue recuperada en commit `5be977154cc15c9511787d22e28b7367e6f00467` y tuvo 122 pruebas aprobadas en worktree; **no se infiere** de ello versión actualmente desplegada. v54 permanece sin activarse.
2. Ensayos **dinámicos aislados** de locks, pausas, reintentos, idempotencia, recuperación, cuota y `not_before`, sin afectar la cola real.
3. Resolver y demostrar recuperación de los dos Gemini HTTP 404, sin cambiar proveedor ni generar gastos no autorizados.
4. Recibos E2E por pedido/cliente/UUID de aprobación, fabricación, aprovisionamiento y entrega; no existen pruebas nuevas en este corte.
5. Aceptación final con cliente real cuando exista, manteniendo el cierre administrativo provisional.

**Conclusión:** continuidad observada de ciclos SQL y recibos `idle` verificados, sin evidencia de procesamiento funcional nuevo ni regresión operativa nueva en el alcance inspeccionado. **Punto 4 cerrado provisionalmente, sin certificación.**
