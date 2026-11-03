# Fábrica IA — Punto 4 · Auditoría de continuidad (2026-11-02 18:07 SV)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Solo lectura, sin alteraciones de producción. Este documento corresponde al punto 4 administrativo/técnico, no a la estación 4 del diseño ni al issue #4.

## Alcance y fuentes

- Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`: lectura del estado real a través del complemento Fábrica de Agentes IA. **No se obtuvo en este control metadato nativo de la versión efectivamente desplegada**, ni se comparó fuente desplegada con el commit de v53. La recuperación histórica de la fuente v53 (`5be977154cc15c9511787d22e28b7367e6f00467`) y sus 122 pruebas aprobadas **no se repitieron**.
- Supabase `udispwzwrebjkanudcoy`: consultas SQL de solo lectura a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, índices y metadatos de funciones. Estado de proyecto `ACTIVE_HEALTHY`.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y siete workflows leídos individualmente desde `main`.
- Automatización existente `Respaldo de pendientes Fábrica IA`: lectura de estado; no se ejecutó ni modificó.

## Corte SQL: 2026-11-03 00:07:31 UTC (2026-11-02 18:07:31 SV)

- Único job Supabase `fabrica-queue`, `jobid=1`, `schedule=* * * * *`, `active=true`. Configuración: `enabled=true`, `not_before=NULL`, `last_error=NULL`.
- `cron.job_run_details`: **7,490** filas `succeeded`, **0** en otro estado; último inicio `2026-11-03 00:07:00 UTC`. En los 90 minutos anteriores: 90 `succeeded`. **Éxito SQL no equivale a procesamiento `done`.**
- `private.fabrica_scheduler_receipts`: **6,747** recibos, **6,741** `verified=true`, **6** `verified=false`; **5** `network_error` históricos (30–31 de octubre). `cycle_id` duplicados: **0**. Recibos no verificados sin error y con antigüedad mayor de 3 minutos: **0**.
- Últimos 90 minutos: **89** recibos `idle` verificados y **0** recibos `done` verificados; el ciclo más reciente aún estaba sin conciliar al corte.
- Ciclo `1e881610-2baf-4fd6-9838-93c3d9bf707d`, programado `00:06 UTC`: `http_status=200`, `verified=true`, `site_status=idle`, `error_code=NULL`. Concordante con la secuencia de ciclos del Site. **No acredita entrega funcional.**
- Ciclo `4e879ede-d215-44f8-86d6-ff29dd9461f4`, programado `00:07 UTC`: el Site reportó ciclo `idle` con ese UUID, pero el recibo SQL todavía estaba `verified=false`, sin `checked_at` ni `site_status`. **No se declara conciliado**; su antigüedad al corte era menor de un minuto.
- Índices únicos de recibos: PK por `cycle_id` y restricción única de `request_id`. Funciones `fabrica_scheduler_tick` y `fabrica_scheduler_reconcile` presentes; ambas mencionan `not_before`. La primera contiene `pg_try_advisory` y `FOR UPDATE`. La revisión estática de estos mecanismos no sustituye pruebas dinámicas de recuperación, reintentos e idempotencia.
- Logs `postgres_logs` del intervalo `2026-11-02 22:00` a `2026-11-03 00:10 UTC`: **308** eventos, **0** coincidencias textuales `ERROR` o `FATAL` en `event_message` según la consulta. Esto no equivale a ausencia universal de fallos en todos los servicios.

## Estado Site, modelos y seis agentes

- Tablero Site: **65** trabajos (60 `done`, 2 `failed` históricos, 3 `cancelled`); **0 pendientes**. Cuota **0/20**. Último ciclo `source=supabase-cron`, `status=idle`, `pending=0`, sin `next_at`; `health.autonomy.status=recent`. No hay procesamiento funcional nuevo.
- Modelos configurados: primario `gemini-2.5-flash`, respaldo `gemini-2.5-flash-lite`, tercero `gemini-3.5-flash-lite`. Últimos chequeos sintéticos guardados: primario HTTP 404, respaldo HTTP 404, tercero HTTP 200. **No se repitieron pruebas de recuperación ni se certifica failover**. El historial de tareas terminadas con otro modelo tampoco prueba el funcionamiento actual de los dos primeros.
- `AGENTS.md` define Leo/Ventas, Mila/Servicio al cliente, Vera/Finanzas, Alma/Química y farmacia, Nico/Logística y Lía/Mercadeo. Existen resultados históricos con especialidades divergentes; **no se reasignaron nombres ni se alteraron recibos**. Pendiente cotejar la fuente Site efectivamente desplegada.
- Las prácticas sintéticas `done` acreditan respuestas analíticas delimitadas, **no** fabricación, entrega E2E, aceptación del cliente ni certificación.

## GitHub y respaldo

- Los siete workflows existentes (`agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`) fueron leídos individualmente; **ninguno tiene disparador `schedule`**. `agent-runner.yml` solo `workflow_dispatch`; otros workflows incluyen disparadores `push` o `pull_request`, no programación periódica.
- El respaldo horario existente está `is_enabled=true`. Última ejecución registrada: `2026-11-03 00:00:52–00:02:25 UTC`, estado `completed`. No se invocó `run_pending_tasks` ni se creó segundo ejecutor.

## Pendientes para validación final

1. Cotejar **nativamente** versión y fuente del Site efectivamente desplegado con la fuente v53 recuperada, sin sustituir código ni activar v54 (guardada sin desplegar).
2. Ejecutar en entorno seguro/aislado pruebas dinámicas de locks, reintentos, idempotencia, reanudación, respeto de `not_before`, continuidad de Leo y los seis agentes.
3. Resolver y verificar los HTTP 404 del primario y respaldo, con prueba de failover y recibos propios.
4. Conciliar identidades/especialidades con la versión desplegada y producir recibos operativos verificables de aprobación, fabricación y entrega E2E sintética; distinguirlos de recibos de texto.
5. Obtener aceptación final con cliente real cuando exista; su ausencia **no reabre** el cierre provisional.

**Cambios operativos realizados:** ninguno. No se forzó tick, no se alteraron cuotas/fechas/locks/trabajos, no se enviaron correos, no se usaron pagos ni cuentas ajenas. El ejecutor principal y el respaldo permanecen intactos. v54 no se activó. Solo se agrega este registro de auditoría.
