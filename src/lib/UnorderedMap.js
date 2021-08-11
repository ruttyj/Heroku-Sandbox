module.exports = class UnorderedMap
{
    constructor()
    {
        this.mMap = new Map();
    }

    set(key, value)
    {
        this.mMap.set(key, value);
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

        return removedCount;
    }
    clear()
    {
        this.mMap.clear();
    }
    getCount()
    {
        return this.mMap.size;
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
        let result = {}

        this.forEach((value, key) => {
            result[key] = value;
        })

        return result;
    }
}