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
            <div class="label-form">Nhóm chuyên môn</div>
            <multiselect v-model="selectedGroupTeacher" track-by="text" label="text" :show-labels="false"
                         placeholder="Chọn" :options="optionsGroupTeacher" :searchable="true">
              <template slot="singleLabel" slot-scope="{ option }">{{ option.text }}</template>
            </multiselect>
          </b-col>
          <b-col md="2">
            <div class="label-form">Trạng thái</div>
            <multiselect v-model="selectedStatus" track-by="text" label="text" :show-labels="false"
                         placeholder="Chọn" :options="optionsStatus" :searchable="true">
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
        </b-row>
        <b-row class="mb-2">
          <b-col md="4" style="margin-top: 30px">
            <b-button variant="primary" class="mr-2" @click="handleSearch" type="submit">
              <font-awesome-icon :icon="['fas', 'search']"/>
              Tìm kiếm
            </b-button>
            <b-button variant="primary" class="mr-2 custom-btn-add-common" @click="openModalUploadTeacher"
                      style="border: none">
              <font-awesome-icon :icon="['fas','file-excel']"/>
              <span v-if="!loadingFile"
              ><i class="fas fa-upload"></i> Upload file
              </span>
              <i v-if="loadingFile" class="fa fa-spinner fa-spin"/>
            </b-button>
            <b-button class="mr-2" variant="light" @click="handleReset">
              <font-awesome-icon :icon="['fas', 'eraser']"/>
              Xóa lọc
            </b-button>
          </b-col>
          <b-col md="8" class="text-right mt-30">
            <b-button
                v-if="checkPermission('teacher_create')"
                variant="primary"
                class="custom-btn-add-common"
                style="background: orange; border: none"
                @click="openModalCreateTeacherCompartment(null, false)"
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
          <template #cell(rankAndDegree)="row">
          <span v-if="row.item.rankAndDegree === 'GV'">
            Giảng viên
          </span>
            <span v-if="row.item.rankAndDegree === 'ThS'">
            Thạc sĩ
          </span>
            <span v-if="row.item.rankAndDegree === 'TS'">
            Tiến sĩ
          </span>
            <span v-if="row.item.rankAndDegree === 'GS'">
            Giáo sư
          </span>
            <span v-if="row.item.rankAndDegree === 'PGS'">
            Phó Giáo sư
          </span>
          </template>
          <template #cell(status)="row">
          <span v-if="row.item.status === 0">
            Không hoạt động
          </span>
            <span v-if="row.item.status === 'ThS'">
            Hoạt động
          </span>
          </template>
          <template #cell(groupTeacher)="row">
            {{ concatGroupTeacher(row.item.groupTeacher) }}
          </template>
          <template #cell(rating)="row">
            {{ row.item.rating ? row.item.rating + "/5" : "" }}
          </template>
          <template #cell(actions)="row" style="text-align: center">
            <div class="d-flex justify-content-center flex-wrap">
              <a
                  v-if="userInfo && userInfo.permissions.indexOf('teacher_update') !== -1"
                  href="javascript:void(0)"
                  class="m-1"
                  type="button"
                  title="Cập nhật thông tin giảng viên"
                  v-b-tooltip.hover
                  @click.prevent="openModalCreateTeacherCompartment(row.item, true)">
                <font-awesome-icon :icon="['fas', 'edit']"/>
              </a>
            </div>
          </template>
        </b-table>
        <b-row v-if="teachers.data && teachers.data.length === 0 && this.dataFilter.page === 1"
               class="justify-content-center">
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
        id="update-teacher"
        :title="isUpdate ? 'Cập nhật thông tin giảng viên' : 'Thêm mới giảng viên'"
        :no-close-on-backdrop="true"
        size="lg"
        @hidden="closeModalCreateTeacherCompartment"
    >
      <b-row>
        <b-col md="12">
          <b-form-group>
            <label>Họ và tên<span class="text-danger">*</span>:</label>
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
        <b-col md="12">
          <b-form-group :class="{'invalid-option': validationStatus($v.currentData.rankAndDegree)}">
            <label>Học hàm học vị<span class="text-danger">*</span>:</label>
            <b-form-select
                :options="optionsRankAndDegree.filter(rank => rank.value != null)"
                :searchable="true"
                value-field="value" text-field="text"
                :class="{'is-invalid-option': validationStatus($v.currentData.rankAndDegree)}"
                v-model.trim="currentData.rankAndDegree"
            >
            </b-form-select>
            <div v-if="!$v.currentData.rankAndDegree.required" class="invalid-feedback">
              Học hàm học vị không được để trống.
            </div>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-form-group>
            <label>Số giờ GD<span class="text-danger">*</span>:</label>
            <b-form-input
                id="input-gd-time"
                v-model="$v.currentData.gdTime.$model"
                placeholder="Nhập số giờ GD"
                trim
                :class="{ 'is-invalid': validationStatus($v.currentData.gdTime) }"
            />
            <div v-if="!$v.currentData.gdTime.required" class="invalid-feedback">
              Số giờ GD không được để trống.
            </div>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-form-group>
            <label>Số giờ HD<span class="text-danger">*</span>:</label>
            <b-form-input
                id="input-hd-time"
                v-model="$v.currentData.hdTime.$model"
                placeholder="Nhập số giờ HD"
                trim
                :class="{ 'is-invalid': validationStatus($v.currentData.hdTime) }"
            />
            <div v-if="!$v.currentData.hdTime.required" class="invalid-feedback">
              Số giờ HD không được để trống.
            </div>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-form-group>
            <label>Rating<span class="text-danger">*</span>:</label>
            <b-form-input
                id="input-gd-time"
                v-model="$v.currentData.rating.$model"
                placeholder="Nhập rating"
                trim
                :class="{ 'is-invalid': validationStatus($v.currentData.rating) }"
            />
            <div v-if="!$v.currentData.gdTime.required" class="invalid-feedback">
              Rating không được để trống.
            </div>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-form-group>
            <label>Thời gian bắt đầu<span class="text-danger">*</span>:</label>
            <div :class="{'invalid-date': validationStatus($v.currentData.startTime)}">
              <date-picker
                  class="w-100"
                  :input-class="['form-control',{'is-invalid': validationStatus($v.currentData.startTime)}]"
                  v-model.trim="$v.currentData.startTime.$model"
                  type="date"
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày"
                  :disabled-date="(date) => date >= new Date()"
              >
              </date-picker>
              <div v-if="!$v.currentData.startTime.required" class="invalid-date-feedback">
                Thời gian bắt đầu không được để trống.
              </div>
            </div>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-form-group>
            <label>Ngày sinh<span class="text-danger">*</span>:</label>
            <div :class="{'invalid-date': validationStatus($v.currentData.birthday)}">
              <date-picker
                  class="w-100"
                  :input-class="['form-control',{'is-invalid': validationStatus($v.currentData.birthday)}]"
                  v-model.trim="$v.currentData.birthday.$model"
                  type="date"
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày"
                  :disabled-date="(date) => date >= new Date()"
              >
              </date-picker>
              <div v-if="!$v.currentData.birthday.required" class="invalid-date-feedback">
                Ngày sinh không được để trống.
              </div>
            </div>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-form-group :class="{'invalid-option': validationStatus($v.currentData.status)}">
            <label>Trạng thái<span class="text-danger">*</span>:</label>
            <b-form-select
                :options="optionsStatus.filter(rank => rank.value != null)"
                :searchable="true"
                value-field="value" text-field="text"
                :class="{'is-invalid-option': validationStatus($v.currentData.status)}"
                v-model.trim="currentData.status"
            >
            </b-form-select>
            <div v-if="!$v.currentData.status.required" class="invalid-feedback">
              Trạng thái không được để trống.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <template #modal-footer>
        <b-button
            class="mr-2 btn-light2 pull-right"
            @click="closeModalCreateTeacherCompartment"
        >
          Hủy
        </b-button>
        <b-button
            variant="primary pull-right"
            @click.prevent="handleCreateTeacher"
        >
          Đồng ý
        </b-button>
      </template>
    </b-modal>

    <b-modal
        id="modal-upload-teacher"
        :modal-class="['sc5-modal']"
        :header-class="['modal__header']"
        :no-close-on-backdrop="true"
        size="lg"
        @hidden="closeModalUpload"
    >
      <template slot="modal-header">
        <div class="modal__header--item title font-weight-500">
          Upload file ds giảng viên
        </div>
        <div class="modal__header--item close-btn px-2" @click="closeModalUpload">
          <i class="fas fa-times"></i>
        </div>
      </template>
      <b-row>
        <b-col md="2">
          <div style="font-weight: bold">File mẫu</div>
        </b-col>
        <b-col md="6">
          <a
              :href="SAMPLE_TEACHER_IMPORT_LINK"
              target="_self"
              style="font-weight: bold;color:black!important;"
          >Format_ThemGV</a
          >
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col md="2">
          <div style="font-weight: bold">File đã upload</div>
        </b-col>
        <b-col md="6">
          <div style="font-weight: bold; color:black!important;" v-if="currentFile">
            {{ currentFile.name }} <i @click="handleResetFile" class="fas fa-times"
                                      style="margin-left: 10px;cursor: pointer;margin-top: 2px;color: rgb(128,128,128)"></i>
          </div>
        </b-col>
      </b-row>
      <div class="py-2">
        <b-form-group v-if="userInfo" class="mt-2">
          <i class="fas fa-upload custom-upload"></i>
          <div class="mr-4">
            <b-form-file
                id="input-file"
                ref="fileExcel"
                multiple
                type="file"
                accept=".xls, .xlsx"
                placeholder="Kéo thả file hoặc"
                browse-text="Chọn file"
                @change="handleFilesUpload"
            ></b-form-file>
          </div>
        </b-form-group>
        <div style="width: 100%; text-align: center">
          <b-button :disabled="!currentFile || loadingFile" variant="primary" class="py-2"
                    style="margin-top: 90px;z-index: 1000;width: 200px" @click.prevent="handleUploadDataExcel">
            <span v-if="!loadingFile"
            > Xác nhận</span>
            <i v-if="loadingFile" class="fa fa-spinner fa-spin mr-2"/>
          </b-button>
        </div>
      </div>
    </b-modal>
  </b-form>
</template>
<script>
import PageTitle from "../Layout/Components/PageTitle";
import DatePicker from "vue2-datepicker"
import {
  ALL_GROUP_TEACHER,
  CREATE_TEACHER,
  FETCH_TEACHERS,
  UPDATE_TEACHER
} from "@/store/action.type"
import {mapGetters} from "vuex";
import {checkPermission, formatDate2, formatTime} from "@/common/utils";
import {PAGINATION_OPTIONS, SAMPLE_TEACHER_IMPORT_LINK} from "@/common/config"
import baseMixins from "../components/mixins/base";
import router from '@/router';
import moment from 'moment-timezone';
import {required} from "vuelidate/lib/validators";
import * as XLSX from "xlsx";
import {SET_ALL_GROUP_TEACHERS} from "@/store/mutation.type";
import MultiSelect from 'primevue/multiselect';

const initData = {
  id: null,
  fullName: null,
  rankAndDegree: null,
  status: null,
  groupTeacher: null,
  startTimeFrom: null,
  startTimeTo: null,
  page: 1,
  pageSize: 20
}

const initTeacher = {
  id: null,
  fullName: null,
  rankAndDegree: null,
  startTime: null,
  birthday: null,
  groupTeacher: null,
  gdTime: null,
  hdTime: null,
  rating: null,
  status: null
}

const initNewDataExcel = {
  fullName: null,
  rankAndDegree: null,
  startTime: null,
  birthday: null,
  gdTime: null,
  hdTime: null,
  rating: null,
  status: null
};

export default {
  name: "Teachers",
  components: {PageTitle, DatePicker, MultiSelect},
  mixins: [baseMixins],
  data() {
    return {
      loadingFile: false,
      startTimeFrom: null,
      startTimeTo: new Date(),
      totalRow: 0,
      PAGINATION_OPTIONS,
      SAMPLE_TEACHER_IMPORT_LINK,
      subheading: "Quản lý danh sách giảng viên.",
      icon: "pe-7s-portfolio icon-gradient bg-happy-itmeo",
      heading: "Danh sách giảng viên",
      loadingHeader: true,
      dataFilter: Object.assign({}, {
        ...initData,
      }),
      selectedPageSize: {text: initData.pageSize},
      selectedRankAndDegree: {value: null, text: 'Tất cả'},
      selectedStatus: {value: null, text: 'Tất cả'},
      optionsStatus: [
        {value: null, text: 'Tất cả'},
        {value: 0, text: 'Không hoạt động'},
        {value: 1, text: 'Hoạt động'},
      ],
      optionsRankAndDegree: [
        {value: null, text: 'Tất cả'},
        {value: 'GV', text: 'Giảng viên'},
        {value: 'TS', text: 'Tiến sĩ'},
        {value: 'ThS', text: 'Thạc sĩ'},
        {value: 'GS', text: 'Giáo sư'},
        {value: 'PGS', text: 'Phó giáo sư'},
      ],
      fields: [
        {
          key: "key",
          label: "STT",
          tdClass: 'align-middle',
          thClass: 'align-middle',
          visible: true,
          thStyle: {width: '3%'}
        },
        {
          key: "id",
          label: "ID",
          tdClass: 'align-middle',
          thClass: 'align-middle',
          visible: true,
          thStyle: {width: '3%'}
        },
        {key: "fullName", label: "Họ và tên", visible: true, thStyle: {width: '7%'}, thClass: 'align-middle'},
        {key: "rankAndDegree", label: "Học hàm học vị", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {key: "groupTeacher", label: "Nhóm chuyên môn", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {key: "gdTime", label: "Số giờ GD", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {key: "hdTime", label: "Số giờ HD", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {key: "rating", label: "Rating", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
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
        {key: "status", label: "Trạng thái", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
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
      actionType: null,
      userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
      currentData: Object.assign({}, {...initTeacher}),
      currentDetail: null,
      currentFile: null,
      isUpdate: false,
      uploadDataExcel: [],
      dataExcel: [],
      selectedGroupTeacher: { value: null, text: "Tất cả" },
    }
  },
  validations: {
    currentData: {
      fullName: {required},
      rankAndDegree: {required},
      startTime: {required},
      birthday: {required},
      gdTime: {required},
      hdTime: {required},
      rating: {required},
      status: {required}
    },
  },
  mounted() {
    Promise.all([
        this.fetchAllGroupTeachers()
    ]).then(() => {
      const dataSearch = this.$route.query.dataSearch;

      if (dataSearch) {
        this.dataFilter = JSON.parse(String(dataSearch));

        this.selectedRankAndDegree = this.optionsRankAndDegree.filter((i) => i.value === this.dataFilter.rankAndDegree)[0];
        this.selectedStatus = this.optionsStatus.filter((i) => i.value === this.dataFilter.status)[0];
        this.selectedGroupTeacher = this.optionsGroupTeacher.filter(
            (i) => i.value === this.dataFilter.groupTeacher
        )[0];
        this.startTimeFrom = this.dataFilter.startTimeFrom && new Date(this.dataFilter.startTimeFrom);
        this.startTimeTo = this.dataFilter.startTimeTo && new Date(moment(this.dataFilter.startTimeTo).subtract(1, 'day'));

        this.selectedPageSize = {text: this.dataFilter.pageSize}
      }
      this.handleDataFilter();

      this.fetchTeachers();
    })
  },
  watch: {},
  computed: {
    ...mapGetters(["teachers", "allGroupTeachers"]),
    visibleFields() {
      return this.fields.filter((field) => field.visible);
    },
    validation() {
    },
    optionsGroupTeacher() {
      return this.formatOptionsGroupTeacher(this.allGroupTeachers);
    }
  },
  methods: {
    handleDataFilter() {
      this.dataFilter.startTimeFrom = this.startTimeFrom && formatTime(this.startTimeFrom, 'START');
      this.dataFilter.startTimeTo = this.startTimeTo && formatTime(this.startTimeTo, 'END');
      this.dataFilter.id = this.id !== '' ? this.dataFilter.id : null;
      this.dataFilter.fullName = this.fullName !== '' ? this.dataFilter.fullName : null;
      this.dataFilter.rankAndDegree = this.selectedRankAndDegree === null ? null : this.selectedRankAndDegree.value;
      this.dataFilter.status = this.status === null ? null : this.selectedStatus.value;
      this.dataFilter.page = 1;
      this.dataFilter.pageSize = this.selectedPageSize.text
      this.dataFilter.groupTeacher = this.selectedGroupTeacher == null ? null : this.selectedGroupTeacher.value;
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
      router.push({path: '/admin/teachers', query: {dataSearch: JSON.stringify(this.dataFilter)}})
      this.fetchTeachers();
    },
    changePageSize(e) {
      if (e) {
        this.dataFilter.pageSize = e.text
        this.dataFilter.page = 1
      }
      router.push({path: '/admin/teachers', query: {dataSearch: JSON.stringify(this.dataFilter)}})
      this.fetchTeachers();
    },
    handleSearch(event) {
      event.preventDefault();
      this.handleDataFilter();
      router.push({path: '/admin/teachers', query: {dataSearch: JSON.stringify(this.dataFilter)}})
      this.fetchTeachers();
    },
    handleReset() {
      this.$router.replace('/admin/teachers')
      this.dataFilter = Object.assign({}, {
        ...initData,
        pageSize: this.dataFilter.pageSize,
        startTimeTo: new Date(),
        startTimeFrom: null,
      });
      this.startTimeTo = new Date();
      this.startTimeFrom = null;
      this.fullName = '';
      this.selectedRankAndDegree = {value: null, text: 'Tất cả'};
      this.selectedStatus = {value: null, text: 'Tất cả'};
      this.selectedGroupTeacher = {value: null, text: 'Tất cả'};
      this.id = '';
      this.handleDataFilter();
      this.fetchTeachers();
    },
    openModalCreateTeacherCompartment(teacher, isUpdate) {
      this.isUpdate = isUpdate

      if (isUpdate) {
        this.currentData = Object.assign({}, {
          ...teacher,
          startTime: new Date(teacher.startTime),
          birthday: new Date(teacher.birthday),
        });
      } else {
        this.currentData = Object.assign({}, {
          ...initTeacher,
          rankAndDegree: 'GV',
          status: 0,
          startTime: new Date(),
          birthday: new Date(),
        });
      }
      this.$root.$emit("bv::show::modal", 'update-teacher');
    },
    closeModalCreateTeacherCompartment() {
      this.currentData = Object.assign({}, {...initTeacher})
      this.$nextTick(() => {
        this.$v.currentData.$reset();
      });
      this.$root.$emit("bv::hide::modal", 'update-teacher')
    },
    validationStatus: function (validation) {
      return typeof validation != "undefined" ? validation.$error : false;
    },
    async handleCreateTeacher() {
      this.$v.$reset();
      this.$v.$touch();

      if (this.$v.currentData.$invalid) return
      const payload = {
        id: this.isUpdate ? this.currentData.id : null,
        fullName: this.currentData.fullName,
        rankAndDegree: this.currentData.rankAndDegree,
        status: this.currentData.status,
        gdTime: this.currentData.gdTime,
        hdTime: this.currentData.hdTime,
        rating: this.currentData.rating,
        startTime: moment(this.currentData.startTime).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        birthday: moment(this.currentData.birthday).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      }

      if (this.isUpdate) {
        const res = await this.$store.dispatch(UPDATE_TEACHER, payload)
        if (res && res.status === 200) {
          clearTimeout(this.handleDelay)
          this.handleDelay = setTimeout(() => {
            this.$message({
              message: 'Cập nhật thông tin giảng viên thành công',
              type: "success",
              showClose: true,
            });
            this.closeModalCreateTeacherCompartment()
            this.fetchTeachers()
          }, 1000)
        }
      } else {
        const res = await this.$store.dispatch(CREATE_TEACHER, payload)
        if (res && res.status === 200) {
          clearTimeout(this.handleDelay)
          this.handleDelay = setTimeout(() => {
            this.$message({
              message: 'Thêm mới giảng viên thành công',
              type: "success",
              showClose: true,
            });
            this.closeModalCreateTeacherCompartment()
            this.fetchTeachers()
          }, 1000)
        }
      }
    },
    openModalUploadTeacher() {
      this.$root.$emit("bv::show::modal", 'modal-upload-teacher')
    },
    closeModalUpload() {
      this.currentDetail = null
      this.currentFile = null
      this.$root.$emit("bv::hide::modal", 'modal-upload-teacher')
    },
    handleResetFile() {
      this.uploadDataExcel = []
      this.dataExcel = []
      this.currentFile = null
      this.$nextTick(() => {
        this.$refs.fileExcel.reset();
      })
    },
    handleFilesUpload(event) {
      this.dataExcel = [];
      this.uploadDataExcel = [];
      this.currentFile = null;
      let uploadedFiles = event.target.files ? event.target.files[0] : event.dataTransfer.files[0];
      if (!uploadedFiles) return;

      this.currentFile = uploadedFiles;
      let reader = new FileReader();
      reader.onload = (e) => {
        const target = reader.result;
        const wb = XLSX.read(target, {type: "array", cellDates: true});
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, {header: 1, raw: false});
        this.handleFormatJSONFromExcel(data);
      };
      reader.readAsArrayBuffer(uploadedFiles);
    },
    handleFormatJSONFromExcel(json) {
      if (!json || json.length <= 1) return;

      this.dataExcel = json
          .filter((item, index) => index !== 0)
          .map((item, index) => {
            let teacher = Object.assign({});

            item.forEach((itemValue, indexValue) => {
              if (json[0][indexValue]) {
                let newAttribute = '';
                switch (json[0][indexValue]) {
                  case 'Họ và tên':
                    newAttribute = 'fullName';
                    break;
                  case 'Học hàm học vị':
                    newAttribute = 'rankAndDegree';
                    break;
                  case 'Ngày bắt đầu':
                    newAttribute = 'startTime';
                    break;
                  case 'Ngày sinh':
                    newAttribute = 'birthday';
                    break;
                  case 'Số giờ GD':
                    newAttribute = 'gdTime';
                    break;
                  case 'Số giờ HD':
                    newAttribute = 'hdTime';
                    break;
                  case 'Rating':
                    newAttribute = 'rating';
                    break;
                  case 'Trạng thái':
                    newAttribute = 'status';
                    break;
                  default:
                    break;
                }
                teacher[newAttribute] = itemValue;
              }
            });

            return teacher;
          });
    },
    async handleUploadDataExcel() {
      if (!this.dataExcel || this.dataExcel.length === 0) {
        this.$message({
          message: "Tải dữ liệu không thành công. Vui lòng kiểm tra lại file excel đã chọn",
          type: "warning",
          showClose: true,
        });
        return
      }
      if (!this.dataExcel || this.dataExcel.length === 0) return null

      this.dataExcel.forEach(item => {
        let newData = Object.assign({}, {...initNewDataExcel})
        newData.fullName = item.fullName ? item.fullName : null;
        newData.rankAndDegree = item.rankAndDegree ? item.rankAndDegree : null;
        newData.status = item.status ? item.status : null;
        newData.startTime = item.startTime ? item.startTime : null
        newData.birthday = item.birthday ? item.birthday : null
        newData.gdTime = item.gdTime ? item.gdTime : null
        newData.hdTime = item.hdTime ? item.hdTime : null
        newData.rating = item.rating ? item.rating : null

        this.uploadDataExcel.push({...newData})
      });

      this.loadingFile = true;
      const dataFiltered = this.uploadDataExcel.filter((item) => {
        return item.fullName !== null;
      });

      let res = await this.post('/teacher/upload-excel', {
        teacherCreateRequests: dataFiltered
      });
      setTimeout(() => {
        this.loadingFile = false;
      }, 300);

      if (res.status === 200) {
        this.$message({
          message: 'Tải dữ liệu lên thành công.',
          type: "success",
          showClose: true,
        });

        this.uploadDataExcel = []
        this.dataExcel = []
        this.currentFile = null
        this.$nextTick(() => {
          this.$refs.fileExcel.reset();
        })

        setTimeout(() => {
          this.closeModalUpload();
          this.fetchTeachers();
        }, 1000);
      }
    },
    formatOptionsGroupTeacher(groupTeachers) {
      if (!groupTeachers) return []
      let options = groupTeachers.map((item) => {
        return {text: item.name, value: item.id}
      })

      let result = [{text: "Tất cả", value: null}]
      result.push({...options[0]})
      options.forEach(item => {
        if (result && result.length > 0) {
          if (result.map(child => child.value).indexOf(item.value) === -1) result.push(item)
        }
      })

      return result;
    },
    async fetchAllGroupTeachers() {
      let response = await this.$store.dispatch(ALL_GROUP_TEACHER);

      if (response && response.data) {
        this.$store.commit(SET_ALL_GROUP_TEACHERS, response.data);
      }
    },
    concatGroupTeacher(groupTeacher) {
      if (groupTeacher === null || groupTeacher.length <= 0) {
        return "";
      }

      let groupTeacherText = "";
      groupTeacher.forEach((item, index) => {
        if (index !== groupTeacher.length - 1)
          groupTeacherText += item.name + ", ";
        else
          groupTeacherText += item.name;
      })
      return groupTeacherText;
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
<style>
.custom-file-label {
  height: 120px;
  border: 1px dashed #01904a;
  justify-content: center;
  display: flex;
  align-items: end;
  padding: 20px;
}
.custom-file-label::after {
  content: 'Chọn file' !important;
  position: relative !important;
  background: none;
  border: none;
  padding: 0;
  height: unset;
  margin-left: 5px;
  color: #01904a;
  font-weight: bold;
  font-size: 15px;
}

#modal-upload-teacher .modal-footer {
  display: none;
}

.custom-upload {
  font-size: 35px;
  color: #01904a;
  position: absolute;
  z-index: 1000;
  top: 120px;
  left: 46%;
}

.custom-file-label {
  font-weight: bold;
  font-size: 15px;
}
</style>