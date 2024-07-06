import { reactive, hasInjectionContext, getCurrentInstance, toRef, isRef, inject, nextTick, shallowRef, shallowReactive, isReadonly, effectScope, ref, markRaw, watch, isReactive, toRaw, computed, getCurrentScope, onScopeDispose, unref, toRefs, version, watchEffect, onServerPrefetch, defineComponent, h, resolveComponent, isShallow, onUnmounted, Fragment, createVNode, Text, readonly, onMounted, mergeProps, openBlock, createElementBlock, renderSlot, createTextVNode, toDisplayString as toDisplayString$1, createElementVNode, resolveDirective, withDirectives, normalizeClass, createBlock, createCommentVNode, useSSRContext, Suspense, Transition, provide, withCtx, defineAsyncComponent, onErrorCaptured, resolveDynamicComponent, createApp, withAsyncContext } from "vue";
import { $fetch } from "ofetch";
import { useRuntimeConfig as useRuntimeConfig$1 } from "#internal/nitro";
import { getContext, executeAsync } from "unctx";
import { createMemoryHistory, createRouter, START_LOCATION, useRoute as useRoute$1, RouterView } from "vue-router";
import { sanitizeStatusCode, createError as createError$1, setCookie, getCookie, deleteCookie } from "h3";
import { createHooks } from "hookable";
import destr from "destr";
import "devalue";
import "klona";
import { renderSSRHead } from "@unhead/ssr";
import VueCookies from "vue-cookies";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrRenderSlot } from "vue/server-renderer";
import { defu } from "defu";
import { Icon } from "@iconify/vue";
import { hash, isEqual } from "ohash";
import { CompileErrorCodes, createCompileError } from "@intlify/message-compiler";
import { VueDevToolsLabels, VueDevToolsPlaceholders, VueDevToolsTimelineColors } from "@intlify/vue-devtools";
import { parse as parse$1 } from "cookie-es";
import { withQuery, hasProtocol, parseURL, joinURL, parseQuery, withTrailingSlash, withoutTrailingSlash } from "ufo";
import { getActiveHead, createServerHead as createServerHead$1, composableNames } from "unhead";
import { defineHeadPlugin } from "@unhead/shared";
const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const nuxtAppCtx = /* @__PURE__ */ getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.6.5";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    runWithContext: (fn) => callWithNuxt(nuxtApp, fn),
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    _payloadRevivers: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    async function contextCaller(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    }
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
      nuxtApp.ssrContext._payloadReducers = {};
      nuxtApp.payload.path = nuxtApp.ssrContext.url;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
  if (typeof plugin2 === "function") {
    const { provide: provide4 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide4 && typeof provide4 === "object") {
      for (const key in provide4) {
        nuxtApp.provide(key, provide4[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const parallels = [];
  const errors = [];
  for (const plugin2 of plugins2) {
    const promise = applyPlugin(nuxtApp, plugin2);
    if (plugin2.parallel) {
      parallels.push(promise.catch((e) => errors.push(e)));
    } else {
      await promise;
    }
  }
  await Promise.all(parallels);
  if (errors.length) {
    throw errors[0];
  }
}
/*! @__NO_SIDE_EFFECTS__ */
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
/*! @__NO_SIDE_EFFECTS__ */
function useNuxtApp() {
  var _a;
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = (_a = getCurrentInstance()) == null ? void 0 : _a.appContext.app.$nuxt;
  }
  nuxtAppInstance = nuxtAppInstance || nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
/*! @__NO_SIDE_EFFECTS__ */
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxt = useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
/*! @__NO_SIDE_EFFECTS__ */
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : withQuery(to.path || "/", to.query || {}) + (to.hash || "");
  if (options == null ? void 0 : options.open) {
    return Promise.resolve();
  }
  const isExternal = (options == null ? void 0 : options.external) || hasProtocol(toPath, { acceptRelative: true });
  if (isExternal && !(options == null ? void 0 : options.external)) {
    throw new Error("Navigating to external URL is not allowed by default. Use `navigateTo (url, { external: true })`.");
  }
  if (isExternal && parseURL(toPath).protocol === "script:") {
    throw new Error("Cannot navigate to an URL with script protocol.");
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL(useRuntimeConfig().app.baseURL, fullPath);
      async function redirect(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(/"/g, "%22");
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode((options == null ? void 0 : options.redirectCode) || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: location2 }
        };
        return response;
      }
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    if (options == null ? void 0 : options.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return (options == null ? void 0 : options.replace) ? router.replace(to) : router.push(to);
};
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = useNuxtApp();
    const error = useError();
    if (false)
      ;
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const isNuxtError = (err) => !!(err && typeof err === "object" && "__nuxt_error" in err);
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
const _routes = [
  {
    name: "404",
    path: "/404",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => Promise.resolve().then(function() {
      return _404;
    }).then((m) => m.default || m)
  },
  {
    name: "GithubRepo",
    path: "/GithubRepo",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => Promise.resolve().then(function() {
      return GithubRepo$1;
    }).then((m) => m.default || m)
  },
  {
    name: "contact",
    path: "/contact",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => Promise.resolve().then(function() {
      return contact;
    }).then((m) => m.default || m)
  },
  {
    name: "index",
    path: "/",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => Promise.resolve().then(function() {
      return index$1;
    }).then((m) => m.default || m)
  },
  {
    name: "plog",
    path: "/plog",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => Promise.resolve().then(function() {
      return index2;
    }).then((m) => m.default || m)
  },
  {
    name: "portfolio",
    path: "/portfolio",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => Promise.resolve().then(function() {
      return portfolio;
    }).then((m) => m.default || m)
  },
  {
    name: "resume",
    path: "/resume",
    meta: {},
    alias: [],
    redirect: void 0,
    component: () => Promise.resolve().then(function() {
      return resume;
    }).then((m) => m.default || m)
  }
];
const appHead = { "meta": [{ "name": "viewport", "content": "width=device-width, initial-scale=1" }, { "charset": "utf-8" }], "link": [], "style": [], "script": [], "noscript": [] };
const appLayoutTransition = false;
const appPageTransition = false;
const appKeepalive = false;
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    let position = savedPosition || void 0;
    if (!position && from && to && to.meta.scrollToTop !== false && _isDifferentRoute(from, to)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
      }
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await nextTick();
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = document.querySelector(selector);
    if (elem) {
      return parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
function _isDifferentRoute(from, to) {
  const samePageComponent = to.matched.every((comp, index3) => {
    var _a, _b, _c;
    return ((_a = comp.components) == null ? void 0 : _a.default) === ((_c = (_b = from.matched[index3]) == null ? void 0 : _b.components) == null ? void 0 : _c.default);
  });
  if (!samePageComponent) {
    return true;
  }
  if (samePageComponent && JSON.stringify(from.params) !== JSON.stringify(to.params)) {
    return true;
  }
  return false;
}
const configRouterOptions = {};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  useRouter();
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  {
    return result;
  }
});
const globalMiddleware = [
  validate
];
const namedMiddleware = {};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    var _a, _b;
    let __temp, __restore;
    let routerBase = useRuntimeConfig().app.baseURL;
    if (routerOptions.hashMode && !routerBase.includes("#")) {
      routerBase += "#";
    }
    const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
    const routes = ((_b = routerOptions.routes) == null ? void 0 : _b.call(routerOptions, _routes)) ?? _routes;
    let startPosition;
    const initialURL = nuxtApp.ssrContext.url;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        var _a2;
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
        return (_a2 = routerOptions.scrollBehavior) == null ? void 0 : _a2.call(routerOptions, to, START_LOCATION, startPosition || savedPosition);
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const _route = shallowRef(router.resolve(initialURL));
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      var _a2, _b2, _c, _d;
      if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c = from.matched[0]) == null ? void 0 : _c.components) == null ? void 0 : _d.default)) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key]
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware = nuxtApp._middleware || {
      global: [],
      named: {}
    };
    useError();
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const initialLayout = useState("_layout");
    router.beforeEach(async (to, from) => {
      var _a2, _b2;
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout.value && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout.value;
      }
      nuxtApp._processingMiddleware = true;
      if (!((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          if (Array.isArray(componentMiddleware)) {
            for (const entry2 of componentMiddleware) {
              middlewareEntries.add(entry2);
            }
          } else {
            middlewareEntries.add(componentMiddleware);
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_b2 = namedMiddleware[entry2]) == null ? void 0 : _b2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          const result = await nuxtApp.runWithContext(() => middleware(to, from));
          {
            if (result === false || result instanceof Error) {
              const error2 = result || createError$1({
                statusCode: 404,
                statusMessage: `Page Not Found: ${initialURL}`
              });
              await nuxtApp.runWithContext(() => showError(error2));
              return false;
            }
          }
          if (result || result === false) {
            return result;
          }
        }
      }
    });
    router.onError(() => {
      delete nuxtApp._processingMiddleware;
    });
    router.afterEach(async (to, _from, failure) => {
      var _a2;
      delete nuxtApp._processingMiddleware;
      if ((failure == null ? void 0 : failure.type) === 4) {
        return;
      }
      if (to.matched.length === 0 && !((_a2 = nuxtApp.ssrContext) == null ? void 0 : _a2.islandContext)) {
        await nuxtApp.runWithContext(() => showError(createError$1({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`
        })));
      } else if (to.redirectedFrom && to.fullPath !== initialURL) {
        await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        await router.replace({
          ...router.resolve(initialURL),
          name: void 0,
          // #4920, #4982
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function set(target, key, val) {
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  target[key] = val;
  return val;
}
function del(target, key) {
  if (Array.isArray(target)) {
    target.splice(key, 1);
    return;
  }
  delete target[key];
}
const isVue2 = false;
function getDevtoolsGlobalHook() {
  return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function getTarget() {
  return typeof global !== "undefined" ? global : {};
}
const isProxyAvailable = typeof Proxy === "function";
const HOOK_SETUP = "devtools-plugin:setup";
const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
let supported;
let perf;
function isPerformanceSupported() {
  var _a;
  if (supported !== void 0) {
    return supported;
  }
  if (typeof global !== "undefined" && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
    supported = true;
    perf = global.perf_hooks.performance;
  } else {
    supported = false;
  }
  return supported;
}
function now() {
  return isPerformanceSupported() ? perf.now() : Date.now();
}
class ApiProxy {
  constructor(plugin2, hook) {
    this.target = null;
    this.targetQueue = [];
    this.onQueue = [];
    this.plugin = plugin2;
    this.hook = hook;
    const defaultSettings = {};
    if (plugin2.settings) {
      for (const id in plugin2.settings) {
        const item = plugin2.settings[id];
        defaultSettings[id] = item.defaultValue;
      }
    }
    const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin2.id}`;
    let currentSettings = Object.assign({}, defaultSettings);
    try {
      const raw = localStorage.getItem(localSettingsSaveId);
      const data = JSON.parse(raw);
      Object.assign(currentSettings, data);
    } catch (e) {
    }
    this.fallbacks = {
      getSettings() {
        return currentSettings;
      },
      setSettings(value) {
        try {
          localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
        } catch (e) {
        }
        currentSettings = value;
      },
      now() {
        return now();
      }
    };
    if (hook) {
      hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
        if (pluginId === this.plugin.id) {
          this.fallbacks.setSettings(value);
        }
      });
    }
    this.proxiedOn = new Proxy({}, {
      get: (_target, prop) => {
        if (this.target) {
          return this.target.on[prop];
        } else {
          return (...args) => {
            this.onQueue.push({
              method: prop,
              args
            });
          };
        }
      }
    });
    this.proxiedTarget = new Proxy({}, {
      get: (_target, prop) => {
        if (this.target) {
          return this.target[prop];
        } else if (prop === "on") {
          return this.proxiedOn;
        } else if (Object.keys(this.fallbacks).includes(prop)) {
          return (...args) => {
            this.targetQueue.push({
              method: prop,
              args,
              resolve: () => {
              }
            });
            return this.fallbacks[prop](...args);
          };
        } else {
          return (...args) => {
            return new Promise((resolve) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve
              });
            });
          };
        }
      }
    });
  }
  async setRealTarget(target) {
    this.target = target;
    for (const item of this.onQueue) {
      this.target.on[item.method](...item.args);
    }
    for (const item of this.targetQueue) {
      item.resolve(await this.target[item.method](...item.args));
    }
  }
}
function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
  const descriptor = pluginDescriptor;
  const target = getTarget();
  const hook = getDevtoolsGlobalHook();
  const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
  if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
    hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
  } else {
    const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
    const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
    list.push({
      pluginDescriptor: descriptor,
      setupFn,
      proxy
    });
    if (proxy)
      setupFn(proxy.proxiedTarget);
  }
}
/*!
  * pinia v2.1.4
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = process.env.NODE_ENV !== "production" ? Symbol("pinia") : (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject$1(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
const IS_CLIENT = false;
const USE_DEVTOOLS = (process.env.NODE_ENV !== "production" || false) && !(process.env.NODE_ENV === "test") && IS_CLIENT;
const saveAs = () => {
};
function toastMessage(message, type) {
  const piniaMessage = "🍍 " + message;
  if (typeof __VUE_DEVTOOLS_TOAST__ === "function") {
    __VUE_DEVTOOLS_TOAST__(piniaMessage, type);
  } else if (type === "error") {
    console.error(piniaMessage);
  } else if (type === "warn") {
    console.warn(piniaMessage);
  } else {
    console.log(piniaMessage);
  }
}
function isPinia(o) {
  return "_a" in o && "install" in o;
}
function checkClipboardAccess() {
  if (!("clipboard" in navigator)) {
    toastMessage(`Your browser doesn't support the Clipboard API`, "error");
    return true;
  }
}
function checkNotFocusedError(error) {
  if (error instanceof Error && error.message.toLowerCase().includes("document is not focused")) {
    toastMessage('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn");
    return true;
  }
  return false;
}
async function actionGlobalCopyState(pinia) {
  if (checkClipboardAccess())
    return;
  try {
    await navigator.clipboard.writeText(JSON.stringify(pinia.state.value));
    toastMessage("Global state copied to clipboard.");
  } catch (error) {
    if (checkNotFocusedError(error))
      return;
    toastMessage(`Failed to serialize the state. Check the console for more details.`, "error");
    console.error(error);
  }
}
async function actionGlobalPasteState(pinia) {
  if (checkClipboardAccess())
    return;
  try {
    pinia.state.value = JSON.parse(await navigator.clipboard.readText());
    toastMessage("Global state pasted from clipboard.");
  } catch (error) {
    if (checkNotFocusedError(error))
      return;
    toastMessage(`Failed to deserialize the state from clipboard. Check the console for more details.`, "error");
    console.error(error);
  }
}
async function actionGlobalSaveState(pinia) {
  try {
    saveAs(new Blob([JSON.stringify(pinia.state.value)], {
      type: "text/plain;charset=utf-8"
    }), "pinia-state.json");
  } catch (error) {
    toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
    console.error(error);
  }
}
let fileInput;
function getFileOpener() {
  if (!fileInput) {
    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
  }
  function openFile() {
    return new Promise((resolve, reject) => {
      fileInput.onchange = async () => {
        const files = fileInput.files;
        if (!files)
          return resolve(null);
        const file = files.item(0);
        if (!file)
          return resolve(null);
        return resolve({ text: await file.text(), file });
      };
      fileInput.oncancel = () => resolve(null);
      fileInput.onerror = reject;
      fileInput.click();
    });
  }
  return openFile;
}
async function actionGlobalOpenStateFile(pinia) {
  try {
    const open = await getFileOpener();
    const result = await open();
    if (!result)
      return;
    const { text, file } = result;
    pinia.state.value = JSON.parse(text);
    toastMessage(`Global state imported from "${file.name}".`);
  } catch (error) {
    toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
    console.error(error);
  }
}
function formatDisplay(display) {
  return {
    _custom: {
      display
    }
  };
}
const PINIA_ROOT_LABEL = "🍍 Pinia (root)";
const PINIA_ROOT_ID = "_root";
function formatStoreForInspectorTree(store) {
  return isPinia(store) ? {
    id: PINIA_ROOT_ID,
    label: PINIA_ROOT_LABEL
  } : {
    id: store.$id,
    label: store.$id
  };
}
function formatStoreForInspectorState(store) {
  if (isPinia(store)) {
    const storeNames = Array.from(store._s.keys());
    const storeMap = store._s;
    const state2 = {
      state: storeNames.map((storeId) => ({
        editable: true,
        key: storeId,
        value: store.state.value[storeId]
      })),
      getters: storeNames.filter((id) => storeMap.get(id)._getters).map((id) => {
        const store2 = storeMap.get(id);
        return {
          editable: false,
          key: id,
          value: store2._getters.reduce((getters, key) => {
            getters[key] = store2[key];
            return getters;
          }, {})
        };
      })
    };
    return state2;
  }
  const state = {
    state: Object.keys(store.$state).map((key) => ({
      editable: true,
      key,
      value: store.$state[key]
    }))
  };
  if (store._getters && store._getters.length) {
    state.getters = store._getters.map((getterName) => ({
      editable: false,
      key: getterName,
      value: store[getterName]
    }));
  }
  if (store._customProperties.size) {
    state.customProperties = Array.from(store._customProperties).map((key) => ({
      editable: true,
      key,
      value: store[key]
    }));
  }
  return state;
}
function formatEventData(events) {
  if (!events)
    return {};
  if (Array.isArray(events)) {
    return events.reduce((data, event) => {
      data.keys.push(event.key);
      data.operations.push(event.type);
      data.oldValue[event.key] = event.oldValue;
      data.newValue[event.key] = event.newValue;
      return data;
    }, {
      oldValue: {},
      keys: [],
      operations: [],
      newValue: {}
    });
  } else {
    return {
      operation: formatDisplay(events.type),
      key: formatDisplay(events.key),
      oldValue: events.oldValue,
      newValue: events.newValue
    };
  }
}
function formatMutationType(type) {
  switch (type) {
    case MutationType.direct:
      return "mutation";
    case MutationType.patchFunction:
      return "$patch";
    case MutationType.patchObject:
      return "$patch";
    default:
      return "unknown";
  }
}
let isTimelineActive = true;
const componentStateTypes = [];
const MUTATIONS_LAYER_ID = "pinia:mutations";
const INSPECTOR_ID = "pinia";
const { assign: assign$1 } = Object;
const getStoreType = (id) => "🍍 " + id;
function registerPiniaDevtools(app, pinia) {
  setupDevtoolsPlugin({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes,
    app
  }, (api) => {
    if (typeof api.now !== "function") {
      toastMessage("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.");
    }
    api.addTimelineLayer({
      id: MUTATIONS_LAYER_ID,
      label: `Pinia 🍍`,
      color: 15064968
    });
    api.addInspector({
      id: INSPECTOR_ID,
      label: "Pinia 🍍",
      icon: "storage",
      treeFilterPlaceholder: "Search stores",
      actions: [
        {
          icon: "content_copy",
          action: () => {
            actionGlobalCopyState(pinia);
          },
          tooltip: "Serialize and copy the state"
        },
        {
          icon: "content_paste",
          action: async () => {
            await actionGlobalPasteState(pinia);
            api.sendInspectorTree(INSPECTOR_ID);
            api.sendInspectorState(INSPECTOR_ID);
          },
          tooltip: "Replace the state with the content of your clipboard"
        },
        {
          icon: "save",
          action: () => {
            actionGlobalSaveState(pinia);
          },
          tooltip: "Save the state as a JSON file"
        },
        {
          icon: "folder_open",
          action: async () => {
            await actionGlobalOpenStateFile(pinia);
            api.sendInspectorTree(INSPECTOR_ID);
            api.sendInspectorState(INSPECTOR_ID);
          },
          tooltip: "Import the state from a JSON file"
        }
      ],
      nodeActions: [
        {
          icon: "restore",
          tooltip: 'Reset the state (with "$reset")',
          action: (nodeId) => {
            const store = pinia._s.get(nodeId);
            if (!store) {
              toastMessage(`Cannot reset "${nodeId}" store because it wasn't found.`, "warn");
            } else if (typeof store.$reset !== "function") {
              toastMessage(`Cannot reset "${nodeId}" store because it doesn't have a "$reset" method implemented.`, "warn");
            } else {
              store.$reset();
              toastMessage(`Store "${nodeId}" reset.`);
            }
          }
        }
      ]
    });
    api.on.inspectComponent((payload, ctx) => {
      const proxy = payload.componentInstance && payload.componentInstance.proxy;
      if (proxy && proxy._pStores) {
        const piniaStores = payload.componentInstance.proxy._pStores;
        Object.values(piniaStores).forEach((store) => {
          payload.instanceData.state.push({
            type: getStoreType(store.$id),
            key: "state",
            editable: true,
            value: store._isOptionsAPI ? {
              _custom: {
                value: toRaw(store.$state),
                actions: [
                  {
                    icon: "restore",
                    tooltip: "Reset the state of this store",
                    action: () => store.$reset()
                  }
                ]
              }
            } : (
              // NOTE: workaround to unwrap transferred refs
              Object.keys(store.$state).reduce((state, key) => {
                state[key] = store.$state[key];
                return state;
              }, {})
            )
          });
          if (store._getters && store._getters.length) {
            payload.instanceData.state.push({
              type: getStoreType(store.$id),
              key: "getters",
              editable: false,
              value: store._getters.reduce((getters, key) => {
                try {
                  getters[key] = store[key];
                } catch (error) {
                  getters[key] = error;
                }
                return getters;
              }, {})
            });
          }
        });
      }
    });
    api.on.getInspectorTree((payload) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        let stores = [pinia];
        stores = stores.concat(Array.from(pinia._s.values()));
        payload.rootNodes = (payload.filter ? stores.filter((store) => "$id" in store ? store.$id.toLowerCase().includes(payload.filter.toLowerCase()) : PINIA_ROOT_LABEL.toLowerCase().includes(payload.filter.toLowerCase())) : stores).map(formatStoreForInspectorTree);
      }
    });
    api.on.getInspectorState((payload) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
        if (!inspectedStore) {
          return;
        }
        if (inspectedStore) {
          payload.state = formatStoreForInspectorState(inspectedStore);
        }
      }
    });
    api.on.editInspectorState((payload, ctx) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
        if (!inspectedStore) {
          return toastMessage(`store "${payload.nodeId}" not found`, "error");
        }
        const { path } = payload;
        if (!isPinia(inspectedStore)) {
          if (path.length !== 1 || !inspectedStore._customProperties.has(path[0]) || path[0] in inspectedStore.$state) {
            path.unshift("$state");
          }
        } else {
          path.unshift("state");
        }
        isTimelineActive = false;
        payload.set(inspectedStore, path, payload.state.value);
        isTimelineActive = true;
      }
    });
    api.on.editComponentState((payload) => {
      if (payload.type.startsWith("🍍")) {
        const storeId = payload.type.replace(/^🍍\s*/, "");
        const store = pinia._s.get(storeId);
        if (!store) {
          return toastMessage(`store "${storeId}" not found`, "error");
        }
        const { path } = payload;
        if (path[0] !== "state") {
          return toastMessage(`Invalid path for store "${storeId}":
${path}
Only state can be modified.`);
        }
        path[0] = "$state";
        isTimelineActive = false;
        payload.set(store, path, payload.state.value);
        isTimelineActive = true;
      }
    });
  });
}
function addStoreToDevtools(app, store) {
  if (!componentStateTypes.includes(getStoreType(store.$id))) {
    componentStateTypes.push(getStoreType(store.$id));
  }
  setupDevtoolsPlugin({
    id: "dev.esm.pinia",
    label: "Pinia 🍍",
    logo: "https://pinia.vuejs.org/logo.svg",
    packageName: "pinia",
    homepage: "https://pinia.vuejs.org",
    componentStateTypes,
    app,
    settings: {
      logStoreChanges: {
        label: "Notify about new/deleted stores",
        type: "boolean",
        defaultValue: true
      }
      // useEmojis: {
      //   label: 'Use emojis in messages ⚡️',
      //   type: 'boolean',
      //   defaultValue: true,
      // },
    }
  }, (api) => {
    const now2 = typeof api.now === "function" ? api.now.bind(api) : Date.now;
    store.$onAction(({ after, onError, name, args }) => {
      const groupId = runningActionId++;
      api.addTimelineEvent({
        layerId: MUTATIONS_LAYER_ID,
        event: {
          time: now2(),
          title: "🛫 " + name,
          subtitle: "start",
          data: {
            store: formatDisplay(store.$id),
            action: formatDisplay(name),
            args
          },
          groupId
        }
      });
      after((result) => {
        activeAction = void 0;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🛬 " + name,
            subtitle: "end",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name),
              args,
              result
            },
            groupId
          }
        });
      });
      onError((error) => {
        activeAction = void 0;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            logType: "error",
            title: "💥 " + name,
            subtitle: "end",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name),
              args,
              error
            },
            groupId
          }
        });
      });
    }, true);
    store._customProperties.forEach((name) => {
      watch(() => unref(store[name]), (newValue, oldValue) => {
        api.notifyComponentUpdate();
        api.sendInspectorState(INSPECTOR_ID);
        if (isTimelineActive) {
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              title: "Change",
              subtitle: name,
              data: {
                newValue,
                oldValue
              },
              groupId: activeAction
            }
          });
        }
      }, { deep: true });
    });
    store.$subscribe(({ events, type }, state) => {
      api.notifyComponentUpdate();
      api.sendInspectorState(INSPECTOR_ID);
      if (!isTimelineActive)
        return;
      const eventData = {
        time: now2(),
        title: formatMutationType(type),
        data: assign$1({ store: formatDisplay(store.$id) }, formatEventData(events)),
        groupId: activeAction
      };
      if (type === MutationType.patchFunction) {
        eventData.subtitle = "⤵️";
      } else if (type === MutationType.patchObject) {
        eventData.subtitle = "🧩";
      } else if (events && !Array.isArray(events)) {
        eventData.subtitle = events.type;
      }
      if (events) {
        eventData.data["rawEvent(s)"] = {
          _custom: {
            display: "DebuggerEvent",
            type: "object",
            tooltip: "raw DebuggerEvent[]",
            value: events
          }
        };
      }
      api.addTimelineEvent({
        layerId: MUTATIONS_LAYER_ID,
        event: eventData
      });
    }, { detached: true, flush: "sync" });
    const hotUpdate = store._hotUpdate;
    store._hotUpdate = markRaw((newStore) => {
      hotUpdate(newStore);
      api.addTimelineEvent({
        layerId: MUTATIONS_LAYER_ID,
        event: {
          time: now2(),
          title: "🔥 " + store.$id,
          subtitle: "HMR update",
          data: {
            store: formatDisplay(store.$id),
            info: formatDisplay(`HMR update`)
          }
        }
      });
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
    });
    const { $dispose } = store;
    store.$dispose = () => {
      $dispose();
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
      api.getSettings().logStoreChanges && toastMessage(`Disposed "${store.$id}" store 🗑`);
    };
    api.notifyComponentUpdate();
    api.sendInspectorTree(INSPECTOR_ID);
    api.sendInspectorState(INSPECTOR_ID);
    api.getSettings().logStoreChanges && toastMessage(`"${store.$id}" store installed 🆕`);
  });
}
let runningActionId = 0;
let activeAction;
function patchActionForGrouping(store, actionNames, wrapWithProxy) {
  const actions = actionNames.reduce((storeActions, actionName) => {
    storeActions[actionName] = toRaw(store)[actionName];
    return storeActions;
  }, {});
  for (const actionName in actions) {
    store[actionName] = function() {
      const _actionId = runningActionId;
      const trackedStore = wrapWithProxy ? new Proxy(store, {
        get(...args) {
          activeAction = _actionId;
          return Reflect.get(...args);
        },
        set(...args) {
          activeAction = _actionId;
          return Reflect.set(...args);
        }
      }) : store;
      activeAction = _actionId;
      const retValue = actions[actionName].apply(trackedStore, arguments);
      activeAction = void 0;
      return retValue;
    };
  }
}
function devtoolsPlugin({ app, store, options }) {
  if (store.$id.startsWith("__hot:")) {
    return;
  }
  store._isOptionsAPI = !!options.state;
  patchActionForGrouping(store, Object.keys(options.actions), store._isOptionsAPI);
  const originalHotUpdate = store._hotUpdate;
  toRaw(store)._hotUpdate = function(newStore) {
    originalHotUpdate.apply(this, arguments);
    patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions), !!store._isOptionsAPI);
  };
  addStoreToDevtools(
    app,
    // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
    store
  );
}
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app) {
      setActivePinia(pinia);
      {
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        if (USE_DEVTOOLS) {
          registerPiniaDevtools(app, pinia);
        }
        toBeInstalled.forEach((plugin2) => _p.push(plugin2));
        toBeInstalled = [];
      }
    },
    use(plugin2) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin2);
      } else {
        _p.push(plugin2);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  if (USE_DEVTOOLS && typeof Proxy !== "undefined") {
    pinia.use(devtoolsPlugin);
  }
  return pinia;
}
function patchObject(newState, oldState) {
  for (const key in oldState) {
    const subPatch = oldState[key];
    if (!(key in newState)) {
      continue;
    }
    const targetValue = newState[key];
    if (isPlainObject$1(targetValue) && isPlainObject$1(subPatch) && !isRef(subPatch) && !isReactive(subPatch)) {
      newState[key] = patchObject(targetValue, subPatch);
    } else {
      {
        newState[key] = subPatch;
      }
    }
  }
  return newState;
}
const noop = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  }
  if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject$1(targetValue) && isPlainObject$1(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = process.env.NODE_ENV !== "production" ? Symbol("pinia:skipHydration") : (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject$1(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign: assign$2 } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && (!(process.env.NODE_ENV !== "production") || !hot)) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = process.env.NODE_ENV !== "production" && hot ? (
      // use ref() to unwrap refs inside state TODO: check if this is still necessary
      toRefs(ref(state ? state() : {}).value)
    ) : toRefs(pinia.state.value[id]);
    return assign$2(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      if (process.env.NODE_ENV !== "production" && name in localState) {
        console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`);
      }
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign$2({ actions: {} }, options);
  if (process.env.NODE_ENV !== "production" && !pinia._e.active) {
    throw new Error("Pinia destroyed");
  }
  const $subscribeOptions = {
    deep: true
    // flush: 'post',
  };
  if (process.env.NODE_ENV !== "production" && !isVue2) {
    $subscribeOptions.onTrigger = (event) => {
      if (isListening) {
        debuggerEvents = event;
      } else if (isListening == false && !store._hotUpdating) {
        if (Array.isArray(debuggerEvents)) {
          debuggerEvents.push(event);
        } else {
          console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.");
        }
      }
    };
  }
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && (!(process.env.NODE_ENV !== "production") || !hot)) {
    {
      pinia.state.value[$id] = {};
    }
  }
  const hotState = ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (process.env.NODE_ENV !== "production") {
      debuggerEvents = [];
    }
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign$2($state, newState);
    });
  } : (
    /* istanbul ignore next */
    process.env.NODE_ENV !== "production" ? () => {
      throw new Error(`🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
    } : noop
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  function wrapAction(name, action) {
    return function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name,
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = action.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
  }
  const _hmrPayload = /* @__PURE__ */ markRaw({
    actions: {},
    getters: {},
    state: [],
    hotState
  });
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign$2({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(process.env.NODE_ENV !== "production" || USE_DEVTOOLS ? assign$2(
    {
      _hmrPayload,
      _customProperties: markRaw(/* @__PURE__ */ new Set())
      // devtools custom properties
    },
    partialStore
    // must be added later
    // setupStore
  ) : partialStore);
  pinia._s.set($id, store);
  const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return runWithContext(() => scope.run(setup));
  });
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (process.env.NODE_ENV !== "production" && hot) {
        set(hotState.value, key, toRef(setupStore, key));
      } else if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
      if (process.env.NODE_ENV !== "production") {
        _hmrPayload.state.push(key);
      }
    } else if (typeof prop === "function") {
      const actionValue = process.env.NODE_ENV !== "production" && hot ? prop : wrapAction(key, prop);
      {
        setupStore[key] = actionValue;
      }
      if (process.env.NODE_ENV !== "production") {
        _hmrPayload.actions[key] = prop;
      }
      optionsForPlugin.actions[key] = prop;
    } else if (process.env.NODE_ENV !== "production") {
      if (isComputed(prop)) {
        _hmrPayload.getters[key] = isOptionsStore ? (
          // @ts-expect-error
          options.getters[key]
        ) : prop;
      }
    }
  }
  {
    assign$2(store, setupStore);
    assign$2(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => process.env.NODE_ENV !== "production" && hot ? hotState.value : pinia.state.value[$id],
    set: (state) => {
      if (process.env.NODE_ENV !== "production" && hot) {
        throw new Error("cannot set hotState");
      }
      $patch(($state) => {
        assign$2($state, state);
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    store._hotUpdate = markRaw((newStore) => {
      store._hotUpdating = true;
      newStore._hmrPayload.state.forEach((stateKey) => {
        if (stateKey in store.$state) {
          const newStateTarget = newStore.$state[stateKey];
          const oldStateSource = store.$state[stateKey];
          if (typeof newStateTarget === "object" && isPlainObject$1(newStateTarget) && isPlainObject$1(oldStateSource)) {
            patchObject(newStateTarget, oldStateSource);
          } else {
            newStore.$state[stateKey] = oldStateSource;
          }
        }
        set(store, stateKey, toRef(newStore.$state, stateKey));
      });
      Object.keys(store.$state).forEach((stateKey) => {
        if (!(stateKey in newStore.$state)) {
          del(store, stateKey);
        }
      });
      isListening = false;
      isSyncListening = false;
      pinia.state.value[$id] = toRef(newStore._hmrPayload, "hotState");
      isSyncListening = true;
      nextTick().then(() => {
        isListening = true;
      });
      for (const actionName in newStore._hmrPayload.actions) {
        const action = newStore[actionName];
        set(store, actionName, wrapAction(actionName, action));
      }
      for (const getterName in newStore._hmrPayload.getters) {
        const getter = newStore._hmrPayload.getters[getterName];
        const getterValue = isOptionsStore ? (
          // special handling of options api
          computed(() => {
            setActivePinia(pinia);
            return getter.call(store, store);
          })
        ) : getter;
        set(store, getterName, getterValue);
      }
      Object.keys(store._hmrPayload.getters).forEach((key) => {
        if (!(key in newStore._hmrPayload.getters)) {
          del(store, key);
        }
      });
      Object.keys(store._hmrPayload.actions).forEach((key) => {
        if (!(key in newStore._hmrPayload.actions)) {
          del(store, key);
        }
      });
      store._hmrPayload = newStore._hmrPayload;
      store._getters = newStore._getters;
      store._hotUpdating = false;
    });
  }
  if (USE_DEVTOOLS) {
    const nonEnumerable = {
      writable: true,
      configurable: true,
      // avoid warning on devtools trying to display this property
      enumerable: false
    };
    ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p) => {
      Object.defineProperty(store, p, assign$2({ value: store[p] }, nonEnumerable));
    });
  }
  pinia._p.forEach((extender) => {
    if (USE_DEVTOOLS) {
      const extensions = scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      }));
      Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
      assign$2(store, extensions);
    } else {
      assign$2(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (process.env.NODE_ENV !== "production" && store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
    console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
  }
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
    if (process.env.NODE_ENV !== "production" && typeof id !== "string") {
      throw new Error(`[🍍]: "defineStore()" must be passed a store id as its first argument.`);
    }
  }
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    (process.env.NODE_ENV === "test" && activePinia && activePinia._testing ? null : pinia) || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia)
      setActivePinia(pinia);
    if (process.env.NODE_ENV !== "production" && !activePinia) {
      throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Did you forget to install pinia?
	const pinia = createPinia()
	app.use(pinia)
This will fail in production.`);
    }
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
      if (process.env.NODE_ENV !== "production") {
        useStore._pinia = pinia;
      }
    }
    const store = pinia._s.get(id);
    if (process.env.NODE_ENV !== "production" && hot) {
      const hotId = "__hot:" + id;
      const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia, true) : createOptionsStore(hotId, assign$2({}, options), pinia, true);
      hot._hotUpdate(newStore);
      delete pinia.state.value[hotId];
      pinia._s.delete(hotId);
    }
    if (process.env.NODE_ENV !== "production" && IS_CLIENT) {
      const currentInstance = getCurrentInstance();
      if (currentInstance && currentInstance.proxy && // avoid adding stores that are just built for hot module replacement
      !hot) {
        const vm = currentInstance.proxy;
        const cache2 = "_pStores" in vm ? vm._pStores : vm._pStores = {};
        cache2[id] = store;
      }
    }
    return store;
  }
  useStore.$id = id;
  return useStore;
}
function resolveUnref(r) {
  return typeof r === "function" ? r() : unref(r);
}
function resolveUnrefHeadInput(ref2, lastKey = "") {
  if (ref2 instanceof Promise)
    return ref2;
  const root3 = resolveUnref(ref2);
  if (!ref2 || !root3)
    return root3;
  if (Array.isArray(root3))
    return root3.map((r) => resolveUnrefHeadInput(r, lastKey));
  if (typeof root3 === "object") {
    return Object.fromEntries(
      Object.entries(root3).map(([k, v]) => {
        if (k === "titleTemplate" || k.startsWith("on"))
          return [k, unref(v)];
        return [k, resolveUnrefHeadInput(v, k)];
      })
    );
  }
  return root3;
}
const Vue3 = version.startsWith("3");
const headSymbol = "usehead";
function injectHead() {
  return getCurrentInstance() && inject(headSymbol) || getActiveHead();
}
function vueInstall(head) {
  const plugin2 = {
    install(app) {
      if (Vue3) {
        app.config.globalProperties.$unhead = head;
        app.config.globalProperties.$head = head;
        app.provide(headSymbol, head);
      }
    }
  };
  return plugin2.install;
}
function createServerHead(options = {}) {
  const head = createServerHead$1({
    ...options,
    plugins: [
      VueReactiveUseHeadPlugin(),
      ...(options == null ? void 0 : options.plugins) || []
    ]
  });
  head.install = vueInstall(head);
  return head;
}
function VueReactiveUseHeadPlugin() {
  return defineHeadPlugin({
    hooks: {
      "entries:resolve": function(ctx) {
        for (const entry2 of ctx.entries)
          entry2.resolvedInput = resolveUnrefHeadInput(entry2.input);
      }
    }
  });
}
function clientUseHead(input, options = {}) {
  const head = injectHead();
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input);
  });
  const entry2 = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e) => {
    entry2.patch(e);
  });
  getCurrentInstance();
  return entry2;
}
function serverUseHead(input, options = {}) {
  const head = injectHead();
  return head.push(input, options);
}
function useHead(input, options = {}) {
  var _a;
  const head = injectHead();
  if (head) {
    const isBrowser = !!((_a = head.resolvedOptions) == null ? void 0 : _a.document);
    if (options.mode === "server" && isBrowser || options.mode === "client" && !isBrowser)
      return;
    return isBrowser ? clientUseHead(input, options) : serverUseHead(input, options);
  }
}
const coreComposableNames = [
  "injectHead"
];
({
  "@unhead/vue": [...coreComposableNames, ...composableNames]
});
const getDefault = () => null;
function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  let [key, handler2, options = {}] = args;
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [asyncData] key must be a string.");
  }
  if (typeof handler2 !== "function") {
    throw new TypeError("[nuxt] [asyncData] handler must be a function.");
  }
  options.server = options.server ?? true;
  options.default = options.default ?? getDefault;
  options.lazy = options.lazy ?? false;
  options.immediate = options.immediate ?? true;
  const nuxt = useNuxtApp();
  const getCachedData = () => nuxt.isHydrating ? nuxt.payload.data[key] : nuxt.static.data[key];
  const hasCachedData = () => getCachedData() !== void 0;
  if (!nuxt._asyncData[key]) {
    nuxt._asyncData[key] = {
      data: ref(getCachedData() ?? options.default()),
      pending: ref(!hasCachedData()),
      error: toRef(nuxt.payload._errors, key),
      status: ref("idle")
    };
  }
  const asyncData = { ...nuxt._asyncData[key] };
  asyncData.refresh = asyncData.execute = (opts = {}) => {
    if (nuxt._asyncDataPromises[key]) {
      if (opts.dedupe === false) {
        return nuxt._asyncDataPromises[key];
      }
      nuxt._asyncDataPromises[key].cancelled = true;
    }
    if ((opts._initial || nuxt.isHydrating && opts._initial !== false) && hasCachedData()) {
      return getCachedData();
    }
    asyncData.pending.value = true;
    asyncData.status.value = "pending";
    const promise = new Promise(
      (resolve, reject) => {
        try {
          resolve(handler2(nuxt));
        } catch (err) {
          reject(err);
        }
      }
    ).then((_result) => {
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      let result = _result;
      if (options.transform) {
        result = options.transform(_result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      asyncData.data.value = result;
      asyncData.error.value = null;
      asyncData.status.value = "success";
    }).catch((error) => {
      if (promise.cancelled) {
        return nuxt._asyncDataPromises[key];
      }
      asyncData.error.value = error;
      asyncData.data.value = unref(options.default());
      asyncData.status.value = "error";
    }).finally(() => {
      if (promise.cancelled) {
        return;
      }
      asyncData.pending.value = false;
      nuxt.payload.data[key] = asyncData.data.value;
      if (asyncData.error.value) {
        nuxt.payload._errors[key] = createError(asyncData.error.value);
      }
      delete nuxt._asyncDataPromises[key];
    });
    nuxt._asyncDataPromises[key] = promise;
    return nuxt._asyncDataPromises[key];
  };
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxt.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxt.hook("app:created", () => promise);
    }
  }
  const asyncDataPromise = Promise.resolve(nuxt._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
function useRequestFetch() {
  var _a;
  const event = (_a = useNuxtApp().ssrContext) == null ? void 0 : _a.event;
  return (event == null ? void 0 : event.$fetch) || globalThis.$fetch;
}
function useFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
  const _key = opts.key || hash([autoKey, unref(opts.baseURL), typeof request === "string" ? request : "", unref(opts.params || opts.query)]);
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useFetch] key must be a string: " + _key);
  }
  if (!request) {
    throw new Error("[nuxt] [useFetch] request is missing.");
  }
  const key = _key === autoKey ? "$f" + _key : _key;
  const _request = computed(() => {
    let r = request;
    if (typeof r === "function") {
      r = r();
    }
    return unref(r);
  });
  if (!opts.baseURL && typeof _request.value === "string" && _request.value.startsWith("//")) {
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
  }
  const {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    watch: watch2,
    immediate,
    ...fetchOptions
  } = opts;
  const _fetchOptions = reactive({
    ...fetchOptions,
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    immediate,
    watch: watch2 === false ? [] : [_fetchOptions, _request, ...watch2 || []]
  };
  let controller;
  const asyncData = useAsyncData(key, () => {
    var _a;
    (_a = controller == null ? void 0 : controller.abort) == null ? void 0 : _a.call(controller);
    controller = typeof AbortController !== "undefined" ? new AbortController() : {};
    const isLocalFetch = typeof _request.value === "string" && _request.value.startsWith("/");
    let _$fetch = opts.$fetch || globalThis.$fetch;
    if (!opts.$fetch && isLocalFetch) {
      _$fetch = useRequestFetch();
    }
    return _$fetch(_request.value, { signal: controller.signal, ..._fetchOptions });
  }, _asyncDataOptions);
  return asyncData;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  var _a;
  const opts = { ...CookieDefaults, ..._opts };
  const cookies = readRawCookies(opts) || {};
  const cookie = ref(cookies[name] ?? ((_a = opts.default) == null ? void 0 : _a.call(opts)));
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (!isEqual(cookie.value, cookies[name])) {
        writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
      }
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  var _a;
  {
    return parse$1(((_a = useRequestEvent()) == null ? void 0 : _a.node.req.headers.cookie) || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
/*! @__NO_SIDE_EFFECTS__ */
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  const resolveTrailingSlashBehavior = (to, resolve) => {
    if (!to || options.trailingSlash !== "append" && options.trailingSlash !== "remove") {
      return to;
    }
    const normalizeTrailingSlash = options.trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
    if (typeof to === "string") {
      return normalizeTrailingSlash(to, true);
    }
    const path = "path" in to ? to.path : resolve(to).path;
    return {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: normalizeTrailingSlash(path, true)
    };
  };
  return /* @__PURE__ */ defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = computed(() => {
        const path = props.to || props.href || "";
        return resolveTrailingSlashBehavior(path, router.resolve);
      });
      const isExternal = computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, { acceptRelative: true });
      });
      const prefetched = ref(false);
      const el = void 0;
      const elRef = void 0;
      return () => {
        var _a, _b;
        if (!isExternal.value) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            if (prefetched.value) {
              routerLinkProps.class = props.prefetchedClass || options.prefetchedClass;
            }
            routerLinkProps.rel = props.rel;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const href = typeof to.value === "object" ? ((_a = router.resolve(to.value)) == null ? void 0 : _a.href) ?? null : to.value || null;
        const target = props.target || null;
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        const navigate = () => navigateTo(href, { replace: props.replace });
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href,
            navigate,
            get route() {
              if (!href) {
                return void 0;
              }
              const url = parseURL(href);
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                // stub properties for compat with vue-router
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href
              };
            },
            rel,
            target,
            isExternal: isExternal.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { ref: el, href, rel, target }, (_b = slots.default) == null ? void 0 : _b.call(slots));
      };
    }
  });
}
const __nuxt_component_0$3 = /* @__PURE__ */ defineNuxtLink({ componentName: "NuxtLink" });
const plugin = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();
  nuxtApp.vueApp.use(pinia);
  setActivePinia(pinia);
  {
    nuxtApp.payload.pinia = pinia.state.value;
  }
  return {
    provide: {
      pinia
    }
  };
});
const reducers = {
  NuxtError: (data) => isNuxtError(data) && data.toJSON(),
  EmptyShallowRef: (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  EmptyRef: (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  ShallowRef: (data) => isRef(data) && isShallow(data) && data.value,
  ShallowReactive: (data) => isReactive(data) && isShallow(data) && toRaw(data),
  Ref: (data) => isRef(data) && data.value,
  Reactive: (data) => isReactive(data) && toRaw(data)
};
const revive_payload_server_eJ33V7gbc6 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const reducer in reducers) {
      definePayloadReducer(reducer, reducers[reducer]);
    }
  }
});
const components_plugin_KR1HBZs4kY = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const unhead_KgADcZ0jPj = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  setup(nuxtApp) {
    const createHead = createServerHead;
    const head = createHead();
    head.push(appHead);
    nuxtApp.vueApp.use(head);
    {
      nuxtApp.ssrContext.renderMeta = async () => {
        const meta = await renderSSRHead(head);
        return {
          ...meta,
          bodyScriptsPrepend: meta.bodyTagsOpen,
          // resolves naming difference with NuxtMeta and Unhead
          bodyScripts: meta.bodyTags
        };
      };
    }
  }
});
/*!
  * shared v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const inBrowser = false;
let mark;
let measure;
if (process.env.NODE_ENV !== "production")
  ;
const RE_ARGS = /\{([0-9a-zA-Z]+)\}/g;
function format(message, ...args) {
  if (args.length === 1 && isObject(args[0])) {
    args = args[0];
  }
  if (!args || !args.hasOwnProperty) {
    args = {};
  }
  return message.replace(RE_ARGS, (match, identifier) => {
    return args.hasOwnProperty(identifier) ? args[identifier] : "";
  });
}
const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
const makeSymbol = (name) => hasSymbol ? Symbol(name) : name;
const generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({ l: locale, k: key, s: source });
const friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
const isNumber = (val) => typeof val === "number" && isFinite(val);
const isDate = (val) => toTypeString(val) === "[object Date]";
const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
const isEmptyObject = (val) => isPlainObject(val) && Object.keys(val).length === 0;
function warn(msg, err) {
  if (typeof console !== "undefined") {
    console.warn(`[intlify] ` + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}
const assign = Object.assign;
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {});
};
function escapeHtml(rawText) {
  return rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
const isArray = Array.isArray;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isBoolean = (val) => typeof val === "boolean";
const isObject = (val) => (
  // eslint-disable-line
  val !== null && typeof val === "object"
);
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const toDisplayString = (val) => {
  return val == null ? "" : isArray(val) || isPlainObject(val) && val.toString === objectToString ? JSON.stringify(val, null, 2) : String(val);
};
const RANGE = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
  const lines = source.split(/\r?\n/);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + 1;
    if (count >= start) {
      for (let j = i - RANGE; j <= i + RANGE || end > count; j++) {
        if (j < 0 || j >= lines.length)
          continue;
        const line = j + 1;
        res.push(`${line}${" ".repeat(3 - String(line).length)}|  ${lines[j]}`);
        const lineLength = lines[j].length;
        if (j === i) {
          const pad = start - (count - lineLength) + 1;
          const length = Math.max(1, end > count ? lineLength - pad : end - start);
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + 1;
        }
      }
      break;
    }
  }
  return res.join("\n");
}
function createEmitter() {
  const events = /* @__PURE__ */ new Map();
  const emitter = {
    events,
    on(event, handler2) {
      const handlers = events.get(event);
      const added = handlers && handlers.push(handler2);
      if (!added) {
        events.set(event, [handler2]);
      }
    },
    off(event, handler2) {
      const handlers = events.get(event);
      if (handlers) {
        handlers.splice(handlers.indexOf(handler2) >>> 0, 1);
      }
    },
    emit(event, payload) {
      (events.get(event) || []).slice().map((handler2) => handler2(payload));
      (events.get("*") || []).slice().map((handler2) => handler2(event, payload));
    }
  };
  return emitter;
}
/*!
  * devtools-if v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const IntlifyDevToolsHooks = {
  I18nInit: "i18n:init",
  FunctionTranslate: "function:translate"
};
/*!
  * core-base v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const pathStateMachine = [];
pathStateMachine[
  0
  /* BEFORE_PATH */
] = {
  [
    "w"
    /* WORKSPACE */
  ]: [
    0
    /* BEFORE_PATH */
  ],
  [
    "i"
    /* IDENT */
  ]: [
    3,
    0
    /* APPEND */
  ],
  [
    "["
    /* LEFT_BRACKET */
  ]: [
    4
    /* IN_SUB_PATH */
  ],
  [
    "o"
    /* END_OF_FAIL */
  ]: [
    7
    /* AFTER_PATH */
  ]
};
pathStateMachine[
  1
  /* IN_PATH */
] = {
  [
    "w"
    /* WORKSPACE */
  ]: [
    1
    /* IN_PATH */
  ],
  [
    "."
    /* DOT */
  ]: [
    2
    /* BEFORE_IDENT */
  ],
  [
    "["
    /* LEFT_BRACKET */
  ]: [
    4
    /* IN_SUB_PATH */
  ],
  [
    "o"
    /* END_OF_FAIL */
  ]: [
    7
    /* AFTER_PATH */
  ]
};
pathStateMachine[
  2
  /* BEFORE_IDENT */
] = {
  [
    "w"
    /* WORKSPACE */
  ]: [
    2
    /* BEFORE_IDENT */
  ],
  [
    "i"
    /* IDENT */
  ]: [
    3,
    0
    /* APPEND */
  ],
  [
    "0"
    /* ZERO */
  ]: [
    3,
    0
    /* APPEND */
  ]
};
pathStateMachine[
  3
  /* IN_IDENT */
] = {
  [
    "i"
    /* IDENT */
  ]: [
    3,
    0
    /* APPEND */
  ],
  [
    "0"
    /* ZERO */
  ]: [
    3,
    0
    /* APPEND */
  ],
  [
    "w"
    /* WORKSPACE */
  ]: [
    1,
    1
    /* PUSH */
  ],
  [
    "."
    /* DOT */
  ]: [
    2,
    1
    /* PUSH */
  ],
  [
    "["
    /* LEFT_BRACKET */
  ]: [
    4,
    1
    /* PUSH */
  ],
  [
    "o"
    /* END_OF_FAIL */
  ]: [
    7,
    1
    /* PUSH */
  ]
};
pathStateMachine[
  4
  /* IN_SUB_PATH */
] = {
  [
    "'"
    /* SINGLE_QUOTE */
  ]: [
    5,
    0
    /* APPEND */
  ],
  [
    '"'
    /* DOUBLE_QUOTE */
  ]: [
    6,
    0
    /* APPEND */
  ],
  [
    "["
    /* LEFT_BRACKET */
  ]: [
    4,
    2
    /* INC_SUB_PATH_DEPTH */
  ],
  [
    "]"
    /* RIGHT_BRACKET */
  ]: [
    1,
    3
    /* PUSH_SUB_PATH */
  ],
  [
    "o"
    /* END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* ELSE */
  ]: [
    4,
    0
    /* APPEND */
  ]
};
pathStateMachine[
  5
  /* IN_SINGLE_QUOTE */
] = {
  [
    "'"
    /* SINGLE_QUOTE */
  ]: [
    4,
    0
    /* APPEND */
  ],
  [
    "o"
    /* END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* ELSE */
  ]: [
    5,
    0
    /* APPEND */
  ]
};
pathStateMachine[
  6
  /* IN_DOUBLE_QUOTE */
] = {
  [
    '"'
    /* DOUBLE_QUOTE */
  ]: [
    4,
    0
    /* APPEND */
  ],
  [
    "o"
    /* END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* ELSE */
  ]: [
    6,
    0
    /* APPEND */
  ]
};
const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral(exp) {
  return literalValueRE.test(exp);
}
function stripQuotes(str) {
  const a = str.charCodeAt(0);
  const b = str.charCodeAt(str.length - 1);
  return a === b && (a === 34 || a === 39) ? str.slice(1, -1) : str;
}
function getPathCharType(ch) {
  if (ch === void 0 || ch === null) {
    return "o";
  }
  const code2 = ch.charCodeAt(0);
  switch (code2) {
    case 91:
    case 93:
    case 46:
    case 34:
    case 39:
      return ch;
    case 95:
    case 36:
    case 45:
      return "i";
    case 9:
    case 10:
    case 13:
    case 160:
    case 65279:
    case 8232:
    case 8233:
      return "w";
  }
  return "i";
}
function formatSubPath(path) {
  const trimmed = path.trim();
  if (path.charAt(0) === "0" && isNaN(parseInt(path))) {
    return false;
  }
  return isLiteral(trimmed) ? stripQuotes(trimmed) : "*" + trimmed;
}
function parse(path) {
  const keys = [];
  let index3 = -1;
  let mode = 0;
  let subPathDepth = 0;
  let c;
  let key;
  let newChar;
  let type;
  let transition;
  let action;
  let typeMap;
  const actions = [];
  actions[
    0
    /* APPEND */
  ] = () => {
    if (key === void 0) {
      key = newChar;
    } else {
      key += newChar;
    }
  };
  actions[
    1
    /* PUSH */
  ] = () => {
    if (key !== void 0) {
      keys.push(key);
      key = void 0;
    }
  };
  actions[
    2
    /* INC_SUB_PATH_DEPTH */
  ] = () => {
    actions[
      0
      /* APPEND */
    ]();
    subPathDepth++;
  };
  actions[
    3
    /* PUSH_SUB_PATH */
  ] = () => {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = 4;
      actions[
        0
        /* APPEND */
      ]();
    } else {
      subPathDepth = 0;
      if (key === void 0) {
        return false;
      }
      key = formatSubPath(key);
      if (key === false) {
        return false;
      } else {
        actions[
          1
          /* PUSH */
        ]();
      }
    }
  };
  function maybeUnescapeQuote() {
    const nextChar = path[index3 + 1];
    if (mode === 5 && nextChar === "'" || mode === 6 && nextChar === '"') {
      index3++;
      newChar = "\\" + nextChar;
      actions[
        0
        /* APPEND */
      ]();
      return true;
    }
  }
  while (mode !== null) {
    index3++;
    c = path[index3];
    if (c === "\\" && maybeUnescapeQuote()) {
      continue;
    }
    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap[
      "l"
      /* ELSE */
    ] || 8;
    if (transition === 8) {
      return;
    }
    mode = transition[0];
    if (transition[1] !== void 0) {
      action = actions[transition[1]];
      if (action) {
        newChar = c;
        if (action() === false) {
          return;
        }
      }
    }
    if (mode === 7) {
      return keys;
    }
  }
}
const cache = /* @__PURE__ */ new Map();
function resolveWithKeyValue(obj, path) {
  return isObject(obj) ? obj[path] : null;
}
function resolveValue(obj, path) {
  if (!isObject(obj)) {
    return null;
  }
  let hit = cache.get(path);
  if (!hit) {
    hit = parse(path);
    if (hit) {
      cache.set(path, hit);
    }
  }
  if (!hit) {
    return null;
  }
  const len = hit.length;
  let last = obj;
  let i = 0;
  while (i < len) {
    const val = last[hit[i]];
    if (val === void 0) {
      return null;
    }
    last = val;
    i++;
  }
  return last;
}
const DEFAULT_MODIFIER = (str) => str;
const DEFAULT_MESSAGE = (ctx) => "";
const DEFAULT_MESSAGE_DATA_TYPE = "text";
const DEFAULT_NORMALIZE = (values) => values.length === 0 ? "" : values.join("");
const DEFAULT_INTERPOLATE = toDisplayString;
function pluralDefault(choice, choicesLength) {
  choice = Math.abs(choice);
  if (choicesLength === 2) {
    return choice ? choice > 1 ? 1 : 0 : 1;
  }
  return choice ? Math.min(choice, 2) : 0;
}
function getPluralIndex(options) {
  const index3 = isNumber(options.pluralIndex) ? options.pluralIndex : -1;
  return options.named && (isNumber(options.named.count) || isNumber(options.named.n)) ? isNumber(options.named.count) ? options.named.count : isNumber(options.named.n) ? options.named.n : index3 : index3;
}
function normalizeNamed(pluralIndex, props) {
  if (!props.count) {
    props.count = pluralIndex;
  }
  if (!props.n) {
    props.n = pluralIndex;
  }
}
function createMessageContext(options = {}) {
  const locale = options.locale;
  const pluralIndex = getPluralIndex(options);
  const pluralRule = isObject(options.pluralRules) && isString(locale) && isFunction(options.pluralRules[locale]) ? options.pluralRules[locale] : pluralDefault;
  const orgPluralRule = isObject(options.pluralRules) && isString(locale) && isFunction(options.pluralRules[locale]) ? pluralDefault : void 0;
  const plural = (messages2) => {
    return messages2[pluralRule(pluralIndex, messages2.length, orgPluralRule)];
  };
  const _list = options.list || [];
  const list = (index3) => _list[index3];
  const _named = options.named || {};
  isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named);
  const named = (key) => _named[key];
  function message(key) {
    const msg = isFunction(options.messages) ? options.messages(key) : isObject(options.messages) ? options.messages[key] : false;
    return !msg ? options.parent ? options.parent.message(key) : DEFAULT_MESSAGE : msg;
  }
  const _modifier = (name) => options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER;
  const normalize = isPlainObject(options.processor) && isFunction(options.processor.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
  const interpolate = isPlainObject(options.processor) && isFunction(options.processor.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
  const type = isPlainObject(options.processor) && isString(options.processor.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;
  const linked = (key, ...args) => {
    const [arg1, arg2] = args;
    let type2 = "text";
    let modifier = "";
    if (args.length === 1) {
      if (isObject(arg1)) {
        modifier = arg1.modifier || modifier;
        type2 = arg1.type || type2;
      } else if (isString(arg1)) {
        modifier = arg1 || modifier;
      }
    } else if (args.length === 2) {
      if (isString(arg1)) {
        modifier = arg1 || modifier;
      }
      if (isString(arg2)) {
        type2 = arg2 || type2;
      }
    }
    let msg = message(key)(ctx);
    if (type2 === "vnode" && isArray(msg) && modifier) {
      msg = msg[0];
    }
    return modifier ? _modifier(modifier)(msg, type2) : msg;
  };
  const ctx = {
    [
      "list"
      /* LIST */
    ]: list,
    [
      "named"
      /* NAMED */
    ]: named,
    [
      "plural"
      /* PLURAL */
    ]: plural,
    [
      "linked"
      /* LINKED */
    ]: linked,
    [
      "message"
      /* MESSAGE */
    ]: message,
    [
      "type"
      /* TYPE */
    ]: type,
    [
      "interpolate"
      /* INTERPOLATE */
    ]: interpolate,
    [
      "normalize"
      /* NORMALIZE */
    ]: normalize
  };
  return ctx;
}
let devtools = null;
function setDevToolsHook(hook) {
  devtools = hook;
}
function initI18nDevTools(i18n, version2, meta) {
  devtools && devtools.emit(IntlifyDevToolsHooks.I18nInit, {
    timestamp: Date.now(),
    i18n,
    version: version2,
    meta
  });
}
const translateDevTools = /* @__PURE__ */ createDevToolsHook(IntlifyDevToolsHooks.FunctionTranslate);
function createDevToolsHook(hook) {
  return (payloads) => devtools && devtools.emit(hook, payloads);
}
const CoreWarnCodes = {
  NOT_FOUND_KEY: 1,
  FALLBACK_TO_TRANSLATE: 2,
  CANNOT_FORMAT_NUMBER: 3,
  FALLBACK_TO_NUMBER_FORMAT: 4,
  CANNOT_FORMAT_DATE: 5,
  FALLBACK_TO_DATE_FORMAT: 6,
  __EXTEND_POINT__: 7
};
const warnMessages$1 = {
  [CoreWarnCodes.NOT_FOUND_KEY]: `Not found '{key}' key in '{locale}' locale messages.`,
  [CoreWarnCodes.FALLBACK_TO_TRANSLATE]: `Fall back to translate '{key}' key with '{target}' locale.`,
  [CoreWarnCodes.CANNOT_FORMAT_NUMBER]: `Cannot format a number value due to not supported Intl.NumberFormat.`,
  [CoreWarnCodes.FALLBACK_TO_NUMBER_FORMAT]: `Fall back to number format '{key}' key with '{target}' locale.`,
  [CoreWarnCodes.CANNOT_FORMAT_DATE]: `Cannot format a date value due to not supported Intl.DateTimeFormat.`,
  [CoreWarnCodes.FALLBACK_TO_DATE_FORMAT]: `Fall back to datetime format '{key}' key with '{target}' locale.`
};
function getWarnMessage$1(code2, ...args) {
  return format(warnMessages$1[code2], ...args);
}
function fallbackWithSimple(ctx, fallback, start) {
  return [.../* @__PURE__ */ new Set([
    start,
    ...isArray(fallback) ? fallback : isObject(fallback) ? Object.keys(fallback) : isString(fallback) ? [fallback] : [start]
  ])];
}
function fallbackWithLocaleChain(ctx, fallback, start) {
  const startLocale = isString(start) ? start : DEFAULT_LOCALE;
  const context = ctx;
  if (!context.__localeChainCache) {
    context.__localeChainCache = /* @__PURE__ */ new Map();
  }
  let chain = context.__localeChainCache.get(startLocale);
  if (!chain) {
    chain = [];
    let block = [start];
    while (isArray(block)) {
      block = appendBlockToChain(chain, block, fallback);
    }
    const defaults = isArray(fallback) || !isPlainObject(fallback) ? fallback : fallback["default"] ? fallback["default"] : null;
    block = isString(defaults) ? [defaults] : defaults;
    if (isArray(block)) {
      appendBlockToChain(chain, block, false);
    }
    context.__localeChainCache.set(startLocale, chain);
  }
  return chain;
}
function appendBlockToChain(chain, block, blocks) {
  let follow = true;
  for (let i = 0; i < block.length && isBoolean(follow); i++) {
    const locale = block[i];
    if (isString(locale)) {
      follow = appendLocaleToChain(chain, block[i], blocks);
    }
  }
  return follow;
}
function appendLocaleToChain(chain, locale, blocks) {
  let follow;
  const tokens = locale.split("-");
  do {
    const target = tokens.join("-");
    follow = appendItemToChain(chain, target, blocks);
    tokens.splice(-1, 1);
  } while (tokens.length && follow === true);
  return follow;
}
function appendItemToChain(chain, target, blocks) {
  let follow = false;
  if (!chain.includes(target)) {
    follow = true;
    if (target) {
      follow = target[target.length - 1] !== "!";
      const locale = target.replace(/!/g, "");
      chain.push(locale);
      if ((isArray(blocks) || isPlainObject(blocks)) && blocks[locale]) {
        follow = blocks[locale];
      }
    }
  }
  return follow;
}
const VERSION$1 = "9.2.2";
const NOT_REOSLVED = -1;
const DEFAULT_LOCALE = "en-US";
const MISSING_RESOLVE_VALUE = "";
const capitalize = (str) => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`;
function getDefaultLinkedModifiers() {
  return {
    upper: (val, type) => {
      return type === "text" && isString(val) ? val.toUpperCase() : type === "vnode" && isObject(val) && "__v_isVNode" in val ? val.children.toUpperCase() : val;
    },
    lower: (val, type) => {
      return type === "text" && isString(val) ? val.toLowerCase() : type === "vnode" && isObject(val) && "__v_isVNode" in val ? val.children.toLowerCase() : val;
    },
    capitalize: (val, type) => {
      return type === "text" && isString(val) ? capitalize(val) : type === "vnode" && isObject(val) && "__v_isVNode" in val ? capitalize(val.children) : val;
    }
  };
}
let _compiler;
let _resolver;
function registerMessageResolver(resolver) {
  _resolver = resolver;
}
let _fallbacker;
function registerLocaleFallbacker(fallbacker) {
  _fallbacker = fallbacker;
}
let _additionalMeta = null;
const setAdditionalMeta = (meta) => {
  _additionalMeta = meta;
};
const getAdditionalMeta = () => _additionalMeta;
let _fallbackContext = null;
const setFallbackContext = (context) => {
  _fallbackContext = context;
};
const getFallbackContext = () => _fallbackContext;
let _cid = 0;
function createCoreContext(options = {}) {
  const version2 = isString(options.version) ? options.version : VERSION$1;
  const locale = isString(options.locale) ? options.locale : DEFAULT_LOCALE;
  const fallbackLocale = isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || isString(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : locale;
  const messages2 = isPlainObject(options.messages) ? options.messages : { [locale]: {} };
  const datetimeFormats = isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [locale]: {} };
  const numberFormats = isPlainObject(options.numberFormats) ? options.numberFormats : { [locale]: {} };
  const modifiers = assign({}, options.modifiers || {}, getDefaultLinkedModifiers());
  const pluralRules = options.pluralRules || {};
  const missing = isFunction(options.missing) ? options.missing : null;
  const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const fallbackFormat = !!options.fallbackFormat;
  const unresolving = !!options.unresolving;
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  const processor = isPlainObject(options.processor) ? options.processor : null;
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const escapeParameter = !!options.escapeParameter;
  const messageCompiler = isFunction(options.messageCompiler) ? options.messageCompiler : _compiler;
  const messageResolver = isFunction(options.messageResolver) ? options.messageResolver : _resolver || resolveWithKeyValue;
  const localeFallbacker = isFunction(options.localeFallbacker) ? options.localeFallbacker : _fallbacker || fallbackWithSimple;
  const fallbackContext = isObject(options.fallbackContext) ? options.fallbackContext : void 0;
  const onWarn = isFunction(options.onWarn) ? options.onWarn : warn;
  const internalOptions = options;
  const __datetimeFormatters = isObject(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : /* @__PURE__ */ new Map();
  const __numberFormatters = isObject(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : /* @__PURE__ */ new Map();
  const __meta = isObject(internalOptions.__meta) ? internalOptions.__meta : {};
  _cid++;
  const context = {
    version: version2,
    cid: _cid,
    locale,
    fallbackLocale,
    messages: messages2,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation,
    processor,
    warnHtmlMessage,
    escapeParameter,
    messageCompiler,
    messageResolver,
    localeFallbacker,
    fallbackContext,
    onWarn,
    __meta
  };
  {
    context.datetimeFormats = datetimeFormats;
    context.numberFormats = numberFormats;
    context.__datetimeFormatters = __datetimeFormatters;
    context.__numberFormatters = __numberFormatters;
  }
  if (process.env.NODE_ENV !== "production") {
    context.__v_emitter = internalOptions.__v_emitter != null ? internalOptions.__v_emitter : void 0;
  }
  if (process.env.NODE_ENV !== "production" || __INTLIFY_PROD_DEVTOOLS__) {
    initI18nDevTools(context, version2, __meta);
  }
  return context;
}
function isTranslateFallbackWarn(fallback, key) {
  return fallback instanceof RegExp ? fallback.test(key) : fallback;
}
function isTranslateMissingWarn(missing, key) {
  return missing instanceof RegExp ? missing.test(key) : missing;
}
function handleMissing(context, key, locale, missingWarn, type) {
  const { missing, onWarn } = context;
  if (process.env.NODE_ENV !== "production") {
    const emitter = context.__v_emitter;
    if (emitter) {
      emitter.emit("missing", {
        locale,
        key,
        type,
        groupId: `${type}:${key}`
      });
    }
  }
  if (missing !== null) {
    const ret = missing(context, locale, key, type);
    return isString(ret) ? ret : key;
  } else {
    if (process.env.NODE_ENV !== "production" && isTranslateMissingWarn(missingWarn, key)) {
      onWarn(getWarnMessage$1(CoreWarnCodes.NOT_FOUND_KEY, { key, locale }));
    }
    return key;
  }
}
function updateFallbackLocale(ctx, locale, fallback) {
  const context = ctx;
  context.__localeChainCache = /* @__PURE__ */ new Map();
  ctx.localeFallbacker(ctx, fallback, locale);
}
let code$2 = CompileErrorCodes.__EXTEND_POINT__;
const inc$2 = () => ++code$2;
const CoreErrorCodes = {
  INVALID_ARGUMENT: code$2,
  INVALID_DATE_ARGUMENT: inc$2(),
  INVALID_ISO_DATE_ARGUMENT: inc$2(),
  __EXTEND_POINT__: inc$2()
  // 18
};
function createCoreError(code2) {
  return createCompileError(code2, null, process.env.NODE_ENV !== "production" ? { messages: errorMessages$1 } : void 0);
}
const errorMessages$1 = {
  [CoreErrorCodes.INVALID_ARGUMENT]: "Invalid arguments",
  [CoreErrorCodes.INVALID_DATE_ARGUMENT]: "The date provided is an invalid Date object.Make sure your Date represents a valid date.",
  [CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT]: "The argument provided is not a valid ISO date string"
};
const NOOP_MESSAGE_FUNCTION = () => "";
const isMessageFunction = (val) => isFunction(val);
function translate(context, ...args) {
  const { fallbackFormat, postTranslation, unresolving, messageCompiler, fallbackLocale, messages: messages2 } = context;
  const [key, options] = parseTranslateArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const escapeParameter = isBoolean(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
  const resolvedMessage = !!options.resolvedMessage;
  const defaultMsgOrKey = isString(options.default) || isBoolean(options.default) ? !isBoolean(options.default) ? options.default : !messageCompiler ? () => key : key : fallbackFormat ? !messageCompiler ? () => key : key : "";
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey !== "";
  const locale = isString(options.locale) ? options.locale : context.locale;
  escapeParameter && escapeParams(options);
  let [formatScope, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [
    key,
    locale,
    messages2[locale] || {}
  ];
  let format2 = formatScope;
  let cacheBaseKey = key;
  if (!resolvedMessage && !(isString(format2) || isMessageFunction(format2))) {
    if (enableDefaultMsg) {
      format2 = defaultMsgOrKey;
      cacheBaseKey = format2;
    }
  }
  if (!resolvedMessage && (!(isString(format2) || isMessageFunction(format2)) || !isString(targetLocale))) {
    return unresolving ? NOT_REOSLVED : key;
  }
  if (process.env.NODE_ENV !== "production" && isString(format2) && context.messageCompiler == null) {
    warn(`The message format compilation is not supported in this build. Because message compiler isn't included. You need to pre-compilation all message format. So translate function return '${key}'.`);
    return key;
  }
  let occurred = false;
  const errorDetector = () => {
    occurred = true;
  };
  const msg = !isMessageFunction(format2) ? compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, errorDetector) : format2;
  if (occurred) {
    return format2;
  }
  const ctxOptions = getMessageContextOptions(context, targetLocale, message, options);
  const msgContext = createMessageContext(ctxOptions);
  const messaged = evaluateMessage(context, msg, msgContext);
  const ret = postTranslation ? postTranslation(messaged, key) : messaged;
  if (process.env.NODE_ENV !== "production" || __INTLIFY_PROD_DEVTOOLS__) {
    const payloads = {
      timestamp: Date.now(),
      key: isString(key) ? key : isMessageFunction(format2) ? format2.key : "",
      locale: targetLocale || (isMessageFunction(format2) ? format2.locale : ""),
      format: isString(format2) ? format2 : isMessageFunction(format2) ? format2.source : "",
      message: ret
    };
    payloads.meta = assign({}, context.__meta, getAdditionalMeta() || {});
    translateDevTools(payloads);
  }
  return ret;
}
function escapeParams(options) {
  if (isArray(options.list)) {
    options.list = options.list.map((item) => isString(item) ? escapeHtml(item) : item);
  } else if (isObject(options.named)) {
    Object.keys(options.named).forEach((key) => {
      if (isString(options.named[key])) {
        options.named[key] = escapeHtml(options.named[key]);
      }
    });
  }
}
function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
  const { messages: messages2, onWarn, messageResolver: resolveValue2, localeFallbacker } = context;
  const locales = localeFallbacker(context, fallbackLocale, locale);
  let message = {};
  let targetLocale;
  let format2 = null;
  let from = locale;
  let to = null;
  const type = "translate";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = to = locales[i];
    if (process.env.NODE_ENV !== "production" && locale !== targetLocale && isTranslateFallbackWarn(fallbackWarn, key)) {
      onWarn(getWarnMessage$1(CoreWarnCodes.FALLBACK_TO_TRANSLATE, {
        key,
        target: targetLocale
      }));
    }
    if (process.env.NODE_ENV !== "production" && locale !== targetLocale) {
      const emitter = context.__v_emitter;
      if (emitter) {
        emitter.emit("fallback", {
          type,
          key,
          from,
          to,
          groupId: `${type}:${key}`
        });
      }
    }
    message = messages2[targetLocale] || {};
    let start = null;
    let startTag;
    let endTag;
    if (process.env.NODE_ENV !== "production" && inBrowser) {
      start = window.performance.now();
      startTag = "intlify-message-resolve-start";
      endTag = "intlify-message-resolve-end";
    }
    if ((format2 = resolveValue2(message, key)) === null) {
      format2 = message[key];
    }
    if (process.env.NODE_ENV !== "production" && inBrowser) {
      const end = window.performance.now();
      const emitter = context.__v_emitter;
      if (emitter && start && format2) {
        emitter.emit("message-resolve", {
          type: "message-resolve",
          key,
          message: format2,
          time: end - start,
          groupId: `${type}:${key}`
        });
      }
      if (startTag && endTag && mark && measure) {
        mark(endTag);
        measure("intlify message resolve", startTag, endTag);
      }
    }
    if (isString(format2) || isFunction(format2))
      break;
    const missingRet = handleMissing(
      context,
      // eslint-disable-line @typescript-eslint/no-explicit-any
      key,
      targetLocale,
      missingWarn,
      type
    );
    if (missingRet !== key) {
      format2 = missingRet;
    }
    from = to;
  }
  return [format2, targetLocale, message];
}
function compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, errorDetector) {
  const { messageCompiler, warnHtmlMessage } = context;
  if (isMessageFunction(format2)) {
    const msg2 = format2;
    msg2.locale = msg2.locale || targetLocale;
    msg2.key = msg2.key || key;
    return msg2;
  }
  if (messageCompiler == null) {
    const msg2 = () => format2;
    msg2.locale = targetLocale;
    msg2.key = key;
    return msg2;
  }
  let start = null;
  let startTag;
  let endTag;
  if (process.env.NODE_ENV !== "production" && inBrowser) {
    start = window.performance.now();
    startTag = "intlify-message-compilation-start";
    endTag = "intlify-message-compilation-end";
  }
  const msg = messageCompiler(format2, getCompileOptions(context, targetLocale, cacheBaseKey, format2, warnHtmlMessage, errorDetector));
  if (process.env.NODE_ENV !== "production" && inBrowser) {
    const end = window.performance.now();
    const emitter = context.__v_emitter;
    if (emitter && start) {
      emitter.emit("message-compilation", {
        type: "message-compilation",
        message: format2,
        time: end - start,
        groupId: `${"translate"}:${key}`
      });
    }
    if (startTag && endTag && mark && measure) {
      mark(endTag);
      measure("intlify message compilation", startTag, endTag);
    }
  }
  msg.locale = targetLocale;
  msg.key = key;
  msg.source = format2;
  return msg;
}
function evaluateMessage(context, msg, msgCtx) {
  let start = null;
  let startTag;
  let endTag;
  if (process.env.NODE_ENV !== "production" && inBrowser) {
    start = window.performance.now();
    startTag = "intlify-message-evaluation-start";
    endTag = "intlify-message-evaluation-end";
  }
  const messaged = msg(msgCtx);
  if (process.env.NODE_ENV !== "production" && inBrowser) {
    const end = window.performance.now();
    const emitter = context.__v_emitter;
    if (emitter && start) {
      emitter.emit("message-evaluation", {
        type: "message-evaluation",
        value: messaged,
        time: end - start,
        groupId: `${"translate"}:${msg.key}`
      });
    }
    if (startTag && endTag && mark && measure) {
      mark(endTag);
      measure("intlify message evaluation", startTag, endTag);
    }
  }
  return messaged;
}
function parseTranslateArgs(...args) {
  const [arg1, arg2, arg3] = args;
  const options = {};
  if (!isString(arg1) && !isNumber(arg1) && !isMessageFunction(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const key = isNumber(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;
  if (isNumber(arg2)) {
    options.plural = arg2;
  } else if (isString(arg2)) {
    options.default = arg2;
  } else if (isPlainObject(arg2) && !isEmptyObject(arg2)) {
    options.named = arg2;
  } else if (isArray(arg2)) {
    options.list = arg2;
  }
  if (isNumber(arg3)) {
    options.plural = arg3;
  } else if (isString(arg3)) {
    options.default = arg3;
  } else if (isPlainObject(arg3)) {
    assign(options, arg3);
  }
  return [key, options];
}
function getCompileOptions(context, locale, key, source, warnHtmlMessage, errorDetector) {
  return {
    warnHtmlMessage,
    onError: (err) => {
      errorDetector && errorDetector(err);
      if (process.env.NODE_ENV !== "production") {
        const message = `Message compilation error: ${err.message}`;
        const codeFrame = err.location && generateCodeFrame(source, err.location.start.offset, err.location.end.offset);
        const emitter = context.__v_emitter;
        if (emitter) {
          emitter.emit("compile-error", {
            message: source,
            error: err.message,
            start: err.location && err.location.start.offset,
            end: err.location && err.location.end.offset,
            groupId: `${"translate"}:${key}`
          });
        }
        console.error(codeFrame ? `${message}
${codeFrame}` : message);
      } else {
        throw err;
      }
    },
    onCacheKey: (source2) => generateFormatCacheKey(locale, key, source2)
  };
}
function getMessageContextOptions(context, locale, message, options) {
  const { modifiers, pluralRules, messageResolver: resolveValue2, fallbackLocale, fallbackWarn, missingWarn, fallbackContext } = context;
  const resolveMessage = (key) => {
    let val = resolveValue2(message, key);
    if (val == null && fallbackContext) {
      const [, , message2] = resolveMessageFormat(fallbackContext, key, locale, fallbackLocale, fallbackWarn, missingWarn);
      val = resolveValue2(message2, key);
    }
    if (isString(val)) {
      let occurred = false;
      const errorDetector = () => {
        occurred = true;
      };
      const msg = compileMessageFormat(context, key, locale, val, key, errorDetector);
      return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
    } else if (isMessageFunction(val)) {
      return val;
    } else {
      return NOOP_MESSAGE_FUNCTION;
    }
  };
  const ctxOptions = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  };
  if (context.processor) {
    ctxOptions.processor = context.processor;
  }
  if (options.list) {
    ctxOptions.list = options.list;
  }
  if (options.named) {
    ctxOptions.named = options.named;
  }
  if (isNumber(options.plural)) {
    ctxOptions.pluralIndex = options.plural;
  }
  return ctxOptions;
}
const intlDefined = typeof Intl !== "undefined";
const Availabilities = {
  dateTimeFormat: intlDefined && typeof Intl.DateTimeFormat !== "undefined",
  numberFormat: intlDefined && typeof Intl.NumberFormat !== "undefined"
};
function datetime(context, ...args) {
  const { datetimeFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __datetimeFormatters } = context;
  if (process.env.NODE_ENV !== "production" && !Availabilities.dateTimeFormat) {
    onWarn(getWarnMessage$1(CoreWarnCodes.CANNOT_FORMAT_DATE));
    return MISSING_RESOLVE_VALUE;
  }
  const [key, value, options, overrides] = parseDateTimeArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = isString(options.locale) ? options.locale : context.locale;
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString(key) || key === "") {
    return new Intl.DateTimeFormat(locale, overrides).format(value);
  }
  let datetimeFormat = {};
  let targetLocale;
  let format2 = null;
  let from = locale;
  let to = null;
  const type = "datetime format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = to = locales[i];
    if (process.env.NODE_ENV !== "production" && locale !== targetLocale && isTranslateFallbackWarn(fallbackWarn, key)) {
      onWarn(getWarnMessage$1(CoreWarnCodes.FALLBACK_TO_DATE_FORMAT, {
        key,
        target: targetLocale
      }));
    }
    if (process.env.NODE_ENV !== "production" && locale !== targetLocale) {
      const emitter = context.__v_emitter;
      if (emitter) {
        emitter.emit("fallback", {
          type,
          key,
          from,
          to,
          groupId: `${type}:${key}`
        });
      }
    }
    datetimeFormat = datetimeFormats[targetLocale] || {};
    format2 = datetimeFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
    from = to;
  }
  if (!isPlainObject(format2) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __datetimeFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(targetLocale, assign({}, format2, overrides));
    __datetimeFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const DATETIME_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName",
  "formatMatcher",
  "hour12",
  "timeZone",
  "dateStyle",
  "timeStyle",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "hourCycle",
  "fractionalSecondDigits"
];
function parseDateTimeArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = {};
  let overrides = {};
  let value;
  if (isString(arg1)) {
    const matches = arg1.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
    if (!matches) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
    const dateTime = matches[3] ? matches[3].trim().startsWith("T") ? `${matches[1].trim()}${matches[3].trim()}` : `${matches[1].trim()}T${matches[3].trim()}` : matches[1].trim();
    value = new Date(dateTime);
    try {
      value.toISOString();
    } catch (e) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (isDate(arg1)) {
    if (isNaN(arg1.getTime())) {
      throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT);
    }
    value = arg1;
  } else if (isNumber(arg1)) {
    value = arg1;
  } else {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (DATETIME_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearDateTimeFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__datetimeFormatters.has(id)) {
      continue;
    }
    context.__datetimeFormatters.delete(id);
  }
}
function number(context, ...args) {
  const { numberFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __numberFormatters } = context;
  if (process.env.NODE_ENV !== "production" && !Availabilities.numberFormat) {
    onWarn(getWarnMessage$1(CoreWarnCodes.CANNOT_FORMAT_NUMBER));
    return MISSING_RESOLVE_VALUE;
  }
  const [key, value, options, overrides] = parseNumberArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = isString(options.locale) ? options.locale : context.locale;
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString(key) || key === "") {
    return new Intl.NumberFormat(locale, overrides).format(value);
  }
  let numberFormat = {};
  let targetLocale;
  let format2 = null;
  let from = locale;
  let to = null;
  const type = "number format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = to = locales[i];
    if (process.env.NODE_ENV !== "production" && locale !== targetLocale && isTranslateFallbackWarn(fallbackWarn, key)) {
      onWarn(getWarnMessage$1(CoreWarnCodes.FALLBACK_TO_NUMBER_FORMAT, {
        key,
        target: targetLocale
      }));
    }
    if (process.env.NODE_ENV !== "production" && locale !== targetLocale) {
      const emitter = context.__v_emitter;
      if (emitter) {
        emitter.emit("fallback", {
          type,
          key,
          from,
          to,
          groupId: `${type}:${key}`
        });
      }
    }
    numberFormat = numberFormats[targetLocale] || {};
    format2 = numberFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
    from = to;
  }
  if (!isPlainObject(format2) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __numberFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.NumberFormat(targetLocale, assign({}, format2, overrides));
    __numberFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const NUMBER_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "style",
  "currency",
  "currencyDisplay",
  "currencySign",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "compactDisplay",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "roundingMode",
  "roundingPriority",
  "roundingIncrement",
  "trailingZeroDisplay"
];
function parseNumberArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = {};
  let overrides = {};
  if (!isNumber(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const value = arg1;
  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (NUMBER_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearNumberFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__numberFormatters.has(id)) {
      continue;
    }
    context.__numberFormatters.delete(id);
  }
}
{
  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }
}
/*!
  * vue-i18n v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const VERSION = "9.2.2";
function initFeatureFlags() {
  let needWarn = false;
  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }
  if (process.env.NODE_ENV !== "production" && needWarn) {
    console.warn(`You are running the esm-bundler build of vue-i18n. It is recommended to configure your bundler to explicitly replace feature flag globals with boolean literals to get proper tree-shaking in the final bundle.`);
  }
}
let code$1 = CoreWarnCodes.__EXTEND_POINT__;
const inc$1 = () => ++code$1;
const I18nWarnCodes = {
  FALLBACK_TO_ROOT: code$1,
  NOT_SUPPORTED_PRESERVE: inc$1(),
  NOT_SUPPORTED_FORMATTER: inc$1(),
  NOT_SUPPORTED_PRESERVE_DIRECTIVE: inc$1(),
  NOT_SUPPORTED_GET_CHOICE_INDEX: inc$1(),
  COMPONENT_NAME_LEGACY_COMPATIBLE: inc$1(),
  NOT_FOUND_PARENT_SCOPE: inc$1()
  // 13
};
const warnMessages = {
  [I18nWarnCodes.FALLBACK_TO_ROOT]: `Fall back to {type} '{key}' with root locale.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE]: `Not supported 'preserve'.`,
  [I18nWarnCodes.NOT_SUPPORTED_FORMATTER]: `Not supported 'formatter'.`,
  [I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE]: `Not supported 'preserveDirectiveContent'.`,
  [I18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX]: `Not supported 'getChoiceIndex'.`,
  [I18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE]: `Component name legacy compatible: '{name}' -> 'i18n'`,
  [I18nWarnCodes.NOT_FOUND_PARENT_SCOPE]: `Not found parent scope. use the global scope.`
};
function getWarnMessage(code2, ...args) {
  return format(warnMessages[code2], ...args);
}
let code = CompileErrorCodes.__EXTEND_POINT__;
const inc = () => ++code;
const I18nErrorCodes = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: code,
  // legacy module errors
  INVALID_ARGUMENT: inc(),
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: inc(),
  NOT_INSLALLED: inc(),
  NOT_AVAILABLE_IN_LEGACY_MODE: inc(),
  // directive module errors
  REQUIRED_VALUE: inc(),
  INVALID_VALUE: inc(),
  // vue-devtools errors
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: inc(),
  NOT_INSLALLED_WITH_PROVIDE: inc(),
  // unexpected error
  UNEXPECTED_ERROR: inc(),
  // not compatible legacy vue-i18n constructor
  NOT_COMPATIBLE_LEGACY_VUE_I18N: inc(),
  // bridge support vue 2.x only
  BRIDGE_SUPPORT_VUE_2_ONLY: inc(),
  // need to define `i18n` option in `allowComposition: true` and `useScope: 'local' at `useI18n``
  MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION: inc(),
  // Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly
  NOT_AVAILABLE_COMPOSITION_IN_LEGACY: inc(),
  // for enhancement
  __EXTEND_POINT__: inc()
  // 29
};
function createI18nError(code2, ...args) {
  return createCompileError(code2, null, process.env.NODE_ENV !== "production" ? { messages: errorMessages, args } : void 0);
}
const errorMessages = {
  [I18nErrorCodes.UNEXPECTED_RETURN_TYPE]: "Unexpected return type in composer",
  [I18nErrorCodes.INVALID_ARGUMENT]: "Invalid argument",
  [I18nErrorCodes.MUST_BE_CALL_SETUP_TOP]: "Must be called at the top of a `setup` function",
  [I18nErrorCodes.NOT_INSLALLED]: "Need to install with `app.use` function",
  [I18nErrorCodes.UNEXPECTED_ERROR]: "Unexpected error",
  [I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE]: "Not available in legacy mode",
  [I18nErrorCodes.REQUIRED_VALUE]: `Required in value: {0}`,
  [I18nErrorCodes.INVALID_VALUE]: `Invalid value`,
  [I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN]: `Cannot setup vue-devtools plugin`,
  [I18nErrorCodes.NOT_INSLALLED_WITH_PROVIDE]: "Need to install with `provide` function",
  [I18nErrorCodes.NOT_COMPATIBLE_LEGACY_VUE_I18N]: "Not compatible legacy VueI18n.",
  [I18nErrorCodes.BRIDGE_SUPPORT_VUE_2_ONLY]: "vue-i18n-bridge support Vue 2.x only",
  [I18nErrorCodes.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION]: "Must define ‘i18n’ option or custom block in Composition API with using local scope in Legacy API mode",
  [I18nErrorCodes.NOT_AVAILABLE_COMPOSITION_IN_LEGACY]: "Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly"
};
const TransrateVNodeSymbol = /* @__PURE__ */ makeSymbol("__transrateVNode");
const DatetimePartsSymbol = /* @__PURE__ */ makeSymbol("__datetimeParts");
const NumberPartsSymbol = /* @__PURE__ */ makeSymbol("__numberParts");
const EnableEmitter = /* @__PURE__ */ makeSymbol("__enableEmitter");
const DisableEmitter = /* @__PURE__ */ makeSymbol("__disableEmitter");
const SetPluralRulesSymbol = makeSymbol("__setPluralRules");
const InejctWithOption = /* @__PURE__ */ makeSymbol("__injectWithOption");
function handleFlatJson(obj) {
  if (!isObject(obj)) {
    return obj;
  }
  for (const key in obj) {
    if (!hasOwn(obj, key)) {
      continue;
    }
    if (!key.includes(".")) {
      if (isObject(obj[key])) {
        handleFlatJson(obj[key]);
      }
    } else {
      const subKeys = key.split(".");
      const lastIndex = subKeys.length - 1;
      let currentObj = obj;
      for (let i = 0; i < lastIndex; i++) {
        if (!(subKeys[i] in currentObj)) {
          currentObj[subKeys[i]] = {};
        }
        currentObj = currentObj[subKeys[i]];
      }
      currentObj[subKeys[lastIndex]] = obj[key];
      delete obj[key];
      if (isObject(currentObj[subKeys[lastIndex]])) {
        handleFlatJson(currentObj[subKeys[lastIndex]]);
      }
    }
  }
  return obj;
}
function getLocaleMessages(locale, options) {
  const { messages: messages2, __i18n, messageResolver, flatJson } = options;
  const ret = isPlainObject(messages2) ? messages2 : isArray(__i18n) ? {} : { [locale]: {} };
  if (isArray(__i18n)) {
    __i18n.forEach((custom) => {
      if ("locale" in custom && "resource" in custom) {
        const { locale: locale2, resource: resource2 } = custom;
        if (locale2) {
          ret[locale2] = ret[locale2] || {};
          deepCopy(resource2, ret[locale2]);
        } else {
          deepCopy(resource2, ret);
        }
      } else {
        isString(custom) && deepCopy(JSON.parse(custom), ret);
      }
    });
  }
  if (messageResolver == null && flatJson) {
    for (const key in ret) {
      if (hasOwn(ret, key)) {
        handleFlatJson(ret[key]);
      }
    }
  }
  return ret;
}
const isNotObjectOrIsArray = (val) => !isObject(val) || isArray(val);
function deepCopy(src, des) {
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
  for (const key in src) {
    if (hasOwn(src, key)) {
      if (isNotObjectOrIsArray(src[key]) || isNotObjectOrIsArray(des[key])) {
        des[key] = src[key];
      } else {
        deepCopy(src[key], des[key]);
      }
    }
  }
}
function getComponentOptions(instance) {
  return instance.type;
}
function adjustI18nResources(global2, options, componentOptions) {
  let messages2 = isObject(options.messages) ? options.messages : {};
  if ("__i18nGlobal" in componentOptions) {
    messages2 = getLocaleMessages(globalThis.locale.value, {
      messages: messages2,
      __i18n: componentOptions.__i18nGlobal
    });
  }
  const locales = Object.keys(messages2);
  if (locales.length) {
    locales.forEach((locale) => {
      global2.mergeLocaleMessage(locale, messages2[locale]);
    });
  }
  {
    if (isObject(options.datetimeFormats)) {
      const locales2 = Object.keys(options.datetimeFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          global2.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
        });
      }
    }
    if (isObject(options.numberFormats)) {
      const locales2 = Object.keys(options.numberFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          global2.mergeNumberFormat(locale, options.numberFormats[locale]);
        });
      }
    }
  }
}
function createTextNode(key) {
  return createVNode(Text, null, key, 0);
}
const DEVTOOLS_META = "__INTLIFY_META__";
let composerID = 0;
function defineCoreMissingHandler(missing) {
  return (ctx, locale, key, type) => {
    return missing(locale, key, getCurrentInstance() || void 0, type);
  };
}
const getMetaInfo = () => {
  const instance = getCurrentInstance();
  let meta = null;
  return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META]) ? { [DEVTOOLS_META]: meta } : null;
};
function createComposer(options = {}, VueI18nLegacy) {
  const { __root } = options;
  const _isGlobal = __root === void 0;
  let _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;
  const _locale = ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.locale.value : isString(options.locale) ? options.locale : DEFAULT_LOCALE
  );
  const _fallbackLocale = ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.fallbackLocale.value : isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value
  );
  const _messages = ref(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = ref(isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  let _missingWarn = __root ? __root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  let _fallbackWarn = __root ? __root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  let _fallbackRoot = __root ? __root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  let _fallbackFormat = !!options.fallbackFormat;
  let _missing = isFunction(options.missing) ? options.missing : null;
  let _runtimeMissing = isFunction(options.missing) ? defineCoreMissingHandler(options.missing) : null;
  let _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  let _warnHtmlMessage = __root ? __root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  let _escapeParameter = !!options.escapeParameter;
  const _modifiers = __root ? __root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {};
  let _pluralRules = options.pluralRules || __root && __root.pluralRules;
  let _context;
  const getCoreContext = () => {
    _isGlobal && setFallbackContext(null);
    const ctxOptions = {
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? void 0 : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? void 0 : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      messageResolver: options.messageResolver,
      __meta: { framework: "vue" }
    };
    {
      ctxOptions.datetimeFormats = _datetimeFormats.value;
      ctxOptions.numberFormats = _numberFormats.value;
      ctxOptions.__datetimeFormatters = isPlainObject(_context) ? _context.__datetimeFormatters : void 0;
      ctxOptions.__numberFormatters = isPlainObject(_context) ? _context.__numberFormatters : void 0;
    }
    if (process.env.NODE_ENV !== "production") {
      ctxOptions.__v_emitter = isPlainObject(_context) ? _context.__v_emitter : void 0;
    }
    const ctx = createCoreContext(ctxOptions);
    _isGlobal && setFallbackContext(ctx);
    return ctx;
  };
  _context = getCoreContext();
  updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed({
    get: () => _locale.value,
    set: (val) => {
      _locale.value = val;
      _context.locale = _locale.value;
    }
  });
  const fallbackLocale = computed({
    get: () => _fallbackLocale.value,
    set: (val) => {
      _fallbackLocale.value = val;
      _context.fallbackLocale = _fallbackLocale.value;
      updateFallbackLocale(_context, _locale.value, val);
    }
  });
  const messages2 = computed(() => _messages.value);
  const datetimeFormats = /* @__PURE__ */ computed(() => _datetimeFormats.value);
  const numberFormats = /* @__PURE__ */ computed(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return isFunction(_postTranslation) ? _postTranslation : null;
  }
  function setPostTranslationHandler(handler2) {
    _postTranslation = handler2;
    _context.postTranslation = handler2;
  }
  function getMissingHandler() {
    return _missing;
  }
  function setMissingHandler(handler2) {
    if (handler2 !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler2);
    }
    _missing = handler2;
    _context.missing = _runtimeMissing;
  }
  function isResolvedTranslateMessage(type, arg) {
    return type !== "translate" || !arg.resolvedMessage;
  }
  const wrapWithDeps = (fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) => {
    trackReactivityValues();
    let ret;
    if (process.env.NODE_ENV !== "production" || __INTLIFY_PROD_DEVTOOLS__) {
      try {
        setAdditionalMeta(getMetaInfo());
        if (!_isGlobal) {
          _context.fallbackContext = __root ? getFallbackContext() : void 0;
        }
        ret = fn(_context);
      } finally {
        setAdditionalMeta(null);
        if (!_isGlobal) {
          _context.fallbackContext = void 0;
        }
      }
    } else {
      ret = fn(_context);
    }
    if (isNumber(ret) && ret === NOT_REOSLVED) {
      const [key, arg2] = argumentParser();
      if (process.env.NODE_ENV !== "production" && __root && isString(key) && isResolvedTranslateMessage(warnType, arg2)) {
        if (_fallbackRoot && (isTranslateFallbackWarn(_fallbackWarn, key) || isTranslateMissingWarn(_missingWarn, key))) {
          warn(getWarnMessage(I18nWarnCodes.FALLBACK_TO_ROOT, {
            key,
            type: warnType
          }));
        }
        if (process.env.NODE_ENV !== "production") {
          const { __v_emitter: emitter } = _context;
          if (emitter && _fallbackRoot) {
            emitter.emit("fallback", {
              type: warnType,
              key,
              to: "global",
              groupId: `${warnType}:${key}`
            });
          }
        }
      }
      return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
    } else if (successCondition(ret)) {
      return ret;
    } else {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE);
    }
  };
  function t(...args) {
    return wrapWithDeps((context) => Reflect.apply(translate, null, [context, ...args]), () => parseTranslateArgs(...args), "translate", (root3) => Reflect.apply(root3.t, root3, [...args]), (key) => key, (val) => isString(val));
  }
  function rt(...args) {
    const [arg1, arg2, arg3] = args;
    if (arg3 && !isObject(arg3)) {
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
    }
    return t(...[arg1, arg2, assign({ resolvedMessage: true }, arg3 || {})]);
  }
  function d(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root3) => Reflect.apply(root3.d, root3, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString(val));
  }
  function n(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root3) => Reflect.apply(root3.n, root3, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString(val));
  }
  function normalize(values) {
    return values.map((val) => isString(val) || isNumber(val) || isBoolean(val) ? createTextNode(String(val)) : val);
  }
  const interpolate = (val) => val;
  const processor = {
    normalize,
    interpolate,
    type: "vnode"
  };
  function transrateVNode(...args) {
    return wrapWithDeps(
      (context) => {
        let ret;
        const _context2 = context;
        try {
          _context2.processor = processor;
          ret = Reflect.apply(translate, null, [_context2, ...args]);
        } finally {
          _context2.processor = null;
        }
        return ret;
      },
      () => parseTranslateArgs(...args),
      "translate",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root3) => root3[TransrateVNodeSymbol](...args),
      (key) => [createTextNode(key)],
      (val) => isArray(val)
    );
  }
  function numberParts(...args) {
    return wrapWithDeps(
      (context) => Reflect.apply(number, null, [context, ...args]),
      () => parseNumberArgs(...args),
      "number format",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root3) => root3[NumberPartsSymbol](...args),
      () => [],
      (val) => isString(val) || isArray(val)
    );
  }
  function datetimeParts(...args) {
    return wrapWithDeps(
      (context) => Reflect.apply(datetime, null, [context, ...args]),
      () => parseDateTimeArgs(...args),
      "datetime format",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root3) => root3[DatetimePartsSymbol](...args),
      () => [],
      (val) => isString(val) || isArray(val)
    );
  }
  function setPluralRules(rules) {
    _pluralRules = rules;
    _context.pluralRules = _pluralRules;
  }
  function te(key, locale2) {
    const targetLocale = isString(locale2) ? locale2 : _locale.value;
    const message = getLocaleMessage(targetLocale);
    return _context.messageResolver(message, key) !== null;
  }
  function resolveMessages(key) {
    let messages3 = null;
    const locales = fallbackWithLocaleChain(_context, _fallbackLocale.value, _locale.value);
    for (let i = 0; i < locales.length; i++) {
      const targetLocaleMessages = _messages.value[locales[i]] || {};
      const messageValue = _context.messageResolver(targetLocaleMessages, key);
      if (messageValue != null) {
        messages3 = messageValue;
        break;
      }
    }
    return messages3;
  }
  function tm(key) {
    const messages3 = resolveMessages(key);
    return messages3 != null ? messages3 : __root ? __root.tm(key) || {} : {};
  }
  function getLocaleMessage(locale2) {
    return _messages.value[locale2] || {};
  }
  function setLocaleMessage(locale2, message) {
    _messages.value[locale2] = message;
    _context.messages = _messages.value;
  }
  function mergeLocaleMessage(locale2, message) {
    _messages.value[locale2] = _messages.value[locale2] || {};
    deepCopy(message, _messages.value[locale2]);
    _context.messages = _messages.value;
  }
  function getDateTimeFormat(locale2) {
    return _datetimeFormats.value[locale2] || {};
  }
  function setDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = format2;
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function mergeDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = assign(_datetimeFormats.value[locale2] || {}, format2);
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function getNumberFormat(locale2) {
    return _numberFormats.value[locale2] || {};
  }
  function setNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = format2;
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  function mergeNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = assign(_numberFormats.value[locale2] || {}, format2);
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  composerID++;
  if (__root && inBrowser) {
    watch(__root.locale, (val) => {
      if (_inheritLocale) {
        _locale.value = val;
        _context.locale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
    watch(__root.fallbackLocale, (val) => {
      if (_inheritLocale) {
        _fallbackLocale.value = val;
        _context.fallbackLocale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
  }
  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale() {
      return _inheritLocale;
    },
    set inheritLocale(val) {
      _inheritLocale = val;
      if (val && __root) {
        _locale.value = __root.locale.value;
        _fallbackLocale.value = __root.fallbackLocale.value;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    },
    get availableLocales() {
      return Object.keys(_messages.value).sort();
    },
    messages: messages2,
    get modifiers() {
      return _modifiers;
    },
    get pluralRules() {
      return _pluralRules || {};
    },
    get isGlobal() {
      return _isGlobal;
    },
    get missingWarn() {
      return _missingWarn;
    },
    set missingWarn(val) {
      _missingWarn = val;
      _context.missingWarn = _missingWarn;
    },
    get fallbackWarn() {
      return _fallbackWarn;
    },
    set fallbackWarn(val) {
      _fallbackWarn = val;
      _context.fallbackWarn = _fallbackWarn;
    },
    get fallbackRoot() {
      return _fallbackRoot;
    },
    set fallbackRoot(val) {
      _fallbackRoot = val;
    },
    get fallbackFormat() {
      return _fallbackFormat;
    },
    set fallbackFormat(val) {
      _fallbackFormat = val;
      _context.fallbackFormat = _fallbackFormat;
    },
    get warnHtmlMessage() {
      return _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      _warnHtmlMessage = val;
      _context.warnHtmlMessage = val;
    },
    get escapeParameter() {
      return _escapeParameter;
    },
    set escapeParameter(val) {
      _escapeParameter = val;
      _context.escapeParameter = val;
    },
    t,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [SetPluralRulesSymbol]: setPluralRules
  };
  {
    composer.datetimeFormats = datetimeFormats;
    composer.numberFormats = numberFormats;
    composer.rt = rt;
    composer.te = te;
    composer.tm = tm;
    composer.d = d;
    composer.n = n;
    composer.getDateTimeFormat = getDateTimeFormat;
    composer.setDateTimeFormat = setDateTimeFormat;
    composer.mergeDateTimeFormat = mergeDateTimeFormat;
    composer.getNumberFormat = getNumberFormat;
    composer.setNumberFormat = setNumberFormat;
    composer.mergeNumberFormat = mergeNumberFormat;
    composer[InejctWithOption] = options.__injectWithOption;
    composer[TransrateVNodeSymbol] = transrateVNode;
    composer[DatetimePartsSymbol] = datetimeParts;
    composer[NumberPartsSymbol] = numberParts;
  }
  if (process.env.NODE_ENV !== "production") {
    composer[EnableEmitter] = (emitter) => {
      _context.__v_emitter = emitter;
    };
    composer[DisableEmitter] = () => {
      _context.__v_emitter = void 0;
    };
  }
  return composer;
}
function convertComposerOptions(options) {
  const locale = isString(options.locale) ? options.locale : DEFAULT_LOCALE;
  const fallbackLocale = isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : locale;
  const missing = isFunction(options.missing) ? options.missing : void 0;
  const missingWarn = isBoolean(options.silentTranslationWarn) || isRegExp(options.silentTranslationWarn) ? !options.silentTranslationWarn : true;
  const fallbackWarn = isBoolean(options.silentFallbackWarn) || isRegExp(options.silentFallbackWarn) ? !options.silentFallbackWarn : true;
  const fallbackRoot = isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  const fallbackFormat = !!options.formatFallbackMessages;
  const modifiers = isPlainObject(options.modifiers) ? options.modifiers : {};
  const pluralizationRules = options.pluralizationRules;
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : void 0;
  const warnHtmlMessage = isString(options.warnHtmlInMessage) ? options.warnHtmlInMessage !== "off" : true;
  const escapeParameter = !!options.escapeParameterHtml;
  const inheritLocale = isBoolean(options.sync) ? options.sync : true;
  if (process.env.NODE_ENV !== "production" && options.formatter) {
    warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_FORMATTER));
  }
  if (process.env.NODE_ENV !== "production" && options.preserveDirectiveContent) {
    warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE));
  }
  let messages2 = options.messages;
  if (isPlainObject(options.sharedMessages)) {
    const sharedMessages = options.sharedMessages;
    const locales = Object.keys(sharedMessages);
    messages2 = locales.reduce((messages3, locale2) => {
      const message = messages3[locale2] || (messages3[locale2] = {});
      assign(message, sharedMessages[locale2]);
      return messages3;
    }, messages2 || {});
  }
  const { __i18n, __root, __injectWithOption } = options;
  const datetimeFormats = options.datetimeFormats;
  const numberFormats = options.numberFormats;
  const flatJson = options.flatJson;
  return {
    locale,
    fallbackLocale,
    messages: messages2,
    flatJson,
    datetimeFormats,
    numberFormats,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackRoot,
    fallbackFormat,
    modifiers,
    pluralRules: pluralizationRules,
    postTranslation,
    warnHtmlMessage,
    escapeParameter,
    messageResolver: options.messageResolver,
    inheritLocale,
    __i18n,
    __root,
    __injectWithOption
  };
}
function createVueI18n(options = {}, VueI18nLegacy) {
  {
    const composer = createComposer(convertComposerOptions(options));
    const vueI18n = {
      // id
      id: composer.id,
      // locale
      get locale() {
        return composer.locale.value;
      },
      set locale(val) {
        composer.locale.value = val;
      },
      // fallbackLocale
      get fallbackLocale() {
        return composer.fallbackLocale.value;
      },
      set fallbackLocale(val) {
        composer.fallbackLocale.value = val;
      },
      // messages
      get messages() {
        return composer.messages.value;
      },
      // datetimeFormats
      get datetimeFormats() {
        return composer.datetimeFormats.value;
      },
      // numberFormats
      get numberFormats() {
        return composer.numberFormats.value;
      },
      // availableLocales
      get availableLocales() {
        return composer.availableLocales;
      },
      // formatter
      get formatter() {
        process.env.NODE_ENV !== "production" && warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_FORMATTER));
        return {
          interpolate() {
            return [];
          }
        };
      },
      set formatter(val) {
        process.env.NODE_ENV !== "production" && warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_FORMATTER));
      },
      // missing
      get missing() {
        return composer.getMissingHandler();
      },
      set missing(handler2) {
        composer.setMissingHandler(handler2);
      },
      // silentTranslationWarn
      get silentTranslationWarn() {
        return isBoolean(composer.missingWarn) ? !composer.missingWarn : composer.missingWarn;
      },
      set silentTranslationWarn(val) {
        composer.missingWarn = isBoolean(val) ? !val : val;
      },
      // silentFallbackWarn
      get silentFallbackWarn() {
        return isBoolean(composer.fallbackWarn) ? !composer.fallbackWarn : composer.fallbackWarn;
      },
      set silentFallbackWarn(val) {
        composer.fallbackWarn = isBoolean(val) ? !val : val;
      },
      // modifiers
      get modifiers() {
        return composer.modifiers;
      },
      // formatFallbackMessages
      get formatFallbackMessages() {
        return composer.fallbackFormat;
      },
      set formatFallbackMessages(val) {
        composer.fallbackFormat = val;
      },
      // postTranslation
      get postTranslation() {
        return composer.getPostTranslationHandler();
      },
      set postTranslation(handler2) {
        composer.setPostTranslationHandler(handler2);
      },
      // sync
      get sync() {
        return composer.inheritLocale;
      },
      set sync(val) {
        composer.inheritLocale = val;
      },
      // warnInHtmlMessage
      get warnHtmlInMessage() {
        return composer.warnHtmlMessage ? "warn" : "off";
      },
      set warnHtmlInMessage(val) {
        composer.warnHtmlMessage = val !== "off";
      },
      // escapeParameterHtml
      get escapeParameterHtml() {
        return composer.escapeParameter;
      },
      set escapeParameterHtml(val) {
        composer.escapeParameter = val;
      },
      // preserveDirectiveContent
      get preserveDirectiveContent() {
        process.env.NODE_ENV !== "production" && warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE));
        return true;
      },
      set preserveDirectiveContent(val) {
        process.env.NODE_ENV !== "production" && warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE));
      },
      // pluralizationRules
      get pluralizationRules() {
        return composer.pluralRules || {};
      },
      // for internal
      __composer: composer,
      // t
      t(...args) {
        const [arg1, arg2, arg3] = args;
        const options2 = {};
        let list = null;
        let named = null;
        if (!isString(arg1)) {
          throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
        }
        const key = arg1;
        if (isString(arg2)) {
          options2.locale = arg2;
        } else if (isArray(arg2)) {
          list = arg2;
        } else if (isPlainObject(arg2)) {
          named = arg2;
        }
        if (isArray(arg3)) {
          list = arg3;
        } else if (isPlainObject(arg3)) {
          named = arg3;
        }
        return Reflect.apply(composer.t, composer, [
          key,
          list || named || {},
          options2
        ]);
      },
      rt(...args) {
        return Reflect.apply(composer.rt, composer, [...args]);
      },
      // tc
      tc(...args) {
        const [arg1, arg2, arg3] = args;
        const options2 = { plural: 1 };
        let list = null;
        let named = null;
        if (!isString(arg1)) {
          throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
        }
        const key = arg1;
        if (isString(arg2)) {
          options2.locale = arg2;
        } else if (isNumber(arg2)) {
          options2.plural = arg2;
        } else if (isArray(arg2)) {
          list = arg2;
        } else if (isPlainObject(arg2)) {
          named = arg2;
        }
        if (isString(arg3)) {
          options2.locale = arg3;
        } else if (isArray(arg3)) {
          list = arg3;
        } else if (isPlainObject(arg3)) {
          named = arg3;
        }
        return Reflect.apply(composer.t, composer, [
          key,
          list || named || {},
          options2
        ]);
      },
      // te
      te(key, locale) {
        return composer.te(key, locale);
      },
      // tm
      tm(key) {
        return composer.tm(key);
      },
      // getLocaleMessage
      getLocaleMessage(locale) {
        return composer.getLocaleMessage(locale);
      },
      // setLocaleMessage
      setLocaleMessage(locale, message) {
        composer.setLocaleMessage(locale, message);
      },
      // mergeLocaleMessage
      mergeLocaleMessage(locale, message) {
        composer.mergeLocaleMessage(locale, message);
      },
      // d
      d(...args) {
        return Reflect.apply(composer.d, composer, [...args]);
      },
      // getDateTimeFormat
      getDateTimeFormat(locale) {
        return composer.getDateTimeFormat(locale);
      },
      // setDateTimeFormat
      setDateTimeFormat(locale, format2) {
        composer.setDateTimeFormat(locale, format2);
      },
      // mergeDateTimeFormat
      mergeDateTimeFormat(locale, format2) {
        composer.mergeDateTimeFormat(locale, format2);
      },
      // n
      n(...args) {
        return Reflect.apply(composer.n, composer, [...args]);
      },
      // getNumberFormat
      getNumberFormat(locale) {
        return composer.getNumberFormat(locale);
      },
      // setNumberFormat
      setNumberFormat(locale, format2) {
        composer.setNumberFormat(locale, format2);
      },
      // mergeNumberFormat
      mergeNumberFormat(locale, format2) {
        composer.mergeNumberFormat(locale, format2);
      },
      // getChoiceIndex
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getChoiceIndex(choice, choicesLength) {
        process.env.NODE_ENV !== "production" && warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX));
        return -1;
      },
      // for internal
      __onComponentInstanceCreated(target) {
        const { componentInstanceCreatedListener } = options;
        if (componentInstanceCreatedListener) {
          componentInstanceCreatedListener(target, vueI18n);
        }
      }
    };
    if (process.env.NODE_ENV !== "production") {
      vueI18n.__enableEmitter = (emitter) => {
        const __composer = composer;
        __composer[EnableEmitter] && __composer[EnableEmitter](emitter);
      };
      vueI18n.__disableEmitter = () => {
        const __composer = composer;
        __composer[DisableEmitter] && __composer[DisableEmitter]();
      };
    }
    return vueI18n;
  }
}
const baseFormatProps = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
    validator: (val) => val === "parent" || val === "global",
    default: "parent"
    /* ComponetI18nScope */
  },
  i18n: {
    type: Object
  }
};
function getInterpolateArg({ slots }, keys) {
  if (keys.length === 1 && keys[0] === "default") {
    const ret = slots.default ? slots.default() : [];
    return ret.reduce((slot, current) => {
      return slot = [
        ...slot,
        ...isArray(current.children) ? current.children : [current]
      ];
    }, []);
  } else {
    return keys.reduce((arg, key) => {
      const slot = slots[key];
      if (slot) {
        arg[key] = slot();
      }
      return arg;
    }, {});
  }
}
function getFragmentableTag(tag) {
  return Fragment;
}
const Translation = (
  /* defineComponent */
  {
    /* eslint-disable */
    name: "i18n-t",
    props: assign({
      keypath: {
        type: String,
        required: true
      },
      plural: {
        type: [Number, String],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validator: (val) => isNumber(val) || !isNaN(val)
      }
    }, baseFormatProps),
    /* eslint-enable */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props, context) {
      const { slots, attrs } = context;
      const i18n = props.i18n || useI18n({
        useScope: props.scope,
        __useComponent: true
      });
      return () => {
        const keys = Object.keys(slots).filter((key) => key !== "_");
        const options = {};
        if (props.locale) {
          options.locale = props.locale;
        }
        if (props.plural !== void 0) {
          options.plural = isString(props.plural) ? +props.plural : props.plural;
        }
        const arg = getInterpolateArg(context, keys);
        const children = i18n[TransrateVNodeSymbol](props.keypath, arg, options);
        const assignedAttrs = assign({}, attrs);
        const tag = isString(props.tag) || isObject(props.tag) ? props.tag : getFragmentableTag();
        return h(tag, assignedAttrs, children);
      };
    }
  }
);
function isVNode(target) {
  return isArray(target) && !isString(target[0]);
}
function renderFormatter(props, context, slotKeys, partFormatter) {
  const { slots, attrs } = context;
  return () => {
    const options = { part: true };
    let overrides = {};
    if (props.locale) {
      options.locale = props.locale;
    }
    if (isString(props.format)) {
      options.key = props.format;
    } else if (isObject(props.format)) {
      if (isString(props.format.key)) {
        options.key = props.format.key;
      }
      overrides = Object.keys(props.format).reduce((options2, prop) => {
        return slotKeys.includes(prop) ? assign({}, options2, { [prop]: props.format[prop] }) : options2;
      }, {});
    }
    const parts = partFormatter(...[props.value, options, overrides]);
    let children = [options.key];
    if (isArray(parts)) {
      children = parts.map((part, index3) => {
        const slot = slots[part.type];
        const node = slot ? slot({ [part.type]: part.value, index: index3, parts }) : [part.value];
        if (isVNode(node)) {
          node[0].key = `${part.type}-${index3}`;
        }
        return node;
      });
    } else if (isString(parts)) {
      children = [parts];
    }
    const assignedAttrs = assign({}, attrs);
    const tag = isString(props.tag) || isObject(props.tag) ? props.tag : getFragmentableTag();
    return h(tag, assignedAttrs, children);
  };
}
const NumberFormat = (
  /* defineComponent */
  {
    /* eslint-disable */
    name: "i18n-n",
    props: assign({
      value: {
        type: Number,
        required: true
      },
      format: {
        type: [String, Object]
      }
    }, baseFormatProps),
    /* eslint-enable */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props, context) {
      const i18n = props.i18n || useI18n({ useScope: "parent", __useComponent: true });
      return renderFormatter(props, context, NUMBER_FORMAT_OPTIONS_KEYS, (...args) => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        i18n[NumberPartsSymbol](...args)
      ));
    }
  }
);
const DatetimeFormat = (
  /*defineComponent */
  {
    /* eslint-disable */
    name: "i18n-d",
    props: assign({
      value: {
        type: [Number, Date],
        required: true
      },
      format: {
        type: [String, Object]
      }
    }, baseFormatProps),
    /* eslint-enable */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup(props, context) {
      const i18n = props.i18n || useI18n({ useScope: "parent", __useComponent: true });
      return renderFormatter(props, context, DATETIME_FORMAT_OPTIONS_KEYS, (...args) => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        i18n[DatetimePartsSymbol](...args)
      ));
    }
  }
);
function getComposer$2(i18n, instance) {
  const i18nInternal = i18n;
  if (i18n.mode === "composition") {
    return i18nInternal.__getInstance(instance) || i18n.global;
  } else {
    const vueI18n = i18nInternal.__getInstance(instance);
    return vueI18n != null ? vueI18n.__composer : i18n.global.__composer;
  }
}
function vTDirective(i18n) {
  const _process = (binding) => {
    const { instance, modifiers, value } = binding;
    if (!instance || !instance.$) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const composer = getComposer$2(i18n, instance.$);
    if (process.env.NODE_ENV !== "production" && modifiers.preserve) {
      warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE));
    }
    const parsedValue = parseValue(value);
    return [
      Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]),
      composer
    ];
  };
  const register = (el, binding) => {
    const [textContent, composer] = _process(binding);
    el.__composer = composer;
    el.textContent = textContent;
  };
  const unregister = (el) => {
    if (el.__composer) {
      el.__composer = void 0;
      delete el.__composer;
    }
  };
  const update = (el, { value }) => {
    if (el.__composer) {
      const composer = el.__composer;
      const parsedValue = parseValue(value);
      el.textContent = Reflect.apply(composer.t, composer, [
        ...makeParams(parsedValue)
      ]);
    }
  };
  const getSSRProps = (binding) => {
    const [textContent] = _process(binding);
    return { textContent };
  };
  return {
    created: register,
    unmounted: unregister,
    beforeUpdate: update,
    getSSRProps
  };
}
function parseValue(value) {
  if (isString(value)) {
    return { path: value };
  } else if (isPlainObject(value)) {
    if (!("path" in value)) {
      throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, "path");
    }
    return value;
  } else {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
}
function makeParams(value) {
  const { path, locale, args, choice, plural } = value;
  const options = {};
  const named = args || {};
  if (isString(locale)) {
    options.locale = locale;
  }
  if (isNumber(choice)) {
    options.plural = choice;
  }
  if (isNumber(plural)) {
    options.plural = plural;
  }
  return [path, named, options];
}
function apply(app, i18n, ...options) {
  const pluginOptions = isPlainObject(options[0]) ? options[0] : {};
  const useI18nComponentName = !!pluginOptions.useI18nComponentName;
  const globalInstall = isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true;
  if (process.env.NODE_ENV !== "production" && globalInstall && useI18nComponentName) {
    warn(getWarnMessage(I18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE, {
      name: Translation.name
    }));
  }
  if (globalInstall) {
    app.component(!useI18nComponentName ? Translation.name : "i18n", Translation);
    app.component(NumberFormat.name, NumberFormat);
    app.component(DatetimeFormat.name, DatetimeFormat);
  }
  {
    app.directive("t", vTDirective(i18n));
  }
}
const VUE_I18N_COMPONENT_TYPES = "vue-i18n: composer properties";
let devtoolsApi;
async function enableDevTools(app, i18n) {
  return new Promise((resolve, reject) => {
    try {
      setupDevtoolsPlugin({
        id: "vue-devtools-plugin-vue-i18n",
        label: VueDevToolsLabels[
          "vue-devtools-plugin-vue-i18n"
          /* PLUGIN */
        ],
        packageName: "vue-i18n",
        homepage: "https://vue-i18n.intlify.dev",
        logo: "https://vue-i18n.intlify.dev/vue-i18n-devtools-logo.png",
        componentStateTypes: [VUE_I18N_COMPONENT_TYPES],
        app
        // eslint-disable-line @typescript-eslint/no-explicit-any
      }, (api) => {
        devtoolsApi = api;
        api.on.visitComponentTree(({ componentInstance, treeNode }) => {
          updateComponentTreeTags(componentInstance, treeNode, i18n);
        });
        api.on.inspectComponent(({ componentInstance, instanceData }) => {
          if (componentInstance.vnode.el && componentInstance.vnode.el.__VUE_I18N__ && instanceData) {
            if (i18n.mode === "legacy") {
              if (componentInstance.vnode.el.__VUE_I18N__ !== i18n.global.__composer) {
                inspectComposer(instanceData, componentInstance.vnode.el.__VUE_I18N__);
              }
            } else {
              inspectComposer(instanceData, componentInstance.vnode.el.__VUE_I18N__);
            }
          }
        });
        api.addInspector({
          id: "vue-i18n-resource-inspector",
          label: VueDevToolsLabels[
            "vue-i18n-resource-inspector"
            /* CUSTOM_INSPECTOR */
          ],
          icon: "language",
          treeFilterPlaceholder: VueDevToolsPlaceholders[
            "vue-i18n-resource-inspector"
            /* CUSTOM_INSPECTOR */
          ]
        });
        api.on.getInspectorTree((payload) => {
          if (payload.app === app && payload.inspectorId === "vue-i18n-resource-inspector") {
            registerScope(payload, i18n);
          }
        });
        const roots = /* @__PURE__ */ new Map();
        api.on.getInspectorState(async (payload) => {
          if (payload.app === app && payload.inspectorId === "vue-i18n-resource-inspector") {
            api.unhighlightElement();
            inspectScope(payload, i18n);
            if (payload.nodeId === "global") {
              if (!roots.has(payload.app)) {
                const [root3] = await api.getComponentInstances(payload.app);
                roots.set(payload.app, root3);
              }
              api.highlightElement(roots.get(payload.app));
            } else {
              const instance = getComponentInstance(payload.nodeId, i18n);
              instance && api.highlightElement(instance);
            }
          }
        });
        api.on.editInspectorState((payload) => {
          if (payload.app === app && payload.inspectorId === "vue-i18n-resource-inspector") {
            editScope(payload, i18n);
          }
        });
        api.addTimelineLayer({
          id: "vue-i18n-timeline",
          label: VueDevToolsLabels[
            "vue-i18n-timeline"
            /* TIMELINE */
          ],
          color: VueDevToolsTimelineColors[
            "vue-i18n-timeline"
            /* TIMELINE */
          ]
        });
        resolve(true);
      });
    } catch (e) {
      console.error(e);
      reject(false);
    }
  });
}
function getI18nScopeLable(instance) {
  return instance.type.name || instance.type.displayName || instance.type.__file || "Anonymous";
}
function updateComponentTreeTags(instance, treeNode, i18n) {
  const global2 = i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
  if (instance && instance.vnode.el && instance.vnode.el.__VUE_I18N__) {
    if (instance.vnode.el.__VUE_I18N__ !== global2) {
      const tag = {
        label: `i18n (${getI18nScopeLable(instance)} Scope)`,
        textColor: 0,
        backgroundColor: 16764185
      };
      treeNode.tags.push(tag);
    }
  }
}
function inspectComposer(instanceData, composer) {
  const type = VUE_I18N_COMPONENT_TYPES;
  instanceData.state.push({
    type,
    key: "locale",
    editable: true,
    value: composer.locale.value
  });
  instanceData.state.push({
    type,
    key: "availableLocales",
    editable: false,
    value: composer.availableLocales
  });
  instanceData.state.push({
    type,
    key: "fallbackLocale",
    editable: true,
    value: composer.fallbackLocale.value
  });
  instanceData.state.push({
    type,
    key: "inheritLocale",
    editable: true,
    value: composer.inheritLocale
  });
  instanceData.state.push({
    type,
    key: "messages",
    editable: false,
    value: getLocaleMessageValue(composer.messages.value)
  });
  {
    instanceData.state.push({
      type,
      key: "datetimeFormats",
      editable: false,
      value: composer.datetimeFormats.value
    });
    instanceData.state.push({
      type,
      key: "numberFormats",
      editable: false,
      value: composer.numberFormats.value
    });
  }
}
function getLocaleMessageValue(messages2) {
  const value = {};
  Object.keys(messages2).forEach((key) => {
    const v = messages2[key];
    if (isFunction(v) && "source" in v) {
      value[key] = getMessageFunctionDetails(v);
    } else if (isObject(v)) {
      value[key] = getLocaleMessageValue(v);
    } else {
      value[key] = v;
    }
  });
  return value;
}
const ESC = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "&": "&amp;"
};
function escape(s) {
  return s.replace(/[<>"&]/g, escapeChar);
}
function escapeChar(a) {
  return ESC[a] || a;
}
function getMessageFunctionDetails(func) {
  const argString = func.source ? `("${escape(func.source)}")` : `(?)`;
  return {
    _custom: {
      type: "function",
      display: `<span>ƒ</span> ${argString}`
    }
  };
}
function registerScope(payload, i18n) {
  payload.rootNodes.push({
    id: "global",
    label: "Global Scope"
  });
  const global2 = i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
  for (const [keyInstance, instance] of i18n.__instances) {
    const composer = i18n.mode === "composition" ? instance : instance.__composer;
    if (global2 === composer) {
      continue;
    }
    payload.rootNodes.push({
      id: composer.id.toString(),
      label: `${getI18nScopeLable(keyInstance)} Scope`
    });
  }
}
function getComponentInstance(nodeId, i18n) {
  let instance = null;
  if (nodeId !== "global") {
    for (const [component, composer] of i18n.__instances.entries()) {
      if (composer.id.toString() === nodeId) {
        instance = component;
        break;
      }
    }
  }
  return instance;
}
function getComposer$1(nodeId, i18n) {
  if (nodeId === "global") {
    return i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
  } else {
    const instance = Array.from(i18n.__instances.values()).find((item) => item.id.toString() === nodeId);
    if (instance) {
      return i18n.mode === "composition" ? instance : instance.__composer;
    } else {
      return null;
    }
  }
}
function inspectScope(payload, i18n) {
  const composer = getComposer$1(payload.nodeId, i18n);
  if (composer) {
    payload.state = makeScopeInspectState(composer);
  }
  return null;
}
function makeScopeInspectState(composer) {
  const state = {};
  const localeType = "Locale related info";
  const localeStates = [
    {
      type: localeType,
      key: "locale",
      editable: true,
      value: composer.locale.value
    },
    {
      type: localeType,
      key: "fallbackLocale",
      editable: true,
      value: composer.fallbackLocale.value
    },
    {
      type: localeType,
      key: "availableLocales",
      editable: false,
      value: composer.availableLocales
    },
    {
      type: localeType,
      key: "inheritLocale",
      editable: true,
      value: composer.inheritLocale
    }
  ];
  state[localeType] = localeStates;
  const localeMessagesType = "Locale messages info";
  const localeMessagesStates = [
    {
      type: localeMessagesType,
      key: "messages",
      editable: false,
      value: getLocaleMessageValue(composer.messages.value)
    }
  ];
  state[localeMessagesType] = localeMessagesStates;
  {
    const datetimeFormatsType = "Datetime formats info";
    const datetimeFormatsStates = [
      {
        type: datetimeFormatsType,
        key: "datetimeFormats",
        editable: false,
        value: composer.datetimeFormats.value
      }
    ];
    state[datetimeFormatsType] = datetimeFormatsStates;
    const numberFormatsType = "Datetime formats info";
    const numberFormatsStates = [
      {
        type: numberFormatsType,
        key: "numberFormats",
        editable: false,
        value: composer.numberFormats.value
      }
    ];
    state[numberFormatsType] = numberFormatsStates;
  }
  return state;
}
function addTimelineEvent(event, payload) {
  if (devtoolsApi) {
    let groupId;
    if (payload && "groupId" in payload) {
      groupId = payload.groupId;
      delete payload.groupId;
    }
    devtoolsApi.addTimelineEvent({
      layerId: "vue-i18n-timeline",
      event: {
        title: event,
        groupId,
        time: Date.now(),
        meta: {},
        data: payload || {},
        logType: event === "compile-error" ? "error" : event === "fallback" || event === "missing" ? "warning" : "default"
      }
    });
  }
}
function editScope(payload, i18n) {
  const composer = getComposer$1(payload.nodeId, i18n);
  if (composer) {
    const [field] = payload.path;
    if (field === "locale" && isString(payload.state.value)) {
      composer.locale.value = payload.state.value;
    } else if (field === "fallbackLocale" && (isString(payload.state.value) || isArray(payload.state.value) || isObject(payload.state.value))) {
      composer.fallbackLocale.value = payload.state.value;
    } else if (field === "inheritLocale" && isBoolean(payload.state.value)) {
      composer.inheritLocale = payload.state.value;
    }
  }
}
function defineMixin(vuei18n, composer, i18n) {
  return {
    beforeCreate() {
      const instance = getCurrentInstance();
      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
      }
      const options = this.$options;
      if (options.i18n) {
        const optionsI18n = options.i18n;
        if (options.__i18n) {
          optionsI18n.__i18n = options.__i18n;
        }
        optionsI18n.__root = composer;
        if (this === this.$root) {
          this.$i18n = mergeToRoot(vuei18n, optionsI18n);
        } else {
          optionsI18n.__injectWithOption = true;
          this.$i18n = createVueI18n(optionsI18n);
        }
      } else if (options.__i18n) {
        if (this === this.$root) {
          this.$i18n = mergeToRoot(vuei18n, options);
        } else {
          this.$i18n = createVueI18n({
            __i18n: options.__i18n,
            __injectWithOption: true,
            __root: composer
          });
        }
      } else {
        this.$i18n = vuei18n;
      }
      if (options.__i18nGlobal) {
        adjustI18nResources(composer, options, options);
      }
      vuei18n.__onComponentInstanceCreated(this.$i18n);
      i18n.__setInstance(instance, this.$i18n);
      this.$t = (...args) => this.$i18n.t(...args);
      this.$rt = (...args) => this.$i18n.rt(...args);
      this.$tc = (...args) => this.$i18n.tc(...args);
      this.$te = (key, locale) => this.$i18n.te(key, locale);
      this.$d = (...args) => this.$i18n.d(...args);
      this.$n = (...args) => this.$i18n.n(...args);
      this.$tm = (key) => this.$i18n.tm(key);
    },
    mounted() {
      if ((process.env.NODE_ENV !== "production" || false) && true && this.$el && this.$i18n) {
        this.$el.__VUE_I18N__ = this.$i18n.__composer;
        const emitter = this.__v_emitter = createEmitter();
        const _vueI18n = this.$i18n;
        _vueI18n.__enableEmitter && _vueI18n.__enableEmitter(emitter);
        emitter.on("*", addTimelineEvent);
      }
    },
    unmounted() {
      const instance = getCurrentInstance();
      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
      }
      if ((process.env.NODE_ENV !== "production" || false) && true && this.$el && this.$el.__VUE_I18N__) {
        if (this.__v_emitter) {
          this.__v_emitter.off("*", addTimelineEvent);
          delete this.__v_emitter;
        }
        if (this.$i18n) {
          const _vueI18n = this.$i18n;
          _vueI18n.__disableEmitter && _vueI18n.__disableEmitter();
          delete this.$el.__VUE_I18N__;
        }
      }
      delete this.$t;
      delete this.$rt;
      delete this.$tc;
      delete this.$te;
      delete this.$d;
      delete this.$n;
      delete this.$tm;
      i18n.__deleteInstance(instance);
      delete this.$i18n;
    }
  };
}
function mergeToRoot(root3, options) {
  root3.locale = options.locale || root3.locale;
  root3.fallbackLocale = options.fallbackLocale || root3.fallbackLocale;
  root3.missing = options.missing || root3.missing;
  root3.silentTranslationWarn = options.silentTranslationWarn || root3.silentFallbackWarn;
  root3.silentFallbackWarn = options.silentFallbackWarn || root3.silentFallbackWarn;
  root3.formatFallbackMessages = options.formatFallbackMessages || root3.formatFallbackMessages;
  root3.postTranslation = options.postTranslation || root3.postTranslation;
  root3.warnHtmlInMessage = options.warnHtmlInMessage || root3.warnHtmlInMessage;
  root3.escapeParameterHtml = options.escapeParameterHtml || root3.escapeParameterHtml;
  root3.sync = options.sync || root3.sync;
  root3.__composer[SetPluralRulesSymbol](options.pluralizationRules || root3.pluralizationRules);
  const messages2 = getLocaleMessages(root3.locale, {
    messages: options.messages,
    __i18n: options.__i18n
  });
  Object.keys(messages2).forEach((locale) => root3.mergeLocaleMessage(locale, messages2[locale]));
  if (options.datetimeFormats) {
    Object.keys(options.datetimeFormats).forEach((locale) => root3.mergeDateTimeFormat(locale, options.datetimeFormats[locale]));
  }
  if (options.numberFormats) {
    Object.keys(options.numberFormats).forEach((locale) => root3.mergeNumberFormat(locale, options.numberFormats[locale]));
  }
  return root3;
}
const I18nInjectionKey = /* @__PURE__ */ makeSymbol("global-vue-i18n");
function createI18n(options = {}, VueI18nLegacy) {
  const __legacyMode = isBoolean(options.legacy) ? options.legacy : true;
  const __globalInjection = isBoolean(options.globalInjection) ? options.globalInjection : true;
  const __allowComposition = __legacyMode ? !!options.allowComposition : true;
  const __instances = /* @__PURE__ */ new Map();
  const [globalScope, __global] = createGlobal(options, __legacyMode);
  const symbol = makeSymbol(process.env.NODE_ENV !== "production" ? "vue-i18n" : "");
  function __getInstance(component) {
    return __instances.get(component) || null;
  }
  function __setInstance(component, instance) {
    __instances.set(component, instance);
  }
  function __deleteInstance(component) {
    __instances.delete(component);
  }
  {
    const i18n = {
      // mode
      get mode() {
        return __legacyMode ? "legacy" : "composition";
      },
      // allowComposition
      get allowComposition() {
        return __allowComposition;
      },
      // install plugin
      async install(app, ...options2) {
        if ((process.env.NODE_ENV !== "production" || false) && true) {
          app.__VUE_I18N__ = i18n;
        }
        app.__VUE_I18N_SYMBOL__ = symbol;
        app.provide(app.__VUE_I18N_SYMBOL__, i18n);
        if (!__legacyMode && __globalInjection) {
          injectGlobalFields(app, i18n.global);
        }
        {
          apply(app, i18n, ...options2);
        }
        if (__legacyMode) {
          app.mixin(defineMixin(__global, __global.__composer, i18n));
        }
        const unmountApp = app.unmount;
        app.unmount = () => {
          i18n.dispose();
          unmountApp();
        };
        if ((process.env.NODE_ENV !== "production" || false) && true) {
          const ret = await enableDevTools(app, i18n);
          if (!ret) {
            throw createI18nError(I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN);
          }
          const emitter = createEmitter();
          if (__legacyMode) {
            const _vueI18n = __global;
            _vueI18n.__enableEmitter && _vueI18n.__enableEmitter(emitter);
          } else {
            const _composer = __global;
            _composer[EnableEmitter] && _composer[EnableEmitter](emitter);
          }
          emitter.on("*", addTimelineEvent);
        }
      },
      // global accessor
      get global() {
        return __global;
      },
      dispose() {
        globalScope.stop();
      },
      // @internal
      __instances,
      // @internal
      __getInstance,
      // @internal
      __setInstance,
      // @internal
      __deleteInstance
    };
    return i18n;
  }
}
function useI18n(options = {}) {
  const instance = getCurrentInstance();
  if (instance == null) {
    throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP);
  }
  if (!instance.isCE && instance.appContext.app != null && !instance.appContext.app.__VUE_I18N_SYMBOL__) {
    throw createI18nError(I18nErrorCodes.NOT_INSLALLED);
  }
  const i18n = getI18nInstance(instance);
  const global2 = getGlobalComposer(i18n);
  const componentOptions = getComponentOptions(instance);
  const scope = getScope(options, componentOptions);
  {
    if (i18n.mode === "legacy" && !options.__useComponent) {
      if (!i18n.allowComposition) {
        throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE);
      }
      return useI18nForLegacy(instance, scope, global2, options);
    }
  }
  if (scope === "global") {
    adjustI18nResources(global2, options, componentOptions);
    return global2;
  }
  if (scope === "parent") {
    let composer2 = getComposer(i18n, instance, options.__useComponent);
    if (composer2 == null) {
      if (process.env.NODE_ENV !== "production") {
        warn(getWarnMessage(I18nWarnCodes.NOT_FOUND_PARENT_SCOPE));
      }
      composer2 = global2;
    }
    return composer2;
  }
  const i18nInternal = i18n;
  let composer = i18nInternal.__getInstance(instance);
  if (composer == null) {
    const composerOptions = assign({}, options);
    if ("__i18n" in componentOptions) {
      composerOptions.__i18n = componentOptions.__i18n;
    }
    if (global2) {
      composerOptions.__root = global2;
    }
    composer = createComposer(composerOptions);
    setupLifeCycle(i18nInternal, instance, composer);
    i18nInternal.__setInstance(instance, composer);
  }
  return composer;
}
function createGlobal(options, legacyMode, VueI18nLegacy) {
  const scope = effectScope();
  {
    const obj = legacyMode ? scope.run(() => createVueI18n(options)) : scope.run(() => createComposer(options));
    if (obj == null) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    return [scope, obj];
  }
}
function getI18nInstance(instance) {
  {
    const i18n = inject(!instance.isCE ? instance.appContext.app.__VUE_I18N_SYMBOL__ : I18nInjectionKey);
    if (!i18n) {
      throw createI18nError(!instance.isCE ? I18nErrorCodes.UNEXPECTED_ERROR : I18nErrorCodes.NOT_INSLALLED_WITH_PROVIDE);
    }
    return i18n;
  }
}
function getScope(options, componentOptions) {
  return isEmptyObject(options) ? "__i18n" in componentOptions ? "local" : "global" : !options.useScope ? "local" : options.useScope;
}
function getGlobalComposer(i18n) {
  return i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
}
function getComposer(i18n, target, useComponent = false) {
  let composer = null;
  const root3 = target.root;
  let current = target.parent;
  while (current != null) {
    const i18nInternal = i18n;
    if (i18n.mode === "composition") {
      composer = i18nInternal.__getInstance(current);
    } else {
      {
        const vueI18n = i18nInternal.__getInstance(current);
        if (vueI18n != null) {
          composer = vueI18n.__composer;
          if (useComponent && composer && !composer[InejctWithOption]) {
            composer = null;
          }
        }
      }
    }
    if (composer != null) {
      break;
    }
    if (root3 === current) {
      break;
    }
    current = current.parent;
  }
  return composer;
}
function setupLifeCycle(i18n, target, composer) {
  {
    onUnmounted(() => {
      if ((process.env.NODE_ENV !== "production" || false) && true && target.vnode.el && target.vnode.el.__VUE_I18N__) {
        const _composer = composer;
        _composer[DisableEmitter] && _composer[DisableEmitter]();
        delete target.vnode.el.__VUE_I18N__;
      }
      i18n.__deleteInstance(target);
    }, target);
  }
}
function useI18nForLegacy(instance, scope, root3, options = {}) {
  const isLocale = scope === "local";
  const _composer = shallowRef(null);
  if (isLocale && instance.proxy && !(instance.proxy.$options.i18n || instance.proxy.$options.__i18n)) {
    throw createI18nError(I18nErrorCodes.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION);
  }
  const _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;
  const _locale = ref(
    // prettier-ignore
    isLocale && _inheritLocale ? root3.locale.value : isString(options.locale) ? options.locale : DEFAULT_LOCALE
  );
  const _fallbackLocale = ref(
    // prettier-ignore
    isLocale && _inheritLocale ? root3.fallbackLocale.value : isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value
  );
  const _messages = ref(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = ref(isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  const _missingWarn = isLocale ? root3.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const _fallbackWarn = isLocale ? root3.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const _fallbackRoot = isLocale ? root3.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  const _fallbackFormat = !!options.fallbackFormat;
  const _missing = isFunction(options.missing) ? options.missing : null;
  const _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  const _warnHtmlMessage = isLocale ? root3.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const _escapeParameter = !!options.escapeParameter;
  const _modifiers = isLocale ? root3.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {};
  const _pluralRules = options.pluralRules || isLocale && root3.pluralRules;
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed({
    get: () => {
      return _composer.value ? _composer.value.locale.value : _locale.value;
    },
    set: (val) => {
      if (_composer.value) {
        _composer.value.locale.value = val;
      }
      _locale.value = val;
    }
  });
  const fallbackLocale = computed({
    get: () => {
      return _composer.value ? _composer.value.fallbackLocale.value : _fallbackLocale.value;
    },
    set: (val) => {
      if (_composer.value) {
        _composer.value.fallbackLocale.value = val;
      }
      _fallbackLocale.value = val;
    }
  });
  const messages2 = computed(() => {
    if (_composer.value) {
      return _composer.value.messages.value;
    } else {
      return _messages.value;
    }
  });
  const datetimeFormats = computed(() => _datetimeFormats.value);
  const numberFormats = computed(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return _composer.value ? _composer.value.getPostTranslationHandler() : _postTranslation;
  }
  function setPostTranslationHandler(handler2) {
    if (_composer.value) {
      _composer.value.setPostTranslationHandler(handler2);
    }
  }
  function getMissingHandler() {
    return _composer.value ? _composer.value.getMissingHandler() : _missing;
  }
  function setMissingHandler(handler2) {
    if (_composer.value) {
      _composer.value.setMissingHandler(handler2);
    }
  }
  function warpWithDeps(fn) {
    trackReactivityValues();
    return fn();
  }
  function t(...args) {
    return _composer.value ? warpWithDeps(() => Reflect.apply(_composer.value.t, null, [...args])) : warpWithDeps(() => "");
  }
  function rt(...args) {
    return _composer.value ? Reflect.apply(_composer.value.rt, null, [...args]) : "";
  }
  function d(...args) {
    return _composer.value ? warpWithDeps(() => Reflect.apply(_composer.value.d, null, [...args])) : warpWithDeps(() => "");
  }
  function n(...args) {
    return _composer.value ? warpWithDeps(() => Reflect.apply(_composer.value.n, null, [...args])) : warpWithDeps(() => "");
  }
  function tm(key) {
    return _composer.value ? _composer.value.tm(key) : {};
  }
  function te(key, locale2) {
    return _composer.value ? _composer.value.te(key, locale2) : false;
  }
  function getLocaleMessage(locale2) {
    return _composer.value ? _composer.value.getLocaleMessage(locale2) : {};
  }
  function setLocaleMessage(locale2, message) {
    if (_composer.value) {
      _composer.value.setLocaleMessage(locale2, message);
      _messages.value[locale2] = message;
    }
  }
  function mergeLocaleMessage(locale2, message) {
    if (_composer.value) {
      _composer.value.mergeLocaleMessage(locale2, message);
    }
  }
  function getDateTimeFormat(locale2) {
    return _composer.value ? _composer.value.getDateTimeFormat(locale2) : {};
  }
  function setDateTimeFormat(locale2, format2) {
    if (_composer.value) {
      _composer.value.setDateTimeFormat(locale2, format2);
      _datetimeFormats.value[locale2] = format2;
    }
  }
  function mergeDateTimeFormat(locale2, format2) {
    if (_composer.value) {
      _composer.value.mergeDateTimeFormat(locale2, format2);
    }
  }
  function getNumberFormat(locale2) {
    return _composer.value ? _composer.value.getNumberFormat(locale2) : {};
  }
  function setNumberFormat(locale2, format2) {
    if (_composer.value) {
      _composer.value.setNumberFormat(locale2, format2);
      _numberFormats.value[locale2] = format2;
    }
  }
  function mergeNumberFormat(locale2, format2) {
    if (_composer.value) {
      _composer.value.mergeNumberFormat(locale2, format2);
    }
  }
  const wrapper = {
    get id() {
      return _composer.value ? _composer.value.id : -1;
    },
    locale,
    fallbackLocale,
    messages: messages2,
    datetimeFormats,
    numberFormats,
    get inheritLocale() {
      return _composer.value ? _composer.value.inheritLocale : _inheritLocale;
    },
    set inheritLocale(val) {
      if (_composer.value) {
        _composer.value.inheritLocale = val;
      }
    },
    get availableLocales() {
      return _composer.value ? _composer.value.availableLocales : Object.keys(_messages.value);
    },
    get modifiers() {
      return _composer.value ? _composer.value.modifiers : _modifiers;
    },
    get pluralRules() {
      return _composer.value ? _composer.value.pluralRules : _pluralRules;
    },
    get isGlobal() {
      return _composer.value ? _composer.value.isGlobal : false;
    },
    get missingWarn() {
      return _composer.value ? _composer.value.missingWarn : _missingWarn;
    },
    set missingWarn(val) {
      if (_composer.value) {
        _composer.value.missingWarn = val;
      }
    },
    get fallbackWarn() {
      return _composer.value ? _composer.value.fallbackWarn : _fallbackWarn;
    },
    set fallbackWarn(val) {
      if (_composer.value) {
        _composer.value.missingWarn = val;
      }
    },
    get fallbackRoot() {
      return _composer.value ? _composer.value.fallbackRoot : _fallbackRoot;
    },
    set fallbackRoot(val) {
      if (_composer.value) {
        _composer.value.fallbackRoot = val;
      }
    },
    get fallbackFormat() {
      return _composer.value ? _composer.value.fallbackFormat : _fallbackFormat;
    },
    set fallbackFormat(val) {
      if (_composer.value) {
        _composer.value.fallbackFormat = val;
      }
    },
    get warnHtmlMessage() {
      return _composer.value ? _composer.value.warnHtmlMessage : _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      if (_composer.value) {
        _composer.value.warnHtmlMessage = val;
      }
    },
    get escapeParameter() {
      return _composer.value ? _composer.value.escapeParameter : _escapeParameter;
    },
    set escapeParameter(val) {
      if (_composer.value) {
        _composer.value.escapeParameter = val;
      }
    },
    t,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    rt,
    d,
    n,
    tm,
    te,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getDateTimeFormat,
    setDateTimeFormat,
    mergeDateTimeFormat,
    getNumberFormat,
    setNumberFormat,
    mergeNumberFormat
  };
  return wrapper;
}
const globalExportProps = [
  "locale",
  "fallbackLocale",
  "availableLocales"
];
const globalExportMethods = ["t", "rt", "d", "n", "tm"];
function injectGlobalFields(app, composer) {
  const i18n = /* @__PURE__ */ Object.create(null);
  globalExportProps.forEach((prop) => {
    const desc = Object.getOwnPropertyDescriptor(composer, prop);
    if (!desc) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const wrap = isRef(desc.value) ? {
      get() {
        return desc.value.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(val) {
        desc.value.value = val;
      }
    } : {
      get() {
        return desc.get && desc.get();
      }
    };
    Object.defineProperty(i18n, prop, wrap);
  });
  app.config.globalProperties.$i18n = i18n;
  globalExportMethods.forEach((method) => {
    const desc = Object.getOwnPropertyDescriptor(composer, method);
    if (!desc || !desc.value) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    Object.defineProperty(app.config.globalProperties, `$${method}`, desc);
  });
}
registerMessageResolver(resolveValue);
registerLocaleFallbacker(fallbackWithLocaleChain);
{
  initFeatureFlags();
}
if (process.env.NODE_ENV !== "production" || __INTLIFY_PROD_DEVTOOLS__) {
  const target = getGlobalThis();
  target.__INTLIFY__ = true;
  setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}
if (process.env.NODE_ENV !== "production")
  ;
const optionsLoader = () => Promise.resolve({});
const resource$1 = {
  "hello": (ctx) => {
    const { normalize: _normalize } = ctx;
    return _normalize(["Hello"]);
  },
  "goodbye": (ctx) => {
    const { normalize: _normalize } = ctx;
    return _normalize(["Good Bye"]);
  },
  "pageTitles": {
    "about": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["About Me"]);
    },
    "resume": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Resume"]);
    },
    "portfolio": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Portfolio"]);
    },
    "plog": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Plog"]);
    },
    "contact": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Contact"]);
    }
  }
};
const resource = {
  "hello": (ctx) => {
    const { normalize: _normalize } = ctx;
    return _normalize(["哈喽"]);
  },
  "goodbye": (ctx) => {
    const { normalize: _normalize } = ctx;
    return _normalize(["再见"]);
  },
  "pageTitles": {
    "about": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["关于我"]);
    },
    "resume": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["简历"]);
    },
    "portfolio": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["项目"]);
    },
    "plog": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["图片博客"]);
    },
    "contact": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["联系"]);
    }
  }
};
const messages = { "en": resource$1, "id_ID": resource };
const isEmpty = (obj) => Object.keys(obj).length === 0;
const plugin_FRmGFsEaPh = /* @__PURE__ */ defineNuxtPlugin(async (nuxt) => {
  let __temp, __restore;
  const { vueApp: app } = nuxt;
  const loadedOptions = ([__temp, __restore] = executeAsync(() => optionsLoader()), __temp = await __temp, __restore(), __temp);
  if (!isEmpty(messages)) {
    loadedOptions.messages = messages;
  }
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "en",
    ...loadedOptions
  });
  app.use(i18n);
});
const preference = "system";
const plugin_server_XNCxeHyTuP = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const colorMode = useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  {
    useHead({ htmlAttrs });
  }
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      colorMode.value = htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
const cookies_fWsGjKD4Pq = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueCookies);
});
const useLocaleStore = defineStore("localeStore", () => {
  const locale = ref(useCookie("locale"));
  function setLocale(val) {
    return this.locale = val;
  }
  const getLocale = computed(() => {
    return locale.value;
  });
  return { locale, setLocale, getLocale };
});
const i18n_VfGcjrvSkj = /* @__PURE__ */ defineNuxtPlugin(() => {
  createI18n({
    legacy: false,
    inheritLocale: false,
    globalInjection: true,
    localeDir: "locales",
    fallbackLocale: useLocaleStore().getLocale || "id",
    locale: useLocaleStore().getLocale || "id"
  });
});
function _createForOfIteratorHelper$1(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it)
        o = it;
      var i = 0;
      var F = function F2() {
      };
      return { s: F, n: function n() {
        if (i >= o.length)
          return { done: true };
        return { done: false, value: o[i++] };
      }, e: function e(_e2) {
        throw _e2;
      }, f: F };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true, didErr = false, err;
  return { s: function s() {
    it = it.call(o);
  }, n: function n() {
    var step = it.next();
    normalCompletion = step.done;
    return step;
  }, e: function e(_e3) {
    didErr = true;
    err = _e3;
  }, f: function f() {
    try {
      if (!normalCompletion && it["return"] != null)
        it["return"]();
    } finally {
      if (didErr)
        throw err;
    }
  } };
}
function _toConsumableArray$2(arr) {
  return _arrayWithoutHoles$2(arr) || _iterableToArray$2(arr) || _unsupportedIterableToArray$2(arr) || _nonIterableSpread$2();
}
function _nonIterableSpread$2() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray$2(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$2(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$2(arr);
}
function _typeof$2$1(obj) {
  "@babel/helpers - typeof";
  return _typeof$2$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$2$1(obj);
}
function _slicedToArray$1(arr, i) {
  return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$2(arr, i) || _nonIterableRest$1();
}
function _nonIterableRest$1() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$2(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$2(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$2(o, minLen);
}
function _arrayLikeToArray$2(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _iterableToArrayLimit$1(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s, _e, _x, _r, _arr = [], _n = true, _d = false;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i)
          return;
        _n = false;
      } else
        for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = true)
          ;
    } catch (err) {
      _d = true, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r))
          return;
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
}
function _arrayWithHoles$1(arr) {
  if (Array.isArray(arr))
    return arr;
}
var DomHandler = {
  innerWidth: function innerWidth(el) {
    if (el) {
      var width2 = el.offsetWidth;
      var style2 = getComputedStyle(el);
      width2 += parseFloat(style2.paddingLeft) + parseFloat(style2.paddingRight);
      return width2;
    }
    return 0;
  },
  width: function width(el) {
    if (el) {
      var width2 = el.offsetWidth;
      var style2 = getComputedStyle(el);
      width2 -= parseFloat(style2.paddingLeft) + parseFloat(style2.paddingRight);
      return width2;
    }
    return 0;
  },
  getWindowScrollTop: function getWindowScrollTop() {
    var doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  },
  getWindowScrollLeft: function getWindowScrollLeft() {
    var doc = document.documentElement;
    return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  },
  getOuterWidth: function getOuterWidth(el, margin) {
    if (el) {
      var width2 = el.offsetWidth;
      if (margin) {
        var style2 = getComputedStyle(el);
        width2 += parseFloat(style2.marginLeft) + parseFloat(style2.marginRight);
      }
      return width2;
    }
    return 0;
  },
  getOuterHeight: function getOuterHeight(el, margin) {
    if (el) {
      var height = el.offsetHeight;
      if (margin) {
        var style2 = getComputedStyle(el);
        height += parseFloat(style2.marginTop) + parseFloat(style2.marginBottom);
      }
      return height;
    }
    return 0;
  },
  getClientHeight: function getClientHeight(el, margin) {
    if (el) {
      var height = el.clientHeight;
      if (margin) {
        var style2 = getComputedStyle(el);
        height += parseFloat(style2.marginTop) + parseFloat(style2.marginBottom);
      }
      return height;
    }
    return 0;
  },
  getViewport: function getViewport() {
    var win = window, d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0], w = win.innerWidth || e.clientWidth || g.clientWidth, h2 = win.innerHeight || e.clientHeight || g.clientHeight;
    return {
      width: w,
      height: h2
    };
  },
  getOffset: function getOffset(el) {
    if (el) {
      var rect = el.getBoundingClientRect();
      return {
        top: rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
        left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
      };
    }
    return {
      top: "auto",
      left: "auto"
    };
  },
  index: function index(element) {
    if (element) {
      var children = element.parentNode.childNodes;
      var num = 0;
      for (var i = 0; i < children.length; i++) {
        if (children[i] === element)
          return num;
        if (children[i].nodeType === 1)
          num++;
      }
    }
    return -1;
  },
  addMultipleClasses: function addMultipleClasses(element, className) {
    var _this = this;
    if (element && className) {
      className.split(" ").forEach(function(style2) {
        return _this.addClass(element, style2);
      });
    }
  },
  addClass: function addClass(element, className) {
    if (element && className && !this.hasClass(element, className)) {
      if (element.classList)
        element.classList.add(className);
      else
        element.className += " " + className;
    }
  },
  removeClass: function removeClass(element, className) {
    if (element && className) {
      if (element.classList)
        element.classList.remove(className);
      else
        element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    }
  },
  hasClass: function hasClass(element, className) {
    if (element) {
      if (element.classList)
        return element.classList.contains(className);
      else
        return new RegExp("(^| )" + className + "( |$)", "gi").test(element.className);
    }
    return false;
  },
  addStyles: function addStyles(element) {
    var styles2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (element) {
      Object.entries(styles2).forEach(function(_ref) {
        var _ref2 = _slicedToArray$1(_ref, 2), key = _ref2[0], value = _ref2[1];
        return element.style[key] = value;
      });
    }
  },
  find: function find(element, selector) {
    return this.isElement(element) ? element.querySelectorAll(selector) : [];
  },
  findSingle: function findSingle(element, selector) {
    return this.isElement(element) ? element.querySelector(selector) : null;
  },
  createElement: function createElement(type) {
    var attributes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (type) {
      var element = document.createElement(type);
      this.setAttributes(element, attributes);
      for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
      }
      element.append.apply(element, children);
      return element;
    }
    return void 0;
  },
  setAttributes: function setAttributes(element) {
    var _this2 = this;
    var attributes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (element) {
      var computedStyles = function computedStyles2(rule, value) {
        var _element$$attrs, _element$$attrs2;
        var styles2 = element !== null && element !== void 0 && (_element$$attrs = element.$attrs) !== null && _element$$attrs !== void 0 && _element$$attrs[rule] ? [element === null || element === void 0 || (_element$$attrs2 = element.$attrs) === null || _element$$attrs2 === void 0 ? void 0 : _element$$attrs2[rule]] : [];
        return [value].flat().reduce(function(cv, v) {
          if (v !== null && v !== void 0) {
            var type = _typeof$2$1(v);
            if (type === "string" || type === "number") {
              cv.push(v);
            } else if (type === "object") {
              var _cv = Array.isArray(v) ? computedStyles2(rule, v) : Object.entries(v).map(function(_ref3) {
                var _ref4 = _slicedToArray$1(_ref3, 2), _k = _ref4[0], _v = _ref4[1];
                return rule === "style" && (!!_v || _v === 0) ? "".concat(_k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), ":").concat(_v) : !!_v ? _k : void 0;
              });
              cv = _cv.length ? cv.concat(_cv.filter(function(c) {
                return !!c;
              })) : cv;
            }
          }
          return cv;
        }, styles2);
      };
      Object.entries(attributes).forEach(function(_ref5) {
        var _ref6 = _slicedToArray$1(_ref5, 2), key = _ref6[0], value = _ref6[1];
        if (value !== void 0 && value !== null) {
          var matchedEvent = key.match(/^on(.+)/);
          if (matchedEvent) {
            element.addEventListener(matchedEvent[1].toLowerCase(), value);
          } else if (key === "p-bind") {
            _this2.setAttributes(element, value);
          } else {
            value = key === "class" ? _toConsumableArray$2(new Set(computedStyles("class", value))).join(" ").trim() : key === "style" ? computedStyles("style", value).join(";").trim() : value;
            (element.$attrs = element.$attrs || {}) && (element.$attrs[key] = value);
            element.setAttribute(key, value);
          }
        }
      });
    }
  },
  getAttribute: function getAttribute(element, name) {
    if (element) {
      var value = element.getAttribute(name);
      if (!isNaN(value)) {
        return +value;
      }
      if (value === "true" || value === "false") {
        return value === "true";
      }
      return value;
    }
    return void 0;
  },
  isAttributeEquals: function isAttributeEquals(element, name, value) {
    return element ? this.getAttribute(element, name) === value : false;
  },
  isAttributeNotEquals: function isAttributeNotEquals(element, name, value) {
    return !this.isAttributeEquals(element, name, value);
  },
  getHeight: function getHeight(el) {
    if (el) {
      var height = el.offsetHeight;
      var style2 = getComputedStyle(el);
      height -= parseFloat(style2.paddingTop) + parseFloat(style2.paddingBottom) + parseFloat(style2.borderTopWidth) + parseFloat(style2.borderBottomWidth);
      return height;
    }
    return 0;
  },
  getWidth: function getWidth(el) {
    if (el) {
      var width2 = el.offsetWidth;
      var style2 = getComputedStyle(el);
      width2 -= parseFloat(style2.paddingLeft) + parseFloat(style2.paddingRight) + parseFloat(style2.borderLeftWidth) + parseFloat(style2.borderRightWidth);
      return width2;
    }
    return 0;
  },
  absolutePosition: function absolutePosition(element, target) {
    if (element) {
      var elementDimensions = element.offsetParent ? {
        width: element.offsetWidth,
        height: element.offsetHeight
      } : this.getHiddenElementDimensions(element);
      var elementOuterHeight = elementDimensions.height;
      var elementOuterWidth = elementDimensions.width;
      var targetOuterHeight = target.offsetHeight;
      var targetOuterWidth = target.offsetWidth;
      var targetOffset = target.getBoundingClientRect();
      var windowScrollTop = this.getWindowScrollTop();
      var windowScrollLeft = this.getWindowScrollLeft();
      var viewport = this.getViewport();
      var top, left;
      if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
        top = targetOffset.top + windowScrollTop - elementOuterHeight;
        element.style.transformOrigin = "bottom";
        if (top < 0) {
          top = windowScrollTop;
        }
      } else {
        top = targetOuterHeight + targetOffset.top + windowScrollTop;
        element.style.transformOrigin = "top";
      }
      if (targetOffset.left + elementOuterWidth > viewport.width)
        left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
      else
        left = targetOffset.left + windowScrollLeft;
      element.style.top = top + "px";
      element.style.left = left + "px";
    }
  },
  relativePosition: function relativePosition(element, target) {
    if (element) {
      var elementDimensions = element.offsetParent ? {
        width: element.offsetWidth,
        height: element.offsetHeight
      } : this.getHiddenElementDimensions(element);
      var targetHeight = target.offsetHeight;
      var targetOffset = target.getBoundingClientRect();
      var viewport = this.getViewport();
      var top, left;
      if (targetOffset.top + targetHeight + elementDimensions.height > viewport.height) {
        top = -1 * elementDimensions.height;
        element.style.transformOrigin = "bottom";
        if (targetOffset.top + top < 0) {
          top = -1 * targetOffset.top;
        }
      } else {
        top = targetHeight;
        element.style.transformOrigin = "top";
      }
      if (elementDimensions.width > viewport.width) {
        left = targetOffset.left * -1;
      } else if (targetOffset.left + elementDimensions.width > viewport.width) {
        left = (targetOffset.left + elementDimensions.width - viewport.width) * -1;
      } else {
        left = 0;
      }
      element.style.top = top + "px";
      element.style.left = left + "px";
    }
  },
  getParents: function getParents(element) {
    var parents = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    return element["parentNode"] === null ? parents : this.getParents(element.parentNode, parents.concat([element.parentNode]));
  },
  getScrollableParents: function getScrollableParents(element) {
    var scrollableParents = [];
    if (element) {
      var parents = this.getParents(element);
      var overflowRegex = /(auto|scroll)/;
      var overflowCheck = function overflowCheck2(node) {
        try {
          var styleDeclaration = window["getComputedStyle"](node, null);
          return overflowRegex.test(styleDeclaration.getPropertyValue("overflow")) || overflowRegex.test(styleDeclaration.getPropertyValue("overflowX")) || overflowRegex.test(styleDeclaration.getPropertyValue("overflowY"));
        } catch (err) {
          return false;
        }
      };
      var _iterator = _createForOfIteratorHelper$1(parents), _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var parent = _step.value;
          var scrollSelectors = parent.nodeType === 1 && parent.dataset["scrollselectors"];
          if (scrollSelectors) {
            var selectors = scrollSelectors.split(",");
            var _iterator2 = _createForOfIteratorHelper$1(selectors), _step2;
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
                var selector = _step2.value;
                var el = this.findSingle(parent, selector);
                if (el && overflowCheck(el)) {
                  scrollableParents.push(el);
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
          if (parent.nodeType !== 9 && overflowCheck(parent)) {
            scrollableParents.push(parent);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return scrollableParents;
  },
  getHiddenElementOuterHeight: function getHiddenElementOuterHeight(element) {
    if (element) {
      element.style.visibility = "hidden";
      element.style.display = "block";
      var elementHeight = element.offsetHeight;
      element.style.display = "none";
      element.style.visibility = "visible";
      return elementHeight;
    }
    return 0;
  },
  getHiddenElementOuterWidth: function getHiddenElementOuterWidth(element) {
    if (element) {
      element.style.visibility = "hidden";
      element.style.display = "block";
      var elementWidth = element.offsetWidth;
      element.style.display = "none";
      element.style.visibility = "visible";
      return elementWidth;
    }
    return 0;
  },
  getHiddenElementDimensions: function getHiddenElementDimensions(element) {
    if (element) {
      var dimensions = {};
      element.style.visibility = "hidden";
      element.style.display = "block";
      dimensions.width = element.offsetWidth;
      dimensions.height = element.offsetHeight;
      element.style.display = "none";
      element.style.visibility = "visible";
      return dimensions;
    }
    return 0;
  },
  fadeIn: function fadeIn(element, duration) {
    if (element) {
      element.style.opacity = 0;
      var last = +/* @__PURE__ */ new Date();
      var opacity = 0;
      var tick = function tick2() {
        opacity = +element.style.opacity + ((/* @__PURE__ */ new Date()).getTime() - last) / duration;
        element.style.opacity = opacity;
        last = +/* @__PURE__ */ new Date();
        if (+opacity < 1) {
          window.requestAnimationFrame && requestAnimationFrame(tick2) || setTimeout(tick2, 16);
        }
      };
      tick();
    }
  },
  fadeOut: function fadeOut(element, ms) {
    if (element) {
      var opacity = 1, interval = 50, duration = ms, gap = interval / duration;
      var fading = setInterval(function() {
        opacity -= gap;
        if (opacity <= 0) {
          opacity = 0;
          clearInterval(fading);
        }
        element.style.opacity = opacity;
      }, interval);
    }
  },
  getUserAgent: function getUserAgent() {
    return navigator.userAgent;
  },
  appendChild: function appendChild(element, target) {
    if (this.isElement(target))
      target.appendChild(element);
    else if (target.el && target.elElement)
      target.elElement.appendChild(element);
    else
      throw new Error("Cannot append " + target + " to " + element);
  },
  isElement: function isElement(obj) {
    return (typeof HTMLElement === "undefined" ? "undefined" : _typeof$2$1(HTMLElement)) === "object" ? obj instanceof HTMLElement : obj && _typeof$2$1(obj) === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string";
  },
  scrollInView: function scrollInView(container, item) {
    var borderTopValue = getComputedStyle(container).getPropertyValue("borderTopWidth");
    var borderTop = borderTopValue ? parseFloat(borderTopValue) : 0;
    var paddingTopValue = getComputedStyle(container).getPropertyValue("paddingTop");
    var paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0;
    var containerRect = container.getBoundingClientRect();
    var itemRect = item.getBoundingClientRect();
    var offset = itemRect.top + document.body.scrollTop - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
    var scroll = container.scrollTop;
    var elementHeight = container.clientHeight;
    var itemHeight = this.getOuterHeight(item);
    if (offset < 0) {
      container.scrollTop = scroll + offset;
    } else if (offset + itemHeight > elementHeight) {
      container.scrollTop = scroll + offset - elementHeight + itemHeight;
    }
  },
  clearSelection: function clearSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges && window.getSelection().rangeCount > 0 && window.getSelection().getRangeAt(0).getClientRects().length > 0) {
        window.getSelection().removeAllRanges();
      }
    } else if (document["selection"] && document["selection"].empty) {
      try {
        document["selection"].empty();
      } catch (error) {
      }
    }
  },
  getSelection: function getSelection() {
    if (window.getSelection)
      return window.getSelection().toString();
    else if (document.getSelection)
      return document.getSelection().toString();
    else if (document["selection"])
      return document["selection"].createRange().text;
    return null;
  },
  calculateScrollbarWidth: function calculateScrollbarWidth() {
    if (this.calculatedScrollbarWidth != null)
      return this.calculatedScrollbarWidth;
    var scrollDiv = document.createElement("div");
    this.addStyles(scrollDiv, {
      width: "100px",
      height: "100px",
      overflow: "scroll",
      position: "absolute",
      top: "-9999px"
    });
    document.body.appendChild(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    this.calculatedScrollbarWidth = scrollbarWidth;
    return scrollbarWidth;
  },
  getBrowser: function getBrowser() {
    if (!this.browser) {
      var matched = this.resolveUserAgent();
      this.browser = {};
      if (matched.browser) {
        this.browser[matched.browser] = true;
        this.browser["version"] = matched.version;
      }
      if (this.browser["chrome"]) {
        this.browser["webkit"] = true;
      } else if (this.browser["webkit"]) {
        this.browser["safari"] = true;
      }
    }
    return this.browser;
  },
  resolveUserAgent: function resolveUserAgent() {
    var ua = navigator.userAgent.toLowerCase();
    var match = /(chrome)[ ]([\w.]+)/.exec(ua) || /(webkit)[ ]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ ]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
    return {
      browser: match[1] || "",
      version: match[2] || "0"
    };
  },
  isVisible: function isVisible(element) {
    return element && element.offsetParent != null;
  },
  invokeElementMethod: function invokeElementMethod(element, methodName, args) {
    element[methodName].apply(element, args);
  },
  isExist: function isExist(element) {
    return !!(element !== null && typeof element !== "undefined" && element.nodeName && element.parentNode);
  },
  isClient: function isClient() {
    return false;
  },
  focus: function focus(el, options) {
    el && document.activeElement !== el && el.focus(options);
  },
  isFocusableElement: function isFocusableElement(element) {
    var selector = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.isElement(element) ? element.matches('button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])'.concat(selector, ',\n                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector)) : false;
  },
  getFocusableElements: function getFocusableElements(element) {
    var selector = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    var focusableElements = this.find(element, 'button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])'.concat(selector, ',\n                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector, ',\n                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])').concat(selector));
    var visibleFocusableElements = [];
    var _iterator3 = _createForOfIteratorHelper$1(focusableElements), _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
        var focusableElement = _step3.value;
        if (getComputedStyle(focusableElement).display != "none" && getComputedStyle(focusableElement).visibility != "hidden")
          visibleFocusableElements.push(focusableElement);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return visibleFocusableElements;
  },
  getFirstFocusableElement: function getFirstFocusableElement(element, selector) {
    var focusableElements = this.getFocusableElements(element, selector);
    return focusableElements.length > 0 ? focusableElements[0] : null;
  },
  getLastFocusableElement: function getLastFocusableElement(element, selector) {
    var focusableElements = this.getFocusableElements(element, selector);
    return focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : null;
  },
  getNextFocusableElement: function getNextFocusableElement(container, element, selector) {
    var focusableElements = this.getFocusableElements(container, selector);
    var index3 = focusableElements.length > 0 ? focusableElements.findIndex(function(el) {
      return el === element;
    }) : -1;
    var nextIndex = index3 > -1 && focusableElements.length >= index3 + 1 ? index3 + 1 : -1;
    return nextIndex > -1 ? focusableElements[nextIndex] : null;
  },
  isClickable: function isClickable(element) {
    if (element) {
      var targetNode = element.nodeName;
      var parentNode = element.parentElement && element.parentElement.nodeName;
      return targetNode === "INPUT" || targetNode === "TEXTAREA" || targetNode === "BUTTON" || targetNode === "A" || parentNode === "INPUT" || parentNode === "TEXTAREA" || parentNode === "BUTTON" || parentNode === "A" || !!element.closest(".p-button, .p-checkbox, .p-radiobutton");
    }
    return false;
  },
  applyStyle: function applyStyle(element, style2) {
    if (typeof style2 === "string") {
      element.style.cssText = style2;
    } else {
      for (var prop in style2) {
        element.style[prop] = style2[prop];
      }
    }
  },
  isIOS: function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window["MSStream"];
  },
  isAndroid: function isAndroid() {
    return /(android)/i.test(navigator.userAgent);
  },
  isTouchDevice: function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  },
  exportCSV: function exportCSV(csv, filename) {
    var blob = new Blob([csv], {
      type: "application/csv;charset=utf-8;"
    });
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, filename + ".csv");
    } else {
      var link = document.createElement("a");
      if (link.download !== void 0) {
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", filename + ".csv");
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        csv = "data:text/csv;charset=utf-8," + csv;
        window.open(encodeURI(csv));
      }
    }
  }
};
function _toConsumableArray$1(arr) {
  return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1$1(arr) || _nonIterableSpread$1();
}
function _nonIterableSpread$1() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray$1(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles$1(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$1$1(arr);
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray$1$1(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it)
        o = it;
      var i = 0;
      var F = function F2() {
      };
      return { s: F, n: function n() {
        if (i >= o.length)
          return { done: true };
        return { done: false, value: o[i++] };
      }, e: function e(_e) {
        throw _e;
      }, f: F };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true, didErr = false, err;
  return { s: function s() {
    it = it.call(o);
  }, n: function n() {
    var step = it.next();
    normalCompletion = step.done;
    return step;
  }, e: function e(_e2) {
    didErr = true;
    err = _e2;
  }, f: function f() {
    try {
      if (!normalCompletion && it["return"] != null)
        it["return"]();
    } finally {
      if (didErr)
        throw err;
    }
  } };
}
function _unsupportedIterableToArray$1$1(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$1$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$1$1(o, minLen);
}
function _arrayLikeToArray$1$1(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _typeof$4(obj) {
  "@babel/helpers - typeof";
  return _typeof$4 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$4(obj);
}
var ObjectUtils = {
  equals: function equals(obj1, obj2, field) {
    if (field)
      return this.resolveFieldData(obj1, field) === this.resolveFieldData(obj2, field);
    else
      return this.deepEquals(obj1, obj2);
  },
  deepEquals: function deepEquals(a, b) {
    if (a === b)
      return true;
    if (a && b && _typeof$4(a) == "object" && _typeof$4(b) == "object") {
      var arrA = Array.isArray(a), arrB = Array.isArray(b), i, length, key;
      if (arrA && arrB) {
        length = a.length;
        if (length != b.length)
          return false;
        for (i = length; i-- !== 0; )
          if (!this.deepEquals(a[i], b[i]))
            return false;
        return true;
      }
      if (arrA != arrB)
        return false;
      var dateA = a instanceof Date, dateB = b instanceof Date;
      if (dateA != dateB)
        return false;
      if (dateA && dateB)
        return a.getTime() == b.getTime();
      var regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
      if (regexpA != regexpB)
        return false;
      if (regexpA && regexpB)
        return a.toString() == b.toString();
      var keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length)
        return false;
      for (i = length; i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
          return false;
      for (i = length; i-- !== 0; ) {
        key = keys[i];
        if (!this.deepEquals(a[key], b[key]))
          return false;
      }
      return true;
    }
    return a !== a && b !== b;
  },
  resolveFieldData: function resolveFieldData(data, field) {
    if (data && Object.keys(data).length && field) {
      if (this.isFunction(field)) {
        return field(data);
      } else if (field.indexOf(".") === -1) {
        return data[field];
      } else {
        var fields = field.split(".");
        var value = data;
        for (var i = 0, len = fields.length; i < len; ++i) {
          if (value == null) {
            return null;
          }
          value = value[fields[i]];
        }
        return value;
      }
    } else {
      return null;
    }
  },
  getItemValue: function getItemValue(obj) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }
    return this.isFunction(obj) ? obj.apply(void 0, params) : obj;
  },
  filter: function filter(value, fields, filterValue) {
    var filteredItems = [];
    if (value) {
      var _iterator = _createForOfIteratorHelper(value), _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var item = _step.value;
          var _iterator2 = _createForOfIteratorHelper(fields), _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
              var field = _step2.value;
              if (String(this.resolveFieldData(item, field)).toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
                filteredItems.push(item);
                break;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return filteredItems;
  },
  reorderArray: function reorderArray(value, from, to) {
    if (value && from !== to) {
      if (to >= value.length) {
        to %= value.length;
        from %= value.length;
      }
      value.splice(to, 0, value.splice(from, 1)[0]);
    }
  },
  findIndexInList: function findIndexInList(value, list) {
    var index3 = -1;
    if (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i] === value) {
          index3 = i;
          break;
        }
      }
    }
    return index3;
  },
  contains: function contains(value, list) {
    if (value != null && list && list.length) {
      var _iterator3 = _createForOfIteratorHelper(list), _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
          var val = _step3.value;
          if (this.equals(value, val))
            return true;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
    return false;
  },
  insertIntoOrderedArray: function insertIntoOrderedArray(item, index3, arr, sourceArr) {
    if (arr.length > 0) {
      var injected = false;
      for (var i = 0; i < arr.length; i++) {
        var currentItemIndex = this.findIndexInList(arr[i], sourceArr);
        if (currentItemIndex > index3) {
          arr.splice(i, 0, item);
          injected = true;
          break;
        }
      }
      if (!injected) {
        arr.push(item);
      }
    } else {
      arr.push(item);
    }
  },
  removeAccents: function removeAccents(str) {
    if (str && str.search(/[\xC0-\xFF]/g) > -1) {
      str = str.replace(/[\xC0-\xC5]/g, "A").replace(/[\xC6]/g, "AE").replace(/[\xC7]/g, "C").replace(/[\xC8-\xCB]/g, "E").replace(/[\xCC-\xCF]/g, "I").replace(/[\xD0]/g, "D").replace(/[\xD1]/g, "N").replace(/[\xD2-\xD6\xD8]/g, "O").replace(/[\xD9-\xDC]/g, "U").replace(/[\xDD]/g, "Y").replace(/[\xDE]/g, "P").replace(/[\xE0-\xE5]/g, "a").replace(/[\xE6]/g, "ae").replace(/[\xE7]/g, "c").replace(/[\xE8-\xEB]/g, "e").replace(/[\xEC-\xEF]/g, "i").replace(/[\xF1]/g, "n").replace(/[\xF2-\xF6\xF8]/g, "o").replace(/[\xF9-\xFC]/g, "u").replace(/[\xFE]/g, "p").replace(/[\xFD\xFF]/g, "y");
    }
    return str;
  },
  getVNodeProp: function getVNodeProp(vnode, prop) {
    var props = vnode.props;
    if (props) {
      var kebapProp = prop.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      var propName = Object.prototype.hasOwnProperty.call(props, kebapProp) ? kebapProp : prop;
      return vnode.type["extends"].props[prop].type === Boolean && props[propName] === "" ? true : props[propName];
    }
    return null;
  },
  toFlatCase: function toFlatCase(str) {
    return this.isString(str) ? str.replace(/(-|_)/g, "").toLowerCase() : str;
  },
  toKebabCase: function toKebabCase(str) {
    return this.isString(str) ? str.replace(/(_)/g, "-").replace(/[A-Z]/g, function(c, i) {
      return i === 0 ? c : "-" + c.toLowerCase();
    }).toLowerCase() : str;
  },
  toCapitalCase: function toCapitalCase(str) {
    return this.isString(str, {
      empty: false
    }) ? str[0].toUpperCase() + str.slice(1) : str;
  },
  isEmpty: function isEmpty2(value) {
    return value === null || value === void 0 || value === "" || Array.isArray(value) && value.length === 0 || !(value instanceof Date) && _typeof$4(value) === "object" && Object.keys(value).length === 0;
  },
  isNotEmpty: function isNotEmpty(value) {
    return !this.isEmpty(value);
  },
  isFunction: function isFunction2(value) {
    return !!(value && value.constructor && value.call && value.apply);
  },
  isObject: function isObject2(value) {
    var empty = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return value instanceof Object && value.constructor === Object && (empty || Object.keys(value).length !== 0);
  },
  isDate: function isDate2(value) {
    return value instanceof Date && value.constructor === Date;
  },
  isArray: function isArray2(value) {
    var empty = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return Array.isArray(value) && (empty || value.length !== 0);
  },
  isString: function isString2(value) {
    var empty = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    return typeof value === "string" && (empty || value !== "");
  },
  isPrintableCharacter: function isPrintableCharacter() {
    var _char = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return this.isNotEmpty(_char) && _char.length === 1 && _char.match(/\S| /);
  },
  /**
   * Firefox-v103 does not currently support the "findLast" method. It is stated that this method will be supported with Firefox-v104.
   * https://caniuse.com/mdn-javascript_builtins_array_findlast
   */
  findLast: function findLast(arr, callback) {
    var item;
    if (this.isNotEmpty(arr)) {
      try {
        item = arr.findLast(callback);
      } catch (_unused) {
        item = _toConsumableArray$1(arr).reverse().find(callback);
      }
    }
    return item;
  },
  /**
   * Firefox-v103 does not currently support the "findLastIndex" method. It is stated that this method will be supported with Firefox-v104.
   * https://caniuse.com/mdn-javascript_builtins_array_findlastindex
   */
  findLastIndex: function findLastIndex(arr, callback) {
    var index3 = -1;
    if (this.isNotEmpty(arr)) {
      try {
        index3 = arr.findLastIndex(callback);
      } catch (_unused2) {
        index3 = arr.lastIndexOf(_toConsumableArray$1(arr).reverse().find(callback));
      }
    }
    return index3;
  }
};
var lastId = 0;
function UniqueComponentId() {
  var prefix = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pv_id_";
  lastId++;
  return "".concat(prefix).concat(lastId);
}
var FilterMatchMode = {
  STARTS_WITH: "startsWith",
  CONTAINS: "contains",
  NOT_CONTAINS: "notContains",
  ENDS_WITH: "endsWith",
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  IN: "in",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUAL_TO: "lte",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUAL_TO: "gte",
  BETWEEN: "between",
  DATE_IS: "dateIs",
  DATE_IS_NOT: "dateIsNot",
  DATE_BEFORE: "dateBefore",
  DATE_AFTER: "dateAfter"
};
function _typeof$3(obj) {
  "@babel/helpers - typeof";
  return _typeof$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$3(obj);
}
function ownKeys$2(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys$2(Object(source), true).forEach(function(key) {
      _defineProperty$3(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$3(obj, key, value) {
  key = _toPropertyKey$3(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$3(arg) {
  var key = _toPrimitive$3(arg, "string");
  return _typeof$3(key) === "symbol" ? key : String(key);
}
function _toPrimitive$3(input, hint) {
  if (_typeof$3(input) !== "object" || input === null)
    return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (_typeof$3(res) !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
var defaultOptions = {
  ripple: false,
  inputStyle: "outlined",
  locale: {
    startsWith: "Starts with",
    contains: "Contains",
    notContains: "Not contains",
    endsWith: "Ends with",
    equals: "Equals",
    notEquals: "Not equals",
    noFilter: "No Filter",
    lt: "Less than",
    lte: "Less than or equal to",
    gt: "Greater than",
    gte: "Greater than or equal to",
    dateIs: "Date is",
    dateIsNot: "Date is not",
    dateBefore: "Date is before",
    dateAfter: "Date is after",
    clear: "Clear",
    apply: "Apply",
    matchAll: "Match All",
    matchAny: "Match Any",
    addRule: "Add Rule",
    removeRule: "Remove Rule",
    accept: "Yes",
    reject: "No",
    choose: "Choose",
    upload: "Upload",
    cancel: "Cancel",
    completed: "Completed",
    pending: "Pending",
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chooseYear: "Choose Year",
    chooseMonth: "Choose Month",
    chooseDate: "Choose Date",
    prevDecade: "Previous Decade",
    nextDecade: "Next Decade",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    prevHour: "Previous Hour",
    nextHour: "Next Hour",
    prevMinute: "Previous Minute",
    nextMinute: "Next Minute",
    prevSecond: "Previous Second",
    nextSecond: "Next Second",
    am: "am",
    pm: "pm",
    today: "Today",
    weekHeader: "Wk",
    firstDayOfWeek: 0,
    dateFormat: "mm/dd/yy",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    passwordPrompt: "Enter a password",
    emptyFilterMessage: "No results found",
    // @deprecated Use 'emptySearchMessage' option instead.
    searchMessage: "{0} results are available",
    selectionMessage: "{0} items selected",
    emptySelectionMessage: "No selected item",
    emptySearchMessage: "No results found",
    emptyMessage: "No available options",
    aria: {
      trueLabel: "True",
      falseLabel: "False",
      nullLabel: "Not Selected",
      star: "1 star",
      stars: "{star} stars",
      selectAll: "All items selected",
      unselectAll: "All items unselected",
      close: "Close",
      previous: "Previous",
      next: "Next",
      navigation: "Navigation",
      scrollTop: "Scroll Top",
      moveTop: "Move Top",
      moveUp: "Move Up",
      moveDown: "Move Down",
      moveBottom: "Move Bottom",
      moveToTarget: "Move to Target",
      moveToSource: "Move to Source",
      moveAllToTarget: "Move All to Target",
      moveAllToSource: "Move All to Source",
      pageLabel: "{page}",
      firstPageLabel: "First Page",
      lastPageLabel: "Last Page",
      nextPageLabel: "Next Page",
      prevPageLabel: "Previous Page",
      rowsPerPageLabel: "Rows per page",
      jumpToPageDropdownLabel: "Jump to Page Dropdown",
      jumpToPageInputLabel: "Jump to Page Input",
      selectRow: "Row Selected",
      unselectRow: "Row Unselected",
      expandRow: "Row Expanded",
      collapseRow: "Row Collapsed",
      showFilterMenu: "Show Filter Menu",
      hideFilterMenu: "Hide Filter Menu",
      filterOperator: "Filter Operator",
      filterConstraint: "Filter Constraint",
      editRow: "Row Edit",
      saveEdit: "Save Edit",
      cancelEdit: "Cancel Edit",
      listView: "List View",
      gridView: "Grid View",
      slide: "Slide",
      slideNumber: "{slideNumber}",
      zoomImage: "Zoom Image",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      rotateRight: "Rotate Right",
      rotateLeft: "Rotate Left"
    }
  },
  filterMatchModeOptions: {
    text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
    numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
    date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
  },
  zIndex: {
    modal: 1100,
    overlay: 1e3,
    menu: 1e3,
    tooltip: 1100
  },
  pt: void 0,
  unstyled: false
};
var PrimeVueSymbol = Symbol();
function switchTheme(currentTheme, newTheme, linkElementId, callback) {
  var linkElement = document.getElementById(linkElementId);
  var cloneLinkElement = linkElement.cloneNode(true);
  var newThemeUrl = linkElement.getAttribute("href").replace(currentTheme, newTheme);
  cloneLinkElement.setAttribute("id", linkElementId + "-clone");
  cloneLinkElement.setAttribute("href", newThemeUrl);
  cloneLinkElement.addEventListener("load", function() {
    linkElement.remove();
    cloneLinkElement.setAttribute("id", linkElementId);
    if (callback) {
      callback();
    }
  });
  linkElement.parentNode && linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
}
var PrimeVue = {
  install: function install(app, options) {
    var configOptions = options ? _objectSpread$2(_objectSpread$2({}, defaultOptions), options) : _objectSpread$2({}, defaultOptions);
    var PrimeVue2 = {
      config: reactive(configOptions),
      changeTheme: switchTheme
    };
    app.config.globalProperties.$primevue = PrimeVue2;
    app.provide(PrimeVueSymbol, PrimeVue2);
  }
};
function tryOnMounted(fn) {
  var sync = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
  if (getCurrentInstance())
    onMounted(fn);
  else if (sync)
    fn();
  else
    nextTick(fn);
}
var _id = 0;
function useStyle(css) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var isLoaded = ref(false);
  var cssRef = ref(css);
  var styleRef = ref(null);
  var defaultDocument = DomHandler.isClient() ? window.document : void 0;
  var _options$document = options.document, document2 = _options$document === void 0 ? defaultDocument : _options$document, _options$immediate = options.immediate, immediate = _options$immediate === void 0 ? true : _options$immediate, _options$manual = options.manual, manual = _options$manual === void 0 ? false : _options$manual, _options$name = options.name, name = _options$name === void 0 ? "style_".concat(++_id) : _options$name, _options$id = options.id, id = _options$id === void 0 ? void 0 : _options$id, _options$media = options.media, media = _options$media === void 0 ? void 0 : _options$media;
  var stop = function stop2() {
  };
  var load = function load2() {
    if (!document2)
      return;
    styleRef.value = document2.querySelector('style[data-primevue-style-id="'.concat(name, '"]')) || document2.getElementById(id) || document2.createElement("style");
    if (!styleRef.value.isConnected) {
      styleRef.value.type = "text/css";
      id && (styleRef.value.id = id);
      media && (styleRef.value.media = media);
      document2.head.appendChild(styleRef.value);
      name && styleRef.value.setAttribute("data-primevue-style-id", name);
    }
    if (isLoaded.value)
      return;
    stop = watch(cssRef, function(value) {
      styleRef.value.textContent = value;
    }, {
      immediate: true
    });
    isLoaded.value = true;
  };
  var unload = function unload2() {
    if (!document2 || !isLoaded.value)
      return;
    stop();
    DomHandler.isExist(styleRef.value) && document2.head.removeChild(styleRef.value);
    isLoaded.value = false;
  };
  if (immediate && !manual)
    tryOnMounted(load);
  return {
    id,
    name,
    css: cssRef,
    unload,
    load,
    isLoaded: readonly(isLoaded)
  };
}
var styles$3 = "\n.p-hidden-accessible {\n    border: 0;\n    clip: rect(0 0 0 0);\n    height: 1px;\n    margin: -1px;\n    overflow: hidden;\n    padding: 0;\n    position: absolute;\n    width: 1px;\n}\n\n.p-hidden-accessible input,\n.p-hidden-accessible select {\n    transform: scale(0);\n}\n\n.p-overflow-hidden {\n    overflow: hidden;\n}\n";
var _useStyle$3 = useStyle(styles$3, {
  name: "base",
  manual: true
}), loadBaseStyle = _useStyle$3.load;
function _typeof$2(obj) {
  "@babel/helpers - typeof";
  return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$2(obj);
}
function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys$1(Object(source), true).forEach(function(key) {
      _defineProperty$2(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$2(obj, key, value) {
  key = _toPropertyKey$2(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$2(arg) {
  var key = _toPrimitive$2(arg, "string");
  return _typeof$2(key) === "symbol" ? key : String(key);
}
function _toPrimitive$2(input, hint) {
  if (_typeof$2(input) !== "object" || input === null)
    return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (_typeof$2(res) !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
var inlineStyles = {};
var buttonStyles = "\n.p-button {\n    display: inline-flex;\n    cursor: pointer;\n    user-select: none;\n    align-items: center;\n    vertical-align: bottom;\n    text-align: center;\n    overflow: hidden;\n    position: relative;\n}\n\n.p-button-label {\n    flex: 1 1 auto;\n}\n\n.p-button-icon-right {\n    order: 1;\n}\n\n.p-button:disabled {\n    cursor: default;\n}\n\n.p-button-icon-only {\n    justify-content: center;\n}\n\n.p-button-icon-only .p-button-label {\n    visibility: hidden;\n    width: 0;\n    flex: 0 0 auto;\n}\n\n.p-button-vertical {\n    flex-direction: column;\n}\n\n.p-button-icon-bottom {\n    order: 2;\n}\n\n.p-buttonset .p-button {\n    margin: 0;\n}\n\n.p-buttonset .p-button:not(:last-child) {\n    border-right: 0 none;\n}\n\n.p-buttonset .p-button:not(:first-of-type):not(:last-of-type) {\n    border-radius: 0;\n}\n\n.p-buttonset .p-button:first-of-type {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n\n.p-buttonset .p-button:last-of-type {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n\n.p-buttonset .p-button:focus {\n    position: relative;\n    z-index: 1;\n}\n";
var checkboxStyles = "\n.p-checkbox {\n    display: inline-flex;\n    cursor: pointer;\n    user-select: none;\n    vertical-align: bottom;\n    position: relative;\n}\n\n.p-checkbox.p-checkbox-disabled {\n    cursor: default;\n}\n\n.p-checkbox-box {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n";
var inputTextStyles = "\n.p-fluid .p-inputtext {\n    width: 100%;\n}\n\n/* InputGroup */\n.p-inputgroup {\n    display: flex;\n    align-items: stretch;\n    width: 100%;\n}\n\n.p-inputgroup-addon {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.p-inputgroup .p-float-label {\n    display: flex;\n    align-items: stretch;\n    width: 100%;\n}\n\n.p-inputgroup .p-inputtext,\n.p-fluid .p-inputgroup .p-inputtext,\n.p-inputgroup .p-inputwrapper,\n.p-fluid .p-inputgroup .p-input {\n    flex: 1 1 auto;\n    width: 1%;\n}\n\n/* Floating Label */\n.p-float-label {\n    display: block;\n    position: relative;\n}\n\n.p-float-label label {\n    position: absolute;\n    pointer-events: none;\n    top: 50%;\n    margin-top: -.5rem;\n    transition-property: all;\n    transition-timing-function: ease;\n    line-height: 1;\n}\n\n.p-float-label textarea ~ label {\n    top: 1rem;\n}\n\n.p-float-label input:focus ~ label,\n.p-float-label input.p-filled ~ label,\n.p-float-label textarea:focus ~ label,\n.p-float-label textarea.p-filled ~ label,\n.p-float-label .p-inputwrapper-focus ~ label,\n.p-float-label .p-inputwrapper-filled ~ label {\n    top: -.75rem;\n    font-size: 12px;\n}\n\n.p-float-label .input:-webkit-autofill ~ label {\n    top: -20px;\n    font-size: 12px;\n}\n\n.p-float-label .p-placeholder,\n.p-float-label input::placeholder,\n.p-float-label .p-inputtext::placeholder {\n    opacity: 0;\n    transition-property: all;\n    transition-timing-function: ease;\n}\n\n.p-float-label .p-focus .p-placeholder,\n.p-float-label input:focus::placeholder,\n.p-float-label .p-inputtext:focus::placeholder {\n    opacity: 1;\n    transition-property: all;\n    transition-timing-function: ease;\n}\n\n.p-input-icon-left,\n.p-input-icon-right {\n    position: relative;\n    display: inline-block;\n}\n\n.p-input-icon-left > i,\n.p-input-icon-left > svg,\n.p-input-icon-right > i,\n.p-input-icon-right > svg {\n    position: absolute;\n    top: 50%;\n    margin-top: -.5rem;\n}\n\n.p-fluid .p-input-icon-left,\n.p-fluid .p-input-icon-right {\n    display: block;\n    width: 100%;\n}\n";
var radioButtonStyles = "\n.p-radiobutton {\n    position: relative;\n    display: inline-flex;\n    cursor: pointer;\n    user-select: none;\n    vertical-align: bottom;\n}\n\n.p-radiobutton.p-radiobutton-disabled {\n    cursor: default;\n}\n\n.p-radiobutton-box {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n.p-radiobutton-icon {\n    -webkit-backface-visibility: hidden;\n    backface-visibility: hidden;\n    transform: translateZ(0) scale(.1);\n    border-radius: 50%;\n    visibility: hidden;\n}\n\n.p-radiobutton-box.p-highlight .p-radiobutton-icon {\n    transform: translateZ(0) scale(1.0, 1.0);\n    visibility: visible;\n}\n";
var styles$2 = "\n.p-component, .p-component * {\n    box-sizing: border-box;\n}\n\n.p-hidden-space {\n    visibility: hidden;\n}\n\n.p-reset {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    outline: 0;\n    text-decoration: none;\n    font-size: 100%;\n    list-style: none;\n}\n\n.p-disabled, .p-disabled * {\n    cursor: default !important;\n    pointer-events: none;\n    user-select: none;\n}\n\n.p-component-overlay {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n}\n\n.p-unselectable-text {\n    user-select: none;\n}\n\n.p-sr-only {\n    border: 0;\n    clip: rect(1px, 1px, 1px, 1px);\n    clip-path: inset(50%);\n    height: 1px;\n    margin: -1px;\n    overflow: hidden;\n    padding: 0;\n    position: absolute;\n    width: 1px;\n    word-wrap: normal !important;\n}\n\n.p-link {\n	text-align: left;\n	background-color: transparent;\n	margin: 0;\n	padding: 0;\n	border: none;\n    cursor: pointer;\n    user-select: none;\n}\n\n.p-link:disabled {\n	cursor: default;\n}\n\n/* Non vue overlay animations */\n.p-connected-overlay {\n    opacity: 0;\n    transform: scaleY(0.8);\n    transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1);\n}\n\n.p-connected-overlay-visible {\n    opacity: 1;\n    transform: scaleY(1);\n}\n\n.p-connected-overlay-hidden {\n    opacity: 0;\n    transform: scaleY(1);\n    transition: opacity .1s linear;\n}\n\n/* Vue based overlay animations */\n.p-connected-overlay-enter-from {\n    opacity: 0;\n    transform: scaleY(0.8);\n}\n\n.p-connected-overlay-leave-to {\n    opacity: 0;\n}\n\n.p-connected-overlay-enter-active {\n    transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1);\n}\n\n.p-connected-overlay-leave-active {\n    transition: opacity .1s linear;\n}\n\n/* Toggleable Content */\n.p-toggleable-content-enter-from,\n.p-toggleable-content-leave-to {\n    max-height: 0;\n}\n\n.p-toggleable-content-enter-to,\n.p-toggleable-content-leave-from {\n    max-height: 1000px;\n}\n\n.p-toggleable-content-leave-active {\n    overflow: hidden;\n    transition: max-height 0.45s cubic-bezier(0, 1, 0, 1);\n}\n\n.p-toggleable-content-enter-active {\n    overflow: hidden;\n    transition: max-height 1s ease-in-out;\n}\n".concat(buttonStyles, "\n").concat(checkboxStyles, "\n").concat(inputTextStyles, "\n").concat(radioButtonStyles, "\n");
var _useStyle$2 = useStyle(styles$2, {
  name: "common",
  manual: true
}), loadStyle$2 = _useStyle$2.load;
var script$5 = {
  name: "BaseComponent",
  props: {
    pt: {
      type: Object,
      "default": void 0
    },
    unstyled: {
      type: Boolean,
      "default": void 0
    }
  },
  inject: {
    $parentInstance: {
      "default": void 0
    }
  },
  watch: {
    isUnstyled: {
      immediate: true,
      handler: function handler(newValue) {
        if (!newValue) {
          loadStyle$2();
          this.$options.css && this.$css.loadStyle();
        }
      }
    }
  },
  beforeCreate: function beforeCreate() {
    var _this$pt, _this$pt$onBeforeCrea, _this$$primevue, _this$$primevue$onBef;
    (_this$pt = this.pt) === null || _this$pt === void 0 || (_this$pt = _this$pt.hooks) === null || _this$pt === void 0 || (_this$pt$onBeforeCrea = _this$pt["onBeforeCreate"]) === null || _this$pt$onBeforeCrea === void 0 ? void 0 : _this$pt$onBeforeCrea.call(_this$pt);
    (_this$$primevue = this.$primevue) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue.config) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue.pt) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue[this.$.type.name]) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue.hooks) === null || _this$$primevue === void 0 || (_this$$primevue$onBef = _this$$primevue["onBeforeCreate"]) === null || _this$$primevue$onBef === void 0 ? void 0 : _this$$primevue$onBef.call(_this$$primevue);
  },
  created: function created() {
    this._hook("onCreated");
  },
  beforeMount: function beforeMount() {
    loadBaseStyle();
    this._hook("onBeforeMount");
  },
  mounted: function mounted() {
    this._hook("onMounted");
  },
  beforeUpdate: function beforeUpdate() {
    this._hook("onBeforeUpdate");
  },
  updated: function updated() {
    this._hook("onUpdated");
  },
  beforeUnmount: function beforeUnmount() {
    this._hook("onBeforeUnmount");
  },
  unmounted: function unmounted() {
    this._hook("onUnmounted");
  },
  methods: {
    _hook: function _hook(hookName) {
      var selfHook = this._getOptionValue(this.pt, "hooks.".concat(hookName));
      var globalHook = this._getOptionValue(this.globalPT, "hooks.".concat(hookName));
      selfHook === null || selfHook === void 0 ? void 0 : selfHook();
      globalHook === null || globalHook === void 0 ? void 0 : globalHook();
    },
    _getHostInstance: function _getHostInstance(instance) {
      return instance ? this.$options.hostName ? instance.$.type.name === this.$options.hostName ? instance : this._getHostInstance(instance.$parentInstance) : instance.$parentInstance : void 0;
    },
    _getOptionValue: function _getOptionValue(options) {
      var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var fKeys = ObjectUtils.toFlatCase(key).split(".");
      var fKey = fKeys.shift();
      return fKey ? ObjectUtils.isObject(options) ? this._getOptionValue(ObjectUtils.getItemValue(options[Object.keys(options).find(function(k) {
        return ObjectUtils.toFlatCase(k) === fKey;
      }) || ""], params), fKeys.join("."), params) : void 0 : ObjectUtils.getItemValue(options, params);
    },
    _getPTValue: function _getPTValue() {
      var _this = this;
      var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      var searchInDefaultPT = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true;
      var getValue = function getValue2() {
        var value = _this._getOptionValue.apply(_this, arguments);
        return ObjectUtils.isString(value) || ObjectUtils.isArray(value) ? {
          "class": value
        } : value;
      };
      var datasetPrefix = "data-pc-";
      var self2 = getValue(obj, key, params);
      var globalPT2 = searchInDefaultPT ? /./g.test(key) && !!params[key.split(".")[0]] ? getValue(this.globalPT, key, params) : getValue(this.defaultPT, key, params) : void 0;
      var merged = mergeProps(self2, globalPT2, _objectSpread$1(_objectSpread$1({}, key === "root" && _defineProperty$2({}, "".concat(datasetPrefix, "name"), ObjectUtils.toFlatCase(this.$.type.name))), {}, _defineProperty$2({}, "".concat(datasetPrefix, "section"), ObjectUtils.toFlatCase(key))));
      return merged;
    },
    ptm: function ptm() {
      var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, key, _objectSpread$1({
        instance: this,
        props: this.$props,
        state: this.$data
      }, params));
    },
    ptmo: function ptmo() {
      var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
      var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(obj, key, _objectSpread$1({
        instance: this
      }, params), false);
    },
    cx: function cx() {
      var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return !this.isUnstyled ? this._getOptionValue(this.$css.classes, key, _objectSpread$1({
        instance: this,
        props: this.$props,
        state: this.$data,
        parentInstance: this.$parentInstance
      }, params)) : void 0;
    },
    sx: function sx() {
      var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      var when = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (when) {
        var self2 = this._getOptionValue(this.$css.inlineStyles, key, _objectSpread$1({
          instance: this,
          props: this.$props,
          state: this.$data,
          parentInstance: this.$parentInstance
        }, params));
        var base = this._getOptionValue(inlineStyles, key, _objectSpread$1({
          instance: this,
          props: this.$props,
          state: this.$data,
          parentInstance: this.$parentInstance
        }, params));
        return [base, self2];
      }
      return void 0;
    }
  },
  computed: {
    globalPT: function globalPT() {
      return ObjectUtils.getItemValue(this.$primevue.config.pt, {
        instance: this
      });
    },
    defaultPT: function defaultPT() {
      return this._getOptionValue(this.$primevue.config.pt, this.$options.hostName || this.$.type.name, {
        instance: this
      }) || this.globalPT;
    },
    isUnstyled: function isUnstyled() {
      return this.unstyled !== void 0 ? this.unstyled : this.$primevue.config.unstyled;
    },
    $css: function $css() {
      return _objectSpread$1(_objectSpread$1({
        classes: void 0,
        inlineStyles: void 0,
        loadStyle: function loadStyle2() {
        }
      }, (this._getHostInstance(this) || {}).$css), this.$options.css);
    }
  }
};
var styles$1 = "\n.p-badge {\n    display: inline-block;\n    border-radius: 10px;\n    text-align: center;\n    padding: 0 .5rem;\n}\n\n.p-overlay-badge {\n    position: relative;\n}\n\n.p-overlay-badge .p-badge {\n    position: absolute;\n    top: 0;\n    right: 0;\n    transform: translate(50%,-50%);\n    transform-origin: 100% 0;\n    margin: 0;\n}\n\n.p-badge-dot {\n    width: .5rem;\n    min-width: .5rem;\n    height: .5rem;\n    border-radius: 50%;\n    padding: 0;\n}\n\n.p-badge-no-gutter {\n    padding: 0;\n    border-radius: 50%;\n}\n";
var classes$2 = {
  root: function root(_ref) {
    var props = _ref.props, instance = _ref.instance;
    return ["p-badge p-component", {
      "p-badge-no-gutter": ObjectUtils.isNotEmpty(props.value) && String(props.value).length === 1,
      "p-badge-dot": ObjectUtils.isEmpty(props.value) && !instance.$slots["default"],
      "p-badge-lg": props.size === "large",
      "p-badge-xl": props.size === "xlarge",
      "p-badge-info": props.severity === "info",
      "p-badge-success": props.severity === "success",
      "p-badge-warning": props.severity === "warning",
      "p-badge-danger": props.severity === "danger"
    }];
  }
};
var _useStyle$1 = useStyle(styles$1, {
  name: "badge",
  manual: true
}), loadStyle$1 = _useStyle$1.load;
var script$1$1 = {
  name: "BaseBadge",
  "extends": script$5,
  props: {
    value: {
      type: [String, Number],
      "default": null
    },
    severity: {
      type: String,
      "default": null
    },
    size: {
      type: String,
      "default": null
    }
  },
  css: {
    classes: classes$2,
    loadStyle: loadStyle$1
  },
  provide: function provide2() {
    return {
      $parentInstance: this
    };
  }
};
var script$4 = {
  name: "Badge",
  "extends": script$1$1
};
function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", mergeProps({
    "class": _ctx.cx("root")
  }, _ctx.ptm("root"), {
    "data-pc-name": "badge"
  }), [renderSlot(_ctx.$slots, "default", {}, function() {
    return [createTextVNode(toDisplayString$1(_ctx.value), 1)];
  })], 16);
}
script$4.render = render$2;
var script$3 = {
  name: "BaseIcon",
  props: {
    label: {
      type: String,
      "default": void 0
    },
    spin: {
      type: Boolean,
      "default": false
    }
  },
  methods: {
    pti: function pti() {
      var isLabelEmpty = ObjectUtils.isEmpty(this.label);
      return {
        "class": ["p-icon", {
          "p-icon-spin": this.spin
        }],
        role: !isLabelEmpty ? "img" : void 0,
        "aria-label": !isLabelEmpty ? this.label : void 0,
        "aria-hidden": isLabelEmpty
      };
    }
  }
};
function styleInject(css, ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var insertAt = ref2.insertAt;
  if (!css || true) {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style2 = document.createElement("style");
  style2.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style2, head.firstChild);
    } else {
      head.appendChild(style2);
    }
  } else {
    head.appendChild(style2);
  }
  if (style2.styleSheet) {
    style2.styleSheet.cssText = css;
  } else {
    style2.appendChild(document.createTextNode(css));
  }
}
var css_248z = "\n.p-icon {\n    display: inline-block;\n}\n.p-icon-spin {\n    -webkit-animation: p-icon-spin 2s infinite linear;\n    animation: p-icon-spin 2s infinite linear;\n}\n@-webkit-keyframes p-icon-spin {\n0% {\n        -webkit-transform: rotate(0deg);\n        transform: rotate(0deg);\n}\n100% {\n        -webkit-transform: rotate(359deg);\n        transform: rotate(359deg);\n}\n}\n@keyframes p-icon-spin {\n0% {\n        -webkit-transform: rotate(0deg);\n        transform: rotate(0deg);\n}\n100% {\n        -webkit-transform: rotate(359deg);\n        transform: rotate(359deg);\n}\n}\n";
styleInject(css_248z);
var script$2 = {
  name: "SpinnerIcon",
  "extends": script$3,
  computed: {
    pathId: function pathId() {
      return "pv_icon_clip_".concat(UniqueComponentId());
    }
  }
};
var _hoisted_1$1 = ["clipPath"];
var _hoisted_2 = /* @__PURE__ */ createElementVNode("path", {
  d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
  fill: "currentColor"
}, null, -1);
var _hoisted_3 = [_hoisted_2];
var _hoisted_4 = ["id"];
var _hoisted_5 = /* @__PURE__ */ createElementVNode("rect", {
  width: "14",
  height: "14",
  fill: "white"
}, null, -1);
var _hoisted_6 = [_hoisted_5];
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), [createElementVNode("g", {
    clipPath: "url(#".concat($options.pathId, ")")
  }, _hoisted_3, 8, _hoisted_1$1), createElementVNode("defs", null, [createElementVNode("clipPath", {
    id: "".concat($options.pathId)
  }, _hoisted_6, 8, _hoisted_4)])], 16);
}
script$2.render = render$1;
function _typeof$1(obj) {
  "@babel/helpers - typeof";
  return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$1(obj);
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray$1(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$1(o, minLen);
}
function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s, _e, _x, _r, _arr = [], _n = true, _d = false;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i)
          return;
        _n = false;
      } else
        for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = true)
          ;
    } catch (err) {
      _d = true, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r))
          return;
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty$1(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty$1(obj, key, value) {
  key = _toPropertyKey$1(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$1(arg) {
  var key = _toPrimitive$1(arg, "string");
  return _typeof$1(key) === "symbol" ? key : String(key);
}
function _toPrimitive$1(input, hint) {
  if (_typeof$1(input) !== "object" || input === null)
    return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (_typeof$1(res) !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
var BaseDirective = {
  _getMeta: function _getMeta() {
    return [ObjectUtils.isObject(arguments.length <= 0 ? void 0 : arguments[0]) ? void 0 : arguments.length <= 0 ? void 0 : arguments[0], ObjectUtils.getItemValue(ObjectUtils.isObject(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getOptionValue: function _getOptionValue2(options) {
    var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var fKeys = ObjectUtils.toFlatCase(key).split(".");
    var fKey = fKeys.shift();
    return fKey ? ObjectUtils.isObject(options) ? BaseDirective._getOptionValue(ObjectUtils.getItemValue(options[Object.keys(options).find(function(k) {
      return ObjectUtils.toFlatCase(k) === fKey;
    }) || ""], params), fKeys.join("."), params) : void 0 : ObjectUtils.getItemValue(options, params);
  },
  _getPTValue: function _getPTValue2() {
    var instance = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var obj = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var key = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "";
    var params = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    var searchInDefaultPT = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
    var getValue = function getValue2() {
      var value = BaseDirective._getOptionValue.apply(BaseDirective, arguments);
      return ObjectUtils.isString(value) || ObjectUtils.isArray(value) ? {
        "class": value
      } : value;
    };
    var datasetPrefix = "data-pc-";
    var self2 = getValue(obj, key, params);
    var globalPT2 = searchInDefaultPT ? getValue(instance.defaultPT, key, params) : void 0;
    var merged = mergeProps(self2, globalPT2, _objectSpread(_objectSpread({}, key === "root" && _defineProperty$1({}, "".concat(datasetPrefix, "name"), ObjectUtils.toFlatCase(instance.$name))), {}, _defineProperty$1({}, "".concat(datasetPrefix, "section"), ObjectUtils.toFlatCase(key))));
    return merged;
  },
  _hook: function _hook2(directiveName, hookName, el, binding, vnode, prevVnode) {
    var _binding$instance, _binding$value, _config$pt;
    var name = "on".concat(ObjectUtils.toCapitalCase(hookName));
    var config = binding === null || binding === void 0 || (_binding$instance = binding.instance) === null || _binding$instance === void 0 || (_binding$instance = _binding$instance.$primevue) === null || _binding$instance === void 0 ? void 0 : _binding$instance.config;
    var selfHook = binding === null || binding === void 0 || (_binding$value = binding.value) === null || _binding$value === void 0 || (_binding$value = _binding$value.pt) === null || _binding$value === void 0 || (_binding$value = _binding$value.hooks) === null || _binding$value === void 0 ? void 0 : _binding$value[name];
    var globalHook = config === null || config === void 0 || (_config$pt = config.pt) === null || _config$pt === void 0 || (_config$pt = _config$pt.directives) === null || _config$pt === void 0 || (_config$pt = _config$pt[directiveName]) === null || _config$pt === void 0 || (_config$pt = _config$pt.hooks) === null || _config$pt === void 0 ? void 0 : _config$pt[name];
    var options = {
      el,
      binding,
      vnode,
      prevVnode
    };
    selfHook === null || selfHook === void 0 ? void 0 : selfHook(el === null || el === void 0 ? void 0 : el.$instance, options);
    globalHook === null || globalHook === void 0 ? void 0 : globalHook(el === null || el === void 0 ? void 0 : el.$instance, options);
  },
  _extend: function _extend(name) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var handleHook = function handleHook2(hook, el, binding, vnode, prevVnode) {
      var _binding$instance2, _config$pt2, _el$$instance$hook, _el$$instance5;
      el._$instances = el._$instances || {};
      var config = binding === null || binding === void 0 || (_binding$instance2 = binding.instance) === null || _binding$instance2 === void 0 || (_binding$instance2 = _binding$instance2.$primevue) === null || _binding$instance2 === void 0 ? void 0 : _binding$instance2.config;
      var $prevInstance = el._$instances[name] || {};
      var $options = ObjectUtils.isEmpty($prevInstance) ? _objectSpread(_objectSpread({}, options), options === null || options === void 0 ? void 0 : options.methods) : {};
      el._$instances[name] = _objectSpread(_objectSpread({}, $prevInstance), {}, {
        /* new instance variables to pass in directive methods */
        $name: name,
        $host: el,
        $binding: binding,
        $el: $prevInstance["$el"] || void 0,
        $css: _objectSpread({
          classes: void 0,
          inlineStyles: void 0,
          loadStyle: function loadStyle2() {
          }
        }, options === null || options === void 0 ? void 0 : options.css),
        /* computed instance variables */
        defaultPT: config === null || config === void 0 || (_config$pt2 = config.pt) === null || _config$pt2 === void 0 || (_config$pt2 = _config$pt2.directives) === null || _config$pt2 === void 0 ? void 0 : _config$pt2[name],
        isUnstyled: el.unstyled !== void 0 ? el.unstyled : config === null || config === void 0 ? void 0 : config.unstyled,
        /* instance's methods */
        ptm: function ptm2() {
          var _el$$instance;
          var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
          var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return BaseDirective._getPTValue(el.$instance, (_el$$instance = el.$instance) === null || _el$$instance === void 0 || (_el$$instance = _el$$instance.$binding) === null || _el$$instance === void 0 || (_el$$instance = _el$$instance.value) === null || _el$$instance === void 0 ? void 0 : _el$$instance.pt, key, _objectSpread({}, params));
        },
        ptmo: function ptmo2() {
          var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          var key = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
          var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return BaseDirective._getPTValue(el.$instance, obj, key, params, false);
        },
        cx: function cx2() {
          var _el$$instance2, _el$$instance3;
          var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
          var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return !((_el$$instance2 = el.$instance) !== null && _el$$instance2 !== void 0 && _el$$instance2.isUnstyled) ? BaseDirective._getOptionValue((_el$$instance3 = el.$instance) === null || _el$$instance3 === void 0 || (_el$$instance3 = _el$$instance3.$css) === null || _el$$instance3 === void 0 ? void 0 : _el$$instance3.classes, key, _objectSpread({}, params)) : void 0;
        },
        sx: function sx2() {
          var _el$$instance4;
          var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
          var when = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
          var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return when ? BaseDirective._getOptionValue((_el$$instance4 = el.$instance) === null || _el$$instance4 === void 0 || (_el$$instance4 = _el$$instance4.$css) === null || _el$$instance4 === void 0 ? void 0 : _el$$instance4.inlineStyles, key, _objectSpread({}, params)) : void 0;
        }
      }, $options);
      el.$instance = el._$instances[name];
      (_el$$instance$hook = (_el$$instance5 = el.$instance)[hook]) === null || _el$$instance$hook === void 0 ? void 0 : _el$$instance$hook.call(_el$$instance5, el, binding, vnode, prevVnode);
      BaseDirective._hook(name, hook, el, binding, vnode, prevVnode);
    };
    return {
      created: function created2(el, binding, vnode, prevVnode) {
        handleHook("created", el, binding, vnode, prevVnode);
      },
      beforeMount: function beforeMount2(el, binding, vnode, prevVnode) {
        var _el$$instance6, _el$$instance7;
        loadBaseStyle();
        !((_el$$instance6 = el.$instance) !== null && _el$$instance6 !== void 0 && _el$$instance6.isUnstyled) && ((_el$$instance7 = el.$instance) === null || _el$$instance7 === void 0 || (_el$$instance7 = _el$$instance7.$css) === null || _el$$instance7 === void 0 ? void 0 : _el$$instance7.loadStyle());
        handleHook("beforeMount", el, binding, vnode, prevVnode);
      },
      mounted: function mounted3(el, binding, vnode, prevVnode) {
        handleHook("mounted", el, binding, vnode, prevVnode);
      },
      beforeUpdate: function beforeUpdate2(el, binding, vnode, prevVnode) {
        handleHook("beforeUpdate", el, binding, vnode, prevVnode);
      },
      updated: function updated2(el, binding, vnode, prevVnode) {
        handleHook("updated", el, binding, vnode, prevVnode);
      },
      beforeUnmount: function beforeUnmount2(el, binding, vnode, prevVnode) {
        handleHook("beforeUnmount", el, binding, vnode, prevVnode);
      },
      unmounted: function unmounted3(el, binding, vnode, prevVnode) {
        handleHook("unmounted", el, binding, vnode, prevVnode);
      }
    };
  },
  extend: function extend() {
    var _BaseDirective$_getMe = BaseDirective._getMeta.apply(BaseDirective, arguments), _BaseDirective$_getMe2 = _slicedToArray(_BaseDirective$_getMe, 2), name = _BaseDirective$_getMe2[0], options = _BaseDirective$_getMe2[1];
    return _objectSpread({
      extend: function extend2() {
        var _BaseDirective$_getMe3 = BaseDirective._getMeta.apply(BaseDirective, arguments), _BaseDirective$_getMe4 = _slicedToArray(_BaseDirective$_getMe3, 2), _name = _BaseDirective$_getMe4[0], _options = _BaseDirective$_getMe4[1];
        return BaseDirective.extend(_name, _objectSpread(_objectSpread(_objectSpread({}, options), options === null || options === void 0 ? void 0 : options.methods), _options));
      }
    }, BaseDirective._extend(name, options));
  }
};
var styles = "\n.p-ripple {\n    overflow: hidden;\n    position: relative;\n}\n\n.p-ink {\n    display: block;\n    position: absolute;\n    background: rgba(255, 255, 255, 0.5);\n    border-radius: 100%;\n    transform: scale(0);\n    pointer-events: none;\n}\n\n.p-ink-active {\n    animation: ripple 0.4s linear;\n}\n\n.p-ripple-disabled .p-ink {\n    display: none !important;\n}\n\n@keyframes ripple {\n    100% {\n        opacity: 0;\n        transform: scale(2.5);\n    }\n}\n";
var classes$1 = {
  root: "p-ink"
};
var _useStyle = useStyle(styles, {
  name: "ripple",
  manual: true
}), loadStyle = _useStyle.load;
var BaseRipple = BaseDirective.extend({
  css: {
    classes: classes$1,
    loadStyle
  }
});
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
var Ripple = BaseRipple.extend("ripple", {
  mounted: function mounted2(el, binding) {
    var primevue2 = binding.instance.$primevue;
    if (primevue2 && primevue2.config && primevue2.config.ripple) {
      var _binding$value;
      el.unstyled = primevue2.config.unstyled || ((_binding$value = binding.value) === null || _binding$value === void 0 ? void 0 : _binding$value.unstyled) || false;
      this.create(el);
      this.bindEvents(el);
    }
    el.setAttribute("data-pd-ripple", true);
  },
  unmounted: function unmounted2(el) {
    this.remove(el);
  },
  timeout: void 0,
  methods: {
    bindEvents: function bindEvents(el) {
      el.addEventListener("mousedown", this.onMouseDown.bind(this));
    },
    unbindEvents: function unbindEvents(el) {
      el.removeEventListener("mousedown", this.onMouseDown.bind(this));
    },
    create: function create(el) {
      var ink = DomHandler.createElement("span", {
        role: "presentation",
        "aria-hidden": true,
        "data-p-ink": true,
        "data-p-ink-active": false,
        "class": !el.unstyled && this.cx("root"),
        onAnimationEnd: this.onAnimationEnd,
        "p-bind": this.ptm("root")
      });
      el.appendChild(ink);
      this.$el = ink;
    },
    remove: function remove(el) {
      var ink = this.getInk(el);
      if (ink) {
        this.unbindEvents(el);
        ink.removeEventListener("animationend", this.onAnimationEnd);
        ink.remove();
      }
    },
    onMouseDown: function onMouseDown(event) {
      var target = event.currentTarget;
      var ink = this.getInk(target);
      if (!ink || getComputedStyle(ink, null).display === "none") {
        return;
      }
      !target.unstyled && DomHandler.removeClass(ink, "p-ink-active");
      ink.setAttribute("data-p-ink-active", "false");
      if (!DomHandler.getHeight(ink) && !DomHandler.getWidth(ink)) {
        var d = Math.max(DomHandler.getOuterWidth(target), DomHandler.getOuterHeight(target));
        ink.style.height = d + "px";
        ink.style.width = d + "px";
      }
      var offset = DomHandler.getOffset(target);
      var x = event.pageX - offset.left + document.body.scrollTop - DomHandler.getWidth(ink) / 2;
      var y = event.pageY - offset.top + document.body.scrollLeft - DomHandler.getHeight(ink) / 2;
      ink.style.top = y + "px";
      ink.style.left = x + "px";
      !target.unstyled && DomHandler.addClass(ink, "p-ink-active");
      ink.setAttribute("data-p-ink-active", "true");
      this.timeout = setTimeout(function() {
        if (ink) {
          !target.unstyled && DomHandler.removeClass(ink, "p-ink-active");
          ink.setAttribute("data-p-ink-active", "false");
        }
      }, 401);
    },
    onAnimationEnd: function onAnimationEnd(event) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      !event.currentTarget.unstyled && DomHandler.removeClass(event.currentTarget, "p-ink-active");
      event.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function getInk(el) {
      return el && el.children ? _toConsumableArray(el.children).find(function(child) {
        return DomHandler.getAttribute(child, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && "function" == typeof Symbol && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof(obj);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null)
    return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== void 0) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object")
      return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
var classes = {
  root: function root2(_ref) {
    var _ref2;
    var instance = _ref.instance, props = _ref.props;
    return ["p-button p-component", (_ref2 = {
      "p-button-icon-only": instance.hasIcon && !props.label && !props.badge,
      "p-button-vertical": (props.iconPos === "top" || props.iconPos === "bottom") && props.label,
      "p-disabled": instance.$attrs.disabled || instance.$attrs.disabled === "" || props.loading,
      "p-button-loading": props.loading,
      "p-button-loading-label-only": props.loading && !instance.hasIcon && props.label,
      "p-button-link": props.link
    }, _defineProperty(_ref2, "p-button-".concat(props.severity), props.severity), _defineProperty(_ref2, "p-button-raised", props.raised), _defineProperty(_ref2, "p-button-rounded", props.rounded), _defineProperty(_ref2, "p-button-text", props.text), _defineProperty(_ref2, "p-button-outlined", props.outlined), _defineProperty(_ref2, "p-button-sm", props.size === "small"), _defineProperty(_ref2, "p-button-lg", props.size === "large"), _defineProperty(_ref2, "p-button-plain", props.plain), _ref2)];
  },
  loadingIcon: "p-button-loading-icon pi-spin",
  icon: function icon(_ref3) {
    var props = _ref3.props;
    return ["p-button-icon", {
      "p-button-icon-left": props.iconPos === "left" && props.label,
      "p-button-icon-right": props.iconPos === "right" && props.label,
      "p-button-icon-top": props.iconPos === "top" && props.label,
      "p-button-icon-bottom": props.iconPos === "bottom" && props.label
    }];
  },
  label: "p-button-label"
};
var script$1 = {
  name: "BaseButton",
  "extends": script$5,
  props: {
    label: {
      type: String,
      "default": null
    },
    icon: {
      type: String,
      "default": null
    },
    iconPos: {
      type: String,
      "default": "left"
    },
    iconClass: {
      type: String,
      "default": null
    },
    badge: {
      type: String,
      "default": null
    },
    badgeClass: {
      type: String,
      "default": null
    },
    loading: {
      type: Boolean,
      "default": false
    },
    loadingIcon: {
      type: String,
      "default": void 0
    },
    link: {
      type: Boolean,
      "default": false
    },
    severity: {
      type: String,
      "default": null
    },
    raised: {
      type: Boolean,
      "default": false
    },
    rounded: {
      type: Boolean,
      "default": false
    },
    text: {
      type: Boolean,
      "default": false
    },
    outlined: {
      type: Boolean,
      "default": false
    },
    size: {
      type: String,
      "default": null
    },
    plain: {
      type: Boolean,
      "default": false
    }
  },
  css: {
    classes
  },
  provide: function provide3() {
    return {
      $parentInstance: this
    };
  }
};
var script = {
  name: "Button",
  "extends": script$1,
  methods: {
    getPTOptions: function getPTOptions(key) {
      return this.ptm(key, {
        context: {
          disabled: this.disabled
        }
      });
    }
  },
  computed: {
    disabled: function disabled() {
      return this.$attrs.disabled || this.$attrs.disabled === "" || this.loading;
    },
    defaultAriaLabel: function defaultAriaLabel() {
      return this.label ? this.label + (this.badge ? " " + this.badge : "") : this.$attrs["aria-label"];
    },
    hasIcon: function hasIcon() {
      return this.icon || this.$slots.icon;
    }
  },
  components: {
    SpinnerIcon: script$2,
    Badge: script$4
  },
  directives: {
    ripple: Ripple
  }
};
var _hoisted_1 = ["aria-label", "disabled", "data-pc-severity"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_SpinnerIcon = resolveComponent("SpinnerIcon");
  var _component_Badge = resolveComponent("Badge");
  var _directive_ripple = resolveDirective("ripple");
  return withDirectives((openBlock(), createElementBlock("button", mergeProps({
    "class": _ctx.cx("root"),
    type: "button",
    "aria-label": $options.defaultAriaLabel,
    disabled: $options.disabled
  }, $options.getPTOptions("root"), {
    "data-pc-name": "button",
    "data-pc-severity": _ctx.severity
  }), [renderSlot(_ctx.$slots, "default", {}, function() {
    return [_ctx.loading ? renderSlot(_ctx.$slots, "loadingicon", {
      key: 0,
      "class": normalizeClass([_ctx.cx("loadingIcon"), _ctx.cx("icon")])
    }, function() {
      return [_ctx.loadingIcon ? (openBlock(), createElementBlock("span", mergeProps({
        key: 0,
        "class": [_ctx.cx("loadingIcon"), _ctx.cx("icon"), _ctx.loadingIcon]
      }, _ctx.ptm("loadingIcon")), null, 16)) : (openBlock(), createBlock(_component_SpinnerIcon, mergeProps({
        key: 1,
        "class": [_ctx.cx("loadingIcon"), _ctx.cx("icon")],
        spin: ""
      }, _ctx.ptm("loadingIcon")), null, 16, ["class"]))];
    }) : renderSlot(_ctx.$slots, "icon", {
      key: 1,
      "class": normalizeClass(_ctx.cx("icon"))
    }, function() {
      return [_ctx.icon ? (openBlock(), createElementBlock("span", mergeProps({
        key: 0,
        "class": [_ctx.cx("icon"), _ctx.icon]
      }, _ctx.ptm("icon")), null, 16)) : createCommentVNode("", true)];
    }), createElementVNode("span", mergeProps({
      "class": _ctx.cx("label")
    }, _ctx.ptm("label")), toDisplayString$1(_ctx.label || " "), 17), _ctx.badge ? (openBlock(), createBlock(_component_Badge, mergeProps({
      key: 2,
      value: _ctx.badge,
      "class": _ctx.badgeClass,
      unstyled: _ctx.unstyled
    }, _ctx.ptm("badge")), null, 16, ["value", "class", "unstyled"])) : createCommentVNode("", true)];
  })], 16, _hoisted_1)), [[_directive_ripple]]);
}
script.render = render;
const primevue_TdXjRgL1MA = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue);
  nuxtApp.vueApp.component("Button", script);
});
const plugins = [
  plugin$1,
  plugin,
  revive_payload_server_eJ33V7gbc6,
  components_plugin_KR1HBZs4kY,
  unhead_KgADcZ0jPj,
  plugin_FRmGFsEaPh,
  plugin_server_XNCxeHyTuP,
  cookies_fWsGjKD4Pq,
  i18n_VfGcjrvSkj,
  primevue_TdXjRgL1MA
];
const _imports_0$1 = "" + __publicAssetsURL("images/loading2.gif");
const LoadingPage_vue_vue_type_style_index_0_scoped_11eba00d_lang$1 = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$k = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-screen w-full flex items-center justify-center" }, _attrs))} data-v-11eba00d><h2 class="animate" data-v-11eba00d><img${ssrRenderAttr("src", _imports_0$1)} class="w-600" data-v-11eba00d></h2></div>`);
}
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LoadingPage.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const __nuxt_component_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-11eba00d"]]);
const _wrapIf = (component, props, slots) => {
  props = props === true ? {} : props;
  return { default: () => {
    var _a;
    return props ? h(component, props, slots) : (_a = slots.default) == null ? void 0 : _a.call(slots);
  } };
};
const layouts = {
  default: () => Promise.resolve().then(function() {
    return _default;
  }).then((m) => m.default || m),
  home: () => Promise.resolve().then(function() {
    return home$1;
  }).then((m) => m.default || m)
};
const LayoutLoader = /* @__PURE__ */ defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => h(LayoutComponent, props.layoutProps, context.slots);
  }
});
const __nuxt_component_1$3 = /* @__PURE__ */ defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => unref(props.name) ?? route.meta.layout ?? "default");
    const layoutRef = ref();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            // @ts-expect-error seems to be an issue in vue types
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value,
              name: layout.value,
              shouldProvide: !props.name,
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = /* @__PURE__ */ defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    return () => {
      var _a, _b;
      if (!name || typeof name === "string" && !(name in layouts)) {
        return (_b = (_a = context.slots).default) == null ? void 0 : _b.call(_a);
      }
      return h(
        // @ts-expect-error seems to be an issue in vue types
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const RouteProvider = /* @__PURE__ */ defineComponent({
  name: "RouteProvider",
  props: {
    vnode: {
      type: Object,
      required: true
    },
    route: {
      type: Object,
      required: true
    },
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key]
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const __nuxt_component_2$1 = /* @__PURE__ */ defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    let vnode;
    const done = nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            return;
          }
          const key = generateRouteKey(routeProps, props.pageKey);
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          vnode = _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive,
              h(Suspense, {
                suspensible: true,
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).finally(done));
                }
              }, {
                // @ts-expect-error seems to be an issue in vue types
                default: () => h(RouteProvider, {
                  key,
                  vnode: routeProps.Component,
                  route: routeProps.route,
                  renderKey: key,
                  trackRootNodes: hasTransition,
                  vnodeRef: pageRef
                })
              })
            )
          ).default();
          return vnode;
        }
      });
    };
  }
});
function _toArray(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
}
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: _toArray(prop.onAfterLeave)
  }));
  return defu(..._props);
}
const app_vue_vue_type_style_index_0_lang$1 = "";
const _sfc_main$j = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale } = useI18n({ useScope: "global" });
    const cookieLocale = useLocaleStore();
    locale.value = cookieLocale.getLocale || "en";
    const loadingPage = ref();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoadingPage = __nuxt_component_0$2;
      const _component_NuxtLayout = __nuxt_component_1$3;
      const _component_NuxtPage = __nuxt_component_2$1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_LoadingPage, {
        style: !unref(loadingPage) ? null : { display: "none" }
      }, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLayout, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtPage, { transition: "" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtPage, { transition: "" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const AppComponent = _sfc_main$j;
const _sfc_main$i = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    (_error.stack || "").split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n");
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = /* @__PURE__ */ defineAsyncComponent(() => Promise.resolve().then(function() {
      return error404$1;
    }).then((r) => r.default || r));
    const _Error = /* @__PURE__ */ defineAsyncComponent(() => Promise.resolve().then(function() {
      return error500$1;
    }).then((r) => r.default || r));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const ErrorComponent = _sfc_main$i;
const _sfc_main$h = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = /* @__PURE__ */ defineAsyncComponent(() => Promise.resolve().then(function() {
      return islandRenderer$1;
    }).then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const { islandContext } = nuxtApp.ssrContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const RootComponent = _sfc_main$h;
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(RootComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.hooks.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    if (ssrContext == null ? void 0 : ssrContext._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);
const tailwind = `/*! tailwindcss v3.3.2 | MIT License | https://tailwindcss.com*/*,:after,:before{border:0 solid #e5e7eb;box-sizing:border-box}:after,:before{--tw-content:""}html{-webkit-text-size-adjust:100%;font-feature-settings:normal;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{color:inherit;font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{color:#9ca3af;opacity:1}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]{display:none}*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.container{width:100%}@media (min-width:640px){.container{max-width:640px}}@media (min-width:768px){.container{max-width:768px}}@media (min-width:1024px){.container{max-width:1024px}}@media (min-width:1280px){.container{max-width:1280px}}@media (min-width:1536px){.container{max-width:1536px}}.fixed{position:fixed}.relative{position:relative}.bottom-20{bottom:5rem}.left-0{left:0}.right-0{right:0}.z-\\[100\\]{z-index:100}.mx-auto{margin-left:auto;margin-right:auto}.mb-20{margin-bottom:5rem}.mb-4{margin-bottom:1rem}.mr-2{margin-right:.5rem}.mr-4{margin-right:1rem}.mt-2{margin-top:.5rem}.mt-4{margin-top:1rem}.mt-5{margin-top:1.25rem}.mt-auto{margin-top:auto}.block{display:block}.flex{display:flex}.grid{display:grid}.h-3{height:.75rem}.h-4{height:1rem}.h-6{height:1.5rem}.h-full{height:100%}.h-screen{height:100vh}.w-3{width:.75rem}.w-4{width:1rem}.w-40{width:10rem}.w-full{width:100%}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@keyframes bounce{0%,to{animation-timing-function:cubic-bezier(.8,0,1,1);transform:translateY(-25%)}50%{animation-timing-function:cubic-bezier(0,0,.2,1);transform:none}}.animate-bounce{animation:bounce 1s infinite}.cursor-pointer{cursor:pointer}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.gap-2{gap:.5rem}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:.75rem;margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.rounded{border-radius:.25rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.border{border-width:1px}.border-0{border-width:0}.bg-\\[\\#383838\\]{--tw-bg-opacity:1;background-color:#383838;background-color:rgb(56 56 56/var(--tw-bg-opacity))}.bg-\\[\\#3f3f40\\]{--tw-bg-opacity:1;background-color:#3f3f40;background-color:rgb(63 63 64/var(--tw-bg-opacity))}.bg-gray-400{--tw-bg-opacity:1;background-color:#9ca3af;background-color:rgb(156 163 175/var(--tw-bg-opacity))}.bg-ranko-500{--tw-bg-opacity:1;background-color:#f39c12;background-color:rgb(243 156 18/var(--tw-bg-opacity))}.fill-current{fill:currentColor}.p-2{padding:.5rem}.p-4{padding:1rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.py-20{padding-bottom:5rem;padding-top:5rem}.py-3{padding-bottom:.75rem;padding-top:.75rem}.pl-2{padding-left:.5rem}.text-center{text-align:center}.text-justify{text-align:justify}.text-\\[3rem\\]{font-size:3rem}.text-\\[5rem\\]{font-size:5rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-semibold{font-weight:600}.text-\\[\\#1e1e1f\\]{--tw-text-opacity:1;color:#1e1e1f;color:rgb(30 30 31/var(--tw-text-opacity))}.text-\\[\\#f39c12\\]{--tw-text-opacity:1;color:#f39c12;color:rgb(243 156 18/var(--tw-text-opacity))}.text-\\[\\#fafafa\\]{--tw-text-opacity:1;color:#fafafa;color:rgb(250 250 250/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:#6b7280;color:rgb(107 114 128/var(--tw-text-opacity))}.text-gray-800{--tw-text-opacity:1;color:#1f2937;color:rgb(31 41 55/var(--tw-text-opacity))}.text-purple-800{--tw-text-opacity:1;color:#6b21a8;color:rgb(107 33 168/var(--tw-text-opacity))}.text-ranko-500{--tw-text-opacity:1;color:#f39c12;color:rgb(243 156 18/var(--tw-text-opacity))}.opacity-25{opacity:.25}.shadow-md{--tw-shadow:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1);--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color),0 2px 4px -2px var(--tw-shadow-color);box-shadow:0 0 #0000,0 0 #0000,0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-xl{--tw-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);--tw-shadow-colored:0 20px 25px -5px var(--tw-shadow-color),0 8px 10px -6px var(--tw-shadow-color);box-shadow:0 0 #0000,0 0 #0000,0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.blur{--tw-blur:blur(8px);filter:blur(8px) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.blur,.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,-webkit-backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.after\\:content-\\[\\'\\2c \\'\\]:after{--tw-content:",";content:",";content:var(--tw-content)}.hover\\:bg-\\[\\#1e1e1f\\]:hover{--tw-bg-opacity:1;background-color:#1e1e1f;background-color:rgb(30 30 31/var(--tw-bg-opacity))}:is(.dark .dark\\:bg-gray-800){--tw-bg-opacity:1;background-color:#1f2937;background-color:rgb(31 41 55/var(--tw-bg-opacity))}:is(.dark .dark\\:text-gray-400){--tw-text-opacity:1;color:#9ca3af;color:rgb(156 163 175/var(--tw-text-opacity))}:is(.dark .dark\\:text-purple-200){--tw-text-opacity:1;color:#e9d5ff;color:rgb(233 213 255/var(--tw-text-opacity))}@media (min-width:768px){.md\\:mb-0{margin-bottom:0}.md\\:w-\\[25\\%\\]{width:25%}}@media (min-width:1280px){.xl\\:block{display:block}.xl\\:after\\:content-\\[\\'\\'\\]:after{--tw-content:"";content:"";content:var(--tw-content)}}`;
const theme = ':root{--surface-a:#2a323d;--surface-b:#20262e;--surface-c:hsla(0,0%,100%,.04);--surface-d:#3f4b5b;--surface-e:#2a323d;--surface-f:#2a323d;--text-color:hsla(0,0%,100%,.87);--text-color-secondary:hsla(0,0%,100%,.6);--primary-color:#8dd0ff;--primary-color-text:#151515;--font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;--surface-0:#20262e;--surface-50:#363c43;--surface-100:#4d5158;--surface-200:#63676d;--surface-300:#797d82;--surface-400:#909397;--surface-500:#a6a8ab;--surface-600:#bcbec0;--surface-700:#d2d4d5;--surface-800:#e9e9ea;--surface-900:#fff;--gray-50:#e9e9ea;--gray-100:#d2d4d5;--gray-200:#bcbec0;--gray-300:#a6a8ab;--gray-400:#909397;--gray-500:#797d82;--gray-600:#63676d;--gray-700:#4d5158;--gray-800:#363c43;--gray-900:#20262e;--content-padding:1.25rem;--inline-spacing:0.5rem;--border-radius:4px;--surface-ground:#20262e;--surface-section:#20262e;--surface-card:#2a323d;--surface-overlay:#2a323d;--surface-border:#3f4b5b;--surface-hover:hsla(0,0%,100%,.04);--focus-ring:0 0 0 1px #e3f3fe;--maskbg:rgba(0,0,0,.4);--highlight-bg:#8dd0ff;--highlight-text-color:#151515;color-scheme:dark}*{box-sizing:border-box}.p-component{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;font-size:1rem;font-weight:400}.p-component-overlay{background-color:rgba(0,0,0,.4);transition-duration:.15s}.p-component:disabled,.p-disabled{opacity:.65}.p-error{color:#f19ea6}.p-text-secondary{color:hsla(0,0%,100%,.6)}.pi{font-size:1rem}.p-icon{height:1rem;width:1rem}.p-link{border-radius:4px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;font-size:1rem}.p-link:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-component-overlay-enter{animation:p-component-overlay-enter-animation .15s forwards}.p-component-overlay-leave{animation:p-component-overlay-leave-animation .15s forwards}@keyframes p-component-overlay-enter-animation{0%{background-color:transparent}to{background-color:rgba(0,0,0,.4);background-color:var(--maskbg)}}@keyframes p-component-overlay-leave-animation{0%{background-color:rgba(0,0,0,.4);background-color:var(--maskbg)}to{background-color:transparent}}:root{--blue-50:#f3f8ff;--blue-100:#c5dcff;--blue-200:#97c1fe;--blue-300:#69a5fe;--blue-400:#3b8afd;--blue-500:#0d6efd;--blue-600:#0b5ed7;--blue-700:#094db1;--blue-800:#073d8b;--blue-900:#052c65;--green-50:#f4f9f6;--green-100:#c8e2d6;--green-200:#9ccbb5;--green-300:#70b595;--green-400:#459e74;--green-500:#198754;--green-600:#157347;--green-700:#125f3b;--green-800:#0e4a2e;--green-900:#0a3622;--yellow-50:#fffcf3;--yellow-100:#fff0c3;--yellow-200:#ffe494;--yellow-300:#ffd965;--yellow-400:#ffcd36;--yellow-500:#ffc107;--yellow-600:#d9a406;--yellow-700:#b38705;--yellow-800:#8c6a04;--yellow-900:#664d03;--cyan-50:#f3fcfe;--cyan-100:#c5f2fb;--cyan-200:#97e8f9;--cyan-300:#69def6;--cyan-400:#3bd4f3;--cyan-500:#0dcaf0;--cyan-600:#0baccc;--cyan-700:#098da8;--cyan-800:#076f84;--cyan-900:#055160;--pink-50:#fdf5f9;--pink-100:#f5cee1;--pink-200:#eda7ca;--pink-300:#e681b3;--pink-400:#de5a9b;--pink-500:#d63384;--pink-600:#b62b70;--pink-700:#96245c;--pink-800:#761c49;--pink-900:#561435;--indigo-50:#f7f3fe;--indigo-100:#dac6fc;--indigo-200:#bd98f9;--indigo-300:#a06bf7;--indigo-400:#833df4;--indigo-500:#6610f2;--indigo-600:#570ece;--indigo-700:#470ba9;--indigo-800:#380985;--indigo-900:#290661;--teal-50:#f4fcfa;--teal-100:#c9f2e6;--teal-200:#9fe8d2;--teal-300:#75debf;--teal-400:#4ad3ab;--teal-500:#20c997;--teal-600:#1bab80;--teal-700:#168d6a;--teal-800:#126f53;--teal-900:#0d503c;--orange-50:#fff9f3;--orange-100:#ffe0c7;--orange-200:#fec89a;--orange-300:#feaf6d;--orange-400:#fd9741;--orange-500:#fd7e14;--orange-600:#d76b11;--orange-700:#b1580e;--orange-800:#8b450b;--orange-900:#653208;--bluegray-50:#f8f9fb;--bluegray-100:#e0e4ea;--bluegray-200:#c7ced9;--bluegray-300:#aeb9c8;--bluegray-400:#95a3b8;--bluegray-500:#7c8ea7;--bluegray-600:#69798e;--bluegray-700:#576375;--bluegray-800:#444e5c;--bluegray-900:#323943;--purple-50:#f8f6fc;--purple-100:#dcd2f0;--purple-200:#c1aee4;--purple-300:#a68ad9;--purple-400:#8a66cd;--purple-500:#6f42c1;--purple-600:#5e38a4;--purple-700:#4e2e87;--purple-800:#3d246a;--purple-900:#2c1a4d;--red-50:#fdf5f6;--red-100:#f7cfd2;--red-200:#f0a8af;--red-300:#e9828c;--red-400:#e35b68;--red-500:#dc3545;--red-600:#bb2d3b;--red-700:#9a2530;--red-800:#791d26;--red-900:#58151c;--primary-50:#f9fdff;--primary-100:#e4f4ff;--primary-200:#ceebff;--primary-300:#b8e2ff;--primary-400:#a3d9ff;--primary-500:#8dd0ff;--primary-600:#78b1d9;--primary-700:#6392b3;--primary-800:#4e728c;--primary-900:#385366}.p-autocomplete .p-autocomplete-loader{right:.75rem}.p-autocomplete.p-autocomplete-dd .p-autocomplete-loader{right:3.107rem}.p-autocomplete:not(.p-disabled):hover .p-autocomplete-multiple-container{border-color:#3f4b5b}.p-autocomplete:not(.p-disabled).p-focus .p-autocomplete-multiple-container{border-color:#8dd0ff;box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-autocomplete .p-autocomplete-multiple-container{gap:.5rem;padding:.25rem .75rem}.p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-input-token{padding:.25rem 0}.p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-input-token input{color:hsla(0,0%,100%,.87);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;font-size:1rem;margin:0;padding:0}.p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-token{background:#3f4b5b;border-radius:16px;color:hsla(0,0%,100%,.87);padding:.25rem .75rem}.p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-token .p-autocomplete-token-icon{margin-left:.5rem}.p-autocomplete .p-autocomplete-multiple-container .p-autocomplete-token.p-focus{background:#4c5866;color:hsla(0,0%,100%,.87)}.p-autocomplete.p-invalid.p-component>.p-inputtext{border-color:#f19ea6}.p-autocomplete-panel{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;box-shadow:none;color:hsla(0,0%,100%,.87)}.p-autocomplete-panel .p-autocomplete-items{padding:.5rem 0}.p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item{background:transparent;border:0;border-radius:0;color:hsla(0,0%,100%,.87);margin:0;padding:.5rem 1.5rem;transition:box-shadow .15s}.p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item.p-highlight{background:#8dd0ff;color:#151515}.p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item.p-highlight.p-focus{background:#64bfff}.p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item:not(.p-highlight):not(.p-disabled).p-focus{background:hsla(0,0%,100%,.12);color:hsla(0,0%,100%,.87)}.p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item:not(.p-highlight):not(.p-disabled):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item-group{background:#2a323d;color:hsla(0,0%,100%,.87);font-weight:600;margin:0;padding:.75rem 1rem}.p-calendar.p-invalid.p-component>.p-inputtext{border-color:#f19ea6}.p-datepicker{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;color:hsla(0,0%,100%,.87);padding:0}.p-datepicker:not(.p-datepicker-inline){background:#2a323d;border:1px solid #3f4b5b;box-shadow:none}.p-datepicker:not(.p-datepicker-inline) .p-datepicker-header{background:#2a323d}.p-datepicker .p-datepicker-header{background:#2a323d;border-bottom:1px solid #3f4b5b;border-top-left-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.87);font-weight:600;margin:0;padding:.5rem}.p-datepicker .p-datepicker-header .p-datepicker-next,.p-datepicker .p-datepicker-header .p-datepicker-prev{background:transparent;border:0;border-radius:50%;color:hsla(0,0%,100%,.6);height:2rem;transition:color .15s,box-shadow .15s;width:2rem}.p-datepicker .p-datepicker-header .p-datepicker-next:enabled:hover,.p-datepicker .p-datepicker-header .p-datepicker-prev:enabled:hover{background:transparent;border-color:transparent;color:hsla(0,0%,100%,.87)}.p-datepicker .p-datepicker-header .p-datepicker-next:focus,.p-datepicker .p-datepicker-header .p-datepicker-prev:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-datepicker .p-datepicker-header .p-datepicker-title{line-height:2rem}.p-datepicker .p-datepicker-header .p-datepicker-title .p-datepicker-month,.p-datepicker .p-datepicker-header .p-datepicker-title .p-datepicker-year{color:hsla(0,0%,100%,.87);font-weight:600;padding:.5rem;transition:color .15s,box-shadow .15s}.p-datepicker .p-datepicker-header .p-datepicker-title .p-datepicker-month:enabled:hover,.p-datepicker .p-datepicker-header .p-datepicker-title .p-datepicker-year:enabled:hover{color:#8dd0ff}.p-datepicker .p-datepicker-header .p-datepicker-title .p-datepicker-month{margin-right:.5rem}.p-datepicker table{font-size:1rem;margin:.5rem 0}.p-datepicker table th{padding:.5rem}.p-datepicker table th>span{height:2.5rem;width:2.5rem}.p-datepicker table td{padding:.5rem}.p-datepicker table td>span{border:1px solid transparent;border-radius:4px;height:2.5rem;transition:box-shadow .15s;width:2.5rem}.p-datepicker table td>span.p-highlight{background:#8dd0ff;color:#151515}.p-datepicker table td>span:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-datepicker table td.p-datepicker-today>span{background:transparent;border-color:transparent;color:#8dd0ff}.p-datepicker table td.p-datepicker-today>span.p-highlight{background:#8dd0ff;color:#151515}.p-datepicker .p-datepicker-buttonbar{border-top:1px solid #3f4b5b;padding:1rem 0}.p-datepicker .p-datepicker-buttonbar .p-button{width:auto}.p-datepicker .p-timepicker{border-top:1px solid #3f4b5b;padding:.5rem}.p-datepicker .p-timepicker button{background:transparent;border:0;border-radius:50%;color:hsla(0,0%,100%,.6);height:2rem;transition:color .15s,box-shadow .15s;width:2rem}.p-datepicker .p-timepicker button:enabled:hover{background:transparent;border-color:transparent;color:hsla(0,0%,100%,.87)}.p-datepicker .p-timepicker button:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-datepicker .p-timepicker button:last-child{margin-top:.2em}.p-datepicker .p-timepicker span{font-size:1.25rem}.p-datepicker .p-timepicker>div{padding:0 .5rem}.p-datepicker.p-datepicker-timeonly .p-timepicker{border-top:0}.p-datepicker .p-monthpicker{margin:.5rem 0}.p-datepicker .p-monthpicker .p-monthpicker-month{border-radius:4px;padding:.5rem;transition:box-shadow .15s}.p-datepicker .p-monthpicker .p-monthpicker-month.p-highlight{background:#8dd0ff;color:#151515}.p-datepicker .p-yearpicker{margin:.5rem 0}.p-datepicker .p-yearpicker .p-yearpicker-year{border-radius:4px;padding:.5rem;transition:box-shadow .15s}.p-datepicker .p-yearpicker .p-yearpicker-year.p-highlight{background:#8dd0ff;color:#151515}.p-datepicker.p-datepicker-multiple-month .p-datepicker-group{border-left:1px solid #3f4b5b;padding:0}.p-datepicker.p-datepicker-multiple-month .p-datepicker-group:first-child{border-left:0;padding-left:0}.p-datepicker.p-datepicker-multiple-month .p-datepicker-group:last-child{padding-right:0}.p-datepicker:not(.p-disabled) table td span:not(.p-highlight):not(.p-disabled):hover{background:hsla(0,0%,100%,.04)}.p-datepicker:not(.p-disabled) table td span:not(.p-highlight):not(.p-disabled):focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-datepicker:not(.p-disabled) .p-monthpicker .p-monthpicker-month:not(.p-disabled):not(.p-highlight):hover{background:hsla(0,0%,100%,.04)}.p-datepicker:not(.p-disabled) .p-monthpicker .p-monthpicker-month:not(.p-disabled):focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-datepicker:not(.p-disabled) .p-yearpicker .p-yearpicker-year:not(.p-disabled):not(.p-highlight):hover{background:hsla(0,0%,100%,.04)}.p-datepicker:not(.p-disabled) .p-yearpicker .p-yearpicker-year:not(.p-disabled):focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}@media screen and (max-width:769px){.p-datepicker table td,.p-datepicker table th{padding:0}}.p-cascadeselect{background:#20262e;border:1px solid #3f4b5b;border-radius:4px;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-cascadeselect:not(.p-disabled):hover{border-color:#3f4b5b}.p-cascadeselect:not(.p-disabled).p-focus{border-color:#8dd0ff;box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-cascadeselect .p-cascadeselect-label{background:transparent;border:0;padding:.5rem .75rem}.p-cascadeselect .p-cascadeselect-label.p-placeholder{color:hsla(0,0%,100%,.6)}.p-cascadeselect .p-cascadeselect-label:enabled:focus{box-shadow:none;outline:0 none}.p-cascadeselect .p-cascadeselect-trigger{background:transparent;border-bottom-right-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.6);width:2.357rem}.p-cascadeselect.p-invalid.p-component{border-color:#f19ea6}.p-cascadeselect-panel{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;box-shadow:none;color:hsla(0,0%,100%,.87)}.p-cascadeselect-panel .p-cascadeselect-items{padding:.5rem 0}.p-cascadeselect-panel .p-cascadeselect-items .p-cascadeselect-item{background:transparent;border:0;border-radius:0;color:hsla(0,0%,100%,.87);margin:0;transition:box-shadow .15s}.p-cascadeselect-panel .p-cascadeselect-items .p-cascadeselect-item.p-highlight{background:#8dd0ff;color:#151515}.p-cascadeselect-panel .p-cascadeselect-items .p-cascadeselect-item.p-highlight.p-focus{background:#64bfff}.p-cascadeselect-panel .p-cascadeselect-items .p-cascadeselect-item:not(.p-highlight):not(.p-disabled).p-focus{background:hsla(0,0%,100%,.12);color:hsla(0,0%,100%,.87)}.p-cascadeselect-panel .p-cascadeselect-items .p-cascadeselect-item:not(.p-highlight):not(.p-disabled):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-cascadeselect-panel .p-cascadeselect-items .p-cascadeselect-item .p-cascadeselect-item-content{padding:.5rem 1.5rem}.p-cascadeselect-panel .p-cascadeselect-items .p-cascadeselect-item .p-cascadeselect-group-icon{font-size:.875rem}.p-input-filled .p-cascadeselect{background:#3f4b5b}.p-input-filled .p-cascadeselect:not(.p-disabled).p-focus,.p-input-filled .p-cascadeselect:not(.p-disabled):hover{background-color:#3f4b5b}.p-checkbox{height:20px;width:20px}.p-checkbox .p-checkbox-box{background:#20262e;border:1px solid #3f4b5b;border-radius:4px;color:hsla(0,0%,100%,.87);height:20px;transition:background-color .15s,border-color .15s,box-shadow .15s;width:20px}.p-checkbox .p-checkbox-box .p-checkbox-icon{color:#151515;font-size:14px;transition-duration:.15s}.p-checkbox .p-checkbox-box .p-checkbox-icon.p-icon{height:14px;width:14px}.p-checkbox .p-checkbox-box.p-highlight{background:#8dd0ff;border-color:#8dd0ff}.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover{border-color:#3f4b5b}.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-focus{border-color:#8dd0ff;box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover{background:#1dadff;border-color:#1dadff;color:#151515}.p-checkbox.p-invalid>.p-checkbox-box{border-color:#f19ea6}.p-input-filled .p-checkbox .p-checkbox-box{background-color:#3f4b5b}.p-input-filled .p-checkbox .p-checkbox-box.p-highlight{background:#8dd0ff}.p-input-filled .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover{background-color:#3f4b5b}.p-input-filled .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover{background:#1dadff}.p-highlight .p-checkbox .p-checkbox-box{border-color:#151515}.p-chips:not(.p-disabled):hover .p-chips-multiple-container{border-color:#3f4b5b}.p-chips:not(.p-disabled).p-focus .p-chips-multiple-container{border-color:#8dd0ff;box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-chips .p-chips-multiple-container{padding:.25rem .75rem}.p-chips .p-chips-multiple-container .p-chips-token{background:#3f4b5b;border-radius:16px;color:hsla(0,0%,100%,.87);margin-right:.5rem;padding:.25rem .75rem}.p-chips .p-chips-multiple-container .p-chips-token.p-focus{background:#4c5866;color:hsla(0,0%,100%,.87)}.p-chips .p-chips-multiple-container .p-chips-token .p-chips-token-icon{margin-left:.5rem}.p-chips .p-chips-multiple-container .p-chips-input-token{padding:.25rem 0}.p-chips .p-chips-multiple-container .p-chips-input-token input{color:hsla(0,0%,100%,.87);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;font-size:1rem;margin:0;padding:0}.p-chips.p-invalid.p-component>.p-inputtext{border-color:#f19ea6}.p-colorpicker-preview{height:2rem;width:2rem}.p-colorpicker-panel{background:#2a323d;border:1px solid #3f4b5b}.p-colorpicker-panel .p-colorpicker-color-handle,.p-colorpicker-panel .p-colorpicker-hue-handle{border-color:hsla(0,0%,100%,.87)}.p-colorpicker-overlay-panel{box-shadow:none}.p-dropdown{background:#20262e;border:1px solid #3f4b5b;border-radius:4px;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-dropdown:not(.p-disabled):hover{border-color:#3f4b5b}.p-dropdown:not(.p-disabled).p-focus{border-color:#8dd0ff;box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-dropdown.p-dropdown-clearable .p-dropdown-label{padding-right:1.75rem}.p-dropdown .p-dropdown-label{background:transparent;border:0}.p-dropdown .p-dropdown-label.p-placeholder{color:hsla(0,0%,100%,.6)}.p-dropdown .p-dropdown-label:enabled:focus,.p-dropdown .p-dropdown-label:focus{box-shadow:none;outline:0 none}.p-dropdown .p-dropdown-trigger{background:transparent;border-bottom-right-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.6);width:2.357rem}.p-dropdown .p-dropdown-clear-icon{color:hsla(0,0%,100%,.6);right:2.357rem}.p-dropdown.p-invalid.p-component{border-color:#f19ea6}.p-dropdown-panel{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;box-shadow:none;color:hsla(0,0%,100%,.87)}.p-dropdown-panel .p-dropdown-header{background:#2a323d;border-bottom:1px solid #3f4b5b;border-top-left-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.87);margin:0;padding:.75rem 1.5rem}.p-dropdown-panel .p-dropdown-header .p-dropdown-filter{margin-right:-1.75rem;padding-right:1.75rem}.p-dropdown-panel .p-dropdown-header .p-dropdown-filter-icon{color:hsla(0,0%,100%,.6);right:.75rem}.p-dropdown-panel .p-dropdown-items{padding:.5rem 0}.p-dropdown-panel .p-dropdown-items .p-dropdown-item{background:transparent;border:0;border-radius:0;color:hsla(0,0%,100%,.87);margin:0;padding:.5rem 1.5rem;transition:box-shadow .15s}.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight{background:#8dd0ff;color:#151515}.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight.p-focus{background:#64bfff}.p-dropdown-panel .p-dropdown-items .p-dropdown-item:not(.p-highlight):not(.p-disabled).p-focus{background:hsla(0,0%,100%,.12);color:hsla(0,0%,100%,.87)}.p-dropdown-panel .p-dropdown-items .p-dropdown-item:not(.p-highlight):not(.p-disabled):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-dropdown-panel .p-dropdown-items .p-dropdown-item-group{background:#2a323d;color:hsla(0,0%,100%,.87);font-weight:600;margin:0;padding:.75rem 1rem}.p-dropdown-panel .p-dropdown-items .p-dropdown-empty-message{background:transparent;color:hsla(0,0%,100%,.87);padding:.5rem 1.5rem}.p-input-filled .p-dropdown{background:#3f4b5b}.p-input-filled .p-dropdown:not(.p-disabled).p-focus,.p-input-filled .p-dropdown:not(.p-disabled):hover{background-color:#3f4b5b}.p-input-filled .p-dropdown:not(.p-disabled).p-focus .p-inputtext{background-color:transparent}.p-editor-container .p-editor-toolbar{background:#2a323d;border-top-left-radius:4px;border-top-right-radius:4px}.p-editor-container .p-editor-toolbar.ql-snow{border:1px solid #3f4b5b}.p-editor-container .p-editor-toolbar.ql-snow .ql-stroke{stroke:hsla(0,0%,100%,.6)}.p-editor-container .p-editor-toolbar.ql-snow .ql-fill{fill:hsla(0,0%,100%,.6)}.p-editor-container .p-editor-toolbar.ql-snow .ql-picker .ql-picker-label{border:0;color:hsla(0,0%,100%,.6)}.p-editor-container .p-editor-toolbar.ql-snow .ql-picker .ql-picker-label:hover{color:hsla(0,0%,100%,.87)}.p-editor-container .p-editor-toolbar.ql-snow .ql-picker .ql-picker-label:hover .ql-stroke{stroke:hsla(0,0%,100%,.87)}.p-editor-container .p-editor-toolbar.ql-snow .ql-picker .ql-picker-label:hover .ql-fill{fill:hsla(0,0%,100%,.87)}.p-editor-container .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label{color:hsla(0,0%,100%,.87)}.p-editor-container .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke{stroke:hsla(0,0%,100%,.87)}.p-editor-container .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-fill{fill:hsla(0,0%,100%,.87)}.p-editor-container .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;box-shadow:none;padding:.5rem 0}.p-editor-container .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options .ql-picker-item{color:hsla(0,0%,100%,.87)}.p-editor-container .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options .ql-picker-item:hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-editor-container .p-editor-toolbar.ql-snow .ql-picker.ql-expanded:not(.ql-icon-picker) .ql-picker-item{padding:.5rem 1.5rem}.p-editor-container .p-editor-content{border-bottom-left-radius:4px;border-bottom-right-radius:4px}.p-editor-container .p-editor-content.ql-snow{border:1px solid #3f4b5b}.p-editor-container .p-editor-content .ql-editor{background:#20262e;border-bottom-left-radius:4px;border-bottom-right-radius:4px;color:hsla(0,0%,100%,.87)}.p-editor-container .ql-snow.ql-toolbar button:focus,.p-editor-container .ql-snow.ql-toolbar button:hover{color:hsla(0,0%,100%,.87)}.p-editor-container .ql-snow.ql-toolbar button:focus .ql-stroke,.p-editor-container .ql-snow.ql-toolbar button:hover .ql-stroke{stroke:hsla(0,0%,100%,.87)}.p-editor-container .ql-snow.ql-toolbar button:focus .ql-fill,.p-editor-container .ql-snow.ql-toolbar button:hover .ql-fill{fill:hsla(0,0%,100%,.87)}.p-editor-container .ql-snow.ql-toolbar .ql-picker-item.ql-selected,.p-editor-container .ql-snow.ql-toolbar .ql-picker-label.ql-active,.p-editor-container .ql-snow.ql-toolbar button.ql-active{color:#8dd0ff}.p-editor-container .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,.p-editor-container .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,.p-editor-container .ql-snow.ql-toolbar button.ql-active .ql-stroke{stroke:#8dd0ff}.p-editor-container .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,.p-editor-container .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,.p-editor-container .ql-snow.ql-toolbar button.ql-active .ql-fill{fill:#8dd0ff}.p-editor-container .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-picker-label,.p-editor-container .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-picker-label,.p-editor-container .ql-snow.ql-toolbar button.ql-active .ql-picker-label{color:#8dd0ff}.p-inputgroup-addon{background:#2a323d;border-bottom:1px solid #3f4b5b;border-left:1px solid #3f4b5b;border-top:1px solid #3f4b5b;color:hsla(0,0%,100%,.6);min-width:2.357rem;padding:.5rem .75rem}.p-inputgroup-addon:last-child{border-right:1px solid #3f4b5b}.p-inputgroup>.p-component,.p-inputgroup>.p-float-label>.p-component,.p-inputgroup>.p-inputwrapper>.p-inputtext{border-radius:0;margin:0}.p-inputgroup>.p-component+.p-inputgroup-addon,.p-inputgroup>.p-float-label>.p-component+.p-inputgroup-addon,.p-inputgroup>.p-inputwrapper>.p-inputtext+.p-inputgroup-addon{border-left:0}.p-inputgroup>.p-component:focus,.p-inputgroup>.p-component:focus~label,.p-inputgroup>.p-float-label>.p-component:focus,.p-inputgroup>.p-float-label>.p-component:focus~label,.p-inputgroup>.p-inputwrapper>.p-inputtext:focus,.p-inputgroup>.p-inputwrapper>.p-inputtext:focus~label{z-index:1}.p-inputgroup .p-float-label:first-child input,.p-inputgroup button:first-child,.p-inputgroup input:first-child,.p-inputgroup-addon:first-child,.p-inputgroup>.p-inputwrapper:first-child,.p-inputgroup>.p-inputwrapper:first-child>.p-inputtext{border-bottom-left-radius:4px;border-top-left-radius:4px}.p-inputgroup .p-float-label:last-child input,.p-inputgroup button:last-child,.p-inputgroup input:last-child,.p-inputgroup-addon:last-child,.p-inputgroup>.p-inputwrapper:last-child,.p-inputgroup>.p-inputwrapper:last-child>.p-inputtext{border-bottom-right-radius:4px;border-top-right-radius:4px}.p-fluid .p-inputgroup .p-button{width:auto}.p-fluid .p-inputgroup .p-button.p-button-icon-only{width:2.357rem}.p-inputnumber.p-invalid.p-component>.p-inputtext{border-color:#f19ea6}.p-inputswitch{height:1.75rem;width:3rem}.p-inputswitch .p-inputswitch-slider{background:#3f4b5b;border-radius:4px;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-inputswitch .p-inputswitch-slider:before{background:hsla(0,0%,100%,.6);border-radius:4px;height:1.25rem;left:.25rem;margin-top:-.625rem;transition-duration:.15s;width:1.25rem}.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider:before{transform:translateX(1.25rem)}.p-inputswitch.p-focus .p-inputswitch-slider{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-inputswitch:not(.p-disabled):hover .p-inputswitch-slider{background:#3f4b5b}.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider{background:#8dd0ff}.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider:before{background:#151515}.p-inputswitch.p-inputswitch-checked:not(.p-disabled):hover .p-inputswitch-slider{background:#8dd0ff}.p-inputswitch.p-invalid .p-inputswitch-slider{border-color:#f19ea6}.p-inputtext{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:#20262e;border:1px solid #3f4b5b;border-radius:4px;color:hsla(0,0%,100%,.87);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;font-size:1rem;padding:.5rem .75rem;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-inputtext:enabled:hover{border-color:#3f4b5b}.p-inputtext:enabled:focus{border-color:#8dd0ff;box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-inputtext.p-invalid.p-component{border-color:#f19ea6}.p-inputtext.p-inputtext-sm{font-size:.875rem;padding:.4375rem .65625rem}.p-inputtext.p-inputtext-lg{font-size:1.25rem;padding:.625rem .9375rem}.p-float-label>label{color:hsla(0,0%,100%,.6);left:.75rem;transition-duration:.15s}.p-float-label>.p-invalid+label{color:#f19ea6}.p-input-icon-left>i:first-of-type,.p-input-icon-left>svg:first-of-type{color:hsla(0,0%,100%,.6);left:.75rem}.p-input-icon-left>.p-inputtext{padding-left:2.5rem}.p-input-icon-left.p-float-label>label{left:2.5rem}.p-input-icon-right>i:last-of-type,.p-input-icon-right>svg:last-of-type{color:hsla(0,0%,100%,.6);right:.75rem}.p-input-icon-right>.p-inputtext{padding-right:2.5rem}::-webkit-input-placeholder{color:hsla(0,0%,100%,.6)}:-moz-placeholder,::-moz-placeholder{color:hsla(0,0%,100%,.6)}:-ms-input-placeholder{color:hsla(0,0%,100%,.6)}.p-input-filled .p-inputtext,.p-input-filled .p-inputtext:enabled:focus,.p-input-filled .p-inputtext:enabled:hover{background-color:#3f4b5b}.p-inputtext-sm .p-inputtext{font-size:.875rem;padding:.4375rem .65625rem}.p-inputtext-lg .p-inputtext{font-size:1.25rem;padding:.625rem .9375rem}.p-listbox{border:1px solid #3f4b5b;border-radius:4px;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-listbox,.p-listbox .p-listbox-header{background:#2a323d;color:hsla(0,0%,100%,.87)}.p-listbox .p-listbox-header{border-bottom:1px solid #3f4b5b;border-top-left-radius:4px;border-top-right-radius:4px;margin:0;padding:.75rem 1.5rem}.p-listbox .p-listbox-header .p-listbox-filter{padding-right:1.75rem}.p-listbox .p-listbox-header .p-listbox-filter-icon{color:hsla(0,0%,100%,.6);right:.75rem}.p-listbox .p-listbox-list{outline:0 none;padding:.5rem 0}.p-listbox .p-listbox-list .p-listbox-item{border:0;border-radius:0;color:hsla(0,0%,100%,.87);margin:0;padding:.5rem 1.5rem;transition:box-shadow .15s}.p-listbox .p-listbox-list .p-listbox-item.p-highlight{background:#8dd0ff;color:#151515}.p-listbox .p-listbox-list .p-listbox-item-group{background:#2a323d;color:hsla(0,0%,100%,.87);font-weight:600;margin:0;padding:.75rem 1rem}.p-listbox .p-listbox-list .p-listbox-empty-message{background:transparent;color:hsla(0,0%,100%,.87);padding:.5rem 1.5rem}.p-listbox:not(.p-disabled) .p-listbox-item.p-highlight.p-focus{background:#64bfff}.p-listbox:not(.p-disabled) .p-listbox-item:not(.p-highlight):not(.p-disabled).p-focus{background:hsla(0,0%,100%,.12);color:hsla(0,0%,100%,.87)}.p-listbox:not(.p-disabled) .p-listbox-item:not(.p-highlight):not(.p-disabled):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-listbox.p-focus{border-color:#8dd0ff;box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-listbox.p-invalid{border-color:#f19ea6}.p-multiselect{background:#20262e;border:1px solid #3f4b5b;border-radius:4px;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-multiselect:not(.p-disabled):hover{border-color:#3f4b5b}.p-multiselect:not(.p-disabled).p-focus{border-color:#8dd0ff;box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-multiselect .p-multiselect-label{padding:.5rem .75rem;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-multiselect .p-multiselect-label.p-placeholder{color:hsla(0,0%,100%,.6)}.p-multiselect.p-multiselect-chip .p-multiselect-token{background:#3f4b5b;border-radius:16px;color:hsla(0,0%,100%,.87);margin-right:.5rem;padding:.25rem .75rem}.p-multiselect.p-multiselect-chip .p-multiselect-token .p-multiselect-token-icon{margin-left:.5rem}.p-multiselect .p-multiselect-trigger{background:transparent;border-bottom-right-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.6);width:2.357rem}.p-multiselect.p-invalid.p-component{border-color:#f19ea6}.p-inputwrapper-filled.p-multiselect.p-multiselect-chip .p-multiselect-label{padding:.25rem .75rem}.p-multiselect-panel{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;box-shadow:none;color:hsla(0,0%,100%,.87)}.p-multiselect-panel .p-multiselect-header{background:#2a323d;border-bottom:1px solid #3f4b5b;border-top-left-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.87);margin:0;padding:.75rem 1.5rem}.p-multiselect-panel .p-multiselect-header .p-multiselect-filter-container .p-inputtext{padding-right:1.75rem}.p-multiselect-panel .p-multiselect-header .p-multiselect-filter-container .p-multiselect-filter-icon{color:hsla(0,0%,100%,.6);right:.75rem}.p-multiselect-panel .p-multiselect-header .p-checkbox{margin-right:.5rem}.p-multiselect-panel .p-multiselect-header .p-multiselect-close{background:transparent;border:0;border-radius:50%;color:hsla(0,0%,100%,.6);height:2rem;margin-left:.5rem;transition:color .15s,box-shadow .15s;width:2rem}.p-multiselect-panel .p-multiselect-header .p-multiselect-close:enabled:hover{background:transparent;border-color:transparent;color:hsla(0,0%,100%,.87)}.p-multiselect-panel .p-multiselect-header .p-multiselect-close:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-multiselect-panel .p-multiselect-items{padding:.5rem 0}.p-multiselect-panel .p-multiselect-items .p-multiselect-item{background:transparent;border:0;border-radius:0;color:hsla(0,0%,100%,.87);margin:0;padding:.5rem 1.5rem;transition:box-shadow .15s}.p-multiselect-panel .p-multiselect-items .p-multiselect-item.p-highlight{background:#8dd0ff;color:#151515}.p-multiselect-panel .p-multiselect-items .p-multiselect-item.p-highlight.p-focus{background:#64bfff}.p-multiselect-panel .p-multiselect-items .p-multiselect-item:not(.p-highlight):not(.p-disabled).p-focus{background:hsla(0,0%,100%,.12);color:hsla(0,0%,100%,.87)}.p-multiselect-panel .p-multiselect-items .p-multiselect-item:not(.p-highlight):not(.p-disabled):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-multiselect-panel .p-multiselect-items .p-multiselect-item .p-checkbox{margin-right:.5rem}.p-multiselect-panel .p-multiselect-items .p-multiselect-item-group{background:#2a323d;color:hsla(0,0%,100%,.87);font-weight:600;margin:0;padding:.75rem 1rem}.p-multiselect-panel .p-multiselect-items .p-multiselect-empty-message{background:transparent;color:hsla(0,0%,100%,.87);padding:.5rem 1.5rem}.p-input-filled .p-multiselect{background:#3f4b5b}.p-input-filled .p-multiselect:not(.p-disabled).p-focus,.p-input-filled .p-multiselect:not(.p-disabled):hover{background-color:#3f4b5b}.p-password.p-invalid.p-component>.p-inputtext{border-color:#f19ea6}.p-password-panel{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;box-shadow:none;color:hsla(0,0%,100%,.87);padding:1.25rem}.p-password-panel .p-password-meter{background:#3f4b5b;margin-bottom:.5rem}.p-password-panel .p-password-meter .p-password-strength.weak{background:#f19ea6}.p-password-panel .p-password-meter .p-password-strength.medium{background:#ffe082}.p-password-panel .p-password-meter .p-password-strength.strong{background:#9fdaa8}.p-radiobutton{height:20px;width:20px}.p-radiobutton .p-radiobutton-box{background:#20262e;border:1px solid #3f4b5b;border-radius:50%;color:hsla(0,0%,100%,.87);height:20px;transition:background-color .15s,border-color .15s,box-shadow .15s;width:20px}.p-radiobutton .p-radiobutton-box:not(.p-disabled):not(.p-highlight):hover{border-color:#3f4b5b}.p-radiobutton .p-radiobutton-box:not(.p-disabled).p-focus{border-color:#8dd0ff;box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-radiobutton .p-radiobutton-box .p-radiobutton-icon{background-color:#151515;height:12px;transition-duration:.15s;width:12px}.p-radiobutton .p-radiobutton-box.p-highlight{background:#8dd0ff;border-color:#8dd0ff}.p-radiobutton .p-radiobutton-box.p-highlight:not(.p-disabled):hover{background:#1dadff;border-color:#1dadff;color:#151515}.p-radiobutton.p-invalid>.p-radiobutton-box{border-color:#f19ea6}.p-radiobutton:focus{outline:0 none}.p-input-filled .p-radiobutton .p-radiobutton-box,.p-input-filled .p-radiobutton .p-radiobutton-box:not(.p-disabled):hover{background-color:#3f4b5b}.p-input-filled .p-radiobutton .p-radiobutton-box.p-highlight{background:#8dd0ff}.p-input-filled .p-radiobutton .p-radiobutton-box.p-highlight:not(.p-disabled):hover{background:#1dadff}.p-highlight .p-radiobutton .p-radiobutton-box{border-color:#151515}.p-rating{gap:.5rem}.p-rating .p-rating-item .p-rating-icon{color:hsla(0,0%,100%,.87);font-size:1.143rem;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-rating .p-rating-item .p-rating-icon.p-icon{height:1.143rem;width:1.143rem}.p-rating .p-rating-item .p-rating-icon.p-rating-cancel{color:#f19ea6}.p-rating .p-rating-item.p-focus{border-color:#8dd0ff;box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-rating .p-rating-item.p-rating-item-active .p-rating-icon,.p-rating:not(.p-disabled):not(.p-readonly) .p-rating-item:hover .p-rating-icon{color:#8dd0ff}.p-rating:not(.p-disabled):not(.p-readonly) .p-rating-item:hover .p-rating-icon.p-rating-cancel{color:#f19ea6}.p-highlight .p-rating .p-rating-item.p-rating-item-active .p-rating-icon{color:#151515}.p-selectbutton .p-button{background:#6c757d;border:1px solid #6c757d;color:#fff;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-selectbutton .p-button .p-button-icon-left,.p-selectbutton .p-button .p-button-icon-right{color:#fff}.p-selectbutton .p-button:not(.p-disabled):not(.p-highlight):hover{background:#5a6268;border-color:#545b62;color:#fff}.p-selectbutton .p-button:not(.p-disabled):not(.p-highlight):hover .p-button-icon-left,.p-selectbutton .p-button:not(.p-disabled):not(.p-highlight):hover .p-button-icon-right{color:#fff}.p-selectbutton .p-button.p-highlight{background:#545b62;border-color:#4e555b;color:#fff}.p-selectbutton .p-button.p-highlight .p-button-icon-left,.p-selectbutton .p-button.p-highlight .p-button-icon-right{color:#fff}.p-selectbutton .p-button.p-highlight:hover{background:#545b62;border-color:#4e555b;color:#fff}.p-selectbutton .p-button.p-highlight:hover .p-button-icon-left,.p-selectbutton .p-button.p-highlight:hover .p-button-icon-right{color:#fff}.p-selectbutton.p-invalid>.p-button{border-color:#f19ea6}.p-slider{background:#3f4b5b;border:0;border-radius:4px}.p-slider.p-slider-horizontal{height:.286rem}.p-slider.p-slider-horizontal .p-slider-handle{margin-left:-.5715rem;margin-top:-.5715rem}.p-slider.p-slider-vertical{width:.286rem}.p-slider.p-slider-vertical .p-slider-handle{margin-bottom:-.5715rem;margin-left:-.5715rem}.p-slider .p-slider-handle{background:#8dd0ff;border:2px solid #8dd0ff;border-radius:4px;height:1.143rem;transition:background-color .15s,border-color .15s,box-shadow .15s;width:1.143rem}.p-slider .p-slider-handle:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-slider .p-slider-range{background:#8dd0ff}.p-slider:not(.p-disabled) .p-slider-handle:hover{background:#56bdff;border-color:#56bdff}.p-treeselect{background:#20262e;border:1px solid #3f4b5b;border-radius:4px;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-treeselect:not(.p-disabled):hover{border-color:#3f4b5b}.p-treeselect:not(.p-disabled).p-focus{border-color:#8dd0ff;box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-treeselect .p-treeselect-label{padding:.5rem .75rem;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-treeselect .p-treeselect-label.p-placeholder{color:hsla(0,0%,100%,.6)}.p-treeselect.p-treeselect-chip .p-treeselect-token{background:#3f4b5b;border-radius:16px;color:hsla(0,0%,100%,.87);margin-right:.5rem;padding:.25rem .75rem}.p-treeselect .p-treeselect-trigger{background:transparent;border-bottom-right-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.6);width:2.357rem}.p-treeselect.p-invalid.p-component{border-color:#f19ea6}.p-inputwrapper-filled.p-treeselect.p-treeselect-chip .p-treeselect-label{padding:.25rem .75rem}.p-treeselect-panel{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;box-shadow:none;color:hsla(0,0%,100%,.87)}.p-treeselect-panel .p-treeselect-items-wrapper .p-tree{border:0}.p-treeselect-panel .p-treeselect-items-wrapper .p-treeselect-empty-message{background:transparent;color:hsla(0,0%,100%,.87);padding:.5rem 1.5rem}.p-input-filled .p-treeselect{background:#3f4b5b}.p-input-filled .p-treeselect:not(.p-disabled).p-focus,.p-input-filled .p-treeselect:not(.p-disabled):hover{background-color:#3f4b5b}.p-togglebutton.p-button{background:#6c757d;border:1px solid #6c757d;color:#fff;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-togglebutton.p-button .p-button-icon-left,.p-togglebutton.p-button .p-button-icon-right{color:#fff}.p-togglebutton.p-button:not(.p-disabled).p-focus{border-color:#8dd0ff;box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-togglebutton.p-button:not(.p-disabled):not(.p-highlight):hover{background:#5a6268;border-color:#545b62;color:#fff}.p-togglebutton.p-button:not(.p-disabled):not(.p-highlight):hover .p-button-icon-left,.p-togglebutton.p-button:not(.p-disabled):not(.p-highlight):hover .p-button-icon-right{color:#fff}.p-togglebutton.p-button.p-highlight{background:#545b62;border-color:#4e555b;color:#fff}.p-togglebutton.p-button.p-highlight .p-button-icon-left,.p-togglebutton.p-button.p-highlight .p-button-icon-right{color:#fff}.p-togglebutton.p-button.p-highlight:hover{background:#545b62;border-color:#4e555b;color:#fff}.p-togglebutton.p-button.p-highlight:hover .p-button-icon-left,.p-togglebutton.p-button.p-highlight:hover .p-button-icon-right{color:#fff}.p-togglebutton.p-button.p-invalid>.p-button{border-color:#f19ea6}.p-button{background:#8dd0ff;border:1px solid #8dd0ff;border-radius:4px;color:#151515;font-size:1rem;padding:.5rem .75rem;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-button:enabled:hover{background:#56bdff;border-color:#56bdff;color:#151515}.p-button:enabled:active{background:#1dadff;border-color:#1dadff;color:#151515}.p-button.p-button-outlined{background-color:transparent;border:1px solid;color:#8dd0ff}.p-button.p-button-outlined:enabled:hover{background:rgba(141,208,255,.04);border:1px solid;color:#8dd0ff}.p-button.p-button-outlined:enabled:active{background:rgba(141,208,255,.16);border:1px solid;color:#8dd0ff}.p-button.p-button-outlined.p-button-plain{border-color:hsla(0,0%,100%,.6);color:hsla(0,0%,100%,.6)}.p-button.p-button-outlined.p-button-plain:enabled:hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.6)}.p-button.p-button-outlined.p-button-plain:enabled:active{background:hsla(0,0%,100%,.16);color:hsla(0,0%,100%,.6)}.p-button.p-button-text{background-color:transparent;border-color:transparent;color:#8dd0ff}.p-button.p-button-text:enabled:hover{background:rgba(141,208,255,.04);border-color:transparent;color:#8dd0ff}.p-button.p-button-text:enabled:active{background:rgba(141,208,255,.16);border-color:transparent;color:#8dd0ff}.p-button.p-button-text.p-button-plain{color:hsla(0,0%,100%,.6)}.p-button.p-button-text.p-button-plain:enabled:hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.6)}.p-button.p-button-text.p-button-plain:enabled:active{background:hsla(0,0%,100%,.16);color:hsla(0,0%,100%,.6)}.p-button:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-button .p-button-label{transition-duration:.15s}.p-button .p-button-icon-left{margin-right:.5rem}.p-button .p-button-icon-right{margin-left:.5rem}.p-button .p-button-icon-bottom{margin-top:.5rem}.p-button .p-button-icon-top{margin-bottom:.5rem}.p-button .p-badge{background-color:#151515;color:#8dd0ff;height:1rem;line-height:1rem;margin-left:.5rem;min-width:1rem}.p-button.p-button-raised{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.p-button.p-button-rounded{border-radius:2rem}.p-button.p-button-icon-only{padding:.5rem 0;width:2.357rem}.p-button.p-button-icon-only .p-button-icon-left,.p-button.p-button-icon-only .p-button-icon-right{margin:0}.p-button.p-button-icon-only.p-button-rounded{border-radius:50%;height:2.357rem}.p-button.p-button-sm{font-size:.875rem;padding:.4375rem .65625rem}.p-button.p-button-sm .p-button-icon{font-size:.875rem}.p-button.p-button-lg{font-size:1.25rem;padding:.625rem .9375rem}.p-button.p-button-lg .p-button-icon{font-size:1.25rem}.p-button.p-button-loading-label-only .p-button-label{margin-left:.5rem}.p-button.p-button-loading-label-only .p-button-loading-icon{margin-right:0}.p-fluid .p-button{width:100%}.p-fluid .p-button-icon-only{width:2.357rem}.p-fluid .p-buttonset{display:flex}.p-fluid .p-buttonset .p-button{flex:1}.p-button.p-button-secondary,.p-buttonset.p-button-secondary>.p-button,.p-splitbutton.p-button-secondary>.p-button{background:#6c757d;border:1px solid #6c757d;color:#fff}.p-button.p-button-secondary:enabled:hover,.p-buttonset.p-button-secondary>.p-button:enabled:hover,.p-splitbutton.p-button-secondary>.p-button:enabled:hover{background:#5a6268;border-color:#5a6268;color:#fff}.p-button.p-button-secondary:enabled:focus,.p-buttonset.p-button-secondary>.p-button:enabled:focus,.p-splitbutton.p-button-secondary>.p-button:enabled:focus{box-shadow:0 0 0 1px hsla(208,6%,54%,.5)}.p-button.p-button-secondary:enabled:active,.p-buttonset.p-button-secondary>.p-button:enabled:active,.p-splitbutton.p-button-secondary>.p-button:enabled:active{background:#545b62;border-color:#4e555b;color:#fff}.p-button.p-button-secondary.p-button-outlined,.p-buttonset.p-button-secondary>.p-button.p-button-outlined,.p-splitbutton.p-button-secondary>.p-button.p-button-outlined{background-color:transparent;border:1px solid;color:#6c757d}.p-button.p-button-secondary.p-button-outlined:enabled:hover,.p-buttonset.p-button-secondary>.p-button.p-button-outlined:enabled:hover,.p-splitbutton.p-button-secondary>.p-button.p-button-outlined:enabled:hover{background:hsla(208,7%,46%,.04);border:1px solid;color:#6c757d}.p-button.p-button-secondary.p-button-outlined:enabled:active,.p-buttonset.p-button-secondary>.p-button.p-button-outlined:enabled:active,.p-splitbutton.p-button-secondary>.p-button.p-button-outlined:enabled:active{background:hsla(208,7%,46%,.16);border:1px solid;color:#6c757d}.p-button.p-button-secondary.p-button-text,.p-buttonset.p-button-secondary>.p-button.p-button-text,.p-splitbutton.p-button-secondary>.p-button.p-button-text{background-color:transparent;border-color:transparent;color:#6c757d}.p-button.p-button-secondary.p-button-text:enabled:hover,.p-buttonset.p-button-secondary>.p-button.p-button-text:enabled:hover,.p-splitbutton.p-button-secondary>.p-button.p-button-text:enabled:hover{background:hsla(208,7%,46%,.04);border-color:transparent;color:#6c757d}.p-button.p-button-secondary.p-button-text:enabled:active,.p-buttonset.p-button-secondary>.p-button.p-button-text:enabled:active,.p-splitbutton.p-button-secondary>.p-button.p-button-text:enabled:active{background:hsla(208,7%,46%,.16);border-color:transparent;color:#6c757d}.p-button.p-button-info,.p-buttonset.p-button-info>.p-button,.p-splitbutton.p-button-info>.p-button{background:#7fd8e6;border:1px solid #4cc8db;color:#151515}.p-button.p-button-info:enabled:hover,.p-buttonset.p-button-info>.p-button:enabled:hover,.p-splitbutton.p-button-info>.p-button:enabled:hover{background:#4cc8db;border-color:#26bdd3;color:#151515}.p-button.p-button-info:enabled:focus,.p-buttonset.p-button-info>.p-button:enabled:focus,.p-splitbutton.p-button-info>.p-button:enabled:focus{box-shadow:0 0 0 1px #b1e8f0}.p-button.p-button-info:enabled:active,.p-buttonset.p-button-info>.p-button:enabled:active,.p-splitbutton.p-button-info>.p-button:enabled:active{background:#26bdd3;border-color:#00b2cc;color:#151515}.p-button.p-button-info.p-button-outlined,.p-buttonset.p-button-info>.p-button.p-button-outlined,.p-splitbutton.p-button-info>.p-button.p-button-outlined{background-color:transparent;border:1px solid;color:#7fd8e6}.p-button.p-button-info.p-button-outlined:enabled:hover,.p-buttonset.p-button-info>.p-button.p-button-outlined:enabled:hover,.p-splitbutton.p-button-info>.p-button.p-button-outlined:enabled:hover{background:rgba(127,216,230,.04);border:1px solid;color:#7fd8e6}.p-button.p-button-info.p-button-outlined:enabled:active,.p-buttonset.p-button-info>.p-button.p-button-outlined:enabled:active,.p-splitbutton.p-button-info>.p-button.p-button-outlined:enabled:active{background:rgba(127,216,230,.16);border:1px solid;color:#7fd8e6}.p-button.p-button-info.p-button-text,.p-buttonset.p-button-info>.p-button.p-button-text,.p-splitbutton.p-button-info>.p-button.p-button-text{background-color:transparent;border-color:transparent;color:#7fd8e6}.p-button.p-button-info.p-button-text:enabled:hover,.p-buttonset.p-button-info>.p-button.p-button-text:enabled:hover,.p-splitbutton.p-button-info>.p-button.p-button-text:enabled:hover{background:rgba(127,216,230,.04);border-color:transparent;color:#7fd8e6}.p-button.p-button-info.p-button-text:enabled:active,.p-buttonset.p-button-info>.p-button.p-button-text:enabled:active,.p-splitbutton.p-button-info>.p-button.p-button-text:enabled:active{background:rgba(127,216,230,.16);border-color:transparent;color:#7fd8e6}.p-button.p-button-success,.p-buttonset.p-button-success>.p-button,.p-splitbutton.p-button-success>.p-button{background:#9fdaa8;border:1px solid #78cc86;color:#151515}.p-button.p-button-success:enabled:hover,.p-buttonset.p-button-success>.p-button:enabled:hover,.p-splitbutton.p-button-success>.p-button:enabled:hover{background:#78cc86;border-color:#5ac06c;color:#151515}.p-button.p-button-success:enabled:focus,.p-buttonset.p-button-success>.p-button:enabled:focus,.p-splitbutton.p-button-success>.p-button:enabled:focus{box-shadow:0 0 0 1px #c5e8ca}.p-button.p-button-success:enabled:active,.p-buttonset.p-button-success>.p-button:enabled:active,.p-splitbutton.p-button-success>.p-button:enabled:active{background:#5ac06c;border-color:#3cb553;color:#151515}.p-button.p-button-success.p-button-outlined,.p-buttonset.p-button-success>.p-button.p-button-outlined,.p-splitbutton.p-button-success>.p-button.p-button-outlined{background-color:transparent;border:1px solid;color:#9fdaa8}.p-button.p-button-success.p-button-outlined:enabled:hover,.p-buttonset.p-button-success>.p-button.p-button-outlined:enabled:hover,.p-splitbutton.p-button-success>.p-button.p-button-outlined:enabled:hover{background:rgba(159,218,168,.04);border:1px solid;color:#9fdaa8}.p-button.p-button-success.p-button-outlined:enabled:active,.p-buttonset.p-button-success>.p-button.p-button-outlined:enabled:active,.p-splitbutton.p-button-success>.p-button.p-button-outlined:enabled:active{background:rgba(159,218,168,.16);border:1px solid;color:#9fdaa8}.p-button.p-button-success.p-button-text,.p-buttonset.p-button-success>.p-button.p-button-text,.p-splitbutton.p-button-success>.p-button.p-button-text{background-color:transparent;border-color:transparent;color:#9fdaa8}.p-button.p-button-success.p-button-text:enabled:hover,.p-buttonset.p-button-success>.p-button.p-button-text:enabled:hover,.p-splitbutton.p-button-success>.p-button.p-button-text:enabled:hover{background:rgba(159,218,168,.04);border-color:transparent;color:#9fdaa8}.p-button.p-button-success.p-button-text:enabled:active,.p-buttonset.p-button-success>.p-button.p-button-text:enabled:active,.p-splitbutton.p-button-success>.p-button.p-button-text:enabled:active{background:rgba(159,218,168,.16);border-color:transparent;color:#9fdaa8}.p-button.p-button-warning,.p-buttonset.p-button-warning>.p-button,.p-splitbutton.p-button-warning>.p-button{background:#ffe082;border:1px solid #ffd54f;color:#151515}.p-button.p-button-warning:enabled:hover,.p-buttonset.p-button-warning>.p-button:enabled:hover,.p-splitbutton.p-button-warning>.p-button:enabled:hover{background:#ffd54f;border-color:#ffca28;color:#151515}.p-button.p-button-warning:enabled:focus,.p-buttonset.p-button-warning>.p-button:enabled:focus,.p-splitbutton.p-button-warning>.p-button:enabled:focus{box-shadow:0 0 0 1px #ffecb3}.p-button.p-button-warning:enabled:active,.p-buttonset.p-button-warning>.p-button:enabled:active,.p-splitbutton.p-button-warning>.p-button:enabled:active{background:#ffca28;border-color:#ffc107;color:#151515}.p-button.p-button-warning.p-button-outlined,.p-buttonset.p-button-warning>.p-button.p-button-outlined,.p-splitbutton.p-button-warning>.p-button.p-button-outlined{background-color:transparent;border:1px solid;color:#ffe082}.p-button.p-button-warning.p-button-outlined:enabled:hover,.p-buttonset.p-button-warning>.p-button.p-button-outlined:enabled:hover,.p-splitbutton.p-button-warning>.p-button.p-button-outlined:enabled:hover{background:rgba(255,224,130,.04);border:1px solid;color:#ffe082}.p-button.p-button-warning.p-button-outlined:enabled:active,.p-buttonset.p-button-warning>.p-button.p-button-outlined:enabled:active,.p-splitbutton.p-button-warning>.p-button.p-button-outlined:enabled:active{background:rgba(255,224,130,.16);border:1px solid;color:#ffe082}.p-button.p-button-warning.p-button-text,.p-buttonset.p-button-warning>.p-button.p-button-text,.p-splitbutton.p-button-warning>.p-button.p-button-text{background-color:transparent;border-color:transparent;color:#ffe082}.p-button.p-button-warning.p-button-text:enabled:hover,.p-buttonset.p-button-warning>.p-button.p-button-text:enabled:hover,.p-splitbutton.p-button-warning>.p-button.p-button-text:enabled:hover{background:rgba(255,224,130,.04);border-color:transparent;color:#ffe082}.p-button.p-button-warning.p-button-text:enabled:active,.p-buttonset.p-button-warning>.p-button.p-button-text:enabled:active,.p-splitbutton.p-button-warning>.p-button.p-button-text:enabled:active{background:rgba(255,224,130,.16);border-color:transparent;color:#ffe082}.p-button.p-button-help,.p-buttonset.p-button-help>.p-button,.p-splitbutton.p-button-help>.p-button{background:#b7a2e0;border:1px solid #9a7cd4;color:#151515}.p-button.p-button-help:enabled:hover,.p-buttonset.p-button-help>.p-button:enabled:hover,.p-splitbutton.p-button-help>.p-button:enabled:hover{background:#9a7cd4;border-color:#845fca;color:#151515}.p-button.p-button-help:enabled:focus,.p-buttonset.p-button-help>.p-button:enabled:focus,.p-splitbutton.p-button-help>.p-button:enabled:focus{box-shadow:0 0 0 1px #d3c7ec}.p-button.p-button-help:enabled:active,.p-buttonset.p-button-help>.p-button:enabled:active,.p-splitbutton.p-button-help>.p-button:enabled:active{background:#845fca;border-color:#6d43c0;color:#151515}.p-button.p-button-help.p-button-outlined,.p-buttonset.p-button-help>.p-button.p-button-outlined,.p-splitbutton.p-button-help>.p-button.p-button-outlined{background-color:transparent;border:1px solid;color:#b7a2e0}.p-button.p-button-help.p-button-outlined:enabled:hover,.p-buttonset.p-button-help>.p-button.p-button-outlined:enabled:hover,.p-splitbutton.p-button-help>.p-button.p-button-outlined:enabled:hover{background:rgba(183,162,224,.04);border:1px solid;color:#b7a2e0}.p-button.p-button-help.p-button-outlined:enabled:active,.p-buttonset.p-button-help>.p-button.p-button-outlined:enabled:active,.p-splitbutton.p-button-help>.p-button.p-button-outlined:enabled:active{background:rgba(183,162,224,.16);border:1px solid;color:#b7a2e0}.p-button.p-button-help.p-button-text,.p-buttonset.p-button-help>.p-button.p-button-text,.p-splitbutton.p-button-help>.p-button.p-button-text{background-color:transparent;border-color:transparent;color:#b7a2e0}.p-button.p-button-help.p-button-text:enabled:hover,.p-buttonset.p-button-help>.p-button.p-button-text:enabled:hover,.p-splitbutton.p-button-help>.p-button.p-button-text:enabled:hover{background:rgba(183,162,224,.04);border-color:transparent;color:#b7a2e0}.p-button.p-button-help.p-button-text:enabled:active,.p-buttonset.p-button-help>.p-button.p-button-text:enabled:active,.p-splitbutton.p-button-help>.p-button.p-button-text:enabled:active{background:rgba(183,162,224,.16);border-color:transparent;color:#b7a2e0}.p-button.p-button-danger,.p-buttonset.p-button-danger>.p-button,.p-splitbutton.p-button-danger>.p-button{background:#f19ea6;border:1px solid #e97984;color:#151515}.p-button.p-button-danger:enabled:hover,.p-buttonset.p-button-danger>.p-button:enabled:hover,.p-splitbutton.p-button-danger>.p-button:enabled:hover{background:#e97984;border-color:#f75965;color:#151515}.p-button.p-button-danger:enabled:focus,.p-buttonset.p-button-danger>.p-button:enabled:focus,.p-splitbutton.p-button-danger>.p-button:enabled:focus{box-shadow:0 0 0 1px #ffd0d9}.p-button.p-button-danger:enabled:active,.p-buttonset.p-button-danger>.p-button:enabled:active,.p-splitbutton.p-button-danger>.p-button:enabled:active{background:#f75965;border-color:#fd464e;color:#151515}.p-button.p-button-danger.p-button-outlined,.p-buttonset.p-button-danger>.p-button.p-button-outlined,.p-splitbutton.p-button-danger>.p-button.p-button-outlined{background-color:transparent;border:1px solid;color:#f19ea6}.p-button.p-button-danger.p-button-outlined:enabled:hover,.p-buttonset.p-button-danger>.p-button.p-button-outlined:enabled:hover,.p-splitbutton.p-button-danger>.p-button.p-button-outlined:enabled:hover{background:rgba(241,158,166,.04);border:1px solid;color:#f19ea6}.p-button.p-button-danger.p-button-outlined:enabled:active,.p-buttonset.p-button-danger>.p-button.p-button-outlined:enabled:active,.p-splitbutton.p-button-danger>.p-button.p-button-outlined:enabled:active{background:rgba(241,158,166,.16);border:1px solid;color:#f19ea6}.p-button.p-button-danger.p-button-text,.p-buttonset.p-button-danger>.p-button.p-button-text,.p-splitbutton.p-button-danger>.p-button.p-button-text{background-color:transparent;border-color:transparent;color:#f19ea6}.p-button.p-button-danger.p-button-text:enabled:hover,.p-buttonset.p-button-danger>.p-button.p-button-text:enabled:hover,.p-splitbutton.p-button-danger>.p-button.p-button-text:enabled:hover{background:rgba(241,158,166,.04);border-color:transparent;color:#f19ea6}.p-button.p-button-danger.p-button-text:enabled:active,.p-buttonset.p-button-danger>.p-button.p-button-text:enabled:active,.p-splitbutton.p-button-danger>.p-button.p-button-text:enabled:active{background:rgba(241,158,166,.16);border-color:transparent;color:#f19ea6}.p-button.p-button-link{background:transparent;border:transparent;color:#8dd0ff}.p-button.p-button-link:enabled:hover{background:transparent;border-color:transparent;color:#56bdff}.p-button.p-button-link:enabled:hover .p-button-label{text-decoration:underline}.p-button.p-button-link:enabled:focus{background:transparent;border-color:transparent;box-shadow:0 0 0 1px #e3f3fe}.p-button.p-button-link:enabled:active{background:transparent;border-color:transparent;color:#8dd0ff}.p-speeddial-button.p-button.p-button-icon-only{height:4rem;width:4rem}.p-speeddial-button.p-button.p-button-icon-only .p-button-icon{font-size:1.3rem}.p-speeddial-button.p-button.p-button-icon-only .p-icon{height:1.3rem;width:1.3rem}.p-speeddial-list{outline:0 none}.p-speeddial-item.p-focus>.p-speeddial-action{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-speeddial-action{background:#343e4d;color:#fff;height:3rem;width:3rem}.p-speeddial-action:hover{background:#3f4b5b;color:#fff}.p-speeddial-direction-up .p-speeddial-item{margin:.25rem 0}.p-speeddial-direction-up .p-speeddial-item:first-child{margin-bottom:.5rem}.p-speeddial-direction-down .p-speeddial-item{margin:.25rem 0}.p-speeddial-direction-down .p-speeddial-item:first-child{margin-top:.5rem}.p-speeddial-direction-left .p-speeddial-item{margin:0 .25rem}.p-speeddial-direction-left .p-speeddial-item:first-child{margin-right:.5rem}.p-speeddial-direction-right .p-speeddial-item{margin:0 .25rem}.p-speeddial-direction-right .p-speeddial-item:first-child{margin-left:.5rem}.p-speeddial-circle .p-speeddial-item,.p-speeddial-circle .p-speeddial-item:first-child,.p-speeddial-circle .p-speeddial-item:last-child,.p-speeddial-quarter-circle .p-speeddial-item,.p-speeddial-quarter-circle .p-speeddial-item:first-child,.p-speeddial-quarter-circle .p-speeddial-item:last-child,.p-speeddial-semi-circle .p-speeddial-item,.p-speeddial-semi-circle .p-speeddial-item:first-child,.p-speeddial-semi-circle .p-speeddial-item:last-child{margin:0}.p-speeddial-mask{background-color:rgba(0,0,0,.4)}.p-splitbutton{border-radius:4px}.p-splitbutton.p-button-outlined>.p-button{background-color:transparent;border:1px solid;color:#8dd0ff}.p-splitbutton.p-button-outlined>.p-button:enabled:hover,.p-splitbutton.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):hover{background:rgba(141,208,255,.04);color:#8dd0ff}.p-splitbutton.p-button-outlined>.p-button:enabled:active,.p-splitbutton.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):active{background:rgba(141,208,255,.16);color:#8dd0ff}.p-splitbutton.p-button-outlined.p-button-plain>.p-button{border-color:hsla(0,0%,100%,.6);color:hsla(0,0%,100%,.6)}.p-splitbutton.p-button-outlined.p-button-plain>.p-button:enabled:hover,.p-splitbutton.p-button-outlined.p-button-plain>.p-button:not(button):not(a):not(.p-disabled):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.6)}.p-splitbutton.p-button-outlined.p-button-plain>.p-button:enabled:active,.p-splitbutton.p-button-outlined.p-button-plain>.p-button:not(button):not(a):not(.p-disabled):active{background:hsla(0,0%,100%,.16);color:hsla(0,0%,100%,.6)}.p-splitbutton.p-button-text>.p-button{background-color:transparent;border-color:transparent;color:#8dd0ff}.p-splitbutton.p-button-text>.p-button:enabled:hover,.p-splitbutton.p-button-text>.p-button:not(button):not(a):not(.p-disabled):hover{background:rgba(141,208,255,.04);border-color:transparent;color:#8dd0ff}.p-splitbutton.p-button-text>.p-button:enabled:active,.p-splitbutton.p-button-text>.p-button:not(button):not(a):not(.p-disabled):active{background:rgba(141,208,255,.16);border-color:transparent;color:#8dd0ff}.p-splitbutton.p-button-text.p-button-plain>.p-button{color:hsla(0,0%,100%,.6)}.p-splitbutton.p-button-text.p-button-plain>.p-button:enabled:hover,.p-splitbutton.p-button-text.p-button-plain>.p-button:not(button):not(a):not(.p-disabled):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.6)}.p-splitbutton.p-button-text.p-button-plain>.p-button:enabled:active,.p-splitbutton.p-button-text.p-button-plain>.p-button:not(button):not(a):not(.p-disabled):active{background:hsla(0,0%,100%,.16);color:hsla(0,0%,100%,.6)}.p-splitbutton.p-button-raised{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.p-splitbutton.p-button-rounded,.p-splitbutton.p-button-rounded>.p-button{border-radius:2rem}.p-splitbutton.p-button-sm>.p-button{font-size:.875rem;padding:.4375rem .65625rem}.p-splitbutton.p-button-sm>.p-button .p-button-icon{font-size:.875rem}.p-splitbutton.p-button-lg>.p-button{font-size:1.25rem;padding:.625rem .9375rem}.p-splitbutton.p-button-lg>.p-button .p-button-icon{font-size:1.25rem}.p-splitbutton.p-button-secondary.p-button-outlined>.p-button{background-color:transparent;border:1px solid;color:#6c757d}.p-splitbutton.p-button-secondary.p-button-outlined>.p-button:enabled:hover,.p-splitbutton.p-button-secondary.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):hover{background:hsla(208,7%,46%,.04);color:#6c757d}.p-splitbutton.p-button-secondary.p-button-outlined>.p-button:enabled:active,.p-splitbutton.p-button-secondary.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):active{background:hsla(208,7%,46%,.16);color:#6c757d}.p-splitbutton.p-button-secondary.p-button-text>.p-button{background-color:transparent;border-color:transparent;color:#6c757d}.p-splitbutton.p-button-secondary.p-button-text>.p-button:enabled:hover,.p-splitbutton.p-button-secondary.p-button-text>.p-button:not(button):not(a):not(.p-disabled):hover{background:hsla(208,7%,46%,.04);border-color:transparent;color:#6c757d}.p-splitbutton.p-button-secondary.p-button-text>.p-button:enabled:active,.p-splitbutton.p-button-secondary.p-button-text>.p-button:not(button):not(a):not(.p-disabled):active{background:hsla(208,7%,46%,.16);border-color:transparent;color:#6c757d}.p-splitbutton.p-button-info.p-button-outlined>.p-button{background-color:transparent;border:1px solid;color:#7fd8e6}.p-splitbutton.p-button-info.p-button-outlined>.p-button:enabled:hover,.p-splitbutton.p-button-info.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):hover{background:rgba(127,216,230,.04);color:#7fd8e6}.p-splitbutton.p-button-info.p-button-outlined>.p-button:enabled:active,.p-splitbutton.p-button-info.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):active{background:rgba(127,216,230,.16);color:#7fd8e6}.p-splitbutton.p-button-info.p-button-text>.p-button{background-color:transparent;border-color:transparent;color:#7fd8e6}.p-splitbutton.p-button-info.p-button-text>.p-button:enabled:hover,.p-splitbutton.p-button-info.p-button-text>.p-button:not(button):not(a):not(.p-disabled):hover{background:rgba(127,216,230,.04);border-color:transparent;color:#7fd8e6}.p-splitbutton.p-button-info.p-button-text>.p-button:enabled:active,.p-splitbutton.p-button-info.p-button-text>.p-button:not(button):not(a):not(.p-disabled):active{background:rgba(127,216,230,.16);border-color:transparent;color:#7fd8e6}.p-splitbutton.p-button-success.p-button-outlined>.p-button{background-color:transparent;border:1px solid;color:#9fdaa8}.p-splitbutton.p-button-success.p-button-outlined>.p-button:enabled:hover,.p-splitbutton.p-button-success.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):hover{background:rgba(159,218,168,.04);color:#9fdaa8}.p-splitbutton.p-button-success.p-button-outlined>.p-button:enabled:active,.p-splitbutton.p-button-success.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):active{background:rgba(159,218,168,.16);color:#9fdaa8}.p-splitbutton.p-button-success.p-button-text>.p-button{background-color:transparent;border-color:transparent;color:#9fdaa8}.p-splitbutton.p-button-success.p-button-text>.p-button:enabled:hover,.p-splitbutton.p-button-success.p-button-text>.p-button:not(button):not(a):not(.p-disabled):hover{background:rgba(159,218,168,.04);border-color:transparent;color:#9fdaa8}.p-splitbutton.p-button-success.p-button-text>.p-button:enabled:active,.p-splitbutton.p-button-success.p-button-text>.p-button:not(button):not(a):not(.p-disabled):active{background:rgba(159,218,168,.16);border-color:transparent;color:#9fdaa8}.p-splitbutton.p-button-warning.p-button-outlined>.p-button{background-color:transparent;border:1px solid;color:#ffe082}.p-splitbutton.p-button-warning.p-button-outlined>.p-button:enabled:hover,.p-splitbutton.p-button-warning.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):hover{background:rgba(255,224,130,.04);color:#ffe082}.p-splitbutton.p-button-warning.p-button-outlined>.p-button:enabled:active,.p-splitbutton.p-button-warning.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):active{background:rgba(255,224,130,.16);color:#ffe082}.p-splitbutton.p-button-warning.p-button-text>.p-button{background-color:transparent;border-color:transparent;color:#ffe082}.p-splitbutton.p-button-warning.p-button-text>.p-button:enabled:hover,.p-splitbutton.p-button-warning.p-button-text>.p-button:not(button):not(a):not(.p-disabled):hover{background:rgba(255,224,130,.04);border-color:transparent;color:#ffe082}.p-splitbutton.p-button-warning.p-button-text>.p-button:enabled:active,.p-splitbutton.p-button-warning.p-button-text>.p-button:not(button):not(a):not(.p-disabled):active{background:rgba(255,224,130,.16);border-color:transparent;color:#ffe082}.p-splitbutton.p-button-help.p-button-outlined>.p-button{background-color:transparent;border:1px solid;color:#b7a2e0}.p-splitbutton.p-button-help.p-button-outlined>.p-button:enabled:hover,.p-splitbutton.p-button-help.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):hover{background:rgba(183,162,224,.04);color:#b7a2e0}.p-splitbutton.p-button-help.p-button-outlined>.p-button:enabled:active,.p-splitbutton.p-button-help.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):active{background:rgba(183,162,224,.16);color:#b7a2e0}.p-splitbutton.p-button-help.p-button-text>.p-button{background-color:transparent;border-color:transparent;color:#b7a2e0}.p-splitbutton.p-button-help.p-button-text>.p-button:enabled:hover,.p-splitbutton.p-button-help.p-button-text>.p-button:not(button):not(a):not(.p-disabled):hover{background:rgba(183,162,224,.04);border-color:transparent;color:#b7a2e0}.p-splitbutton.p-button-help.p-button-text>.p-button:enabled:active,.p-splitbutton.p-button-help.p-button-text>.p-button:not(button):not(a):not(.p-disabled):active{background:rgba(183,162,224,.16);border-color:transparent;color:#b7a2e0}.p-splitbutton.p-button-danger.p-button-outlined>.p-button{background-color:transparent;border:1px solid;color:#f19ea6}.p-splitbutton.p-button-danger.p-button-outlined>.p-button:enabled:hover,.p-splitbutton.p-button-danger.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):hover{background:rgba(241,158,166,.04);color:#f19ea6}.p-splitbutton.p-button-danger.p-button-outlined>.p-button:enabled:active,.p-splitbutton.p-button-danger.p-button-outlined>.p-button:not(button):not(a):not(.p-disabled):active{background:rgba(241,158,166,.16);color:#f19ea6}.p-splitbutton.p-button-danger.p-button-text>.p-button{background-color:transparent;border-color:transparent;color:#f19ea6}.p-splitbutton.p-button-danger.p-button-text>.p-button:enabled:hover,.p-splitbutton.p-button-danger.p-button-text>.p-button:not(button):not(a):not(.p-disabled):hover{background:rgba(241,158,166,.04);border-color:transparent;color:#f19ea6}.p-splitbutton.p-button-danger.p-button-text>.p-button:enabled:active,.p-splitbutton.p-button-danger.p-button-text>.p-button:not(button):not(a):not(.p-disabled):active{background:rgba(241,158,166,.16);border-color:transparent;color:#f19ea6}.p-carousel .p-carousel-content .p-carousel-next,.p-carousel .p-carousel-content .p-carousel-prev{background:transparent;border:0;border-radius:50%;color:hsla(0,0%,100%,.6);height:2rem;margin:.5rem;transition:color .15s,box-shadow .15s;width:2rem}.p-carousel .p-carousel-content .p-carousel-next:enabled:hover,.p-carousel .p-carousel-content .p-carousel-prev:enabled:hover{background:transparent;border-color:transparent;color:hsla(0,0%,100%,.87)}.p-carousel .p-carousel-content .p-carousel-next:focus,.p-carousel .p-carousel-content .p-carousel-prev:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-carousel .p-carousel-indicators{padding:1rem}.p-carousel .p-carousel-indicators .p-carousel-indicator{margin-bottom:.5rem;margin-right:.5rem}.p-carousel .p-carousel-indicators .p-carousel-indicator button{background-color:#3f4b5b;border-radius:0;height:.5rem;transition:color .15s,box-shadow .15s;width:2rem}.p-carousel .p-carousel-indicators .p-carousel-indicator button:hover{background:hsla(0,0%,100%,.04)}.p-carousel .p-carousel-indicators .p-carousel-indicator.p-highlight button{background:#8dd0ff;color:#151515}.p-datatable .p-paginator-top{border-radius:0;border-width:0}.p-datatable .p-paginator-bottom{border-radius:0;border-width:1px 0 0}.p-datatable .p-datatable-header{background:#2a323d;border:solid #3f4b5b;border-width:1px 0 0;color:hsla(0,0%,100%,.6);font-weight:600;padding:1rem}.p-datatable .p-datatable-footer{background:#2a323d;border:1px solid #3f4b5b;border-width:1px 0;color:hsla(0,0%,100%,.87);font-weight:600;padding:1rem}.p-datatable .p-datatable-thead>tr>th{border:1px solid #3f4b5b;border-width:1px 0 2px;transition:box-shadow .15s}.p-datatable .p-datatable-tfoot>tr>td,.p-datatable .p-datatable-thead>tr>th{background:#2a323d;color:hsla(0,0%,100%,.87);font-weight:600;padding:1rem;text-align:left}.p-datatable .p-datatable-tfoot>tr>td{border:1px solid #3f4b5b;border-width:1px 0}.p-datatable .p-sortable-column .p-sortable-column-icon{color:hsla(0,0%,100%,.6);margin-left:.5rem}.p-datatable .p-sortable-column .p-sortable-column-badge{background:#8dd0ff;border-radius:50%;color:#151515;height:1.143rem;line-height:1.143rem;margin-left:.5rem;min-width:1.143rem}.p-datatable .p-sortable-column:not(.p-highlight):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-datatable .p-sortable-column:not(.p-highlight):hover .p-sortable-column-icon{color:hsla(0,0%,100%,.87)}.p-datatable .p-sortable-column.p-highlight{background:#2a323d;color:#8dd0ff}.p-datatable .p-sortable-column.p-highlight .p-sortable-column-icon{color:#8dd0ff}.p-datatable .p-sortable-column.p-highlight:hover{background:hsla(0,0%,100%,.04);color:#8dd0ff}.p-datatable .p-sortable-column.p-highlight:hover .p-sortable-column-icon{color:#8dd0ff}.p-datatable .p-sortable-column:focus{box-shadow:inset 0 0 0 .15rem #e3f3fe;outline:0 none}.p-datatable .p-datatable-tbody>tr{background:#2a323d;color:hsla(0,0%,100%,.87);transition:box-shadow .15s}.p-datatable .p-datatable-tbody>tr>td{border:solid #3f4b5b;border-width:1px 0 0;padding:1rem;text-align:left}.p-datatable .p-datatable-tbody>tr>td .p-row-editor-cancel,.p-datatable .p-datatable-tbody>tr>td .p-row-editor-init,.p-datatable .p-datatable-tbody>tr>td .p-row-editor-save,.p-datatable .p-datatable-tbody>tr>td .p-row-toggler{background:transparent;border:0;border-radius:50%;color:hsla(0,0%,100%,.6);height:2rem;transition:color .15s,box-shadow .15s;width:2rem}.p-datatable .p-datatable-tbody>tr>td .p-row-editor-cancel:enabled:hover,.p-datatable .p-datatable-tbody>tr>td .p-row-editor-init:enabled:hover,.p-datatable .p-datatable-tbody>tr>td .p-row-editor-save:enabled:hover,.p-datatable .p-datatable-tbody>tr>td .p-row-toggler:enabled:hover{background:transparent;border-color:transparent;color:hsla(0,0%,100%,.87)}.p-datatable .p-datatable-tbody>tr>td .p-row-editor-cancel:focus,.p-datatable .p-datatable-tbody>tr>td .p-row-editor-init:focus,.p-datatable .p-datatable-tbody>tr>td .p-row-editor-save:focus,.p-datatable .p-datatable-tbody>tr>td .p-row-toggler:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-datatable .p-datatable-tbody>tr>td .p-row-editor-save{margin-right:.5rem}.p-datatable .p-datatable-tbody>tr>td>.p-column-title{font-weight:600}.p-datatable .p-datatable-tbody>tr:focus{outline:.15rem solid #e3f3fe;outline-offset:-.15rem}.p-datatable .p-datatable-tbody>tr.p-highlight{background:#8dd0ff;color:#151515}.p-datatable .p-datatable-tbody>tr.p-datatable-dragpoint-top>td{box-shadow:inset 0 2px 0 0 #8dd0ff}.p-datatable .p-datatable-tbody>tr.p-datatable-dragpoint-bottom>td{box-shadow:inset 0 -2px 0 0 #8dd0ff}.p-datatable.p-datatable-hoverable-rows .p-datatable-tbody>tr:not(.p-highlight):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-datatable .p-column-resizer-helper{background:#8dd0ff}.p-datatable .p-datatable-scrollable-footer,.p-datatable .p-datatable-scrollable-header{background:#2a323d}.p-datatable.p-datatable-scrollable>.p-datatable-wrapper>.p-datatable-table>.p-datatable-tfoot,.p-datatable.p-datatable-scrollable>.p-datatable-wrapper>.p-datatable-table>.p-datatable-thead,.p-datatable.p-datatable-scrollable>.p-datatable-wrapper>.p-virtualscroller>.p-datatable-table>.p-datatable-tfoot,.p-datatable.p-datatable-scrollable>.p-datatable-wrapper>.p-virtualscroller>.p-datatable-table>.p-datatable-thead{background-color:#2a323d}.p-datatable .p-datatable-loading-icon{font-size:2rem}.p-datatable .p-datatable-loading-icon.p-icon{height:2rem;width:2rem}.p-datatable.p-datatable-gridlines .p-datatable-header{border-width:1px 1px 0}.p-datatable.p-datatable-gridlines .p-datatable-footer{border-width:0 1px 1px}.p-datatable.p-datatable-gridlines .p-paginator-top{border-width:0 1px}.p-datatable.p-datatable-gridlines .p-paginator-bottom{border-width:0 1px 1px}.p-datatable.p-datatable-gridlines .p-datatable-thead>tr>th{border-width:1px 0 1px 1px}.p-datatable.p-datatable-gridlines .p-datatable-thead>tr>th:last-child{border-width:1px}.p-datatable.p-datatable-gridlines .p-datatable-tbody>tr>td{border-width:1px 0 0 1px}.p-datatable.p-datatable-gridlines .p-datatable-tbody>tr>td:last-child{border-width:1px 1px 0}.p-datatable.p-datatable-gridlines .p-datatable-tbody>tr:last-child>td{border-width:1px 0 1px 1px}.p-datatable.p-datatable-gridlines .p-datatable-tbody>tr:last-child>td:last-child{border-width:1px}.p-datatable.p-datatable-gridlines .p-datatable-tfoot>tr>td{border-width:1px 0 1px 1px}.p-datatable.p-datatable-gridlines .p-datatable-tfoot>tr>td:last-child{border-width:1px}.p-datatable.p-datatable-gridlines .p-datatable-thead+.p-datatable-tfoot>tr>td{border-width:0 0 1px 1px}.p-datatable.p-datatable-gridlines .p-datatable-thead+.p-datatable-tfoot>tr>td:last-child{border-width:0 1px 1px}.p-datatable.p-datatable-gridlines:has(.p-datatable-thead):has(.p-datatable-tbody) .p-datatable-tbody>tr>td{border-width:0 0 1px 1px}.p-datatable.p-datatable-gridlines:has(.p-datatable-thead):has(.p-datatable-tbody) .p-datatable-tbody>tr>td:last-child{border-width:0 1px 1px}.p-datatable.p-datatable-gridlines:has(.p-datatable-tbody):has(.p-datatable-tfoot) .p-datatable-tbody>tr:last-child>td{border-width:0 0 0 1px}.p-datatable.p-datatable-gridlines:has(.p-datatable-tbody):has(.p-datatable-tfoot) .p-datatable-tbody>tr:last-child>td:last-child{border-width:0 1px}.p-datatable.p-datatable-striped .p-datatable-tbody>tr:nth-child(2n){background:#2f3641}.p-datatable.p-datatable-striped .p-datatable-tbody>tr:nth-child(2n).p-highlight{background:#8dd0ff;color:#151515}.p-datatable.p-datatable-striped .p-datatable-tbody>tr:nth-child(2n).p-highlight .p-row-toggler,.p-datatable.p-datatable-striped .p-datatable-tbody>tr:nth-child(2n).p-highlight .p-row-toggler:hover{color:#151515}.p-datatable.p-datatable-sm .p-datatable-footer,.p-datatable.p-datatable-sm .p-datatable-header,.p-datatable.p-datatable-sm .p-datatable-tbody>tr>td,.p-datatable.p-datatable-sm .p-datatable-tfoot>tr>td,.p-datatable.p-datatable-sm .p-datatable-thead>tr>th{padding:.5rem}.p-datatable.p-datatable-lg .p-datatable-footer,.p-datatable.p-datatable-lg .p-datatable-header,.p-datatable.p-datatable-lg .p-datatable-tbody>tr>td,.p-datatable.p-datatable-lg .p-datatable-tfoot>tr>td,.p-datatable.p-datatable-lg .p-datatable-thead>tr>th{padding:1.25rem}.p-dataview .p-paginator-top{border-radius:0;border-width:0}.p-dataview .p-paginator-bottom{border-radius:0;border-width:1px 0 0}.p-dataview .p-dataview-header{background:#2a323d;border:solid #3f4b5b;border-width:1px 0 0;color:hsla(0,0%,100%,.6);font-weight:600;padding:1rem}.p-dataview .p-dataview-content{background:#2a323d;border:0;color:hsla(0,0%,100%,.87);padding:0}.p-dataview.p-dataview-list .p-dataview-content>.p-grid>div{border:solid #3f4b5b;border-width:1px 0 0}.p-dataview .p-dataview-footer{background:#2a323d;border:1px solid #3f4b5b;border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-width:1px 0;color:hsla(0,0%,100%,.87);font-weight:600;padding:1rem}.p-column-filter-row .p-column-filter-clear-button,.p-column-filter-row .p-column-filter-menu-button{margin-left:.5rem}.p-column-filter-menu-button{background:transparent;border:0;border-radius:50%;color:hsla(0,0%,100%,.6);height:2rem;transition:color .15s,box-shadow .15s;width:2rem}.p-column-filter-menu-button:hover{border-color:transparent}.p-column-filter-menu-button.p-column-filter-menu-button-open,.p-column-filter-menu-button.p-column-filter-menu-button-open:hover,.p-column-filter-menu-button:hover{background:transparent;color:hsla(0,0%,100%,.87)}.p-column-filter-menu-button.p-column-filter-menu-button-active,.p-column-filter-menu-button.p-column-filter-menu-button-active:hover{background:#8dd0ff;color:#151515}.p-column-filter-menu-button:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-column-filter-clear-button{background:transparent;border:0;border-radius:50%;color:hsla(0,0%,100%,.6);height:2rem;transition:color .15s,box-shadow .15s;width:2rem}.p-column-filter-clear-button:hover{background:transparent;border-color:transparent;color:hsla(0,0%,100%,.87)}.p-column-filter-clear-button:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-column-filter-overlay{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;box-shadow:none;color:hsla(0,0%,100%,.87);min-width:12.5rem}.p-column-filter-overlay .p-column-filter-row-items{padding:.5rem 0}.p-column-filter-overlay .p-column-filter-row-items .p-column-filter-row-item{background:transparent;border:0;border-radius:0;color:hsla(0,0%,100%,.87);margin:0;padding:.5rem 1.5rem;transition:box-shadow .15s}.p-column-filter-overlay .p-column-filter-row-items .p-column-filter-row-item.p-highlight{background:#8dd0ff;color:#151515}.p-column-filter-overlay .p-column-filter-row-items .p-column-filter-row-item:not(.p-highlight):not(.p-disabled):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-column-filter-overlay .p-column-filter-row-items .p-column-filter-row-item:focus{box-shadow:inset 0 0 0 .15rem #e3f3fe;outline:0 none;outline-offset:0}.p-column-filter-overlay .p-column-filter-row-items .p-column-filter-separator{border-top:1px solid #3f4b5b;margin:.5rem 0}.p-column-filter-overlay-menu .p-column-filter-operator{background:#2a323d;border-bottom:1px solid #3f4b5b;border-top-left-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.87);margin:0;padding:.75rem 1.5rem}.p-column-filter-overlay-menu .p-column-filter-constraint{border-bottom:1px solid #3f4b5b;padding:1.25rem}.p-column-filter-overlay-menu .p-column-filter-constraint .p-column-filter-matchmode-dropdown{margin-bottom:.5rem}.p-column-filter-overlay-menu .p-column-filter-constraint .p-column-filter-remove-button{margin-top:.5rem}.p-column-filter-overlay-menu .p-column-filter-constraint:last-child{border-bottom:0}.p-column-filter-overlay-menu .p-column-filter-add-rule{padding:.5rem 1.25rem}.p-column-filter-overlay-menu .p-column-filter-buttonbar{padding:1.25rem}.fc.fc-unthemed .fc-view-container th{background:#2a323d}.fc.fc-unthemed .fc-view-container td.fc-widget-content,.fc.fc-unthemed .fc-view-container th{border:1px solid #3f4b5b;color:hsla(0,0%,100%,.87)}.fc.fc-unthemed .fc-view-container td.fc-head-container{border:1px solid #3f4b5b}.fc.fc-unthemed .fc-view-container .fc-view{background:#2a323d}.fc.fc-unthemed .fc-view-container .fc-row{border-right:1px solid #3f4b5b}.fc.fc-unthemed .fc-view-container .fc-event{background:#56bdff;border:1px solid #56bdff;color:#151515}.fc.fc-unthemed .fc-view-container .fc-divider{background:#2a323d;border:1px solid #3f4b5b}.fc.fc-unthemed .fc-toolbar .fc-button{align-items:center;background:#8dd0ff;border:1px solid #8dd0ff;border-radius:4px;color:#151515;display:flex;font-size:1rem;transition:background-color .15s,border-color .15s,box-shadow .15s}.fc.fc-unthemed .fc-toolbar .fc-button:enabled:hover{background:#56bdff;border-color:#56bdff;color:#151515}.fc.fc-unthemed .fc-toolbar .fc-button:enabled:active{background:#1dadff;border-color:#1dadff;color:#151515}.fc.fc-unthemed .fc-toolbar .fc-button:enabled:active:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.fc.fc-unthemed .fc-toolbar .fc-button .fc-icon-chevron-left{font-family:PrimeIcons!important;font-size:1rem;text-indent:0}.fc.fc-unthemed .fc-toolbar .fc-button .fc-icon-chevron-left:before{content:"\\e900"}.fc.fc-unthemed .fc-toolbar .fc-button .fc-icon-chevron-right{font-family:PrimeIcons!important;font-size:1rem;text-indent:0}.fc.fc-unthemed .fc-toolbar .fc-button .fc-icon-chevron-right:before{content:"\\e901"}.fc.fc-unthemed .fc-toolbar .fc-button:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.fc.fc-unthemed .fc-toolbar .fc-button.fc-dayGridMonth-button,.fc.fc-unthemed .fc-toolbar .fc-button.fc-timeGridDay-button,.fc.fc-unthemed .fc-toolbar .fc-button.fc-timeGridWeek-button{background:#6c757d;border:1px solid #6c757d;color:#fff;transition:background-color .15s,border-color .15s,box-shadow .15s}.fc.fc-unthemed .fc-toolbar .fc-button.fc-dayGridMonth-button:hover,.fc.fc-unthemed .fc-toolbar .fc-button.fc-timeGridDay-button:hover,.fc.fc-unthemed .fc-toolbar .fc-button.fc-timeGridWeek-button:hover{background:#5a6268;border-color:#545b62;color:#fff}.fc.fc-unthemed .fc-toolbar .fc-button.fc-dayGridMonth-button.fc-button-active,.fc.fc-unthemed .fc-toolbar .fc-button.fc-dayGridMonth-button.fc-button-active:hover,.fc.fc-unthemed .fc-toolbar .fc-button.fc-timeGridDay-button.fc-button-active,.fc.fc-unthemed .fc-toolbar .fc-button.fc-timeGridDay-button.fc-button-active:hover,.fc.fc-unthemed .fc-toolbar .fc-button.fc-timeGridWeek-button.fc-button-active,.fc.fc-unthemed .fc-toolbar .fc-button.fc-timeGridWeek-button.fc-button-active:hover{background:#545b62;border-color:#4e555b;color:#fff}.fc.fc-unthemed .fc-toolbar .fc-button.fc-dayGridMonth-button:focus,.fc.fc-unthemed .fc-toolbar .fc-button.fc-timeGridDay-button:focus,.fc.fc-unthemed .fc-toolbar .fc-button.fc-timeGridWeek-button:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0;z-index:1}.fc.fc-unthemed .fc-toolbar .fc-button-group .fc-button{border-radius:0}.fc.fc-unthemed .fc-toolbar .fc-button-group .fc-button:first-child{border-bottom-left-radius:4px;border-top-left-radius:4px}.fc.fc-unthemed .fc-toolbar .fc-button-group .fc-button:last-child{border-bottom-right-radius:4px;border-top-right-radius:4px}.fc.fc-theme-standard .fc-view-harness .fc-scrollgrid{border-color:#3f4b5b}.fc.fc-theme-standard .fc-view-harness th{background:#2a323d}.fc.fc-theme-standard .fc-view-harness td,.fc.fc-theme-standard .fc-view-harness th{border-color:#3f4b5b;color:hsla(0,0%,100%,.87)}.fc.fc-theme-standard .fc-view-harness .fc-view{background:#2a323d}.fc.fc-theme-standard .fc-view-harness .fc-popover{background:none;border:0}.fc.fc-theme-standard .fc-view-harness .fc-popover .fc-popover-header{background:#2a323d;border:1px solid #3f4b5b;color:hsla(0,0%,100%,.87);padding:1rem 1.25rem}.fc.fc-theme-standard .fc-view-harness .fc-popover .fc-popover-header .fc-popover-close{align-items:center;background:transparent;border:0;border-radius:50%;color:hsla(0,0%,100%,.6);display:flex;font-family:PrimeIcons!important;font-size:1rem;height:2rem;justify-content:center;opacity:1;overflow:hidden;transition:color .15s,box-shadow .15s;width:2rem}.fc.fc-theme-standard .fc-view-harness .fc-popover .fc-popover-header .fc-popover-close:before{content:"\\e90b"}.fc.fc-theme-standard .fc-view-harness .fc-popover .fc-popover-header .fc-popover-close:hover{background:transparent;border-color:transparent;color:hsla(0,0%,100%,.87)}.fc.fc-theme-standard .fc-view-harness .fc-popover .fc-popover-header .fc-popover-close:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.fc.fc-theme-standard .fc-view-harness .fc-popover .fc-popover-body{background:#2a323d;border:1px solid #3f4b5b;border-top:0;color:hsla(0,0%,100%,.87);padding:1.25rem}.fc.fc-theme-standard .fc-view-harness .fc-event.fc-daygrid-block-event{background:#56bdff;border-color:#56bdff;color:#151515}.fc.fc-theme-standard .fc-view-harness .fc-event.fc-daygrid-block-event .fc-event-main{color:#151515}.fc.fc-theme-standard .fc-view-harness .fc-event.fc-daygrid-dot-event .fc-daygrid-event-dot{background:#56bdff;border-color:#56bdff}.fc.fc-theme-standard .fc-view-harness .fc-event.fc-daygrid-dot-event:hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.fc.fc-theme-standard .fc-view-harness .fc-cell-shaded{background:#2a323d}.fc.fc-theme-standard .fc-toolbar .fc-button{background:#8dd0ff;border:1px solid #8dd0ff;border-radius:4px;color:#151515;font-size:1rem;transition:background-color .15s,border-color .15s,box-shadow .15s}.fc.fc-theme-standard .fc-toolbar .fc-button:enabled:hover{background:#56bdff;border-color:#56bdff;color:#151515}.fc.fc-theme-standard .fc-toolbar .fc-button:enabled:active{background:#1dadff;border-color:#1dadff;color:#151515}.fc.fc-theme-standard .fc-toolbar .fc-button:enabled:active:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.fc.fc-theme-standard .fc-toolbar .fc-button:disabled{background:#8dd0ff;border:1px solid #8dd0ff;color:#151515;opacity:.65}.fc.fc-theme-standard .fc-toolbar .fc-button .fc-icon-chevron-left{font-family:PrimeIcons!important;font-size:1rem;text-indent:0}.fc.fc-theme-standard .fc-toolbar .fc-button .fc-icon-chevron-left:before{content:"\\e900"}.fc.fc-theme-standard .fc-toolbar .fc-button .fc-icon-chevron-right{font-family:PrimeIcons!important;font-size:1rem;text-indent:0}.fc.fc-theme-standard .fc-toolbar .fc-button .fc-icon-chevron-right:before{content:"\\e901"}.fc.fc-theme-standard .fc-toolbar .fc-button:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.fc.fc-theme-standard .fc-toolbar .fc-button.fc-dayGridMonth-button,.fc.fc-theme-standard .fc-toolbar .fc-button.fc-timeGridDay-button,.fc.fc-theme-standard .fc-toolbar .fc-button.fc-timeGridWeek-button{background:#6c757d;border:1px solid #6c757d;color:#fff;transition:background-color .15s,border-color .15s,box-shadow .15s}.fc.fc-theme-standard .fc-toolbar .fc-button.fc-dayGridMonth-button:hover,.fc.fc-theme-standard .fc-toolbar .fc-button.fc-timeGridDay-button:hover,.fc.fc-theme-standard .fc-toolbar .fc-button.fc-timeGridWeek-button:hover{background:#5a6268;border-color:#545b62;color:#fff}.fc.fc-theme-standard .fc-toolbar .fc-button.fc-dayGridMonth-button.fc-button-active,.fc.fc-theme-standard .fc-toolbar .fc-button.fc-dayGridMonth-button.fc-button-active:hover,.fc.fc-theme-standard .fc-toolbar .fc-button.fc-timeGridDay-button.fc-button-active,.fc.fc-theme-standard .fc-toolbar .fc-button.fc-timeGridDay-button.fc-button-active:hover,.fc.fc-theme-standard .fc-toolbar .fc-button.fc-timeGridWeek-button.fc-button-active,.fc.fc-theme-standard .fc-toolbar .fc-button.fc-timeGridWeek-button.fc-button-active:hover{background:#545b62;border-color:#4e555b;color:#fff}.fc.fc-theme-standard .fc-toolbar .fc-button.fc-dayGridMonth-button:not(:disabled):focus,.fc.fc-theme-standard .fc-toolbar .fc-button.fc-timeGridDay-button:not(:disabled):focus,.fc.fc-theme-standard .fc-toolbar .fc-button.fc-timeGridWeek-button:not(:disabled):focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0;z-index:1}.fc.fc-theme-standard .fc-toolbar .fc-button-group .fc-button{border-radius:0}.fc.fc-theme-standard .fc-toolbar .fc-button-group .fc-button:first-child{border-bottom-left-radius:4px;border-top-left-radius:4px}.fc.fc-theme-standard .fc-toolbar .fc-button-group .fc-button:last-child{border-bottom-right-radius:4px;border-top-right-radius:4px}.fc.fc-theme-standard .fc-highlight{background:#8dd0ff;color:#151515}.p-orderlist .p-orderlist-controls{padding:1.25rem}.p-orderlist .p-orderlist-controls .p-button{margin-bottom:.5rem}.p-orderlist .p-orderlist-header{background:#2a323d;border:1px solid #3f4b5b;border-bottom:0;border-top-left-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.87);font-weight:600;padding:1rem 1.25rem}.p-orderlist .p-orderlist-list{background:#2a323d;border:1px solid #3f4b5b;border-bottom-left-radius:4px;border-bottom-right-radius:4px;color:hsla(0,0%,100%,.87);outline:0 none;padding:.5rem 0}.p-orderlist .p-orderlist-list .p-orderlist-item{background:transparent;border:0;color:hsla(0,0%,100%,.87);margin:0;padding:.5rem 1.5rem;transition:transform .15s,box-shadow .15s}.p-orderlist .p-orderlist-list .p-orderlist-item:not(.p-highlight):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-orderlist .p-orderlist-list .p-orderlist-item.p-focus{background:hsla(0,0%,100%,.12);color:hsla(0,0%,100%,.87)}.p-orderlist .p-orderlist-list .p-orderlist-item.p-highlight{background:#8dd0ff;color:#151515}.p-orderlist .p-orderlist-list .p-orderlist-item.p-highlight.p-focus{background:#64bfff}.p-orderlist.p-orderlist-striped .p-orderlist-list .p-orderlist-item:nth-child(2n){background:hsla(0,0%,100%,.02)}.p-orderlist.p-orderlist-striped .p-orderlist-list .p-orderlist-item:nth-child(2n):hover{background:hsla(0,0%,100%,.04)}.p-organizationchart .p-organizationchart-node-content.p-organizationchart-selectable-node:not(.p-highlight):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-organizationchart .p-organizationchart-node-content.p-highlight{background:#8dd0ff;color:#151515}.p-organizationchart .p-organizationchart-node-content.p-highlight .p-node-toggler i{color:#0e9bff}.p-organizationchart .p-organizationchart-line-down{background:#3f4b5b}.p-organizationchart .p-organizationchart-line-left{border-right:1px solid;border-color:#3f4b5b}.p-organizationchart .p-organizationchart-line-top{border-color:#3f4b5b;border-top:1px solid #3f4b5b}.p-organizationchart .p-organizationchart-node-content{background:#2a323d;border:1px solid #3f4b5b;color:hsla(0,0%,100%,.87);padding:1.25rem}.p-organizationchart .p-organizationchart-node-content .p-node-toggler{background:inherit;border-radius:50%;color:inherit}.p-organizationchart .p-organizationchart-node-content .p-node-toggler:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-paginator{background:#2a323d;border:0 solid #3f4b5b;border-radius:4px;color:#8dd0ff;padding:.75rem}.p-paginator .p-paginator-first,.p-paginator .p-paginator-last,.p-paginator .p-paginator-next,.p-paginator .p-paginator-prev{background-color:transparent;border:1px solid #3f4b5b;border-radius:0;color:#8dd0ff;height:2.357rem;margin:0 0 0 -1px;min-width:2.357rem;transition:box-shadow .15s}.p-paginator .p-paginator-first:not(.p-disabled):not(.p-highlight):hover,.p-paginator .p-paginator-last:not(.p-disabled):not(.p-highlight):hover,.p-paginator .p-paginator-next:not(.p-disabled):not(.p-highlight):hover,.p-paginator .p-paginator-prev:not(.p-disabled):not(.p-highlight):hover{background:hsla(0,0%,100%,.04);border-color:#3f4b5b;color:#8dd0ff}.p-paginator .p-paginator-first{border-bottom-left-radius:0;border-top-left-radius:0}.p-paginator .p-paginator-last{border-bottom-right-radius:0;border-top-right-radius:0}.p-paginator .p-dropdown{height:2.357rem;margin-left:.5rem;margin-right:.5rem}.p-paginator .p-dropdown .p-dropdown-label{padding-right:0}.p-paginator .p-paginator-page-input{margin-left:.5rem;margin-right:.5rem}.p-paginator .p-paginator-page-input .p-inputtext{max-width:2.357rem}.p-paginator .p-paginator-current{padding:0 .5rem}.p-paginator .p-paginator-current,.p-paginator .p-paginator-pages .p-paginator-page{background-color:transparent;border:1px solid #3f4b5b;color:#8dd0ff;height:2.357rem;margin:0 0 0 -1px;min-width:2.357rem}.p-paginator .p-paginator-pages .p-paginator-page{border-radius:0;transition:box-shadow .15s}.p-paginator .p-paginator-pages .p-paginator-page.p-highlight{background:#8dd0ff;border-color:#8dd0ff;color:#151515}.p-paginator .p-paginator-pages .p-paginator-page:not(.p-highlight):hover{background:hsla(0,0%,100%,.04);border-color:#3f4b5b;color:#8dd0ff}.p-picklist .p-picklist-buttons{padding:1.25rem}.p-picklist .p-picklist-buttons .p-button{margin-bottom:.5rem}.p-picklist .p-picklist-header{background:#2a323d;border:1px solid #3f4b5b;border-bottom:0;border-top-left-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.87);font-weight:600;padding:1rem 1.25rem}.p-picklist .p-picklist-list{background:#2a323d;border:1px solid #3f4b5b;border-bottom-left-radius:4px;border-bottom-right-radius:4px;color:hsla(0,0%,100%,.87);outline:0 none;padding:.5rem 0}.p-picklist .p-picklist-list .p-picklist-item{background:transparent;border:0;color:hsla(0,0%,100%,.87);margin:0;padding:.5rem 1.5rem;transition:transform .15s,box-shadow .15s}.p-picklist .p-picklist-list .p-picklist-item:not(.p-highlight):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-picklist .p-picklist-list .p-picklist-item.p-focus{background:hsla(0,0%,100%,.12);color:hsla(0,0%,100%,.87)}.p-picklist .p-picklist-list .p-picklist-item.p-highlight{background:#8dd0ff;color:#151515}.p-picklist .p-picklist-list .p-picklist-item.p-highlight.p-focus{background:#64bfff}.p-picklist.p-picklist-striped .p-picklist-list .p-picklist-item:nth-child(2n){background:hsla(0,0%,100%,.02)}.p-picklist.p-picklist-striped .p-picklist-list .p-picklist-item:nth-child(2n):hover{background:hsla(0,0%,100%,.04)}.p-timeline .p-timeline-event-marker{background-color:#8dd0ff;border:0;border-radius:50%;height:1rem;width:1rem}.p-timeline .p-timeline-event-connector{background-color:#3f4b5b}.p-timeline.p-timeline-vertical .p-timeline-event-content,.p-timeline.p-timeline-vertical .p-timeline-event-opposite{padding:0 1rem}.p-timeline.p-timeline-vertical .p-timeline-event-connector{width:2px}.p-timeline.p-timeline-horizontal .p-timeline-event-content,.p-timeline.p-timeline-horizontal .p-timeline-event-opposite{padding:1rem 0}.p-timeline.p-timeline-horizontal .p-timeline-event-connector{height:2px}.p-tree{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;color:hsla(0,0%,100%,.87);padding:1.25rem}.p-tree .p-tree-container .p-treenode{outline:0 none;padding:.143rem}.p-tree .p-tree-container .p-treenode:focus>.p-treenode-content{box-shadow:inset 0 0 0 .15rem #e3f3fe;outline:0 none;outline-offset:0}.p-tree .p-tree-container .p-treenode .p-treenode-content{border-radius:4px;padding:.286rem;transition:box-shadow .15s}.p-tree .p-tree-container .p-treenode .p-treenode-content .p-tree-toggler{background:transparent;border:0;border-radius:50%;color:hsla(0,0%,100%,.6);height:2rem;margin-right:.5rem;transition:color .15s,box-shadow .15s;width:2rem}.p-tree .p-tree-container .p-treenode .p-treenode-content .p-tree-toggler:enabled:hover{background:transparent;border-color:transparent;color:hsla(0,0%,100%,.87)}.p-tree .p-tree-container .p-treenode .p-treenode-content .p-tree-toggler:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-tree .p-tree-container .p-treenode .p-treenode-content .p-treenode-icon{color:#3f4b5b;margin-right:.5rem}.p-tree .p-tree-container .p-treenode .p-treenode-content .p-checkbox{margin-right:.5rem}.p-tree .p-tree-container .p-treenode .p-treenode-content .p-checkbox .p-indeterminate .p-checkbox-icon{color:hsla(0,0%,100%,.87)}.p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight{background:#8dd0ff;color:#151515}.p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight .p-tree-toggler,.p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight .p-tree-toggler:hover,.p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight .p-treenode-icon,.p-tree .p-tree-container .p-treenode .p-treenode-content.p-highlight .p-treenode-icon:hover{color:#151515}.p-tree .p-tree-container .p-treenode .p-treenode-content.p-treenode-selectable:not(.p-highlight):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-tree .p-tree-filter-container{margin-bottom:.5rem}.p-tree .p-tree-filter-container .p-tree-filter{padding-right:1.75rem;width:100%}.p-tree .p-tree-filter-container .p-tree-filter-icon{color:hsla(0,0%,100%,.6);right:.75rem}.p-tree .p-treenode-children{padding:0 0 0 1rem}.p-tree .p-tree-loading-icon{font-size:2rem}.p-tree .p-tree-loading-icon.p-icon{height:2rem;width:2rem}.p-treetable .p-paginator-top{border-radius:0;border-width:0}.p-treetable .p-paginator-bottom{border-radius:0;border-width:1px 0 0}.p-treetable .p-treetable-header{background:#2a323d;border:solid #3f4b5b;border-width:1px 0 0;color:hsla(0,0%,100%,.6);font-weight:600;padding:1rem}.p-treetable .p-treetable-footer{background:#2a323d;border:1px solid #3f4b5b;border-width:1px 0;color:hsla(0,0%,100%,.87);font-weight:600;padding:1rem}.p-treetable .p-treetable-thead>tr>th{border:1px solid #3f4b5b;border-width:1px 0 2px;transition:box-shadow .15s}.p-treetable .p-treetable-tfoot>tr>td,.p-treetable .p-treetable-thead>tr>th{background:#2a323d;color:hsla(0,0%,100%,.87);font-weight:600;padding:1rem;text-align:left}.p-treetable .p-treetable-tfoot>tr>td{border:1px solid #3f4b5b;border-width:1px 0}.p-treetable .p-sortable-column{outline-color:#e3f3fe}.p-treetable .p-sortable-column .p-sortable-column-icon{color:hsla(0,0%,100%,.6);margin-left:.5rem}.p-treetable .p-sortable-column .p-sortable-column-badge{background:#8dd0ff;border-radius:50%;color:#151515;height:1.143rem;line-height:1.143rem;margin-left:.5rem;min-width:1.143rem}.p-treetable .p-sortable-column:not(.p-highlight):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-treetable .p-sortable-column:not(.p-highlight):hover .p-sortable-column-icon{color:hsla(0,0%,100%,.87)}.p-treetable .p-sortable-column.p-highlight{background:#2a323d;color:#8dd0ff}.p-treetable .p-sortable-column.p-highlight .p-sortable-column-icon{color:#8dd0ff}.p-treetable .p-treetable-tbody>tr{background:#2a323d;color:hsla(0,0%,100%,.87);transition:box-shadow .15s}.p-treetable .p-treetable-tbody>tr>td{border:solid #3f4b5b;border-width:1px 0 0;padding:1rem;text-align:left}.p-treetable .p-treetable-tbody>tr>td .p-treetable-toggler{background:transparent;border:0;border-radius:50%;color:hsla(0,0%,100%,.6);height:2rem;margin-right:.5rem;transition:color .15s,box-shadow .15s;width:2rem}.p-treetable .p-treetable-tbody>tr>td .p-treetable-toggler:enabled:hover{background:transparent;border-color:transparent;color:hsla(0,0%,100%,.87)}.p-treetable .p-treetable-tbody>tr>td .p-treetable-toggler:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-treetable .p-treetable-tbody>tr>td .p-treetable-toggler+.p-checkbox{margin-right:.5rem}.p-treetable .p-treetable-tbody>tr>td .p-treetable-toggler+.p-checkbox .p-indeterminate .p-checkbox-icon{color:hsla(0,0%,100%,.87)}.p-treetable .p-treetable-tbody>tr:focus{outline:.15rem solid #e3f3fe;outline-offset:-.15rem}.p-treetable .p-treetable-tbody>tr.p-highlight{background:#8dd0ff;color:#151515}.p-treetable .p-treetable-tbody>tr.p-highlight .p-treetable-toggler,.p-treetable .p-treetable-tbody>tr.p-highlight .p-treetable-toggler:hover{color:#151515}.p-treetable.p-treetable-hoverable-rows .p-treetable-tbody>tr:not(.p-highlight):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-treetable.p-treetable-hoverable-rows .p-treetable-tbody>tr:not(.p-highlight):hover .p-treetable-toggler{color:hsla(0,0%,100%,.87)}.p-treetable .p-column-resizer-helper{background:#8dd0ff}.p-treetable .p-treetable-scrollable-footer,.p-treetable .p-treetable-scrollable-header{background:#2a323d}.p-treetable .p-treetable-loading-icon{font-size:2rem}.p-treetable .p-treetable-loading-icon.p-icon{height:2rem;width:2rem}.p-treetable.p-treetable-gridlines .p-datatable-header{border-width:1px 1px 0}.p-treetable.p-treetable-gridlines .p-treetable-footer{border-width:0 1px 1px}.p-treetable.p-treetable-gridlines .p-treetable-top{border-width:0 1px}.p-treetable.p-treetable-gridlines .p-treetable-bottom{border-width:0 1px 1px}.p-treetable.p-treetable-gridlines .p-treetable-tbody>tr>td,.p-treetable.p-treetable-gridlines .p-treetable-tfoot>tr>td,.p-treetable.p-treetable-gridlines .p-treetable-thead>tr>th{border-width:1px}.p-treetable.p-treetable-sm .p-treetable-header{padding:.875rem}.p-treetable.p-treetable-sm .p-treetable-footer,.p-treetable.p-treetable-sm .p-treetable-tbody>tr>td,.p-treetable.p-treetable-sm .p-treetable-tfoot>tr>td,.p-treetable.p-treetable-sm .p-treetable-thead>tr>th{padding:.5rem}.p-treetable.p-treetable-lg .p-treetable-footer,.p-treetable.p-treetable-lg .p-treetable-header,.p-treetable.p-treetable-lg .p-treetable-tbody>tr>td,.p-treetable.p-treetable-lg .p-treetable-tfoot>tr>td,.p-treetable.p-treetable-lg .p-treetable-thead>tr>th{padding:1.25rem}.p-accordion .p-accordion-header .p-accordion-header-link{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;color:hsla(0,0%,100%,.87);font-weight:600;padding:1rem 1.25rem;transition:box-shadow .15s}.p-accordion .p-accordion-header .p-accordion-header-link .p-accordion-toggle-icon{margin-right:.5rem}.p-accordion .p-accordion-header:not(.p-disabled) .p-accordion-header-link:focus{box-shadow:inset 0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-accordion .p-accordion-header:not(.p-highlight):not(.p-disabled):hover .p-accordion-header-link{background:hsla(0,0%,100%,.04);border-color:#3f4b5b;color:hsla(0,0%,100%,.87)}.p-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link{background:#2a323d;border-bottom-left-radius:0;border-bottom-right-radius:0;border-color:#3f4b5b;color:hsla(0,0%,100%,.87)}.p-accordion .p-accordion-header:not(.p-disabled).p-highlight:hover .p-accordion-header-link{background:hsla(0,0%,100%,.04);border-color:#3f4b5b;color:hsla(0,0%,100%,.87)}.p-accordion .p-accordion-content{background:#2a323d;border:1px solid #3f4b5b;border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-top:0;border-top-left-radius:0;border-top-right-radius:0;color:hsla(0,0%,100%,.87);padding:1.25rem}.p-accordion .p-accordion-tab{margin-bottom:0}.p-accordion .p-accordion-tab .p-accordion-header .p-accordion-header-link{border-radius:0}.p-accordion .p-accordion-tab .p-accordion-content{border-bottom-left-radius:0;border-bottom-right-radius:0}.p-accordion .p-accordion-tab:not(:first-child) .p-accordion-header .p-accordion-header-link,.p-accordion .p-accordion-tab:not(:first-child) .p-accordion-header:not(.p-disabled).p-highlight:hover .p-accordion-header-link,.p-accordion .p-accordion-tab:not(:first-child) .p-accordion-header:not(.p-highlight):not(.p-disabled):hover .p-accordion-header-link{border-top:0}.p-accordion .p-accordion-tab:first-child .p-accordion-header .p-accordion-header-link{border-top-left-radius:4px;border-top-right-radius:4px}.p-accordion .p-accordion-tab:last-child .p-accordion-content,.p-accordion .p-accordion-tab:last-child .p-accordion-header:not(.p-highlight) .p-accordion-header-link{border-bottom-left-radius:4px;border-bottom-right-radius:4px}.p-card{background:#2a323d;border-radius:4px;box-shadow:0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12);color:hsla(0,0%,100%,.87)}.p-card .p-card-body{padding:1.5rem}.p-card .p-card-title{font-size:1.5rem;font-weight:700;margin-bottom:.5rem}.p-card .p-card-subtitle{color:hsla(0,0%,100%,.6);font-weight:400;margin-bottom:.5rem}.p-card .p-card-content{padding:1rem 0}.p-card .p-card-footer{padding:1rem 0 0}.p-fieldset,.p-fieldset .p-fieldset-legend{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;color:hsla(0,0%,100%,.87)}.p-fieldset .p-fieldset-legend{font-weight:600;padding:1rem 1.25rem}.p-fieldset.p-fieldset-toggleable .p-fieldset-legend{padding:0;transition:color .15s,box-shadow .15s}.p-fieldset.p-fieldset-toggleable .p-fieldset-legend a{border-radius:4px;color:hsla(0,0%,100%,.87);padding:1rem 1.25rem;transition:box-shadow .15s}.p-fieldset.p-fieldset-toggleable .p-fieldset-legend a .p-fieldset-toggler{margin-right:.5rem}.p-fieldset.p-fieldset-toggleable .p-fieldset-legend a:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-fieldset.p-fieldset-toggleable .p-fieldset-legend a:hover{color:hsla(0,0%,100%,.87)}.p-fieldset.p-fieldset-toggleable .p-fieldset-legend:hover{background:hsla(0,0%,100%,.04);border-color:#3f4b5b;color:hsla(0,0%,100%,.87)}.p-fieldset .p-fieldset-content{padding:1.25rem}.p-divider .p-divider-content{background-color:#2a323d}.p-divider.p-divider-horizontal{margin:1rem 0;padding:0 1rem}.p-divider.p-divider-horizontal:before{border-top:1px #3f4b5b}.p-divider.p-divider-horizontal .p-divider-content{padding:0 .5rem}.p-divider.p-divider-vertical{margin:0 1rem;padding:1rem 0}.p-divider.p-divider-vertical:before{border-left:1px #3f4b5b}.p-divider.p-divider-vertical .p-divider-content{padding:.5rem 0}.p-panel .p-panel-header{background:#2a323d;border:1px solid #3f4b5b;border-top-left-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.87);padding:1rem 1.25rem}.p-panel .p-panel-header .p-panel-title{font-weight:600}.p-panel .p-panel-header .p-panel-header-icon{background:transparent;border:0;border-radius:50%;color:hsla(0,0%,100%,.6);height:2rem;transition:color .15s,box-shadow .15s;width:2rem}.p-panel .p-panel-header .p-panel-header-icon:enabled:hover{background:transparent;border-color:transparent;color:hsla(0,0%,100%,.87)}.p-panel .p-panel-header .p-panel-header-icon:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-panel.p-panel-toggleable .p-panel-header{padding:.5rem 1.25rem}.p-panel .p-panel-content{background:#2a323d;border:1px solid #3f4b5b;border-top:0;color:hsla(0,0%,100%,.87);padding:1.25rem}.p-panel .p-panel-content:last-child,.p-panel .p-panel-footer{border-bottom-left-radius:4px;border-bottom-right-radius:4px}.p-panel .p-panel-footer{background:#2a323d;border:1px solid #3f4b5b;border-top:0;color:hsla(0,0%,100%,.87);padding:.5rem 1.25rem}.p-scrollpanel .p-scrollpanel-bar{background:#3f4b5b;border:0;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-scrollpanel .p-scrollpanel-bar:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-splitter{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;color:hsla(0,0%,100%,.87)}.p-splitter .p-splitter-gutter{background:hsla(0,0%,100%,.04);transition:color .15s,box-shadow .15s}.p-splitter .p-splitter-gutter .p-splitter-gutter-handle{background:#3f4b5b;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-splitter .p-splitter-gutter .p-splitter-gutter-handle:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-splitter .p-splitter-gutter-resizing{background:#3f4b5b}.p-tabview .p-tabview-nav{background:transparent;border:solid #3f4b5b;border-width:0 0 1px}.p-tabview .p-tabview-nav li{margin-right:0}.p-tabview .p-tabview-nav li .p-tabview-nav-link{background:#2a323d;border:solid;border-color:#2a323d #2a323d #3f4b5b;border-top-left-radius:4px;border-top-right-radius:4px;border-width:1px;color:hsla(0,0%,100%,.6);font-weight:600;margin:0 0 -1px;padding:.75rem 1rem;transition:box-shadow .15s}.p-tabview .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):focus{box-shadow:inset 0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-tabview .p-tabview-nav li:not(.p-highlight):not(.p-disabled):hover .p-tabview-nav-link{background:#2a323d;border-color:#3f4b5b;color:hsla(0,0%,100%,.87)}.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link{background:#2a323d;border-color:#3f4b5b #3f4b5b #2a323d;color:hsla(0,0%,100%,.6)}.p-tabview .p-tabview-nav-btn.p-link{background:#2a323d;border-radius:0;box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);color:hsla(0,0%,100%,.6);width:2.357rem}.p-tabview .p-tabview-nav-btn.p-link:focus{box-shadow:inset 0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-tabview .p-tabview-panels{background:#2a323d;border:0;border-bottom-left-radius:4px;border-bottom-right-radius:4px;color:hsla(0,0%,100%,.87);padding:1.25rem}.p-toolbar{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;gap:.5rem;padding:1rem 1.25rem}.p-toolbar .p-toolbar-separator{margin:0 .5rem}.p-confirm-popup{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;box-shadow:none;color:hsla(0,0%,100%,.87)}.p-confirm-popup .p-confirm-popup-content{padding:1.25rem}.p-confirm-popup .p-confirm-popup-footer{padding:0 1.25rem 1.25rem;text-align:right}.p-confirm-popup .p-confirm-popup-footer button{margin:0 .5rem 0 0;width:auto}.p-confirm-popup .p-confirm-popup-footer button:last-child{margin:0}.p-confirm-popup:after{border:solid rgba(42,50,61,0);border-bottom:solid #2a323d}.p-confirm-popup:before{border:solid rgba(63,75,91,0);border-bottom:solid #3f4b5b}.p-confirm-popup.p-confirm-popup-flipped:after{border-top-color:#2a323d}.p-confirm-popup.p-confirm-popup-flipped:before{border-top-color:#3f4b5b}.p-confirm-popup .p-confirm-popup-icon{font-size:1.5rem}.p-confirm-popup .p-confirm-popup-icon.p-icon{height:1.5rem;width:1.5rem}.p-confirm-popup .p-confirm-popup-message{margin-left:1rem}.p-dialog{border:1px solid #3f4b5b;border-radius:4px;box-shadow:none}.p-dialog .p-dialog-header{background:#2a323d;border-bottom:1px solid #3f4b5b;border-top-left-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.87);padding:1rem}.p-dialog .p-dialog-header .p-dialog-title{font-size:1.25rem;font-weight:600}.p-dialog .p-dialog-header .p-dialog-header-icon{background:transparent;border:0;border-radius:50%;color:hsla(0,0%,100%,.6);height:2rem;margin-right:.5rem;transition:color .15s,box-shadow .15s;width:2rem}.p-dialog .p-dialog-header .p-dialog-header-icon:enabled:hover{background:transparent;border-color:transparent;color:hsla(0,0%,100%,.87)}.p-dialog .p-dialog-header .p-dialog-header-icon:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-dialog .p-dialog-header .p-dialog-header-icon:last-child{margin-right:0}.p-dialog .p-dialog-content{background:#2a323d;color:hsla(0,0%,100%,.87);padding:1rem}.p-dialog .p-dialog-content:last-of-type{border-bottom-left-radius:4px;border-bottom-right-radius:4px}.p-dialog .p-dialog-footer{background:#2a323d;border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-top:1px solid #3f4b5b;color:hsla(0,0%,100%,.87);padding:1rem;text-align:right}.p-dialog .p-dialog-footer button{margin:0 .5rem 0 0;width:auto}.p-dialog.p-confirm-dialog .p-confirm-dialog-icon{font-size:2rem}.p-dialog.p-confirm-dialog .p-confirm-dialog-message:not(:first-child){margin-left:1rem}.p-overlaypanel{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;box-shadow:none;color:hsla(0,0%,100%,.87)}.p-overlaypanel .p-overlaypanel-content{padding:1.25rem}.p-overlaypanel .p-overlaypanel-close{background:#8dd0ff;border-radius:50%;color:#151515;height:2rem;position:absolute;right:-1rem;top:-1rem;transition:color .15s,box-shadow .15s;width:2rem}.p-overlaypanel .p-overlaypanel-close:enabled:hover{background:#56bdff;color:#151515}.p-overlaypanel:after{border:solid rgba(42,50,61,0);border-bottom:solid #2a323d}.p-overlaypanel:before{border:solid rgba(63,75,91,0);border-bottom:solid #3c4756}.p-overlaypanel.p-overlaypanel-flipped:after{border-top-color:#2a323d}.p-overlaypanel.p-overlaypanel-flipped:before{border-top-color:#3f4b5b}.p-sidebar{background:#2a323d;border:1px solid #3f4b5b;box-shadow:none;color:hsla(0,0%,100%,.87)}.p-sidebar .p-sidebar-header{padding:1rem 1.25rem}.p-sidebar .p-sidebar-header .p-sidebar-close,.p-sidebar .p-sidebar-header .p-sidebar-icon{background:transparent;border:0;border-radius:50%;color:hsla(0,0%,100%,.6);height:2rem;transition:color .15s,box-shadow .15s;width:2rem}.p-sidebar .p-sidebar-header .p-sidebar-close:enabled:hover,.p-sidebar .p-sidebar-header .p-sidebar-icon:enabled:hover{background:transparent;border-color:transparent;color:hsla(0,0%,100%,.87)}.p-sidebar .p-sidebar-header .p-sidebar-close:focus,.p-sidebar .p-sidebar-header .p-sidebar-icon:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-sidebar .p-sidebar-header+.p-sidebar-content{padding-top:0}.p-sidebar .p-sidebar-content{padding:1.25rem}.p-tooltip .p-tooltip-text{background:#3f4b5b;border-radius:4px;box-shadow:none;color:hsla(0,0%,100%,.87);padding:.5rem .75rem}.p-tooltip.p-tooltip-right .p-tooltip-arrow{border-right-color:#3f4b5b}.p-tooltip.p-tooltip-left .p-tooltip-arrow{border-left-color:#3f4b5b}.p-tooltip.p-tooltip-top .p-tooltip-arrow{border-top-color:#3f4b5b}.p-tooltip.p-tooltip-bottom .p-tooltip-arrow{border-bottom-color:#3f4b5b}.p-fileupload .p-fileupload-buttonbar{background:#2a323d;border:1px solid #3f4b5b;border-bottom:0;border-top-left-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.87);gap:.5rem;padding:1rem 1.25rem}.p-fileupload .p-fileupload-buttonbar .p-button.p-fileupload-choose.p-focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-fileupload .p-fileupload-content{background:#2a323d;border:1px solid #3f4b5b;border-bottom-left-radius:4px;border-bottom-right-radius:4px;color:hsla(0,0%,100%,.87);padding:2rem 1rem}.p-fileupload .p-fileupload-file{border:1px solid #3f4b5b;border-radius:4px;gap:.5rem;margin-bottom:.5rem;padding:1rem}.p-fileupload .p-fileupload-file:last-child{margin-bottom:0}.p-fileupload .p-fileupload-file-name{margin-bottom:.5rem}.p-fileupload .p-fileupload-file-size{margin-right:.5rem}.p-fileupload .p-progressbar{height:.25rem}.p-fileupload .p-fileupload-row>div{padding:1rem}.p-fileupload.p-fileupload-advanced .p-message{margin-top:0}.p-fileupload-choose:not(.p-disabled):hover{background:#56bdff;border-color:#56bdff;color:#151515}.p-fileupload-choose:not(.p-disabled):active{background:#1dadff;border-color:#1dadff;color:#151515}.p-breadcrumb{background:#343e4d;border:0;border-radius:4px;padding:1rem}.p-breadcrumb .p-breadcrumb-list li .p-menuitem-link{border-radius:4px;transition:box-shadow .15s}.p-breadcrumb .p-breadcrumb-list li .p-menuitem-link:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-breadcrumb .p-breadcrumb-list li .p-menuitem-link .p-menuitem-icon,.p-breadcrumb .p-breadcrumb-list li .p-menuitem-link .p-menuitem-text{color:#8dd0ff}.p-breadcrumb .p-breadcrumb-list li.p-menuitem-separator{color:hsla(0,0%,100%,.87);margin:0 .5rem}.p-breadcrumb .p-breadcrumb-list li:last-child .p-menuitem-icon,.p-breadcrumb .p-breadcrumb-list li:last-child .p-menuitem-text,.p-contextmenu{color:hsla(0,0%,100%,.87)}.p-contextmenu{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;box-shadow:none;padding:.5rem 0;width:12.5rem}.p-contextmenu .p-contextmenu-root-list{outline:0 none}.p-contextmenu .p-submenu-list{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;box-shadow:none;padding:.5rem 0}.p-contextmenu .p-menuitem>.p-menuitem-content{border-radius:0;color:hsla(0,0%,100%,.87);transition:box-shadow .15s}.p-contextmenu .p-menuitem>.p-menuitem-content .p-menuitem-link{color:hsla(0,0%,100%,.87);padding:.75rem 1rem;-webkit-user-select:none;-moz-user-select:none;user-select:none}.p-contextmenu .p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-text{color:hsla(0,0%,100%,.87)}.p-contextmenu .p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-icon{color:hsla(0,0%,100%,.6);margin-right:.5rem}.p-contextmenu .p-menuitem>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.6)}.p-contextmenu .p-menuitem.p-highlight>.p-menuitem-content{background:#20262e;color:hsla(0,0%,100%,.87)}.p-contextmenu .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-menuitem-icon,.p-contextmenu .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-menuitem-text,.p-contextmenu .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-contextmenu .p-menuitem.p-highlight.p-focus>.p-menuitem-content{background:#20262e}.p-contextmenu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content{background:hsla(0,0%,100%,.12);color:hsla(0,0%,100%,.87)}.p-contextmenu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-menuitem-icon,.p-contextmenu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-menuitem-text,.p-contextmenu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-contextmenu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-contextmenu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-icon,.p-contextmenu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-text,.p-contextmenu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-contextmenu .p-menuitem-separator{border-top:1px solid #3f4b5b;margin:.5rem 0}.p-contextmenu .p-submenu-icon{font-size:.875rem}.p-contextmenu .p-submenu-icon.p-icon{height:.875rem;width:.875rem}.p-dock .p-dock-list-container{background:hsla(0,0%,100%,.1);border:1px solid hsla(0,0%,100%,.2);border-radius:.5rem;padding:.5rem}.p-dock .p-dock-list-container .p-dock-list{outline:0 none}.p-dock .p-dock-item{border-radius:4px;padding:.5rem}.p-dock .p-dock-item.p-focus{box-shadow:inset 0 0 0 .15rem #e3f3fe;outline:0 none;outline-offset:0}.p-dock .p-dock-link{height:4rem;width:4rem}.p-dock.p-dock-bottom .p-dock-item-second-next,.p-dock.p-dock-bottom .p-dock-item-second-prev,.p-dock.p-dock-top .p-dock-item-second-next,.p-dock.p-dock-top .p-dock-item-second-prev{margin:0 .9rem}.p-dock.p-dock-bottom .p-dock-item-next,.p-dock.p-dock-bottom .p-dock-item-prev,.p-dock.p-dock-top .p-dock-item-next,.p-dock.p-dock-top .p-dock-item-prev{margin:0 1.3rem}.p-dock.p-dock-bottom .p-dock-item-current,.p-dock.p-dock-top .p-dock-item-current{margin:0 1.5rem}.p-dock.p-dock-left .p-dock-item-second-next,.p-dock.p-dock-left .p-dock-item-second-prev,.p-dock.p-dock-right .p-dock-item-second-next,.p-dock.p-dock-right .p-dock-item-second-prev{margin:.9rem 0}.p-dock.p-dock-left .p-dock-item-next,.p-dock.p-dock-left .p-dock-item-prev,.p-dock.p-dock-right .p-dock-item-next,.p-dock.p-dock-right .p-dock-item-prev{margin:1.3rem 0}.p-dock.p-dock-left .p-dock-item-current,.p-dock.p-dock-right .p-dock-item-current{margin:1.5rem 0}@media screen and (max-width:960px){.p-dock.p-dock-bottom .p-dock-list-container,.p-dock.p-dock-top .p-dock-list-container{overflow-x:auto;width:100%}.p-dock.p-dock-bottom .p-dock-list-container .p-dock-list,.p-dock.p-dock-top .p-dock-list-container .p-dock-list{margin:0 auto}.p-dock.p-dock-left .p-dock-list-container,.p-dock.p-dock-right .p-dock-list-container{height:100%;overflow-y:auto}.p-dock.p-dock-left .p-dock-list-container .p-dock-list,.p-dock.p-dock-right .p-dock-list-container .p-dock-list{margin:auto 0}.p-dock .p-dock-list .p-dock-item{margin:0;transform:none}}.p-megamenu{background:#343e4d;border:0;border-radius:4px;color:hsla(0,0%,100%,.6);padding:.5rem 1rem}.p-megamenu .p-megamenu-root-list{outline:0 none}.p-megamenu .p-menuitem>.p-menuitem-content{border-radius:0;color:hsla(0,0%,100%,.87);transition:box-shadow .15s}.p-megamenu .p-menuitem>.p-menuitem-content .p-menuitem-link{color:hsla(0,0%,100%,.87);padding:.75rem 1rem;-webkit-user-select:none;-moz-user-select:none;user-select:none}.p-megamenu .p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-text{color:hsla(0,0%,100%,.87)}.p-megamenu .p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-icon{color:hsla(0,0%,100%,.6);margin-right:.5rem}.p-megamenu .p-menuitem>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.6)}.p-megamenu .p-menuitem.p-highlight>.p-menuitem-content{background:#20262e;color:hsla(0,0%,100%,.87)}.p-megamenu .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-menuitem-icon,.p-megamenu .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-menuitem-text,.p-megamenu .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-megamenu .p-menuitem.p-highlight.p-focus>.p-menuitem-content{background:#20262e}.p-megamenu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content{background:hsla(0,0%,100%,.12);color:hsla(0,0%,100%,.87)}.p-megamenu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-menuitem-icon,.p-megamenu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-menuitem-text,.p-megamenu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-megamenu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-megamenu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-icon,.p-megamenu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-text,.p-megamenu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-megamenu .p-megamenu-panel{background:#2a323d;border:1px solid #3f4b5b;box-shadow:none;color:hsla(0,0%,100%,.87)}.p-megamenu .p-submenu-header{background:#2a323d;border-top-left-radius:4px;border-top-right-radius:4px;color:hsla(0,0%,100%,.87);font-weight:600;margin:0;padding:.75rem 1rem}.p-megamenu .p-submenu-list{padding:.5rem 0;width:12.5rem}.p-megamenu .p-submenu-list .p-menuitem-separator{border-top:1px solid #3f4b5b;margin:.5rem 0}.p-megamenu.p-megamenu-vertical{padding:.5rem 0;width:12.5rem}.p-megamenu.p-megamenu-horizontal .p-megamenu-root-list>.p-menuitem>.p-menuitem-content{border-radius:4px;color:hsla(0,0%,100%,.6);transition:box-shadow .15s}.p-megamenu.p-megamenu-horizontal .p-megamenu-root-list>.p-menuitem>.p-menuitem-content .p-menuitem-link{padding:1rem;-webkit-user-select:none;-moz-user-select:none;user-select:none}.p-megamenu.p-megamenu-horizontal .p-megamenu-root-list>.p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-text{color:hsla(0,0%,100%,.6)}.p-megamenu.p-megamenu-horizontal .p-megamenu-root-list>.p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-icon{color:hsla(0,0%,100%,.6);margin-right:.5rem}.p-megamenu.p-megamenu-horizontal .p-megamenu-root-list>.p-menuitem>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.6);margin-left:.5rem}.p-megamenu.p-megamenu-horizontal .p-megamenu-root-list>.p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover{background:transparent;color:hsla(0,0%,100%,.87)}.p-megamenu.p-megamenu-horizontal .p-megamenu-root-list>.p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-icon,.p-megamenu.p-megamenu-horizontal .p-megamenu-root-list>.p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-text,.p-megamenu.p-megamenu-horizontal .p-megamenu-root-list>.p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-submenu-icon,.p-menu{color:hsla(0,0%,100%,.87)}.p-menu{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;padding:.5rem 0;width:12.5rem}.p-menu .p-menuitem>.p-menuitem-content{border-radius:0;color:hsla(0,0%,100%,.87);transition:box-shadow .15s}.p-menu .p-menuitem>.p-menuitem-content .p-menuitem-link{color:hsla(0,0%,100%,.87);padding:.75rem 1rem;-webkit-user-select:none;-moz-user-select:none;user-select:none}.p-menu .p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-text{color:hsla(0,0%,100%,.87)}.p-menu .p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-icon{color:hsla(0,0%,100%,.6);margin-right:.5rem}.p-menu .p-menuitem>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.6)}.p-menu .p-menuitem.p-highlight>.p-menuitem-content{background:#20262e;color:hsla(0,0%,100%,.87)}.p-menu .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-menuitem-icon,.p-menu .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-menuitem-text,.p-menu .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-menu .p-menuitem.p-highlight.p-focus>.p-menuitem-content{background:#20262e}.p-menu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content{background:hsla(0,0%,100%,.12);color:hsla(0,0%,100%,.87)}.p-menu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-menuitem-icon,.p-menu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-menuitem-text,.p-menu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-menu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-menu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-icon,.p-menu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-text,.p-menu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-menu.p-menu-overlay{background:#2a323d;border:1px solid #3f4b5b;box-shadow:none}.p-menu .p-submenu-header{background:#2a323d;border-top-left-radius:0;border-top-right-radius:0;color:hsla(0,0%,100%,.87);font-weight:600;margin:0;padding:.75rem 1rem}.p-menu .p-menuitem-separator{border-top:1px solid #3f4b5b;margin:.5rem 0}.p-menubar{background:#343e4d;border:0;border-radius:4px;color:hsla(0,0%,100%,.6);padding:.5rem 1rem}.p-menubar .p-menubar-root-list{outline:0 none}.p-menubar .p-menubar-root-list>.p-menuitem>.p-menuitem-content{border-radius:4px;color:hsla(0,0%,100%,.6);transition:box-shadow .15s}.p-menubar .p-menubar-root-list>.p-menuitem>.p-menuitem-content .p-menuitem-link{padding:1rem;-webkit-user-select:none;-moz-user-select:none;user-select:none}.p-menubar .p-menubar-root-list>.p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-text{color:hsla(0,0%,100%,.6)}.p-menubar .p-menubar-root-list>.p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-icon{color:hsla(0,0%,100%,.6);margin-right:.5rem}.p-menubar .p-menubar-root-list>.p-menuitem>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.6);margin-left:.5rem}.p-menubar .p-menubar-root-list>.p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover{background:transparent;color:hsla(0,0%,100%,.87)}.p-menubar .p-menubar-root-list>.p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-icon,.p-menubar .p-menubar-root-list>.p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-text,.p-menubar .p-menubar-root-list>.p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-menubar .p-menuitem>.p-menuitem-content{border-radius:0;color:hsla(0,0%,100%,.87);transition:box-shadow .15s}.p-menubar .p-menuitem>.p-menuitem-content .p-menuitem-link{color:hsla(0,0%,100%,.87);padding:.75rem 1rem;-webkit-user-select:none;-moz-user-select:none;user-select:none}.p-menubar .p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-text{color:hsla(0,0%,100%,.87)}.p-menubar .p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-icon{color:hsla(0,0%,100%,.6);margin-right:.5rem}.p-menubar .p-menuitem>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.6)}.p-menubar .p-menuitem.p-highlight>.p-menuitem-content{background:#20262e;color:hsla(0,0%,100%,.87)}.p-menubar .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-menuitem-icon,.p-menubar .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-menuitem-text,.p-menubar .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-menubar .p-menuitem.p-highlight.p-focus>.p-menuitem-content{background:#20262e}.p-menubar .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content{background:hsla(0,0%,100%,.12);color:hsla(0,0%,100%,.87)}.p-menubar .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-menuitem-icon,.p-menubar .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-menuitem-text,.p-menubar .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-menubar .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-menubar .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-icon,.p-menubar .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-text,.p-menubar .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-menubar .p-submenu-list{background:#2a323d;border:1px solid #3f4b5b;box-shadow:none;padding:.5rem 0;width:12.5rem}.p-menubar .p-submenu-list .p-menuitem-separator{border-top:1px solid #3f4b5b;margin:.5rem 0}.p-menubar .p-submenu-list .p-submenu-icon{font-size:.875rem}@media screen and (max-width:960px){.p-menubar{position:relative}.p-menubar .p-menubar-button{border-radius:50%;color:hsla(0,0%,100%,.6);display:flex;height:2rem;transition:color .15s,box-shadow .15s;width:2rem}.p-menubar .p-menubar-button:hover{background:transparent;color:hsla(0,0%,100%,.87)}.p-menubar .p-menubar-button:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-menubar .p-menubar-root-list{background:#2a323d;border:1px solid #3f4b5b;box-shadow:none;display:none;padding:.5rem 0;position:absolute;width:100%}.p-menubar .p-menubar-root-list .p-menuitem-separator{border-top:1px solid #3f4b5b;margin:.5rem 0}.p-menubar .p-menubar-root-list .p-submenu-icon{font-size:.875rem}.p-menubar .p-menubar-root-list .p-menuitem .p-menuitem-content .p-menuitem-link .p-submenu-icon{margin-left:auto;transition:transform .15s}.p-menubar .p-menubar-root-list .p-menuitem.p-menuitem-active>.p-menuitem-content>.p-menuitem-link>.p-submenu-icon{transform:rotate(-180deg)}.p-menubar .p-menubar-root-list .p-submenu-list{border:0;box-shadow:none;position:static;width:100%}.p-menubar .p-menubar-root-list .p-submenu-list .p-submenu-icon{transform:rotate(90deg);transition:transform .15s}.p-menubar .p-menubar-root-list .p-submenu-list .p-menuitem-active>.p-menuitem-content>.p-menuitem-link>.p-submenu-icon{transform:rotate(-90deg)}.p-menubar .p-menubar-root-list .p-menuitem{position:static;width:100%}.p-menubar .p-menubar-root-list .p-submenu-list .p-menuitem .p-menuitem-content .p-menuitem-link{padding-left:2.25rem}.p-menubar .p-menubar-root-list .p-submenu-list .p-menuitem .p-submenu-list .p-menuitem .p-menuitem-content .p-menuitem-link{padding-left:3.75rem}.p-menubar .p-menubar-root-list .p-submenu-list .p-menuitem .p-submenu-list .p-menuitem .p-submenu-list .p-menuitem .p-menuitem-content .p-menuitem-link{padding-left:5.25rem}.p-menubar .p-menubar-root-list .p-submenu-list .p-menuitem .p-submenu-list .p-menuitem .p-submenu-list .p-menuitem .p-submenu-list .p-menuitem .p-menuitem-content .p-menuitem-link{padding-left:6.75rem}.p-menubar .p-menubar-root-list .p-submenu-list .p-menuitem .p-submenu-list .p-menuitem .p-submenu-list .p-menuitem .p-submenu-list .p-menuitem .p-submenu-list .p-menuitem .p-menuitem-content .p-menuitem-link{padding-left:8.25rem}.p-menubar.p-menubar-mobile-active .p-menubar-root-list{display:flex;flex-direction:column;left:0;top:100%;z-index:1}}.p-panelmenu .p-panelmenu-header{outline:0 none}.p-panelmenu .p-panelmenu-header .p-panelmenu-header-content{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;color:hsla(0,0%,100%,.87);transition:box-shadow .15s}.p-panelmenu .p-panelmenu-header .p-panelmenu-header-content .p-panelmenu-header-action{color:hsla(0,0%,100%,.87);font-weight:600;padding:1rem 1.25rem}.p-panelmenu .p-panelmenu-header .p-panelmenu-header-content .p-panelmenu-header-action .p-menuitem-icon,.p-panelmenu .p-panelmenu-header .p-panelmenu-header-content .p-panelmenu-header-action .p-submenu-icon{margin-right:.5rem}.p-panelmenu .p-panelmenu-header:not(.p-disabled):focus .p-panelmenu-header-content{box-shadow:inset 0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-panelmenu .p-panelmenu-header:not(.p-highlight):not(.p-disabled):hover .p-panelmenu-header-content{background:hsla(0,0%,100%,.04);border-color:#3f4b5b;color:hsla(0,0%,100%,.87)}.p-panelmenu .p-panelmenu-header:not(.p-disabled).p-highlight .p-panelmenu-header-content{background:#2a323d;border-bottom-left-radius:0;border-bottom-right-radius:0;border-color:#3f4b5b;color:hsla(0,0%,100%,.87);margin-bottom:0}.p-panelmenu .p-panelmenu-header:not(.p-disabled).p-highlight:hover .p-panelmenu-header-content{background:hsla(0,0%,100%,.04);border-color:#3f4b5b;color:hsla(0,0%,100%,.87)}.p-panelmenu .p-panelmenu-content{background:#2a323d;border:1px solid #3f4b5b;border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-top:0;border-top-left-radius:0;border-top-right-radius:0;color:hsla(0,0%,100%,.87);padding:.5rem 0}.p-panelmenu .p-panelmenu-content .p-panelmenu-root-list{outline:0 none}.p-panelmenu .p-panelmenu-content .p-menuitem>.p-menuitem-content{border-radius:0;color:hsla(0,0%,100%,.87);transition:box-shadow .15s}.p-panelmenu .p-panelmenu-content .p-menuitem>.p-menuitem-content .p-menuitem-link{color:hsla(0,0%,100%,.87);padding:.75rem 1rem;-webkit-user-select:none;-moz-user-select:none;user-select:none}.p-panelmenu .p-panelmenu-content .p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-text{color:hsla(0,0%,100%,.87)}.p-panelmenu .p-panelmenu-content .p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-icon{color:hsla(0,0%,100%,.6);margin-right:.5rem}.p-panelmenu .p-panelmenu-content .p-menuitem>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.6)}.p-panelmenu .p-panelmenu-content .p-menuitem.p-highlight>.p-menuitem-content{background:#20262e;color:hsla(0,0%,100%,.87)}.p-panelmenu .p-panelmenu-content .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-menuitem-icon,.p-panelmenu .p-panelmenu-content .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-menuitem-text,.p-panelmenu .p-panelmenu-content .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-panelmenu .p-panelmenu-content .p-menuitem.p-highlight.p-focus>.p-menuitem-content{background:#20262e}.p-panelmenu .p-panelmenu-content .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content{background:hsla(0,0%,100%,.12);color:hsla(0,0%,100%,.87)}.p-panelmenu .p-panelmenu-content .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-menuitem-icon,.p-panelmenu .p-panelmenu-content .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-menuitem-text,.p-panelmenu .p-panelmenu-content .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-panelmenu .p-panelmenu-content .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-panelmenu .p-panelmenu-content .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-icon,.p-panelmenu .p-panelmenu-content .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-text,.p-panelmenu .p-panelmenu-content .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-panelmenu .p-panelmenu-content .p-menuitem .p-menuitem-content .p-menuitem-link .p-submenu-icon{margin-right:.5rem}.p-panelmenu .p-panelmenu-content .p-menuitem-separator{border-top:1px solid #3f4b5b;margin:.5rem 0}.p-panelmenu .p-panelmenu-content .p-submenu-list:not(.p-panelmenu-root-list){padding:0 0 0 1rem}.p-panelmenu .p-panelmenu-panel{margin-bottom:0}.p-panelmenu .p-panelmenu-panel .p-panelmenu-content,.p-panelmenu .p-panelmenu-panel .p-panelmenu-header .p-panelmenu-header-content{border-radius:0}.p-panelmenu .p-panelmenu-panel:not(:first-child) .p-panelmenu-header .p-panelmenu-header-content,.p-panelmenu .p-panelmenu-panel:not(:first-child) .p-panelmenu-header:not(.p-disabled).p-highlight:hover .p-panelmenu-header-content,.p-panelmenu .p-panelmenu-panel:not(:first-child) .p-panelmenu-header:not(.p-highlight):not(.p-disabled):hover .p-panelmenu-header-content{border-top:0}.p-panelmenu .p-panelmenu-panel:first-child .p-panelmenu-header .p-panelmenu-header-content{border-top-left-radius:4px;border-top-right-radius:4px}.p-panelmenu .p-panelmenu-panel:last-child .p-panelmenu-content,.p-panelmenu .p-panelmenu-panel:last-child .p-panelmenu-header:not(.p-highlight) .p-panelmenu-header-content{border-bottom-left-radius:4px;border-bottom-right-radius:4px}.p-steps .p-steps-item .p-menuitem-link{background:transparent;border-radius:4px;transition:box-shadow .15s}.p-steps .p-steps-item .p-menuitem-link .p-steps-number{background:transparent;border:1px solid #3f4b5b;border-radius:4px;color:hsla(0,0%,100%,.87);font-size:1.143rem;height:2rem;line-height:2rem;min-width:2rem;z-index:1}.p-steps .p-steps-item .p-menuitem-link .p-steps-title{color:hsla(0,0%,100%,.6);margin-top:.5rem}.p-steps .p-steps-item .p-menuitem-link:not(.p-disabled):focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-steps .p-steps-item.p-highlight .p-steps-number{background:#8dd0ff;color:#151515}.p-steps .p-steps-item.p-highlight .p-steps-title{color:hsla(0,0%,100%,.87);font-weight:600}.p-steps .p-steps-item:before{border-top:1px solid #3f4b5b;content:" ";display:block;left:0;margin-top:-1rem;position:absolute;top:50%;width:100%}.p-tabmenu .p-tabmenu-nav{background:transparent;border:solid #3f4b5b;border-width:0 0 1px}.p-tabmenu .p-tabmenu-nav .p-tabmenuitem{margin-right:0}.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link{background:#2a323d;border:solid;border-color:#2a323d #2a323d #3f4b5b;border-top-left-radius:4px;border-top-right-radius:4px;border-width:1px;color:hsla(0,0%,100%,.6);font-weight:600;margin:0 0 -1px;padding:.75rem 1rem;transition:box-shadow .15s}.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link .p-menuitem-icon{margin-right:.5rem}.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link:not(.p-disabled):focus{box-shadow:inset 0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-tabmenu .p-tabmenu-nav .p-tabmenuitem:not(.p-highlight):not(.p-disabled):hover .p-menuitem-link{background:#2a323d;border-color:#3f4b5b;color:hsla(0,0%,100%,.87)}.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link{background:#2a323d;border-color:#3f4b5b #3f4b5b #2a323d;color:hsla(0,0%,100%,.6)}.p-tieredmenu{background:#2a323d;border:1px solid #3f4b5b;border-radius:4px;color:hsla(0,0%,100%,.87);padding:.5rem 0;width:12.5rem}.p-tieredmenu.p-tieredmenu-overlay{background:#2a323d;border:1px solid #3f4b5b;box-shadow:none}.p-tieredmenu .p-tieredmenu-root-list{outline:0 none}.p-tieredmenu .p-submenu-list{background:#2a323d;border:1px solid #3f4b5b;box-shadow:none;padding:.5rem 0}.p-tieredmenu .p-menuitem>.p-menuitem-content{border-radius:0;color:hsla(0,0%,100%,.87);transition:box-shadow .15s}.p-tieredmenu .p-menuitem>.p-menuitem-content .p-menuitem-link{color:hsla(0,0%,100%,.87);padding:.75rem 1rem;-webkit-user-select:none;-moz-user-select:none;user-select:none}.p-tieredmenu .p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-text{color:hsla(0,0%,100%,.87)}.p-tieredmenu .p-menuitem>.p-menuitem-content .p-menuitem-link .p-menuitem-icon{color:hsla(0,0%,100%,.6);margin-right:.5rem}.p-tieredmenu .p-menuitem>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.6)}.p-tieredmenu .p-menuitem.p-highlight>.p-menuitem-content{background:#20262e;color:hsla(0,0%,100%,.87)}.p-tieredmenu .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-menuitem-icon,.p-tieredmenu .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-menuitem-text,.p-tieredmenu .p-menuitem.p-highlight>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-tieredmenu .p-menuitem.p-highlight.p-focus>.p-menuitem-content{background:#20262e}.p-tieredmenu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content{background:hsla(0,0%,100%,.12);color:hsla(0,0%,100%,.87)}.p-tieredmenu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-menuitem-icon,.p-tieredmenu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-menuitem-text,.p-tieredmenu .p-menuitem:not(.p-highlight):not(.p-disabled).p-focus>.p-menuitem-content .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-tieredmenu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-tieredmenu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-icon,.p-tieredmenu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-menuitem-text,.p-tieredmenu .p-menuitem:not(.p-highlight):not(.p-disabled)>.p-menuitem-content:hover .p-menuitem-link .p-submenu-icon{color:hsla(0,0%,100%,.87)}.p-tieredmenu .p-menuitem-separator{border-top:1px solid #3f4b5b;margin:.5rem 0}.p-tieredmenu .p-submenu-icon{font-size:.875rem}.p-tieredmenu .p-submenu-icon.p-icon{height:.875rem;width:.875rem}.p-inline-message{border-radius:4px;margin:0;padding:.5rem .75rem}.p-inline-message.p-inline-message-info{background:#cce5ff;border:0 solid #b8daff;color:#004085}.p-inline-message.p-inline-message-info .p-inline-message-icon{color:#004085}.p-inline-message.p-inline-message-success{background:#d4edda;border:0 solid #c3e6cb;color:#155724}.p-inline-message.p-inline-message-success .p-inline-message-icon{color:#155724}.p-inline-message.p-inline-message-warn{background:#fff3cd;border:0 solid #ffeeba;color:#856404}.p-inline-message.p-inline-message-warn .p-inline-message-icon{color:#856404}.p-inline-message.p-inline-message-error{background:#f8d7da;border:0 solid #f5c6cb;color:#721c24}.p-inline-message.p-inline-message-error .p-inline-message-icon{color:#721c24}.p-inline-message .p-inline-message-icon{font-size:1rem;margin-right:.5rem}.p-inline-message .p-inline-message-text{font-size:1rem}.p-inline-message.p-inline-message-icon-only .p-inline-message-icon{margin-right:0}.p-message{border-radius:4px;margin:1rem 0}.p-message .p-message-wrapper{padding:1rem 1.25rem}.p-message .p-message-close{background:transparent;border-radius:50%;height:2rem;transition:color .15s,box-shadow .15s;width:2rem}.p-message .p-message-close:hover{background:hsla(0,0%,100%,.3)}.p-message .p-message-close:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-message.p-message-info{background:#cce5ff;border:1px solid #b8daff;color:#004085}.p-message.p-message-info .p-message-close,.p-message.p-message-info .p-message-icon{color:#004085}.p-message.p-message-success{background:#d4edda;border:1px solid #c3e6cb;color:#155724}.p-message.p-message-success .p-message-close,.p-message.p-message-success .p-message-icon{color:#155724}.p-message.p-message-warn{background:#fff3cd;border:1px solid #ffeeba;color:#856404}.p-message.p-message-warn .p-message-close,.p-message.p-message-warn .p-message-icon{color:#856404}.p-message.p-message-error{background:#f8d7da;border:1px solid #f5c6cb;color:#721c24}.p-message.p-message-error .p-message-close,.p-message.p-message-error .p-message-icon{color:#721c24}.p-message .p-message-text{font-size:1rem;font-weight:500}.p-message .p-message-icon{font-size:1.5rem;margin-right:.5rem}.p-message .p-icon:not(.p-message-close-icon){height:1.5rem;width:1.5rem}.p-toast{opacity:1}.p-toast .p-toast-message{border-radius:4px;box-shadow:0 .25rem .75rem rgba(0,0,0,.1);margin:0 0 1rem}.p-toast .p-toast-message .p-toast-message-content{border-width:0;padding:1rem}.p-toast .p-toast-message .p-toast-message-content .p-toast-message-text{margin:0 0 0 1rem}.p-toast .p-toast-message .p-toast-message-content .p-toast-message-icon{font-size:2rem}.p-toast .p-toast-message .p-toast-message-content .p-toast-message-icon.p-icon{height:2rem;width:2rem}.p-toast .p-toast-message .p-toast-message-content .p-toast-summary{font-weight:700}.p-toast .p-toast-message .p-toast-message-content .p-toast-detail{margin:.5rem 0 0}.p-toast .p-toast-message .p-toast-icon-close{background:transparent;border-radius:50%;height:2rem;transition:color .15s,box-shadow .15s;width:2rem}.p-toast .p-toast-message .p-toast-icon-close:hover{background:hsla(0,0%,100%,.3)}.p-toast .p-toast-message .p-toast-icon-close:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-toast .p-toast-message.p-toast-message-info{background:#cce5ff;border:1px solid #b8daff;color:#004085}.p-toast .p-toast-message.p-toast-message-info .p-toast-icon-close,.p-toast .p-toast-message.p-toast-message-info .p-toast-message-icon{color:#004085}.p-toast .p-toast-message.p-toast-message-success{background:#d4edda;border:1px solid #c3e6cb;color:#155724}.p-toast .p-toast-message.p-toast-message-success .p-toast-icon-close,.p-toast .p-toast-message.p-toast-message-success .p-toast-message-icon{color:#155724}.p-toast .p-toast-message.p-toast-message-warn{background:#fff3cd;border:1px solid #ffeeba;color:#856404}.p-toast .p-toast-message.p-toast-message-warn .p-toast-icon-close,.p-toast .p-toast-message.p-toast-message-warn .p-toast-message-icon{color:#856404}.p-toast .p-toast-message.p-toast-message-error{background:#f8d7da;border:1px solid #f5c6cb;color:#721c24}.p-toast .p-toast-message.p-toast-message-error .p-toast-icon-close,.p-toast .p-toast-message.p-toast-message-error .p-toast-message-icon{color:#721c24}.p-galleria .p-galleria-close{background:transparent;border-radius:4px;color:hsla(0,0%,100%,.6);height:4rem;margin:.5rem;transition:color .15s,box-shadow .15s;width:4rem}.p-galleria .p-galleria-close .p-galleria-close-icon{font-size:2rem}.p-galleria .p-galleria-close .p-icon{height:2rem;width:2rem}.p-galleria .p-galleria-close:hover{background:hsla(0,0%,100%,.1);color:hsla(0,0%,100%,.87)}.p-galleria .p-galleria-item-nav{background:transparent;border-radius:4px;color:hsla(0,0%,100%,.6);height:4rem;margin:0 .5rem;transition:color .15s,box-shadow .15s;width:4rem}.p-galleria .p-galleria-item-nav .p-galleria-item-next-icon,.p-galleria .p-galleria-item-nav .p-galleria-item-prev-icon{font-size:2rem}.p-galleria .p-galleria-item-nav .p-icon{height:2rem;width:2rem}.p-galleria .p-galleria-item-nav:not(.p-disabled):hover{background:hsla(0,0%,100%,.1);color:hsla(0,0%,100%,.6)}.p-galleria .p-galleria-caption{background:rgba(0,0,0,.5);color:hsla(0,0%,100%,.6);padding:1rem}.p-galleria .p-galleria-indicators{padding:1rem}.p-galleria .p-galleria-indicators .p-galleria-indicator button{background-color:#7789a1;border-radius:4px;height:1rem;transition:color .15s,box-shadow .15s;width:1rem}.p-galleria .p-galleria-indicators .p-galleria-indicator button:hover{background:#687c97}.p-galleria .p-galleria-indicators .p-galleria-indicator.p-highlight button{background:#8dd0ff;color:#151515}.p-galleria.p-galleria-indicators-bottom .p-galleria-indicator,.p-galleria.p-galleria-indicators-top .p-galleria-indicator{margin-right:.5rem}.p-galleria.p-galleria-indicators-left .p-galleria-indicator,.p-galleria.p-galleria-indicators-right .p-galleria-indicator{margin-bottom:.5rem}.p-galleria.p-galleria-indicator-onitem .p-galleria-indicators{background:rgba(0,0,0,.5)}.p-galleria.p-galleria-indicator-onitem .p-galleria-indicators .p-galleria-indicator button{background:hsla(0,0%,100%,.4)}.p-galleria.p-galleria-indicator-onitem .p-galleria-indicators .p-galleria-indicator button:hover{background:hsla(0,0%,100%,.6)}.p-galleria.p-galleria-indicator-onitem .p-galleria-indicators .p-galleria-indicator.p-highlight button{background:#8dd0ff;color:#151515}.p-galleria .p-galleria-thumbnail-container{background:rgba(0,0,0,.9);padding:1rem .25rem}.p-galleria .p-galleria-thumbnail-container .p-galleria-thumbnail-next,.p-galleria .p-galleria-thumbnail-container .p-galleria-thumbnail-prev{background-color:transparent;border-radius:4px;color:hsla(0,0%,100%,.6);height:2rem;margin:.5rem;transition:color .15s,box-shadow .15s;width:2rem}.p-galleria .p-galleria-thumbnail-container .p-galleria-thumbnail-next:hover,.p-galleria .p-galleria-thumbnail-container .p-galleria-thumbnail-prev:hover{background:hsla(0,0%,100%,.1);color:hsla(0,0%,100%,.6)}.p-galleria .p-galleria-thumbnail-container .p-galleria-thumbnail-item-content:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-galleria-mask,.p-image-mask{--maskbg:rgba(0,0,0,.9)}.p-image-preview-indicator{background-color:transparent;color:#f8f9fa;transition:color .15s,box-shadow .15s}.p-image-preview-indicator .p-icon{height:1.5rem;width:1.5rem}.p-image-preview-container:hover>.p-image-preview-indicator{background-color:rgba(0,0,0,.5)}.p-image-toolbar{padding:1rem}.p-image-action.p-link{background-color:transparent;border-radius:50%;color:#f8f9fa;height:3rem;margin-right:.5rem;transition:color .15s,box-shadow .15s;width:3rem}.p-image-action.p-link:last-child{margin-right:0}.p-image-action.p-link:hover{background-color:hsla(0,0%,100%,.1);color:#f8f9fa}.p-image-action.p-link i{font-size:1.5rem}.p-image-action.p-link .p-icon{height:1.5rem;width:1.5rem}.p-avatar{background-color:#3f4b5b;border-radius:4px}.p-avatar.p-avatar-lg{font-size:1.5rem;height:3rem;width:3rem}.p-avatar.p-avatar-lg .p-avatar-icon{font-size:1.5rem}.p-avatar.p-avatar-xl{font-size:2rem;height:4rem;width:4rem}.p-avatar.p-avatar-xl .p-avatar-icon{font-size:2rem}.p-avatar-group .p-avatar{border:2px solid #2a323d}.p-badge{background:#8dd0ff;color:#151515;font-size:.75rem;font-weight:700;height:1.5rem;line-height:1.5rem;min-width:1.5rem}.p-badge.p-badge-secondary{background-color:#6c757d;color:#fff}.p-badge.p-badge-success{background-color:#9fdaa8;color:#151515}.p-badge.p-badge-info{background-color:#7fd8e6;color:#151515}.p-badge.p-badge-warning{background-color:#ffe082;color:#151515}.p-badge.p-badge-danger{background-color:#f19ea6;color:#151515}.p-badge.p-badge-lg{font-size:1.125rem;height:2.25rem;line-height:2.25rem;min-width:2.25rem}.p-badge.p-badge-xl{font-size:1.5rem;height:3rem;line-height:3rem;min-width:3rem}.p-chip{background-color:#3f4b5b;border-radius:16px;color:hsla(0,0%,100%,.87);padding:0 .75rem}.p-chip .p-chip-text{line-height:1.5;margin-bottom:.25rem;margin-top:.25rem}.p-chip .p-chip-icon,.p-chip img{margin-right:.5rem}.p-chip img{height:2rem;margin-left:-.75rem;width:2rem}.p-chip .p-chip-remove-icon{border-radius:4px;margin-left:.5rem;transition:color .15s,box-shadow .15s}.p-chip .p-chip-remove-icon:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-inplace .p-inplace-display{border-radius:4px;padding:.5rem .75rem;transition:background-color .15s,border-color .15s,box-shadow .15s}.p-inplace .p-inplace-display:not(.p-disabled):hover{background:hsla(0,0%,100%,.04);color:hsla(0,0%,100%,.87)}.p-inplace .p-inplace-display:focus{box-shadow:0 0 0 1px #e3f3fe;outline:0 none;outline-offset:0}.p-progressbar{background:#3f4b5b;border:0;border-radius:4px;height:1.5rem}.p-progressbar .p-progressbar-value{background:#8dd0ff;border:0;margin:0}.p-progressbar .p-progressbar-label{color:#151515;line-height:1.5rem}.p-progress-spinner-svg{animation:p-progress-spinner-rotate 2s linear infinite}.p-progress-spinner-circle{stroke-dasharray:89,200;stroke-dashoffset:0;stroke:#721c24;stroke-linecap:round;animation:p-progress-spinner-dash 1.5s ease-in-out infinite,p-progress-spinner-color 6s ease-in-out infinite}@keyframes p-progress-spinner-rotate{to{transform:rotate(1turn)}}@keyframes p-progress-spinner-dash{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:89,200;stroke-dashoffset:-35px}to{stroke-dasharray:89,200;stroke-dashoffset:-124px}}@keyframes p-progress-spinner-color{0%,to{stroke:#721c24}40%{stroke:#004085}66%{stroke:#155724}80%,90%{stroke:#856404}}.p-scrolltop{border-radius:4px;box-shadow:none;height:3rem;transition:color .15s,box-shadow .15s;width:3rem}.p-scrolltop.p-link{background:#8dd0ff}.p-scrolltop.p-link:hover{background:#56bdff}.p-scrolltop .p-scrolltop-icon{color:#151515;font-size:1.5rem}.p-scrolltop .p-scrolltop-icon.p-icon{height:1.5rem;width:1.5rem}.p-skeleton{background-color:hsla(0,0%,100%,.06);border-radius:4px}.p-skeleton:after{background:linear-gradient(90deg,hsla(0,0%,100%,0),hsla(0,0%,100%,.04),hsla(0,0%,100%,0))}.p-tag{background:#8dd0ff;border-radius:4px;color:#151515;font-size:.75rem;font-weight:700;padding:.25rem .4rem}.p-tag.p-tag-success{background-color:#9fdaa8;color:#151515}.p-tag.p-tag-info{background-color:#7fd8e6;color:#151515}.p-tag.p-tag-warning{background-color:#ffe082;color:#151515}.p-tag.p-tag-danger{background-color:#f19ea6;color:#151515}.p-tag .p-tag-icon{font-size:.75rem;margin-right:.25rem}.p-tag .p-tag-icon.p-icon{height:.75rem;width:.75rem}.p-terminal{background:#2a323d;border:1px solid #3f4b5b;color:hsla(0,0%,100%,.87);padding:1.25rem}.p-terminal .p-terminal-input{font-size:1rem}.p-breadcrumb .p-breadcrumb-chevron,.p-terminal .p-terminal-input{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.p-breadcrumb .p-breadcrumb-chevron:before{content:"/"}.fc.fc-theme-standard .fc-highlight{background:#476880}';
const primevue = "";
const primeicons = "@font-face{font-display:block;font-family:primeicons;font-style:normal;font-weight:400;src:url(" + __buildAssetsURL("primeicons.ce852338.eot") + ");src:url(" + __buildAssetsURL("primeicons.ce852338.eot?#iefix") + ') format("embedded-opentype"),url(' + __buildAssetsURL("primeicons.3824be50.woff2") + ') format("woff2"),url(' + __buildAssetsURL("primeicons.90a58d3a.woff") + ') format("woff"),url(' + __buildAssetsURL("primeicons.131bc3bf.ttf") + ') format("truetype"),url(' + __buildAssetsURL("primeicons.5e10f102.svg?#primeicons") + ') format("svg")}.pi{speak:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;display:inline-block;font-family:primeicons;font-style:normal;font-variant:normal;font-weight:400;line-height:1;text-transform:none}.pi:before{--webkit-backface-visibility:hidden;backface-visibility:hidden}.pi-fw{text-align:center;width:1.28571429em}.pi-spin{animation:fa-spin 2s linear infinite}@keyframes fa-spin{0%{transform:rotate(0deg)}to{transform:rotate(359deg)}}.pi-eraser:before{content:"\\ea04"}.pi-stopwatch:before{content:"\\ea01"}.pi-verified:before{content:"\\ea02"}.pi-delete-left:before{content:"\\ea03"}.pi-hourglass:before{content:"\\e9fe"}.pi-truck:before{content:"\\ea00"}.pi-wrench:before{content:"\\e9ff"}.pi-microphone:before{content:"\\e9fa"}.pi-megaphone:before{content:"\\e9fb"}.pi-arrow-right-arrow-left:before{content:"\\e9fc"}.pi-bitcoin:before{content:"\\e9fd"}.pi-file-edit:before{content:"\\e9f6"}.pi-language:before{content:"\\e9f7"}.pi-file-export:before{content:"\\e9f8"}.pi-file-import:before{content:"\\e9f9"}.pi-file-word:before{content:"\\e9f1"}.pi-gift:before{content:"\\e9f2"}.pi-cart-plus:before{content:"\\e9f3"}.pi-thumbs-down-fill:before{content:"\\e9f4"}.pi-thumbs-up-fill:before{content:"\\e9f5"}.pi-arrows-alt:before{content:"\\e9f0"}.pi-calculator:before{content:"\\e9ef"}.pi-sort-alt-slash:before{content:"\\e9ee"}.pi-arrows-h:before{content:"\\e9ec"}.pi-arrows-v:before{content:"\\e9ed"}.pi-pound:before{content:"\\e9eb"}.pi-prime:before{content:"\\e9ea"}.pi-chart-pie:before{content:"\\e9e9"}.pi-reddit:before{content:"\\e9e8"}.pi-code:before{content:"\\e9e7"}.pi-sync:before{content:"\\e9e6"}.pi-shopping-bag:before{content:"\\e9e5"}.pi-server:before{content:"\\e9e4"}.pi-database:before{content:"\\e9e3"}.pi-hashtag:before{content:"\\e9e2"}.pi-bookmark-fill:before{content:"\\e9df"}.pi-filter-fill:before{content:"\\e9e0"}.pi-heart-fill:before{content:"\\e9e1"}.pi-flag-fill:before{content:"\\e9de"}.pi-circle:before{content:"\\e9dc"}.pi-circle-fill:before{content:"\\e9dd"}.pi-bolt:before{content:"\\e9db"}.pi-history:before{content:"\\e9da"}.pi-box:before{content:"\\e9d9"}.pi-at:before{content:"\\e9d8"}.pi-arrow-up-right:before{content:"\\e9d4"}.pi-arrow-up-left:before{content:"\\e9d5"}.pi-arrow-down-left:before{content:"\\e9d6"}.pi-arrow-down-right:before{content:"\\e9d7"}.pi-telegram:before{content:"\\e9d3"}.pi-stop-circle:before{content:"\\e9d2"}.pi-stop:before{content:"\\e9d1"}.pi-whatsapp:before{content:"\\e9d0"}.pi-building:before{content:"\\e9cf"}.pi-qrcode:before{content:"\\e9ce"}.pi-car:before{content:"\\e9cd"}.pi-instagram:before{content:"\\e9cc"}.pi-linkedin:before{content:"\\e9cb"}.pi-send:before{content:"\\e9ca"}.pi-slack:before{content:"\\e9c9"}.pi-sun:before{content:"\\e9c8"}.pi-moon:before{content:"\\e9c7"}.pi-vimeo:before{content:"\\e9c6"}.pi-youtube:before{content:"\\e9c5"}.pi-flag:before{content:"\\e9c4"}.pi-wallet:before{content:"\\e9c3"}.pi-map:before{content:"\\e9c2"}.pi-link:before{content:"\\e9c1"}.pi-credit-card:before{content:"\\e9bf"}.pi-discord:before{content:"\\e9c0"}.pi-percentage:before{content:"\\e9be"}.pi-euro:before{content:"\\e9bd"}.pi-book:before{content:"\\e9ba"}.pi-shield:before{content:"\\e9b9"}.pi-paypal:before{content:"\\e9bb"}.pi-amazon:before{content:"\\e9bc"}.pi-phone:before{content:"\\e9b8"}.pi-filter-slash:before{content:"\\e9b7"}.pi-facebook:before{content:"\\e9b4"}.pi-github:before{content:"\\e9b5"}.pi-twitter:before{content:"\\e9b6"}.pi-step-backward-alt:before{content:"\\e9ac"}.pi-step-forward-alt:before{content:"\\e9ad"}.pi-forward:before{content:"\\e9ae"}.pi-backward:before{content:"\\e9af"}.pi-fast-backward:before{content:"\\e9b0"}.pi-fast-forward:before{content:"\\e9b1"}.pi-pause:before{content:"\\e9b2"}.pi-play:before{content:"\\e9b3"}.pi-compass:before{content:"\\e9ab"}.pi-id-card:before{content:"\\e9aa"}.pi-ticket:before{content:"\\e9a9"}.pi-file-o:before{content:"\\e9a8"}.pi-reply:before{content:"\\e9a7"}.pi-directions-alt:before{content:"\\e9a5"}.pi-directions:before{content:"\\e9a6"}.pi-thumbs-up:before{content:"\\e9a3"}.pi-thumbs-down:before{content:"\\e9a4"}.pi-sort-numeric-down-alt:before{content:"\\e996"}.pi-sort-numeric-up-alt:before{content:"\\e997"}.pi-sort-alpha-down-alt:before{content:"\\e998"}.pi-sort-alpha-up-alt:before{content:"\\e999"}.pi-sort-numeric-down:before{content:"\\e99a"}.pi-sort-numeric-up:before{content:"\\e99b"}.pi-sort-alpha-down:before{content:"\\e99c"}.pi-sort-alpha-up:before{content:"\\e99d"}.pi-sort-alt:before{content:"\\e99e"}.pi-sort-amount-up:before{content:"\\e99f"}.pi-sort-amount-down:before{content:"\\e9a0"}.pi-sort-amount-down-alt:before{content:"\\e9a1"}.pi-sort-amount-up-alt:before{content:"\\e9a2"}.pi-palette:before{content:"\\e995"}.pi-undo:before{content:"\\e994"}.pi-desktop:before{content:"\\e993"}.pi-sliders-v:before{content:"\\e991"}.pi-sliders-h:before{content:"\\e992"}.pi-search-plus:before{content:"\\e98f"}.pi-search-minus:before{content:"\\e990"}.pi-file-excel:before{content:"\\e98e"}.pi-file-pdf:before{content:"\\e98d"}.pi-check-square:before{content:"\\e98c"}.pi-chart-line:before{content:"\\e98b"}.pi-user-edit:before{content:"\\e98a"}.pi-exclamation-circle:before{content:"\\e989"}.pi-android:before{content:"\\e985"}.pi-google:before{content:"\\e986"}.pi-apple:before{content:"\\e987"}.pi-microsoft:before{content:"\\e988"}.pi-heart:before{content:"\\e984"}.pi-mobile:before{content:"\\e982"}.pi-tablet:before{content:"\\e983"}.pi-key:before{content:"\\e981"}.pi-shopping-cart:before{content:"\\e980"}.pi-comments:before{content:"\\e97e"}.pi-comment:before{content:"\\e97f"}.pi-briefcase:before{content:"\\e97d"}.pi-bell:before{content:"\\e97c"}.pi-paperclip:before{content:"\\e97b"}.pi-share-alt:before{content:"\\e97a"}.pi-envelope:before{content:"\\e979"}.pi-volume-down:before{content:"\\e976"}.pi-volume-up:before{content:"\\e977"}.pi-volume-off:before{content:"\\e978"}.pi-eject:before{content:"\\e975"}.pi-money-bill:before{content:"\\e974"}.pi-images:before{content:"\\e973"}.pi-image:before{content:"\\e972"}.pi-sign-in:before{content:"\\e970"}.pi-sign-out:before{content:"\\e971"}.pi-wifi:before{content:"\\e96f"}.pi-sitemap:before{content:"\\e96e"}.pi-chart-bar:before{content:"\\e96d"}.pi-camera:before{content:"\\e96c"}.pi-dollar:before{content:"\\e96b"}.pi-lock-open:before{content:"\\e96a"}.pi-table:before{content:"\\e969"}.pi-map-marker:before{content:"\\e968"}.pi-list:before{content:"\\e967"}.pi-eye-slash:before{content:"\\e965"}.pi-eye:before{content:"\\e966"}.pi-folder-open:before{content:"\\e964"}.pi-folder:before{content:"\\e963"}.pi-video:before{content:"\\e962"}.pi-inbox:before{content:"\\e961"}.pi-lock:before{content:"\\e95f"}.pi-unlock:before{content:"\\e960"}.pi-tags:before{content:"\\e95d"}.pi-tag:before{content:"\\e95e"}.pi-power-off:before{content:"\\e95c"}.pi-save:before{content:"\\e95b"}.pi-question-circle:before{content:"\\e959"}.pi-question:before{content:"\\e95a"}.pi-copy:before{content:"\\e957"}.pi-file:before{content:"\\e958"}.pi-clone:before{content:"\\e955"}.pi-calendar-times:before{content:"\\e952"}.pi-calendar-minus:before{content:"\\e953"}.pi-calendar-plus:before{content:"\\e954"}.pi-ellipsis-v:before{content:"\\e950"}.pi-ellipsis-h:before{content:"\\e951"}.pi-bookmark:before{content:"\\e94e"}.pi-globe:before{content:"\\e94f"}.pi-replay:before{content:"\\e94d"}.pi-filter:before{content:"\\e94c"}.pi-print:before{content:"\\e94b"}.pi-align-right:before{content:"\\e946"}.pi-align-left:before{content:"\\e947"}.pi-align-center:before{content:"\\e948"}.pi-align-justify:before{content:"\\e949"}.pi-cog:before{content:"\\e94a"}.pi-cloud-download:before{content:"\\e943"}.pi-cloud-upload:before{content:"\\e944"}.pi-cloud:before{content:"\\e945"}.pi-pencil:before{content:"\\e942"}.pi-users:before{content:"\\e941"}.pi-clock:before{content:"\\e940"}.pi-user-minus:before{content:"\\e93e"}.pi-user-plus:before{content:"\\e93f"}.pi-trash:before{content:"\\e93d"}.pi-external-link:before{content:"\\e93c"}.pi-window-maximize:before{content:"\\e93b"}.pi-window-minimize:before{content:"\\e93a"}.pi-refresh:before{content:"\\e938"}.pi-user:before{content:"\\e939"}.pi-exclamation-triangle:before{content:"\\e922"}.pi-calendar:before{content:"\\e927"}.pi-chevron-circle-left:before{content:"\\e928"}.pi-chevron-circle-down:before{content:"\\e929"}.pi-chevron-circle-right:before{content:"\\e92a"}.pi-chevron-circle-up:before{content:"\\e92b"}.pi-angle-double-down:before{content:"\\e92c"}.pi-angle-double-left:before{content:"\\e92d"}.pi-angle-double-right:before{content:"\\e92e"}.pi-angle-double-up:before{content:"\\e92f"}.pi-angle-down:before{content:"\\e930"}.pi-angle-left:before{content:"\\e931"}.pi-angle-right:before{content:"\\e932"}.pi-angle-up:before{content:"\\e933"}.pi-upload:before{content:"\\e934"}.pi-download:before{content:"\\e956"}.pi-ban:before{content:"\\e935"}.pi-star-fill:before{content:"\\e936"}.pi-star:before{content:"\\e937"}.pi-chevron-left:before{content:"\\e900"}.pi-chevron-right:before{content:"\\e901"}.pi-chevron-down:before{content:"\\e902"}.pi-chevron-up:before{content:"\\e903"}.pi-caret-left:before{content:"\\e904"}.pi-caret-right:before{content:"\\e905"}.pi-caret-down:before{content:"\\e906"}.pi-caret-up:before{content:"\\e907"}.pi-search:before{content:"\\e908"}.pi-check:before{content:"\\e909"}.pi-check-circle:before{content:"\\e90a"}.pi-times:before{content:"\\e90b"}.pi-times-circle:before{content:"\\e90c"}.pi-plus:before{content:"\\e90d"}.pi-plus-circle:before{content:"\\e90e"}.pi-minus:before{content:"\\e90f"}.pi-minus-circle:before{content:"\\e910"}.pi-circle-on:before{content:"\\e911"}.pi-circle-off:before{content:"\\e912"}.pi-sort-down:before{content:"\\e913"}.pi-sort-up:before{content:"\\e914"}.pi-sort:before{content:"\\e915"}.pi-step-backward:before{content:"\\e916"}.pi-step-forward:before{content:"\\e917"}.pi-th-large:before{content:"\\e918"}.pi-arrow-down:before{content:"\\e919"}.pi-arrow-left:before{content:"\\e91a"}.pi-arrow-right:before{content:"\\e91b"}.pi-arrow-up:before{content:"\\e91c"}.pi-bars:before{content:"\\e91d"}.pi-arrow-circle-down:before{content:"\\e91e"}.pi-arrow-circle-left:before{content:"\\e91f"}.pi-arrow-circle-right:before{content:"\\e920"}.pi-arrow-circle-up:before{content:"\\e921"}.pi-info:before{content:"\\e923"}.pi-info-circle:before{content:"\\e924"}.pi-home:before{content:"\\e925"}.pi-spinner:before{content:"\\e926"}';
const style = ':root{--bg-gradient-onyx:linear-gradient(to bottom right,#3f3f40 3%,#303030 97%);--bg-gradient-jet:linear-gradient(to bottom right,rgba(45,45,46,.251),rgba(27,27,29,0)),#202022;--bg-gradient-yellow-1:linear-gradient(to bottom right,#ffda6b,rgba(255,192,97,0) 50%);--bg-gradient-yellow-2:linear-gradient(135deg,rgba(255,218,107,.251),rgba(255,187,92,0) 59.86%),#202022;--border-gradient-onyx:linear-gradient(to bottom right,#404040,rgba(64,64,64,0) 50%);--text-gradient-yellow:linear-gradient(90deg,#ffdb70,#ffbb5c);--jet:#383838;--onyx:#22262a;--eerie-black-1:#202022;--eerie-black-2:#1e1e1f;--smoky-black:#121212;--white-1:#fff;--white-2:#fafafa;--orange-yellow-crayola:#ffdb70;--vegas-gold:#f39c12;--light-gray:#d6d6d6;--light-gray-70:hsla(0,0%,84%,.7);--bittersweet-shimmer:#b84c4c;--text-gradient-yellow:#f39c12;--ff-poppins:"Poppins",sans-serif;--fs-1:24px;--fs-2:18px;--fs-3:17px;--fs-4:16px;--fs-5:15px;--fs-6:14px;--fs-7:13px;--fs-8:11px;--fw-300:300;--fw-400:400;--fw-500:500;--fw-600:600;--shadow-1:-4px 8px 24px rgba(0,0,0,.25);--shadow-2:0 16px 30px rgba(0,0,0,.25);--shadow-3:0 16px 40px rgba(0,0,0,.25);--shadow-4:0 25px 50px rgba(0,0,0,.15);--shadow-5:0 24px 80px rgba(0,0,0,.25);--transition-1:0.25s ease;--transition-2:0.5s ease-in-out}*,:after,:before{box-sizing:border-box;margin:0;padding:0}a{text-decoration:none}li{list-style:none}Icon,a,button,icon,img,ion-icon,span,time{display:block}button{border:none;cursor:pointer;text-align:left}button,input,textarea{background:none;font:inherit}input,textarea{display:block;width:100%}::-moz-selection{background:#f39c12;background:var(--vegas-gold);color:#121212;color:var(--smoky-black)}::selection{background:#f39c12;background:var(--vegas-gold);color:#121212;color:var(--smoky-black)}:focus{outline-color:#f39c12;outline-color:var(--vegas-gold)}html{font-family:Poppins,sans-serif;font-family:var(--ff-poppins)}body{background:#121212;background:var(--smoky-black)}.sidebar,article{background:#1e1e1f;background:var(--eerie-black-2);border:1px solid #383838;border:1px solid var(--jet);border-radius:20px;box-shadow:-4px 8px 24px rgba(0,0,0,.25);box-shadow:var(--shadow-1);padding:15px;z-index:1}.separator{background:#383838;background:var(--jet);height:1px;margin:16px 0;width:100%}.icon-box{align-items:center;background:linear-gradient(to bottom right,#404040,rgba(64,64,64,0) 50%);background:var(--border-gradient-onyx);border-radius:8px;box-shadow:-4px 8px 24px rgba(0,0,0,.25);box-shadow:var(--shadow-1);color:#f39c12;color:var(--vegas-gold);display:flex;font-size:16px;height:30px;justify-content:center;position:relative;width:30px;z-index:1}.icon-box:before{background:#202022;background:var(--eerie-black-1);border-radius:inherit;content:"";inset:1px;position:absolute;z-index:-1}.icon-box ion-icon{--ionicon-stroke-width:35px}article{display:none}article.active{animation:fade .5s ease backwards;display:block}@keyframes fade{0%{opacity:0}to{opacity:1}}.h2,.h3,.h4,.h5{color:#fafafa;color:var(--white-2);text-transform:capitalize}.h2{font-size:24px;font-size:var(--fs-1)}.h3{font-size:18px;font-size:var(--fs-2)}.h4{font-size:16px;font-size:var(--fs-4)}.h5{font-size:13px;font-size:var(--fs-7);font-weight:500;font-weight:var(--fw-500)}.article-title{padding-bottom:7px;position:relative}.article-title:after{background:#f39c12;background:var(--text-gradient-yellow);border-radius:3px;bottom:0;content:"";height:3px;left:0;position:absolute;width:30px}.has-scrollbar::-webkit-scrollbar{height:5px;width:5px}.has-scrollbar::-webkit-scrollbar-track{background:#22262a;background:var(--onyx);border-radius:5px}.has-scrollbar::-webkit-scrollbar-thumb{background:#f39c12;background:var(--vegas-gold);border-radius:5px}.has-scrollbar::-webkit-scrollbar-button{width:20px}.content-card{background:linear-gradient(to bottom right,#404040,rgba(64,64,64,0) 50%);background:var(--border-gradient-onyx);border-radius:14px;box-shadow:0 16px 30px rgba(0,0,0,.25);box-shadow:var(--shadow-2);cursor:pointer;padding:45px 15px 15px;position:relative;z-index:1}.content-card:before{background:linear-gradient(to bottom right,rgba(45,45,46,.251),rgba(27,27,29,0)),#202022;background:var(--bg-gradient-jet);border-radius:inherit;content:"";inset:1px;position:absolute;z-index:-1}main{margin:15px 12px 75px;min-width:259px}.sidebar{margin-bottom:15px;max-height:112px;overflow:hidden;transition:.5s ease-in-out;transition:var(--transition-2)}.sidebar.active{max-height:405px}.sidebar-info{align-items:center;display:flex;gap:15px;justify-content:flex-start;position:relative}.avatar-box{background:linear-gradient(to bottom right,#3f3f40 3%,#303030 97%);background:var(--bg-gradient-onyx);border-radius:20px}.info-content .name{color:#fafafa;color:var(--white-2);font-size:17px;font-size:var(--fs-3);font-weight:500;font-weight:var(--fw-500);letter-spacing:-.25px;margin-bottom:10px}.info-content .title{background:#22262a;background:var(--onyx);border-radius:8px;color:#fff;color:var(--white-1);font-size:11px;font-size:var(--fs-8);font-weight:300;font-weight:var(--fw-300);padding:3px 12px;width:-moz-max-content;width:max-content}.info_more-btn{background:linear-gradient(to bottom right,#404040,rgba(64,64,64,0) 50%);background:var(--border-gradient-onyx);border-radius:0 15px;box-shadow:0 16px 30px rgba(0,0,0,.25);box-shadow:var(--shadow-2);color:#f39c12;color:var(--vegas-gold);font-size:13px;padding:10px;right:-15px;top:-15px;z-index:1}.info_more-btn,.info_more-btn:before{position:absolute;transition:.25s ease;transition:var(--transition-1)}.info_more-btn:before{background:linear-gradient(to bottom right,rgba(45,45,46,.251),rgba(27,27,29,0)),#202022;background:var(--bg-gradient-jet);border-radius:inherit;content:"";inset:1px;z-index:-1}.info_more-btn:focus,.info_more-btn:hover{background:linear-gradient(to bottom right,#ffda6b,rgba(255,192,97,0) 50%);background:var(--bg-gradient-yellow-1)}.info_more-btn:focus:before,.info_more-btn:hover:before{background:linear-gradient(135deg,rgba(255,218,107,.251),rgba(255,187,92,0) 59.86%),#202022;background:var(--bg-gradient-yellow-2)}.info_more-btn span{display:none}.sidebar-info_more{opacity:0;transition:.5s ease-in-out;transition:var(--transition-2);visibility:hidden}.sidebar.active .sidebar-info_more{opacity:1;visibility:visible}.contacts-list{display:grid;gap:16px;grid-template-columns:1fr}.contact-item{align-items:center;display:flex;gap:16px;min-width:100%}.contact-info{max-width:calc(100% - 46px);width:calc(100% - 46px)}.contact-title{color:hsla(0,0%,84%,.7);color:var(--light-gray-70);font-size:11px;font-size:var(--fs-8);margin-bottom:2px;text-transform:uppercase}.contact-info :is(.contact-link,time,address){color:#fafafa;color:var(--white-2);font-size:13px;font-size:var(--fs-7)}.contact-info address{font-style:normal}.social-list{align-items:center;display:flex;gap:15px;justify-content:flex-start;padding-bottom:4px;padding-left:7px}.social-item .social-link{color:hsla(0,0%,84%,.7);color:var(--light-gray-70);font-size:18px}.social-item .social-link:hover{color:#d6d6d6;color:var(--light-gray)}.navbar{-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);background:rgba(43,43,44,.75);border:1px solid #383838;border:1px solid var(--jet);border-radius:12px 12px 0 0;bottom:0;box-shadow:0 16px 30px rgba(0,0,0,.25);box-shadow:var(--shadow-2);left:0;position:fixed;width:100%;z-index:5}.navbar-list{align-items:center;display:flex;flex-wrap:wrap;justify-content:center;padding:0 10px}.navbar-link{color:#d6d6d6;color:var(--light-gray);font-size:11px;font-size:var(--fs-8);padding:20px 7px;transition:color .25s ease;transition:color var(--transition-1)}.navbar-link:focus,.navbar-link:hover{color:hsla(0,0%,84%,.7);color:var(--light-gray-70)}.navbar-link.active{color:#f39c12;color:var(--vegas-gold)}.about .article-title{margin-bottom:15px}.about-text{color:#d6d6d6;color:var(--light-gray);font-size:14px;font-size:var(--fs-6);font-weight:300;font-weight:var(--fw-300);line-height:1.6}.about-text p{margin-bottom:15px}.service{margin-bottom:35px}.service-title{font-weight:600;font-weight:var(--fw-600);margin-bottom:20px}.service-list{display:grid;gap:20px;grid-template-columns:1fr}.service-item{background:linear-gradient(to bottom right,#404040,rgba(64,64,64,0) 50%);background:var(--border-gradient-onyx);border-radius:14px;box-shadow:0 16px 30px rgba(0,0,0,.25);box-shadow:var(--shadow-2);padding:20px;position:relative;z-index:1}.service-item:before{background:linear-gradient(to bottom right,rgba(45,45,46,.251),rgba(27,27,29,0)),#202022;background:var(--bg-gradient-jet);border-radius:inherit;content:"";inset:1px;position:absolute;z-index:-1}.service-icon-box{margin-bottom:10px}.service-icon-box img{margin:auto;width:60px}.service-content-box{text-align:center}.service-item-title{font-weight:600;font-weight:var(--fw-600);margin-bottom:7px}.service-item-text{color:#d6d6d6;color:var(--light-gray);font-size:14px;font-size:var(--fs-6);font-weight:var(--fw-3);line-height:1.6}.testimonials{margin-bottom:30px}.testimonials-title{margin-bottom:20px}.testimonials-list{align-items:flex-start;display:flex;gap:15px;justify-content:flex-start;margin:0 -15px;overflow-x:auto;overscroll-behavior-inline:contain;padding:25px 15px 35px;scroll-behavior:smooth;scroll-snap-type:inline mandatory}.testimonials-item{min-width:100%;scroll-snap-align:center}.testimonials-avatar-box{background:linear-gradient(to bottom right,#3f3f40 3%,#303030 97%);background:var(--bg-gradient-onyx);border-radius:14px;box-shadow:-4px 8px 24px rgba(0,0,0,.25);box-shadow:var(--shadow-1);left:0;position:absolute;top:0;transform:translate(15px,-25px)}.testimonials-item-title{margin-bottom:7px}.testimonials-text{line-clamp:4;-webkit-line-clamp:4;-webkit-box-orient:vertical;color:#d6d6d6;color:var(--light-gray);display:-webkit-box;font-size:14px;font-size:var(--fs-6);font-weight:300;font-weight:var(--fw-300);line-height:1.6;overflow:hidden}.modal-container{align-items:center;display:flex;height:100%;justify-content:center;left:0;overflow-y:auto;overscroll-behavior:contain;pointer-events:none;position:fixed;top:0;visibility:hidden;width:100%;z-index:20}.modal-container::-webkit-scrollbar{display:none}.modal-container.active{pointer-events:all;visibility:visible}.overlay{background:#0d0d0d;height:100vh;left:0;opacity:0;pointer-events:none;position:fixed;top:0;transition:.25s ease;transition:var(--transition-1);visibility:hidden;width:100%;z-index:1}.overlay.active{opacity:.8;pointer-events:all;visibility:visible}.testimonials-modal{background:#1e1e1f;background:var(--eerie-black-2);border:1px solid #383838;border:1px solid var(--jet);border-radius:14px;box-shadow:0 24px 80px rgba(0,0,0,.25);box-shadow:var(--shadow-5);margin:auto 12px;opacity:0;padding:15px;position:relative;transform:scale(1.2);transition:.25s ease;transition:var(--transition-1);z-index:2}.modal-container.active .testimonials-modal{opacity:1;transform:scale(1)}.modal-close-btn{align-items:center;background:#22262a;background:var(--onyx);border-radius:8px;color:#fafafa;color:var(--white-2);display:flex;font-size:18px;height:32px;justify-content:center;opacity:.7;position:absolute;right:15px;top:15px;width:32px}.modal-close-btn:focus,.modal-close-btn:hover{opacity:1}.modal-close-btn ion-icon{--ionicon-stroke-width:50px}.modal-avatar-box{background:linear-gradient(to bottom right,#3f3f40 3%,#303030 97%);background:var(--bg-gradient-onyx);border-radius:14px;box-shadow:0 16px 30px rgba(0,0,0,.25);box-shadow:var(--shadow-2);margin-bottom:15px;width:-moz-max-content;width:max-content}.modal-img-wrapper>img{display:none}.modal-title{margin-bottom:4px}.modal-content time{color:hsla(0,0%,84%,.7);color:var(--light-gray-70);margin-bottom:10px}.modal-content p,.modal-content time{font-size:14px;font-size:var(--fs-6);font-weight:300;font-weight:var(--fw-300)}.modal-content p{color:#d6d6d6;color:var(--light-gray);line-height:1.6}.clients{margin-bottom:15px}.clients-list{align-items:flex-start;display:flex;gap:15px;justify-content:flex-start;margin:0 -15px;overflow-x:auto;overscroll-behavior-inline:contain;padding:25px;scroll-behavior:smooth;scroll-padding-inline:25px;scroll-snap-type:inline mandatory}.clients-item{min-width:50%;scroll-snap-align:start}.clients-item img{filter:grayscale(1);transition:.25s ease;transition:var(--transition-1);width:100%}.clients-item img:hover{filter:grayscale(0)}.article-title,.timeline{margin-bottom:30px}.timeline .title-wrapper{align-items:center;display:flex;gap:15px;margin-bottom:25px}.timeline-list{font-size:14px;font-size:var(--fs-6);margin-left:45px}.timeline-title{font-weight:600;font-weight:var(--fw-600)}.timeline-item{position:relative}.timeline-item:not(:last-child){margin-bottom:20px}.timeline-item-title{font-size:14px;font-size:var(--fs-6);font-weight:600;font-weight:var(--fw-600);line-height:1.3;margin-bottom:7px}.timeline-item-desc{color:#868686;font-size:var(--fs-10);line-height:1.3;margin-bottom:7px}.timeline-list span{color:#f39c12;color:var(--vegas-gold);font-weight:400;font-weight:var(--fw-400);line-height:1.6}.timeline-item:not(:last-child):before{background:#383838;background:var(--jet);content:"";height:calc(100% + 50px);left:-30px;position:absolute;top:-25px;width:1px}.timeline-item:after{background:#f39c12;background:var(--text-gradient-yellow);border-radius:50%;box-shadow:0 0 0 4px #383838;box-shadow:0 0 0 4px var(--jet);content:"";height:6px;left:-33px;position:absolute;top:5px;width:6px}.timeline-text{color:#d6d6d6;color:var(--light-gray);font-weight:300;font-weight:var(--fw-300);line-height:1.6}.skills-title{margin-bottom:20px}.skills-list{padding:20px}.skills-item:not(:last-child){margin-bottom:15px}.skill .title-wrapper{align-items:center;display:flex;gap:5px;margin-bottom:8px}.skill .title-wrapper data{color:#d6d6d6;color:var(--light-gray);font-size:13px;font-size:var(--fs-7);font-weight:300;font-weight:var(--fw-300)}.skill-progress-bg{background:#383838;background:var(--jet);border-radius:10px;height:8px;width:100%}.skill-progress-fill{background:#f39c12;background:var(--text-gradient-yellow);border-radius:inherit;height:100%}.filter-list{display:none}.filter-select-box{margin-bottom:25px;position:relative}.filter-select{align-items:center;background:#1e1e1f;background:var(--eerie-black-2);border:1px solid #383838;border:1px solid var(--jet);border-radius:14px;color:#d6d6d6;color:var(--light-gray);display:flex;font-size:14px;font-size:var(--fs-6);font-weight:300;font-weight:var(--fw-300);justify-content:space-between;padding:12px 16px;width:100%}.filter-select.active .select-icon{transform:rotate(.5turn)}.select-list{background:#1e1e1f;background:var(--eerie-black-2);border:1px solid #383838;border:1px solid var(--jet);border-radius:14px;opacity:0;padding:6px;pointer-events:none;position:absolute;top:calc(100% + 6px);transition:.15s ease-in-out;visibility:hidden;width:100%;z-index:2}.filter-select.active+.select-list{opacity:1;pointer-events:all;visibility:visible}.select-item button{background:#1e1e1f;background:var(--eerie-black-2);border-radius:8px;color:#d6d6d6;color:var(--light-gray);font-size:14px;font-size:var(--fs-6);font-weight:300;font-weight:var(--fw-300);padding:8px 10px;text-transform:capitalize;width:100%}.select-item button:hover{--eerie-black-2:#323234}.project-list{display:grid;gap:30px;grid-template-columns:1fr;margin-bottom:10px}.project-item{display:none}.project-item.active{animation:scaleUp .25s ease forwards;display:block}@keyframes scaleUp{0%{transform:scale(.5)}to{transform:scale(1)}}.project-item>a{width:100%}.project-img{border-radius:16px;height:200px;margin-bottom:15px;overflow:hidden;position:relative;width:100%}.project-img:before{background:transparent;content:"";height:100%;left:0;position:absolute;top:0;transition:.25s ease;transition:var(--transition-1);width:100%;z-index:1}.project-item>a:hover .project-img:before{background:rgba(0,0,0,.5)}.project-item-icon-box{--scale:0.8;background:#383838;background:var(--jet);border-radius:12px;color:#f39c12;color:var(--vegas-gold);font-size:20px;left:50%;opacity:0;padding:18px;position:absolute;top:50%;transform:translate(-50%,-50%) scale(.8);transform:translate(-50%,-50%) scale(var(--scale));transition:.25s ease;transition:var(--transition-1);z-index:1}.project-item>a:hover .project-item-icon-box{--scale:1;opacity:1}.project-item-icon-box ion-icon{--ionicon-stroke-width:50px}.project-img img{height:100%;-o-object-fit:cover;object-fit:cover;transition:.25s ease;transition:var(--transition-1);width:100%}.project-item>a:hover img{transform:scale(1.1)}.project-category,.project-title{margin-left:10px}.project-title{color:#fafafa;color:var(--white-2);font-size:15px;font-size:var(--fs-5);font-weight:400;font-weight:var(--fw-400);line-height:1.3;text-transform:capitalize}.project-category{color:hsla(0,0%,84%,.7);color:var(--light-gray-70);font-size:14px;font-size:var(--fs-6);font-weight:300;font-weight:var(--fw-300)}.blog-posts{margin-bottom:10px}.blog-posts-list{display:grid;gap:20px;grid-template-columns:1fr}.blog-post-item>a{background:linear-gradient(to bottom right,#404040,rgba(64,64,64,0) 50%);background:var(--border-gradient-onyx);border-radius:16px;box-shadow:0 25px 50px rgba(0,0,0,.15);box-shadow:var(--shadow-4);height:100%;position:relative;z-index:1}.blog-post-item>a:before{background:#202022;background:var(--eerie-black-1);border-radius:inherit;content:"";inset:1px;position:absolute;z-index:-1}.blog-banner-box{border-radius:12px;height:200px;overflow:hidden;width:100%}.blog-banner-box img{height:100%;-o-object-fit:cover;object-fit:cover;transition:.25s ease;transition:var(--transition-1);width:100%}.blog-post-item>a:hover .blog-banner-box img{transform:scale(1.1)}.blog-content{padding:15px}.blog-meta{align-items:center;display:flex;gap:7px;justify-content:flex-start;margin-bottom:10px}.blog-meta :is(.blog-category,time){color:hsla(0,0%,84%,.7);color:var(--light-gray-70);font-size:14px;font-size:var(--fs-6);font-weight:300;font-weight:var(--fw-300)}.blog-meta .dot{background:hsla(0,0%,84%,.7);background:var(--light-gray-70);border-radius:4px;height:4px;width:4px}.blog-item-title{line-height:1.3;margin-bottom:10px;transition:.25s ease;transition:var(--transition-1)}.blog-post-item>a:hover .blog-item-title{color:#f39c12;color:var(--vegas-gold)}.blog-text{color:#d6d6d6;color:var(--light-gray);font-size:14px;font-size:var(--fs-6);font-weight:300;font-weight:var(--fw-300);line-height:1.6}.mapbox{border:1px solid #383838;border:1px solid var(--jet);border-radius:16px;height:250px;margin-bottom:30px;overflow:hidden;position:relative;width:100%}.mapbox figure{height:100%}.mapbox iframe{border:none;filter:grayscale(1) invert(1);height:100%;width:100%}.contact::-moz-placeholder{font-weight:500;font-weight:var(--fw-500)}.contact::placeholder{font-weight:500;font-weight:var(--fw-500)}.contact:focus{border-color:#f39c12;border-color:var(--vegas-gold)}textarea.contact{height:120px;margin-bottom:25px;max-height:200px;min-height:100px;resize:vertical}textarea.contact::-webkit-resizer{display:none}.contact:focus:invalid{border-color:#b84c4c;border-color:var(--bittersweet-shimmer)}.form-btn{align-items:center;background:linear-gradient(to bottom right,#404040,rgba(64,64,64,0) 50%);background:var(--border-gradient-onyx);border-radius:14px;box-shadow:0 16px 40px rgba(0,0,0,.25);box-shadow:var(--shadow-3);color:#f39c12;color:var(--vegas-gold);display:flex;font-size:14px;font-size:var(--fs-6);gap:10px;justify-content:center;padding:13px 20px;position:relative;text-transform:capitalize;width:100%;z-index:1}.form-btn,.form-btn:before{transition:.25s ease;transition:var(--transition-1)}.form-btn:before{background:linear-gradient(to bottom right,rgba(45,45,46,.251),rgba(27,27,29,0)),#202022;background:var(--bg-gradient-jet);border-radius:inherit;content:"";inset:1px;position:absolute;z-index:-1}.form-btn ion-icon{font-size:16px}.form-btn:hover{background:linear-gradient(to bottom right,#ffda6b,rgba(255,192,97,0) 50%);background:var(--bg-gradient-yellow-1)}.form-btn:hover:before{background:linear-gradient(135deg,rgba(255,218,107,.251),rgba(255,187,92,0) 59.86%),#202022;background:var(--bg-gradient-yellow-2)}.form-btn:disabled{cursor:not-allowed;opacity:.7}.form-btn:disabled:hover{background:linear-gradient(to bottom right,#404040,rgba(64,64,64,0) 50%);background:var(--border-gradient-onyx)}.form-btn:disabled:hover:before{background:linear-gradient(to bottom right,rgba(45,45,46,.251),rgba(27,27,29,0)),#202022;background:var(--bg-gradient-jet)}@media (min-width:450px){.clients-item{min-width:calc(33.33% - 10px)}.blog-banner-box,.project-img{height:150px}}@media (min-width:580px){:root{--fs-1:32px;--fs-2:24px;--fs-3:26px;--fs-4:18px;--fs-6:15px;--fs-7:15px;--fs-8:12px}.sidebar,article{margin-inline:auto;padding:30px;width:520px}.article-title{font-weight:600;font-weight:var(--fw-600);padding-bottom:15px}.article-title:after{height:5px;width:40px}.icon-box{border-radius:12px;font-size:18px;height:48px;width:48px}main{margin-bottom:100px;margin-top:60px}.sidebar{margin-bottom:30px;max-height:180px}.sidebar.active{max-height:584px}.sidebar-info{gap:25px}.avatar-box{border-radius:30px}.avatar-box img{width:120px}.info-content .name{margin-bottom:15px}.info-content .title{padding:5px 18px}.info_more-btn{padding:10px 15px;right:-30px;top:-30px}.info_more-btn span{display:block;font-size:11px;font-size:var(--fs-8)}.info_more-btn ion-icon{display:none}.separator{margin:32px 0}.contacts-list{gap:20px}.contact-info{max-width:calc(100% - 64px);width:calc(100% - 64px)}.navbar{border-radius:20px 20px 0 0}.navbar-list{gap:20px}.navbar-link{--fs-8:14px}.about .article-title{margin-bottom:40px}.about-text{margin-bottom:20px}.about-item{align-items:flex-start;display:flex;gap:18px;justify-content:flex-start}.about-item-text{color:#d6d6d6;color:var(--light-gray);font-size:14px;font-size:var(--fs-6);font-weight:var(--fw-3);line-height:1.6}.service-item{align-items:flex-start;display:flex;gap:18px;justify-content:flex-start;padding:30px}.service-icon-box{margin-bottom:0;margin-top:5px}.service-content-box{text-align:left}.testimonials-title{margin-bottom:25px}.testimonials-list{gap:30px;margin:0 -30px;padding:30px 30px 35px}.content-card{padding:25px 30px 30px}.testimonials-avatar-box{border-radius:20px;transform:translate(30px,-30px)}.testimonials-avatar-box img{width:80px}.testimonials-item-title{margin-bottom:10px;margin-left:95px}.testimonials-text{line-clamp:2;-webkit-line-clamp:2}.modal-container{padding:20px}.testimonials-modal{align-items:stretch;border-radius:20px;gap:25px;justify-content:flex-start;margin:auto;padding:30px}.modal-img-wrapper{align-items:center;display:flex;flex-direction:column}.modal-avatar-box{border-radius:18px;margin-bottom:0}.modal-avatar-box img{width:65px}.modal-img-wrapper>img{display:block;flex-grow:1;width:35px}.clients-list{gap:50px;margin:0 -30px;padding:45px;scroll-padding-inline:45px}.clients-item{min-width:calc(33.33% - 35px)}.timeline-list{margin-left:65px}.timeline-item:not(:last-child):before{left:-40px}.timeline-item:after{height:8px;left:-43px;width:8px}.skills-item:not(:last-child){margin-bottom:25px}.blog-banner-box,.project-img{border-radius:16px}.blog-posts-list{gap:30px}.blog-content{padding:25px}.mapbox{border-radius:18px;height:380px}.input-wrapper{gap:30px}.input-wrapper,textarea.contact{margin-bottom:30px}.form-btn{--fs-6:16px;padding:16px 20px}.form-btn ion-icon{font-size:18px}}@media (min-width:768px){.sidebar,article{width:700px}.has-scrollbar::-webkit-scrollbar-button{width:100px}.contacts-list{gap:30px 15px;grid-template-columns:1fr 1fr}.navbar-link{--fs-8:15px}.testimonials-modal{gap:35px;margin:auto;max-width:680px}.modal-avatar-box img{width:80px}.article-title{padding-bottom:20px}.filter-select-box{display:none}.filter-list{align-items:center;display:flex;gap:25px;justify-content:flex-start;margin-bottom:30px;padding-left:5px}.filter-item button{color:#d6d6d6;color:var(--light-gray);font-size:15px;font-size:var(--fs-5);transition:.25s ease;transition:var(--transition-1)}.filter-item button:hover{color:hsla(0,0%,84%,.7);color:var(--light-gray-70)}.filter-item button.active{color:#f39c12;color:var(--vegas-gold)}.blog-posts-list,.input-wrapper,.project-list{grid-template-columns:1fr 1fr}.form-btn{margin-left:auto;width:-moz-max-content;width:max-content}}@media (min-width:1024px){:root{--shadow-1:-4px 8px 24px rgba(0,0,0,.125);--shadow-2:0 16px 30px rgba(0,0,0,.125);--shadow-3:0 16px 40px rgba(0,0,0,.125)}.sidebar,article{box-shadow:0 24px 80px rgba(0,0,0,.25);box-shadow:var(--shadow-5);width:950px}main{margin-bottom:60px}.main-content{margin:auto;position:relative}.main-content,.navbar{width:-moz-max-content;width:max-content}.navbar{border-radius:0 20px;bottom:auto;box-shadow:none;left:auto;padding:0 20px;position:absolute;right:0;top:0}.navbar-list{gap:30px;padding:0 20px}.navbar-link{font-weight:500;font-weight:var(--fw-500)}.service-list{gap:20px 25px;grid-template-columns:1fr 1fr}.testimonials-item{min-width:calc(50% - 15px)}.clients-item{min-width:calc(25% - 38px)}.project-list{grid-template-columns:repeat(3,1fr)}.blog-banner-box{height:230px}}@media (min-width:1250px){body::-webkit-scrollbar{width:20px}body::-webkit-scrollbar-track{background:#121212;background:var(--smoky-black)}body::-webkit-scrollbar-thumb{background:hsla(0,0%,100%,.1);border:5px solid #121212;border:5px solid var(--smoky-black);border-radius:20px;box-shadow:inset 1px 1px 0 hsla(0,0%,100%,.11),inset -1px -1px 0 hsla(0,0%,100%,.11)}body::-webkit-scrollbar-thumb:hover{background:hsla(0,0%,100%,.15)}body::-webkit-scrollbar-button{height:60px}.sidebar,article{width:auto}article{min-height:100%}main{align-items:stretch;display:flex;gap:25px;justify-content:center;margin-inline:auto;max-width:1200px}.main-content{margin:0;min-width:75%;width:75%}.sidebar{height:100%;margin-bottom:0;max-height:50rem;padding-top:60px;position:sticky;top:60px;z-index:1}.sidebar-info{flex-direction:column}.avatar-box img{width:150px}.info-content .name{text-align:center;white-space:nowrap}.info-content .title{margin:auto}.info_more-btn{display:none}.sidebar-info_more{opacity:1;visibility:visible}.contacts-list{grid-template-columns:1fr}.contact-info :is(.contact-link){overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.contact-info :is(.contact-link,time,address){--fs-7:14px;font-weight:300;font-weight:var(--fw-300)}.separator:last-of-type{margin:15px 0;opacity:0}.social-list{justify-content:center}.timeline-text{max-width:700px}}';
const LoadingPage_vue_vue_type_style_index_0_scoped_11eba00d_lang = "@keyframes load-11eba00d{0%{filter:blur(5px);letter-spacing:3px;opacity:.08}}.animate[data-v-11eba00d]{align-items:center;animation:load-11eba00d 1.2s ease-in-out 0s infinite;animation-direction:alternate;display:flex;font-family:Helvetica,sans-serif,Arial;height:100%;justify-content:center;margin:auto;text-shadow:0 0 1px #fff}";
const app_vue_vue_type_style_index_0_lang = ".v-enter-active,.v-leave-active{transition:opacity .5s ease}.v-enter-from,.v-leave-to{opacity:0}";
const flicking$1 = ".flicking-viewport{overflow:hidden;position:relative}.flicking-viewport.vertical,.flicking-viewport.vertical>.flicking-camera{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}.flicking-viewport.vertical>.flicking-camera{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.flicking-viewport.flicking-hidden>.flicking-camera>*{visibility:hidden}.flicking-camera{-webkit-box-orient:horizontal;-webkit-box-direction:normal;display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;height:100%;position:relative;width:100%;will-change:transform;z-index:1}.flicking-camera>*{-ms-flex-negative:0;flex-shrink:0}";
const error404_vue_vue_type_style_index_0_scoped_30d2164e_lang$1 = '.spotlight[data-v-30d2164e]{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);bottom:-30vh;filter:blur(20vh);height:40vh}.gradient-border[data-v-30d2164e]{-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:.5rem;position:relative}@media (prefers-color-scheme:light){.gradient-border[data-v-30d2164e]{background-color:hsla(0,0%,100%,.3)}.gradient-border[data-v-30d2164e]:before{background:linear-gradient(90deg,#e2e2e2,#e2e2e2 25%,#00dc82 50%,#36e4da 75%,#0047e1)}}@media (prefers-color-scheme:dark){.gradient-border[data-v-30d2164e]{background-color:hsla(0,0%,8%,.3)}.gradient-border[data-v-30d2164e]:before{background:linear-gradient(90deg,#303030,#303030 25%,#00dc82 50%,#36e4da 75%,#0047e1)}}.gradient-border[data-v-30d2164e]:before{background-size:400% auto;border-radius:.5rem;bottom:0;content:"";left:0;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:.5;padding:2px;position:absolute;right:0;top:0;transition:background-position .3s ease-in-out,opacity .2s ease-in-out;width:100%}.gradient-border[data-v-30d2164e]:hover:before{background-position:-50% 0;opacity:1}.bg-white[data-v-30d2164e]{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}.cursor-pointer[data-v-30d2164e]{cursor:pointer}.flex[data-v-30d2164e]{display:flex}.grid[data-v-30d2164e]{display:grid}.place-content-center[data-v-30d2164e]{place-content:center}.items-center[data-v-30d2164e]{align-items:center}.justify-center[data-v-30d2164e]{justify-content:center}.font-sans[data-v-30d2164e]{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.font-medium[data-v-30d2164e]{font-weight:500}.font-light[data-v-30d2164e]{font-weight:300}.text-8xl[data-v-30d2164e]{font-size:6rem;line-height:1}.text-xl[data-v-30d2164e]{font-size:1.25rem;line-height:1.75rem}.leading-tight[data-v-30d2164e]{line-height:1.25}.mb-8[data-v-30d2164e]{margin-bottom:2rem}.mb-16[data-v-30d2164e]{margin-bottom:4rem}.max-w-520px[data-v-30d2164e]{max-width:520px}.min-h-screen[data-v-30d2164e]{min-height:100vh}.overflow-hidden[data-v-30d2164e]{overflow:hidden}.px-8[data-v-30d2164e]{padding-left:2rem;padding-right:2rem}.py-2[data-v-30d2164e]{padding-bottom:.5rem;padding-top:.5rem}.px-4[data-v-30d2164e]{padding-left:1rem;padding-right:1rem}.fixed[data-v-30d2164e]{position:fixed}.left-0[data-v-30d2164e]{left:0}.right-0[data-v-30d2164e]{right:0}.text-center[data-v-30d2164e]{text-align:center}.text-black[data-v-30d2164e]{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity))}.antialiased[data-v-30d2164e]{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.w-full[data-v-30d2164e]{width:100%}.z-10[data-v-30d2164e]{z-index:10}.z-20[data-v-30d2164e]{z-index:20}@media (min-width:640px){.sm\\:text-4xl[data-v-30d2164e]{font-size:2.25rem;line-height:2.5rem}.sm\\:text-xl[data-v-30d2164e]{font-size:1.25rem;line-height:1.75rem}.sm\\:text-10xl[data-v-30d2164e]{font-size:10rem;line-height:1}.sm\\:px-0[data-v-30d2164e]{padding-left:0;padding-right:0}.sm\\:py-3[data-v-30d2164e]{padding-bottom:.75rem;padding-top:.75rem}.sm\\:px-6[data-v-30d2164e]{padding-left:1.5rem;padding-right:1.5rem}}@media (prefers-color-scheme:dark){.dark\\:bg-black[data-v-30d2164e]{--tw-bg-opacity:1;background-color:#000;background-color:rgba(0,0,0,var(--tw-bg-opacity))}.dark\\:text-white[data-v-30d2164e]{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}}';
const error500_vue_vue_type_style_index_0_scoped_32388612_lang$1 = ".spotlight[data-v-32388612]{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);filter:blur(20vh)}.bg-white[data-v-32388612]{--tw-bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--tw-bg-opacity))}.grid[data-v-32388612]{display:grid}.place-content-center[data-v-32388612]{place-content:center}.font-sans[data-v-32388612]{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.font-medium[data-v-32388612]{font-weight:500}.font-light[data-v-32388612]{font-weight:300}.h-1\\/2[data-v-32388612]{height:50%}.text-8xl[data-v-32388612]{font-size:6rem;line-height:1}.text-xl[data-v-32388612]{font-size:1.25rem;line-height:1.75rem}.leading-tight[data-v-32388612]{line-height:1.25}.mb-8[data-v-32388612]{margin-bottom:2rem}.mb-16[data-v-32388612]{margin-bottom:4rem}.max-w-520px[data-v-32388612]{max-width:520px}.min-h-screen[data-v-32388612]{min-height:100vh}.overflow-hidden[data-v-32388612]{overflow:hidden}.px-8[data-v-32388612]{padding-left:2rem;padding-right:2rem}.fixed[data-v-32388612]{position:fixed}.left-0[data-v-32388612]{left:0}.right-0[data-v-32388612]{right:0}.-bottom-1\\/2[data-v-32388612]{bottom:-50%}.text-center[data-v-32388612]{text-align:center}.text-black[data-v-32388612]{--tw-text-opacity:1;color:#000;color:rgba(0,0,0,var(--tw-text-opacity))}.antialiased[data-v-32388612]{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (min-width:640px){.sm\\:text-4xl[data-v-32388612]{font-size:2.25rem;line-height:2.5rem}.sm\\:text-10xl[data-v-32388612]{font-size:10rem;line-height:1}.sm\\:px-0[data-v-32388612]{padding-left:0;padding-right:0}}@media (prefers-color-scheme:dark){.dark\\:bg-black[data-v-32388612]{--tw-bg-opacity:1;background-color:#000;background-color:rgba(0,0,0,var(--tw-bg-opacity))}.dark\\:text-white[data-v-32388612]{--tw-text-opacity:1;color:#fff;color:rgba(255,255,255,var(--tw-text-opacity))}}";
const LangSwitcher2_vue_vue_type_style_index_0_scoped_cd1a154c_lang$1 = ".p-dropdown[data-v-cd1a154c]{border:none!important}";
const Navbar_vue_vue_type_style_index_0_scoped_fa58e335_lang$1 = "a.router-link-active[data-v-fa58e335]{font-weight:700}a.router-link-exact-active[data-v-fa58e335]{color:var(--vegas-gold)}";
const CookieBar_vue_vue_type_style_index_0_scoped_1144c8c8_lang$1 = ".bounce-enter-active[data-v-1144c8c8]{animation:bounce-in-1144c8c8 .5s}.bounce-leave-active[data-v-1144c8c8]{animation:bounce-in-1144c8c8 .5s reverse}@keyframes bounce-in-1144c8c8{0%{transform:scale(0)}50%{transform:scale(1.25)}to{transform:scale(1)}}";
const _sfc_main$g = {
  __name: "404",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useHead({
      title: "Ooups!"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: "active",
        "data-page": "resume"
      }, _attrs))}><header><h2 class="h2 article-title"> Page Not Found </h2></header><div class="grid grid-cols-1 text-center mb-20 md:mb-0"><div class="text-[5rem] text-[#f39c12] font-bold"> 404 </div><div class="text-xl text-[#fafafa]"><span>The Page you are looking for doesn&#39;t exist or an other error occured. 😞</span><span class="mx-auto w-40 py-2 mt-5 cursor-pointer font-semibold bg-ranko-500 text-[#1e1e1f] rounded text-sm"> Go back </span></div></div></article>`);
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/404.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _404 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: _sfc_main$g
});
const _sfc_main$f = {
  name: "GithubReposItem",
  props: {
    repository: {
      type: Object,
      default: () => {
        return {};
      }
    },
    bgColor: {
      type: String,
      default: void 0
    }
  },
  data: () => ({
    icon: {
      book: "M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z",
      star: "M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z",
      fork: "M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
    }
  })
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "border h-full rounded p-4 flex flex-col" }, _attrs))}><div class="flex items-center"><svg viewBox="0 0 16 16" class="w-4 h-4 fill-current mr-2" aria-hidden="true"><path fill-rule="evenodd"${ssrRenderAttr("d", _ctx.icon.book)}></path></svg><a${ssrRenderAttr("href", $props.repository.html_url)} target="_blank" class="font-medium text-purple-800 dark:text-purple-200">${ssrInterpolate($props.repository.name)}</a></div><div class="text-xs mt-2 mb-4">${ssrInterpolate($props.repository.description)}</div><div class="mt-auto text-xs flex">`);
  if ($props.repository.language) {
    _push(`<div class="flex items-center mr-4"><span style="${ssrRenderStyle({ backgroundColor: $props.repository.language ? $props.bgColor : "" })}" class="w-3 h-3 rounded-full relative"></span><span class="pl-2">${ssrInterpolate($props.repository.language)}</span></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($props.repository.stargazers_count) {
    _push(`<div class="flex items-center mr-4"><svg class="w-4 h-4 fill-current mr-2" aria-label="stars" viewBox="0 0 16 16" role="img"><path fill-rule="evenodd"${ssrRenderAttr("d", _ctx.icon.star)}></path></svg><span>${ssrInterpolate($props.repository.stargazers_count)}</span></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($props.repository.size) {
    _push(`<div class="flex items-center"><svg class="w-4 h-4 fill-current mr-2" aria-label="fork" viewBox="0 0 16 16" role="img"><path fill-rule="evenodd"${ssrRenderAttr("d", _ctx.icon.fork)}></path></svg><span>${ssrInterpolate($props.repository.forks)}</span></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div></div>`);
}
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/GithubRepo.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const GithubRepo = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["ssrRender", _sfc_ssrRender$2]]);
const GithubRepo$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: GithubRepo
});
const _sfc_main$e = {
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Contact"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: "contact active",
        "data-page": "contact"
      }, _attrs))}><header><h2 class="h2 article-title">${ssrInterpolate(_ctx.$t("pageTitles.contact"))}</h2></header><section class="mapbox" data-mapbox><figure><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2744.374516536378!2d6.5460361769091175!3d46.54027777111207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c3138b2e7e215%3A0x3856b620e5f5c937!2sFMEL%3A%20Rainbow%20House!5e0!3m2!1szh-CN!2sch!4v1710455432868!5m2!1szh-CN!2sch" width="400" height="300" loading="lazy"></iframe></figure></section></article>`);
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const contact = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: _sfc_main$e
});
const _sfc_main$d = {
  __name: "AboutItem",
  __ssrInlineRender: true,
  props: {
    about: Object
  },
  setup(__props) {
    const { locale } = useI18n({ useScope: "global" });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<li${ssrRenderAttrs(mergeProps({ class: "about-item" }, _attrs))}><div class="about-content-box"><p class="about-item-text">${ssrInterpolate(unref(locale) === "en" ? (_a = __props.about.description) == null ? void 0 : _a.en : (_b = __props.about.description) == null ? void 0 : _b.id_ID)}</p></div></li>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AboutItem.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const __nuxt_component_0$1 = _sfc_main$d;
const _sfc_main$c = {
  __name: "ServiceItem",
  __ssrInlineRender: true,
  props: {
    service: Object
  },
  setup(__props) {
    const { locale } = useI18n({ useScope: "global" });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<li${ssrRenderAttrs(mergeProps({ class: "service-item" }, _attrs))}><div class="service-icon-box">`);
      if (__props.service.image !== null && __props.service.icon !== "") {
        _push(`<img${ssrRenderAttr("src", __props.service.image)} alt="mobile app icon">`);
      } else {
        _push(ssrRenderComponent(unref(Icon), {
          icon: __props.service.icon,
          class: "text-ranko-500 text-[3rem] mx-auto",
          style: { "width": "40px" }
        }, null, _parent));
      }
      _push(`</div><div class="service-content-box"><h4 class="h4 service-item-title">${ssrInterpolate(unref(locale) === "en" ? (_a = __props.service.title) == null ? void 0 : _a.en : (_b = __props.service.title) == null ? void 0 : _b.id_ID)}</h4><p class="service-item-text">${ssrInterpolate(unref(locale) === "en" ? (_c = __props.service.description) == null ? void 0 : _c.en : (_d = __props.service.description) == null ? void 0 : _d.id_ID)}</p></div></li>`);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ServiceItem.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const __nuxt_component_1$2 = _sfc_main$c;
const _sfc_main$b = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({});
    const { locale } = useI18n({ useScope: "global" });
    [__temp, __restore] = withAsyncContext(() => useFetch("/api/testimonials", "$PslAyef5YX")), __temp = await __temp, __restore(), __temp;
    ref({});
    ref(false);
    ref(false);
    const { data: services } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/services", "$6PO73qLRkI")), __temp = await __temp, __restore(), __temp);
    const { data: about } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/about", "$nn2AXZkwPl")), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AboutItem = __nuxt_component_0$1;
      const _component_ServiceItem = __nuxt_component_1$2;
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: "about active",
        "data-page": "about"
      }, _attrs))}><header><h2 class="h2 article-title">${ssrInterpolate(_ctx.$t("pageTitles.about"))}</h2></header><section class="about-text"><ul class="about-list"><!--[-->`);
      ssrRenderList(unref(about), (about2) => {
        _push(ssrRenderComponent(_component_AboutItem, {
          key: about2.id,
          about: about2
        }, null, _parent));
      });
      _push(`<!--]--></ul></section><section class="service"><h3 class="h3 service-title">${ssrInterpolate(unref(locale) === "en" ? "What I Like" : "我的爱好")}</h3><ul class="service-list"><!--[-->`);
      ssrRenderList(unref(services), (service) => {
        _push(ssrRenderComponent(_component_ServiceItem, {
          key: service.id,
          service
        }, null, _parent));
      });
      _push(`<!--]--></ul></section></article>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: _sfc_main$b
});
const _sfc_main$a = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Plog"
    });
    const { locale } = useI18n({ useScope: "global" });
    const { data: photos } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/photo", "$Xj2SHXpt5I")), __temp = await __temp, __restore(), __temp);
    const photoList = [...photos.value];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: "blog active",
        "data-page": "blog"
      }, _attrs))}><header><h2 class="h2 article-title">${ssrInterpolate(_ctx.$t("pageTitles.plog"))}</h2></header><section class="blog-posts"><ul class="blog-posts-list"><!--[-->`);
      ssrRenderList(_ctx.projectList, (project) => {
        _push(`<li class="${ssrRenderClass([{ active: _ctx.activeCategory === project.category.id || _ctx.activeCategory === 0 }, "project-item"])}"></li>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(photoList, (photo) => {
        var _a, _b, _c, _d, _e, _f;
        _push(`<li class="blog-post-item"><a><figure class="blog-banner-box"><img${ssrRenderAttr("src", photo.image)} alt="photo.title" loading="lazy"></figure><div class="blog-content"><div class="blog-meta"><p class="blog-category">${ssrInterpolate(unref(locale) === "en" ? (_a = photo.location) == null ? void 0 : _a.en : (_b = photo.location) == null ? void 0 : _b.id_ID)}</p><span class="dot"></span><time>${ssrInterpolate(unref(locale) === "en" ? (_c = photo.time) == null ? void 0 : _c.en : (_d = photo.time) == null ? void 0 : _d.id_ID)}</time></div><h4 class="h4 blog-item-title">${ssrInterpolate(unref(locale) === "en" ? (_e = photo.title) == null ? void 0 : _e.en : (_f = photo.title) == null ? void 0 : _f.id_ID)}</h4></div></a></li>`);
      });
      _push(`<!--]--></ul></section></article>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/plog/index.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const index2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: _sfc_main$a
});
const flicking = "";
const _sfc_main$9 = {
  __name: "portfolio",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Portfolio"
    });
    const { locale } = useI18n({ useScope: "global" });
    const { data: projects } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/projects", "$czx70LxKTy")), __temp = await __temp, __restore(), __temp);
    const { data: categories } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/categories", "$UQupibDk7i")), __temp = await __temp, __restore(), __temp);
    const projectList = [...projects.value];
    const activeCategory = ref(0);
    const filterMenu = ref(false);
    const activeCategoryName = ref("");
    const activeItem = ref({});
    const activeModal = ref(false);
    const activeOverlay = ref(false);
    const title = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: "portfolio active",
        "data-page": "portfolio"
      }, _attrs))}><header><h2 class="h2 article-title">${ssrInterpolate(_ctx.$t("pageTitles.portfolio"))}</h2></header><section class="projects"><ul class="filter-list"><li class="filter-item"><button class="${ssrRenderClass({ active: unref(activeCategory) === 0 })}"> All </button></li><!--[-->`);
      ssrRenderList(unref(categories), (category) => {
        var _a2, _b2;
        _push(`<li class="filter-item"><button class="${ssrRenderClass({ active: unref(activeCategory) === category.id })}">${ssrInterpolate(unref(locale) === "en" ? (_a2 = category.title) == null ? void 0 : _a2.en : (_b2 = category.title) == null ? void 0 : _b2.id_ID)}</button></li>`);
      });
      _push(`<!--]--></ul><div class="filter-select-box"><button class="${ssrRenderClass([{ active: unref(filterMenu) }, "filter-select"])}"><div class="select-value">${ssrInterpolate(unref(activeCategory) !== 0 ? unref(locale) === "en" ? (_a = unref(activeCategoryName)) == null ? void 0 : _a.en : (_b = unref(activeCategoryName)) == null ? void 0 : _b.id_ID : "Select Category")}</div><div class="select-icon"><ion-icon name="chevron-down"></ion-icon></div></button><ul class="select-list"><li class="select-item"><button>${ssrInterpolate(unref(locale) === "en" ? "All" : "全部")}</button></li><!--[-->`);
      ssrRenderList(unref(categories), (category) => {
        var _a2, _b2;
        _push(`<li class="select-item"><button>${ssrInterpolate(unref(locale) === "en" ? (_a2 = category.title) == null ? void 0 : _a2.en : (_b2 = category.title) == null ? void 0 : _b2.id_ID)}</button></li>`);
      });
      _push(`<!--]--></ul></div><ul class="project-list"><!--[-->`);
      ssrRenderList(projectList, (project) => {
        var _a2, _b2, _c2, _d2;
        _push(`<li class="${ssrRenderClass([{ active: unref(activeCategory) === project.category.id || unref(activeCategory) === 0 }, "project-item"])}"><a class="cursor-pointer"><figure class="project-img"><div class="project-item-icon-box"><ion-icon name="eye-outline"></ion-icon></div><img${ssrRenderAttr("src", project.image)}${ssrRenderAttr("alt", project.title)} loading="lazy"></figure><h3 class="project-title">${ssrInterpolate(unref(locale) === "en" ? (_a2 = project.title) == null ? void 0 : _a2.en : (_b2 = project.title) == null ? void 0 : _b2.id_ID)}</h3><p class="project-category">${ssrInterpolate(unref(locale) === "en" ? (_c2 = project.category.title) == null ? void 0 : _c2.en : (_d2 = project.category.title) == null ? void 0 : _d2.id_ID)}</p></a></li>`);
      });
      _push(`<!--]--></ul><div class="${ssrRenderClass([{ active: unref(activeModal) }, "modal-container"])}"><div style="${ssrRenderStyle(unref(activeModal) ? null : { display: "none" })}" class="${ssrRenderClass([{ active: unref(activeOverlay) }, "overlay"])}"></div><section class="testimonials-modal block"><button class="modal-close-btn"><ion-icon name="close-outline"></ion-icon></button><div><figure><img${ssrRenderAttr("src", unref(activeItem).image)} class="rounded-lg"${ssrRenderAttr("alt", unref(activeItem).title)} style="${ssrRenderStyle({ "margin": "auto" })}"></figure></div><div class="modal-content space-y-3 mt-4"><h4 class="h3 modal-title">${ssrInterpolate(unref(title))}</h4><small class="flex items-center justify-start gap-2 text-gray-500">`);
      _push(ssrRenderComponent(unref(Icon), { icon: "foundation:calendar" }, null, _parent));
      _push(`<span>${ssrInterpolate(unref(locale) === "en" ? (_d = (_c = unref(activeItem).category) == null ? void 0 : _c.date) == null ? void 0 : _d.en : (_f = (_e = unref(activeItem).category) == null ? void 0 : _e.date) == null ? void 0 : _f.id_ID)}</span> | `);
      _push(ssrRenderComponent(unref(Icon), { icon: "dashicons:category" }, null, _parent));
      _push(`<span>${ssrInterpolate(unref(locale) === "en" ? (_h = (_g = unref(activeItem).category) == null ? void 0 : _g.title) == null ? void 0 : _h.en : (_j = (_i = unref(activeItem).category) == null ? void 0 : _i.title) == null ? void 0 : _j.id_ID)}</span> | `);
      _push(ssrRenderComponent(unref(Icon), { icon: "ri:search-eye-line" }, null, _parent));
      _push(`<a${ssrRenderAttr("href", unref(activeItem).url)} target="_blank">${ssrInterpolate(unref(locale) === "en" ? (_k = unref(activeItem).desc) == null ? void 0 : _k.en : (_l = unref(activeItem).desc) == null ? void 0 : _l.id_ID)}</a></small><p class="text-justify">${unref(locale) === "en" ? (_m = unref(activeItem).content) == null ? void 0 : _m.en : (_n = unref(activeItem).content) == null ? void 0 : _n.id_ID}</p></div></section></div></section></article>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/portfolio.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const portfolio = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: _sfc_main$9
});
const _sfc_main$8 = {
  __name: "resume",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({
      title: "Resume"
    });
    const { locale } = useI18n({ useScope: "global" });
    const { data } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/resume", "$vMf5QVxhoO")), __temp = await __temp, __restore(), __temp);
    const education = data._rawValue.education;
    const experience = data._rawValue.experience;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: "resume active",
        "data-page": "resume"
      }, _attrs))}><header><h2 class="h2 article-title">${ssrInterpolate(_ctx.$t("pageTitles.resume"))}</h2></header><section class="timeline"><div class="title-wrapper"><div class="icon-box"><ion-icon name="book-outline"></ion-icon></div><h3 class="h3 timeline-title">${ssrInterpolate(unref(locale) === "en" ? "Education" : "教育经历")}</h3></div><ol class="timeline-list"><!--[-->`);
      ssrRenderList(unref(education), (resume2) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        _push(`<li class="timeline-item"${ssrRenderAttr("resume", resume2)}><h4 class="h4 timeline-item-title">${ssrInterpolate(unref(locale) === "en" ? (_a = resume2.title) == null ? void 0 : _a.en : (_b = resume2.title) == null ? void 0 : _b.id_ID)}</h4><span>${ssrInterpolate(unref(locale) === "en" ? (_c = resume2.date) == null ? void 0 : _c.en : (_d = resume2.date) == null ? void 0 : _d.id_ID)}</span><p class="timeline-item-desc">${ssrInterpolate(unref(locale) === "en" ? (_e = resume2.location) == null ? void 0 : _e.en : (_f = resume2.location) == null ? void 0 : _f.id_ID)}</p><p class="timeline-text">${ssrInterpolate(unref(locale) === "en" ? (_g = resume2.position) == null ? void 0 : _g.en : (_h = resume2.position) == null ? void 0 : _h.id_ID)}</p></li>`);
      });
      _push(`<!--]--></ol></section><section class="timeline"><div class="title-wrapper"><div class="icon-box"><ion-icon name="briefcase-outline"></ion-icon></div><h3 class="h3 timeline-title">${ssrInterpolate(unref(locale) === "en" ? "Experience" : "实习经历")}</h3></div><ol class="timeline-list"><!--[-->`);
      ssrRenderList(unref(experience), (resume2) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        _push(`<li class="timeline-item"${ssrRenderAttr("resume", resume2)}><h4 class="h4 timeline-item-title">${ssrInterpolate(unref(locale) === "en" ? (_a = resume2.title) == null ? void 0 : _a.en : (_b = resume2.title) == null ? void 0 : _b.id_ID)}</h4><span>${ssrInterpolate(unref(locale) === "en" ? (_c = resume2.date) == null ? void 0 : _c.en : (_d = resume2.date) == null ? void 0 : _d.id_ID)}</span><p class="timeline-item-desc">${ssrInterpolate(unref(locale) === "en" ? (_e = resume2.location) == null ? void 0 : _e.en : (_f = resume2.location) == null ? void 0 : _f.id_ID)}</p><p class="timeline-text">${ssrInterpolate(unref(locale) === "en" ? (_g = resume2.position) == null ? void 0 : _g.en : (_h = resume2.position) == null ? void 0 : _h.id_ID)}</p></li>`);
      });
      _push(`<!--]--></ol></section><section class="skill"><ul class="skills-list content-card"><li class="skills-item"><div class="title-wrapper"><h5 class="h5"> UI/UX Design &amp; Multimedia (PS, PR, AE, Adobe XD, Final Cut) </h5><data value="80">90%</data></div><div class="skill-progress-bg"><div class="skill-progress-fill" style="${ssrRenderStyle({ "width": "90%" })}"></div></div></li><li class="skills-item"><div class="title-wrapper"><h5 class="h5"> Data Analysis (Python, MySQL, Stata, Gephi) </h5><data value="70">70%</data></div><div class="skill-progress-bg"><div class="skill-progress-fill" style="${ssrRenderStyle({ "width": "70%" })}"></div></div></li><li class="skills-item"><div class="title-wrapper"><h5 class="h5"> Web Development (MIS, Wordpress, PHP, Vue.js) </h5><data value="60">60%</data></div><div class="skill-progress-bg"><div class="skill-progress-fill" style="${ssrRenderStyle({ "width": "60%" })}"></div></div></li></ul></section></article>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/resume.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const resume = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: _sfc_main$8
});
const LangSwitcher2_vue_vue_type_style_index_0_scoped_cd1a154c_lang = "";
const _sfc_main$7 = {
  __name: "LangSwitcher2",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale } = useI18n({ useScope: "global" });
    useLocaleStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "cursor-pointer transition-all fade" }, _attrs))} data-v-cd1a154c><img${ssrRenderAttr("src", `/flags/${unref(locale)}.png`)} class="h-3" data-v-cd1a154c></div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LangSwitcher2.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-cd1a154c"]]);
const _imports_0 = "" + __publicAssetsURL("images/avatar.jpeg");
const _sfc_main$6 = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    let isOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_LangSwitcher2 = __nuxt_component_1$1;
      _push(`<aside${ssrRenderAttrs(mergeProps({
        class: ["sidebar", { active: unref(isOpen) }]
      }, _attrs))}><div class="sidebar-info"><figure class="avatar-box"><img${ssrRenderAttr("src", _imports_0)} alt="Photo" width="80"></figure><div class="info-content"><h1 class="name" title="Zihao Wang"> Zihao Wang </h1><p class="title text-center xl:block flex items-center justify-center gap-1"><span class="xl:after:content-[&#39;&#39;] after:content-[&#39;,&#39;]">Master&#39;s Student at EPFL</span></p></div><button class="info_more-btn"><span>Show Contacts</span><ion-icon name="chevron-down"></ion-icon></button></div><div class="sidebar-info_more"><div class="separator"></div><ul class="contacts-list"><li class="contact-item"><div class="icon-box"><ion-icon name="logo-github"></ion-icon></div><div class="contact-info"><p class="contact-title"> Github </p><a href="https://github.com/ZihaoWang2000" class="contact-link" target="_blank">ZihaoWang2000</a></div></li><li class="contact-item"><div class="icon-box"><ion-icon name="logo-linkedin"></ion-icon></div><div class="contact-info"><p class="contact-title"> Linkedin </p><a href="https://www.linkedin.com/in/zihao-wang-elliott" class="contact-link" target="_blank">Zihao Wang</a></div></li><li class="contact-item"><div class="icon-box"><ion-icon name="logo-instagram"></ion-icon></div><div class="contact-info"><p class="contact-title"> INSTAGRAM </p><a href="https://www.instagram.com/wzhelliott/" class="contact-link" target="_blank">wzhelliott</a></div></li><li class="contact-item"><div class="icon-box"><ion-icon name="calendar-outline"></ion-icon></div><div class="contact-info"><p class="contact-title">Birthday</p><time datetime="2000-10-03">Oct 3, 2000</time></div></li></ul><div class="separator"></div><ul class="social-list"><li class="social-item">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "mailto:elliott_wang2000@outlook.com",
        class: "social-link",
        target: "_blank"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<ion-icon name="mail-outline"${_scopeId}></ion-icon>`);
          } else {
            return [
              createVNode("ion-icon", { name: "mail-outline" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li>`);
      _push(ssrRenderComponent(_component_LangSwitcher2, null, null, _parent));
      _push(`</ul></div></aside>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0 = _sfc_main$6;
const Navbar_vue_vue_type_style_index_0_scoped_fa58e335_lang = "";
const _sfc_main$5 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$3;
  _push(`<nav${ssrRenderAttrs(mergeProps({ class: "navbar" }, _attrs))} data-v-fa58e335><ul class="navbar-list" data-v-fa58e335><li class="navbar-item" data-v-fa58e335>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "navbar-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate(_ctx.$t("pageTitles.about"))}`);
      } else {
        return [
          createTextVNode(toDisplayString$1(_ctx.$t("pageTitles.about")), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="navbar-item" data-v-fa58e335>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/resume",
    class: "navbar-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate(_ctx.$t("pageTitles.resume"))}`);
      } else {
        return [
          createTextVNode(toDisplayString$1(_ctx.$t("pageTitles.resume")), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="navbar-item" data-v-fa58e335>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/portfolio",
    class: "navbar-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate(_ctx.$t("pageTitles.portfolio"))}`);
      } else {
        return [
          createTextVNode(toDisplayString$1(_ctx.$t("pageTitles.portfolio")), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="navbar-item" data-v-fa58e335>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/plog",
    class: "navbar-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate(_ctx.$t("pageTitles.plog"))}`);
      } else {
        return [
          createTextVNode(toDisplayString$1(_ctx.$t("pageTitles.plog")), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="navbar-item" data-v-fa58e335>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/contact",
    class: "navbar-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`${ssrInterpolate(_ctx.$t("pageTitles.contact"))}`);
      } else {
        return [
          createTextVNode(toDisplayString$1(_ctx.$t("pageTitles.contact")), 1)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></nav>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Navbar.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-fa58e335"]]);
const useCookieStore = defineStore("cookieStore", () => {
  const cookie = ref(useCookie("accept-cookie"));
  const $cookies = inject("$cookies");
  function setCookie2() {
    $cookies.set("accept-cookie", true, "30d");
    return this.cookie = true;
  }
  const getCookie2 = computed(() => {
    return cookie.value;
  });
  return { cookie, setCookie: setCookie2, getCookie: getCookie2 };
});
const CookieBar_vue_vue_type_style_index_0_scoped_1144c8c8_lang = "";
const _sfc_main$4 = {
  __name: "CookieBar",
  __ssrInlineRender: true,
  setup(__props) {
    const cookie = useCookieStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        style: !unref(cookie).getCookie ? null : { display: "none" },
        class: "container left-0 right-0 mx-auto child md:w-[25%] bg-[#3f3f40] rounded-lg shadow-xl px-6 py-3 bottom-20 fixed z-[100] flex items-center justify-between animate-bounce"
      }, _attrs))} data-v-1144c8c8><span class="text-[#fafafa]" data-v-1144c8c8>This site use cookies! 🍪</span><span class="cursor-pointer p-2 shadow-md rounded bg-[#383838] text-[#fafafa] hover:bg-[#1e1e1f] transition" data-v-1144c8c8><ion-icon name="close-outline" data-v-1144c8c8></ion-icon></span></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CookieBar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-1144c8c8"]]);
const _sfc_main$3 = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale } = useI18n({ useScope: "global" });
    useHead({
      htmlAttrs: {
        lang: locale
      },
      titleTemplate: (pageTitle) => {
        return pageTitle ? `${pageTitle} - Zihao Wang ` : "Zihao Wang";
      },
      meta: [
        { charset: "utf-8" },
        { name: "description", content: "Personal site about Zihao Wang." },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "og:image", content: "https://raw.githubusercontent.com/ZihaoWang2000/zihaoblog/main/IMG_3050.jpeg" }
      ],
      link: [
        {
          rel: "icon",
          type: "image/jpg",
          href: "../images/icon.jpg"
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com"
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com"
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap",
          crossorigin: ""
        }
      ],
      script: [
        {
          src: "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js",
          body: false,
          type: "module"
        },
        {
          src: "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js",
          body: false,
          nomodule: true
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Sidebar = __nuxt_component_0;
      const _component_Navbar = __nuxt_component_1;
      const _component_CookieBar = __nuxt_component_2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Sidebar, null, null, _parent));
      _push(`<div class="main-content">`);
      _push(ssrRenderComponent(_component_Navbar, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
      _push(ssrRenderComponent(_component_CookieBar, null, null, _parent));
      _push(`</main>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: _sfc_main$3
});
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<main${ssrRenderAttrs(mergeProps({ class: "py-20 px-10 text-center" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`<div class="mt-5 mx-auto text-center opacity-25 text-sm"> [Home Layout] </div></main>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/home.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const home = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const home$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: home
});
const error404_vue_vue_type_style_index_0_scoped_30d2164e_lang = "";
const _sfc_main$1 = {
  __name: "error-404",
  __ssrInlineRender: true,
  props: {
    appName: {
      type: String,
      default: "Nuxt"
    },
    version: {
      type: String,
      default: ""
    },
    statusCode: {
      type: Number,
      default: 404
    },
    statusMessage: {
      type: String,
      default: "Not Found"
    },
    description: {
      type: String,
      default: "Sorry, the page you are looking for could not be found."
    },
    backHome: {
      type: String,
      default: "Go back home"
    }
  },
  setup(__props) {
    const props = __props;
    useHead({
      title: `${props.statusCode} - ${props.statusMessage} | ${props.appName}`,
      script: [],
      style: [
        {
          children: `*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e0e0e0}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}a{color:inherit;text-decoration:inherit}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";line-height:1.5}h1,p{margin:0}h1{font-size:inherit;font-weight:inherit}`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden" }, _attrs))} data-v-30d2164e><div class="fixed left-0 right-0 spotlight z-10" data-v-30d2164e></div><div class="max-w-520px text-center z-20" data-v-30d2164e><h1 class="text-8xl sm:text-10xl font-medium mb-8" data-v-30d2164e>${ssrInterpolate(__props.statusCode)}</h1><p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight" data-v-30d2164e>${ssrInterpolate(__props.description)}</p><div class="w-full flex items-center justify-center" data-v-30d2164e>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "gradient-border text-md sm:text-xl py-2 px-4 sm:py-3 sm:px-6 cursor-pointer"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.backHome)}`);
          } else {
            return [
              createTextVNode(toDisplayString$1(__props.backHome), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui-templates/dist/templates/error-404.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const error404 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-30d2164e"]]);
const error404$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: error404
});
const error500_vue_vue_type_style_index_0_scoped_32388612_lang = "";
const _sfc_main = {
  __name: "error-500",
  __ssrInlineRender: true,
  props: {
    appName: {
      type: String,
      default: "Nuxt"
    },
    version: {
      type: String,
      default: ""
    },
    statusCode: {
      type: Number,
      default: 500
    },
    statusMessage: {
      type: String,
      default: "Server error"
    },
    description: {
      type: String,
      default: "This page is temporarily unavailable."
    }
  },
  setup(__props) {
    const props = __props;
    useHead({
      title: `${props.statusCode} - ${props.statusMessage} | ${props.appName}`,
      script: [],
      style: [
        {
          children: `*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e0e0e0}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";line-height:1.5}h1,p{margin:0}h1{font-size:inherit;font-weight:inherit}`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden" }, _attrs))} data-v-32388612><div class="fixed -bottom-1/2 left-0 right-0 h-1/2 spotlight" data-v-32388612></div><div class="max-w-520px text-center" data-v-32388612><h1 class="text-8xl sm:text-10xl font-medium mb-8" data-v-32388612>${ssrInterpolate(__props.statusCode)}</h1><p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight" data-v-32388612>${ssrInterpolate(__props.description)}</p></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui-templates/dist/templates/error-500.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const error500 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-32388612"]]);
const error500$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: error500
});
const components_islands = {};
const islandComponents = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: components_islands
});
const islandRenderer = /* @__PURE__ */ defineComponent({
  props: {
    context: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const component = islandComponents[props.context.name];
    if (!component) {
      throw createError({
        statusCode: 404,
        statusMessage: `Island component not found: ${JSON.stringify(component)}`
      });
    }
    return () => createVNode(component || "span", { ...props.context.props, "nuxt-ssr-component-uid": "" });
  }
});
const islandRenderer$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: islandRenderer
});
export {
  CookieBar_vue_vue_type_style_index_0_scoped_1144c8c8_lang$1 as C,
  LoadingPage_vue_vue_type_style_index_0_scoped_11eba00d_lang as L,
  Navbar_vue_vue_type_style_index_0_scoped_fa58e335_lang$1 as N,
  theme as a,
  primeicons as b,
  app_vue_vue_type_style_index_0_lang as c,
  error500_vue_vue_type_style_index_0_scoped_32388612_lang$1 as d,
  entry$1 as default,
  error404_vue_vue_type_style_index_0_scoped_30d2164e_lang$1 as e,
  flicking$1 as f,
  LangSwitcher2_vue_vue_type_style_index_0_scoped_cd1a154c_lang$1 as g,
  primevue as p,
  style as s,
  tailwind as t
};
//# sourceMappingURL=server.mjs.map
