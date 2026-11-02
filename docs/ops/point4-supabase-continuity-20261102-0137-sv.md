# Fábrica de Agentes IA — Punto 4 — continuidad (2026-11-02 01:37 CST, UTC−06)

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Auditoría de solo lectura de Supabase, conector Site, AGENTS.md, workflows GitHub y automatizaciones. Única escritura: este registro documental. No se ejecutó tick, no se procesó la cola, no se crearon ejecutores ni cron, no se alteraron cuota, `not_before`, modelos, Site, versión ni trabajos ajenos. No se desplegó v54.

## Evidencia nueva y cotejo
- Corte SQL: `2026-11-02 07:36:59.418338+00` (01:36:59 CST). Proyecto `udispwzwrebjkanudcoy` `ACTIVE_HEALTHY`.
- `cron.job`: **un solo** trabajo, `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`, `select private.fabrica_scheduler_tick();`. Configuración: `enabled=true`, `not_before=null`, `last_error=null`. No se modificó.
- `cron.job_run_details`: **6,499** SQL `succeeded` (89 adicionales respecto a las 6,410 del control 00:07). No significa `done` funcional.
- `private.fabrica_scheduler_receipts`: **5,756** recibos (89 adicionales); **5,750** verificados (89 adicionales); cinco `network_error` históricos sin incremento. Distribución verificada: `idle=5733`, `done=9`, `waiting=4`, `error=2`, `busy=1`, `quota=1`. Los nueve `done` son históricos; no son entregas nuevas.
- Ventana móvil de 90 minutos: **90** recibos `idle` verificados y 90 ejecuciones SQL `succeeded`; cero `done` nuevos. Los índices únicos en `cycle_id` y `request_id` están presentes; cero duplicados en ambos. Los cinco `verified=false` vencidos corresponden a errores de red históricos, no a pendientes sin explicación. **Cero** recibos sin `checked_at` o sin `error_code` vencidos más de tres minutos al corte de 07:36:52Z.
- Último ciclo cotejado Site/SQL: `df45e60e-544e-4783-aab1-2041a4973685` (07:35Z), HTTP 200, `verified=true`, `site_status=idle`. Ciclo posterior `a1398a11-c453-4aff-ab0d-c8695b05a3c3` (07:36Z) ya figuraba como `idle` en el Site pero seguía sin `checked_at` SQL al corte: **no conciliado ni aprobado**. Su antigüedad era inferior a tres minutos.
- Conector nativo del Site `agent_status`: **65** trabajos, 60 `done`, dos `failed`, tres `cancelled`, cero pendientes; cuota 0/20. `health.supabase_runner` = `idle`, `health.autonomy.primary` reciente. Las seis prácticas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` continúan `done` con evidencia de generación de texto. No son recibos de aprobación, fabricación, aprovisionamiento, entrega ni aceptación real.
- Automatización de respaldo `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true`; último resultado registrado `no_update`. Auditoría de Punto 4 `6ae238f8b8a081918479f796f34da2b1`: `is_enabled=true`. Ninguna se modificó.
- `AGENTS.md` vigente consultado: Leo Ventas, Mila Servicio al cliente, Vera Finanzas, Alma Química y farmacia, Nico Logística, Lía Mercadeo. Persiste diferencia con etiquetas de prácticas históricas; no se alteran identidades ni recibos.
- Los siete workflows en `.github/workflows` se leyeron desde `main`: ninguno tiene `schedule:`. `agent-runner.yml` conserva solo `workflow_dispatch`; otros son CI/manuales. El antecedente histórico de `github-actions event=schedule` en `health.cloud_runner` no prueba un schedule vigente.
- Inspección estática de `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile`: código con guardia advisory, conciliación y `not_before`; esto **no** acredita ensayos dinámicos de concurrencia, reintento o idempotencia.
- Logs Supabase de `2026-11-02T06:05:00Z` a `07:35:00Z`: 216 `postgres_logs` con severidad `LOG` y tres `pgbouncer_logs`. No se observó severidad `ERROR/FATAL` en esos 216 logs PostgreSQL. La búsqueda textual de `error` sobre atributos completos produce falsos positivos por la clave `parsed.error_severity`; se usó la severidad real. La cobertura no prueba ausencia global de errores.
- Pruebas de modelos en `health.model_checks` siguen históricas: primario `gemini-2.5-flash` HTTP 404, respaldo `gemini-2.5-flash-lite` HTTP 404; tercer modelo `gemini-3.5-flash-lite` HTTP 200 sintético. No se reintentó contra proveedores ni se cambió configuración.
- Fuente nativa histórica del Site v53 recuperada en commit `5be977154cc15c9511787d22e28b7367e6f00467`, con 122 pruebas de servidor aprobadas en worktree. **No se pudo cotejar en esta revisión la versión actualmente desplegada mediante una interfaz nativa de versiones de Sites**: `agent_status` no devuelve versión. No deducir versión activa a partir del repositorio.

## Pendientes sin certificación
1. Cotejar versión desplegada de Sites con fuente nativa y preservar datos y audiencia; v54 permanece guardada sin desplegar.
2. Pruebas dinámicas **aisladas**, no sobre cola real, de locks, reintentos, idempotencia, pausas, recuperación, `not_before` y cuota; no realizadas en esta auditoría.
3. Resolver y demostrar recuperación de primario/respaldo Gemini HTTP 404 sin gasto ni cambio de proveedor no autorizado.
4. Recibos E2E persistidos y correlacionados por pedido, identidad y UUID: aprobación, fabricación, aprovisionamiento y entrega; no inferirlos de texto sintético.
5. Validación final con cliente real pendiente. No reabrir cierre administrativo por ausencia de cliente.

**Resultado:** cron Supabase real continúa con ciclos `idle` verificados y cola vacía; no se observó regresión operativa nueva en el alcance examinado. **Punto 4 CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.**
