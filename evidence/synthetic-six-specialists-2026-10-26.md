# Cliente sintético — seis solicitudes distintas (2026-10-26)

**Resultado: 6/6 herramientas analíticas respondieron y generaron recibos; NO es certificación de seis agentes conversacionales autónomos.** Cada ejecución fue invocada mediante la integración MCP Fábrica de Agentes IA con datos totalmente sintéticos; `profile_id=null` y `external_actions=false`. No se enviaron contactos, compras, correos, registros sanitarios ni campañas.

| Especialista | Operación | Caso y resultado | Recibo |
|---|---|---|---|
| Leo · Ventas | `sales_qualify` | Dos solicitudes ficticias: identifica un posible comprador, rechaza oferta de vendedor; sin verificación web | `6e597cc0-0433-46c1-8cc6-5bda017866a6` |
| Mila · Servicio | `support_triage` | Servicio bloqueado a 12 usuarios sin alternativa: P1, sin inventar SLA | `10dae88e-d431-4526-afb2-adf309617a6a` |
| Vera · Finanzas | `finance_reconcile` | Banco 2840 +125 -220 =2745; libro 2745; diferencia 0 USD, no contabilizado | `bd59c5c8-3693-47f1-8cd0-6606947fdadb` |
| Alma · Química y farmacia | `pharma_dossier_check` | Falta fórmula; estabilidad vencida y no verificada; cobertura documental 66.67%, no libera lotes | `e61ccd17-92f2-4007-ab85-f16ecdb350fd` |
| Nico · Logística | `logistics_reorder` | Disponible 16, posición 22, punto 34, cobertura 2.67 días, sugerir 36 sin emitir compra | `d4c37cfc-4c84-4946-96a6-203b32666303` |
| Lía · Mercadeo | `marketing_metrics` | 12000 impresiones, 480 clics, 24 conversiones, gasto 360, atribución 1440: CTR 4%, conversión 5%, CPA 15, ROAS 4 | `a8231e27-6a05-4283-993d-7b5bcdf7cb5a` |

## Criterios y límites

1. Cada recibo devuelve un hash SHA-256, fecha y resultado. Los hashes originales están en el almacén de recibos de la Fábrica.
2. Estos resultados acreditan herramientas especializadas separadas; **no** prueban que se haya realizado una solicitud directamente a la ficha de cada mascota, una respuesta Gemini independiente, coordinación autónoma, navegador, conectores externos o equivalencia con Dots.
3. Para esa siguiente certificación: crear seis prácticas en perfiles persistidos diferentes, dirigir el escenario por perfil, esperar el resultado de Gemini, comprobar aislamiento y emitir seis recibos con `profile_id` real y aprobación evaluada.
4. No atribuir a los registros ficticios del dominio `example.org` la condición de clientes ni leads reales.
