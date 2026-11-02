# Fábrica de Agentes IA — Punto 4 — auditoría de continuidad (2026-11-02 10:11, America/El_Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría exclusiva de punto 4; no confundir con estación 4 del diseño ni con GitHub issue #4. No se procesó la cola ni se modificó producción.

## Fuentes y alcance
- Supabase proyecto `udispwzwrebjkanudcoy`: consultas SQL de solo lectura a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, índices y definiciones de `fabrica_scheduler_tick`/`fabrica_scheduler_reconcile`. **Corte de cifras: 2026-11-02 16:11:38.599514 UTC**.
- Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`: complemento nativo `agent_status` para cola, recibos, salud y modelos. Este complemento **no permite consultar el inventario nativo de versiones o la fuente efectivamente desplegada**.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md`, siete workflows YAML, documento de auditoría anterior (09:15).
- Respaldo existente: comprobación privada de la automatización `6adbf94d28e8819189c0516c6068457a`.
- Logs Supabase: ventana **2026-11-02T14:40:00Z–16:12:00Z**; agrupación por fuente. No se verificó severidad porque el campo consultado resultó vacío.

## Resultados comprobados
1. **Cron principal:** único job SQL `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`; comando `select private.fabrica_scheduler_tick();`. `cron.job_run_details`: **7,014 succeeded, 0 otros estados**. Incremento frente al control de 09:15: **+56 succeeded**. Esto acredita ejecución SQL, no trabajo funcional `done`.
2. **Recibos:** **6,271** registros en `private.fabrica_scheduler_receipts`, **6,265 verified=true**, **5 `network_error` históricos**, **1 ciclo recién emitido sin conciliar**, **0 UUID de ciclo duplicados y 0 request_id duplicados**. Incremento frente al control 09:15: **+56 recibos y +56 verificados**. La consulta de control halló **5 recibos no verificados de más de 3 minutos**, todos asociados a los errores históricos; no se deben presentar como ciclos pendientes recientes.
3. **Estados históricos:** 6,249 `idle` verificados, 9 `done` verificados, 4 `waiting`, 2 `error`, 1 `quota`, 1 `busy` y 5 `network_error` sin verificación; el último ciclo sin conciliar no es éxito. En los últimos 90 minutos: **89 ciclos `idle` verificados**, sin nuevos `done`.
4. **Conciliación cruzada:** el ciclo `a5d8c554-8bf9-44c7-8606-3e8b23f3b84c` (16:10 UTC) aparece en Site `health.autonomy.cycles` con `source=supabase-cron`, `status=idle` y en SQL con `request_id=6271`, `http_status=200`, `verified=true`, `site_status=idle`, `error_code=null`, `checked_at=16:11:00.046677 UTC`. **No acredita procesamiento `done`**. El ciclo siguiente `1beddf1a-5bf7-438a-a4c2-07d8025e9227` (16:11 UTC) consta como `idle` en Site, pero en SQL estaba pendiente de conciliación al corte: **no se declara verificado**.
5. **Configuración y seguridad de continuidad:** `enabled=true`, `not_before=null`, `last_error=null`. Definiciones SQL revisadas: `pg_try_advisory_xact_lock(1432658222,51)`, `FOR UPDATE`, espera de recibos pendientes, conciliación de UUID/identidad/origen/tiempos/estado, backoff de cinco minutos ante error, `response_missing` y respeto de `not_before`. Índices únicos sobre `cycle_id` y `request_id`. **Inspección estática, no prueba dinámica aislada de concurrencia o recuperación**.
6. **Site y seis agentes:** `agent_status` devuelve **65 trabajos: 60 `done`, 2 `failed` históricos, 3 `cancelled`, 0 pendientes**; cuota **0/20** y último ciclo Supabase reciente. Las seis prácticas sintéticas históricas no constituyen aceptación de cliente ni recibos de fabricación y entrega E2E del mismo pedido. No se lanzaron nuevas pruebas ni se consumió cuota.
7. **Modelos:** `gemini-2.5-flash` primario y `gemini-2.5-flash-lite` respaldo conservan últimos chequeos sintéticos **HTTP 404**; `gemini-3.5-flash-lite` tercero **HTTP 200** en el último chequeo almacenado. No se probó recuperación actual ni se repitieron sondas. Nota histórica de Site menciona v58 desplegada el 29-10; **no se deduce de esa nota la versión actualmente publicada**. Se conserva la recuperación previa de la fuente v53 (commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas en worktree); no se activó v54.
8. **GitHub:** leídos los siete workflows de `.github/workflows`; ninguno contiene disparador `schedule`. `agent-runner.yml` solo permite `workflow_dispatch`; otros usan push/PR o ejecución manual. El antiguo recibo GitHub con `event=schedule` del 28-10 es histórico, no programación actual.
9. **Respaldo horario:** `6adbf94d28e8819189c0516c6068457a` permanece **is_enabled=true**; último resultado `no_update`, ejecución registrada **2026-11-02 16:08:24–16:08:28 UTC**. No se lanzó otro ejecutor.
10. **Logs:** la consulta de la ventana devolvió **219 `postgres_logs` y 6 `pgbouncer_logs`**. El atributo `log_attributes['error_severity']` resultó vacío en todos los registros PostgreSQL de esta muestra; **no se infiere ausencia de errores**.
11. **Inconsistencia documental a conciliar, sin alterar identidades:** `AGENTS.md` asigna **Alma=Química/Farmacia y Lía=Mercadeo**, mientras el resultado histórico de un objetivo del Site describe **Alma=Mercadeo y Lía=Legal/Cumplimiento**. No es prueba de regresión del runtime, pero impide dar por validada la correspondencia de especialidades de las seis mascotas sin cotejar fuente Site vigente y recibos. No corregir por suposición ni modificar recibos históricos.

## Pendientes no aprobados
- Cotejar nativamente versión y fuente realmente desplegadas en Sites; conservar fuente y audiencia vigentes y mantener v54 sin activar.
- Validar en entorno aislado locks, reintentos, pausas, idempotencia, `not_before` y recuperación con fallos inducidos sin ejecutar el cron real ni alterar cuota/fechas.
- Resolver o caracterizar los HTTP 404 de primario/respaldo sin gastos ni cambios no autorizados.
- Conciliar la matriz de identidades y especialidades de los seis agentes contra la fuente actual del Site.
- Obtener recibos operativos correlacionados E2E de registro, aprobación, fabricación, aprovisionamiento y entrega de un mismo pedido sintético; no confundir tareas de texto `done` con entrega.
- Aceptación final con cliente real cuando exista; no reabrir cierre administrativo por su ausencia.

## Intervención
Única escritura prevista: **este informe de evidencia** en GitHub. No se modificaron Site, versiones, Supabase, cron, ejecutor principal, respaldo, cuotas, tareas, credenciales, envíos, pagos ni terceros. **Sin nueva regresión operativa demostrada; inconsistencia documental pendiente de cotejo. Estado: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.**
