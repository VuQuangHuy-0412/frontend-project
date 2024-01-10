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
          <b-row v-if="this.dataFilter.dataset != null && !timetablingStudentStatus">
            <b-col md="4"><h4>Bắt đầu phân công</h4></b-col>
            <b-col md="8" style="font-weight: 500">
              <b-button
                  variant="primary"
                  class="custom-btn-add-common"
                  style="background: orange; border: none"
                  @click="openModalTimetablingStudentCompartment"
              >
                Phân công
              </b-button>
            </b-col>
          </b-row>
          <b-row
              v-if="this.dataFilter.dataset != null && timetablingStudentStatus && timetablingStudentStatus.status === 'PROCESSING'">
            <b-col md="12"><h6>Hệ thống đang thực hiện phân công hướng dẫn</h6></b-col>
          </b-row>
          <b-row
              v-if="this.dataFilter.dataset != null && timetablingStudentStatus && timetablingStudentStatus.status === 'FAILED'">
            <b-col md="12"><h6>Hệ thống thực hiện phân công hướng dẫn thất bại</h6></b-col>
          </b-row>
          <b-row
              v-if="this.dataFilter.dataset != null && timetablingStudentStatus && timetablingStudentStatus.status === 'SUCCESS'">
            <b-col md="10"><h6>Hệ thống đã thực hiện phân công hướng dẫn xong</h6></b-col>
            <b-button variant="primary" class="mr-2 custom-btn-add-common" @click="exportTimetablingStudent"
                      style="border: none">
              <font-awesome-icon :icon="['fas','file-excel']"/>
              Xuất dữ liệu
            </b-button>
          </b-row>
        </template>
      </b-card>

      <b-card class="main-card search-wrapper mb-20"
              v-if="this.dataFilter.dataset != null && timetablingStudentStatus && timetablingStudentStatus.status === 'SUCCESS'"
              style="margin-top: 15px">
        <b-form @submit="handleSearch">
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
                :items="studentsByTeacher.data"
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
              <template #cell(actions)="row" style="text-align: center">
                <div class="d-flex justify-content-center flex-wrap">
                  <a
                      v-if="userInfo && userInfo.permissions.indexOf('student_project_update') !== -1"
                      href="javascript:void(0)"
                      class="m-1"
                      type="button"
                      title="Cập nhật giảng viên"
                      v-b-tooltip.hover
                      @click.prevent="openModalUpdateStudentProjectCompartment(row.item)">
                    <font-awesome-icon :icon="['fas', 'edit']"/>
                  </a>
                </div>
              </template>
            </b-table>
            <b-row v-if="studentsByTeacher.data && studentsByTeacher.data.length === 0"
                   class="justify-content-center">
              <span>Không tìm thấy bản ghi nào</span>
            </b-row>
          </template>
        </b-form>
      </b-card>

      <b-modal
          id="timetabling-student"
          :title="'Phân công hướng dẫn'"
          :no-close-on-backdrop="true"
          size="lg"
          @hidden="closeModalTimetablingStudentCompartment"
      >
        <b-row>
          <b-col md="12">
            <h6>Bạn có chắc chắn muốn thực hiện phân công hướng dẫn {{ inputDataStudent.numOfStudents }} sinh viên cho
              {{ inputDataStudent.numOfTeachers }} giảng viên?</h6>
          </b-col>
        </b-row>
        <template #modal-footer>
          <b-button
              class="mr-2 btn-light2 pull-right"
              @click="closeModalTimetablingStudentCompartment"
          >
            Hủy
          </b-button>
          <b-button
              variant="primary pull-right"
              @click.prevent="handleTimetablingStudent"
          >
            Đồng ý
          </b-button>
        </template>
      </b-modal>

      <b-modal
          id="update-student-project"
          :title="'Cập nhật thông tin giảng viên phụ trách'"
          :no-close-on-backdrop="true"
          size="lg"
          @hidden="closeModalUpdateStudentProjectCompartment"
      >
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label>Giảng viên phụ trách<span class="text-danger">*</span>:</label>
              <b-form-input
                  id="input-teacher-id"
                  v-model="$v.currentData.teacherAssignedId.$model"
                  placeholder="Nhập giảng viên phụ trách"
                  trim
                  :class="{ 'is-invalid': validationStatus($v.currentData.teacherAssignedId) }"
              />
              <div v-if="!$v.currentData.teacherAssignedId.required" class="invalid-feedback">
                Giảng viên phụ trách không được để trống.
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <template #modal-footer>
          <b-button
              class="mr-2 btn-light2 pull-right"
              @click="closeModalUpdateStudentProjectCompartment"
          >
            Hủy
          </b-button>
          <b-button
              variant="primary pull-right"
              @click.prevent="handleUpdateStudentProject"
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
import {checkPermission, formatDate2, formatTime} from "@/common/utils";
import baseMixins from "../components/mixins/base";
import router from '@/router';
import moment from 'moment-timezone';
import {required} from "vuelidate/lib/validators";
import {
  TIMETABLING_STUDENT,
  INPUT_DATA_STUDENT,
  TIMETABLING_STUDENT_STATUS,
  FETCH_STUDENTS_BY_TEACHER,
  ALL_TEACHER,
  UPDATE_STUDENT_PROJECT,
  CREATE_FILE_TIMETABLING_TEACHER,
  CREATE_FILE_TIMETABLING_STUDENT
} from "@/store/action.type";
import {SET_ALL_TEACHERS} from "@/store/mutation.type";

const initData = {
  teacherId: null,
  dataset: null
}

const initStudent = {
  id: null,
  teacherAssignedId: null,
}

export default {
  name: "TimetablingStudent",
  components: {PageTitle, DatePicker},
  mixins: [baseMixins],
  data() {
    return {
      subheading: "Phân bổ sinh viên cho giảng viên thỏa mãn các ràng buộc.",
      icon: "pe-7s-portfolio icon-gradient bg-happy-itmeo",
      heading: "Phân công hướng dẫn",
      loadingHeader: true,
      dataFilter: Object.assign({}, {
        ...initData,
      }),
      selectedDataset: {value: null, text: 'Tất cả'},
      optionsDataset: [],
      currentData: Object.assign({}, {...initStudent}),
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
        {key: "name", label: "Họ và tên", visible: true, thStyle: {width: '7%'}, thClass: 'align-middle'},
        {key: "studentCode", label: "Mã sinh viên", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {key: "timeHd", label: "Số giờ HD", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {key: "isAssigned", label: "Trạng thái gán GV", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {key: "teacher1Id", label: "Nguyện vọng 1", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {key: "teacher2Id", label: "Nguyện vọng 2", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {key: "teacher3Id", label: "Nguyện vọng 3", visible: true, thStyle: "width: 7%", thClass: 'align-middle'},
        {
          key: "teacherAssignedId",
          label: "Giảng viên phụ trách",
          visible: true,
          thStyle: "width: 7%",
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
      selectedTeacher: null,
      optionsTeacher: []
    }
  },
  watch: {},
  validations: {
    currentData: {
      teacherAssignedId: {required},
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
      this.fetchTimetablingStudentStatus()
      this.fetchClassesByTeacher();
    })
  },
  computed: {
    ...mapGetters(["inputDataStudent", "timetablingStudentStatus", "studentsByTeacher"]),
    visibleFields() {
      return this.fields.filter((field) => field.visible);
    },
    validation() {
    },
    optionsTeacher() {
      return this.formatOptionsTeacher(this.allTeachers);
    }
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
      this.fetchTimetablingStudentStatus()
      this.fetchStudentsByTeacher();
    },
    async fetchStudentsByTeacher() {
      await this.$store.dispatch(FETCH_STUDENTS_BY_TEACHER, {
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
      router.push({path: '/admin/timetabling/student', query: {dataSearch: JSON.stringify(this.dataFilter)}})
      this.fetchAllTeachers()
      this.fetchInputData()
      this.fetchTimetablingStudentStatus()
      this.fetchStudentsByTeacher();
    },
    handleReset() {
      this.$router.replace('/admin/timetabling/student')
      this.dataFilter = Object.assign({}, {
        ...initData,
      });
      this.selectedTeacher = this.formatOptionsTeacher(this.allTeachers)[0];
      this.handleDataFilter();
      this.fetchAllTeachers();
      this.fetchInputData()
      this.fetchTimetablingStudentStatus()
      this.fetchStudentsByTeacher();
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
      await this.$store.dispatch(INPUT_DATA_STUDENT, {
        dataset: this.dataFilter.dataset
      });
      setTimeout(() => {
        if (this.loadingHeader) this.loadingHeader = !this.loadingHeader
      }, 200);
    },
    async fetchTimetablingStudentStatus() {
      await this.$store.dispatch(TIMETABLING_STUDENT_STATUS, {
        dataset: this.dataFilter.dataset
      });
      setTimeout(() => {
        if (this.loadingHeader) this.loadingHeader = !this.loadingHeader
      }, 200);
    },
    openModalTimetablingStudentCompartment() {
      this.$root.$emit("bv::show::modal", 'timetabling-student');
    },
    closeModalTimetablingStudentCompartment() {
      this.$root.$emit("bv::hide::modal", 'timetabling-student');
    },
    async handleTimetablingStudent() {
      this.handleDataFilter()
      const res = await this.$store.dispatch(TIMETABLING_STUDENT, {
        dataset: this.dataFilter.dataset
      });
      if (res && res.status === 200) {
        clearTimeout(this.handleDelay)
        this.handleDelay = setTimeout(() => {
          this.$message({
            message: 'Đang phân công hướng dẫn',
            type: "success",
            showClose: true,
          });
          this.closeModalTimetablingStudentCompartment()
          this.fetchInputData()
          this.fetchTimetablingStudentStatus()
          this.fetchStudentsByTeacher()
        }, 1000)
      }
    },
    openModalUpdateStudentProjectCompartment(classItem) {
      this.currentData = Object.assign({}, {
        ...classItem,
      });
      this.$root.$emit("bv::show::modal", 'update-student-project');
    },
    closeModalUpdateStudentProjectCompartment() {
      this.currentData = Object.assign({}, {...initStudent})
      this.$nextTick(() => {
        this.$v.currentData.$reset();
      });
      this.$root.$emit("bv::hide::modal", 'update-student-project')
    },
    async handleUpdateStudentProject() {
      this.$v.$reset();
      this.$v.$touch();

      if (this.$v.currentData.$invalid) return
      const payload = {
        id: this.currentData.id,
        teacherAssignedId: this.currentData.teacherAssignedId,
      }

      const res = await this.$store.dispatch(UPDATE_STUDENT_PROJECT, payload)
      if (res && res.status === 200) {
        clearTimeout(this.handleDelay)
        this.handleDelay = setTimeout(() => {
          this.$message({
            message: 'Cập nhật thông tin sinh viên thành công',
            type: "success",
            showClose: true,
          });
          this.closeModalUpdateClassCompartment()
          this.fetchInputData()
          this.fetchTimetablingStudentStatus()
          this.fetchStudentsByTeacher()
        }, 1000)
      }
    },
    validationStatus: function (validation) {
      return typeof validation != "undefined" ? validation.$error : false;
    },
    exportTimetablingStudent() {
      this.handleDataFilter()
      this.$store.dispatch(CREATE_FILE_TIMETABLING_STUDENT, {
        dataset: this.dataFilter.dataset
      });
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