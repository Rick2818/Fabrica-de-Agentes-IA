---
name: proposal-builder
description: Al preparar una propuesta, cotización o alcance de trabajo.
---

# Propuesta consultiva

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "sales_qualify"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"requests":[{"url":"https://example.org/solicitud-1","pain":"Pedidos manuales duplicados","buyer_request":true,"fits":true,"status":"open"}]}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Al preparar una propuesta, cotización o alcance de trabajo.
Leé únicamente el material de descubrimiento indicado. Establecé dolor, proceso actual, línea base, alcance y exclusiones; pedí datos faltantes. Proponé el agente especialista como medio para recuperar productividad y acordá medición. Usá precios y condiciones aprobados; separá supuestos y pendientes. Entregá propuesta, entregables, aceptación y siguiente compromiso. Firma, factura y pago solo constan con recibos reales.

## Procedencia y cambios

anthropics. https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/small-business/skills/proposal-builder/SKILL.md

Apache-2.0. Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan.

