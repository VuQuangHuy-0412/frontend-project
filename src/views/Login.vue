<template>
  <b-form @submit="login">
    <div class="h-100 bg-animation">
      <div class="d-flex h-100 justify-content-center align-items-center">
        <div class="mx-auto app-login-box">
          <div class="h5 modal-title text-center">
            <div>
              <img
                  src="@/assets/static/images/logo-2.png"
                  alt="GHTK"
                  width="500px"
                  class="brand-img"
              />
            </div>
            <h4 class="mt-2">
              <span style="font-weight: 500">HỆ THỐNG QUẢN LÝ VÍ ĐIỆN TỬ GHTK PAY</span>
            </h4>
          </div>
          <div class="modal-dialog w-100 mx-auto">
            <div class="modal-content">
              <div class="modal-body">
                <h4 class="mt-2 text-center">
                  <span v-if="step !== 1" class="back-button" @click="back">
                    <font-awesome-icon class="back-icon" icon="arrow-left"/>
                  </span>
                  <span style="font-weight: 500">Đăng nhập</span>
                </h4>
                <div v-if="step === 1">
                  <b-form-group id="exampleInputGroup1" label-for="exampleInput1">
                    <b-form-input
                        id="exampleInput1"
                        v-model="form.username"
                        type="text"
                        required
                        placeholder="Tên đăng nhập"
                    >
                    </b-form-input>
                  </b-form-group>
                  <b-form-group id="exampleInputGroup2" label-for="exampleInput2">
                    <b-form-input
                        id="exampleInput2"
                        v-model="form.password"
                        type="password"
                        required
                        placeholder="Mật khẩu"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
                <div v-else-if="step === 2">
                  <div class="mb-4 text-center" style="text-align: justify;text-justify: inter-word;">
                    Mã OTP đã được gửi về số điện thoại đăng ký
                  </div>
                  <div class="custom-otp-css" style="display: flex; flex-direction: row; justify-content: center">
                    <v-otp-input
                      ref="otpInput"
                      input-classes="input-otp form-control"
                      separator=""
                      :num-inputs="6"
                      :is-input-num="true"
                      @on-complete="submit"
                      :should-auto-focus="true"
                    />
                  </div>
                  <div v-if="!isFinishTimerOTP && step === 2" class="text-center mt-2" style="color: #7F7F7F">Mã OTP hết hạn sau {{ durationOTP }}s</div>
                  <div v-else class="text-center mt-2" style="color: #7F7F7F">Mã OTP đã hết hạn</div>
                  <div style="padding: 25px 10px 0 10px" class="text-center">
                    Bạn chưa nhận được mã OTP?
                    <countdown @progress="handleCountdownProgress" style="color: #FF0000" v-if="!isFinishTimer && step === 2" :time="timer">
                      <template slot-scope="props">Gửi lại sau {{ props.seconds }}s</template>
                    </countdown>
                    <span v-else @click="resendOTP()" style="color: #FF0000; cursor: pointer">Gửi lại OTP</span>
                  </div>
                </div>
                <div v-else class="text-center">
                  <div style="width: 80%; margin: auto; margin-bottom: 20px">
                    {{ needRegisterSmartOtp ? 'Vui lòng sử dụng ứng dụng Authenticator để quét QRCode và nhập mã xác thực' : 'Nhập mã Smart OTP' }}
                  </div>
                  <qrcode-vue v-if="needRegisterSmartOtp" foreground="#069255" :value="dataQr.value" :size="dataQr.size" level="H" />
                  <div class="custom-otp-css mt-2" style="display: flex; flex-direction: row; justify-content: center">
                    <v-otp-input
                      ref="otpInput"
                      input-classes="input-otp form-control"
                      separator=""
                      :num-inputs="6"
                      :is-input-num="true"
                      @on-complete="submit"
                      :should-auto-focus="true"
                    />
                  </div>
                </div>
              </div>
              <div class="modal-footer clearfix justify-content-center">
                <div class="w-100">
                  <b-button
                    type="submit"
                    size="lg"
                    class="button-login"
                    block
                    style="height: 40px"
                    @click.prevent="submit"
                    :disabled="loadingButton"
                  >{{ step !== 1 ? 'Tiếp tục' : 'Đăng nhập' }}
                  </b-button>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center opacity-8 mt-3">
            Copyright &copy; GHTK {{ new Date().getFullYear() }}
          </div>
        </div>

        <div class="right-content"></div>
      </div>
    </div>
  </b-form>
</template>

<script>
import {
  getAuthenticatedUser
} from "../common/utils";
import axios from "axios";
import StorageService from "../common/storage.service";
import router from "../router/index";
import {EventBus} from "@/common/event-bus";
import Configuration from "@/configuration";
import QrcodeVue from 'qrcode.vue'
import baseMixins from "@/components/mixins/base";
import { FETCH_BANKS } from '@/store/action.type';
import { sendMessage, getGchatTokenFromIframe } from '@/common/IframeHelper';

// utility
import { mapGetters } from 'vuex'

const API_EWALLET = Configuration.value("ewalletAdminURL");

const NEW_BANKS = [
  { value: 'CHB', text: 'CHB - SHINHAN VINA BANK' },
  { value: 'CTG', text: 'CTG - Ngân hàng TMCP Công thương Việt Nam' },
]

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      loadingButton: false,
      requestId: null,
      timer: 60000,
      durationOTP: 180,
      isFinishTimer: false,
      isFinishTimerOTP: false,
      needRegisterSmartOtp: false,
      step: 1,
      dataQr: {
        value: null,
        size: 150
      },
      banks: [],
      loginFromGchat: null
    };
  },
  components: {
    QrcodeVue,
  },
  mixins: [baseMixins],
  created() {
    this.saveGchatToken()

    if (this.$router.history.current.query.token) {
      this.listenGchatEvent()

      sendMessage({type: 'content_ready', payload: {status: true}}, null)

      this.$router.push({ path: '/cs/money-not-received' })
    }
  },
  computed: {
    ...mapGetters({
      eventData: 'eventData'
    })
  },
  watch: {
    eventData: {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        if (newVal.gchat_token) {
          window.localStorage.setItem('ewallet_gchat_token', newVal.gchat_token || '')
        }
      }
    }
  },
  mounted() {
    setInterval(() => {
      if (this.step !== 2) return;

      if (this.durationOTP === 0) {
        this.isFinishTimerOTP = true;
        return;
      }
      this.durationOTP -= 1;
    }, 1000)
  },
  methods: {
    saveGchatToken() {
      StorageService.destroy('ewallet_gchat_token_test');
      let gchatToken = this.$router.currentRoute ? this.$router.currentRoute.query.token : (getGchatTokenFromIframe() ? getGchatTokenFromIframe() : null)
      if (gchatToken) {
        localStorage.setItem('ewallet_gchat_token_test', gchatToken)
        this.loginFromGchat = true
      }
    },
    listenGchatEvent() {
      let eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent'
      let eventer = window[eventMethod]
      let messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'

      eventer(messageEvent, e => {
      })
    },
    handleCountdownProgress(data) {
      if (data.seconds !== 1) return;

      setTimeout(() => {
        this.isFinishTimer = true;
      }, 1000);
    },
    back() {
      this.step = this.needRegisterSmartOtp ? this.step - 1 : this.step - 2;
      this.timer = 60000;
      this.durationOTP = 180;
      this.isFinishTimerOTP = false;
      this.isFinishTimer = false;
    },
    async resendOTP() {
      let response = await this.post(`/login/resend-sms-otp`, {
        requestId: this.requestId
      });
      if (response && response.status === 200) {
        this.$message.closeAll()
        this.$message({
          message: "Gửi lại OTP thành công.",
          type: "success",
          showClose: true,
        });
        this.isFinishTimer = false;
        this.isFinishTimerOTP = false;
        this.timer = 60000;
        this.durationOTP = 180;
      }
    },
    submit() {
      switch (this.step) {
        case 1:
          this.login()
          break;
        case 2:
          this.confirmOTP()
          break;
        default:
          this.confirmGoogleAuthenticate()
          break;
      }
    },
    fetchBanks() {
      this.$store.dispatch(FETCH_BANKS).then((res) => {
        if (res.length === 0) return
        this.banks = res.map((item) => {
          return {
            value: item.bpBankCode,
            text: `${item.bpBankCode} - ${item.name}`
          }
        })

        this.banks = [
          {value: null, text: 'Tất cả'},
          ...this.banks
        ];

        this.banks = [
          ...this.banks,
          ...NEW_BANKS
        ];

        let logoBank = Object.assign({})
        res.forEach(bank => {
          logoBank[bank.code] = {
            logo: bank.logo,
            shortName: bank.shortName,
            fullName: `${bank.bpBankCode} - ${bank.name}`
          }
          logoBank[bank.bpBankCode.trim().toLowerCase()] = {
            logo: bank.logo,
            shortName: bank.shortName,
            fullName: `${bank.bpBankCode} - ${bank.name}`
          }
        });

        let bankCodes = [
          ...res.map((item) => {
            return {
              value: item.code,
              text: `${item.bpBankCode} - ${item.name}`
            }
          }),
          ...NEW_BANKS
        ]

        StorageService.save("banks", JSON.stringify(this.banks));
        StorageService.save("bankCodes", JSON.stringify(bankCodes));
        StorageService.save("logoBank", JSON.stringify(logoBank));
      })
    },
    confirmGoogleAuthenticate() {
      if (this.$refs.otpInput.otp.length < 6) {
        this.$message.closeAll();
        this.$message({
          message: 'Vui lòng nhập đầy đủ OTP.',
          type: "warning",
          showClose: true,
        });
        return;
      }

      this.loadingButton = true;
      axios
        .post(`${API_EWALLET}/login/${this.needRegisterSmartOtp ? 'active-soft-otp' : 'verify-soft-otp'}`, {
          requestId: this.requestId,
          otp: this.$refs.otpInput.otp.join('')
        })
        .then(async (response) => {
          this.loadingButton = false;

          StorageService.save("ewallet_token", response.data.accessToken);
          StorageService.save("Token", JSON.stringify(response.data));
          this.fetchBanks();
          await getAuthenticatedUser();
          this.$message.closeAll();

          let ewalletGchatToken = localStorage.getItem('ewallet_gchat_token_test')

          if (ewalletGchatToken && this.loginFromGchat) {
            router.push("/cs/money-not-received").catch((e) => {
              this.$message({
                message: 'Đã có lỗi xảy ra',
                type: "warning",
                showClose: true,
              });
            });
            return
          }

          const savedPath = localStorage.getItem('savedPath');
          router.push(savedPath && !this.loginFromGchat && !savedPath.includes('/cs/')
            ? savedPath : "/")
          .catch((e) => {
            this.$message({
              message: 'Đã có lỗi xảy ra',
              type: "warning",
              showClose: true,
            });
          });
        })
        .catch((error) => {
          EventBus.$emit("close-progress", true);
          this.loadingButton = false;
          this.$refs.otpInput.clearInput();
          if (error.response && error.response.data) {
            this.$message({
              message: error.response.data.message,
              type: "warning",
              showClose: true,
            });
          } else {
            this.$message({
              message: "Có lỗi xảy ra",
              type: "warning",
              showClose: true,
            });
          }
        });
    },
    confirmOTP() {
      if (this.$refs.otpInput.otp.length < 6) {
        this.$message.closeAll();
        this.$message({
          message: 'Vui lòng nhập đầy đủ OTP.',
          type: "warning",
          showClose: true,
        });
        return;
      }
      this.loadingButton = true;
      axios
        .post(`${API_EWALLET}/login/enroll-soft-otp`, {
          requestId: this.requestId,
          otp: this.$refs.otpInput.otp.join('')
        })
        .then(async (res) => {
          this.loadingButton = false;
          this.dataQr.value = res.data.uri;
          this.step = 3;
        })
        .catch((error) => {
          EventBus.$emit("close-progress", true);
          this.loadingButton = false;
          this.$refs.otpInput.clearInput();
          if (error.response && error.response.data) {
            this.$message({
              message: error.response.data.message,
              type: "warning",
              showClose: true,
            });
          } else {
            this.$message({
              message: "Có lỗi xảy ra",
              type: "warning",
              showClose: true,
            });
          }
        });
    },
    login() {
      this.loadingButton = true;
      EventBus.$emit("send-progress", true);
      axios
        .post(`${API_EWALLET}/login`, this.form)
        .then(async (response) => {
          EventBus.$emit("close-progress", true);
          if (response.status === 200) {
            this.loadingButton = false;
            this.requestId = response.data.requestId;

            this.needRegisterSmartOtp = response.data.needRegistrySmartOtp;

            if (response.data.needRegistrySmartOtp) {
              this.step = 2;
              return;
            }

            this.step = 3;
          }
        })
        .catch((error) => {
          EventBus.$emit("close-progress", true);
          this.loadingButton = false;
          if (error.response && error.response.data) {
            this.$message({
              message: error.response.data.message,
              type: "warning",
              showClose: true,
            });
          } else {
            this.$message({
              message: "Có lỗi xảy ra",
              type: "warning",
              showClose: true,
            });
          }
        });
    },
  },
};
</script>


<style lang="scss" scoped>
.button-login {
  color: #fff;
  background-color: #069255;
  border-color: #069255;
}

@media only screen and (max-width: 1024px) {
  .right-content {
    display: none;
  }

  .brand-img {
    width: 400px;
  }
}

@media only screen and (max-width: 1366px) {
  .brand-img {
    width: 300px;
  }
  .modal-dialog {
    margin: 0 auto;
  }
  .app-login-box h4 {
    margin-bottom: 5px;
  }
  .input-otp {
    height: 80px;
  }
}

@media only screen and (max-width: 768px) {
  .brand-img {
    width: 100%;
  }
}

.back-button {
  position: absolute;
  top: 30px;
  left: 18px;
}

.back-icon {
  font-weight: normal;
  color: #069255;
  cursor: pointer;
}

.input-otp {
  height: 100px;
}

</style>
