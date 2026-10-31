# Punto 4 — continuidad Supabase y auditoría de solo lectura — 2026-10-31 04:11 SV

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Sin cliente real para aceptación final. Esta revisión no cambia el cierre administrativo. Proyecto exclusivo Fábrica de Agentes IA, Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`, Supabase `udispwzwrebjkanudcoy`.

## Evidencia observada (consultas directas, 2026-10-31 10:10–10:11 UTC)
- `cron.job`: único trabajo cuyo nombre contiene `fabrica`: `jobid=1`, `fabrica-queue`, `* * * * *`, `active=true`. No se añadió trabajo.
- `cron.job_run_details`: **3,773** registros para este trabajo, **3,773 succeeded**, 0 otros; última ejecución en el corte 10:10:00 UTC. Un resultado SQL `succeeded` **no** equivale a entrega.
- `private.fabrica_scheduler_receipts`: **3,035** recibos al corte 10:10, **3,030 verified**, **9 site_status=done históricos**, **3,013 idle**, **4 error_code=network_error** históricos; **3,035 cycle_id distintos** y **3,035 request_id distintos**. No aparecieron nuevos `done` frente al control anterior.
- Último ciclo ya conciliado al segundo corte: `b6defe4b-1b27-4c06-94fd-0568a6aecfc9`, programado 10:10 UTC, conciliado 10:11 UTC, HTTP 200, `verified=true`, `site_status=idle`. El ciclo de 10:11 `ab6f980b-ac9d-456c-a9ea-645e3704f3b0` figuraba en el Site como `idle` y aún estaba sin `checked_at` en SQL en ese instante: **pendiente de conciliación**, no fallo ni entrega.
- Integridad: 0 duplicados `cycle_id`, 0 duplicados `request_id`, 0 recibos sin conciliación con más de tres minutos de antigüedad en el corte. Índices únicos `fabrica_scheduler_receipts_pkey(cycle_id)` y `fabrica_scheduler_receipts_request_id_key(request_id)`.
- Hashes de definiciones SQL (MD5): `private.fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`, `private.fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. Los hashes son identificadores de comparación, no pruebas funcionales.
- Site vía conector propio `agent_status`: `automation.enabled=true`, ejecutor principal `source=supabase-cron`, `status=idle`, `pending=0`, `next_at=null`; **60 jobs done, 2 failed históricos, 3 cancelled, 0 pendientes o activos**. Uso **0/20**. Ciclos recientes incluyen UUID `b6defe4b...` y `ab6f980b...`, concordantes con SQL. `health.autonomy.primary.recent=true`; no confundir con entrega ni con certificación de autonomía para seis agentes.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: habilitado; último intento registrado 2026-10-31 10:05:10 UTC con estado `no_update`. Este dato no acredita procesamiento de una tarea.
- GitHub `main`: **7/7** workflows leídos individualmente. Ninguno contiene trigger `schedule`. `agent-runner` y diagnósticos son manuales; otros admiten push/PR, sin schedule.
- `AGENTS.md` leído. Requiere preservar Site, no cambiar proveedor/modelo sin autorización, no confundir ejecución manual con schedule, y probar runtime con `scripts/test-agent.mjs` si se modifica servidor.
- Historial de comprobación de modelos del Site (pruebas sintéticas **anteriores**, no repetidas): Gemini `gemini-2.5-flash` principal HTTP 404, `gemini-2.5-flash-lite` respaldo HTTP 404, tercer modelo `gemini-3.5-flash-lite` HTTP 200. No demuestra fallback E2E ni funcionamiento actual.
- Unified logs: ventana 09:30–10:10 UTC, 98 entradas `postgres_logs` y 3 `pgbouncer_logs`. Un filtro textual por `error` coincidió con campos genéricos, por lo que **no permite concluir** ausencia/presencia de fallos. No se adjudicó causa raíz a los cuatro errores históricos.

## Brechas y controles pendientes
1. Comparación **nativa** de fuente Site efectivamente desplegada con fuente recuperada de v53 (commit informado `5be977154cc15c9511787d22e28b7367e6f00467`). Este turno no contó con un conector nativo de Sites que permita leer código/versión desplegada; `agent_status` verifica estado operativo, **no** identidad de código. El antecedente de 122 pruebas en worktree v53 no prueba el despliegue. v54 guardada: **no desplegar**.
2. Pruebas dinámicas **aisladas** de concurrencia, locks, idempotencia, pausas, `not_before`, reintentos, recuperación persistente y fallback. **No realizadas en este turno**; no alterar cola, fechas ni cuota productiva para forzarlas.
3. Diagnóstico causal de cuatro `network_error` históricos; respuesta original no acreditada.
4. Prueba E2E con recibos de trabajo `done` y autonomía para **cada uno de los seis agentes**, distinguiendo ejercicios sintéticos de aceptación real. **No realizada en este turno**.
5. Aceptación final con cliente real: **pendiente**, sin reabrir cierre provisional.

## Cambios
Auditoría de solo lectura y creación de este registro. **No se ejecutó tick manual**, no se crearon trabajos, triggers ni segundo ejecutor; sin correos, pagos, contactos externos, cambios de cuota, modelos, versiones o producción. Ningún resultado pendiente fue marcado aprobado.
