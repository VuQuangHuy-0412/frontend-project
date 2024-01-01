<template>
  <div>
    <page-title
        :heading="heading"
        :subheading="subheading"
        :icon="icon"
    ></page-title>
    <b-card class="main-card search-wrapper mb-20">
      <b-row>
        <b-col md="2">Tên nhóm chuyên môn</b-col>
        <b-col md="10" style="font-weight: 500">{{ groupTeacherDetail && groupTeacherDetail.name }}</b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col md="2">Mô tả</b-col>
        <b-col md="10" style="font-weight: 500">{{ groupTeacherDetail && groupTeacherDetail.description }}</b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col md="2">Người phụ trách</b-col>
        <b-col md="10" style="font-weight: 500">
          {{ groupTeacherDetail && groupTeacherDetail.leaderInfo && groupTeacherDetail.leaderInfo.fullName }}
        </b-col>
      </b-row>

      <div class="text-right">
        <!--        <b-button-->
        <!--            v-if="userInfo && userInfo.permissions.indexOf('group_teacher_update_teacher') !== -1"-->
        <!--            variant="primary"-->
        <!--            class="mt-4 custom-btn-add-common"-->
        <!--            @click="openModalUpdateMobile('original', null)"-->
        <!--            style="max-width: 200px"-->
        <!--        >-->
        <!--          <font-awesome-icon :icon="['fas','edit']" />-->
        <!--          Cập nhật số điện thoại-->
        <!--        </b-button>-->
        <b-button variant="primary" class="mt-4 custom-btn-add-common" @click="openModalUploadGroupTeacherMapping"
                  style="border: none">
          <font-awesome-icon :icon="['fas','file-excel']"/>
          <span v-if="!loadingFile"
          ><i class="fas fa-upload"></i> Upload file
              </span>
          <i v-if="loadingFile" class="fa fa-spinner fa-spin"/>
        </b-button>
        <b-button
            v-if="userInfo && userInfo.permissions.indexOf('group_teacher_add_teacher') !== -1"
            variant="primary"
            class="mt-4 custom-btn-add-common"
            @click="openModalAddTeacherToGroup"
            style="background: orange; border: none"
        >
          <font-awesome-icon :icon="['fas','plus']"/>
          Thêm giảng viên
        </b-button>
      </div>

      <b-table
          :items="groupTeacherDetail.members"
          :fields="visibleFields"
          :bordered="true"
          :hover="true"
          :fixed="true"
          :foot-clone="false"
          class="mt-3"
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
        <template #cell(role)="row">
          <span v-if="row.item.role === 'leader'">
            Người phụ trách
          </span>
          <span v-if="row.item.role === 'teacher'">
            Giảng viên
          </span>
        </template>
        <template #cell(actions)="row" style="text-align: center">
          <a
              v-if="userInfo && userInfo.permissions.indexOf('group_teacher_update_teacher') !== -1"
              href="javascript:void(0)"
              class="m-2"
              type="button"
              title="Cập nhật vai trò"
              v-b-tooltip.hover
              @click.prevent="openModalUpdateRoleTeacher(row.item)"
          >
            <font-awesome-icon :icon="['fas', 'edit']"/>
          </a>
        </template>
      </b-table>

      <b-row v-if="groupTeacherDetail.members.length === 0" class="justify-content-center">
        <span>Không tìm thấy bản ghi nào</span>
      </b-row>
    </b-card>

    <b-modal
        id="add-teacher-to-group"
        :title="'Thêm giảng viên vào nhóm'"
        :no-close-on-backdrop="true"
        size="lg"
        @hidden="closeModalAddTeacherToGroup"
    >
      <b-row>
        <b-col md="12">
          <b-form-group :class="{'invalid-option': validationStatus($v.currentData.teacherId)}">
            <label>Tên giảng viên<span class="text-danger">*</span>:</label>
            <b-form-select
                :options="optionsTeacher"
                :searchable="true"
                value-field="value" text-field="text"
                :class="{'is-invalid-option': validationStatus($v.currentData.teacherId)}"
                v-model="currentData.teacherId"
            >
            </b-form-select>
            <div v-if="!$v.currentData.teacherId.required" class="invalid-feedback">
              Giảng viên không được để trống.
            </div>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-form-group :class="{'invalid-option': validationStatus($v.currentData.role)}">
            <label>Vai trò<span class="text-danger">*</span>:</label>
            <b-form-select
                :options="optionsRole"
                :searchable="true"
                value-field="value" text-field="text"
                :class="{'is-invalid-option': validationStatus($v.currentData.role)}"
                v-model.trim="currentData.role"
            >
            </b-form-select>
            <div v-if="!$v.currentData.role.required" class="invalid-feedback">
              Vai trò không được để trống.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <template #modal-footer>
        <b-button
            class="mr-2 btn-light2 pull-right"
            @click="closeModalAddTeacherToGroup"
        >
          Hủy
        </b-button>
        <b-button
            variant="primary pull-right"
            @click.prevent="handleAddTeacherToGroup"
        >
          Đồng ý
        </b-button>
      </template>
    </b-modal>

    <b-modal
        id="modal-upload-group-teacher-mapping"
        :modal-class="['sc5-modal']"
        :header-class="['modal__header']"
        :no-close-on-backdrop="true"
        size="lg"
        @hidden="closeModalUpload"
    >
      <template slot="modal-header">
        <div class="modal__header--item title font-weight-500">
          Upload file ds giảng viên thuộc nhóm chuyên môn
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
              :href="SAMPLE_GROUP_TEACHER_MAPPING_IMPORT_LINK"
              target="_self"
              style="font-weight: bold;color:black!important;"
          >Format_ThemGVThuocNCM</a
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

    <b-modal
        id="update-role-teacher"
        :title="'Cập nhật vai trò của giảng viên trong nhóm'"
        :no-close-on-backdrop="true"
        size="lg"
        @hidden="closeModalUpdateRoleTeacher"
    >
      <b-row>
        <b-col md="12">
          <b-form-group :class="{'invalid-option': validationStatus($v.currentData.role)}">
            <label>Vai trò<span class="text-danger">*</span>:</label>
            <b-form-select
                :options="optionsRole"
                :searchable="true"
                value-field="value" text-field="text"
                :class="{'is-invalid-option': validationStatus($v.currentData.role)}"
                v-model.trim="currentData.role"
            >
            </b-form-select>
            <div v-if="!$v.currentData.role.required" class="invalid-feedback">
              Vai trò không được để trống.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <template #modal-footer>
        <b-button
            class="mr-2 btn-light2 pull-right"
            @click="closeModalUpdateRoleTeacher"
        >
          Hủy
        </b-button>
        <b-button
            variant="primary pull-right"
            @click.prevent="handleUpdateRoleTeacher"
        >
          Đồng ý
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import PageTitle from "../Layout/Components/PageTitle";
import DatePicker from "vue2-datepicker";
import {mapGetters} from "vuex";
import baseMixins from "../components/mixins/base";
import {required} from "vuelidate/lib/validators";
import {checkPermission} from "@/common/utils";
import {
  ADD_TEACHER_TO_GROUP,
  ALL_TEACHER, CREATE_TEACHER,
  GROUP_TEACHER_DETAIL, UPDATE_ROLE_TEACHER, UPDATE_TEACHER,
} from "@/store/action.type";
import {SET_ALL_TEACHERS} from "@/store/mutation.type";
import * as XLSX from "xlsx";
import {SAMPLE_GROUP_TEACHER_MAPPING_IMPORT_LINK} from "@/common/config";
import moment from "moment-timezone";

const initGroupTeacherMapping = {
  id: null,
  teacherId: null,
  groupId: null,
  role: null,
}

const initNewDataExcel = {
  teacherId: null,
  groupId: null,
  role: null,
};


export default {
  name: "GroupTeacherDetail",
  components: {
    PageTitle,
    DatePicker,
  },
  data() {
    return {
      loadingFile: false,
      SAMPLE_GROUP_TEACHER_MAPPING_IMPORT_LINK,
      currentFile: null,
      currentDetail: null,
      uploadDataExcel: [],
      dataExcel: [],
      subheading: "Chi tiết nhóm chuyên môn và danh sách giảng viên",
      icon: "pe-7s-portfolio icon-gradient bg-happy-itmeo",
      heading: "Chi tiết nhóm chuyên môn",
      userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
      currentData: Object.assign({}, {...initGroupTeacherMapping}),
      selectedRole: {value: "teacher", text: 'Giảng viên'},
      selectedTeacher: null,
      optionsRole: [
        {value: "teacher", text: 'Giảng viên'},
        {value: 'leader', text: 'Người phụ trách'},
      ],
      fields: [
        {
          key: "key",
          label: "STT",
          tdClass: "align-middle",
          thClass: "align-middle",
          visible: true,
          thStyle: {width: "5%"}
        },
        {
          key: "fullName",
          label: "Họ và tên",
          visible: true,
          thStyle: "width: 10%",
          thClass: "align-middle text-left"
        },
        {
          key: "role",
          label: "Vai trò",
          visible: true,
          thStyle: "width: 15%",
          thClass: "align-middle"
        },
        {
          key: "actions",
          label: "Chức năng",
          visible: true,
          thStyle: "width: 8%",
          tdClass: "text-center align-middle",
          thClass: "text-center align-middle"
        },
      ],
    }
  },
  mixins: [baseMixins],
  validations: {
    currentData: {
      teacherId: {required},
      role: {required},
    },
  },
  mounted() {
    Promise.all([
      this.fetchAllTeachers()
    ]).then(() => {
      this.fetchGroupTeacherDetail();
    })
  },
  watch: {},
  computed: {
    ...mapGetters(["groupTeacherDetail", "allTeachers"]),
    visibleFields() {
      return this.fields.filter((field) => field.visible);
    },
    validation() {
    },
    getCurrentGroupId() {
      return this.$route.query && this.$route.query.id
    },
    optionsTeacher() {
      return this.formatOptionsTeacher(this.allTeachers);
    },
  },
  methods: {
    checkPermission,
    async fetchGroupTeacherDetail() {
      let payload = {
        id: this.getCurrentGroupId,
      }
      await this.$store.dispatch(GROUP_TEACHER_DETAIL, payload);
      setTimeout(() => {
        if (this.loadingHeader) this.loadingHeader = !this.loadingHeader
      }, 200);
    },
    openModalAddTeacherToGroup() {
      this.currentData = Object.assign({}, {
        ...initGroupTeacherMapping,
      });
      this.$root.$emit("bv::show::modal", 'add-teacher-to-group');
    },
    closeModalAddTeacherToGroup() {
      this.$root.$emit("bv::hide::modal", 'add-teacher-to-group');
    },
    validationStatus: function (validation) {
      return typeof validation != "undefined" ? validation.$error : false;
    },
    formatOptionsTeacher(teachers) {
      if (!teachers) return []
      let options = teachers.map((item) => {
        return {text: item.fullName, value: item.id}
      })

      let result = []
      result.push({...options[0]})
      options.forEach(item => {
        if (result && result.length > 0) {
          if (result.map(child => child.value).indexOf(item.value) === -1) result.push(item)
        }
      })

      return result;
    },
    async fetchAllTeachers() {
      let response = await this.$store.dispatch(ALL_TEACHER);

      if (response && response.data) {
        this.$store.commit(SET_ALL_TEACHERS, response.data);
      }
    },
    async handleAddTeacherToGroup() {
      this.$v.$reset();
      this.$v.$touch();

      if (this.$v.currentData.$invalid) return
      const payload = {
        teacherId: this.currentData.teacherId,
        role: this.currentData.role,
        groupId: this.getCurrentGroupId,
      }
      const res = await this.$store.dispatch(ADD_TEACHER_TO_GROUP, payload)
      if (res && res.status === 200) {
        clearTimeout(this.handleDelay)
        this.handleDelay = setTimeout(() => {
          this.$message({
            message: 'Thêm giảng viên vào nhóm thành công',
            type: "success",
            showClose: true,
          });
          this.closeModalAddTeacherToGroup()
          this.fetchGroupTeacherDetail()
        }, 1000)
      }
    },
    openModalUploadGroupTeacherMapping() {
      this.$root.$emit("bv::show::modal", 'modal-upload-group-teacher-mapping')
    },
    closeModalUpload() {
      this.currentDetail = null
      this.currentFile = null
      this.$root.$emit("bv::hide::modal", 'modal-upload-group-teacher-mapping')
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
            let groupTeacherMapping = Object.assign({});

            item.forEach((itemValue, indexValue) => {
              if (json[0][indexValue]) {
                let newAttribute = '';
                switch (json[0][indexValue]) {
                  case 'Mã giảng viên':
                    newAttribute = 'teacherId';
                    break;
                  case 'Mã nhóm chuyên môn':
                    newAttribute = 'groupId';
                    break;
                  case 'Vai trò':
                    newAttribute = 'role';
                    break;
                  default:
                    break;
                }
                groupTeacherMapping[newAttribute] = itemValue;
              }
            });

            return groupTeacherMapping;
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
        newData.teacherId = item.teacherId ? item.teacherId : null;
        newData.groupId = item.groupId ? item.groupId : null;
        newData.role = item.role ? item.role : null

        this.uploadDataExcel.push({...newData})
      });

      this.loadingFile = true;
      const dataFiltered = this.uploadDataExcel;

      let res = await this.post('/group-teacher-mapping/upload-excel', {
        groupTeacherMappingCreateRequests: dataFiltered
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
          this.fetchGroupTeacherDetail();
        }, 1000);
      }
    },
    openModalUpdateRoleTeacher(groupTeacherMapping) {
      this.currentData = Object.assign({}, {
        ...groupTeacherMapping,
      });

      this.$root.$emit("bv::show::modal", 'update-role-teacher');
    },
    closeModalUpdateRoleTeacher() {
      this.currentData = Object.assign({}, {...initGroupTeacherMapping})
      this.$nextTick(() => {
        this.$v.currentData.$reset();
      });
      this.$root.$emit("bv::hide::modal", 'update-role-teacher')
    },
    async handleUpdateRoleTeacher() {
      this.$v.$reset();
      this.$v.$touch();

      if (this.$v.currentData.$invalid) return
      const payload = {
        teacherId: this.currentData.teacherId,
        groupId: this.getCurrentGroupId,
        role: this.currentData.role,
      }

      const res = await this.$store.dispatch(UPDATE_ROLE_TEACHER, payload)
      if (res && res.status === 200) {
        clearTimeout(this.handleDelay)
        this.handleDelay = setTimeout(() => {
          this.$message({
            message: 'Cập nhật thông tin thành công',
            type: "success",
            showClose: true,
          });
          this.closeModalCreateTeacherCompartment()
          this.fetchTeachers()
        }, 1000)
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

#modal-upload-group-teacher-mapping .modal-footer {
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