-- Independent Sites identity bridge. No new login flow or public data grants.
create schema if not exists private;
create table if not exists private.crm_site_memberships (
  site_id text not null,
  email text not null,
  site_user_id text,
  organization_id uuid not null references public.crm_organizations(id),
  role text not null check (role in ('owner','admin','agent','viewer')),
  primary key(site_id,email),
  unique(site_id,site_user_id)
);
alter table private.crm_site_memberships enable row level security;
create policy crm_site_service_access on private.crm_site_memberships to service_role using (true) with check (true);
revoke all on private.crm_site_memberships from public,anon,authenticated;
grant usage on schema private to service_role;
grant select,update on private.crm_site_memberships to service_role;

create or replace function public.crm_leo_site_action(
 p_site_id text,p_user_id text,p_email text,p_action text,p_data jsonb default '{}'::jsonb
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare
 m private.crm_site_memberships;
 org_name text;
 result jsonb;
 request_id uuid;
 existing_org uuid;
 original jsonb;
 payload jsonb;
 new_order public.crm_orders;
begin
 if p_site_id is null or p_user_id is null or length(p_user_id)<1 or length(p_user_id)>256 or p_email is null then
  raise sqlstate 'PT401' using message='Identidad requerida.';
 end if;
 -- Only pre-approved members can bind a trusted, Site-scoped identity.
 select * into m from private.crm_site_memberships
 where site_id=p_site_id and email=lower(p_email) for update;
 if not found or (m.site_user_id is not null and m.site_user_id<>p_user_id) then
  raise sqlstate 'PT403' using message='No tenés acceso al CRM de esta empresa.';
 end if;
 if m.site_user_id is null then
  update private.crm_site_memberships set site_user_id=p_user_id
  where site_id=p_site_id and email=lower(p_email);
 end if;
 select name into org_name from public.crm_organizations where id=m.organization_id;
 if p_action='status' then
  return jsonb_build_object('connected',true,'organization',org_name,'role',m.role,'agent','Leo');
 elsif p_action='list' then
  return jsonb_build_object('organization',org_name,
   'orders',coalesce((select jsonb_agg(to_jsonb(o)) from (select id,order_number,status,currency,total,created_at from public.crm_orders where organization_id=m.organization_id order by created_at desc limit 50) o),'[]'::jsonb),
   'opportunities',coalesce((select jsonb_agg(to_jsonb(o)) from (select id,title,stage,currency,amount,created_at from public.crm_opportunities where organization_id=m.organization_id order by created_at desc limit 50) o),'[]'::jsonb));
 elsif p_action='get_order' then
  if coalesce(p_data->>'order_number','') !~ '^[0-9]{1,15}$' then raise sqlstate 'PT400' using message='Número de pedido inválido.'; end if;
  select to_jsonb(o) || jsonb_build_object('contact',to_jsonb(c),'opportunity',to_jsonb(q)) into result
  from public.crm_orders o left join public.crm_contacts c on c.id=o.contact_id and c.organization_id=o.organization_id
  left join public.crm_opportunities q on q.id=o.opportunity_id and q.organization_id=o.organization_id
  where o.organization_id=m.organization_id and o.order_number=(p_data->>'order_number')::bigint;
  if result is null then raise sqlstate 'PT404' using message='Pedido no encontrado en tu empresa.'; end if;
  return jsonb_build_object('order',result);
 elsif p_action='create_order' then
  if m.role='viewer' then raise sqlstate 'PT403' using message='Tu acceso es de solo lectura.'; end if;
  if coalesce(p_data->>'id','') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    or length(trim(coalesce(p_data->>'customer',''))) not between 1 and 160
    or length(trim(coalesce(p_data->>'title',''))) not between 1 and 200
    or length(trim(coalesce(p_data->>'details',''))) not between 1 and 4000
    or length(coalesce(p_data->>'email',''))>254
    or coalesce(p_data->>'currency','') !~ '^[A-Z]{3}$'
    or coalesce(p_data->>'total','') !~ '^[0-9]{1,10}(\.[0-9]{1,2})?$'
  then raise sqlstate 'PT400' using message='Completá los datos del pedido.'; end if;
  request_id=(p_data->>'id')::uuid;
  payload=jsonb_build_object('customer',trim(p_data->>'customer'),'email',lower(trim(coalesce(p_data->>'email',''))),'title',trim(p_data->>'title'),'details',trim(p_data->>'details'),'currency',p_data->>'currency','total',(p_data->>'total')::numeric);
  -- Serialize retries using the client request UUID. All inserts share one transaction.
  perform pg_advisory_xact_lock(hashtextextended(request_id::text,0));
  select organization_id into existing_org from public.crm_orders where id=request_id;
  if found then
   select details::jsonb into original from public.crm_activities where order_id=request_id and kind='note';
   if existing_org<>m.organization_id or original is distinct from payload then raise sqlstate 'PT409' using message='Identificador usado con otros datos.'; end if;
   select * into new_order from public.crm_orders where id=request_id and organization_id=m.organization_id;
   return jsonb_build_object('order',to_jsonb(new_order),'replayed',true);
  end if;
  insert into public.crm_contacts(id,organization_id,full_name,email) values(request_id,m.organization_id,payload->>'customer',nullif(payload->>'email',''));
  insert into public.crm_opportunities(id,organization_id,contact_id,title,currency,amount) values(request_id,m.organization_id,request_id,payload->>'title',payload->>'currency',(payload->>'total')::numeric);
  insert into public.crm_orders(id,organization_id,contact_id,opportunity_id,currency,total) values(request_id,m.organization_id,request_id,request_id,payload->>'currency',(payload->>'total')::numeric) returning * into new_order;
  insert into public.crm_activities(organization_id,contact_id,opportunity_id,order_id,kind,details) values(m.organization_id,request_id,request_id,request_id,'note',payload::text);
  return jsonb_build_object('order',to_jsonb(new_order),'replayed',false);
 end if;
 raise sqlstate 'PT400' using message='Operación no permitida.';
end $$;
revoke all on function public.crm_leo_site_action(text,text,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.crm_leo_site_action(text,text,text,text,jsonb) to service_role;
