---
name: handle-objection
description: Ante objeciones de precio, riesgo, competencia o urgencia.
---

# Objeciones con evidencia

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "sales_qualify"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"requests":[{"url":"https://example.org/solicitud-1","pain":"Pedidos manuales duplicados","buyer_request":true,"fits":true,"status":"open"}]}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Ante objeciones de precio, riesgo, competencia o urgencia.
Transcribí la objeción y verificá qué preocupación expresa. Hacé una pregunta breve para distinguir presupuesto, valor, confianza o prioridad. Usá pruebas aprobadas e historial real; no inventes testimonios ni debilidades del competidor. Compará impacto actual con un piloto medible; cualquier ROI será un supuesto identificado. Respondé con empatía y pedí un próximo paso concreto; descuentos solo dentro de límites autorizados.

## Procedencia y cambios

anthropics. https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/sales/skills/handle-objection/SKILL.md

Apache-2.0. Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan.

