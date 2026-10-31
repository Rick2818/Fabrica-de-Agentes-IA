# Punto 4 — auditoría de continuidad, 2026-10-31 13:15 SV

## Estado rector
**CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.** Exclusivamente Fábrica de Agentes IA. Site `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`; GitHub `Rick2818/Fabrica-de-Agentes-IA`; Supabase `udispwzwrebjkanudcoy`. No confundir con estación 4 ni issue #4. Fuente histórica v53 commit `5be977154cc15c9511787d22e28b7367e6f00467` y 122 pruebas de servidor previamente aprobadas; no equivale a comparar el despliegue vigente. No desplegar v54.

## Supabase — lecturas directas, corte 19:15 UTC
- `cron.job`: único `fabrica-queue` id 1, `* * * * *`, activo, `select private.fabrica_scheduler_tick();`.
- `cron.job_run_details`: **4,318** `succeeded`, **0** otros estados, último fin SQL 19:15:00 UTC. SQL exitoso no equivale a trabajo `done`.
- `private.fabrica_scheduler_receipts`: **3,575** recibos, **3,569** `verified=true`, **9** `site_status=done` históricos y **5** `network_error` históricos. Última hora: **60** recibos, **59** verificados, **0** `done`. No se acredita entrega funcional nueva.
- Último UUID conciliado `407f0412-96d2-4603-afcd-cb99d001dac0`, 19:14 UTC, request_id 3575, HTTP 200, `verified=true`, `site_status=idle`. Coincide con `health.supabase_runner` y `health.autonomy.last_scheduled_cycle` del Site. El UUID posterior `1f7d42b0-a1ae-4948-ad54-b77af8edcca8`, 19:15 UTC, request_id 3576, aún sin `checked_at` al corte; **no** se declaró verificado.
- `private.fabrica_scheduler_config`: `enabled=true`, `not_before=NULL`, `last_error=NULL`. No se forzó tick, fecha ni cuota.
- **0** UUID duplicados, **0** request_id duplicados, **0** recibos sin verificar con más de tres minutos y sin error. Persisten índices únicos de ambos identificadores. Esto no constituye prueba dinámica de idempotencia o concurrencia.
- Funciones SQL sin cambios frente al control anterior: `fabrica_scheduler_tick` md5 `7fb25848caa91dc78eb0f469659f691d` y `fabrica_scheduler_reconcile` md5 `78a1057460b103ae1cddfb5d5e0339f0`. Referencias estáticas a `not_before` en ambas y advisory lock en tick.
- `net._http_response`: error más reciente `7a6ca346-b178-4869-baec-136c47c47bb8`, 2026-10-31 14:57 UTC, request_id 3323, `timed_out=true`, timeout 55,000 ms. Para los otros cuatro errores históricos no hay fila de respuesta en esa consulta; no atribuirles la misma causa. Los cinco errores no aumentaron. La latencia causal del Site sigue sin demostrarse.
- Logs unificados 18:10–19:14:30 UTC: 154 entradas `postgres_logs` y 3 `pgbouncer_logs`. Este recuento no acredita ausencia de errores de aplicación.

## Site y seis agentes — conector operativo
- `agent_status`: **65** trabajos, **60 done, 2 failed, 3 cancelled, 0 pendientes**; ningún trabajo con lease activo o reintento pendiente en la muestra. Uso **0/20**. `automation.enabled=true`; principal `supabase:udispwzwrebjkanudcoy:fabrica-queue`; `health.autonomy.primary.recent=true`. Ciclo reciente `idle`, no entrega.
- Seis tareas `synthetic-six-20261028-{leo,mila,vera,alma,nico,lia}` con `status=done` y evidencia de respuesta de modelo. Son **prácticas sintéticas de texto anteriores**, no pruebas E2E nuevas ni recibos de fabricación/entrega ni aceptación de cliente.
- `models` declara primario `gemini-2.5-flash`, respaldo `gemini-2.5-flash-lite`, tercero `gemini-3.5-flash-lite`. Chequeos históricos: 404/404/200; no se gastó cuota en nuevas llamadas ni se certificó fallback.
- **Hallazgo de consistencia a revisar, sin editar producción**: `AGENTS.md` en main asigna **Alma=Química/Farmacia, Lía=Mercadeo**; sin embargo, las fichas de prácticas históricas del Site incluyen **Alma=Mercadeo** y **Lía=prueba documental/Legal**. Es una discrepancia entre documentación normativa y etiquetas de ejercicios guardados, **no prueba por sí sola una regresión del enrutamiento vigente**. Se requiere comparar el mapa de perfiles y la fuente nativa efectivamente desplegada antes de corregir o reetiquetar. No alterar recibos históricos.

## GitHub y respaldo
- `AGENTS.md`, `agentes.md` y `SPECIALTIES.md` consultados directamente en main. `.github/workflows/agent-runner.yml` leído directamente: solo `workflow_dispatch`, sin `schedule`. Continúa la discrepancia de `SITE_ORIGIN=https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site` frente a metadatos operativos Site v58 `https://agente-ricardo-revision-rick.rick271711.chatgpt.site`. No ejecutar manualmente hasta conciliar nativamente.
- La revisión de **siete** workflows sin `schedule` consta en la auditoría de 12:12 SV. **En esta pasada se releyó directamente solo `agent-runner.yml`**; la búsqueda de código no devolvió resultados y la acción de archivo no enumera directorios. No presentar los otros seis como revalidados en esta hora.
- Respaldo horario `6adbf94d28e8819189c0516c6068457a`: `is_enabled=true` por Automations.peek, último run id `62328c3e-3b6c-8328-b9b4-2c90d790da6c`, iniciado 18:54:41 UTC, `recorded_status=no_update`; `latest_result=null`. No atribuir entrega ni error al respaldo por ese estado. No se invocó ni alteró.
- No hay herramienta nativa de lectura de fuente/despliegue Sites en esta pasada. **No inferir imposibilidad de recuperar la fuente**: ya se recuperó v53 con acceso nativo anteriormente. Falta cotejar despliegue actual, versión, URL y mapa de seis perfiles con fuente nativa, sin reemplazar código.

## Comparación con 12:12 SV
- SQL `succeeded` **4,254 → 4,318** (+64); recibos **3,511 → 3,575** (+64); verificados **3,505 → 3,569** (+64).
- Errores **5 → 5**, `site_status=done` **9 → 9**, Site **60/2/3/0** sin cambio. No se observó regresión operativa nueva en la muestra.

## Pendientes sin aprobación/certificación
1. Comparación **nativa** de fuente, despliegue, URL y mapa de seis perfiles, sin tocar v54 ni trabajo ajeno; determinar si etiquetas Alma/Lía son solo históricas o afectan selección vigente.
2. Pruebas dinámicas **aisladas** de locks/concurrencia, idempotencia, pausas, `not_before`, reintentos, recuperación y fallback; no tocar producción, fechas ni cuota.
3. Diagnóstico causal de los cinco errores de transporte; solo el más reciente tiene timeout 55 s demostrado.
4. E2E sintético real con recibos de aprobación/fabricación/entrega por agente; después aceptación final de cliente real, todavía inexistente. No convertir práctica textual en recibo operativo.

**Acciones:** lecturas directas a Supabase, Site, GitHub, logs y respaldo; únicamente escritura de este informe durable en GitHub. No se crearon ejecutores, disparadores ni tareas; no se enviaron correos, pagos ni mensajes; no se cambió código productivo, cuotas, fechas, modelos, versiones o Site. **Punto 4 sigue cerrado provisionalmente, sin certificación.**
