---
name: scientific-problem-selection
description: Al elegir un problema científico, evaluar una hipótesis o destrabar investigación.
---

# Plantear y evaluar investigación

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "chemistry_lookup"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"name":"caffeine"}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Al elegir un problema científico, evaluar una hipótesis o destrabar investigación.
Definí pregunta, alcance, utilidad, hipótesis y criterio de éxito. Separá evidencia, inferencias e incertidumbre; identificá riesgos y decisiones que desbloquean el trabajo. Proponé revisión bibliográfica con criterios de inclusión y referencias verificadas; si no hay búsqueda conectada, pedí fuentes y no inventes citas. No deduzcas eficacia clínica de un ensayo preclínico. Decisiones clínicas, formulaciones y liberación de lotes requieren revisión profesional y normativa aplicable.

## Procedencia y cambios

anthropics. https://github.com/anthropics/knowledge-work-plugins/blob/33d3dea41a341b341d4f5da2e8801ae0c89be2b8/bio-research/skills/scientific-problem-selection/SKILL.md

Apache-2.0. Adaptación al español y al alcance de entrenamiento; conectores y acciones del original no se heredan.

