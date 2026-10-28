-- Fábrica only. No secrets in SQL source or cron command. Installed inactive.
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
create table private.fabrica_scheduler_config (
 singleton boolean primary key default true check (singleton),
 enabled boolean not null default false,
 not_before timestamptz,
 last_error text
);
insert into private.fabrica_scheduler_config(singleton) values(true);
create table private.fabrica_scheduler_receipts (
 cycle_id uuid primary key,
 scheduled_at timestamptz not null,
 request_id bigint unique not null,
 checked_at timestamptz,
 http_status integer,
 verified boolean not null default false,
 site_status text,
 site_completed_at bigint,
 error_code text
);
alter table private.fabrica_scheduler_config enable row level security;
alter table private.fabrica_scheduler_receipts enable row level security;
revoke all on private.fabrica_scheduler_config,private.fabrica_scheduler_receipts from public,anon,authenticated;

create function private.fabrica_scheduler_reconcile() returns void
language plpgsql security invoker set search_path=pg_catalog as $$
declare r record; payload jsonb; ok boolean; code text; resume_ms bigint;
begin
 for r in
  select s.cycle_id,s.scheduled_at,s.request_id,h.status_code,h.content,h.timed_out,h.error_msg
  from private.fabrica_scheduler_receipts s join net._http_response h on h.id=s.request_id
  where s.checked_at is null order by s.scheduled_at limit 30
 loop
  payload:=null;ok:=false;code:=null;resume_ms:=null;
  if r.timed_out or r.error_msg is not null then code:='network_error';
  elsif r.status_code<>200 then code:='http_'||r.status_code::text;
  else
   begin
    payload:=r.content::jsonb;
    ok:=coalesce(payload#>>'{receipt,source}'='supabase-cron'
      and payload#>>'{receipt,supabase,provider}'='supabase-cron'
      and payload#>>'{receipt,supabase,project_id}'='udispwzwrebjkanudcoy'
      and payload#>>'{receipt,supabase,schedule_id}'='supabase:udispwzwrebjkanudcoy:fabrica-queue'
      and payload#>>'{receipt,supabase,run_id}'=r.cycle_id::text
      and (payload#>>'{receipt,supabase,scheduled_at}')::bigint=(extract(epoch from r.scheduled_at)*1000)::bigint
      and payload#>>'{receipt,status}'=payload#>>'{run,status}'
      and payload#>>'{run,status}' in ('done','cancelled','busy','quota','waiting','needs_input','idle','paused','failed','error','unconfigured')
      and (payload#>>'{receipt,completed_at}')::bigint >= (payload#>>'{receipt,started_at}')::bigint
      and (payload#>>'{receipt,completed_at}')::bigint <= (extract(epoch from clock_timestamp())*1000)::bigint+300000
      and (payload#>>'{receipt,pending}')::integer>=0
      and (payload#>>'{run,status}' not in ('done','cancelled') or payload#>>'{run,id}'=payload#>>'{receipt,job_id}'),false);
    if not ok then code:='receipt_mismatch';
    elsif payload#>>'{receipt,next_at}' is not null then resume_ms:=(payload#>>'{receipt,next_at}')::bigint;
    end if;
   exception when others then ok:=false;code:='response_not_valid';
   end;
  end if;
  update private.fabrica_scheduler_receipts set checked_at=clock_timestamp(),http_status=r.status_code,
   verified=ok,site_status=case when ok then payload#>>'{run,status}' end,
   site_completed_at=case when ok then (payload#>>'{receipt,completed_at}')::bigint end,error_code=code
   where cycle_id=r.cycle_id;
  if not ok or payload#>>'{run,status}' in ('failed','error','unconfigured') then
   update private.fabrica_scheduler_config set not_before=clock_timestamp()+interval '5 minutes',last_error=coalesce(code,'worker_error') where singleton;
  elsif resume_ms is not null and resume_ms>(extract(epoch from clock_timestamp())*1000)::bigint then
   update private.fabrica_scheduler_config set not_before=to_timestamp(resume_ms/1000.0),last_error=null where singleton;
  else
   update private.fabrica_scheduler_config set not_before=null,last_error=null where singleton;
  end if;
 end loop;
 -- Responses can expire from pg_net; a missing receipt is never success.
 update private.fabrica_scheduler_receipts set checked_at=clock_timestamp(),error_code='response_missing'
  where checked_at is null and scheduled_at<clock_timestamp()-interval '2 minutes';
 if found then update private.fabrica_scheduler_config set not_before=clock_timestamp()+interval '5 minutes',last_error='response_missing' where singleton;end if;
end;
$$;
revoke all on function private.fabrica_scheduler_reconcile() from public,anon,authenticated;

create function private.fabrica_scheduler_tick() returns jsonb
language plpgsql security invoker set search_path=pg_catalog as $$
declare cfg record; k text; bearer text; cycle uuid; at_time timestamptz; request bigint;
begin
 if not pg_try_advisory_xact_lock(1432658222,51) then return jsonb_build_object('status','busy');end if;
 perform private.fabrica_scheduler_reconcile();
 select * into cfg from private.fabrica_scheduler_config where singleton for update;
 if not cfg.enabled then return jsonb_build_object('status','disabled');end if;
 if cfg.not_before>clock_timestamp() then return jsonb_build_object('status','deferred','until',cfg.not_before);end if;
 if exists(select 1 from private.fabrica_scheduler_receipts where checked_at is null) then return jsonb_build_object('status','awaiting_receipt');end if;
 select decrypted_secret into k from vault.decrypted_secrets where name='fabrica_sites_runner_key';
 select decrypted_secret into bearer from vault.decrypted_secrets where name='fabrica_sites_service_bearer';
 if k is null or length(k)<32 or bearer is null then
  update private.fabrica_scheduler_config set not_before=clock_timestamp()+interval '5 minutes',last_error='credentials_missing' where singleton;
  return jsonb_build_object('status','credentials_missing');
 end if;
 cycle:=gen_random_uuid();
 -- Millisecond precision must exactly match the request's correlation field.
 at_time:=date_trunc('milliseconds',clock_timestamp());
 select net.http_post(
  url:='https://agente-ricardo-revision-rick.glassybell1025.chatgpt.site/internal/runner',
  headers:=jsonb_build_object('Content-Type','application/json','OAI-Sites-Authorization','Bearer '||bearer,'x-supabase-runner-key',k),
  body:=jsonb_build_object('provider','supabase-cron','project_id','udispwzwrebjkanudcoy',
   'schedule_id','supabase:udispwzwrebjkanudcoy:fabrica-queue','event','schedule','run_id',cycle::text,
   'scheduled_at',(extract(epoch from at_time)*1000)::bigint),timeout_milliseconds:=55000)
 into request;
 insert into private.fabrica_scheduler_receipts(cycle_id,scheduled_at,request_id) values(cycle,at_time,request);
 -- Only this function's telemetry is retained for seven days; CRM untouched.
 delete from private.fabrica_scheduler_receipts where scheduled_at<clock_timestamp()-interval '7 days';
 return jsonb_build_object('status','requested','cycle_id',cycle,'request_id',request);
end;
$$;
revoke all on function private.fabrica_scheduler_tick() from public,anon,authenticated;
select cron.schedule('fabrica-queue','* * * * *','select private.fabrica_scheduler_tick();');
select cron.alter_job(jobid,active:=false) from cron.job where jobname='fabrica-queue';
