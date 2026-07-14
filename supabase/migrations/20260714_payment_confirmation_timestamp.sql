update public.payments
set confirmed_at = created_at
where status = 'confirmed'
  and confirmed_at is null;
