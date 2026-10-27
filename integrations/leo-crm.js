/**
 * Leo CRM / Supabase Data API adapter.
 * Browser-safe: pass only the publishable key and the authenticated user's access token.
 * No service-role key and no credentials embedded in source code.
 */
export const LEO_CRM_SUPABASE_URL = "https://udispwzwrebjkanudcoy.supabase.co";

export class LeoCrmError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "LeoCrmError";
    this.status = status;
    this.details = details;
  }
}

export function createLeoCrm({ publishableKey, getAccessToken, fetchImpl = fetch }) {
  if (!publishableKey || typeof getAccessToken !== "function") {
    throw new Error("Leo CRM requires a Supabase publishable key and getAccessToken.");
  }

  async function request(table, { method = "GET", query = "", body, headers = {} } = {}) {
    const token = await getAccessToken();
    if (!token) throw new LeoCrmError("Usuario sin sesión: iniciá sesión antes de consultar el CRM.", 401);
    const response = await fetchImpl(`${LEO_CRM_SUPABASE_URL}/rest/v1/${table}${query}`, {
      method,
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${token}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        Accept: "application/json",
        ...headers,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (!response.ok) {
      const message = await response.text();
      throw new LeoCrmError(`Error CRM HTTP ${response.status}`, response.status, message);
    }
    if (response.status === 204) return null;
    return response.json();
  }

  const encode = encodeURIComponent;
  const select = (table, organizationId, additional = "") => {
    if (!organizationId) throw new Error("organizationId requerido");
    return request(table, { query: `?select=*&organization_id=eq.${encode(organizationId)}${additional}` });
  };

  return {
    listContacts: (organizationId) => select("crm_contacts", organizationId, "&order=created_at.desc"),
    listOpportunities: (organizationId) => select("crm_opportunities", organizationId, "&order=created_at.desc"),
    listOrders: (organizationId) => select("crm_orders", organizationId, "&order=created_at.desc"),
    findOrder: (organizationId, orderNumber) =>
      select("crm_orders", organizationId, `&order_number=eq.${encode(orderNumber)}&limit=1`),
    createContact: (organizationId, contact) =>
      request("crm_contacts", { method: "POST", headers: { Prefer: "return=representation" },
        body: { full_name: contact.full_name, email: contact.email ?? null,
          phone: contact.phone ?? null, notes: contact.notes ?? null, organization_id: organizationId } }),
    createOpportunity: (organizationId, opportunity) =>
      request("crm_opportunities", { method: "POST", headers: { Prefer: "return=representation" },
        body: { organization_id: organizationId, contact_id: opportunity.contact_id ?? null,
          title: opportunity.title, stage: opportunity.stage ?? "new",
          amount: opportunity.amount ?? null, currency: opportunity.currency ?? "USD" } }),
    createOrder: (organizationId, order) =>
      request("crm_orders", { method: "POST", headers: { Prefer: "return=representation" },
        body: { organization_id: organizationId, contact_id: order.contact_id ?? null,
          opportunity_id: order.opportunity_id ?? null, total: order.total ?? 0,
          currency: order.currency ?? "USD", status: "draft" } }),
    // Changing confirmed orders requires application-level approval before calling this method.
    updateOrderStatus: (organizationId, orderId, status) =>
      request("crm_orders", { method: "PATCH",
        query: `?id=eq.${encode(orderId)}&organization_id=eq.${encode(organizationId)}&select=*`,
        headers: { Prefer: "return=representation" }, body: { status } }),
  };
}
