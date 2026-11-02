# Punto 4 — Auditoría de continuidad (2026-11-02 14:06 America/El_Salvador)

**Estado rector: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** No cambiar este estado por ausencia de cliente real. Auditoría de solo lectura, sin ejecutar la cola ni modificar Site, producción, cuotas, fechas, ejecutores o datos de terceros.

## Alcance y procedencia

- Site: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`. Estado funcional leído mediante el conector nativo de Fábrica (`agent_status`), **no** inspección nueva de versión/deployment en la consola nativa de Sites.
- Repositorio: `Rick2818/Fabrica-de-Agentes-IA`, `AGENTS.md` leído desde `main`.
- Supabase: `udispwzwrebjkanudcoy`, consultas SQL **solo lectura** a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, catálogos de funciones e índices; logs consultados.
- Corte SQL: `2026-11-02 20:06:10.637972+00` (14:06 El Salvador).
- No se disparó `run_pending_tasks`, `fabrica_scheduler_tick`, pruebas de modelos, envíos ni pruebas sintéticas nuevas.

## Evidencia del programador

- Supabase project: `ACTIVE_HEALTHY`. Cron único `jobid=1`, `jobname=fabrica-queue`, `schedule=* * * * *`, `active=true`, comando invoca `fabrica_scheduler_tick`. Configuración: `enabled=true`, `not_before=null`, `last_error=null`.
- `cron.job_run_details`: **7,249** ejecuciones `succeeded` y **0** de otro estado (total consultado para jobid=1). El éxito SQL no prueba trabajo funcional `done`.
- `private.fabrica_scheduler_receipts`: **6,506** recibos, **6,500** `verified=true`; **9** `verified=true AND site_status='done'` históricos, **6,483** `verified=true AND site_status='idle'`; **90** `idle` verificados en últimos 90 minutos, sin nuevo `done` demostrado.
- **Cinco** recibos históricos `network_error`, `verified=false`, último `2026-10-31 14:57:00+00`; sin aumento respecto a auditoría anterior. Una conciliación reciente estaba pendiente de menos de tres minutos: `ff53eaf1-9f9a-4fd6-b882-038d813771ee` a las 20:06:00 UTC, `request_id=6507`, `verified=false` al corte. No declarar ese ciclo verificado.
- Conciliación confirmada anterior: UUID `6ac86377-8036-4342-9e9f-a9859dc0e8da`, `request_id=6506`, `scheduled_at=2026-11-02 20:05:00.034+00`, `checked_at=2026-11-02 20:06:00.053870+00`, HTTP 200, `verified=true`, `site_status=idle`, `error_code=null`. El conector Site contiene el mismo UUID y estado `idle`; no se interpreta como entrega `done`.
- **0** UUID duplicados (conteo menos distintos); índices únicos en `cycle_id` y `request_id`. La función `fabrica_scheduler_tick` contiene mecanismo de bloqueo y control `not_before`; la reconciliación también consulta `not_before`. Verificación estática, no prueba dinámica de concurrencia.
- Consulta de `postgres_logs` entre 18:00 y 20:06 UTC con filtro ERROR/FATAL: **0** resultados en el alcance consultado; no equivale a ausencia de todos los errores posibles.

## Site, cola, especialidades y respaldo

- Estado leído del Site: **60** trabajos `done`, **2** `failed` históricos, **3** `cancelled`, **0** pendientes, **0** leases activos. Hay trabajos históricos recuperados tras 2–5 intentos; no se generaron nuevos reintentos.
- Cuota reportada por Site: **0/20**. `autonomy.status=recent`, `deferred_until=null`, último ciclo Supabase con UUID `ff53eaf1-9f9a-4fd6-b882-038d813771ee`, estado `idle`. El recibo del Site por sí solo no sustituye la conciliación SQL.
- Las seis prácticas sintéticas históricas siguen siendo ejercicios; **no** certifican fabricación ni entrega E2E ni aceptación de cliente.
- Identidades rectoras de `AGENTS.md`: Leo/Ventas, Mila/Servicio al cliente, Vera/Finanzas, Alma/Química y farmacia, Nico/Logística, Lía/Mercadeo. Textos antiguos que reasignan Alma/Lía no deben usarse como catálogo vigente.
- Automatización existente **Respaldo de pendientes Fábrica IA** (`6adbf94d28e8819189c0516c6068457a`) verificada `is_enabled=true`; auditoría Punto 4 también `is_enabled=true`. No se creó ni disparó respaldo adicional.
- Los **7** workflows bajo `.github/workflows/` fueron leídos individualmente en `main`: ninguno contiene disparador `schedule`. `agent-runner.yml` es `workflow_dispatch` manual; otros workflows pueden dispararse por `push` o `pull_request`, no por cron.

## Modelos y límites de certificación

- Configuración Site: primario `gemini-2.5-flash`, respaldo `gemini-2.5-flash-lite`, tercero `gemini-3.5-flash-lite`. **Últimas pruebas sintéticas guardadas** (no repetidas hoy): primario HTTP 404 no verificado, respaldo HTTP 404 no verificado, tercero HTTP 200 verificado. No declarar recuperación integral ni disponibilidad de los tres modelos.
- La fuente nativa asociada a v53 se recuperó históricamente en commit `5be977154cc15c9511787d22e28b7367e6f00467`, con 122 pruebas de servidor aprobadas sobre worktree aislado. No se repitió ni se invalidó esa evidencia. **Pendiente** cotejo nativo de la versión efectivamente desplegada en Sites; una nota antigua menciona v58, pero no se comprobó hoy en la consola nativa. v54 permanece sin activación por esta auditoría.
- Pendiente: pruebas dinámicas aisladas de locks/reintentos/pausa/recuperación; validación real del fallback de modelos; recibos verificables de aprobación, fabricación, cabina y entrega E2E con aislamiento de cliente; validación final por cliente real. No marcar ninguna como aprobada.
- Pedido sintético #4 continúa documentado como borrador sin recibos operativos de aprobación/fabricación (ámbito del punto 5; no confundirlo con el cierre del punto 4).
- No se encontró regresión operativa nueva en la evidencia revisada. No se aplicaron correcciones de producción, cambios de fuente ni activaciones.

**Conclusión:** el punto 4 conserva cierre provisional **SIN CERTIFICACIÓN**; cron principal y respaldo preservados; nueva evidencia es observacional y no equivale a aceptación final.

## Conciliación posterior al corte (evidencia adicional)

Consulta independiente posterior: el ciclo `ff53eaf1-9f9a-4fd6-b882-038d813771ee` fue conciliado en `2026-11-02 20:07:00.031286+00` con HTTP 200, `verified=true`, `site_status=idle`, `error_code=null`. Al corte original estaba pendiente, por lo que la anotación histórica se mantiene correcta; la verificación posterior elimina esa incertidumbre puntual, pero **no** acredita un trabajo `done` ni entrega funcional.
