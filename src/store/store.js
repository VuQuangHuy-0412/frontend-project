import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth.module";
import adminUser from "./adminuser.module";
import role from "../store/role.module";
import log from "./adminlog.module"
import accounts from "./account.module"
import file from "./file.module"
import event from "./event.module"

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth: auth,
    adminUser: adminUser,
    role: role,
    log: log,
    accounts,
    file,
    event,
  }
});
