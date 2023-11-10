<template>
  <div :class="['cs-sidebar', { 'custom-header': isCollapse }]">
    <div class="cs-sidebar-content" v-if="!isCollapse">
      <VuePerfectScrollbar class="cs-sidebar-scroll">
        <div class="cs-content-wrapper" v-if="checkAllowRole(csRoles)">
          <div :class="['cs-item', {'cs-clicked-item': checkCurrentRoute('/cs/money-not-received')}]" @click="navigateTo('/cs/money-not-received')">
            <span>Chưa nhận tiền</span>
            <div>{{ dataMoneyNotReceived ? dataMoneyNotReceived.totalShop : 0 }} Shop / {{ dataMoneyNotReceived ? dataMoneyNotReceived.totalShopTrans : 0 }} Giao dịch <i class="fas fa-angle-right"></i></div>
          </div>
        </div>
        <div class="cs-content-wrapper" v-if="checkAllowRole(csRoles)">
          <div :class="['cs-item', {'cs-clicked-item': checkCurrentRoute('/cs/error-active')}]" @click="navigateTo('/cs/error-active')">
            <span>Kích hoạt lỗi</span>
          </div>
        </div>
        <div class="cs-content-wrapper" v-if="checkAllowRole(csRoles)">
          <div :class="['cs-item', {'cs-clicked-item': checkCurrentRoute('/cs/bank-error-code')}]" @click="navigateTo('/cs/bank-error-code')">
            <span>Mã lỗi ngân hàng</span>
          </div>
        </div>
        <div class="cs-content-wrapper" v-if="checkAllowRole(csRoles)">
          <div :class="['cs-item', {'cs-clicked-item': checkCurrentRoute('/cs/ekyc-error-code')}]" @click="navigateTo('/cs/ekyc-error-code')">
            <span>Mã lỗi Ekyc</span>
          </div>
        </div>
        <div class="cs-content-wrapper" v-if="checkAllowRole(invoiceRoles)">
          <div :class="['cs-item', {'cs-clicked-item': checkCurrentRoute('/accountant/invoices')}]" @click="navigateTo('/accountant/invoices')">
            <span>Hoá đơn điện tử</span>
          </div>
        </div>
      </VuePerfectScrollbar>
    </div>
    <div class="cs-sidebar-header w-100" v-if="!isCollapse">
      <div class="cs-title">Quản lý công việc</div>
      <div class="cs-title-right" @click="collapse">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </div>
    </div>
    <div :class="['cs-sidebar-header custom', {'w-20': !isCollapse}]" v-else>
      <div class="cs-title-right" @click="collapse">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </div>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import SidebarV2 from "./SidebarV2";
import '@fortawesome/fontawesome-free/css/all.css';
import router from "@/router";
import baseMixins from '@/components/mixins/base';
import { formatTime } from '@/common/utils';

export default {
  components: {
    VuePerfectScrollbar,
    SidebarV2
  },
  data() {
    return {
      totalAccountError: null,
      dataMoneyNotReceived: null,
      dataFilter: {
        shopCodes: "",
        type: "",
        listStatus: [2, 4, 7],
        createdAtFrom: formatTime(new Date(), 'START'),
        createdAtTo: formatTime(new Date(), 'END'),
        page: 1,
        pageSize: 20
      },
      userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
      invoiceRoles: ['KT_VI', 'QA_VI', 'admin'],
      csRoles: ['CS', 'CS_1', 'admin'],
    };
  },
  props: {
    isCollapse: Boolean
  },
  methods: {
    navigateTo (url) {
      router.push({path: url});
      this.getDataMoneyNotReceived();
    },
    checkCurrentRoute (url) {
      return this.$route.path === url
    },
    checkAllowRole(roles) {
      if (!this.userInfo || !this.userInfo.roles) return false
      let allowRole = this.userInfo.roles.split(',').filter(role => roles.indexOf(role) !== -1)
      
      return allowRole && allowRole.length > 0
    },
    async getTotalAccountError () {
      let res = await this.get('/account-error/get-total-account-error')
      if (res.data && res.status === 200) {
        this.totalAccountError = res.data.totalRecord
      }
    },
    collapse() {
      this.$emit('collapse');
    },
    async getDataMoneyNotReceived() {
      let response = await this.post('/transfer-bank-slow/shop/count', this.dataFilter)
      if (response && response.status === 200) {
        this.dataMoneyNotReceived = response.data;
      }
    }
  },
  mixins: [baseMixins],
  created() {
    if (this.checkAllowRole(this.csRoles)) this.getDataMoneyNotReceived()
  },
  mounted() {},

  beforeDestroy() {
  },
};
</script>

<style lang="scss">
@import '../../assets/custom-menu-antd.scss';
.w-100 {
  width: 100%;
}
.w-20 {
  width: 20%;
}
.custom {
  flex-grow: 1;
  background: #ffffff;
  right: 0;
  left: auto;
}
.mr-20r {
  margin-right: 20rem;
}
.mr-5r {
  margin-right: 3rem;
}
.custom-header {
  width: 3rem !important;
}
</style>
