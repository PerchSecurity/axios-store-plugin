import store from "store";

const axiosStore = axiosInstance => {
  const reqOrCache = (options = {}, ...arg) => {
    const cacheKey = JSON.stringify(options);
    const cachedData = store.get(cacheKey);
    return cachedData
      ? Promise.resolve(Object.assign(cachedData, { cacheKey }))
      : axiosInstance
          .get(...arg)
          .then(({ data }) => Object.assign(data, { cacheKey }));
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
