<template>
  <b-form @submit="handleSearch">
    <div>
      <page-title
          :heading="heading"
          :subheading="subheading"
          :icon="icon"
      ></page-title>
      <b-card class="main-card search-wrapper mb-20">
        <template v-if="loadingHeader">
          <a-skeleton active :paragraph="{ rows: 5 }"></a-skeleton>
        </template>
        <template v-else>
          <b-row class="mb-2">
            <b-col md="2">
              <div class="label-form">Bộ dữ liệu</div>
              <multiselect v-model="selectedDataset" track-by="text" label="text" :show-labels="false"
                           placeholder="Chọn" :options="optionsDataset" :searchable="true">
                <template slot="singleLabel" slot-scope="{ option }">{{ option.text }}</template>
              </multiselect>
            </b-col>
            <b-col md="2" style="margin-top: 30px">
              <b-button variant="primary" class="mr-2" @click="handleSearch" type="submit">
                <font-awesome-icon :icon="['fas', 'search']"/>
                Tìm kiếm
              </b-button>
            </b-col>
          </b-row>
          <b-row v-if="this.dataFilter.dataset != null && !timetablingTeacherStatus">
            <b-col md="4"><h4>Bắt đầu phân công</h4></b-col>
            <b-col md="8" style="font-weight: 500">
              <b-button
                  variant="primary"
                  class="custom-btn-add-common"
                  style="background: orange; border: none"
                  @click="openModalTimetablingTeacherCompartment"
              >
                Phân công
              </b-button>
            </b-col>
          </b-row>
          <b-row
              v-if="this.dataFilter.dataset != null && timetablingTeacherStatus && timetablingTeacherStatus.status === 'PROCESSING'">
            <b-col md="12"><h6>Hệ thống đang thực hiện phân công giảng dạy</h6></b-col>
          </b-row>
          <b-row
              v-if="this.dataFilter.dataset != null && timetablingTeacherStatus && timetablingTeacherStatus.status === 'FAILED'">
            <b-col md="12"><h6>Hệ thống thực hiện phân công giảng dạy thất bại</h6></b-col>
          </b-row>
          <b-row
              v-if="this.dataFilter.dataset != null && timetablingTeacherStatus && timetablingTeacherStatus.status === 'SUCCESS'">
            <b-col md="10"><h6>Hệ thống đã thực hiện phân công giảng dạy xong</h6></b-col>
            <b-button variant="primary" class="mr-2 custom-btn-add-common" @click="exportTimetablingTeacher"
                      style="border: none">
              <font-awesome-icon :icon="['fas','file-excel']"/>
              Xuất dữ liệu
            </b-button>
          </b-row>
        </template>
      </b-card>

      <b-card class="main-card search-wrapper mb-20"
              v-if="this.dataFilter.dataset != null && timetablingTeacherStatus && timetablingTeacherStatus.status === 'SUCCESS'"
              style="margin-top: 15px">
        <template v-if="loadingHeader">
          <a-skeleton active :paragraph="{ rows: 5 }"></a-skeleton>
        </template>
        <template v-else>
          <b-row class="mb-2">
            <b-col md="2">
              <div class="label-form">Giảng viên</div>
              <multiselect v-model="selectedTeacher" track-by="text" label="text" :show-labels="false"
                           placeholder="Chọn" :options="optionsTeacher" :searchable="true">
                <template slot="singleLabel" slot-scope="{ option }">{{ option.text }}</template>
              </multiselect>
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col md="4" style="margin-top: 30px">
              <b-button variant="primary" class="mr-2" @click="handleSearch" type="submit">
                <font-awesome-icon :icon="['fas', 'search']"/>
                Tìm kiếm
              </b-button>
              <b-button class="mr-2" variant="light" @click="handleReset">
                <font-awesome-icon :icon="['fas', 'eraser']"/>
                Xóa lọc
              </b-button>
            </b-col>
          </b-row>

          <b-table
              class="mt-3"
              :items="classesByTeacher.data"
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
              {{ row.index + 1 }}
            </template>
            <template #cell(room)="row">
              {{ concatBuildingAndRoom(row.item.building, row.item.room) }}
            </template>
            <template #cell(actions)="row" style="text-align: center">
              <div class="d-flex justify-content-center flex-wrap">
                <a
                    v-if="userInfo && userInfo.permissions.indexOf('class_update') !== -1"
                    href="javascript:void(0)"
                    class="m-1"
                    type="button"
                    title="Cập nhật giảng viên"
                    v-b-tooltip.hover
                    @click.prevent="openModalUpdateClassCompartment(row.item)">
                  <font-awesome-icon :icon="['fas', 'edit']"/>
                </a>
              </div>
            </template>
          </b-table>
          <b-row v-if="classesByTeacher.data && classesByTeacher.data.length === 0"
                 class="justify-content-center">
            <span>Không tìm thấy bản ghi nào</span>
          </b-row>
        </template>
      </b-card>

      <b-modal
          id="timetabling-teacher"
          :title="'Phân công giảng dạy'"
          :no-close-on-backdrop="true"
          size="lg"
          @hidden="closeModalTimetablingTeacherCompartment"
      >
        <b-row>
          <b-col md="12">
            <h6>Bạn có chắc chắn muốn thực hiện phân công giảng dạy {{ inputData == null ? 0 : inputData.numOfClasses }}
              lớp học cho
              {{ inputData == null ? 0 : inputData.numOfTeachers }} giảng viên?</h6>
          </b-col>
        </b-row>
        <template #modal-footer>
          <b-button
              class="mr-2 btn-light2 pull-right"
              @click="closeModalTimetablingTeacherCompartment"
          >
            Hủy
          </b-button>
          <b-button
              variant="primary pull-right"
              @click.prevent="handleTimetablingTeacher"
          >
            Đồng ý
          </b-button>
        </template>
      </b-modal>

      <b-modal
          id="update-class"
          :title="'Cập nhật thông tin lớp học'"
          :no-close-on-backdrop="true"
          size="lg"
          @hidden="closeModalUpdateClassCompartment"
      >
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label>Giảng viên phụ trách<span class="text-danger">*</span>:</label>
              <b-form-input
                  id="input-teacher-id"
                  v-model="$v.currentData.teacherId.$model"
                  placeholder="Nhập giảng viên phụ trách"
                  trim
                  :class="{ 'is-invalid': validationStatus($v.currentData.teacherId) }"
              />
              <div v-if="!$v.currentData.teacherId.required" class="invalid-feedback">
                Giảng viên phụ trách không được để trống.
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <template #modal-footer>
          <b-button
              class="mr-2 btn-light2 pull-right"
              @click="closeModalUpdateClassCompartment"
          >
            Hủy
          </b-button>
          <b-button
              variant="primary pull-right"
              @click.prevent="handleUpdateClass"
          >
            Đồng ý
          </b-button>
        </template>
      </b-modal>
    </div>
  </b-form>
</template>
<script>
import PageTitle from "../Layout/Components/PageTitle";
import DatePicker from "vue2-datepicker"
import {mapGetters} from "vuex";
import {checkPermission} from "@/common/utils";
import baseMixins from "../components/mixins/base";
import router from '@/router';
import {required} from "vuelidate/lib/validators";
import {
  TIMETABLING_TEACHER,
  INPUT_DATA,
  TIMETABLING_TEACHER_STATUS,
  FETCH_CLASSES_BY_TEACHER, UPDATE_CLASS, CREATE_FILE_TIMETABLING_TEACHER
} from "@/store/action.type";

const initData = {
  teacherId: null,
  dataset: null
}

const initClass = {
  id: null,
  teacherId: null,
}

export default {
  name: "TimetablingTeacher",
  components: {PageTitle, DatePicker},
  mixins: [baseMixins],
  data() {
    return {
      subheading: "Phân bổ các lớp cho giảng viên thỏa mãn các ràng buộc.",
      icon: "pe-7s-portfolio icon-gradient bg-happy-itmeo",
      heading: "Phân công giảng dạy",
      loadingHeader: true,
      dataFilter: Object.assign({}, {
        ...initData,
      }),
      selectedDataset: {value: null, text: 'Tất cả'},
      optionsDataset: [],
      currentData: Object.assign({}, {...initClass}),
      userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
      fields: [
        {
          key: "key",
          label: "STT",
          tdClass: 'align-middle',
          thClass: 'align-middle',
          visible: true,
          thStyle: {width: '3%'}
        },
        {key: "id", label: "Mã lớp học", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {key: "name", label: "Lớp học", visible: true, thStyle: {width: '7%'}, thClass: 'align-middle'},
        {key: "code", label: "Mã lớp học", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {
          key: "semester",
          label: "Học kỳ",
          visible: true,
          thStyle: "width: 6%",
          thClass: 'align-middle'
        },
        {
          key: "subjectId",
          label: "Học phần",
          visible: true,
          thStyle: "width: 6%",
          thClass: 'align-middle'
        },
        {
          key: "week",
          label: "Tuần học",
          visible: true,
          thStyle: "width: 6%",
          thClass: 'align-middle'
        },
        {
          key: "dayOfWeek",
          label: "Ngày trong tuần",
          visible: true,
          thStyle: "width: 6%",
          thClass: 'align-middle'
        },
        {
          key: "timeOfDay",
          label: "Tiết trong ngày",
          visible: true,
          thStyle: "width: 6%",
          thClass: 'align-middle'
        },
        {key: "room", label: "Phòng học", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {key: "timeOfClass", label: "Số giờ dạy", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {
          key: "actions",
          label: "Chức năng",
          visible: true,
          thStyle: "width: 6%",
          thClass: 'align-middle'
        }
      ],
      selectedTeacher: null,
      optionsTeacher: []
    }
  },
  watch: {},
  validations: {
    currentData: {
      teacherId: {required},
    },
  },
  mounted() {
    Promise.all([
      this.fetchAllDatasets(),
    ]).then(() => {
      const dataSearch = this.$route.query.dataSearch;

      if (dataSearch) {
        this.dataFilter = JSON.parse(String(dataSearch));
        this.selectedDataset = this.optionsDataset.filter(
            (i) => i.value === this.dataFilter.dataset
        )[0];
      }
      this.fetchAllTeachers();
      if (dataSearch) {
        this.dataFilter = JSON.parse(String(dataSearch));
        this.selectedTeacher = this.optionsTeacher.filter(
            (i) => i.value === this.dataFilter.teacherId
        )[0];
      }
      this.handleDataFilter();
      this.fetchInputData()
      this.fetchTimetablingTeacherStatus()
      this.fetchClassesByTeacher();
    })
  },
  computed: {
    ...mapGetters(["inputData", "timetablingTeacherStatus", "classesByTeacher"]),
    visibleFields() {
      return this.fields.filter((field) => field.visible);
    },
    validation() {
    },
  },
  methods: {
    handleDataFilter() {
      this.dataFilter.teacherId = this.selectedTeacher == null ? 1 : this.selectedTeacher.value;
      this.dataFilter.dataset = this.selectedDataset == null ? null : this.selectedDataset.value;
    },
    reload() {
      this.handleDataFilter();
      this.fetchAllTeachers()
      this.fetchInputData()
      this.fetchTimetablingTeacherStatus()
      this.fetchClassesByTeacher();
    },
    async fetchClassesByTeacher() {
      await this.$store.dispatch(FETCH_CLASSES_BY_TEACHER, {
        teacherId: this.dataFilter.teacherId,
        dataset: this.dataFilter.dataset
      });
      setTimeout(() => {
        if (this.loadingHeader) this.loadingHeader = !this.loadingHeader
      }, 200);
    },
    handleSearch(event) {
      event.preventDefault();
      this.handleDataFilter();
      router.push({
        path: '/admin/timetabling/teacher',
        query: {dataSearch: JSON.stringify(this.dataFilter)}
      })
      this.fetchAllTeachers()
      this.fetchInputData()
      this.fetchTimetablingTeacherStatus()
      this.fetchClassesByTeacher();
    },
    handleReset() {
      this.$router.replace('/admin/timetabling/teacher')
      this.dataFilter = Object.assign({}, {
        ...initData,
      });
      this.handleDataFilter();
      this.fetchAllTeachers();
      this.fetchInputData()
      this.fetchTimetablingTeacherStatus()
      this.fetchClassesByTeacher();
    },
    async fetchAllTeachers() {
      let params = this.dataFilter.dataset != null ? '?dataset=' + this.dataFilter.dataset : ''
      let response = await this.get('/teacher/all' + params);

      if (response && response.data) {
        this.optionsTeacher = this.formatOptionsTeacher(response.data.data);
      }
    },
    checkPermission,
    formatOptionsTeacher(teachers) {
      if (!teachers) return [];
      const result = teachers.map((item) => {
        return {text: item.fullName, value: item.id}
      });

      this.selectedTeacher = result[0]

      return result;
    },
    async fetchInputData() {
      await this.$store.dispatch(INPUT_DATA, {
        dataset: this.dataFilter.dataset
      });
      setTimeout(() => {
        if (this.loadingHeader) this.loadingHeader = !this.loadingHeader
      }, 200);
    },
    async fetchTimetablingTeacherStatus() {
      await this.$store.dispatch(TIMETABLING_TEACHER_STATUS, {
        dataset: this.dataFilter.dataset
      });
      setTimeout(() => {
        if (this.loadingHeader) this.loadingHeader = !this.loadingHeader
      }, 200);
    },
    openModalTimetablingTeacherCompartment() {
      this.$root.$emit("bv::show::modal", 'timetabling-teacher');
    },
    closeModalTimetablingTeacherCompartment() {
      this.$root.$emit("bv::hide::modal", 'timetabling-teacher');
    },
    async handleTimetablingTeacher() {
      const res = await this.$store.dispatch(TIMETABLING_TEACHER, {
        dataset: this.dataFilter.dataset
      });
      if (res && res.status === 200) {
        clearTimeout(this.handleDelay)
        this.handleDelay = setTimeout(() => {
          this.$message({
            message: 'Đang phân công giảng dạy',
            type: "success",
            showClose: true,
          });
          this.closeModalTimetablingTeacherCompartment()
          this.fetchInputData()
          this.fetchTimetablingTeacherStatus()
          this.fetchClassesByTeacher()
        }, 1000)
      }
    },
    concatBuildingAndRoom(building, room) {
      if (building && room) {
        return building + "-" + room;
      }
      return "";
    },
    openModalUpdateClassCompartment(classItem) {
      this.currentData = Object.assign({}, {
        ...classItem,
      });
      this.$root.$emit("bv::show::modal", 'update-class');
    },
    closeModalUpdateClassCompartment() {
      this.currentData = Object.assign({}, {...initClass})
      this.$nextTick(() => {
        this.$v.currentData.$reset();
      });
      this.$root.$emit("bv::hide::modal", 'update-class')
    },
    async handleUpdateClass() {
      this.$v.$reset();
      this.$v.$touch();

      if (this.$v.currentData.$invalid) return
      const payload = {
        id: this.currentData.id,
        teacherId: this.currentData.teacherId,
      }

      const res = await this.$store.dispatch(UPDATE_CLASS, payload)
      if (res && res.status === 200) {
        clearTimeout(this.handleDelay)
        this.handleDelay = setTimeout(() => {
          this.$message({
            message: 'Cập nhật thông tin lớp học thành công',
            type: "success",
            showClose: true,
          });
          this.closeModalUpdateClassCompartment()
          this.fetchInputData()
          this.fetchTimetablingTeacherStatus()
          this.fetchClassesByTeacher()
        }, 1000)
      }
    },
    validationStatus: function (validation) {
      return typeof validation != "undefined" ? validation.$error : false;
    },
    exportTimetablingTeacher() {
      this.$store.dispatch(CREATE_FILE_TIMETABLING_TEACHER, null);
    },
    formatOptionsDataset(datasets) {
      if (!datasets) return [];
      const result = datasets.map((item) => {
        return {text: item.name, value: item.id}
      });

      return [{value: null, text: 'Tất cả'}, ...result];
    },
    async fetchAllDatasets() {
      let response = await this.get('/dataset/search');

      if (response && response.data) {
        this.optionsDataset = this.formatOptionsDataset(response.data.data);
      }
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