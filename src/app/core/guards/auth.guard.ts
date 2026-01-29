import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  // Consideramos que la sesión puede tardar un poco en inicializarse si es la primera carga
  // Forzamos un chequeo de sesión del cliente si el signal es null
  const { data } = await supabase.client.auth.getSession();

  if (data.session) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
