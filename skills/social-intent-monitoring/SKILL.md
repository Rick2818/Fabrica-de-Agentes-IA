---
name: social-intent-monitoring
description: Al diseñar búsqueda por señales o monitoreo de dolores.
---

# Señales públicas de necesidad

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "sales_qualify"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"requests":[{"url":"https://example.org/solicitud-1","pain":"Pedidos manuales duplicados","buyer_request":true,"fits":true,"status":"open"}]}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Al diseñar búsqueda por señales o monitoreo de dolores.
Definí señales: pedido explícito de ayuda, búsqueda de especialista y cuello de botella laboral descrito por su autor. Registrá fuente original, fecha y contexto. Clasificá señal, evidencia y acción; una mención no demuestra intención de compra. Deduplícá y verificá vigencia. Prepará disparadores configurables con fuente, frecuencia, umbral, límites y pausa, sin activarlos durante entrenamiento. No dependas de Trigify ni herramientas pagadas; usá fuentes autorizadas disponibles.

## Procedencia y cambios

LeadMagic. https://github.com/LeadMagic/gtm-skills/blob/2b7ec0f9e7044f46e4c77b536f486303fd863e28/skills/prospecting/social-intent-monitoring/SKILL.md

MIT. Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan.

