import {handleCRM} from './handler.mjs';
Deno.serve(request=>handleCRM(request,{url:Deno.env.get('SUPABASE_URL'),serviceKey:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),keyHash:'97b150c98be10605dcee0e94caef11cb4f7c7b3ea7991496ca582798a03389bd'}));
