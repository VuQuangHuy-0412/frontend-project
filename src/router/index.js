import Vue from 'vue'
import Router from 'vue-router'
import StorageService from '@/common/storage.service';

Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      meta: { layout: 'userpages', loginPage: true, nonRequiresAuth: true, title: 'Đăng nhập' },
      component: () => import("@/views/Login"),
    },
    {
      path: '/',
      name: 'DefaultPage',
      meta: { title: 'Quản lý ví điện tử', layout: 'default' }
    },
    {
      path: '/admin/role',
      name: 'Role',
      component: () => import("@/views/Role"),
      meta: { title: 'Quản lý vai trò', layout: 'default' }
    },
    {
      path: '/admin/permission',
      name: 'Permission',
      component: () => import("@/views/Permissions"),
      meta: { title: 'Quản lý quyền', layout: 'default' }
    },
    {
      path: '/admin/log',
      name: 'AdminUserLog',
      component: () => import("@/views/AdminUserLog"),
      meta: { title: 'Quản lý log', layout: 'default' }
    },
    {
      path: '/admin/accounts',
      name: 'Accounts',
      component: () => import("@/views/Accounts"),
      meta: { title: 'Quản lý tài khoản', layout: 'default' }
    },
    {
      path: '/admin/teachers',
      name: 'Teachers',
      component: () => import("@/views/Teachers"),
      meta: { title: 'Quản lý giảng viên', layout: 'default' }
    },
    {
      path: '/admin/group-teachers',
      name: 'GroupTeachers',
      component: () => import("@/views/GroupTeachers"),
      meta: { title: 'Quản lý nhóm chuyên môn', layout: 'default' }
    },
  ]
});
router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    localStorage.setItem('savedPath', to.fullPath)
  }
  const publicPages = ['/login', '/config-api'];
  const authRequired = !publicPages.includes(to.path);
  const isAuthenticated = !!StorageService.get("Token");
  const isGchatAuthenticated = !!StorageService.get("ewallet_gchat_token_test");
  if (to.path.includes('/cs/') && isAuthenticated && isGchatAuthenticated) {
    next()
  }
  if (to.path.includes('/admin/') && isAuthenticated) {
    next()
  }
  if (authRequired && !isAuthenticated) {
    next('/login')
  }
  next()
});

router.onError(error => {
  if (/ChunkLoadError:.*failed./i.test(error.message)) {
    Vue.prototype.$log.error('Reloading Window 1');
    window.location.reload();
  }
  else if (/Loading.*chunk.*failed./i.test(error.message)) {
    Vue.prototype.$log.error('Reloading Window 2');
    window.location.reload();
  }
});

const DEFAULT_TITLE = 'SC5 web admin'
router.afterEach((to, from) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE
  })
})

export default router;
