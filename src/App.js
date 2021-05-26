module.exports = class App
{
  constructor() {
    this.mServices = new Map();
    this.mManagers = new Map();
    this.mProviders = [];
  }

  start() {
    const app = this;

    // @TODO this does not handle providers during execution
    this.mProviders.forEach(provider => {
      provider.register(app);
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
}