<template>
  <b-modal
    @close="handleCancel"
    hide-footer
    id="update-user-mobile"
    title="Cập nhật số điện thoại"
    :no-close-on-backdrop="true"
  >
    <b-form @submit="onSubmit">
      <b-form-group>
        <div class="label-form-required">Số điện thoại</div>
        <b-input
          type="text"
          id="amount"
          v-model="$v.dataUpdate.newMobile.$model"
          placeholder="Số điện thoại"
        ></b-input>
        <div
          class="error"
          v-if="$v.dataUpdate.newMobile.$dirty && !$v.dataUpdate.newMobile.required"
        >
          Số điện thoại không được để trống.
        </div>
        <div
          class="error"
          v-if="
            $v.dataUpdate.newMobile.$dirty && !$v.dataUpdate.newMobile.isValidPhone
          "
        >
          Số điện thoại không đúng định dạng.
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
import { UPDATE_USER_MOBILE } from "@/store/action.type";
import { required } from "vuelidate/lib/validators";
import { isValidPhone } from "@/common/validate";

export default {
  name: "ModalUpdateUserMobile",
  mixins: [baseMixins],
  validations: {
    dataUpdate: {
      newMobile: {
        required,
        isValidPhone,
      },
    },
  },
  props: ["dataUpdate"],
  methods: {
    handleCancel() {
      this.$root.$emit("bv::hide::modal", "update-user-mobile");
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
        .dispatch(UPDATE_USER_MOBILE, this.dataUpdate)
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
