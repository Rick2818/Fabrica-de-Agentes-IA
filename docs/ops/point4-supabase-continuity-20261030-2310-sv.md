# Punto 4 — auditoría de continuidad — 2026-10-30 23:10 SV

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de solo lectura; no hubo cliente real ni aceptación final. No se invocó manualmente el ejecutor, no se procesó la cola, no se alteró la cuota, `not_before`, fechas, modelos, versiones, despliegues ni automatizaciones.

## Fuentes y alcance comprobados

- Supabase `udispwzwrebjkanudcoy` (proyecto `ACTIVE_HEALTHY`): `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, funciones SQL, índices, `net._http_response` y logs unificados de PostgreSQL.
- Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`: lectura del estado operativo mediante el complemento `agent_status`; **no** acceso nativo de Sites a la fuente desplegada en este control. El navegador conectado no estuvo disponible en este contexto; eso **no** significa que la fuente sea irrecuperable.
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md`, los siete workflows de `.github/workflows`, reporte previo y `main` anterior a esta nota `1d761574f855e9fda966bc6ef176163dbac39f16`.
- Respaldo horario existente `6adbf94d28e8819189c0516c6068457a`: `Automations.peek`, lectura sin ejecutarlo.

## Observaciones reales (corte aproximado 2026-10-31 05:09–05:10 UTC)

1. Cron: **un solo** `fabrica-queue` (jobid 1), `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. **3,472** ejecuciones SQL `succeeded`, cero no exitosas; última visible a las `05:09:00Z`. Esto acredita ejecución SQL, no trabajos `done`.
2. Recibos: **2,734** ciclos/UUID únicos y 2,734 `request_id` únicos; **2,729** `verified=true`, cuatro `network_error` históricos y un ciclo todavía sin conciliar al corte. **9** `site_status=done` históricos, **2,712** `idle`; ningún `done` nuevo en esta hora. No hay grupos de UUID ni `request_id` duplicados.
3. Ciclo `52dec5ff-388b-4877-8965-7d51dca25fae` (`05:09Z`): SQL posteriormente `verified=true`, HTTP 200, `site_status=idle`; su UUID coincide con el recibo del Site. Ciclo siguiente `b786a71f-4260-4d8f-b9d4-3307b81b203b` (`05:10Z`): el Site muestra `idle` y `source=supabase-cron`, pero su conciliación SQL aún era `NULL` al consultar. No se marca como `done` ni como `verified` sin conciliación.
4. Site: **65** trabajos visibles, **60 done**, **2 failed**, **3 cancelled**, **0 pendientes**. No se observaron leases activos ni reintentos vencidos en esa cola visible. Cuota **0/20**; `health.autonomy.primary.recent=true`; ciclo principal reciente `idle`. La lectura no acredita autonomía funcional general de las seis especialidades.
5. Configuración: `enabled=true`, `not_before=NULL`, `last_error=NULL`. Índices únicos por `cycle_id` y `request_id`. Hash MD5 de definiciones SQL sin cambio frente al control anterior: `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. El código inspeccionado contiene advisory lock, reconciliación, barrera de recibos pendientes, backoff y respeto a `not_before`; esto es **evidencia estática**, no prueba dinámica de concurrencia o recuperación.
6. Cuatro errores `network_error` históricos con demora cercana a 60 segundos entre solicitud y conciliación. No hay registros correspondientes en `net._http_response` al consultar, y el filtro de logs PostgreSQL de las 24 horas previas a `05:00Z` no encontró entradas con `error`, `timeout` o `pg_net`. **Causa raíz no demostrada**. No aparecieron nuevos errores en el último intervalo.
7. GitHub: los **siete workflows** fueron leídos individualmente; ninguno conserva `schedule`. `agent-runner.yml` usa `workflow_dispatch`; otros workflows usan eventos de prueba como `push` o `pull_request`. Un evento GitHub `schedule` histórico en la telemetría del Site no prueba que el disparador actual siga habilitado.
8. Respaldo horario: `is_enabled=true`, última ejecución registrada `no_update` a `2026-10-31T04:35:12Z`; `latest_result=null`. No se deduce procesamiento de cola ni aceptación de cliente.
9. Pruebas de modelos en historial del Site: Gemini 2.5 Flash HTTP 404; Gemini 2.5 Flash Lite HTTP 404; tercer modelo Gemini 3.5 Flash Lite HTTP 200. No se repitieron probes ni se certificó fallback E2E; no se consumió cuota. La nota del Site menciona v58, pero **no se comprobó nativamente el SHA efectivo desplegado**. La fuente original asociada a v53, commit `5be977154cc15c9511787d22e28b7367e6f00467`, tiene evidencia histórica de 122 pruebas de servidor aprobadas; no equivale a versión de producción. No desplegar v54 por este control.

## Diferencias frente al control de las 22:10 SV

- Ejecuciones SQL: **3,412 → 3,472** (+60).
- Recibos: **2,674 → 2,734** (+60).
- Recibos verificados: **2,669 → 2,729** (+60).
- Entregas históricas `done`: **9 → 9** (sin nueva entrega).
- Trabajos visibles: **60 done / 2 failed / 3 cancelled / 0 pendientes** (sin cambio).
- `network_error`: **4 → 4** (sin incremento).

## Puertas pendientes, explícitamente NO aprobadas

1. Comparación **nativa** de la versión y SHA del Site realmente desplegado contra la fuente vigente, preservando el Site y sin activar v54.
2. Pruebas dinámicas **aisladas** de concurrencia, locks/leases, idempotencia, pausa/reanudación, reintentos, recuperación y fallback. No ejecutadas en esta auditoría.
3. Explicación causal de los cuatro errores de transporte históricos; la ausencia de respuesta retenida impide inferir el motivo.
4. Recorrido E2E controlado y recibos auténticos de los seis agentes, distinguiendo pruebas sintéticas de aceptación de cliente.
5. Aceptación final con cliente real cuando exista; la ausencia de cliente no reabre el cierre administrativo del punto 4.

**Resultado:** Sin regresión nueva demostrada ni bloqueo que exija acción inmediata. Se conserva el cierre provisional sin certificación. Ninguna tarea, disparador, cuota, Site, despliegue, fuente o ejecutor fue modificado.
