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
</script>