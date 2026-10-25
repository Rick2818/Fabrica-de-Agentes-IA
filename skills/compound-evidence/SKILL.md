---
name: compound-evidence
description: Al consultar identidad y propiedades de un compuesto público.
---

# Identidad química y evidencia

## Herramienta y entrada

Consultar el MCP de la Fábrica con `specialty_skills` para confirmar el acceso. Si está disponible, llamar `specialist_tool` con `operation: "chemistry_lookup"` y `data` según este ejemplo sintético; reemplazar los datos por los del caso. No llamar una herramienta ausente ni asumir conexiones a sistemas del cliente.

```json
{"name":"caffeine"}
```

El recibo indica operación, datos resultantes, fuente, fecha y hash. La herramienta apoya este procedimiento; no ejecuta todos sus pasos ni autoriza acciones externas.

Trabajá solo con datos y herramientas autorizados. Si falta información esencial, pedila. No inventes búsquedas, fuentes, resultados ni acciones ejecutadas. En esta Fábrica se entrena: el negocio, sus datos y permisos se asignan al agente concreto después. Entregá resultado, evidencia, límites y siguiente paso verificable.

Al consultar identidad y propiedades de un compuesto público.
Usá chemistry_lookup con el nombre público o pedí identificador si hay ambigüedad. Informá CID, fórmula, masa molecular, fuente y fecha. Verificá sales, estereoquímica y unidades; no extrapoles propiedades de un compuesto a otra forma. PubChem no certifica pureza, seguridad clínica, dosis ni aprobación regulatoria. Para farmacia, pedí fuentes clínicas y regulación vigente; prepará evidencia para revisión profesional sin prescribir ni liberar productos.

## Procedencia y cambios

Fábrica de Agentes IA. https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest

Implementación propia; datos con atribución a PubChem. Procedimiento propio de consulta y verificación.

