const isDef = (v) => v !== undefined && v !== null;
module.exports = class List
{
    constructor()
    {
        this.mList = [];
    }

    set(index, value)
    {
        this.mList[index] = value;
    }
    replaceAll(items)
    {
        this.clear();
        this.add(...items);
    }
    inc(index, value=1)
    {
        const newVal = this.get(index, 0) + value;
        this.set(newVal);
        return newVal;
    }
    dec(index, value=1)
    {
        const newVal = this.get(index, 0) - value;
        this.set(newVal);
        return newVal;
    }
    get(index=null, fallback=null)
    {
        if (isDef(index)) {
            if (isDef(this.mList[index]))
                return this.mList[index];
            return fallback;
        }
        return this.toArray();
    }
    getIndexOfItem(value)
    {
        return this.mList.findIndex((item) => item === value);
    }
    hasIndex(index)
    {
        return isDef(this.mList[index]);
    }
    hasValue(value)
    {
        const index = this.getIndexOfItem(value);
        return index > -1;
    }

    add(...items)
    {
        this.push(...items);
    }
    push(...items)
    {
        items.forEach((value) => {
            this.mList.push(value);
        })
    }
    pop()
    {
        return this.mList.pop();
    }
    shift()
    {
        return this.mList.shift();
    }
    unsift(...items)
    {
        items.forEach((value) => {
            this.mList.unshift(value);
        })
    }
    addToBeginning(...items)
    {
        this.unshift(...items);
    }
    addToEnd(...items){
        this.push(...items);
    }
    getAndRemoveFromEnd(){
        return this.pop();
    }
    getAndRemoveFromBeginning()
    {
        return this.shift();
    }
    getAndRemoveMultipleFromBeginning(num=1)
    {
        const result = [];
        let stopIndex = Math.min(num, this.getCount());
        for (let i = 0; i < stopIndex; ++i) {
            result.push(this.getAndRemoveFromBeginning());
        }

        return result;
    }

    getAndRemoveMultipleFromEnd(num=1)
    {
        const result = [];
        let stopIndex = Math.min(num, this.getCount());
        for (let i = 0; i < stopIndex; ++i) {
            result.push(this.getAndRemoveFromEnd());
        }

        return result;
    }

    removeItemByValue(value)
    {
        return this.removeItemByFn((item) => item === value);
    }
    removeItemsByValue(value)
    {
        this.removeItemsByFn((v) => v === value);
    }
    removeItemByIndex(index)
    {
        if (index > -1 && index < this.getCount()) {
            const item = this.mList[index];
            this.mList.splice(index, 1);
            return item;
        }
        return null;
    }
    removeItemsByFn(fn)
    {
        const items = [];
        this.mList.forEach((value, index) => {
            if (fn(value, index)) {
                items.push(value);
                // @TODO this can be optimized to splice consecutive indexes
                this.removeItemByIndex(index);
            }
        })

        return items;
    }
    removeItemByFn(fn)
    {
        const index = this.mList.findIndex(fn);
        return this.removeItemByIndex(index);
    }

    getCount()
    {
        return this.mList.length;
    }
    isEmpty()
    {
        return this.getCount() === 0;
    }

    toArray()
    {
        return [...this.mList];
    }
    forEach(fn)
    {
        this.mList.forEach(fn);
    }
    map(fn)
    {
        return this.mList.map(fn);
    }
    clear()
    {
        this.mList.length = 0;
    }

    shuffle()
    {
        const randomRange = function (min, max) {
            return Math.floor(Math.random() * max - min) + min;
        }

        const doShuffle = (temp) => {
            let lastIndex, selectedIndex;
            // Iterate from the end of the list to the beginning
            lastIndex = temp.length - 1;
            while (lastIndex > 0) {
                // Select a random index between the beginning and the iterator
                selectedIndex = randomRange(0, lastIndex);

                // Swap with selected item
                [temp[lastIndex], temp[selectedIndex]] = [
                    temp[selectedIndex],
                    temp[lastIndex],
                ];

                // progress the iterator
                --lastIndex;
            }
        };

        doShuffle(this.mList);

        // give the last item a chance of being last after being shuffled
        doShuffle(this.mList); 

        return this.mList;
    }

    serialize()
    {
        // @TODO account for possible nested objects with serialize functions
        return this.toArray();
    }
}