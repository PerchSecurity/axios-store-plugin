import store from "store";
import expirePlugin from "store/plugins/expire";

store.addPlugin(expirePlugin);

const axiosStore = axiosInstance => {
  const reqOrCache = (options = {}, ...arg) => {
    const cacheKey = `axios__${JSON.stringify(options)}`;
    const cachedData = store.get(cacheKey);
    return cachedData
      ? Promise.resolve({
          ...cachedData,
          __cacheKey: cacheKey,
          __fromCache: true
        })
      : Promise.resolve(store.set(cacheKey, { loading: true }))
          .then(() => axiosInstance.get(...arg))
          .then(({ data }) => ({ ...data, __cacheKey: cacheKey }));
  };

  // Check that the
  const axiosWithCache = (...arg) => {
    if (
      arg.length === 1 &&
      (arg[0].method === "get" || arg[0].method === undefined)
    ) {
      return reqOrCache(arg[0], ...arg);
    }
    return axiosInstance(...arg);
  };

  // Overwrite the
  axiosWithCache.get = (...arg) => {
    if (arg.length === 1) {
      return reqOrCache({ url: arg[0] }, ...arg);
    } else if (arg.length === 2) {
      return reqOrCache({ url: arg[0], ...arg[1] }, ...arg);
    }
    return axiosInstance.get(...arg);
  };

  const skipMethods = ["delete", "head", "options", "post", "put", "patch"];

  skipMethods.forEach(method => {
    axiosWithCache[method] = (...arg) => axiosInstance[method](...arg);
  });

  return axiosWithCache;
};

export default axiosStore;
