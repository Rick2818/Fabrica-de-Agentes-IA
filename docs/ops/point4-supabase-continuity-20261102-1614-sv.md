# Punto 4 — Continuidad Supabase y autonomía de Leo (auditoría 2026-11-02 16:14 SV)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría exclusivamente de Fábrica de Agentes IA; no es la estación 4 ni GitHub issue #4. No aceptar pruebas sintéticas como aceptación de cliente.

## Alcance y fuentes consultadas
- Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`: consulta de estado por conector Fábrica de Agentes IA (`agent_status`); **no** se dispuso en este control de una lectura nativa de la versión desplegada ni de su fuente.
- Supabase `udispwzwrebjkanudcoy`: lecturas SQL de `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, definiciones de funciones e índices; logs PostgreSQL.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y los siete YAML de `.github/workflows/` en `main`.
- Automatización de respaldo `6adbf94d28e8819189c0516c6068457a`: consulta privada de su estado; no fue ejecutada ni modificada.

## Evidencia observada
- Supabase proyecto `ACTIVE_HEALTHY`. `cron.job`: **un solo job**, `jobid=1`, `jobname=fabrica-queue`, `active=true`, frecuencia `* * * * *`, comando `select private.fabrica_scheduler_tick();`.
- Corte SQL **2026-11-02 22:14:04 UTC**: **7,377** ejecuciones SQL `succeeded`, **0** en otros estados; **6,633** recibos, **6,627** `verified=true`, **5** `network_error` históricos y un recibo reciente pendiente de conciliación. Los cinco no verificados antiguos tienen `checked_at` y `error_code=network_error`; no deben confundirse con solicitudes aún sin conciliar.
- En los últimos 90 minutos: **90** recibos `idle` verificados y **0** recibos `done` nuevos. `succeeded`/HTTP 200/`idle` no prueban entrega funcional.
- Conciliación entre conector Site y SQL para UUID **`5f4a1bb1-fbba-4eef-9012-ef8bab67ac78`**: Site reportó `source=supabase-cron`, `status=idle`, `pending=0`; SQL reportó `scheduled_at=2026-11-02 22:13:00.049+00`, `checked_at=22:14:00.108831+00`, `http_status=200`, `verified=true`, `site_status=idle`, `error_code=null`. **No es un trabajo `done`.**
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null` al control. No se forzó `tick` ni se alteró diferimiento/cuota.
- `agent_status`: **60** trabajos `done`, **2** `failed` históricos, **3** `cancelled`, **0** pendientes; uso **0/20**. Estos son acumulados, no 60 nuevas entregas.
- Sin UUID ni `request_id` duplicados en recibos. Índices únicos en `cycle_id` y `request_id`. Funciones SQL contienen `pg_try_advisory_xact_lock`, espera de conciliación, pausa ante error, `not_before` y validación de campos de recibo. **Se verificó diseño estático; no se ejecutaron pruebas de concurrencia/recuperación nuevas.**
- Logs PostgreSQL: búsqueda de mensajes `error`/`fatal` entre 20:00 y 22:13 UTC no devolvió filas. No implica ausencia global de errores en otros servicios.
- Los siete YAML revisados: ninguno contiene disparador `schedule:`. El ejecutor de GitHub es manual; otros workflows conservan disparadores de `push`/`pull_request` para pruebas, no para el cron productivo.
- Respaldo horario: `is_enabled=true`; última ejecución registrada el 2026-11-02 22:07–22:08 UTC, estado `completed`. No se le pidió procesar la cola.
- Salud de modelos en el Site: últimos chequeos sintéticos **históricos** de primario `gemini-2.5-flash` y respaldo `gemini-2.5-flash-lite` devolvieron HTTP 404, `verified=false`; tercero `gemini-3.5-flash-lite` HTTP 200, `verified=true`. No se hicieron nuevos chequeos de modelos ni se cambió proveedor.
- `AGENTS.md` establece Leo/Ventas, Mila/Servicio al cliente, Vera/Finanzas, Alma/Química y farmacia, Nico/Logística, Lía/Mercadeo. Hay un resultado histórico de un objetivo que asigna especialidades diferentes; requiere cotejo con la fuente **vigente** antes de corregir, sin alterar recibos.
- Se conserva como antecedente proporcionado la fuente nativa v53 (commit `5be977154cc15c9511787d22e28b7367e6f00467`) y sus 122 pruebas de servidor en worktree. **No se repitieron ni se infiere que prueben el Site actualmente desplegado.** No se activó v54 ni se verificó nativamente qué versión está desplegada.

## Pendiente para validación final
1. Cotejar versión y fuente realmente desplegadas mediante acceso nativo de Sites, preservando los cambios actuales; resolver diferencia de especialidades solo tras ese cotejo.
2. Demostrar recuperación real de modelos primario y respaldo o documentar bloqueo actual con una prueba aislada autorizada y sin agotar cuota.
3. Pruebas dinámicas aisladas de locks, reintentos, idempotencia, pausa/reanudación y `not_before`, con recibos, sin competir con el cron real.
4. Recibos operativos correlacionados de aprobación, fabricación, aprovisionamiento privado y entrega E2E para cliente sintético, distinguiéndolos de ejercicios de texto y de `idle`.
5. Aceptación de cliente real cuando exista. Hasta entonces mantener **cierre provisional sin certificación**.

**Acciones:** solo lectura de Supabase, GitHub, conector del Site y estado de respaldo, y este registro documental. No se modificaron Site, código funcional, cron, cuota, fechas, credenciales, tareas, destinatarios, pagos ni versión. No se creó ejecutor ni trigger adicional.
