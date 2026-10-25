---
name: inventory-planner
description: Al calcular cobertura, inventario inmóvil o reposición.
---

# Inventario y riesgo de quiebre

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "logistics_reorder"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"stock":20,"reserved":0,"daily_demand":5,"lead_days":7,"safety_stock":5,"horizon_days":10,"confirmed_inbound":0}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Al calcular cobertura, inventario inmóvil o reposición.
Pedí SKU, fecha del conteo, ventas por fecha, stock, reservas, entradas confirmadas, proveedor y plazo. Compará demanda de 7 y 28 días y separá pedidos atípicos; falta de stock no es demanda cero. Usá logistics_reorder con demanda validada, seguridad y horizonte que cubra el plazo. Indicá cobertura, riesgo y supuestos, incluyendo llegada de entradas. Sin demanda no reordenes automáticamente; no prometas entregas sin confirmación.

## Procedencia y cambios

anthropics. https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/small-business/skills/inventory-planner/SKILL.md

Apache-2.0. Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan.

