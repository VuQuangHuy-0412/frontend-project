<template>
  <div class="app-container app-theme-white">
    <Progress></Progress>
    <div class="cs-wrapper">
      <div :class="[{'cs-content': csScreen.indexOf(this.$route.path) !== -1}, {'mr-20r': !isCollapse}, {'mr-5r': isCollapse}]">
        <template v-if="this.$route.path && this.$route.path.includes(this.accountantInvoiceScreen)">
          <div class="pr-3 py-3"><slot></slot></div>
        </template>
        <template v-else>
          <slot></slot>
        </template>
      </div>
      <transition name="fade" mode="out-in" appear>
        <SidebarCS :isCollapse="isCollapse" @collapse="collapse" />
      </transition>
    </div>
  </div>
</template>

<script>
import Progress from "@/components/Progress";
import SidebarCS from "../Components/SidebarCS";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faCog} from "@fortawesome/free-solid-svg-icons";

library.add(faCog);

const CS_SCREEN = ['/cs/error-active', '/cs/money-not-received', '/cs/bank-error-code', '/cs/ekyc-error-code']
const ACCOUNTANT_INVOICE_SCREEN = '/accountant/invoices'
export default {
  name: "app",
  components: {
    SidebarCS,
    Progress,
  },
  data() {
    return {
      isCollapse: false,
      csScreen: CS_SCREEN,
      accountantInvoiceScreen: ACCOUNTANT_INVOICE_SCREEN,
    };
  },
  methods: {
    collapse() {
      this.isCollapse = !this.isCollapse
    }
  },
};
</script>
