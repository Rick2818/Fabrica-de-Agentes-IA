# Cliente sintético — seis especialidades, seis solicitudes distintas

Fecha: 2026-10-26 UTC. Evidencia obtenida de seis llamadas reales al MCP `Fábrica de Agentes IA` / `specialist_tool`, con datos exclusivamente ficticios o sintéticos.

**Resultado:** 6/6 operaciones respondieron y guardaron recibos. **Alcance:** verificación analítica de herramientas. No demuestra razonamiento de Gemini en esta ejecución, delegación automática, autonomía, ni la certificación del perfil. En los seis recibos `profile_id` aparece como `null`, por lo que no atribuir esos recibos a un agente individual. `external_actions=false`.

| Especialidad | Operación | Solicitud | Resultado | Recibo | SHA-256 |
|---|---|---|---|---|---|
| Leo | `sales_qualify` | Un comprador ficticio de cotizaciones y un vendedor | 1 solicitud calificada, 1 descartada | `a5e2c771-6912-42c8-8f82-3111ccfe8252` | `f03748421f8cb6626b9c5773b0a78cf6b36b6a895925564afa1157252ad48f75` |
| Mila | `support_triage` | Caída de servicio con 12 afectados y sin alternativa | P1, soporte técnico, SLA no inventado | `632a595c-bafa-4a80-956b-b0ee3a7e1b7e` | `4845a7e0e98c0d523de0719b2de7b07b5025ae085f94305c564bc1c0fbae2150` |
| Vera | `finance_reconcile` | Banco 2840, libro 2745, tránsito 125, cheques 220 | Saldo ajustado 2745, diferencia 0 | `97c48663-ebf0-4b8d-bb75-a96becd8352d` | `9bebf72c267b3bc70a18f6840e703d7a66c8995e1dafe252fd7f81bb4e100168` |
| Alma | `pharma_dossier_check` | Lote ficticio, faltante fórmula y estabilidad vencida | Completitud 66.67%, 1 faltante, 1 vencido, 1 sin verificar | `46e5b11e-1ba0-4ad1-ba53-8d37299bb75b` | `d1bc3f57d236ff7b57666a8f33e8ee41f67a81c93749a1e35973b9b5` |
| Nico | `logistics_reorder` | Existencia 18, reserva 2, demanda 6, plazo 5, horizonte 9 | Cobertura 2.67 días, reposición 36, riesgo alto | `7418c1d7-197f-49dd-8774-2b3ab2d1322f` | `6575598b3d7c575bbf76dad64c7b41c157e0a78801a4b7734921a7e9dd4bd6b5` |
| Lía | `marketing_metrics` | 12000 impresiones, 480 clics, 24 conversiones, gasto 360, ingreso atribuido 1440 | CTR 4%, CVR 5%, CPA 15, ROAS 4 | `570f0886-6137-4822-9e34-dc15263e5ee8` | `fbddfc2123b01b563206acf7e9f2cd688c3b7332a43bbe8f9d401bfb7de6ac62` |

## Límites y próximos criterios de aceptación

1. Ejecutar la solicitud completa mediante la ficha de cada agente, con su `profile_id`, llamada real a Gemini, resultado y recibo ligado al perfil.
2. Verificar que no se mezclan perfiles y que no ocurren acciones externas.
3. Ejecutar seis escenarios negativos o con datos incompletos y comprobar rechazo o pregunta aclaratoria.
4. Probar idioma EN/ES, móvil, recuperación de fallos y despliegue real del Site.
5. No declarar paridad con Dots ni habilitar cobros con estas seis pruebas.
