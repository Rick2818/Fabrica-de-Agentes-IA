---
name: restock
description: Al convertir necesidades de inventario en una compra propuesta.
---

# Preparar reposición y recepción

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "logistics_reorder"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"stock":20,"reserved":0,"daily_demand":5,"lead_days":7,"safety_stock":5,"horizon_days":10,"confirmed_inbound":0}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Al convertir necesidades de inventario en una compra propuesta.
Partí del análisis inventory-planner; no inventes demanda ni costos. Prepará lista por proveedor con cantidades, fechas, costo confirmado y riesgo. Separá aprobación de lista, orden y envío; solo con permiso y conector verificado se ejecutan. Dejá borrador de orden y recepción esperada; después cotejá orden, recepción y factura. Evitá compras duplicadas y preservá pendiente cuando falten datos.

## Procedencia y cambios

anthropics. https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/small-business/skills/restock/SKILL.md

Apache-2.0. Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan.

