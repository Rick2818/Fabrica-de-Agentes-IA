# Contrato de recepción v1

POST al Site original, ruta `/internal/factory/orders`. El receptor está preparado y desactivado; el emisor se configura en su propio proyecto cuando el gate esté aprobado.

Cabeceras:

- `Content-Type: application/json`
- `X-Factory-Timestamp`: entero de milisegundos UTC; tolerancia 5 minutos.
- `X-Factory-Signature`: HMAC-SHA256 hexadecimal de `factory-order-v1\n{timestamp}\n{cuerpo exacto}`.
- Acceso de servicio de Sites, cuando lo exija su política privada. La clave HMAC del pedido no reemplaza el acceso a la plataforma.

Ejemplo exclusivamente documental, no es un pedido real:

```json
{
  "version": 1,
  "id": "pedido-documental-0001",
  "customer_id": "cliente-documental-0001",
  "email": "cliente@example.invalid",
  "template_id": "sales",
  "kind": "prebuilt",
  "objective": "Clasificar solicitudes proporcionadas",
  "specifications": "Analizar únicamente los datos autorizados por el cliente.",
  "criteria": ["Clasificar según los criterios aprobados"],
  "actions": ["classify_provided_data"],
  "permissions": ["read_provided_data"],
  "integrations": [],
  "locale": "es",
  "timezone": "America/El_Salvador",
  "limits": {"daily_calls": 10, "max_repairs": 3}
}
```

Plantillas: `sales`, `support`, `finance`, `pharma`, `logistics`, `marketing`. `kind` admite `prebuilt` o `custom`; personalizado no implica soporte automático para capacidades nuevas. Las integraciones usan `{name, authorization_ref}`; la referencia debe resolverse en el servidor para ese cliente antes de fabricar. Nunca enviar claves o tokens en el pedido. Los límites del contrato no aumentan la cuota global existente.

Respuesta 202: pedido recibido o pendiente de datos, con identificador, estado y faltantes. Respuesta 200: repetición idéntica, sin nueva producción. Un pedido incompleto se puede completar con el mismo ID solo añadiendo campos faltantes. Cambiar campos aprobados o reutilizar un ID con otro cliente devuelve 409. Firma inválida o vencida: 401. Payload mayor de 32 KB: 413. Fábrica deshabilitada o secreto no configurado: 503.

Estados: `needs_input`, `received`, `configured`, `repairing`, `certified`, `active`, `delivery_pending`, `email_accepted`, `blocked_configuration`, `needs_review`, `delivery_failed`.

`email_accepted` solo confirma aceptación del proveedor. La confirmación de entrega/rebote y su webhook autenticado aún deben implementarse con el proveedor seleccionado.

Las APIs `/api/factory/board` y `/api/factory/order?id=...` son del operador. No son endpoints de consulta pública del cliente. La consulta autenticada desde el emisor y la cabina todavía requieren implementación.
