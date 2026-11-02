# Fábrica de Agentes IA — Punto 4 — auditoría de continuidad (2026-11-02 09:15, America/El_Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. No equivale a estación 4 ni a issue #4. Control de solo lectura; no se procesó la cola ni se cambió producción.

## Fuentes y corte

- Supabase `udispwzwrebjkanudcoy`: `get_project`, consultas SQL read-only a `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, funciones e índices. Corte final SQL **2026-11-02 15:15:50.405169 UTC**.
- Complemento nativo Fábrica: `agent_status` (cola, modelos, recibos y salud). **No expone inventario nativo de versiones/código fuente del Site**. Site declarado: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`.
- GitHub: `AGENTS.md`, los siete YAML vigentes en `.github/workflows`, repositorio `Rick2818/Fabrica-de-Agentes-IA`.
- Respaldo: lectura privada de la automatización `6adbf94d28e8819189c0516c6068457a`.
- Logs Supabase: `2026-11-02T13:45:00Z` a `2026-11-02T15:15:00Z`.

## Evidencia verificada

1. **Cron SQL real**: Supabase `ACTIVE_HEALTHY`; único job `jobid=1`, `jobname=fabrica-queue`, `* * * * *`, `active=true`. `cron.job_run_details`: **6,958 succeeded, 0 otros estados**, 90 ejecuciones en la ventana reciente; último inicio `2026-11-02 15:15:00.048514+00`. Respecto al control 08:37: **+38 succeeded**. Esto solo acredita el paso SQL.
2. **Recibos conciliados**: al corte final **6,215 recibos, 6,209 verified, 1 pendiente, 0 pendientes vencidos >3 min**; **+38 recibos y +38 verificados** respecto al control 08:37. **Cinco errores históricos** `network_error`, sin incremento. En la ventana de 90 min: **89–90 ciclos `idle` conciliados** (según instante de consulta), **cero `done`**; los recuentos cambian naturalmente por el cron de un minuto. `cycle_id` y `request_id` sin duplicados.
3. **Conciliación cruzada Site–Supabase**: `agent_status.health.supabase_runner` y `health.autonomy.primary` muestran `cycle_id=1eb9b730-9aab-4eab-adcd-86c23a4a93be`, origen `supabase-cron`, estado `idle`. SQL muestra el mismo UUID con `request_id=6214`, `http_status=200`, `verified=true`, `site_status=idle`, `error_code=null`, conciliado `2026-11-02 15:14:00.044257+00`. **No es un trabajo `done`**. El ciclo `08f57b97-7398-454e-8dc7-db950080eef0` (15:15 UTC) estaba aún pendiente de conciliación en su corte; **no se declaró aprobado**.
4. **Pausas/locks/reintentos**: `enabled=true`, `not_before=null`, `last_error=null`. Definiciones SQL leídas: `pg_try_advisory_xact_lock(1432658222,51)`, `FOR UPDATE`, espera de recibos pendientes, validación del UUID/estado/timestamps del Site, backoff 5 min ante errores y `response_missing`, respeto de `not_before`. Índices únicos sobre `cycle_id` y `request_id`. **Inspección estática, no prueba dinámica de concurrencia o recuperación**.
5. **Cola del Site**: 65 trabajos: **60 done, 2 failed históricos, 3 cancelled, 0 pendientes**; `usage=0/20`, `next_run_at=null`; último ciclo principal reciente. Seis prácticas sintéticas históricas `done`, sin recibos E2E de aprobación/fabricación/entrega para un mismo pedido. El ejercicio de pedido #4 reconoce explícitamente ausencia de aprobación/fabricación.
6. **Modelos**: `gemini-2.5-flash` primario, `gemini-2.5-flash-lite` respaldo, `gemini-3.5-flash-lite` tercero. Últimos chequeos sintéticos almacenados: **HTTP 404, 404, 200**. No se gastó cuota ni se repitieron sondas; **primario/respaldo no recuperados de forma demostrada**.
7. **GitHub**: leídos individualmente `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno conserva trigger `schedule`**; `agent-runner.yml` solo `workflow_dispatch`. Los demás tienen disparadores manuales y/o push/PR, no programación.
8. **Respaldo**: automatización existente **habilitada**, último resultado `no_update` registrado a las 14:21 UTC; no se ejecutó ni se creó otro ejecutor.
9. **Logs**: ventana con **210 postgres_logs y 6 pgbouncer_logs**; severidad PostgreSQL: **208 LOG y 2 ERROR**, ambos SQLSTATE 42703 por consultas de auditoría que usaron erróneamente `created_at` en lugar de `checked_at` (14:36 y 15:13 UTC). **No son fallos del ejecutor**, pero se registran y se corrige el criterio de consulta; no se alteraron datos.
10. **Versión Site**: existe nota interna histórica que menciona v58 desplegada el 29-10, pero el conector disponible **no ofrece comprobación nativa del despliegue actual**. No se debe deducir la versión vigente de esa nota ni contradecir la recuperación previa de fuente v53 (`5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas en worktree). La instrucción sobre v54 guardada sin activar se conserva; **no se publicó versión alguna**.

## Pendientes — no aprobados

- Acceso nativo al inventario de versiones de Sites y cotejo con la fuente realmente desplegada, sin sustituir fuente vigente ni reusar copia antigua.
- Pruebas dinámicas **aisladas** de locks, reintentos, idempotencia, diferimiento y recuperación; no forzar tick, cuota ni `not_before`.
- Recuperación real y demostrada de Gemini primario/respaldo, sin gasto ni cambio de proveedor.
- Recibos operativos correlacionados E2E de registro, aprobación, fabricación, aprovisionamiento y entrega del mismo pedido sintético; distinguir de prácticas de texto.
- Aceptación final con cliente real cuando exista; **no reabrir cierre administrativo por su ausencia**.

## Intervención

Única escritura: **este documento de auditoría** en GitHub. No se modificaron Site, versiones, Supabase, cron, ejecutor principal, respaldo, cuotas, trabajos, credenciales, envíos, pagos ni terceros. No hay regresión operativa nueva demostrada. **CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN**.
