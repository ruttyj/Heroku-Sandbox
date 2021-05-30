module.exports = class App
{
  constructor() {
    this.mServices = new Map();
    this.mManagers = new Map();
    this.mHanderRegistry = new Map();
    this.mProviders = [];
  }

  start() {
    const app = this;

    this.mProviders.forEach(provider => {
      provider.register(app);
    })

    this.mProviders.forEach(provider => {
      provider.boot(app);
    })
  }

  //=================================
  // Providers
  _getProviderCount() {
    return this.mProviders.length;
  }

  addProvider(provider) {
      this.mProviders.push(provider);
  }

  //=================================
  // Services
  addService(name, value) {
    this.mServices.set(name, value);
  }

  getService(name) {
    return this.mServices.get(name);
  }

  //=================================
  // Managers
  addManager(name, value) {
    this.mManagers.set(name, value);
  }

  getManager(name) {
    return this.mManagers.get(name);
  }

  //=================================
  // Managers
  addRegistry(name, value) {
    this.mHanderRegistry.set(name, value);
  }

  getRegistry(name) {
    return this.mHanderRegistry.get(name);
  }
}
