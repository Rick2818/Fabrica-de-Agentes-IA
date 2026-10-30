# Fábrica de Agentes IA — Punto 4: auditoría de continuidad (2026-10-30, 07:10 El Salvador)

**Estado rector:** CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN. Auditoría de solo lectura. No hay cliente real para aceptación final; las pruebas sintéticas no equivalen a ella.

## Evidencia de este control
- **Fuentes consultadas:** proyecto Supabase `udispwzwrebjkanudcoy` (`cron.job`, `cron.job_run_details`, `private.fabrica_scheduler_config`, `private.fabrica_scheduler_receipts`, funciones e índices); complemento nativo Fábrica `agent_status`; repositorio GitHub `Rick2818/Fabrica-de-Agentes-IA` (`AGENTS.md` y los siete workflows YAML leídos individualmente); `Automations.peek` del respaldo; logs unificados de Supabase (12:00–13:10 UTC).
- **Cron principal:** jobid=1, `fabrica-queue`, activo, `* * * * *`, `select private.fabrica_scheduler_tick();`. Configuración `enabled=true`, `not_before=null`, `last_error=null`. A 13:09 UTC: **2,512** ejecuciones SQL `succeeded`, ninguna de otro estado; +57 frente al informe 06:12. El estado SQL no acredita procesamiento de un trabajo.
- **Recibos:** a 13:09 UTC, 1,774 recibos, 1,769 verificados y cinco sin verificar. A 13:10:15 UTC: 1,775 recibos, **1,770 verificados** y cinco sin verificar: cuatro `network_error` históricos y el ciclo de 13:10 UTC en conciliación normal. Cero pendientes de conciliación de más de dos minutos. UUID y request_id únicos.
- **Distribución al corte 13:09:** 1,752 `idle`, 9 `done` históricos, 1 `busy`, 4 `waiting`, 1 `quota`, 2 `error`, 5 `site_status=null`. **No hay nuevas entregas `done`** desde el control anterior. En los últimos 65 minutos: 64 `idle`, un recibo reciente aún no conciliado, ningún nuevo error de transporte.
- **Correlación Site/SQL:** ciclo `fad5f9f3-3899-4eb4-8f86-fb10dc090de2`, programado 13:09 UTC, aparecía aún sin verificar en SQL en el primer corte; el complemento del Site registra el mismo UUID con `source=supabase-cron` y `status=idle`. No se clasifica como `done`. El corte SQL posterior ya concilió ese ciclo; el siguiente estaba pendiente de conciliación.
- **Site:** 65 trabajos: 60 `done` históricos, 2 `failed`, 3 `cancelled`, **cero pendientes**. Cuota **0/20**. `health.next_run_at=null`. Los 60 `done` del Site no son 60 recibos `done` del cron.
- **Integridad SQL:** hashes sin cambio: `fabrica_scheduler_tick=7fb25848caa91dc78eb0f469659f691d`, `fabrica_scheduler_reconcile=78a1057460b103ae1cddfb5d5e0339f0`. El primero contiene `pg_try_advisory_xact_lock`, `FOR UPDATE` y `not_before`; el segundo contiene `not_before`. Índices únicos de `cycle_id` y `request_id` presentes. Inspección estática: **no sustituye pruebas aisladas** de bloqueo, idempotencia o reintentos.
- **GitHub:** los siete workflows `agent-runner.yml`, `diagnostic-a-scheduler.yml`, `diagnostic-b-conditions.yml`, `diagnostic-c-actor.yml`, `factory-regression.yml`, `training-regression.yml` y `verify-training.yml` se leyeron directamente en `main`; ninguno contiene `schedule:`. El runner usa `workflow_dispatch`, no ejecución programada. No se disparó ningún workflow.
- **Respaldo:** automatización `Respaldo de pendientes Fábrica IA` habilitada. Última ejecución visible `no_update` a 12:31 UTC; no implica entrega de trabajo. No se modificó ni ejecutó el respaldo desde esta auditoría.
- **Logs:** consulta unificada 12:00–13:10 UTC: 167 registros `postgres_logs`, tres `pgbouncer_logs`; muestran inicios de cron pero no trazas internas del Site que expliquen los cuatro timeouts. No se atribuye su causa ni su resultado.
- **Versiones y modelos:** `AGENTS.md` vigente leído. Fuente nativa del Site asociada a v53 previamente recuperada (`5be977154cc15c9511787d22e28b7367e6f00467`) con 122 pruebas históricas aprobadas. En este control **no hubo acceso nativo directo a la versión desplegada**. Una nota histórica del Site registra despliegue v58 y 131 pruebas de servidor/10 de runner; no se contrastó directamente el despliegue actual y no se usa la nota como certificación. No se activó v54 ni otra versión. Pruebas sintéticas previas de modelos: primario y backup HTTP404, tercero HTTP200; no equivalen a fallback E2E certificado.

## Pendientes / límites
1. Diagnóstico causal de los cuatro `network_error` por trazas nativas del Site, preservando los UUID originales.
2. Pruebas **aisladas**, sin alterar cola real ni cuota, de exclusión mutua, pausas, reintentos, recuperación, idempotencia y respeto de `not_before`.
3. Prueba sintética E2E con recibo `done` correlacionado y fallback; distinguirla de aceptación real.
4. Cotejo nativo de la versión y fuente actualmente desplegadas, sin sobrescribir código o trabajos ajenos.
5. Aceptación final de cliente real cuando exista.

**Decisión:** sin regresión nueva demostrada, sin intervención de producción justificada. No se crearon ejecutores ni disparadores, no se forzó tick, no se tocaron cuota, fechas, pagos, correo ni terceros. Mantener principal y respaldo habilitados. **Punto 4 CERRADO PROVISIONALMENTE, SIN CERTIFICACIÓN.**
