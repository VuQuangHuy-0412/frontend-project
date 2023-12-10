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
        <b-col md="10" style="font-weight: 500">{{ groupTeacherDetail && groupTeacherDetail.leaderInfo && groupTeacherDetail.leaderInfo.fullName }}</b-col>
      </b-row>

      <div class="text-right">
        <b-button
            v-if="userInfo && userInfo.permissions.indexOf('add_teacher_group') !== -1"
            variant="primary"
            class="mt-4 custom-btn-add-common"
            @click="openModalUpdateMobile('original', null)"
            style="max-width: 200px"
        >
          <font-awesome-icon :icon="['fas','edit']" />
          Cập nhật số điện thoại
        </b-button>
        <b-button
            v-if="this.users && this.users[0] && this.users[0].username && userInfo && userInfo.permissions.indexOf('user_update_ekyc') !== -1"
            variant="primary"
            class="mt-4 custom-btn-add-common"
            @click="openModalUpdateEkyc"
        >
          <font-awesome-icon :icon="['fas','edit']" />
          Cập nhật ekyc
        </b-button>
        <b-button
            v-if="userInfo && userInfo.permissions.indexOf('account_create') !== -1"
            variant="primary"
            class="mt-4 custom-btn-add-common"
            @click="openModalCreateWalletCompartment"
            style="background: orange; border: none"
        >
          <font-awesome-icon :icon="['fas','plus']" />
          Thêm ngăn ví
        </b-button>
        <b-button
            v-if="checkPermission('account_create_sub_account')"
            variant="primary"
            class="mt-4 custom-btn-add-common"
            @click="openModalCreateSubWallet"
            style="background: orange; border: none; max-width: 200px !important;"
        >
          <font-awesome-icon :icon="['fas','plus']" />
          Thêm ngăn ví chi nhánh
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
        <template #cell(actions)="row" style="text-align: center">
          <a
              href="javascript:void(0)"
              class="m-2"
              type="button"
              title="Cập nhật vai trò"
              v-b-tooltip.hover
              @click.prevent="openModalUpdateMobile('sub', row.item)"
          >
            <font-awesome-icon :icon="['fas', 'edit']" />
          </a>
        </template>
      </b-table>

      <b-row v-if="groupTeacherDetail.members.length === 0" class="justify-content-center">
        <span>Không tìm thấy bản ghi nào</span>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import PageTitle from "../Layout/Components/PageTitle";
import DatePicker from "vue2-datepicker";
import {mapGetters} from "vuex";
import baseMixins from "../components/mixins/base";
import router from '@/router';
import {required} from "vuelidate/lib/validators";
import {checkPermission} from "@/common/utils";
import {GROUP_TEACHER_DETAIL} from "@/store/action.type";

export default {
  name: "GroupTeacherDetail",
  components: {
    PageTitle,
    DatePicker,
  },
  data() {
    return {
      subheading: "Chi tiết nhóm chuyên môn và danh sách giảng viên",
      icon: "pe-7s-portfolio icon-gradient bg-happy-itmeo",
      heading: "Chi tiết nhóm chuyên môn",
      userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
      fields: [
        {
          key: "key",
          label: "STT",
          tdClass: "align-middle",
          thClass: "align-middle",
          visible: true,
          thStyle: { width: "5%" }
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
  mounted() {
    this.fetchGroupTeacherDetail();
  },
  watch: {},
  computed: {
    ...mapGetters(["groupTeacherDetail"]),
    visibleFields() {
      return this.fields.filter((field) => field.visible);
    },
    validation() {
    },
    getCurrentGroupId() {
      return this.$route.params && this.$route.params.id
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
  }
}
</script>