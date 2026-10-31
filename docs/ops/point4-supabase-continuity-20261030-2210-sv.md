# Punto 4 — auditoría de continuidad — 2026-10-30 22:10 SV

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. No hay cliente real para aceptación final. Este control fue de solo lectura y no modificó el Site, la cola, cuotas, cron, fechas, proveedores ni despliegues.

## Alcance y fuentes verificadas
- Supabase proyecto `udispwzwrebjkanudcoy`: `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, índices de unicidad, funciones SQL y logs.
- Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`: consulta mediante `agent_status` del complemento de la Fábrica (jobs, health, usage, modelos y ciclos).
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y los siete archivos actuales en `.github/workflows`.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: consulta de su estado mediante Automations.peek.

## Resultados observados
- `cron.job`: un solo job `fabrica-queue`, jobid 1, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: 3,412 ejecuciones SQL `succeeded`, 0 fallidas, última `2026-10-31T04:09:00Z`. Esto acredita invocación SQL, **no** entrega funcional.
- `private.fabrica_scheduler_receipts`: 2,674 recibos, 2,669 `verified=true`, 9 `site_status=done` históricos, 4 `network_error` históricos. Distribución observada: 2,653 `idle` verificados, 9 `done`, 4 `waiting`, 2 `error`, 1 `quota`, 1 `busy`, 4 `network_error` y 1 sin conciliar al corte de la consulta. La lectura de agregados ocurrió ligeramente después de la lectura del detalle y puede reflejar una conciliación adicional.
- Último recibo conciliado en detalle: `cycle_id=da838dec-05a2-496e-ae18-78c7a4bb7b4f`, `scheduled_at=2026-10-31T04:08:00.053Z`, `verified=true`, HTTP 200, `site_status=idle`. Último ciclo al corte: `f406d94e-2f07-47cb-ac24-07104f0ff1ac`, `scheduled_at=2026-10-31T04:09:00.042Z`, visto en Site como `idle` y todavía sin conciliación SQL al instante de consulta. No se cuenta como `done`.
- Configuración: `enabled=true`, `not_before=NULL`, `last_error=NULL`. Sin alteraciones.
- Duplicados en recibos: 0 grupos por `cycle_id` y 0 por `request_id`. Existen índices únicos para ambos campos. Hash MD5 de definición de funciones: `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. Estos valores documentan la lectura actual, sin certificar invariancia contra fuente desplegada.
- Site: 65 trabajos visibles, 60 `done`, 2 `failed`, 3 `cancelled`, 0 pendientes. Sin trabajo activo, lease ni reintento vencido en la cola visible. Cuota 0/20, `next_at=NULL`, `health.autonomy.primary.recent=true`, ciclo reciente `idle` con `source=supabase-cron`; ninguna nueva entrega.
- Logs de PostgreSQL en la ventana `2026-10-31T03:00:00Z` a `04:12:00Z`: 0 mensajes que contengan `error` o `timeout` en el filtro aplicado; se observan entradas de inicio del cron. No determina la causa de los cuatro `network_error` históricos.
- Respaldo horario habilitado. Último intento registrado `no_update`; no prueba procesamiento de cola ni se invocó el respaldo.
- Siete workflows actuales inspeccionados individualmente: ninguno contiene disparador `schedule`. `agent-runner.yml` solo `workflow_dispatch`; los demás tienen disparadores manuales y algunos `push`/`pull_request` para pruebas.
- `AGENTS.md` confirma preservación del Site original y del código fuente, pruebas de servidor y separación de proyectos.
- Evidencia sintética histórica de modelos: Gemini 2.5 Flash HTTP 404, Gemini 2.5 Flash Lite HTTP 404, tercer modelo Gemini 3.5 Flash Lite HTTP 200. No se repitió, no acredita fallback real E2E.
- Nota del Site registra metadatos de v58; **no se verificó de forma independiente la versión efectivamente desplegada** mediante acceso nativo de Sites en este control. Fuente original asociada a v53 recuperada previamente, commit `5be977154cc15c9511787d22e28b7367e6f00467` con 122 pruebas históricas aprobadas. No desplegar v54 ni sustituir fuente por copia antigua.

## Diferencias contra el control 21:10 SV
- Ejecuciones SQL: 3,353 → 3,412 (+59).
- Recibos: 2,614 → 2,674 (+60).
- Verificados: 2,609 → 2,669 (+60).
- Entregas `done`: 9 → 9 (sin cambio).
- Trabajos del Site: 60 `done`, 2 `failed`, 3 `cancelled`, 0 pendientes (sin cambio).
- Errores históricos `network_error`: 4 → 4 (sin cambio).

## Gates pendientes, no aprobados
1. Lectura nativa de Sites para cotejar versión y SHA efectivamente desplegados con la fuente recuperada, sin publicar v54.
2. Pruebas dinámicas **aisladas** de concurrencia, leases, pausa, reintento, recuperación, idempotencia y fallback, sin tocar cuota ni cola productiva.
3. Diagnóstico causal de cuatro `network_error` históricos; ausencia de errores nuevos no implica resolución.
4. E2E verificable de continuidad para los seis agentes con recibos reales del entorno de prueba, distinguiendo simulación de aceptación del cliente.
5. Aceptación final por cliente real cuando exista. El punto 4 sigue cerrado administrativamente sin certificación.

**Acciones realizadas:** consultas read-only y registro documental. No se invocó `fabrica_scheduler_tick`, no se ejecutaron trabajos, no se creó un ejecutor ni se tocó el respaldo. Ninguna prueba pendiente fue marcada como aprobada.
