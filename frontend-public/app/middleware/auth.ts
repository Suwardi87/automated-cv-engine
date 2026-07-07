export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth_token').value

  if (!token) {
    return navigateTo('/login')
  }
})
