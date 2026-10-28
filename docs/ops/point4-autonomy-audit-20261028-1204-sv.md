# Punto 4 — Auditoría de continuidad y autonomía (28-10-2026, ~12:04 SV)

Alcance: Fábrica de Agentes IA exclusivamente. Evidencia de lectura GitHub Actions, repositorio main, AGENTS.md y `agent_status` del complemento. **No equivale a certificación del Site ni a publicación.** No se modificó el ejecutor, el Site, los secretos, la cola ni los disparadores.

## Evidencia verificada

- Repositorio `Rick2818/Fabrica-de-Agentes-IA`, ID `1432658222`, rama `main`; HEAD observado `458b53f112c066a40238bddd0584f80f6019f51e`. Site original referenciado: `appgprj_6adbf0c05a0c8191b2ca585b76f5e862`. **No se pudo inspeccionar la fuente vigente del editor de Sites con los conectores disponibles**.
- Workflow principal `.github/workflows/agent-runner.yml`: cron `13,28,35,43,58 * * * *`, `workflow_dispatch`, guardia `AGENT_RUNNER_ENABLED`, ID del repositorio y rama main, grupo `concurrency: fabrica-de-agentes-ia`, `cancel-in-progress: false`. El script llama al Site por POST autenticado y exige correlación exacta de contexto/recibo. La configuración de GitHub no prueba por sí sola ejecución en Site.
- Ejecución automática **exitosa pero sin tareas**: [run 40660370028](https://github.com/Rick2818/Fabrica-de-Agentes-IA/actions/runs/40660370028), evento `schedule`, 28-10-2026 08:56:07 UTC, logs: `{"status":"idle","pending":0,"completed_at":1793177774069}`. Demuestra ruta GitHub → Site y recibo de cola vacía, no procesamiento de una tarea ni cadencia garantizada.
- Ejecución automática **fallida con cola pendiente**: [run 40720371906](https://github.com/Rick2818/Fabrica-de-Agentes-IA/actions/runs/40720371906), evento `schedule`, 28-10-2026 15:52:36 UTC. El paso `Procesar pendientes existentes` terminó con exit code 1, `Ejecución detenida: error`, recibo `{"status":"error","pending":6,"completed_at":1793202789149}`. El estado del complemento coincide: último ciclo GitHub con estado `error`, tarea `synthetic-six-20261028-mila`, autonomía `unverified`.
- Diagnóstico de condiciones: [run 40726241803](https://github.com/Rick2818/Fabrica-de-Agentes-IA/actions/runs/40726241803), evento `schedule`, 28-10-2026 16:28:06 UTC; ambos jobs `unconditional` y `production_condition` exitosos. Verifica que las condiciones del disparador pueden pasar, **no** que la cola procese tareas.
- Regresión del código: [run 40728580107](https://github.com/Rick2818/Fabrica-de-Agentes-IA/actions/runs/40728580107), evento `push`, 28-10-2026 16:42:18 UTC, éxito de `scripts/test-cloud-runner.mjs`, `scripts/test-agent.mjs`, build y validación. Son pruebas de código/simulaciones, **no** un ciclo automático productivo.
- La versión de `scripts/run-cloud-queue.mjs` del run fallido (`cd2344e2...`) trataba `error` como estado terminal. En `main` ahora contiene reintentos acotados para `error` con pendientes (máximo 2 reintentos y devolución `deferred:true`); `scripts/test-cloud-runner.mjs` comprueba esa rama. **Aún no hay evidencia de un run `schedule` posterior a este cambio que procese y recupere la cola.**
- `agent_status` mostraba tareas sintéticas `leo`, `mila`, `alma` en `done` con recibos MCP; `lia`, `vera`, `nico` en `queued`; objetivo de paridad en `waiting` por HTTP 503. Los recibos MCP no demuestran ejecución GitHub ni funcionamiento en navegador del Site. No se alteraron esas tareas.

## Diagnóstico y controles

1. El problema vigente comprobado es **error de ejecución automática con cola no vacía**; hay una corrección de reintento validada en pruebas, pendiente de validación por un nuevo evento real `schedule`.
2. `concurrency` protege contra solapamiento del mismo workflow en GitHub; exclusión global con el respaldo externo, idempotencia por `cycle_id`, leases y recuperación tras corte deben demostrarse con recibos cruzados y pruebas aisladas. No crear un segundo ejecutor ni activar el cron Supabase propuesto mientras GitHub sea principal.
3. No confundir éxito de diagnósticos, CI o ejecución MCP con certificación del punto 4. Exigir: al menos tres ciclos `schedule` observados en GitHub con recibos de Site concordantes, un encargo sintético completado por `github-actions` sin duplicación, prueba de pausa, reintento diferido y recuperación de lease, más comprobación de fuente/versión publicada del Site.
4. No se inspeccionaron los secretos (solo presencia enmascarada en logs); no se hicieron cambios a credenciales, pagos, correos ni clientes.

Estado: **PUNTO 4 NO CERTIFICADO**. Siguiente acción segura: observar próxima ejecución programada real y cotejar job, logs y `agent_status.health.autonomy` antes de modificar infraestructura.
