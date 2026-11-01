# Punto 4 — Auditoría de continuidad (2026-10-31 20:09 SV)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Instantánea técnica de lectura, no certificación, entrega ni aceptación de cliente.

## Identidad y alcance
- Site original: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`.
- Repositorio: `Rick2818/Fabrica-de-Agentes-IA`.
- Supabase principal: `udispwzwrebjkanudcoy`, cron `fabrica-queue`; respaldo horario existente sin ejecución manual.
- Corte de métricas: 2026-11-01 02:08–02:09 UTC (20:08–20:09 El Salvador). Consultas de solo lectura a Supabase, complemento Fábrica `agent_status`, GitHub `AGENTS.md` y siete YAML; comprobación del respaldo con Automations.peek. No se accedió a una interfaz nativa de fuente de Sites en esta pasada.

## Evidencia verificada
1. **Programación real:** `cron.jobid=1`, `schedule=* * * * *`, `active=true`, comando `select private.fabrica_scheduler_tick();`. `cron.job_run_details`: **4,732** ejecuciones `succeeded`, **0** de otro estado, última a 02:09Z. Frente al corte 19:08 SV: +61. Éxito SQL no equivale a `done`.
2. **Recibos SQL:** a 02:08Z, **3,988** recibos, **3,982** `verified=true`, seis no verificados (cinco `network_error` históricos y un ciclo normal sin conciliar en el instante). Frente al corte 19:08 SV: +60 recibos y +60 verificados. Nueve `site_status=done` históricos, **cero `done` nuevos en los últimos 70 minutos**, 70 `idle` recientes. Cinco `network_error` históricos sin incremento; uno ocurrió dentro de las últimas 24 h, pero ninguno en la última hora. Cero conciliaciones vencidas >3 min sin error registrado.
3. **UUID y recibo de Site:** `68419173-da82-4638-bd45-10378af0f8dc` (02:07Z) y `ab17ce14-a51f-42ec-a9e5-113ec19bf655` (02:08Z) conciliados en SQL, `http_status=200`, `verified=true`, `site_status=idle`, `error_code=NULL`. El Site reportó luego `a1123af9-3e4e-4715-80cf-69273692127d` (02:09Z), `idle`, pero su conciliación SQL todavía estaba pendiente en el corte: **no se marca aprobado**. No hubo entrega funcional nueva.
4. **Cola Site:** 65 trabajos: 60 `done`, dos `failed` históricos, tres `cancelled`; cero pendientes y cero leases activos. Cuota 0/20, `health.autonomy.status=recent`, último `source=supabase-cron`, `status=idle`. Las seis prácticas sintéticas históricas no acreditan fabricación/entrega E2E.
5. **Locks, pausas, idempotencia:** `private.fabrica_scheduler_config.enabled=true`, `not_before=NULL`, `last_error=NULL`. Índices únicos de `cycle_id` y `request_id` presentes. Inspección SQL estática: `pg_try_advisory_xact_lock`, conciliación de recibo con `run_id`, `scheduled_at`, `schedule_id` y estado, tratamiento de `network_error` y `response_missing`, y pausa `not_before`. Esto **no** reemplaza pruebas dinámicas de concurrencia, recuperación, reintentos, idempotencia o pausa.
6. **GitHub:** los siete YAML actuales de `.github/workflows` fueron releídos; ninguno contiene `schedule:`. Existen disparadores manuales y de CI, pero no un segundo cron de cola. `AGENTS.md` asigna Leo/Ventas, Mila/Servicio, Vera/Finanzas, Alma/Química-Farmacia, Nico/Logística, Lía/Mercadeo; las etiquetas de prácticas históricas pueden diferir, no se alteran recibos.
7. **Respaldo:** `Respaldo de pendientes Fábrica IA` sigue `is_enabled=true`, último registro `no_update`; no se ejecutó ni se creó otro disparador.
8. **Logs:** entre 19:00Z y 02:10Z se consultaron `postgres_logs` y `pgbouncer_logs`. Una coincidencia `syntax error at or near "hour"` a 01:08Z aparece en logs Postgres; no hay evidencia que la vincule al cron, cuyos ciclos continuaron `succeeded`. No se diagnostica aún la causa de los cinco errores históricos de transporte.
9. **Modelos:** el estado histórico del Site registra pruebas de `gemini-2.5-flash` y `gemini-2.5-flash-lite` con HTTP 404, y `gemini-3.5-flash-lite` con HTTP 200. No se repitieron; no se declara recuperado el primario ni el respaldo.
10. **Fuente del Site:** se conserva como antecedente la fuente original v53 recuperada en commit `5be977154cc15c9511787d22e28b7367e6f00467` y sus 122 pruebas de servidor previas. La versión 54 está guardada sin desplegar según instrucción rectora; no se activó. El complemento incluye una nota histórica de despliegue v58 (29-oct), pero no proporciona diff ni prueba de la versión/fuente publicada actual: **no se certifica paridad con el artefacto efectivo**.

## Pendientes sin aprobar
- Acceso nativo de Sites y cotejo del artefacto desplegado con la fuente correspondiente; preservar versiones, datos y trabajos existentes.
- Pruebas sintéticas dinámicas aisladas de locks/concurrencia, idempotencia, recuperación, reintentos, pausa/`not_before` y fallback; sin tocar cuota, fechas ni cron productivo.
- Diagnóstico causal de cinco `network_error` históricos, con las limitaciones de retención.
- Recibos E2E de aprobación, fabricación, aislamiento y entrega de los seis agentes; diferenciarlos de prácticas de texto y de `idle`.
- Aceptación final de cliente real cuando exista; su ausencia no reabre el cierre administrativo.

**Mutaciones operativas:** ninguna. No se modificaron Site, producción, versiones, modelos, Supabase Cron, respaldo, cuota, fechas, cola, pedidos, pagos ni contactos; no se enviaron correos. No se detectó una regresión operativa nueva que exija corrección inmediata. No se ejecutaron pruebas sintéticas nuevas.
