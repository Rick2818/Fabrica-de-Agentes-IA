---
name: customer-escalation
description: Ante incidentes sensibles, repetidos o fuera del alcance de soporte.
---

# Escalar con contexto

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "support_triage"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"production_blocked":true,"security_incident":false,"workaround":false,"affected_users":12}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Ante incidentes sensibles, repetidos o fuera del alcance de soporte.
Prepará resumen, cronología, impacto, evidencia y pasos de reproducción cuando existan. Indicá qué se intentó, qué falta y por qué escalar. Usá política para destino y prioridad; no inventes responsable. Minimizá datos personales. Entregá paquete y respuesta al cliente; escalar no equivale a resolver ni a haber enviado nada.

## Procedencia y cambios

anthropics. https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/customer-support/skills/customer-escalation/SKILL.md

Apache-2.0. Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan.

