# Laboratorio de cinco capacidades basadas en SDK oficial

| Capacidad | Implementación o ruta probada | Bloqueo restante |
|---|---|---|
| Autonomía | Cola, persistencia, objetivos y programador existentes en Site; patrón Session documentado | Certificar ejecución continua por disparador y políticas de límites |
| Investigación | `inspect_authorized_source`, herramienta de lectura estructurada del SDK | Esta versión **no navega**: grounding real y citas deben añadirse con proveedor compatible y límites de cuota |
| Herramientas | Funciones definidas con `tool` + esquemas Zod | Conectores privados por usuario, sin heredar credenciales ChatGPT |
| Delegación | `Agent.create` + `handoffs` a los seis especialistas | Certificar ejecución multiagente con proveedor real |
| Seguridad | `needsApproval: true` y `interruptions` | UI de aprobación y RunState persistidos, permisos por cliente y recibos auditables |

Instalación opcional en un entorno separado: `npm install @openai/agents zod`. El laboratorio no está importado por `worker/runtime.mjs` ni añadido al bundle del Site y **no activa un proveedor de API**. Las llamadas de `run` requieren configurar un proveedor/credenciales y pueden tener costo. No usar credenciales de usuarios en el navegador.

Fuentes primarias:
- https://openai.github.io/openai-agents-js/guides/agents/
- https://openai.github.io/openai-agents-js/guides/tools/
- https://openai.github.io/openai-agents-js/guides/human-in-the-loop/
- https://openai.github.io/openai-agents-js/guides/sessions/
- https://openai.github.io/openai-agents-js/guides/mcp/
- https://ai.google.dev/gemini-api/docs/google-search

**Advertencias:** `MemorySession` es temporal, `lookupSource` no verifica el contenido del sitio y `request_external_action` no ejecuta nada incluso si se aprueba. No certificar paridad con Dots a partir de este laboratorio.
