---
name: performance-report
description: Al revisar resultados de campañas y embudos.
---

# Medir rendimiento y optimizar

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "marketing_metrics"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"impressions":1000,"clicks":100,"conversions":10,"spend":50,"attributed_revenue":200}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Al revisar resultados de campañas y embudos.
Alineá periodo, fuente, moneda, eventos y atribución. Usá marketing_metrics para un embudo de clics; si el embudo difiere, no fuerces sus supuestos. Mostrá CTR, conversión, CPA y ROAS con denominadores y datos pendientes; cero denominador devuelve no calculable. Compará con línea base y meta aprobada. Diferenciá correlación y causalidad; recomendá experimentos y no incrementes gasto automáticamente.

## Procedencia y cambios

anthropics. https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/marketing/skills/performance-report/SKILL.md

Apache-2.0. Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan.

