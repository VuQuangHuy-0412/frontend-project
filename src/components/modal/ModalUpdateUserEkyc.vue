<template>
  <b-modal
    @close="handleCancel"
    hide-footer
    id="update-user-ekyc"
    title="Cập nhật thông tin cá nhân"
    :no-close-on-backdrop="true"
  >
    <b-form @submit="onSubmit">
      <b-form-group>
        <div class="label-form-required">AppCode</div>
        <multiselect
          v-model="dataUpdate.appCode"
          track-by="text"
          label="text"
          :show-labels="false"
          placeholder="Chọn"
          :options="appCodeOptions"
          :searchable="true"
        >
          <template slot="singleLabel" slot-scope="{ option }">{{
            option.text
          }}</template>
        </multiselect>
      </b-form-group>
      <b-form-group>
        <div class="label-form-required">Trạng thái eKyc</div>
        <multiselect
          v-model="dataUpdate.ekycStatus"
          track-by="value"
          label="text"
          :show-labels="false"
          placeholder="Chọn"
          :options="ekycStatusOption"
          :searchable="false"
          :allowEmpty='false'
        >
          <template slot="singleLabel" slot-scope="{ option }">{{
            option.text
          }}</template>
        </multiselect>
      </b-form-group>
      <b-form-group>
        <div class="label-form-required">Mã user</div>
        <b-input
          type="text"
          id="amount"
          v-model="dataUpdate.userId"
          placeholder="Mã user"
          disabled
        ></b-input>
      </b-form-group>
      <b-form-group>
        <div class="label-form-required">Mã ekyc</div>
        <b-input
          type="text"
          id="amount"
          v-model="dataUpdate.ekycId"
          placeholder="Mã ekyc"
          :disabled="disabledEkyc"
        ></b-input>
      </b-form-group>
      <b-form-group>
        <div class="label-form-required">Số CMT/CCCD</div>
        <b-input
          type="text"
          id="amount"
          v-model="$v.dataUpdate.idCardNo.$model"
          placeholder="Số CMT/CCCD"
        ></b-input>
        <div
          class="error"
          v-if="
            $v.dataUpdate.idCardNo.$dirty && !$v.dataUpdate.idCardNo.required
          "
        >
          Số CMT/CCCD không được để trống.
        </div>
      </b-form-group>
      <b-form-group>
        <div class="label-form-required">Tên người dùng</div>
        <b-input
          type="text"
          id="amount"
          v-model="$v.dataUpdate.fullName.$model"
          placeholder="Tên người dùng"
        ></b-input>
        <div
          class="error"
          v-if="
            $v.dataUpdate.fullName.$dirty && !$v.dataUpdate.fullName.required
          "
        >
          Tên người dùng không được để trống.
        </div>
      </b-form-group>
      <b-button
        class="mr-2 btn-light2 pull-right"
        @click="handleCancel"
      >
        Hủy
      </b-button>
      <b-button
        variant="primary pull-right"
        class="mr-2"
        type="submit"
      >
        Cập nhật
      </b-button>
    </b-form>
  </b-modal>
</template>

<script>
import baseMixins from "@/components/mixins/base";
import { UPDATE_USER_EKYC } from "@/store/action.type";
import { required } from "vuelidate/lib/validators";
import Vue from "vue";
import "vue-multiselect/dist/vue-multiselect.min.css";
import Multiselect from "vue-multiselect";
Vue.component("multiselect", Multiselect);

export default {
  name: "ModalUpdateUserEkyc",
  data() {
    return {
      dataUpdate: {
        appCode: null,
        userId: null,
        ekycId: null,
        fullName: null,
        idCardNo: null,
        ekycStatus: null
      },
      disabledEkyc: true,
      ekycStatusOption: [
        {text: 'Hoạt động', value: 1},
        {text: 'Khoá', value: 2}
      ]
    };
  },
  mixins: [baseMixins],
  validations: {
    dataUpdate: {
      fullName: {
        required,
      },
      idCardNo: {
        required,
      },
    },
  },
  props: ["ekycList"],
  watch: {
    "dataUpdate.appCode": function (val) {
      this.ekycList.forEach((e) => {
        if (e.appCode == val.value) {
          this.dataUpdate.userId = e.userId;
          this.dataUpdate.ekycId = e.ekycId;
          if (e.ekycId) {
            this.disabledEkyc = false;
          } else {
            this.disabledEkyc = true;
          }
          this.dataUpdate.idCardNo = e.idCard;
          this.dataUpdate.fullName = e.fullName;
          this.dataUpdate.ekycStatus = this.ekycStatusOption.filter(option => option.value === e.status)[0]
        }
      });
    }
  },
  computed: {
    appCodeOptions() {
      var appCodeOptions = [];
      this.ekycList.forEach((e) => {
        appCodeOptions.push({ value: e.appCode, text: e.appCode });
      });
      return appCodeOptions;
    },
  },
  methods: {
    handleCancel() {
      this.$root.$emit("bv::hide::modal", "update-user-ekyc");
      this.$v.$reset();
    },
    onSubmit(event) {
      event.preventDefault();
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$message.closeAll();
      this.$store
        .dispatch(UPDATE_USER_EKYC, {
          userId: this.dataUpdate.userId,
          ekycId: this.dataUpdate.ekycId,
          fullName: this.dataUpdate.fullName,
          idCardNo: this.dataUpdate.idCardNo,
          appCode: this.dataUpdate.appCode.value,
          ekycStatus: this.dataUpdate.ekycStatus.value
        })
        .then(() => {
          this.$message.closeAll();
          this.handleCancel();

          this.$emit("reload-user-list");

          this.$message({
            message: "Thực hiện thao tác thành công.",
            type: "success",
            showClose: true,
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
.error {
  color: #dc3545;
  font-size: 13px;
}
</style>
