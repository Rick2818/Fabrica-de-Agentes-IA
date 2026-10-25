---
name: close-plan
description: Al acordar pasos hacia aceptación, firma y pago.
---

# Negociación y plan de cierre

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "sales_qualify"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"requests":[{"url":"https://example.org/solicitud-1","pain":"Pedidos manuales duplicados","buyer_request":true,"fits":true,"status":"open"}]}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Al acordar pasos hacia aceptación, firma y pago.
Documentá motivo de compra, dolor medible, decisor y proceso de aprobación. Proponé un plan mutuo con pasos, responsables, fechas por acordar, bloqueos y evidencia. Confirmá alcance, precio aprobado, riesgos y aceptación. Pedí compromiso concreto sin urgencia ficticia; respetá negativas y bajas. Distinguí propuesta enviada, aceptada, firmada, pendiente de pago y cobrada. Entregá al ejecutor solo alcance y compromisos confirmados.

## Procedencia y cambios

anthropics. https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/sales/skills/close-plan/SKILL.md

Apache-2.0. Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan.

