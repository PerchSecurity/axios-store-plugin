# axios-store-plugin

💰 Axios plugin that uses store.js to cache GET requests.

## Installing

Currently only availble via GitHub:

```sh
npm install usePF/axios-store-plugin
```

## Usage

```js
import axios from 'axios';
import storePlugin from 'axios-store-plugin';

const baseURL = `https://myapi.com/`;
const api = storePlugin(axios.create({ baseURL }));

// Use it like you would use Axios normally
const getNotifications = () => api.get('/notifications');
```

## API

How to use and love the the axios store plugin.

### axiosStore()

```js
axiosStore(axiosInstance: axios)
```

The axiosStore funtion only accepts one argument, an instace of Axios.

### Unwrapping data

Becuase the plugin only stores the `data` portion of the axios response, for consistency the `data` portion is always unwrapped and returned.