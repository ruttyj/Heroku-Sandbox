module.exports = class OrderedMap
{
    constructor()
    {
        this.mMap = new Map();
        this.mKey = null;
        this.length = 0;
    }

    setKeyField(field)
    {
      this.mKey = field;
    }

    add(value)
    {
      if(this.mKey) {
        this.set(value[this.mKey], value);
      } else {
        this.set(value, value);
      }
    }

    set(key, value)
    {
        this.mMap.set(key, value);

        this._updateLength();
    }

    inc(key, value=1)
    {
        const newVal = this.get(key, 0) + value;
        this.set(key, newVal);
        return newVal;
    }

    dec(key, value=1)
    {
        const newVal = this.get(key, 0) - value;
        this.set(key, newVal);
        return newVal;
    }

    has(key)
    {
        return this.mMap.has(key);
    }

    get(key, fallback=null)
    {
        if (this.has(key)) {
            return this.mMap.get(key);
        }
        return fallback;
    }

    remove(key)
    {
        if (this.has(key)) {
            const value = this.get(key);
            this.mMap.delete(key);
            return value;
        }

        this._updateLength();

        return null;
    }

    removeByValue(value)
    {
        let removedCount = 0;
        this.mMap.forEach((v, k) => {
            if (v === value) {
                removedCount += 1;
                this.mMap.delete(k);
            }
        })

        this._updateLength();

        return removedCount;
    }

    clear()
    {
        this.mMap.clear();
        this._updateLength();
    }

    getCount()
    {
        return this.mMap.size;
    }

    _updateLength()
    {
      this.length = this.getCount();
    }

    isEmpty()
    {
        return this.getCount() === 0;
    }

    forEach(fn)
    {
        this.mMap.forEach(fn);
    }

    map(fn)
    {
        let result = [];
        this.mMap.forEach((value, key) => {
            result.push(fn(value, key));
        });

        return result;
    }

    toArray()
    {
        return this.map((v) => v);
    }

    serialize()
    {
        let result = {
            items: {},
            order: [],
        }

        this.forEach((value, key) => {
            result.items[key] = value;
            result.order.push(key);
        })

        return result;
    }
}