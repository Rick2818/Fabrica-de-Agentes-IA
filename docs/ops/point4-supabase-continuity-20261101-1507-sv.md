# Fábrica de Agentes IA — Punto 4 · Control 2026-11-01 15:07 CST

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Esta auditoría es de solo lectura salvo el presente documento. No se activa Site v54 ni se modifican ejecutores, cuota, fechas, trabajos, datos ni producción.

## Fuentes y corte
- Supabase proyecto `udispwzwrebjkanudcoy`, consulta SQL de corte `2026-11-01 21:07:25.727326+00` (15:07:25 El Salvador).
- Site, conector nativo Fábrica de Agentes IA: `agent_status` (lectura de cola, health, modelos, cuota y ciclo).
- GitHub `Rick2818/Fabrica-de-Agentes-IA`: `AGENTS.md`, siete archivos de `.github/workflows/`, rama `main`.
- Automatización horaria existente de respaldo: consulta `Automations.peek` por ID `6adbf94d28e8819189c0516c6068457a`.
- No hubo acceso nativo a la ficha de despliegue/versiones del proyecto Sites `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`. No inferir versión desplegada por logs, navegador o código GitHub. La fuente recuperada v53 (commit `5be977154cc15c9511787d22e28b7367e6f00467`, 122 pruebas previas) es antecedente, no comprobación de despliegue vigente. v54 permanece sin activar.

## Conciliación real
- `cron.job`: `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **5,870** ejecuciones SQL `succeeded` al corte. No equivalen a tareas `done`.
- `private.fabrica_scheduler_receipts`: **5,127** recibos; **5,121** `verified=true`; cinco `network_error` históricos y un recibo de último minuto sin conciliar al corte. Totales históricos verificados por estado: 5,103 `idle`, nueve `done`, cuatro `waiting`, dos `error`, uno `busy`, uno `quota` (suma 5,120 al instante de la consulta de agrupación, anterior al corte final).
- Ventana de 90 minutos consultada: 90 recibos, 89 verificados `idle`, cero `done`, cero `error_code`; el restante estaba en conciliación. No hubo nueva entrega funcional en esa ventana.
- Último ciclo SQL conciliado al corte: `f1da4e96-db1a-41a3-a276-1c57947c664d`, `http_status=200`, `verified=true`, `site_status=idle`, comprobado `2026-11-01 21:07:00.040989+00`.
- Ciclo del Site posterior `7cea7fe5-8550-4efb-9559-60c4bfd690e8`, `idle` en el Site, seguía sin `checked_at` SQL a las 21:07:25 UTC. **No aprobado ni contado como conciliado.**
- No se hallaron `cycle_id` duplicados ni `request_id` duplicados. Cinco no verificados de más de tres minutos corresponden exactamente a `network_error` de 30 y 31 de octubre; no son conciliaciones recientes vencidas sin explicación.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. La función `fabrica_scheduler_tick` contiene `pg_try_advisory` y referencia a `not_before`; `fabrica_scheduler_reconcile` referencia a `not_before`, `verified` y `request_id`. Índices únicos sobre `cycle_id`, `request_id` y configuración `singleton`. **Inspección estática**, no prueba dinámica de carrera, pausa, reintento ni recuperación.
- Logs Supabase, ventana `2026-11-01 19:30–21:06 UTC`: se observan arranques del cron. El filtro textual no acreditó un error nuevo; esto no sustituye observabilidad E2E.

## Estado del Site y respaldo
- Site: 65 trabajos, 60 `done`, dos `failed` históricos, tres `cancelled`, cero pendientes; uso 0/20. El último ciclo de Supabase del Site aparece `idle` con UUID `7cea7fe5-8550-4efb-9559-60c4bfd690e8`.
- Las seis tareas sintéticas de Leo, Mila, Vera, Alma, Nico y Lía están `done` con evidencia de respuesta de modelo, pero **no son recibos de aprobación, fabricación, entrega ni aceptación del cliente**.
- Modelo primario `gemini-2.5-flash` y respaldo `gemini-2.5-flash-lite`: últimas comprobaciones sintéticas HTTP 404, `verified=false`; tercero `gemini-3.5-flash-lite`: HTTP 200 en prueba sintética histórica. No se demuestra fallback extremo a extremo ni disponibilidad actual de los tres.
- El registro de especialidades de `AGENTS.md` (Alma: Química y farmacia; Lía: Mercadeo) no coincide con etiquetas de prácticas históricas del Site (Alma: Mercadeo; Lía: prueba documental). Pendiente cotejo de fuente activa antes de cambiar identidades o recibos.
- Respaldo horario existente: `is_enabled=true`; última ejecución registrada `no_update`, 2026-11-01 19:16:42–19:16:43 UTC. No se disparó manualmente.
- Los siete workflows GitHub se leyeron individualmente: ninguno contiene `schedule`; `agent-runner.yml` solo `workflow_dispatch`. Los workflows verdes manuales no prueban programación.
- `main` antes de esta evidencia: `82f42de553717a8f8a8c306e04b89ae5ac09ceb2` (reporte 14:15 CST).

## Pendientes sin aprobación
1. Verificar mediante interfaz/API nativa de Sites la versión **efectivamente desplegada**, URL activa y correspondencia con fuente; conservar Site y v54 sin desplegar.
2. Pruebas dinámicas **aisladas** de lock concurrente, idempotencia, reintentos, pausas, recuperación y `not_before`, sin forzar ticks ni modificar la cola real.
3. Diagnóstico de HTTP 404 de Gemini primario y respaldo y prueba de fallback completo, con cuota y autorizaciones respetadas.
4. Recibos reales E2E de aprobación, fabricación, provisión y entrega; aceptación final de cliente real aún no disponible. No convertir prácticas sintéticas en certificación.
5. Investigación causal de cinco errores de transporte históricos sin alterar sus recibos.

**Resultado:** no se observó regresión operativa nueva que exija intervención inmediata. No se ejecutaron pruebas sintéticas nuevas ni se modificó ningún sistema operativo; este documento preserva evidencia de lectura. Punto 4 sigue cerrado provisionalmente y sin certificación.
