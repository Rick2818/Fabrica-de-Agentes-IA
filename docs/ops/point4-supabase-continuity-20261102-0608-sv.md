# Fábrica IA — Punto 4 — auditoría de continuidad (2026-11-02 06:08, America/El_Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Este punto no es la estación 4 del diseño ni el issue #4 de capacidades generales. Verificación de solo lectura, sin tocar producción ni cola.

## Fuentes y corte
- Supabase project `udispwzwrebjkanudcoy`: consultas directas de `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, definiciones de funciones e índices; instantánea 2026-11-02T12:08:41.732034Z.
- Site: conector nativo de Fábrica `agent_status` (estado operativo, no acceso al código fuente o a versiones).
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y los siete YAML actuales en `.github/workflows/`.
- Respaldo horario `Respaldo de pendientes Fábrica IA`: lectura privada de su estado de automatización; no ejecutado desde esta auditoría.
- Logs de Supabase: ventana 2026-11-02T10:30Z–12:09Z.

## Evidencia comprobada
1. **Programación real:** `cron.job` registra únicamente `jobid=1`, `fabrica-queue`, frecuencia `* * * * *`, `active=true`. `cron.job_run_details` suma **6,771** ejecuciones `succeeded` al corte, 55 más que en el control 05:14. Este estado acredita ejecución SQL, no trabajo funcional completado.
2. **Recibos:** **6,028** filas, **6,022** `verified=true`, seis no verificadas (incluyendo ciclo reciente aún sin conciliar); cinco errores `network_error` históricos. Respecto al control anterior, +55 recibos y +55 verificados. `site_status=done` histórico nueve; no confundir con una nueva entrega.
3. **Ventana móvil:** en la consulta de los últimos 90 minutos hubo 89 `idle` verificados y un recibo todavía no conciliado. En 24 horas: 1,439 `idle`, un pendiente, cero `done` recientes. No se demuestra nueva fabricación ni entrega.
4. **Conciliación de UUID:** `bdd6fdcd-16ca-40dc-b09a-a5993f57a9ee`, programado 12:07:00.041Z, conciliado 12:08:00.044128Z, HTTP 200, `verified=true`, `site_status=idle`, `error_code=null`; el Site reportó el mismo UUID como `idle`. El UUID posterior `5a1a0788-7457-4c7a-94a1-a4cc40fb97e7` aparece como `idle` en el Site pero continuaba **sin conciliación SQL** al corte: no aprobado. No hay UUID ni `request_id` duplicados y no hay pendientes vencidos más de tres minutos.
5. **Configuración y controles:** `enabled=true`, `not_before=null`, `last_error=null`. Índices únicos para `cycle_id` y `request_id`. `fabrica_scheduler_tick` usa advisory transaction lock, bloqueo de fila, conciliación previa, protección de solicitud sin recibo, respeto a `not_before` y credenciales Vault. `fabrica_scheduler_reconcile` comprueba identidad, UUID, respuesta, estados y pausas de cinco minutos ante fallos. Inspección **estática**, no prueba dinámica de concurrencia o recuperación.
6. **Site:** 65 trabajos históricos: 60 `done`, dos `failed`, tres `cancelled`, cero pendientes. Cuota 0/20. El último ciclo del Site leído fue `5a1a0788-7457-4c7a-94a1-a4cc40fb97e7`, `idle`. La configuración expone primario `gemini-2.5-flash`, respaldo `gemini-2.5-flash-lite`, tercero `gemini-3.5-flash-lite`; los últimos chequeos sintéticos almacenados marcan HTTP 404, 404 y 200 respectivamente. No se repitieron y no se afirma recuperación de primario/respaldo.
7. **GitHub:** los siete workflows leídos individualmente carecen de evento `schedule`. `agent-runner.yml` solo permite `workflow_dispatch`; los demás admiten eventos de CI o disparo manual. `AGENTS.md` conserva límites, separación de proyectos, guardias y los seis nombres Leo, Mila, Vera, Alma, Nico, Lía. Su asignación de Alma y Lía difiere de resultados sintéticos históricos del Site: requiere cotejo con fuente vigente.
8. **Respaldo:** automatización horaria habilitada, último registro `no_update` iniciado 2026-11-02T11:59:45Z. No se creó un segundo ejecutor ni se disparó el respaldo.
9. **Logs:** en la ventana revisada, 236 `postgres_logs` y cinco `pgbouncer_logs`; búsqueda textual en `event_message` por `error` o `fatal` sin resultados. No equivale a una garantía de ausencia universal de errores. Una primera consulta de logs falló por un campo anidado incompatible; se corrigió la consulta de auditoría sin modificar producción.

## Pendientes y límites de evidencia
- **Fuente nativa de Sites:** consta la recuperación previa de fuente v53, commit `5be977154cc15c9511787d22e28b7367e6f00467`, y 122 pruebas de servidor aprobadas sobre worktree. Este acceso actual a `agent_status` no expone el inventario de versiones ni fuente; no se verificó de nuevo qué versión está desplegada. La v54 sigue guardada sin activar según estado rector; no se intentó despliegue.
- **Pruebas dinámicas aisladas:** siguen pendientes pruebas controladas de locks, reintentos, idempotencia, pausas y recuperación sobre la fuente vigente en un entorno que no altere la cola real. No se fabricaron pruebas ni se movieron cuotas o `not_before`.
- **Modelos:** demostrar recuperación de primario y respaldo sin cambiar proveedor ni incurrir en costo no autorizado.
- **E2E:** faltan recibos operativos enlazados de solicitud, aprobación, fabricación, aprovisionamiento y entrega del mismo pedido sintético. Las seis prácticas sintéticas históricas son ejercicios de análisis, no fabricación ni aceptación. Validación final con cliente real pendiente, sin reabrir cierre administrativo por su ausencia.

## Cambios efectuados
Solo este registro documental en GitHub. Sin cambios de Site, cron, workflows, datos, locks, cuota, credenciales, ejecutores, versiones, correo, pagos o terceros. **Sin nueva regresión operativa demostrada en el corte; sin certificación.**
