<template>
  <div>
    <page-title
        :heading="heading"
        :icon="icon"
        :subheading="subheading"
    ></page-title>
    <b-card class="main-card search-wrapper mb-20">
      <b-form @submit.prevent="onSubmit">
        <b-row>
          <b-col md="3">
            <b-form-group
                class="required"
                required
            >
              <div class="label-form-required">Số tài khoản</div>
              <b-form-input
                  id="mobile"
                  v-model="$v.form.accountNo.$model"
                  placeholder="Nhập số tài khoản"
              ></b-form-input>
              <div v-if="$v.form.accountNo.$dirty && !$v.form.accountNo.required" class="error">Số tài khoản không được
                để trống
              </div>
            </b-form-group>

            <b-form-group
                required
            >
              <div class="label-form-required">Loại</div>
              <multiselect
                  v-model="actionTypeSelected"
                  :allow-empty="false"
                  :options="actionTypeOption"
                  :searchable="true"
                  :show-labels="false"
                  label="text"
                  placeholder="Chọn"
                  track-by="text"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  {{ option.text }}
                </template>
              </multiselect>
            </b-form-group>

            <b-form-group>
              <div class="label-form-required">Số tiền</div>
              <b-form-input
                  placeholder="Nhập số tiền"
                  type="number" :min="0"
                  id="amount"
                  v-model.trim="$v.form.amount.$model"
              ></b-form-input>
              <div class="error" v-if="$v.form.amount.$dirty && !$v.form.amount.required">Số tiền không được để trống</div>
              <div class="error" v-if="$v.form.amount.$dirty && !$v.form.amount.validateAmount">Số tiền phải lớn hơn 0</div>
            </b-form-group>
          </b-col>

          <b-col md="2">
            <b-button variant="primary" class="custom-btn-common" @click="checkAccountNo">
              Kiểm tra
            </b-button>
            <b-button variant="light" class="custom-btn-common" @click="reset">
              <font-awesome-icon :icon="['fas','eraser']"/>
              Reset
            </b-button>
          </b-col>
          <b-col md="7" v-if="this.accountData">
            <b-row>
              <b-col md="6" lg="3" class="mb-1">
                Số tài khoản
              </b-col>
              <b-col md="6" lg="9">
                {{ this.accountData && this.accountData.accountNo }}
              </b-col>
              <b-col md="6" lg="3" class="mb-1">
                Số dư (VNĐ)
              </b-col>
              <b-col md="6" lg="9">
                {{ this.accountData && formatPrice(this.accountData.balance) }}
              </b-col>
              <b-col md="6" lg="3" class="mb-1">
                Số tiền tạm giữ (VNĐ)
              </b-col>
              <b-col md="6" lg="9">
                {{ this.accountData && formatPrice(this.accountData.holdBalance) }}
              </b-col>
              <b-col md="6" lg="3" class="mb-1">
                Loại tài khoản
              </b-col>
              <b-col md="6" lg="9">
                <b-badge
                    class="mr-2 badge-personal"
                    v-if="this.accountData.type === 1"
                >
                  iGHTK
                </b-badge>
                <b-badge
                    class="mr-2 badge-enterprise min-width-58"
                    v-else-if="this.accountData.type === 2"
                >
                  GL
                </b-badge>
                <b-badge
                    class="mr-2 badge-init min-width-58"
                    v-else-if="this.accountData.type === 3"
                >
                  Shop
                </b-badge>
                <b-badge
                    class="mr-2 badge-provider-service min-width-58"
                    v-else-if="this.accountData.type === 4"
                >
                  Staff
                </b-badge>
                <b-badge
                    class="mr-2 badge-initialized min-width-58"
                    v-else-if="this.accountData.type === 5"
                >
                  Shipper
                </b-badge>
              </b-col>
              <b-col md="6" lg="3" class="mb-1">
                Trạng thái
              </b-col>
              <b-col md="6" lg="9">
                <b-badge
                    class="mr-2 badge-active"
                    v-if="this.accountData.status === 1"
                >
                  Hoạt động
                </b-badge>
                <b-badge
                    class="mr-2 badge-inactive"
                    v-else
                >
                  Khóa
                </b-badge>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="12" md="12" xl="12">
            <div>
              <b-button type="submit" variant="primary">
                Gửi duyệt
              </b-button>
            </div>
          </b-col>
        </b-row>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import PageTitle from "../Layout/Components/PageTitle";
import {FETCH_ACCOUNTS, SETUP_ACCOUNT} from "@/store/action.type";
import {required} from 'vuelidate/lib/validators'
import {formatPrice} from "@/common/common";

const initForm = {
  accountNo: null,
  amount: null,
  type: null
}

export default {
  name: "SetupAccount",
  components: {PageTitle},
  data() {
    return {
      subheading: "Điều chỉnh số dư ngăn ví của người dùng",
      icon: "pe-7s-portfolio icon-gradient bg-happy-itmeo",
      heading: "Điều chỉnh số dư",
      actionTypeOption: [
        {value: 'DEPOSIT', text: 'Nạp tiền'},
        {value: 'WITHDRAWAL', text: 'Rút tiền'},
      ],
      form: JSON.parse(JSON.stringify(initForm)),
      actionTypeSelected: {value: 'DEPOSIT', text: 'Nạp tiền'},
      accountData: null,
    }
  },
  validations() {
    return {
      form: {
        accountNo: {
          required
        },
        amount: {
          required,
          validateAmount() {
            return this.form.amount > 0
          }
        }
      },
      actionTypeSelected: {
        required
      }
    }
  },
  methods: {
    formatPrice(n, separate = ",") {
      return formatPrice(n, separate);
    },
    reset() {
      this.accountData = null;
      this.form.accountNo = null;
    },
    checkAccountNo() {
      if (!this.form.accountNo || this.form.accountNo === '') {
        this.$message.closeAll()
        this.$message({
          message: "Vui lòng nhập Số tài khoản",
          type: "error",
          showClose: true,
        });
        this.accountData = null;
        return;
      }

      this.$store.dispatch(FETCH_ACCOUNTS, {
        accountNo: this.form.accountNo
      }).then((res) => {
        if (res.length === 0) {
          this.$message.closeAll()
          this.$message({
            message: "Không tồn tại số tài khoản",
            type: "error",
            showClose: true,
          });

          this.accountData = null
          return
        }

        this.accountData = res[0]
      })
    },
    setupAccount() {
      this.form.type = this.actionTypeSelected.value

      this.$store.dispatch(SETUP_ACCOUNT, this.form)
          .then(() => {
            this.$message.closeAll()
            this.$message({
              message: "Gửi duyệt điều chỉnh số dư thành công.",
              type: "success",
              showClose: true,
            });

            this.$v.$reset();

            this.form.accountNo = null
            this.form.amount = null
            this.form.type = null
            this.actionTypeSelected = {value: 'DEPOSIT', text: 'Nạp tiền'}
          })
          .catch((err) => {
            console.log(err)
          })
    },
    onSubmit() {
      this.$message.closeAll()

      this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }

      this.setupAccount()
    }
  }
}
</script>

<style scoped>
.error {
  color: #dc3545;
  font-size: 13px;
}
</style>
