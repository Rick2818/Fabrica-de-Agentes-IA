# Punto 4 — continuidad Supabase / Site — 2026-10-30 21:10 SV

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Solo auditoría read-only. No aceptación de cliente real.

## Alcance y fuentes consultadas
- Supabase proyecto `udispwzwrebjkanudcoy`: consultas SQL de `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`; consulta de logs de PostgreSQL entre 2026-10-31T02:00:00Z y 03:10:00Z.
- MCP del Site original `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`: `agent_status` (jobs, health, autonomy, quota y ciclos).
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: AGENTS.md y contenido de los siete archivos en `.github/workflows`.
- Automations.peek: respaldo `6adbf94d28e8819189c0516c6068457a` habilitado; último intento registrado `no_update`, no equivale a procesamiento de cola.

## Evidencia al corte
- `cron.job`: jobid=1, `fabrica-queue`, `* * * * *`, `active=true`, `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: 3,353 ejecuciones `succeeded` hasta 2026-10-31T03:10:00Z. El resultado SQL confirma invocación del tick, no un trabajo terminado.
- Conteo de recibos al corte anterior inmediato: 2,614 UUID únicos en tabla, 2,609 `verified=true`; 2,592 `idle`, nueve `done`, cuatro `waiting`, dos `error`, uno `busy`, uno `quota`, cuatro `network_error`, uno sin conciliar en el instante de lectura. El último recibo sin conciliar es transitorio y no se declara fallo definitivo.
- Recibo de 03:08Z: `cycle_id=faf7fc59-7785-4de8-b570-67d5b34317de`, `verified=true`, HTTP 200, `site_status=idle`. Recibo de 03:09Z `61d4c379-6a7f-4c34-b821-5b8930af436a` coincide con el último ciclo `idle` del Site pero aún no estaba conciliado al corte de esa consulta.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. No se alteró.
- Duplicados: 0 grupos por `cycle_id` y 0 por `request_id` en recibos.
- MCP Site: 65 trabajos visibles, 60 `done`, 2 `failed`, 3 `cancelled`, 0 pendientes; cuota 0/20; último ciclo Supabase `idle` con `pending=0`, sin `next_at`. No se observa entrega funcional nueva.
- Logs PostgreSQL 02:00–03:10Z: sin mensajes con 'error' o 'timeout' en el filtro consultado. Esto no diagnostica la causa de los cuatro `network_error` históricos.
- Siete workflows GitHub inspeccionados: ninguno contiene trigger `schedule`; el ejecutor `agent-runner.yml` tiene `workflow_dispatch`. Otros workflows incluyen `push`/`pull_request` para pruebas, no schedule.
- AGENTS.md confirma preservación del Site, uso de `worker/runtime.mjs`, pruebas `scripts/test-agent.mjs`, y separación de proyectos.
- Modelos, evidencia sintética histórica en `health.model_checks`: primario Gemini 2.5 Flash HTTP 404; respaldo Gemini 2.5 Flash Lite HTTP 404; tercero Gemini 3.5 Flash Lite HTTP 200. No es prueba dinámica nueva ni certificación de fallback automático.
- Metadatos guardados por Site mencionan despliegue v58; no se realizó lectura nativa del código ni validación independiente del deployment. No sustituir el rector de la fuente v53 recuperada ni activar v54.

## Pendiente / gates
1. Comparación nativa Sites de versión y SHA realmente desplegados con la fuente recuperada; no inferir del navegador ni de una nota guardada.
2. Pruebas aisladas, controladas y sin interferir con cola productiva de concurrencia, lease, reintento, idempotencia, pausa, recuperación y fallback real; **no ejecutadas en este control**.
3. Análisis causal de los cuatro `network_error` históricos, sin afirmar resolución.
4. E2E de seis agentes con recibos funcionales y separación clara de simulación y aceptación; **no repetido hoy**.
5. Aceptación final con cliente real cuando exista; punto 4 permanece cerrado provisionalmente y no certificado.

**Acciones:** solo lecturas y este registro documental. Sin disparar tick, sin alterar `not_before`, cuotas, trabajos, proveedores, credenciales, Site, cron, GitHub workflows, ni respaldo horario.
