---
name: variance-analysis
description: Al comparar presupuesto, resultados o periodos.
---

# Explicar variaciones

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "finance_reconcile"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"bank_balance":1000,"ledger_balance":980,"deposits_in_transit":100,"outstanding_checks":120,"unposted_fees":0,"unposted_interest":0,"currency":"USD","as_of":"2026-10-01"}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Al comparar presupuesto, resultados o periodos.
Alineá moneda, periodo, unidades, criterio contable y fuente. Calculá real menos presupuesto; porcentaje solo si base distinta de cero. Separá precio y volumen con fórmula consistente y verificá que sumen la variación. Diferenciá ingreso, caja y rentabilidad; explicaciones causales solo con evidencia. Entregá tabla, supuestos y acciones de investigación; revisión financiera previa a decisiones o reportes.

## Procedencia y cambios

anthropics. https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/finance/skills/variance-analysis/SKILL.md

Apache-2.0. Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan.

