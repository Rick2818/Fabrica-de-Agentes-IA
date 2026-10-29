# Fábrica de Agentes IA — Punto 4 — control de continuidad 2026-10-29 12:10 SV

## Estado rector y alcance
- **CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN** por instrucción del propietario del 29-10-2026. Falta cliente real para aceptación final; esa ausencia **no reabre** el cierre administrativo.
- Alcance exclusivo: Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, Supabase `udispwzwrebjkanudcoy`, repositorio `Rick2818/Fabrica-de-Agentes-IA`, autonomía y continuidad de los seis agentes.
- Control de **solo lectura** de SQL, HTTP conservado, GitHub y estado de automatización de respaldo. No se llamó `fabrica_scheduler_tick` ni `run_pending_tasks`, no se forzó `not_before`, cuota, fechas o trabajos; sin nuevo ejecutor ni cambios productivos.
- El propietario informa recuperación de fuente nativa Site v53, referencia `5be977154cc15c9511787d22e28b7367e6f00467`, con 122 pruebas de servidor aprobadas en su worktree. **No se repitieron esas 122 pruebas en este control.** El API de commits de *este repositorio GitHub* respondió 422 para ese SHA; esto no refuta la recuperación de la fuente nativa de Sites, que puede usar otro almacén. La v54 está guardada sin desplegar según el estado rector; **no se desplegó**.
- Lectura directa del complemento de Site en esta ejecución: bloqueada por requerir interacción del usuario en un contexto no interactivo. Browser también carece de contexto de origen. No se declara que la fuente nativa sea inaccesible en general, ni se infiere el estado total de la cola/leases del Site de una respuesta `idle`.

## Evidencia Supabase (corte 18:09 UTC / 12:09 SV)
- Proyecto `ACTIVE_HEALTHY`. `cron.job`: exactamente un job `fabrica-queue`, `jobid=1`, `active=true`, programación `* * * * *`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **1,372** filas `succeeded`, **0** con otros estados; última 18:09:00 UTC. Esto acredita la ejecución del SQL programado, **no** la entrega funcional.
- `private.fabrica_scheduler_receipts`: **657** filas, **657 UUID de ciclo y request_id únicos** (comprobación de unicidad en corte anterior, más índices únicos actuales), **656 verified=true**, **1 sin conciliar** (ciclo más reciente, pendiente normal); **9 done**, **639 idle**, **4 waiting**, **2 error**, **1 quota**, **0 error_code no nulos**. Frente al control de 11:12 SV: +57 SQL `succeeded` y +56 recibos, **0 done nuevos**.
- Los nueve `done` históricos mantienen `verified=true`, `http_status=200`, `error_code=null`, UUID distintos; no se releen cuerpos HTTP antiguos que expiraron. La atribución a las seis especialidades y tres trabajos técnicos se sustenta en la auditoría histórica de Site de 11:12, **no** en una lectura nueva de la cola.
- Correlación HTTP reciente para ciclos 18:07–18:09 UTC: `source=supabase-cron`, `project_id=udispwzwrebjkanudcoy`, `schedule_id=supabase:udispwzwrebjkanudcoy:fabrica-queue`, `receipt.supabase.run_id=cycle_id`, `receipt.status=run.status=idle`, `pending=0`, HTTP 200. El ciclo 18:09 estaba aún sin conciliar al momento de la primera lectura HTTP y quedó verificado como `idle` en la consulta agregada posterior. **HTTP 200 / idle no son done.**
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=null`, `last_error=null`. No se cambió ni se ignoró ningún diferimiento.
- Código SQL de `private.fabrica_scheduler_tick` y `private.fabrica_scheduler_reconcile` inspeccionado: `pg_try_advisory_xact_lock(1432658222,51)`, `FOR UPDATE`, guarda de `enabled/not_before`, exclusión si hay recibo pendiente, cotejo de identidad/proyecto/schedule/UUID/tiempos/estado/job_id, diferimiento de cinco minutos por error y recibos faltantes. **Inspección estática, no prueba de carrera concurrente ni de fallo inyectado.**
- Índices únicos de `cycle_id` y `request_id`; instantánea de `pg_locks` sin advisory locks. Ausencia instantánea de lock no certifica exclusión mutua en concurrencia.
- Logs unificados 17:00–18:10 UTC: 170 `postgres_logs`, 12 `function_logs`, 7 `function_edge_logs`, 7 `edge_logs`, 3 `pgbouncer_logs`. Una búsqueda textual genérica de 'error' no es diagnóstico de severidad (aparece en atributos de todos los postgres_logs); no se concluye ausencia universal de fallos.

## GitHub y respaldo
- `AGENTS.md` leído: preservar Site, identidad Leo/Mila/Vera/Alma/Nico/Lía, separar proyectos, exigir pruebas reales.
- Leídos los seis workflows de `main`: `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `training-regression.yml`, `verify-training.yml`. **Ninguno tiene evento `schedule`**. Cuatro son `workflow_dispatch` solamente; los dos de pruebas también tienen `push`. Ningún `push` o `workflow_dispatch` se toma por prueba de cron.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a` permanece `is_enabled=true`. Última ejecución registrada `completed`, ID `9d355f5f-da08-8324-8ccf-7795ad677a4c`, inicio 17:39:08 UTC y fin 17:40:32 UTC; el resultado correspondiente describe práctica sintética de pedido #4, **no** aceptación de cliente ni entrega productiva. No se invocó el respaldo.

## Pendientes para validación final (NO aprobados en este control)
1. Inspeccionar de nuevo por acceso nativo Sites la fuente efectiva desplegada y contrastar hash/versión con la fuente v53 recuperada y v54 guardada sin desplegar, sin sustituir código vigente.
2. Probar en entorno aislado la exclusión mutua bajo concurrencia, pausas/reanudación, reintentos, vencimiento de lease y recuperación tras fallo HTTP/transporte, con recibos trazables; sin afectar trabajos ajenos.
3. Validar el circuito punta a punta en una tarea sintética nueva solo si es segura y no consume cuota/compite con el ejecutor; documentar por separado estado de Site, recibo Supabase y UUID. **No se creó tal tarea en esta ejecución**.
4. Cuando exista cliente real y autorizaciones, ejecutar aceptación final con evidencia de operación real y controles aplicables. Las pruebas sintéticas no sustituyen esa aceptación.

## Dictamen
**Punto 4 cerrado provisionalmente, no certificado.** Continuidad programada y nueve entregas históricas verificadas; sin regresión nueva comprobada en SQL/recibos recientes. No se detectó motivo para intervención productiva. Sin cambios en Site, Supabase, GitHub workflows, cuotas, clientes ni terceros.

Control anterior: [11:12 SV](point4-supabase-continuity-20261029-1112-sv.md).
