---
name: lead-finder
description: Al buscar oportunidades publicadas, compradores o clientes potenciales.
---

# Encontrar y calificar compradores

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "sales_qualify"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"requests":[{"url":"https://example.org/solicitud-1","pain":"Pedidos manuales duplicados","buyer_request":true,"fits":true,"status":"open"}]}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Al buscar oportunidades publicadas, compradores o clientes potenciales.
Partí de capacidades y cliente objetivo aprobados; usá historial real si existe. Prepará consultas concretas para plataformas freelance y web autorizada. Abrí la solicitud original: fecha, dolor, entregable, presupuesto si está publicado y señal de intención. Descartá proveedores promocionándose, duplicados y solicitudes cerradas. Entregá tabla con enlace, evidencia, encaje y siguiente paso; contacto solo si consta públicamente. Sin acceso web, solicitá textos y no simules hallazgos.

## Procedencia y cambios

anthropics. https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/small-business/skills/lead-finder/SKILL.md

Apache-2.0. Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan.

