# Fábrica de Agentes IA · Punto 4 — control de continuidad 2026-10-31 02:12 SV

**ESTADO RECTOR: CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Auditoría de solo lectura, sin disparos manuales, modificaciones de Site, cuotas, fechas, ejecutores, modelos, tareas, envíos ni producción. No se reabre por ausencia de cliente real.

## Alcance y fuentes observadas
- Proyecto Supabase `udispwzwrebjkanudcoy`: consulta directa del proyecto, `cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, hashes de funciones SQL e índices.
- Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`: lectura operativa de `agent_status` por MCP. **No es inspección nativa independiente del código exacto desplegado.**
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md` y los siete archivos de `.github/workflows/` leídos individualmente sobre `main`.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: `Automations.peek` muestra `is_enabled=true`; último run registrado `no_update` a 2026-10-31 07:46:33 UTC, sin `latest_result`. No atribuirle entregas sin recibo.
- Logs Supabase 2026-10-31 07:00–08:12 UTC: 177 `postgres_logs`, tres `pgbouncer_logs`; filtro `error`/`timeout` en `event_message` sin coincidencias. Un filtro vacío no determina causa raíz ni prueba ausencia universal de errores.

## Hallazgos con evidencia
1. Supabase `ACTIVE_HEALTHY`. Un solo job `fabrica-queue`, `jobid=1`, `active=true`, `* * * * *`, comando `select private.fabrica_scheduler_tick();`. Configuración `enabled=true`, `not_before=NULL`, `last_error=NULL`.
2. Corte de SQL a ~08:12 UTC: **3,655 ejecuciones `cron.job_run_details.status=succeeded`**; **2,917 recibos**, **2,912 `verified=true`**. Frente al corte 01:09 SV: +63 SQL, +63 recibos, +63 verificados. **Nueve `site_status=done` históricos, sin entregas nuevas**. Cuatro `network_error` históricos, sin aumento. Cinco no verificados incluyen cuatro errores y un ciclo de conciliación pendiente.
3. UUID `06fa7e2c-4123-4b17-bdb4-89503b3e4e75` (08:11 UTC): `verified=true`, HTTP 200, `site_status=idle`; visible en historial del Site. UUID `7e58eb02-19ab-4883-ada4-ba034f7ebf1c` (08:12 UTC): Site reporta `source=supabase-cron`, `status=idle`, pero en SQL al corte sigue `verified=false`, `http_status=NULL`, `site_status=NULL`. **No acreditarlo como conciliado ni como `done`.**
4. Site `agent_status`: 65 trabajos: **60 `done`, 2 `failed`, 3 `cancelled`, cero pendientes**; sin leases activos ni reintentos vencidos en esa cola visible. `usage=0/20`; `health.supabase_runner.status=idle`, `pending=0`, `next_at=null`; autonomía `recent`. No se crearon pruebas sintéticas nuevas.
5. `fabrica_scheduler_tick` MD5 `7fb25848caa91dc78eb0f469659f691d`; `fabrica_scheduler_reconcile` MD5 `78a1057460b103ae1cddfb5d5e0339f0`, ambos iguales al corte anterior. Lectura estática confirma referencia a advisory lock en tick y `not_before` en ambas funciones; no prueba comportamiento bajo concurrencia real. Índices únicos `cycle_id` y `request_id` presentes; cero grupos duplicados en el corte de 08:11 UTC.
6. GitHub: **siete workflows** examinados individualmente, ninguno tiene `on.schedule`. El runner usa `workflow_dispatch`; otros admiten eventos de CI. GitHub no es el ejecutor programado.
7. Gemini: probes sintéticos **históricos**, no repetidos hoy: principal `gemini-2.5-flash` HTTP 404; respaldo `gemini-2.5-flash-lite` HTTP 404; tercero `gemini-3.5-flash-lite` HTTP 200. No demuestra fallback automático real E2E ni que los dos primeros estén operativos.
8. Fuente histórica del Site v53 recuperada nativamente: commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas de servidor aprobadas en worktree aislado **en una ejecución anterior**. No se ejecutó suite nueva ni se verificó en esta pasada el SHA efectivamente desplegado. La v54 guardada no se activó. Metadatos históricos del tablero mencionan v58, pero no sustituyen comprobación nativa del despliegue.

## Gates pendientes — no aprobados
- Comparación nativa de fuente/SHA con la versión efectivamente publicada del Site, preservando el Site actual.
- Pruebas dinámicas aisladas y no competitivas de locks, colisión/idempotencia, reintentos, pausas, `not_before`, recuperación y fallback real; pruebas de punta a punta con recibos operativos para los seis agentes, separadas de la aceptación de cliente.
- Causa raíz de cuatro `network_error` históricos.
- Aceptación final con cliente real cuando exista, sin reabrir el cierre provisional por su ausencia.

**Decisión:** conservar principal y respaldo habilitados, no disparar ticks, no crear trabajos ni desplegar versiones; sin regresión nueva observada en los indicadores consultados. **Punto 4 cerrado provisionalmente, SIN CERTIFICACIÓN.**
