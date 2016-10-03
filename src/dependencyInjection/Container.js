import Promise from 'bluebird';

class Container {
    constructor(logger) {
        this._modules = {};
        this._logger = logger;
    }

    register(name, dependencies, moduleDef) {
        if(this._modules[name] !== undefined){
            throw new Error('Module ' + name + ' is already registered. Use swapModule() instead.');
        }

        var moduleReg = {
            name: name,
            deps: dependencies,
            instance: null,
            started: false
        };
    
        if(typeof(moduleDef) === 'function'){
            moduleReg.factory = moduleDef;
        } else {
            //if not a factory, we can't inject deps!
            if(dependencies.length > 0){
                throw new Error('Module ' + name + ' registered with dependencies without factory');
            }
            //an Object or already configured service
            moduleReg.instance = moduleDef;
        }
        this._modules[name] = moduleReg;
    }

    getArgs(name) {
        let dep = name;
        switch(name[0]) {
            case '@':
                //object
                const key = name.substring(1);
                dep = this.get(key);
                break;
            default:
                break
        }

        return dep;
    }

    get(name) {
        var moduleReg = this._modules[name];

        if(!moduleReg) {
            throw new Error('Module ' + name + ' not found');
        }

        if(!moduleReg.instance){
            var moduleDeps = this.getDeps(moduleReg);
            if (this.isClass(moduleReg.factory)) {
                moduleReg.instance = new moduleReg.factory(moduleDeps);
                moduleReg.instance.prototype = moduleReg.factory.prototype;
            } else {
                moduleReg.instance = moduleReg.factory(moduleDeps);
            }

            if (!moduleReg.instance) {
                this._logger.warn('Factory did not instantiate anything for "' + name + '"');
            }
        }
        return moduleReg.instance;
    }

    isClass(func) {
        return typeof func === 'function';
    }

    remove(moduleName) {
        var moduleReg = this._modules[moduleName];
        if(moduleReg === undefined){
            //do nothing
            return;
        }
        if(moduleReg.instance){
            throw new Error('Module ' + moduleName + ' was already instantiated');
        }
        delete this._modules[moduleName];
    }

    swap(moduleName, deps, moduleDef){
        this.remove(moduleName);
        this.register(moduleName, deps, moduleDef);
    }

    getDeps(moduleRegistry){
        var res = [], self = this;
        moduleRegistry.deps.forEach(function(dep){
            if(dep === moduleRegistry.name){
                throw new Error('Module ' + dep + ' can\'t depend on itself');
            }
            res.push(self.getArgs(dep));
        });
    
        return res;
    }

    reset() {
        this._modules = {};
    }

    start(moduleName, options) {
        var instance, startRet;
        var mod = this._modules[moduleName];
        if(!mod){
            throw new Error('Module ' + moduleName + ' is not registered');
        }
        if(mod.started){
            return mod.instance;
        }
        instance = this.get(moduleName);
        if(!instance){
            throw new Error('Module ' + moduleName + ' failed to be instantiated');
        }
        if(typeof(instance.start) === 'function'){
            try {
                startRet = instance.start();
            }
            catch(err){
                throw new Error('Module ' + moduleName + ' failed to start: ' + err);
            }
        }
        if(options && !!options.async){
            if(typeof(startRet.then) !== 'function'){
                throw new Error('Module ' + moduleName + ' start() method does not return a Promise');
            }
    
            return startRet.then(function(){
                mod.started = true;
                return instance;
            });
        }
        else {
            mod.started = true;
            return instance;
        }
    }

    stop(moduleName) {
        var mod = this._modules[moduleName];
        if(!mod){ return; }
        if(!mod.instance || !mod.started) { return; }
        if(typeof(mod.instance.stop) === 'function'){
            mod.instance.stop();
        }
        mod.instance = null;
        mod.started = false;
    }

    startAll() {
        var moduleKeys = Object.keys(this._modules);
        moduleKeys.forEach(function(key){
            var moduleReg = this._modules[key];
            this.start(moduleReg.name);
        }, this);
    }

    stopAll() {
        var moduleKeys = Object.keys(this._modules);
        moduleKeys.forEach(function(key){
            var moduleReg = this._modules[key];
            this.stop(moduleReg.name);
        }, this);
    }

    debug() {
        this._logger.debug('** Container Modules **');
        var moduleKeys = Object.keys(this._modules);
        moduleKeys.forEach(function(key){
            var reg = this._modules[key];
            this._logger.debug(reg.name, 'instance: ', reg.instance !== undefined ? 'Yes':'No', 'factory:', reg.factory !== undefined ? 'Yes' : 'No');
        }, this);
        this._logger.debug('** Container finished **');
    }
}

export default Container;
