# Ruta oficial para capacidades tipo Dots — SDK JavaScript

**No hay scripts públicos que reproduzcan el producto Dots por completo.** Este ejemplo usa exactamente las primitivas documentadas de OpenAI Agents SDK JS: `Agent`, `Agent.create`, `handoffs`, `run` y `MemorySession`.

Fuentes oficiales:
- [Quickstart y ejemplos](https://openai.github.io/openai-agents-js/guides/quickstart/)
- [Agentes y delegación](https://openai.github.io/openai-agents-js/guides/agents/)
- [Handoffs](https://openai.github.io/openai-agents-js/guides/handoffs/)
- [Sesiones](https://openai.github.io/openai-agents-js/guides/sessions/)
- [Sandbox](https://openai.github.io/openai-agents-js/)

## Cómo ejecutarlo en entorno aislado

```bash
npm install @openai/agents zod
OPENAI_API_KEY=... node examples/official-agents-sdk/dots-pattern.mjs
```

Para validar sin clave ni cargos: `node --experimental-vm-modules examples/official-agents-sdk/test-pattern.mjs` (dobles de prueba; no certifica la API).\n\nEl archivo sólo se ejecuta manualmente con una cuenta y cuota de API independiente. **NO se instala ni ejecuta en producción por defecto**; no cambia Gemini, Site ni datos de clientes, y no requiere que el usuario facilite claves en el chat. `MemorySession` no persiste entre procesos. Para producción integrar primero almacenamiento persistente con la interfaz Session documentada, controles de aprobación, herramientas MCP autorizadas, sandbox y pruebas con recibos. No atribuir a Dots capacidades no verificadas.

## Paridad

Delegación especializada: patrón documentado disponible como ejemplo; no certificado en el Site. Investigación proactiva, apps conectadas, computadora en nube, aprobaciones y autonomía continua: pendientes. El acceso a conectores ChatGPT no se hereda a un agente independiente. SDK y llamadas de API pueden tener costos; no activarlos sin autorización.
