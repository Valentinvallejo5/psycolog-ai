import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ allowed: false, error: 'unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get authenticated user - extract JWT and pass it directly
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ allowed: false, error: 'unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's subscription plan
    const { data: subscription, error: subError } = await supabase
      .from('subscription_plans')
      .select('plan')
      .eq('user_id', user.id)
      .single();

    if (subError) {
      console.error('Subscription error:', subError);
      return new Response(
        JSON.stringify({ allowed: false, error: 'server_error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Premium users get unlimited access
    if (subscription?.plan === 'monthly' || subscription?.plan === 'annual') {
      // Still track usage for analytics
      const today = new Date().toISOString().split('T')[0];
      
      await supabase.rpc('increment_meditation_count', {
        p_user_id: user.id,
        p_date: today
      });

      return new Response(
        JSON.stringify({ allowed: true, plan: subscription.plan }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Free users - check daily limit
    const today = new Date().toISOString().split('T')[0];
    
    const { data: usage, error: usageError } = await supabase
      .from('daily_usage')
      .select('meditation_sessions_count')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (usageError && usageError.code !== 'PGRST116') {
      console.error('Usage error:', usageError);
      return new Response(
        JSON.stringify({ allowed: false, error: 'server_error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentCount = usage?.meditation_sessions_count || 0;

    // Free users limited to 2 sessions per day
    if (currentCount >= 2) {
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          reason: 'limit_reached',
          current_count: currentCount,
          max_count: 2
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Increment counter
    if (!usage) {
      // Create new record
      const { error: insertError } = await supabase
        .from('daily_usage')
        .insert({
          user_id: user.id,
          date: today,
          panic_sessions_count: 0,
          meditation_sessions_count: 1
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        return new Response(
          JSON.stringify({ allowed: false, error: 'server_error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Update existing record
      const { error: updateError } = await supabase
        .from('daily_usage')
        .update({ meditation_sessions_count: currentCount + 1 })
        .eq('user_id', user.id)
        .eq('date', today);

      if (updateError) {
        console.error('Update error:', updateError);
        return new Response(
          JSON.stringify({ allowed: false, error: 'server_error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        allowed: true, 
        plan: 'free',
        current_count: currentCount + 1,
        max_count: 2
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ allowed: false, error: 'server_error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
