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
            <div class="label-form">ID</div>
            <b-input type="text" placeholder="Nhập ID" v-model.trim="dataFilter.id"/>
          </b-col>
          <b-col md="2">
            <div class="label-form">Họ và tên</div>
            <b-input type="text" placeholder="Nhập họ và tên" v-model.trim="dataFilter.fullName"/>
          </b-col>
          <b-col md="2">
            <div class="label-form">Học hàm học vị</div>
            <multiselect v-model="selectedRankAndDegree" track-by="text" label="text" :show-labels="false"
                         placeholder="Chọn" :options="optionsRankAndDegree" :searchable="true">
              <template slot="singleLabel" slot-scope="{ option }">{{ option.text }}</template>
            </multiselect>
          </b-col>
          <b-col md="2">
            <div class="label-form">Thời gian bắt đầu từ</div>
            <date-picker
                :disabled-date="(date) => date >= new Date()"
                input-error
                class="w-100"
                input-class="form-control"
                v-model.trim="startTimeFrom"
                format="DD/MM/YYYY"
                placeholder="Chọn"
            />
          </b-col>
          <b-col md="2">
            <div class="label-form">Thời gian bắt đầu đến</div>
            <date-picker
                :disabled-date="(date) => date >= new Date()"
                input-error
                class="w-100"
                input-class="form-control"
                v-model.trim="startTimeTo"
                format="DD/MM/YYYY"
                placeholder="Chọn"
            />
          </b-col>
          <b-col md="4" style="margin-top: 30px">
            <b-button variant="primary" class="mr-2" @click="handleSearch" type="submit">
              <font-awesome-icon :icon="['fas', 'search']" />
              Tìm kiếm
            </b-button>
            <b-button variant="primary" class="mr-2 custom-btn-add-common" @click="uploadFileTeachers" style="border: none">
              <font-awesome-icon :icon="['fas','file-excel']"/>
              Upload file
            </b-button>
            <b-button class="mr-2" variant="light" @click="handleReset">
              <font-awesome-icon :icon="['fas', 'eraser']" />
              Xóa lọc
            </b-button>
          </b-col>
          <b-col md="8" class="text-right mt-30">
            <b-button
                v-if="checkPermission('teacher_create')"
                variant="primary"
                class="custom-btn-add-common"
                style="background: orange; border: none"
                @click="openModalCreateTeacherCompartment"
            >
              <font-awesome-icon :icon="['fas','plus']"/>
              Thêm giảng viên
            </b-button>
          </b-col>
        </b-row>

        <b-table
            class="mt-3"
            :items="teachers.data"
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
<!--          <template #cell(userReferenceType)="row">-->
<!--          <span v-if="row.item.userReferenceType === 'master'">-->
<!--            Chính-->
<!--          </span>-->
<!--            <span v-if="row.item.userReferenceType === 'sub'">-->
<!--            Chi nhánh-->
<!--          </span>-->
<!--          </template>-->
<!--          <template #cell(actions)="row" style="text-align: center">-->
<!--            <div class="d-flex justify-content-center flex-wrap">-->
<!--              <a-->
<!--                  v-if="userInfo && userInfo.permissions.indexOf('account_init_un_hold_balance') !== -1"-->
<!--                  href="javascript:void(0)"-->
<!--                  class="m-1"-->
<!--                  :class="row.item.holdBalance > 0 ? 'color-active' : 'disabled-icon'"-->
<!--                  type="button"-->
<!--                  title="Giải phóng số dư"-->
<!--                  v-b-tooltip.hover-->
<!--                  @click.prevent="row.item.holdBalance > 0 && openModalActionBalance(row.item, 'UN_HOLD')">-->
<!--                <font-awesome-icon :icon="['fas', 'hand-holding']"/>-->
<!--              </a>-->
<!--            </div>-->
<!--          </template>-->
        </b-table>
        <b-row v-if="teachers.data && teachers.data.length === 0 && this.dataFilter.page === 1" class="justify-content-center">
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

    <b-modal
        id="create-teacher-compartment"
        :modal-class="['ghtk-modal']"
        :header-class="['modal__header']"
        :no-close-on-backdrop="true"
        size="lg"
        @hidden="closeModalCreateTeacherCompartment"
    >
      <template slot="modal-header">
        <div class="modal__header--item title font-weight-500">
          Thêm giảng viên
        </div>
        <div class="modal__header--item close-btn px-2" @click="closeModalCreateTeacherCompartment">
          <i class="fas fa-times"></i>
        </div>
      </template>
      <div class="mb-3">
        <b>Thêm mới giảng viên</b>
      </div>
      <b-row>
        <b-col md="3">
          <label>Họ và tên<span class="text-danger">*</span>:</label>
        </b-col>
        <b-col md="9">
          <b-form-group>
            <b-form-input
                id="input-full-name"
                v-model="$v.currentData.fullName.$model"
                placeholder="Nhập họ và tên"
                trim
                :class="{ 'is-invalid': validationStatus($v.currentData.fullName) }"
            />
            <div v-if="!$v.currentData.fullName.required" class="invalid-feedback">
              Họ và tên không được để trống.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3">
          <label>Học hàm học vị<span class="text-danger">*</span>:</label>
        </b-col>
        <b-col md="9">
          <b-form-group :class="{'invalid-option': validationStatus($v.currentData.rankAndDegree)}">
            <multiselect
                v-model="$v.currentData.rankAndDegree.$model"
                track-by="text" label="text" :show-labels="false"
                placeholder="Chọn" :options="optionsRankAndDegree.filter(rank => rank.value)" :searchable="true"
                :class="{'is-invalid-option': validationStatus($v.currentData.rankAndDegree)}"
            >
              <template slot="singleLabel" slot-scope="{ option }">{{ option.text }}</template>
            </multiselect>
            <div v-if="!$v.currentData.rankAndDegree.required" class="invalid-feedback">
              Học hàm học vị không được để trống.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3">
          <label>Thời gian bắt đầu<span class="text-danger">*</span>:</label>
        </b-col>
        <b-col md="9">
          <b-form-group>
            <div :class="{'invalid-date': validationStatus($v.currentData.startTime)}">
              <date-picker
                  class="w-100"
                  :input-class="['form-control',{'is-invalid': validationStatus($v.currentData.startTime)}]"
                  v-model.trim="$v.currentData.startTime.$model"
                  type="datetime"
                  format="DD/MM/YYYY HH:mm:ss"
                  placeholder="Chọn ngày"
                  :showSecond="true"
                  :disabled-date="(date) => date >= new Date()"
              >
              </date-picker>
              <div v-if="!$v.currentData.startTime.required" class="invalid-date-feedback">
                Thời gian bắt đầu không được để trống.
              </div>
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="3">
          <label>Ngày sinh<span class="text-danger">*</span>:</label>
        </b-col>
        <b-col md="9">
          <b-form-group>
            <div :class="{'invalid-date': validationStatus($v.currentData.birthday)}">
              <date-picker
                  class="w-100"
                  :input-class="['form-control',{'is-invalid': validationStatus($v.currentData.birthday)}]"
                  v-model.trim="$v.currentData.birthday.$model"
                  type="datetime"
                  format="DD/MM/YYYY HH:mm:ss"
                  placeholder="Chọn ngày"
                  :showSecond="true"
                  :disabled-date="(date) => date >= new Date()"
              >
              </date-picker>
              <div v-if="!$v.currentData.birthday.required" class="invalid-date-feedback">
                Ngày sinh không được để trống.
              </div>
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <template #modal-footer>
        <div class="w-100">
          <b-row>
            <b-col cols="3">
              <b-button class="py-2 btn-light2 custom-full-btn" @click="handleResetCreateTeacherCompartment">
                Xoá
              </b-button>
            </b-col>
            <b-col cols="9">
              <b-button variant="primary" v-if="checkPermission('teacher_create')" class="py-2 custom-full-btn" @click.prevent="handleResetCreateTeacherCompartment">
                Đồng ý
              </b-button>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-modal>

<!--    <b-modal id="update-status-account" title="Cập nhật trạng thái" :no-close-on-backdrop="true">-->
<!--      <p class="my-4">Bạn có chắc chắn muốn {{ this.currentItem && this.currentItem.status === 1 ? 'khóa' : 'mở khóa'}} tài khoản-->
<!--        <span style="font-weight: 500">{{ this.currentItem && this.currentItem.accountNo }}</span> không ?</p>-->
<!--      <template #modal-footer>-->
<!--        <b-button-->
<!--            class="mr-2 btn-light2 pull-right"-->
<!--            @click="handleCancelChange"-->
<!--        >-->
<!--          Hủy-->
<!--        </b-button>-->
<!--        <b-button-->
<!--            variant="primary pull-right"-->
<!--            class="mr-2"-->
<!--            @click.prevent="handleChangeStatus"-->
<!--        >-->
<!--          Đồng ý-->
<!--        </b-button>-->
<!--      </template>-->
<!--    </b-modal>-->

<!--    <b-toast id="export-toast" variant="success" solid :auto-hide-delay="30000">-->
<!--      <template #toast-title>-->
<!--        <div class="d-flex flex-grow-1 align-items-baseline">-->
<!--          <b-img blank blank-color="#67C23A" class="mr-2" width="12" height="12"></b-img>-->
<!--          <strong class="mr-auto">Thông báo</strong>-->
<!--          &lt;!&ndash; <small class="text-muted mr-2">42 seconds ago</small> &ndash;&gt;-->
<!--        </div>-->
<!--      </template>-->
<!--      Chúng tôi đang tạo file báo cáo, điều này có thể mất vài phút, mã file:-->
<!--      <div>-->
<!--        <router-link-->
<!--            :to="{ path: '/admin/file', query: { id: file_id }}"-->
<!--            class="waves-effect waves-classic font-weight-400"-->
<!--            style="margin-right: 10px"-->
<!--            target="_blank"-->
<!--        >-->
<!--          <i class="icon md-plus" aria-hidden="true"></i>-->
<!--          {{ file_id }}-->
<!--        </router-link>-->
<!--      </div>-->
<!--    </b-toast>-->
  </b-form>
</template>
<script>
import PageTitle from "../Layout/Components/PageTitle";
import DatePicker from "vue2-datepicker"
import {
  FETCH_TEACHERS,
} from "@/store/action.type"
import { mapGetters } from "vuex";
import {checkPermission, formatDate2, formatTime} from "@/common/utils";
import { PAGINATION_OPTIONS } from "@/common/config"
import baseMixins from "../components/mixins/base";
import router from '@/router';
import moment from 'moment-timezone';
import {required} from "vuelidate/lib/validators";

const initData = {
  id: null,
  fullName: null,
  rankAndDegree: null,
  startTimeFrom: null,
  startTimeTo: null,
  page: 1,
  pageSize: 20
}

const initTeacher = {
  fullName: null,
  rankAndDegree: null,
  startTime: null,
  birthday: null,
}

export default {
  name: "Teachers",
  components: {PageTitle, DatePicker},
  mixins: [baseMixins],
  data() {
    return {
      updatedAtFrom: new Date(),
      updatedAtTo: new Date(),
      totalRow: 0,
      PAGINATION_OPTIONS,
      subheading: "Quản lý danh sách giảng viên.",
      icon: "pe-7s-portfolio icon-gradient bg-happy-itmeo",
      heading: "Danh sách giảng viên",
      loadingHeader: true,
      dataFilter: Object.assign({}, initData),
      selectedPageSize: { text: initData.pageSize },
      selectedRankAndDegree: {value: null, text: 'Tất cả'},
      optionsRankAndDegree: [
        {value: null, text: 'Tất cả'},
        {value: 'GV', text: 'Giảng viên'},
        {value: 'TS', text: 'Tiến sĩ'},
        {value: 'ThS', text: 'Thạc sĩ'},
        {value: 'GS', text: 'Giáo sư'},
        {value: 'PGS', text: 'Phó giáo sư'},
      ],
      fields: [
        { key: "key", label: "STT", tdClass: 'align-middle', thClass: 'align-middle', visible: true, thStyle: { width: '3%' } },
        { key: "id", label: "ID", tdClass: 'align-middle', thClass: 'align-middle', visible: true, thStyle: { width: '3%' } },
        { key: "fullName", label: "Họ và tên", visible: true, thStyle: { width: '7%' }, thClass: 'align-middle' },
        { key: "rankAndDegree", label: "Học hàm học vị", visible: true, thStyle: "width: 7%", thClass: 'align-middle' },
        {
          key: "startTime",
          label: "Thời gian bắt đầu",
          formatter: (value) => {
            if (value) {
              let startTime = new Date(value);
              return formatDate2(startTime);
            }
            return "";
          },
          visible: true,
          thStyle: "width: 6%",
          thClass: 'align-middle'
        },
        {
          key: "birthday",
          label: "Ngày sinh",
          formatter: (value) => {
            if (value) {
              let birthday = new Date(value);
              return moment(birthday).format("DD/MM/YYYY");
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
      datePickerConfig: {
        placeholder1: "Chọn",
        inputClass: "form-control",
      },
      requestTimeFilter: null,
      currentItem: {},
      actionType: null,
      userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
      currentData: Object.assign({}, {...initTeacher}),
    }
  },
  validations: {
    currentData: {
      fullName: { required },
      rankAndDegree: { required },
      startTime: { required },
      birthday: { required },
    },
  },
  mounted() {
    this.handleDataFilter();
    const dataSearch = this.$route.query.dataSearch;

    if (dataSearch) {
      this.dataFilter = JSON.parse(String(dataSearch));

      this.selectedRankAndDegree = this.optionsRankAndDegree.filter((i) => i.value === this.dataFilter.rankAndDegree)[0];
      this.startTimeFrom = this.dataFilter.startTimeFrom && new Date(this.dataFilter.startTimeFrom);
      this.startTimeTo = this.dataFilter.startTimeTo && new Date(moment(this.dataFilter.startTimeTo).subtract(1, 'day'));

      this.selectedPageSize = {text: this.dataFilter.pageSize}
    }

    this.fetchTeachers();
  },
  watch: {
  },
  computed: {
    ...mapGetters(["teachers"]),
    visibleFields() {
      return this.fields.filter((field) => field.visible);
    },
    validation() {
    },
  },
  methods: {
    handleDataFilter() {
      this.dataFilter.startTimeFrom = this.startTimeFrom && formatTime(this.startTimeFrom, 'START');
      this.dataFilter.startTimeTo = this.startTimeTo && formatTime(this.startTimeTo, 'END');
      this.dataFilter.id = this.id ? this.id.value : null;
      this.dataFilter.fullName = this.fullName ? this.fullName.value : null;
      this.dataFilter.rankAndDegree = this.selectedRankAndDegree === null ? null : this.selectedRankAndDegree.value;
      this.dataFilter.page = 1;
      this.dataFilter.pageSize = this.selectedPageSize.text
    },
    reload() {
      this.fetchTeachers();
    },
    checkPermission,
    async fetchTeachers() {
      let res = await this.$store.dispatch(FETCH_TEACHERS, this.dataFilter)
      if (res && res.length > 0 && res.length === this.dataFilter.pageSize) {
        this.totalRow = 1000000000;
      } else {
        this.totalRow = this.dataFilter.page * this.dataFilter.pageSize
      }
      setTimeout(() => {
        if (this.loadingHeader) this.loadingHeader = !this.loadingHeader
      }, 200);
    },
    changePagination(e) {
      this.dataFilter.pageSize = e.text;
    },
    changePage(e) {
      this.dataFilter.page = e
      router.push({ path: '/admin/teachers', query: { dataSearch: JSON.stringify(this.dataFilter) }})
      this.fetchTeachers();
    },
    changePageSize(e) {
      if (e) {
        this.dataFilter.pageSize = e.text
        this.dataFilter.page = 1
      }
      router.push({ path: '/admin/teachers', query: { dataSearch: JSON.stringify(this.dataFilter) }})
      this.fetchTeachers();
    },
    handleSearch(event) {
      event.preventDefault();
      this.handleDataFilter();
      router.push({ path: '/admin/teachers', query: { dataSearch: JSON.stringify(this.dataFilter) }})
      this.fetchTeachers();
    },
    handleReset() {
      this.$router.replace('/admin/teachers')
      this.dataFilter = Object.assign({}, {
        ...initData,
        pageSize: this.dataFilter.pageSize
      });
      this.startTimeFrom = new Date();
      this.startTimeTo = new Date();
      this.fullName = '';
      this.selectedRankAndDegree = {value: null, text: 'Tất cả'};
      this.id = '';
      this.handleDataFilter();
      this.fetchTeachers();
    },
    uploadFileTeachers() {
      this.$router.replace('/admin/teachers')
      this.dataFilter = Object.assign({}, {
        ...initData,
        pageSize: this.dataFilter.pageSize
      });
      this.startTimeFrom = new Date();
      this.startTimeTo = new Date();
      this.fullName = '';
      this.selectedRankAndDegree = {value: null, text: 'Tất cả'};
      this.id = '';
      this.handleDataFilter();
      this.fetchTeachers();
    },
    openModalCreateTeacherCompartment() {
      this.$root.$emit("bv::show::modal", 'create-teacher-compartment');
      this.currentData = Object.assign({}, {...initTeacher})
    },
    closeModalCreateTeacherCompartment() {
      this.handleResetCreateTeacherCompartment()
      this.$root.$emit("bv::hide::modal", 'create-teacher-compartment')
    },
    handleResetCreateTeacherCompartment() {
      this.$v.$reset()
      this.currentData = Object.assign({}, {...initTeacher})
    },
    validationStatus: function (validation) {
      return typeof validation != "undefined" ? validation.$error : false;
    },
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