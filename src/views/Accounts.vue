<template>
  <b-form @submit="handleSearch">
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
      :loading="loadingHeader"
    ></page-title>
    <b-card class="main-card search-wrapper mb-20">
      <template v-if="loadingHeader">
        <a-skeleton active :paragraph="{ rows: 5 }"></a-skeleton>
      </template>
      <template v-else>
      <b-row class="mb-2">
        <b-col md="2">
          <div class="label-form">UserID</div>
          <b-input type="text" placeholder="Nhập UserID" v-model.trim="dataFilter.userId"/>
        </b-col>
        <b-col md="2">
          <div class="label-form">Tên đăng nhập</div>
          <b-input type="text" placeholder="Nhập tên đăng nhập" v-model.trim="dataFilter.username"/>
        </b-col>
        <b-col md="2">
          <div class="label-form">Tên người dùng</div>
          <b-input type="text" placeholder="Nhập tên người dùng" v-model.trim="dataFilter.fullName"/>
        </b-col>
        <b-col md="2">
          <div class="label-form">Số tài khoản</div>
          <b-input type="text" placeholder="Nhập số tài khoản" v-model.trim="dataFilter.accountNo"/>
        </b-col>
        <b-col md="2">
          <div class="label-form">Loại tài khoản</div>
          <multiselect
            v-model="accountType"
            track-by="text"
            label="text"
            :show-labels="false"
            placeholder="Chọn"
            :options="accountTypeOptions"
            :searchable="true"
          >
            <template slot="singleLabel" slot-scope="{ option }">
              {{ option.text }}
            </template>
          </multiselect>
        </b-col>
        <b-col md="2">
          <div class="label-form">Loại khách hàng</div>
          <multiselect v-model="selectUserType" track-by="text" label="text" :show-labels="false"
                       placeholder="Chọn" :options="optionsUserType" :searchable="true">
            <template slot="singleLabel" slot-scope="{ option }">{{ option.text }}</template>
          </multiselect>
        </b-col>
        <b-col md="2">
          <div class="label-form">Trạng thái</div>
          <multiselect v-model="selectedStatus" track-by="text" label="text" :show-labels="false"
                       placeholder="Chọn" :options="options" :searchable="true">
            <template slot="singleLabel" slot-scope="{ option }">{{ option.text }}</template>
          </multiselect>
        </b-col>
        <b-col md="2">
          <div class="label-form">Trạng thái KYC</div>
          <multiselect v-model="selectedStatusKyc" track-by="text" label="text" :show-labels="false"
                       placeholder="Chọn" :options="options" :searchable="true">
            <template slot="singleLabel" slot-scope="{ option }">{{ option.text }}</template>
          </multiselect>
        </b-col>
        <b-col md="2">
          <div class="label-form">Trạng thái liên kết NH</div>
          <multiselect v-model="selectedLinkedBankType" track-by="text" label="text" :show-labels="false"
                       placeholder="Chọn" :options="linkedBankOptions" :searchable="true">
            <template slot="singleLabel" slot-scope="{ option }">{{ option.text }}</template>
          </multiselect>
        </b-col>
        <b-col md="2">
          <div class="label-form">Ngày chốt số dư</div>
          <date-picker
            input-error
            class="w-100"
            input-class="form-control"
            v-model.trim="closeDate"
            format="DD/MM/YYYY"
            placeholder="Chọn"
          />
        </b-col>
        <b-col md="2">
          <div class="label-form">Thời gian cập nhật từ</div>
          <date-picker
            :disabled-date="(date) => date >= new Date()"
            input-error
            class="w-100"
            input-class="form-control"
            v-model.trim="updatedAtFrom"
            format="DD/MM/YYYY"
            placeholder="Chọn"
          />
        </b-col>
        <b-col md="2">
          <div class="label-form">Thời gian cập nhật đến</div>
          <date-picker
            :disabled-date="(date) => date >= new Date()"
            input-error
            class="w-100"
            input-class="form-control"
            v-model.trim="updatedAtTo"
            format="DD/MM/YYYY"
            placeholder="Chọn"
          />
        </b-col>
        <b-col md="2">
          <div class="label-form">Mã shop</div>
          <b-input type="text" placeholder="Nhập mã shop" v-model.trim="dataFilter.refShopId"/>
        </b-col>
        <b-col md="2">
          <div class="label-form">Mã Staff</div>
          <b-input type="text" placeholder="Nhập mã COD" v-model.trim="dataFilter.refUserId"/>
        </b-col>
        <b-col md="2">
          <div class="label-form">Mã Buyer</div>
          <b-input type="text" placeholder="Nhập mã buyer" v-model.trim="dataFilter.refBuyerId"/>
        </b-col>
        <b-col md="4" style="margin-top: 30px">
          <b-button variant="primary" class="mr-2" @click="handleSearch" type="submit">
            <font-awesome-icon :icon="['fas', 'search']" />
            Tìm kiếm
          </b-button>
          <b-button variant="primary" class="mr-2 custom-btn-add-common" @click="exportAccount" style="border: none">
            <font-awesome-icon :icon="['fas','file-excel']"/>
            Xuất dữ liệu
          </b-button>
          <b-button class="mr-2" variant="light" @click="handleReset">
            <font-awesome-icon :icon="['fas', 'eraser']" />
            Xóa lọc
          </b-button>
        </b-col>
        <b-col md="2" class="text-right mt-30">
          <b-button
              v-if="userInfo && userInfo.permissions.indexOf('account_create') !== -1"
              variant="primary"
              class="custom-btn-add-common"
              style="background: orange; border: none"
              @click="openModalCreateWalletCompartment"
          >
            <font-awesome-icon :icon="['fas','plus']"/>
            Thêm ngăn ví
          </b-button>
        </b-col>
      </b-row>

      <b-table
        class="mt-3"
        :items="accounts"
        :fields="visibleFields"
        :bordered="true"
        :hover="true"
        :fixed="true"
        :foot-clone="false"
      >
        <template #table-colgroup="scope">
          <col
            v-for="field in scope.visibleFields"
            :key="field.key"
          />
        </template>
        <template #cell(key)="row">
          {{ dataFilter.pageSize * (dataFilter.page - 1) + row.index + 1 }}
        </template>
        <template #cell(userType)="row">
          <b-badge v-if="row.item.userType === 1" class="badge-personal">Cá nhân</b-badge>
          <b-badge v-else-if="row.item.userType === 2" class="badge-enterprise">Doanh nghiệp</b-badge>
          <b-badge v-else class="badge-provider-service">NCC dịch vụ</b-badge>
        </template>
        <template #cell(kycStatus)="row">
          <b-badge v-for="(userEkyc, i) in row.item.userEkycList" v-if="userEkyc.appCode.toLowerCase() === convertTypeToStatus(row.item.type).toLowerCase() || (userEkyc.appCode === 'COD' && row.item.type === 4) || (userEkyc.appCode === 'COD' && row.item.type === 5)" :key="i" class="mr-2 badge"
                   :class="userEkyc.status === 1 ? 'badge-active' : 'badge-inactive'">
            {{userEkyc.appCode}}
          </b-badge>
        </template>
        <template #cell(refShopId)="row">
          <div v-if="row.item.type === 1">
            {{ row.item.refBuyerId ? `${row.item.refBuyerId}` : ''}}
          </div>
          <div v-if="row.item.type === 3">
            {{ row.item.refShopId }}
          </div>
          <div v-if="row.item.type === 4 || row.item.type === 5">
            {{ row.item.refUserId ? `${row.item.refUserId}` : ''}}
          </div>
        </template>
        <template #cell(userReferenceType)="row">
          <span v-if="row.item.userReferenceType === 'master'">
            Chính
          </span>
          <span v-if="row.item.userReferenceType === 'sub'">
            Chi nhánh
          </span>
        </template>
        <template #cell(linkedBank)="row">
          <b-badge v-if="row.item.linkedBank === 1" class="badge badge-active">Đã liên kết</b-badge>
          <b-badge v-else class="badge badge-inactive">Chưa liên kết</b-badge>
        </template>
        <template #cell(type)="row" style="text-align: center">
          <b-badge
            class="badge-personal"
            v-if="row.item.type === 1"
          >
            iGHTK
          </b-badge>
          <b-badge
            class="badge-enterprise min-width-58"
            v-else-if="row.item.type === 2"
          >
            GL
          </b-badge>
          <b-badge
              class="badge-init min-width-58"
              v-else-if="row.item.type === 3"
          >
            Shop
          </b-badge>
          <b-badge
              class="badge-provider-service min-width-58"
              v-else-if="row.item.type === 4"
          >
            Staff
          </b-badge>
          <b-badge
              class="badge-initialized min-width-58"
              v-else-if="row.item.type === 5"
          >
            Shipper
          </b-badge>
        </template>
        <template #cell(status)="row" style="text-align: center">
          <b-badge
            class="badge-active"
            v-if="row.item.status === 1"
          >
            Hoạt động
          </b-badge>
          <b-badge
            class="badge-inactive"
            v-else
          >
            Khóa
          </b-badge>
        </template>
        <template #cell(refundStatus)="row" style="text-align: center">
          <b-badge
            class="badge badge-active"
            v-if="row.item.refundStatus === 2"
          >
            Thành công
          </b-badge>
        </template>
        <template #cell(actions)="row" style="text-align: center">
          <div class="d-flex justify-content-center flex-wrap">
          <a
            v-if="userInfo && userInfo.permissions.indexOf('account_init_un_hold_balance') !== -1"
            href="javascript:void(0)"
            class="m-1"
            :class="row.item.holdBalance > 0 ? 'color-active' : 'disabled-icon'"
            type="button"
            title="Giải phóng số dư"
            v-b-tooltip.hover
            @click.prevent="row.item.holdBalance > 0 && openModalActionBalance(row.item, 'UN_HOLD')">
            <font-awesome-icon :icon="['fas', 'hand-holding']"/>
          </a>
          <a
            v-if="userInfo && userInfo.permissions.indexOf('account_hold_balance') !== -1"
            href="javascript:void(0)"
            class="m-1"
            :class="row.item.balance > 0 ? 'color-inactive' : 'disabled-icon'"
            type="button"
            title="Giữ số dư"
            v-b-tooltip.hover
            @click.prevent="row.item.balance > 0 && openModalActionBalance(row.item, 'HOLD')">
            <font-awesome-icon :icon="['fas', 'hand-holding-usd']"/>
          </a>
          <a
            v-if="userInfo
            && ((userInfo.permissions.indexOf('account_close') !== -1 && row.item.status === 1)
            || (userInfo.permissions.indexOf('account_active') !== -1 && row.item.status !== 1))"
            href="javascript:void(0)"
            class="m-1"
            :class="row.item.status === 1 ? 'color-inactive' : 'color-active'"
            type="button"
            :title="row.item.status === 1 ? 'Khóa Tài khoản' : 'Mở khóa Tài khoản'"
            v-b-tooltip.hover
            @click.prevent="openModalChangeStatus(row.item)">
            <font-awesome-icon v-if="row.item.status === 1" :icon="['fas', 'unlock']"/>
            <font-awesome-icon v-else :icon="['fas', 'lock']"/>
          </a>
          </div>
        </template>
      </b-table>
      <b-row v-if="accounts && accounts.length === 0 && this.dataFilter.page === 1" class="justify-content-center">
        <span>Không tìm thấy bản ghi nào</span>
      </b-row>
      <b-row v-else>
        <b-col class="pagination">
          <b-pagination
            hide-goto-end-buttons
            v-model="dataFilter.page"
            :per-page="dataFilter.pageSize"
            :total-rows="totalRow"
            @change="changePage"
          ></b-pagination>
          <multiselect v-model="selectedPageSize" track-by="text" label="text" :show-labels="false"
                       class="pageSize"
                       placeholder="Chọn"
                       @input="changePagination"
                       @select="changePageSize"
                       :options="PAGINATION_OPTIONS" :searchable="true" :allow-empty="false">
            <template slot="singleLabel" slot-scope="{ option }">{{ option.text }} / trang</template>
          </multiselect>
        </b-col>
      </b-row>
      </template>
    </b-card>

    <b-modal id="update-status-account" title="Cập nhật trạng thái" :no-close-on-backdrop="true">
      <p class="my-4">Bạn có chắc chắn muốn {{ this.currentItem && this.currentItem.status === 1 ? 'khóa' : 'mở khóa'}} tài khoản
        <span style="font-weight: 500">{{ this.currentItem && this.currentItem.accountNo }}</span> không ?</p>
      <template #modal-footer>
        <b-button
          class="mr-2 btn-light2 pull-right"
          @click="handleCancelChange"
        >
          Hủy
        </b-button>
        <b-button
          variant="primary pull-right"
          class="mr-2"
          @click.prevent="handleChangeStatus"
        >
          Đồng ý
        </b-button>
      </template>
    </b-modal>

    <b-modal
      hide-footer id="action-balance"
      :title="this.actionType && this.actionType === 'HOLD' ? 'Tạm giữ số dư' : 'Giải phóng số tiền tạm giữ'"
      :no-close-on-backdrop="true"
    >
      <b-form @submit="onSubmit">
        <b-row class="mb-2">
          <b-col md="4">
            Số tài khoản:
          </b-col>
          <b-col md="3" style="font-weight: 500" class="text-right">
            {{ this.currentItem.accountNo }}
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col md="4">
            {{ this.actionType && this.actionType === 'HOLD' ? 'Số dư' : 'Số tiền tạm giữ' }} (VNĐ):
          </b-col>
          <b-col md="3" style="font-weight: 500" class="text-right">
            {{ amountFormat }}
          </b-col>
        </b-row>
        <div>Nhập số tiền cần {{ this.actionType && this.actionType === 'HOLD' ? 'giữ' : 'giải phóng' }}: </div>
        <b-form-group
          id="input-group-1"
          label-for="input-1"
        >
          <b-input type="text"
                   @keypress="validateKeyCode"
                   @keyup="formatAmount"
                   class="text-right"
                   id="amount"
                   v-model="$v.amount.$model"
          ></b-input>
          <div class="error" v-if="$v.amount.$dirty && !$v.amount.required">Số tiền không được để trống.</div>
          <div class="error" v-if="$v.amount.$dirty && !validation">
            Số tiền cần lớn hơn 0 và không vượt quá {{ this.actionType && this.actionType === 'HOLD' ? 'số dư.' : 'số tiền tạm giữ.' }}
          </div>
        </b-form-group>
        <div>Lý do: </div>
        <b-form-group
          id="input-group-1"
          label-for="input-1"
        >
          <b-input
            id="reason"
            v-model="reason"
          ></b-input>
        </b-form-group>
        <b-button
          class="mr-2 btn-light2 pull-right"
          @click="handleCancelModalBalance"
        >
          Hủy
        </b-button>
        <b-button
          variant="primary pull-right"
          class="mr-2"
          type="submit"
        >
          Đồng ý
        </b-button>
      </b-form>
    </b-modal>

<!--    <ModalCreateWalletCompartment @reload-account-list="reload" popupType="CHECK_MOBILE" :mobileProp="null" />-->

    <b-toast id="export-toast" variant="success" solid :auto-hide-delay="30000">
      <template #toast-title>
        <div class="d-flex flex-grow-1 align-items-baseline">
          <b-img blank blank-color="#67C23A" class="mr-2" width="12" height="12"></b-img>
          <strong class="mr-auto">Thông báo</strong>
          <!-- <small class="text-muted mr-2">42 seconds ago</small> -->
        </div>
      </template>
      Chúng tôi đang tạo file báo cáo, điều này có thể mất vài phút, mã file:
      <div>
        <router-link
          :to="{ path: '/admin/file', query: { id: file_id }}"
          class="waves-effect waves-classic font-weight-400"
          style="margin-right: 10px"
          target="_blank"
        >
          <i class="icon md-plus" aria-hidden="true"></i>
          {{ file_id }}
        </router-link>
      </div>
    </b-toast>
  </b-form>
</template>

<script>
import PageTitle from "../Layout/Components/PageTitle";
import DatePicker from "vue2-datepicker"
import {
  EXPORT_REPORT,
  FETCH_ACCOUNTS,
  HOLD_BALANCE,
  UN_HOLD_BALANCE
} from "@/store/action.type"
import { mapGetters } from "vuex";
import { downloadExportExcel, formatDateTime, formatTime } from "@/common/utils";
import { formatPrice, formatPriceSearch } from "@/common/common";
import { PAGINATION_OPTIONS, SUCCESS } from "@/common/config"
import baseMixins from "../components/mixins/base";
import { required } from 'vuelidate/lib/validators'
// import ModalCreateWalletCompartment from "@/views/ModalCreateWalletCompartment";
import router from '@/router';
import moment from 'moment-timezone';
import { CREATE_FILE_ACCOUNT } from "@/store/action.type";

const initData = {
  id: null,
  username: null,
  fullName: null,
  status: null,
  userId: null,
  type: null,
  balanceFrom: null,
  balanceTo: null,
  updatedAtFrom: null,
  updatedAtTo: null,
  closeDate: null,
  userType: null,
  kycStatus: null,
  linkedBank: null,
  refShopId: null,
  refUserId: null,
  refBuyerId: null,
  page: 1,
  pageSize: 20
}
export default {
  name: "Accounts",
  components: {PageTitle, DatePicker },
  mixins: [baseMixins],
  data() {
    return {
      amount: null,
      reason: null,
      mobile: null,
      updatedAtFrom: new Date(),
      updatedAtTo: new Date(),
      closeDate: null,
      totalRow: 0,
      PAGINATION_OPTIONS,
      subheading: "Quản lý danh sách ngăn ví của người dùng.",
      icon: "pe-7s-portfolio icon-gradient bg-happy-itmeo",
      heading: "Danh sách ngăn ví",
      loadingHeader: true,
      dataFilter: Object.assign({}, initData),
      selectedStatus: {value: null, text: 'Tất cả'},
      balanceFrom: '',
      balanceTo: '',
      selectedPageSize: { text: initData.pageSize },
      selectedStatusKyc: {value: null, text: 'Tất cả'},
      selectUserType: {value: null, text: 'Tất cả'},
      selectedLinkedBankType: {value: 1, text: 'Đã liên kết'},
      optionsUserType: [
        {value: null, text: 'Tất cả'},
        {value: 1, text: 'Cá nhân'},
        {value: 2, text: 'Doanh nghiệp'},
        {value: 3, text: 'NCC dịch vụ'},
      ],
      linkedBankOptions: [
        {value: null, text: 'Tất cả'},
        {value: 0, text: 'Chưa liên kết'},
        {value: 1, text: 'Đã liên kết'},
      ],
      accountTypeOptions: [
        { value: null, text: 'Tất cả' },
        { value: 1, text: 'iGHTK' },
        { value: 2, text: 'GL' },
        { value: 3, text: 'Shop' },
        { value: 4, text: 'Staff' },
        { value: 5, text: 'Shipper' },
      ],
      fields: [
        { key: "key", label: "STT", tdClass: 'align-middle', thClass: 'align-middle', visible: true, thStyle: { width: '3%' } },
        { key: "userId", label: "UserID", visible: true, thStyle: { width: '7%' }, thClass: 'align-middle' },
        { key: "username", label: "Tên đăng nhập", visible: true, thStyle: { width: '7%' }, thClass: 'align-middle' },
        { key: "fullName", label: "Tên người dùng", visible: true, thStyle: { width: '7%' }, thClass: 'align-middle' },
        { key: "accountNo", label: "Số tài khoản", visible: true, thStyle: "width: 7%", thClass: 'align-middle' },
        { key: "balance",
          label: "Số dư (VNĐ)",
          formatter: (value) => {
            return value !== null ? formatPrice(value) : "";
          },
          visible: true,
          thStyle: "width: 8%",
          tdClass: "text-right",
          thClass: "text-right align-middle"
        },
        { key: "holdBalance",
          label: "Số tiền tạm giữ (VNĐ)",
          formatter: (value) => {
            return value !== null ? formatPrice(value) : "";
          },
          visible: true,
          thStyle: "width: 8%",
          thClass: "text-right align-middle",
          tdClass: "text-right"
        },
        { key: "closeBalance",
          label: "Số dư chốt (VNĐ)",
          formatter: (value) => {
            return value !== null ? formatPrice(value) : "";
          },
          visible: true,
          thStyle: "width: 8%",
          tdClass: "text-right",
          thClass: "text-right align-middle"
        },
        { key: "userReferenceType", label: "Loại ngăn ví", visible: true, thStyle: "width: 6%", thClass: 'align-middle text-center', tdClass: 'text-center' },
        { key: "type", label: "Loại TK", visible: true, thStyle: "width: 6%", thClass: 'align-middle text-center', tdClass: 'text-center' },
        { key: "userType", label: "Loại KH", visible: true, thStyle: "width: 7%", thClass: 'align-middle text-center', tdClass: 'text-center' },
        { key: "status", label: "Trạng thái", visible: true, thStyle: "width: 6%", thClass: 'align-middle text-center', tdClass: 'text-center' },
        { key: "kycStatus", label: "Trạng thái KYC", visible: true, thStyle: "width: 6%", thClass: 'align-middle' },
        { key: "linkedBank", label: "Liên kết NH", visible: true, thStyle: "width: 7%", tdClass: "text-center", thClass: "text-center align-middle" },
        { key: "refShopId", label: "Mã shop / Mã staff / Mã buyer", visible: true, thStyle: "width: 6%", thClass: 'align-middle' },
        {
          key: "updatedAt",
          label: "Thời gian cập nhật",
          formatter: (value) => {
            if (value) {
              let updatedTime = new Date(value);
              return formatDateTime(updatedTime);
            }
            return "";
          },
          visible: true,
          thStyle: "width: 6%",
          thClass: 'align-middle'
        },
        {
          key: "actions",
          label: "Chức năng",
          visible: true,
          thStyle: "width: 6%",
          thClass: 'align-middle'
        }
      ],
      options: [
        {value: null, text: 'Tất cả'},
        {value: 1, text: 'Hoạt động'},
        {value: 2, text: 'Khóa'},
      ],
      datePickerConfig: {
        placeholder1: "Chọn",
        inputClass: "form-control",
      },
      requestTimeFilter: null,
      accountType: {value: null, text: 'Tất cả'},
      money: {
        thousands: ".",
        precision: '',
        masked: false
      },
      currentItem: {},
      actionType: null,
      userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
      file_id: null
    }
  },
  validations: {
    amount: {
      required
    }
  },
  mounted() {
    this.handleDataFilter();
    const dataSearch = this.$route.query.dataSearch;

    if (dataSearch) {
      this.dataFilter = JSON.parse(String(dataSearch));

      this.selectedStatus = this.options.filter((i) => i.value === this.dataFilter.status)[0];
      this.selectedStatusKyc = this.options.filter((i) => i.value === this.dataFilter.kycStatus)[0];
      this.selectedLinkedBankType = this.options.filter((i) => i.value === this.dataFilter.balanceFrom)[0];
      this.accountType = this.accountTypeOptions.filter((i) => i.value === this.dataFilter.type)[0];
      this.balanceFrom = this.dataFilter.balanceFrom && this.dataFilter.balanceFrom !== '' ? formatPrice(this.dataFilter.balanceFrom) : '';
      this.balanceTo = this.dataFilter.balanceTo && this.dataFilter.balanceTo !== '' ? formatPrice(this.dataFilter.balanceTo) : '';
      this.updatedAtFrom = this.dataFilter.updatedAtFrom && new Date(this.dataFilter.updatedAtFrom);
      this.updatedAtTo = this.dataFilter.updatedAtTo && new Date(moment(this.dataFilter.updatedAtTo).subtract(1, 'day'));

      this.selectedPageSize = { text: this.dataFilter.pageSize }
    } else {
      this.dataFilter.linkedBank = this.selectedLinkedBankType === null ? '' : this.selectedLinkedBankType.value
    }

    this.fetchAccounts();
  },
  watch: {
  },
  computed: {
    ...mapGetters(["accounts"]),
    visibleFields() {
      return this.fields.filter((field) => field.visible);
    },
    validation() {
      if (!this.amount) return false

      if (this.actionType === 'HOLD') return Number(this.amount.replace(/,/g, '')) <= Number(this.currentItem.balance) && Number(this.amount.replace(/,/g, '')) > 0

      return Number(this.amount.replace(/,/g, '')) <= Number(this.currentItem.holdBalance) && Number(this.amount.replace(/,/g, '')) > 0
    },
    amountFormat() {
      return this.actionType && formatPrice(this.actionType === 'HOLD'
        ? this.currentItem.balance
        : this.currentItem.holdBalance)
    },
  },
  methods: {
    convertTypeToStatus(type) {
      const typeFiltered = this.accountTypeOptions.filter((i) => i.value === type);

      return typeFiltered.length > 0 ? typeFiltered[0].text : ''
    },
    reload() {
      this.fetchAccounts();
    },
    validateKeyCode: function (e) {
      if ((e.key < 48 || e.key > 57 || e.charCode === 13) && e.charCode !== 45 && e.charCode !== 32) {
        return true
      }

      e.preventDefault()
    },
    formatAmount() {
      this.$v.amount.$model = formatPriceSearch(this.$v.amount.$model)
    },
    changePagination(e) {
      this.dataFilter.pageSize = e.text;
    },
    changePage(e) {
      this.dataFilter.page = e
      router.push({ path: '/admin/accounts', query: { dataSearch: JSON.stringify(this.dataFilter) }})
      this.fetchAccounts();
    },
    changePageSize(e) {
      if (e) {
        this.dataFilter.pageSize = e.text
        this.dataFilter.page = 1
      }
      router.push({ path: '/admin/accounts', query: { dataSearch: JSON.stringify(this.dataFilter) }})
      this.fetchAccounts();
    },
    handleExport() {
      this.$store.dispatch(EXPORT_REPORT, {
        params: this.dataFilter
      })
        .then((response) => {
          if (response.length === 0) {
            this.reportData = null
            return
          }
          downloadExportExcel(response, 'Bao_cao_lich_rut_tien_qua_api')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleSearch(event) {
      event.preventDefault();
      this.handleDataFilter();
      router.push({ path: '/admin/accounts', query: { dataSearch: JSON.stringify(this.dataFilter) }})
      this.fetchAccounts();
    },
    handleDataFilter() {
      this.dataFilter.updatedAtFrom = this.updatedAtFrom && formatTime(this.updatedAtFrom, 'START')
      this.dataFilter.closeDate = this.closeDate && formatTime(this.closeDate, 'START')
      this.dataFilter.updatedAtTo = this.updatedAtTo && formatTime(this.updatedAtTo, 'END')
      this.dataFilter.type = this.accountType ? this.accountType.value : null;
      this.dataFilter.status = this.selectedStatus ? this.selectedStatus.value : null;
      this.dataFilter.kycStatus = this.selectedStatusKyc === null ? null : this.selectedStatusKyc.value;
      this.dataFilter.userType = this.selectUserType === null ? '' : this.selectUserType.value;
      this.dataFilter.linkedBank = this.selectedLinkedBankType === null ? '' : this.selectedLinkedBankType.value;
      this.dataFilter.accountNo = this.dataFilter.accountNo !== '' ? this.dataFilter.accountNo : null;
      this.dataFilter.balanceFrom = this.balanceFrom !== '' ? this.balanceFrom.replace(/,/g, '') : null;
      this.dataFilter.balanceTo = this.balanceTo !== '' ? this.balanceTo.replace(/,/g, '') : null;
      this.dataFilter.page = 1;
      this.dataFilter.pageSize = this.selectedPageSize.text
    },
    async fetchAccounts() {
      let res = await this.$store.dispatch(FETCH_ACCOUNTS, this.dataFilter)
      if (res && res.length > 0 && res.length === this.dataFilter.pageSize) {
        this.totalRow = 1000000000;
      } else {
        this.totalRow = this.dataFilter.page * this.dataFilter.pageSize
      }
      setTimeout(() => {
        if (this.loadingHeader) this.loadingHeader = !this.loadingHeader
      }, 200);
    },
    handleReset() {
      this.$router.replace('/admin/accounts')
      this.dataFilter = Object.assign({}, {
        ...initData,
        pageSize: this.dataFilter.pageSize
      });
      this.updatedAtFrom = new Date();
      this.updatedAtTo = new Date();
      this.closeDate = null;
      this.selectedStatus = {value: null, text: 'Tất cả'};
      this.accountType = {value: null, text: 'Tất cả'};
      this.selectedStatusKyc = {value: null, text: 'Tất cả'};
      this.selectUserType = {value: null, text: 'Tất cả'};
      this.selectedLinkedBankType = {value: 1, text: 'Đã liên kết'};
      this.dataFilter.linkedBank = 1;
      this.balanceFrom = '';
      this.balanceTo = '';
      this.handleDataFilter();
      this.fetchAccounts();
    },
    openModalChangeStatus(item) {
      this.currentItem = item;
      this.$root.$emit("bv::show::modal", 'update-status-account');
    },
    handleCancelChange() {
      this.$root.$emit("bv::hide::modal", "update-status-account");
    },
    openModalCreateWalletCompartment() {
      // this.$root.$emit("bv::show::modal", 'create-wallet-compartment');
    },
    handleCancelCreate() {
      this.$root.$emit("bv::hide::modal", "create-wallet-compartment");
      this.mobile = null;
      this.$v.$reset();
    },
    openModalActionBalance(item, type) {
      this.currentItem = item;
      this.actionType = type;
      this.$root.$emit("bv::show::modal", 'action-balance');
    },
    handleCancelModalBalance() {
      this.$root.$emit("bv::hide::modal", "action-balance");
      this.amount = null;
      this.reason = null;
      this.$v.$reset();
    },
    async handleChangeStatus() {
      let response = await this.post(`/account/${this.currentItem.id}/${this.currentItem.status === 1 ? 'close' : 'active'}`)

      this.$message.closeAll()

      if (response && response.status === SUCCESS) {
        this.$message({
          message: "Thực hiện thao tác thành công.",
          type: "success",
          showClose: true,
        });
        this.$nextTick(() => {
          this.$bvModal.hide('update-status-account');
        });
        await this.fetchAccounts();
      } else {
        this.$message({
          message: "Thực hiện thao tác thất bại.",
          type: "error",
          showClose: true,
        });
      }
    },
    onSubmit(event) {
      event.preventDefault();
      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }

      if (!this.validation) return;

      if (this.actionType === 'HOLD') {
        this.$store.dispatch(HOLD_BALANCE, {
          accountNo: this.currentItem.accountNo,
          amount: this.amount.replace(/,/g, ''),
          reason: this.reason
        }).then(() => {
          this.$message.closeAll();
          this.handleCancelModalBalance();
          this.fetchAccounts();

          this.$message({
            message: "Thực hiện thao tác thành công.",
            type: "success",
            showClose: true,
          });
        })
        return;
      }

      this.$store.dispatch(UN_HOLD_BALANCE, {
        accountNo: this.currentItem.accountNo,
        amount: this.amount.replace(/,/g, ''),
      }).then(() => {
        this.$message.closeAll()
        this.handleCancelModalBalance();
        this.fetchAccounts();

        this.$message({
          message: "Thực hiện thao tác thành công.",
          type: "success",
          showClose: true,
        });
      })
    },
    async exportAccount() {
      this.dataFilter.updatedAtFrom = this.updatedAtFrom && formatTime(this.updatedAtFrom, 'START')
      this.dataFilter.updatedAtTo = this.updatedAtTo && formatTime(this.updatedAtTo, 'END')
      this.$store.dispatch(CREATE_FILE_ACCOUNT, this.dataFilter).then((res) => {
        if (res.status == 200) {
          this.file_id = res.data.fileId
          this.$bvToast.show('export-toast')
        } else {
          this.$notify.error({
            title: 'Thất bại',
            message:"Có lỗi xảy ra",
          });
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled-icon {
  cursor: not-allowed;
  color: #838790 !important;
  opacity: 0.5;
}
.error {
  color: #dc3545;
  font-size: 13px;
}
</style>
