<template>
  <div>
    <page-title
        :heading="heading"
        :subheading="subheading"
        :icon="icon"
    ></page-title>
    <b-card class="main-card search-wrapper mb-20">
      <b-row>
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
          <h6>Bạn có chắc chắn muốn thực hiện phân công giảng dạy {{ inputData.numOfClasses }} lớp học cho {{ inputData.numOfTeachers }} giảng viên với các ràng buộc sau?</h6>
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
  </div>
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
import {GROUP_TEACHER_DETAIL, INPUT_DATA} from "@/store/action.type";


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
    }
  },
  watch: {},
  mounted() {
    this.fetchInputData();
  },
  computed: {
    ...mapGetters(["inputData"]),
    validation() {
    },
  },
  methods: {
    checkPermission,
    async fetchInputData() {
      await this.$store.dispatch(INPUT_DATA, null);
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
    handleTimetablingTeacher() {

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