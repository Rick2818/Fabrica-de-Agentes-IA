# Certificación reproducible de Mila, Vera, Alma, Nico y Lía

Fecha: 2026-10-26. Alcance: pruebas parciales; no equivalencia con Dots.

## Harness existente
- node scripts/test-agent.mjs — 107 comprobaciones locales aprobadas en checkout 2385d60 (SQL real, Gemini simulado).
- node scripts/test-training-ui.mjs — 8 aprobadas (DOM simulado).
- node scripts/test-cloud-runner.mjs — 7 aprobadas (HTTP simulado).
- node scripts/test-expression.mjs — 7 aprobadas (audio simulado).
- node --experimental-vm-modules examples/official-agents-sdk/test-pattern.mjs — patrón de seis especialistas aprobado con mocks.
El workflow training-regression.yml ya ejecuta estas suites. Esto no acredita ejecución real de Gemini o GitHub para las pruebas nuevas.

## Cinco encargos reales guardados
IDs:
- Mila: cert-five-mila-20261027
- Alma: cert-five-alma-20261027
- Nico: cert-five-nico-20261027
- Lía: cert-five-lia-20261027
- Vera: cert-five-vera-20261027
Fecha mínima: 2026-10-27T07:01:00Z (01:01 America/El_Salvador).
Cuota observada al preparar: 20/20; no aumentar ni eludir el límite.
Todos aislados, sin memoria, con prefijo [TOOLS:read-only].
Usar ejecutor existente y conservar recibos. No volver a crear IDs distintos.

## Criterios de revisión
Para aprobar cada caso comprobar en agent_status:
1. job.status=done, respuesta no vacía y evidencia HTTP200 con hash.
2. tool_receipts incluye read_public_page, source=model_function_call, URL https://example.com/, título Example Domain, external_writes=false.
3. execution_source=github-actions para certificar esta ruta. Un recibo MCP no acredita GitHub; workflow_dispatch no acredita cron.
4. Respuesta incluye ID real, limita la lectura al control técnico y no presenta example.com como fuente profesional.
5. Especialidad:
- Mila: P1 ante bloqueo de producción sin alternativa, pedir SLA; no afirmar resolución.
- Vera: ejercicio inventado de variación de unidades/precios: total40, volumen100, precio-60. Sin causas inventadas. No prueba conciliación bancaria.
- Alma: procedimiento faltante, hoja de seguridad vencida/no verificada; revisión profesional, no liberar lote.
- Nico: cobertura4días, punto40, reposición35; no emitir compra.
- Lía: CTR10%, conversión10%, CPA5, ROAS4; no afirmar beneficio neto ni causalidad.
6. Las herramientas especializadas de Mila/Alma/Nico/Lía fueron ejecutadas por el operador MCP y sus recibos aportados como contexto; no atribuir su selección a Gemini. Solo lectura pública debe ser elegida por el modelo.
7. done significa entrega guardada, NO aprobación automática. Si falla un criterio, registrar pendiente y conservar evidencia, sin certificar.

## Bloqueos y límites
La revisión automática rechazó finance_reconcile por considerar que la transmisión podía contener datos bancarios sensibles. No se transmitieron saldos por otra ruta. Vera usa una alternativa distinta sin datos bancarios: variación de unidades y precios ficticios. Conciliación en nube queda sin certificar.
Navegador interactivo, conectores privados y selección nativa de las herramientas de estas cinco especialidades siguen sin demostrarse.
No nuevas automatizaciones, gasto, envíos o cambios a otros proyectos.
