<template>
<div>
  <div
      class="app-sidebar sidebar-shadow"
      @mouseover="toggleSidebarHover('add', 'closed-sidebar-open')"
      @mouseleave="toggleSidebarHover('remove', 'closed-sidebar-open')"
  >
    <div class="app-header__logo">
      <img
          class="logo-header-ghtk"
          src="@/assets/static/images/giao_hang_tiet_kiem.png"
      />
      <span class="title-logo">Giaohangtietkiem.vn</span>
    </div>
    <div class="app-sidebar-content custom-box-shadow">
      <VuePerfectScrollbar class="app-sidebar-scroll" v-once>
        <SidebarV2 :menu="menu" :collapsed="collapsed"/>
      </VuePerfectScrollbar>
    </div>
  </div>
  <div class="app-header__toggle" @click="toggleSidebar('closed-sidebar')">
      <template v-if="!clickedToggleSidebar">
        <i class="fas fa-bars"></i>
      </template>
      <template v-else>
        <i class="fas fa-align-left"></i>
      </template>
    </div>
</div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import SidebarV2 from "./SidebarV2";
import '@fortawesome/fontawesome-free/css/all.css'

export default {
  components: {
    VuePerfectScrollbar,
    SidebarV2
  },
  data() {
    return {
      isOpen: false,
      sidebarActive: false,
      menu: [
        {
          title: "Quản lý ví điện tử",
          icon: 'fa fa-wallet',
          child: [
            {
              href: "/admin/user-wallet",
              title: "Danh sách ví",
              permission: 'user_list'
            },
            {
              href: "/admin/accounts",
              title: "Danh sách ngăn ví",
              permission: 'account_list'
            }
          ],
        },
        {
          title: "Phê duyệt",
          icon: 'fa fa-check',
          child: [
            {
              href: "/admin/approve-list",
              title: "Danh sách yêu cầu phê duyệt",
              permission: 'request_approval_list'
            },
          ],
        },
        {
          title: "Giao dịch",
          icon: 'fa fa-book',
          child: [
            {
              href: "/admin/transaction",
              title: "Danh sách giao dịch",
              permission: 'transaction_list'
            },
            {
              href: "/admin/napas/transaction",
              title: "Giao dịch Napas",
              permission: 'napas_trans_list'
            },
            {
              href: "/admin/transaction-withdraw",
              title: "Giao dịch rút tiền nhanh",
              permission: 'transfer_bank_list'
            },
            {
              href: "/admin/create-manual-transaction",
              title: "Tạo GD nạp tiền bằng tay",
              permission: 'init_manual_trans_deposit'
            },
            {
              href: "/admin/bank-transaction",
              title: "Giao dịch ngân hàng",
              permission: 'transaction_bank'
            },
            {
              href: "/admin/bank-trans-reconcile",
              title: "Đối soát ngân hàng",
              permission: 'bank_trans_reconcile'
            },
            {
              href: "/admin/bank-reconcile",
              title: "Đối soát sai lệch ngân hàng",
              permission: 'bank_reconcile',
            },
            {
              href: "/admin/fund-transfer",
              title: "Giao dịch chuyển tiền",
              permission: 'cs_fund_transfer_list'
            },
            {
              href: "/admin/balance-gl",
              title: "Truy vấn TKĐB",
              permission: 'transaction_bank'
            },
            {
              href: "/admin/trans-type",
              title: "Danh sách loại giao dịch",
              permission: 'admin_list_transaction_type',
            },
            {
              href: "/admin/error-va-cod-transfer",
              title: "Xử lý chuyển tiền nhầm VA COD",
              permission: 'cod_status_job_info_detail'
            },
            {
              href: "/admin/va-transfer-requests",
              title: "Kiểm duyệt yêu cầu chuyển tiền nhầm VA COD",
              permission: 'get_cod_va_transfer_requests'
            },
            {
              href: "/admin/gl-logs",
              title: "Giao dịch chuyển tiền GL sang GL",
              permission: 'exchange_gl_logs'
            },
          ],
        },
        {
          title: "Thanh toán",
          icon: 'fa fa-credit-card',
          child: [
            {
              href: "/admin/payment/bill",
              title: "Thanh toán hóa đơn",
              permission: 'payment_transaction_list'
            },
            {
              href: "/admin/payment/telecommunication",
              title: "Viễn Thông",
              permission: 'payment_transaction_list'
            },
            {
              href: "/admin/payment/insurance",
              title: "Bảo hiểm",
              permission: 'payment_transaction_list'
            },
            {
              href: "/admin/payment/voucher",
              title: "Thanh toán voucher",
              permission: 'payment_transaction_list'
            },
            {
              href: "/admin/payment/shop-debt-payoff",
              title: "Shop thanh toán gói ứng cod",
              permission: 'payment_shop_debt_payoff'
            }
          ],
        },
        {
          title: "Đối soát",
          icon: 'fa fa-balance-scale',
          child: [
            {
              href: "/admin/napas/file",
              title: "File đối soát Napas",
              permission: 'napas_compare_file_list'
            },
            {
              href: "/admin/napas/file-detail",
              title: "Chi tiết file đối soát Napas",
              permission: 'napas_compare_file_detail_list'
            },
            {
              href: "/admin/napas/file-ecom",
              title: "File đối soát Napas Ecom",
              permission: 'napas_ecom_file_list'
            },
            {
              href: "/admin/vpbank/file",
              title: "File đối soát Vpbank",
              permission: 'vpbank_file_ftp_list'
            },
          ],
        },
        {
          title: "Rút tiền theo lịch trên Ví",
          icon: 'fa fa-money-bill-wave',
          child: [
            {
              href: "/admin/wallet/report",
              title: "Danh sách",
              permission: 'transfer_bank_pending_list'
            },
            {
              href: "/admin/wallet/approve",
              title: "Rút tiền qua API",
              permission: 'transfer_bank_pending_create_batch_payment'
            },
            {
              href: "/admin/wallet/withdraw-by-excel",
              title: "Rút tiền qua excel",
              permission: 'transfer_bank_pending_create_batch_payment'
            },
            {
              href: "/admin/wallet/schedule-config-list",
              title: "Danh sách cấu hình",
              permission: 'transfer_bank_schedule_list'
            },
            {
              href: "/admin/wallet/transfer-bank-pending-log",
              title: "Danh sách lập lịch thất bại",
              permission: 'transfer_bank_pending_log'
            }
          ],
        },
        {
          title: "Rút tiền GL",
          icon: "fa fa-money-bill",
          child: [
            {
              href: "/admin/wallet/exchange-gl",
              title: "Chuyển tiền ví tổng",
              permission: 'exchange_gl'
            },
            {
              href: "/admin/wallet/withdraw-gl",
              title: "Rút tiền ví tổng",
              permission: 'withdraw_gl'
            },
          ]
        },
        {
          title: "Chuyển tiền về ví tổng",
          icon: 'fa fa-money-check',
          child: [
            {
              href: "/admin/wallet/admin-transfer",
              title: "Chuyển tiền từ ví COD",
              permission: 'admin_transfer'
            }
          ],
        },
        {
          title: "Tra cứu",
          icon: "fa fa-search",
          child: [
            {
              href: "/admin/search/napas-token",
              title: "Tra cứu token Napas",
              permission: 'napas_token_get'
            }
          ]
        },
        {
          title: "Merchant",
          icon: 'fa fa-pager',
          child: [
            {
              href: "/admin/merchant/product",
              title: "Danh sách sản phẩm",
              permission: 'merchant_product_list'
            },
            {
              href: "/admin/merchant/product-route",
              title: "Danh sách hướng sản phẩm",
              permission: 'merchant_product_route_list'
            },
            {
              href: "/admin/merchant/utility",
              title: "Danh sách tiện ích",
              permission: 'merchant_utility_list'
            },
            {
              href: "/admin/merchant/utility-route",
              title: "Danh sách hướng tiện ích",
              permission: 'merchant_utility_route_list'
            },
            {
              href: "/admin/merchant/collect-debts",
              title: "Thu nợ",
              permission: 'merchant_collect_debts'
            },
            {
              href: "/admin/merchant/partner-products",
              title: "Danh sách sản phẩm đối tác",
              permission: 'merchant_partner_product_list'
            },
            {
              href: "/admin/merchant/partner-configs",
              title: "Danh sách cấu hình đối tác",
              permission: 'merchant_partner_config_list'
            },
            {
              href: "/admin/merchant/promotion",
              title: "Danh sách banner khuyến mãi",
              permission: 'merchant_promotion'
            },
            {
              href: "/admin/merchant/provider",
              title: "Danh sách nhà cung cấp",
              permission: 'merchant_provider_list'
            }
          ],
        },
        {
          title: "Cấu hình",
          icon: 'fa fa-cogs',
          child: [
            {
              href: "/admin/config/recharge-main-wallet",
              title: "Cấu hình số tiền nạp ví tổng",
              permission: 'get_recharge_main_wallet_amount'
            },
            {
              href: "/admin/config/transfer-bank-config",
              title: "Tài khoản nguồn GHTK và GHTKPay",
              permission: 'transfer_bank_config_get'
            },
            {
              href: "/admin/config/create-va",
              title: "Tạo tài khoản VA",
              permission: 'virtual_account_write'
            },
            {
              href: "/admin/config/block-device",
              title: "Khoá thiết bị",
              permission: 'block_device_list'
            },
            {
              href: "/admin/config/block-sotp",
              title: "Khoá thiết bị ĐK SOTP",
              permission: 'sotp_device_trust_read'
            },
            {
              href: "/admin/config/block-withdraw",
              title: "Chặn rút tiền trên Ví",
              permission: 'block_func_user_list'
            },
            {
              href: "/admin/config/on-off-banks",
              title: "Đóng/mở ngân hàng qua chi hộ",
              permission: 'bank_disable_channel'
            },
            {
              href: "/admin/config/bank",
              title: "Ngân hàng",
              permission: 'bank_update'
            },
            {
              href: "/admin/config/bank-channel",
              title: "Kết nối ngân hàng",
              permission: 'bank_channel_update'
            },
            {
              href: "/admin/config/holiday",
              title: "Ngày nghỉ",
              permission: 'holiday_list'
            },
            {
              href: "/admin/fee",
              title: "Phí",
              permission: 'fee_list'
            },
            {
              href: "/admin/config/reload-config",
              title: "Cập nhật cấu hình",
            },
            {
              href: "/admin/config/bonus-program",
              title: "Chương trình khuyến mãi",
              permission: "bonus_program_list"
            },
            {
              href: "/admin/config",
              title: "Khác",
              permission: 'config_search'
            },
          ],
        },
        {
          title: "Báo cáo ngân hàng nhà nước",
          icon: 'fa fa-file-export',
          child: [
            {
              href: "/admin/export/report-1",
              title: "Báo cáo số lượng Ví"
            },
            {
              href: "/admin/export/report-2",
              title: "Thống kê các loại GD",
            },
            {
              href: "/admin/export/report-3",
              title: "Báo cáo theo TK đảm bảo",
            },
            {
              href: "/admin/export/report-4",
              title: "Báo cáo TOP tài khoản",
            }
          ]
        },
        {
          title: "Quản trị",
          icon: 'fa fa-user',
          child: [
            {
              href: "/admin/user",
              title: "Người dùng",
              permission: 'admin_user_list'
            },
            {
              href: "/admin/permission",
              title: "Quản lý quyền",
              // permission: 'role_list'
            },
            {
              href: "/admin/role",
              title: "Vai trò và quyền hạn",
              permission: 'role_list'
            },
            {
              href: "/admin/log",
              title: "Log hệ thống",
              permission: 'admin_log_list'
            },
          ],
        },
        {
          title: "Thay đổi SĐT",
          icon: 'fas fa-tasks',
          child: [
            {
              title: "Danh sách yêu cầu thay đổi SĐT",
              href: "/admin/change-request",
              permission: 'username_change_request'
            },
          ]
        },
        {
          title: "Tác vụ",
          icon: 'fas fa-tasks',
          child: [
            {
              title: "Danh sách client",
              href: "/admin/client-manager",
            },
          ]
        },
        {
          title: "File xuất dữ liệu",
          icon: 'fas fa-file-alt',
          child: [
            {
              title: "Quản lý file",
              href: "/admin/file",
              permission: "file_list"
            },
          ]
        },
        {
          title: "Màn hình CS",
          icon: 'fa fa-user',
          child: [
            {
              title: "Chưa nhận tiền",
              href: "/admin/money-not-received",
              permission: "cs_transfer_bank_slow_list"
            },
            {
              title: "Kích hoạt lỗi",
              href: "/admin/error-active",
              permission: "cs_account_error_list"
            },
            {
              title: "Mã lỗi ngân hàng",
              href: "/admin/bank-error-code",
              permission: "cs_list_bank_error_code"
            },
            {
              title: "Mã lỗi Ekyc",
              href: "/admin/ekyc-error-code",
              permission: "cs_list_ekyc_error"
            }
          ]
        },
        {
          title: "Hoá đơn điện tử",
          icon: 'fas fa-file-invoice',
          child: [
            {
              title: "Danh sách hoá đơn điện tử",
              href: "/admin/invoices",
              permission: "cs_invoice_list"
            },
            {
              title: "Tạo hoá đơn điện tử bằng excel",
              href: "/admin/invoices/import",
              permission: "cs_invoice_initial"
            },
            {
              title: "Xuất file hoá đơn AR tự động",
              href: "/admin/invoices/bill-ar-auto",
              permission: "cs_bill_ar_list"
            },
          ]
        }
      ],
      collapsed: true,

      windowWidth: 0,

      clickedToggleSidebar: false
    };
  },
  props: {
    sidebarbg: String,
  },
  methods: {
    toggleBodyClass(className) {
      const el = document.body;
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },
    toggleSidebar(className) {
      const el = document.body;
      this.sidebarActive = !this.sidebarActive;
      this.clickedToggleSidebar = !this.clickedToggleSidebar

      this.windowWidth = document.documentElement.clientWidth;

      if (this.windowWidth > "992") {
        if (this.clickedToggleSidebar) {
          el.classList.add(className);
        } else {
          el.classList.remove(className);
        }
      }
    },
    toggleSidebarHover(add, className) {
      const el = document.body;
      this.sidebarActive = !this.sidebarActive;

      this.windowWidth = document.documentElement.clientWidth;

      if (this.windowWidth > "992") {
        if (add === "add") {
          el.classList.add(className);
        } else {
          el.classList.remove(className);
        }
      }
    },
    getWindowWidth() {
      const el = document.body;

      this.windowWidth = document.documentElement.clientWidth;

      if (this.windowWidth < "1350") {
        this.clickedToggleSidebar = true
        el.classList.add("closed-sidebar", "closed-sidebar-md");
      } else {
        this.clickedToggleSidebar = false
        el.classList.remove("closed-sidebar", "closed-sidebar-md");
      }
    },
  },
  created() {
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

    if (!userInfo) return;

    if (userInfo.roles.indexOf('admin') !== -1) return;

    userInfo.permissions = userInfo.permissions.replaceAll(' ', '').split(',')

    this.menu.forEach((item) => {
      item.child = item.child.filter((child) => userInfo.permissions.includes(child.permission))
    })

    this.menu = this.menu.filter((item) => item.child.length > 0)
  },
  mounted() {
    this.$nextTick(function () {
      window.addEventListener("resize", this.getWindowWidth);

      //Init
      this.getWindowWidth();
    });
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowWidth);
  },
};
</script>

<style lang="scss" scoped>
.logo-header-ghtk {
  margin-top: 1px;
  height: 47px;
  background: no-repeat;
  cursor: pointer;
}
</style>

<style lang="scss">
@import '../../assets/custom-menu-antd.scss';
.app-sidebar {
  padding-top: 0 !important;
}
.logo-src {
  background: no-repeat;
}
.title-logo {
  margin-left: 20px;
  font-weight: 500;
  font-size: 16px;
}
.app-header__toggle {
  padding: 0 1rem;
  height: 60px;
  width: auto;
  display: flex;
  align-items: center;
  transition: width .2s;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  margin-left: 1rem;
  left: calc(300px);
  z-index: 10;
  cursor: pointer;

  i {
    color: #01904a;
    font-size: 1.5rem;
    padding: 0.5rem;
    background: #fff;
    border-radius: 0 0 4px 4px;
    &:active {
      color: rgb(196, 196, 196);
      transform: translateY(3px);
    }
    border: 0 solid rgba(0,0,0,.125) !important;
    border-radius: 0.5rem !important;
    box-shadow: 0 .25rem .375rem -.0625rem rgba(20,20,20,.12),0 .125rem .25rem -.0625rem rgba(20,20,20,.07);
  }
}
.closed-sidebar {
  .app-header__toggle {
    left: 80px;
  }
}
.closed-sidebar-md {
  .app-header__toggle {
    display: none !important;
  }
}
.app-header__logo {
  color: #fff;
  background: #375271 !important;
  position: unset !important;
}
.app-sidebar-content {
  background: linear-gradient(313deg, rgba(66,109,173,1) 0%, #342b2b 0%, rgba(55,82,113,1) 56%) !important;
}
</style>
