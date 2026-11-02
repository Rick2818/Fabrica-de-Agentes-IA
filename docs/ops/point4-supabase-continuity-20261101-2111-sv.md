# Fábrica de Agentes IA — Punto 4 — auditoría de continuidad (2026-11-01 21:11 CST, UTC−06)

## Alcance y criterio rector
Punto 4 **CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN** (instrucción 2026-10-29). Esta revisión es de solo lectura salvo este registro documental. No constituye aceptación de cliente ni certificación. No se modificaron Site, código, cron, cuota, fechas, cola, trabajos, ejecutores, versiones o proveedores. Site: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; Supabase: `udispwzwrebjkanudcoy`. Se preserva v54 guardada, sin desplegar.

## Evidencia consultada en este corte
- Supabase `get_project`: `ACTIVE_HEALTHY`.
- `cron.job`: **un solo** job `fabrica-queue`, id 1, `active=true`, frecuencia `* * * * *`. `cron.job_run_details`: **6,234** registros `succeeded`; último leído `2026-11-02T03:11:00Z` (runid 6234). **SQL succeeded no equivale a trabajo `done`.**
- `private.fabrica_scheduler_receipts`: **5,492** recibos, **5,486** verificados, **6** no verificados; **5** `network_error` históricos; **89** recibos `idle` verificados en 90 minutos; cero errores nuevos en esa ventana. UUID de ciclo únicos 5,492/5,492 y request IDs únicos 5,492/5,492. No se hallaron conciliaciones sin resultado con más de 3 minutos y sin código de error.
- Distribución de recibos verificados: `idle` 5,469; `done` 9; `waiting` 4; `error` 2; `quota` 1; `busy` 1. Son estados históricos de ciclos, **no** entregas nuevas. Un HTTP 200 verificado con estado `error`, `quota` o `waiting` no se debe contar como `done`.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`.
- Último ciclo **conciliado**: `3c56bcce-a76b-4a64-abec-8429fdc1981c` (03:11Z), HTTP 200, `verified=true`, `site_status=idle`. Ciclo `e2964c90-f370-4141-8649-fa38f1b4ed83` (03:12Z) aparece como `idle` en el Site, pero **no estaba conciliado en SQL** al corte. No marcarlo aprobado.
- Site, mediante conector nativo `agent_status`: 65 trabajos: **60 `done`**, 2 `failed`, 3 `cancelled`, **0 pendientes**; uso **0/20**. `health.supabase_runner` y `health.autonomy.primary` muestran ciclo `idle` reciente, con UUID `e2964c90-f370-4141-8649-fa38f1b4ed83`; no constituye procesamiento funcional. Seis prácticas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` permanecen `done` con recibos de generación; no certifican fabricación/entrega.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a` sigue habilitado. Última ejecución registrada `2026-11-02T03:05:19Z`, resultado `no_update`; no se activó ni se disparó desde esta auditoría.
- Los **siete** archivos `.github/workflows/*.yml` en `main` se leyeron individualmente: ninguno contiene `schedule:`; los eventos observados son manuales y/o push/pull_request. No usar workflows verdes como evidencia de schedule.
- `AGENTS.md` revisado: Alma = Química y farmacia; Lía = Mercadeo. El título histórico de `synthetic-six-20261028-alma` dice «Mercadeo»; conservar ese recibo y contrastar identidad con la fuente Site vigente, sin reescribir historial.
- Inspección estática de funciones SQL `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile`: bloqueo transaccional advisory, verificación de fuente/proyecto/schedule/UUID/timestamp del recibo, espera de respuesta, `not_before` para `next_at`, pausa por error y registro de respuesta faltante; índices únicos en `cycle_id` y `request_id`. Esto no sustituye pruebas dinámicas de concurrencia, idempotencia, pausas ni recuperación.
- Consulta de logs Supabase para `2026-11-02T01:30Z`–`03:11Z`: fuentes `postgres_logs` y `pgbouncer_logs`; el filtro textual de error/fatal sobre el campo consultado no encontró coincidencias. Cobertura limitada al campo/fuentes y ventana indicados.
- `health.model_checks` del Site: primario `gemini-2.5-flash` HTTP 404 `verified=false`; respaldo `gemini-2.5-flash-lite` HTTP 404 `verified=false`; tercero `gemini-3.5-flash-lite` HTTP 200 `verified=true` en una prueba sintética histórica. No repetir pruebas ni alterar cuotas/modelos sin condiciones seguras. Que otros trabajos muestren `gemini-3.6-flash` no prueba recuperación de los dos modelos configurados.

## Pendientes y límites
1. Cotejo **nativo** de la fuente efectiva desplegada en Sites y sus URL, con referencia a v53/commit `5be977154cc15c9511787d22e28b7367e6f00467` (122 pruebas de servidor históricas). El conector disponible entrega estado operativo, pero no el identificador de la versión desplegada: **no verificado en este corte**. v54 no activada.
2. Pruebas dinámicas **aisladas** y seguras de locks, concurrencia, reintentos, pausa, idempotencia, `not_before` y recuperación; **no ejecutadas en este corte**.
3. Resolver y volver a demostrar la salud del primario/respaldo Gemini, sin asumir que un modelo tercero exitoso los certifica.
4. Recibos operativos E2E de aprobación, fabricación, entrega y recuperación, separados de respuestas de entrenamiento; **no demostrados**.
5. Aceptación con cliente real: **pendiente por ausencia de cliente**, sin reabrir el cierre administrativo.

**Conclusión:** no hay evidencia de una regresión reciente en el programador en los datos consultados. La cola vacía y los ciclos `idle` no demuestran autonomía funcional completa. Mantener cierre provisional sin certificación. Ninguna intervención productiva fue realizada.
