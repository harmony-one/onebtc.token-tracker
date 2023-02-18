import * as process from 'process';

export default () => ({
  web3: {
    url: process.env.HMY_NODE_URL || 'https://api.s0.t.hmny.io',
  },
  version: process.env.npm_package_version || '0.0.1',
  name: process.env.npm_package_name || '',
  port: parseInt(process.env.PORT, 10) || 8080,
});