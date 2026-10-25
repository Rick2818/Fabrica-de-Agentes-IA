# Separación de la Fábrica y los negocios de sus agentes

| Ámbito | Propósito | Datos y disparadores |
|---|---|---|
| Fábrica de Agentes IA | Crear, configurar, practicar y revisar agentes | Perfiles y recibos de pruebas; por defecto entrenamiento |
| Negocio asignado a un vendedor | Prospectar y gestionar su oferta | business_id explícito, oferta aprobada, fuentes y canales propios |
| Boltech Group | Negocio independiente, con AGENT1 propio | Su CRM, sus ejecutores y sus oportunidades; no heredados por la Fábrica |

La prospección real requiere negocio y oferta asignados. Sin esos datos no se activa un calendario ni se guarda demanda real. Se comprueba business_id en el escritor, en la deduplicación y en la lectura. Ninguna configuración conecta automáticamente dos negocios.

Excepción puntual aprobada el 25-10-2026: entregar la solicitud n8n 323862 al Agente 1 de Boltech. Recibo de cola: opportunity:n8n:323862. Lead: 137ca723-ad1d-5a09-dc20-e9a85a498eaf. Oportunidad: dfd156c4-aaaf-ea90-ebc8-6ad92c5197a3. Lectura posterior confirmó owner_agent=AGENT1, estado PENDING y OPPORTUNITY_RECEIVED_REVIEW_REQUIRED. No se afirmó procesamiento, envío ni cobro.
