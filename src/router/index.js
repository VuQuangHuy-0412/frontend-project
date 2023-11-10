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
      path: '/admin/user',
      name: 'AdminUser',
      component: () => import("@/views/AdminUser"),
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
      path: '/admin/fee',
      name: 'Fee',
      component: () => import("@/views/Fee"),
      meta: { title: 'Cấu hình phí', layout: 'default' }
    },
    {
      path: '/admin/config/holiday',
      name: 'Holiday',
      component: () => import("@/views/HolidayConfig"),
      meta: { title: 'Cấu hình ngày nghỉ', layout: 'default' }
    },
    {
      path: '/admin/config/bank',
      name: 'Holiday',
      component: () => import("@/views/BankConfig"),
      meta: { title: 'Cấu hình ngân hàng', layout: 'default' }
    },
    {
      path: '/admin/config/bank-channel',
      name: 'Holiday',
      component: () => import("@/views/BankChannelConfig"),
      meta: { title: 'Cấu hình kết nối ngân hàng', layout: 'default' }
    },
    {
      path: '/admin/config/reload-config',
      name: 'Holiday',
      component: () => import("@/views/ReloadConfig"),
      meta: { title: 'Cập nhật cấu hình', layout: 'default' }
    },
    {
      path: '/admin/config/bonus-program',
      name: 'Bonus program',
      component: () => import("@/views/BonusProgramManagement"),
      meta: { title: 'Chương trình khuyến mãi', layout: 'default' }
    },
    {
      path: '/admin/config/block-device',
      name: 'BlockDevice',
      component: () => import("@/views/BlockDevice"),
      meta: { title: 'Khoá thiết bị', layout: 'default' }
    },
    {
      path: '/admin/config/transfer-bank-config',
      name: 'TransferBankConfig',
      component: () => import("@/views/TransferBankConfig"),
      meta: { title: 'Cấu hình tài khoản nguồn tại ngân hàng', layout: 'default' }
    },
    {
      path: '/admin/config/block-sotp',
      name: 'BlockSotp',
      component: () => import("@/views/BlockSOTP"),
      meta: { title: 'Khoá thiết bị ĐK SOTP', layout: 'default' }
    },
    {
      path: '/admin/config/recharge-main-wallet',
      name: 'RechargeMainWallet',
      component: () => import("@/views/RechargeMainWallet"),
      meta: { title: 'Cấu hình số tiền nạp ví tổng', layout: 'default' }
    },
    {
      path: '/admin/user-wallet',
      name: 'UserWallet',
      component: () => import("@/views/UserWallet"),
      meta: { title: 'Quản lý ví điện tử', layout: 'default' }
    },
    {
      path: '/admin/user-wallet/:id',
      name: 'UserWallet',
      component: () => import("@/views/UserWalletDetail"),
      meta: { title: 'Chi tiết ví điện tử', layout: 'default' }
    },
    {
      path: '/admin/accounts',
      name: 'Accounts',
      component: () => import("@/views/Accounts"),
      meta: { title: 'Quản lý tài khoản', layout: 'default' }
    },
    {
      path: '/admin/create-wallet',
      name: 'Create wallet',
      component: () => import("@/views/CreateWallet"),
      meta: { title: 'Tạo Ví', layout: 'default' }
    },
    {
      path: '/admin/transaction',
      name: 'TransactionNew',
      component: () => import("@/views/TransactionNew"),
      meta: { title: 'Quản lý giao dịch', layout: 'default' }
    },
    {
      path: '/admin/transaction-withdraw',
      name: 'TransactionWithdraw',
      component: () => import("@/views/TransferBankList"),
      meta: { title: 'Quản lý giao dịch rút tiền', layout: 'default' }
    },
    {
      path: '/admin/transaction/:id',
      name: 'Transaction Detail',
      component: () => import("@/views/TransactionDetail"),
      meta: { title: 'Chi tiết giao dịch', layout: 'default' }
    },
    {
      path: '/admin/create-manual-transaction',
      name: 'Create manual transaction',
      component: () => import("@/views/CreateManualTransaction"),
      meta: { title: 'Tạo GD nạp tiền bằng tay', layout: 'default' }
    },
    {
      path: '/admin/bank-transaction',
      name: 'BankTransaction',
      component: () => import("@/views/BankTransaction"),
      meta: { title: 'Giao dịch ngân hàng', layout: 'default' }
    },
    {
      path: '/admin/bank-trans-reconcile',
      name: 'BankTransReconcile',
      component: () => import("@/views/BankTransReconcile"),
      meta: { title: 'Đối soát giao dịch ngân hàng', layout: 'default' }
    },
    {
      path: '/admin/gl-logs',
      name: 'TransactionGLManagement',
      component: () => import("@/views/TransactionGLManagement"),
      meta: { title: 'Giao dịch chuyển tiền GL sang GL', layout: 'default' }
    },
    {
      path: '/admin/bank-reconcile',
      name: 'BankReconcile',
      component: () => import("@/views/BankReconcile"),
      meta: { title: 'Đối soát sai lệch ngân hàng', layout: 'default' }
    },
    {
      path: '/admin/fund-transfer',
      name: 'FundTransfer',
      component: () => import("@/views/FundTransfer"),
      meta: { title: 'Giao dịch chuyển tiền', layout: 'default' }
    },
    {
      path: '/admin/balance-gl',
      name: 'ViewBalanceGL',
      component: () => import("@/views/ViewBalanceGL"),
      meta: { title: 'Truy vấn TKĐB', layout: 'default' }
    },
    {
      path: '/admin/trans-type',
      name: 'TransactionType',
      component: () => import("@/views/TransactionType"),
      meta: { title: 'Quản lý loại giao dịch', layout: 'default' }
    },
    {
      path: '/admin/error-va-cod-transfer',
      name: 'ErrorCodTransfer',
      component: () => import("@/views/ErrorVACodTransfer"),
      meta: { title: 'Xử lý chuyển tiền nhầm', layout: 'default' }
    },
    {
      path: '/admin/va-transfer-requests',
      name: 'VATransferRequests',
      component: () => import("@/views/VATransferRequests"),
      meta: { title: ' Kiểm duyệt yêu cầu chuyển tiền nhầm VA COD', layout: 'default' }
    },
    {
      path: '/admin/config',
      name: 'Config',
      component: () => import("@/views/Config"),
      meta: { title: 'Quản lý cấu hình', layout: 'default' }
    },
    {
      path: '/admin/napas/transaction',
      name: 'NapasTransaction',
      component: () => import("@/views/NapasTransaction"),
      meta: { title: 'Quản lý giao dịch napas', layout: 'default' }
    },
    {
      path: '/admin/napas/file',
      name: 'NapasFile',
      component: () => import("@/views/NapasFile"),
      meta: { title: 'Danh sách file đối soát napas', layout: 'default' }
    },
    {
      path: '/admin/napas/file/:id',
      name: 'NapasFileDetail',
      component: () => import("@/views/NapasFileDetailById"),
      meta: { title: 'Chi tiết file đối soát napas', layout: 'default' }
    },
    {
      path: '/admin/napas/file-detail',
      name: 'NapasFileDetail',
      component: () => import("@/views/NapasFileDetail"),
      meta: { title: 'Chi tiết file đối soát napas', layout: 'default' }
    },
    {
      path: '/admin/napas/file-ecom',
      name: 'NapasFileEcom',
      component: () => import("@/views/NapasFileEcom"),
      meta: { title: 'Danh sách file đối soát napas ecom', layout: 'default' }
    },
    {
      path: '/admin/vpbank/file',
      name: 'VpbankFile',
      component: () => import("@/views/VpbankFile"),
      meta: { title: 'Danh sách file đối soát vpbank', layout: 'default' }
    },
    {
      path: '/admin/export/report-1',
      name: 'ExportReport1',
      component: () => import("@/views/ReportOne"),
      meta: { title: 'Xuất báo cáo', layout: 'default' }
    },
    {
      path: '/admin/export/report-2',
      name: 'ExportReport2',
      component: () => import("@/views/ReportTwo"),
      meta: { title: 'Xuất báo cáo', layout: 'default' }
    },
    {
      path: '/admin/export/report-3',
      name: 'ExportReport3',
      component: () => import("@/views/ReportThree"),
      meta: { title: 'Xuất báo cáo', layout: 'default' }
    },
    {
      path: '/admin/export/report-4',
      name: 'ExportReport4',
      component: () => import("@/views/ReportFour"),
      meta: { title: 'Xuất báo cáo', layout: 'default' }
    },
    {
      path: '/admin/export/report-5',
      name: 'ExportReport5',
      component: () => import("@/views/ReportFive"),
      meta: { title: 'Xuất báo cáo', layout: 'default' }
    },
    {
      path: '/admin/export/report-6',
      name: 'ExportReport6',
      component: () => import("@/views/ReportSix"),
      meta: { title: 'Xuất báo cáo', layout: 'default' }
    },
    {
      path: '/admin/approve-list',
      name: 'RequestList',
      component: () => import("@/views/RequestList"),
      meta: { title: 'Quản lý phê duyệt', layout: 'default' }
    },
    {
      path: '/admin/wallet/report',
      name: 'report',
      component: () => import("@/views/ReportWalletSchedule"),
      meta: { title: 'Danh sách', layout: 'default' }
    },
    {
      path: '/admin/wallet/approve',
      name: 'Approve',
      component: () => import("@/views/InitApproveWalletSchedule"),
      meta: { title: 'Rút tiền qua API', layout: 'default' }
    },
    {
      path: '/admin/wallet/withdraw-by-excel',
      name: 'report',
      component: () => import("@/views/WithdrawByExcel"),
      meta: { title: 'Rút tiền qua excel', layout: 'default' }
    },
    {
      path: '/admin/wallet/withdraw-gl',
      name: 'Withdraw GL',
      component: () => import("@/views/WithdrawGL"),
      meta: { title: 'Rút tiền ví tổng', layout: 'default' }
    },
    {
      path: '/admin/wallet/admin-transfer',
      name: 'Admin Withdraw',
      component: () => import("@/views/AdminWithdraw"),
      meta: { title: 'Chuyển tiền về ví tổng', layout: 'default' }
    },
    {
      path: '/admin/wallet/schedule-config-list',
      name: 'config list',
      component: () => import("@/views/WithdrawConfigList"),
      meta: { title: 'Danh sách cấu hình lịch rút tiền', layout: 'default' }
    },
    {
      path: '/admin/wallet/transfer-bank-pending-log',
      name: 'Transfer Bank Pending Log',
      component: () => import("@/views/TransferBankPendingLog"),
      meta: { title: 'Danh sách lập lịch thất bại', layout: 'default' }
    },
    {
      path: '/admin/wallet/exchange-gl',
      name: 'Withdrawn Money From GL to GL Account',
      component: () => import("@/views/ExchangeGL"),
      meta: { title: 'Rút tiền từ tài khoản GL sang GL', layout: 'default' }
    },
    {
      path: '/admin/merchant/product',
      name: 'Merchant Product',
      component: () => import("@/views/Product"),
      meta: { title: 'Danh sách sản phẩm', layout: 'default' }
    },
    {
      path: '/admin/merchant/product-route',
      name: 'Merchant Product Route',
      component: () => import("@/views/ProductRoute"),
      meta: { title: 'Danh sách hướng sản phẩm', layout: 'default' }
    },
    {
      path: '/admin/merchant/utility',
      name: 'Merchant Utility',
      component: () => import("@/views/Utility"),
      meta: { title: 'Danh sách tiện ích', layout: 'default' }
    },
    {
      path: '/admin/merchant/utility-route',
      name: 'Merchant Utility Route',
      component: () => import("@/views/UtilityRoute"),
      meta: { title: 'Danh sách hướng tiện ích', layout: 'default' }
    },
    {
      path: '/admin/merchant/collect-debts',
      name: 'Merchant Collect Debts',
      component: () => import("@/views/MerchantCollectDebts"),
      meta: { title: 'Thu nợ', layout: 'default' }
    },
    {
      path: '/admin/merchant/partner-products',
      name: 'Merchant Partner Products',
      component: () => import("@/views/PartnerProduct"),
      meta: { title: 'Quản lý sản phẩm đối tác', layout: 'default' }
    },
    {
      path: '/admin/merchant/partner-configs',
      name: 'Merchant Partner Config',
      component: () => import("@/views/PartnerConfig"),
      meta: { title: 'Quản lý cấu hình đối tác', layout: 'default' }
    },
    {
      path: '/admin/merchant/provider',
      name: 'Provider',
      component: () => import("@/views/Providers"),
      meta: { title: 'Quản lý nhà cung cấp', layout: 'default' }
    },
    {
      path: '/admin/merchant/promotion',
      name: 'Promotions Management',
      component: () => import("@/views/Promotions"),
      meta: { title: 'Quản lý danh sách banner khuyến mãi', layout: 'default'}
    },
    {
      path: '/admin/merchant/promotion/create',
      name: 'Promotions Create',
      component: () => import("@/views/CreatePromotion"),
      meta: { title: 'Tạo banner khuyến mãi', layout: 'default'}
    },
    {
      path: '/admin/merchant/promotion/update/:id',
      name: 'Promotions Update',
      component: () => import("@/views/CreatePromotion"),
      meta: { title: 'Cập nhật banner khuyến mãi', layout: 'default'}
    },
    {
      path: '/admin/client-manager',
      name: 'Client Manager',
      component: () => import("@/views/ClientManager"),
      meta: { title: 'Quản lý client', layout: 'default' }
    },
    {
      path: '/admin/change-request',
      name: 'Change request',
      component: () => import("@/views/ChangeRequest"),
      meta: { title: 'Quản lý thay đổi SĐT', layout: 'default' }
    },
    {
      path: '/admin/client-manager/:id',
      name: 'Job Manager',
      component: () => import("@/views/JobManager"),
      meta: { title: 'Quản lý tác vụ', layout: 'default' }
    },
    {
      path: '/admin/job-execution-history/:id',
      name: 'Job Execution History',
      component: () => import("@/views/JobExecutionHistory"),
      meta: { title: 'Lịch sử tác vụ', layout: 'default' }
    },
    {
      path: '/admin/payment/bill',
      name: 'Bill Payment',
      component: () => import("@/views/BillPayment"),
      meta: { title: 'Thanh toán hóa đơn', layout: 'default' }
    },
    {
      path: '/admin/payment/telecommunication',
      name: 'Telecom payment',
      component: () => import("@/views/TelecomPayment"),
      meta: { title: 'Viễn thông', layout: 'default' }
    },
    {
      path: '/admin/payment/insurance',
      name: 'Insurance Payment',
      component: () => import("@/views/InsurancePayment"),
      meta: { title: 'Bảo hiểm', layout: 'default' }
    },

    {
      path: '/admin/payment/voucher',
      name: 'Bill Payment',
      component: () => import("@/views/VoucherPayment"),
      meta: { title: 'Thanh toán voucher', layout: 'default' }
    },
    {
      path: '/admin/payment/shop-debt-payoff',
      name: 'Shop Debt Payoff Payment',
      component: () => import("@/views/ShopDebtPayoff"),
      meta: { title: 'Shop thanh toán gói ứng cod', layout: 'default' }
    },
    {
      path: '/admin/file',
      name: 'File',
      component: () => import("@/views/File"),
      meta: { title: 'Quản lý file', layout: 'default' }
    },
    {
      path: '/admin/config/create-va',
      name: 'Tạo tài khoản VA',
      component: () => import("@/views/CreateVA"),
      meta: { title: 'Tạo tài khoản VA', layout: 'default' }
    },
    {
      path: '/admin/config/block-withdraw',
      name: 'Block Withdraw',
      component: () => import("@/views/BlockWithdraw"),
      meta: { title: 'Chặn rút tiền trên ví', layout: 'default' }
    },
    {
      path: '/admin/config/on-off-banks',
      name: 'On off banks',
      component: () => import("@/views/OnOffBanks"),
      meta: { title: 'Đóng mở ngân hàng qua chi hộ', layout: 'default' }
    },
    {
      path: '/admin/search/napas-token',
      name: 'Search Napas Token',
      component: () => import("@/views/SearchNapasToken"),
      meta: { title: 'Tra cứu token Napas', layout: 'default' }
    },
    {
      path: '/cs',
      name: 'CS Screen',
      meta: { layout: 'cs', title: 'Màn hình CS' }
    },
    {
      path: '/accountant',
      name: 'Accountant Screen',
      meta: { layout: 'cs', title: 'Màn hình CS' }
    },
    {
      path: '/cs/money-not-received',
      name: 'Money Not Received',
      component: () => import("@/views/cs-views/MoneyNotReceived"),
      meta: { title: 'Chưa nhận tiền', layout: 'cs'}
    },
    {
      path: '/cs/error-active',
      name: 'Error Active Management',
      component: () => import("@/views/cs-views/ErrorActive/List.vue"),
      meta: { title: 'Kích hoạt lỗi', layout: 'cs'}
    },
    {
      path: '/cs/bank-error-code',
      name: 'Bank Error Code',
      component: () => import("@/views/cs-views/BankErrorCode"),
      meta: { title: 'Quản lý mã lỗi ngân hàng', layout: 'cs'}
    },
    {
      path: '/cs/ekyc-error-code',
      name: 'Ekyc Error Code',
      component: () => import("@/views/cs-views/EkycErrorCode"),
      meta: { title: 'Mã lỗi Ekyc', layout: 'cs'}
    },
    {
      path: '/admin/money-not-received',
      name: 'Money Not Received',
      component: () => import("@/views/cs-views/MoneyNotReceived"),
      meta: { title: 'Chưa nhận tiền', layout: 'default'}
    },
    {
      path: '/admin/error-active',
      name: 'Error Active Management',
      component: () => import("@/views/cs-views/ErrorActive/List.vue"),
      meta: { title: 'Kích hoạt lỗi', layout: 'default'}
    },
    {
      path: '/admin/bank-error-code',
      name: 'Bank Error Code',
      component: () => import("@/views/cs-views/BankErrorCode"),
      meta: { title: 'Quản lý mã lỗi ngân hàng', layout: 'default'}
    },
    {
      path: '/admin/ekyc-error-code',
      name: 'Ekyc Error Code',
      component: () => import("@/views/cs-views/EkycErrorCode.vue"),
      meta: { title: 'Mã lỗi Ekyc', layout: 'default'}
    },
    {
      path: '/admin/invoices',
      name: 'Invoice Management',
      component: () => import("@/views/invoice-views/Invoices"),
      meta: { title: 'Hoá đơn điện tử', layout: 'default'}
    },
    {
      path: '/admin/invoices/import',
      name: 'Invoice Import',
      component: () => import("@/views/invoice-views/InvoiceImport"),
      meta: { title: 'Tạo hoá đơn điện tử bằng excel', layout: 'default'}
    },
    {
      path: '/admin/invoices/bill-ar-auto',
      name: 'Bill AR Auto',
      component: () => import("@/views/invoice-views/BillArAuto"),
      meta: { title: 'Xuất file hoá đơn AR tự động', layout: 'default'}
    },
    {
      path: '/admin/invoices/:id',
      name: 'Invoice Detail',
      component: () => import("@/views/invoice-views/InvoiceDetail"),
      meta: { title: 'Chi tiết hoá đơn điện tử', layout: 'default'}
    },
    {
      path: '/admin/invoices/:id/update',
      name: 'Invoice Update',
      component: () => import("@/views/invoice-views/InvoiceUpdate"),
      meta: { title: 'Cập nhật hoá đơn điện tử', layout: 'default'}
    },
    {
      path: '/admin/invoices/:id/adjust',
      name: 'Invoice Adjust',
      component: () => import("@/views/invoice-views/InvoiceAdjust"),
      meta: { title: 'Tạo hoá đơn điều chỉnh', layout: 'default'}
    },
    {
      path: '/admin/invoices/:id/replace',
      name: 'Invoice Replace',
      component: () => import("@/views/invoice-views/InvoiceReplace"),
      meta: { title: 'Tạo hoá đơn thay thế', layout: 'default'}
    },
    {
      path: '/accountant/invoices',
      name: 'Invoice Management',
      component: () => import("@/views/invoice-views/Invoices"),
      meta: { title: 'Hoá đơn điện tử', layout: 'cs'}
    },
    {
      path: '/accountant/invoices/import',
      name: 'Invoice Import',
      component: () => import("@/views/invoice-views/InvoiceImport"),
      meta: { title: 'Tạo hoá đơn điện tử bằng excel', layout: 'cs'}
    },
    {
      path: '/accountant/invoices/bill-ar-auto',
      name: 'Bill AR Auto',
      component: () => import("@/views/invoice-views/BillArAuto"),
      meta: { title: 'Xuất file hoá đơn AR tự động', layout: 'cs'}
    },
    {
      path: '/accountant/invoices/:id',
      name: 'Invoice Detail',
      component: () => import("@/views/invoice-views/InvoiceDetail"),
      meta: { title: 'Chi tiết hoá đơn điện tử', layout: 'cs'}
    },
    {
      path: '/accountant/invoices/:id/update',
      name: 'Invoice Update',
      component: () => import("@/views/invoice-views/InvoiceUpdate"),
      meta: { title: 'Cập nhật hoá đơn điện tử', layout: 'cs'}
    },
    {
      path: '/accountant/invoices/:id/adjust',
      name: 'Invoice Adjust',
      component: () => import("@/views/invoice-views/InvoiceAdjust"),
      meta: { title: 'Tạo hoá đơn điều chỉnh', layout: 'cs'}
    },
    {
      path: '/accountant/invoices/:id/replace',
      name: 'Invoice Replace',
      component: () => import("@/views/invoice-views/InvoiceReplace"),
      meta: { title: 'Tạo hoá đơn thay thế', layout: 'default'}
    }
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

const DEFAULT_TITLE = 'Ewallet web admin'
router.afterEach((to, from) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE
  })
})

export default router;
