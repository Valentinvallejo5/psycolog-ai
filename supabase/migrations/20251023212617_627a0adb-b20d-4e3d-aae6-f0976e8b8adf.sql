-- Add RLS policy for user_roles table
-- Users can view their own roles
create policy "Users can view own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);