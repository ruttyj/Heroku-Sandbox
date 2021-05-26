module.exports = class App
{
  constructor() {
    this.mServices = new Map();
    this.mManagers = new Map();
    this.mProviders = [];
  }

  start() {
    const app = this;
    this.mProviders.forEach(provider => {
      provider.register(app);
    })
  }

  addProvider(provider) {
      this.mProviders.push(provider);
  }

  addService(name, value) {
    this.mServices.set(name, value);
  }

  getService(name) {
    return this.mServices.get(name);
  }

  addManager(name, value) {
    this.mManagers.set(name, value);
  }

  getManager(name) {
    return this.mManagers.get(name);
  }
}