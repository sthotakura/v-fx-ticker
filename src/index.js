import fxTicker from "./fx-ticker.vue";

function install(Vue) {
  if (install.installed) return;

  install.installed = true;
  Vue.component("v-fx-ticker", fxTicker);
}

const plugin = {
  install,
};

let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

fxTicker.install = install;

export default fxTicker;
