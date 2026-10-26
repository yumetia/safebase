import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { jwtDecode } from 'jwt-decode'

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router)
  const token = localStorage.getItem('token')

  if (!token) {
    router.navigate(['/login'])
    return false
  }

  try {
    const decoded: any = jwtDecode(token)
    const expired = decoded.exp && decoded.exp * 1000 < Date.now()
    if (expired) {
      localStorage.removeItem('token')
      router.navigate(['/login'])
      return false
    }
  } catch {
    localStorage.removeItem('token')
    router.navigate(['/login'])
    return false
  }

  return true
}
