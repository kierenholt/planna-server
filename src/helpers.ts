import { Request } from "express";


export class Helpers {

    /***
     * converts query string to space separated list of keys, ignores values
     */
    static paramsToString(req: Request): string {
        let ret = "";
        for (let key in req.query) {
            ret += key + " ";
        }
        return ret;
    }
    
    //HASHING
    //http://programmers.stackexchange.com/questions/49550/which-hashing-algorithm-is-best-for-uniqueness-and-speed
    static objToHash(obj: any, hash?: number) {
      if (hash == undefined) { hash = 34898410941; }
      return this.stringToHash(JSON.stringify(obj), hash);
    }
  
    static stringToHash(str: string, hash?: number) {
      if (hash == undefined) { hash = 34898410941 };
      if (str.length == 0) {
        return hash;
      }
      for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    }
  
  
    static createUID() {
      return 'ID' + Math.random().toString(36).substr(2, 16);
    }
  
    //arrays
    static shuffleInPlace(a: any[], random: KRandom) {
      for (var i = a.length - 1; i > 0; i--) {
        let index = random.next(i);
        a.push(a.splice(index, 1)[0]);
        //this.appendChildElement(this._childNodes[random.next(this._childNodes.length)]);
      }
      return a;
    }
  
    static toShuffled(a: any[], random: KRandom) {
      let ret = [];
      for (let item of a) {
        let index = random.next(a.length);
        while (ret[index]) { index++; index %= a.length }
        ret[index] = item;
      }
      return ret;
    }
  
    //strings
  
    static trimChar(str: string, char: string) {
      var i = 0;
      while (i < str.length && str[i] == char) {
        i++;
      }
      if (i == str.length) {
        return "";
      }
      var j = str.length - 1;
      while (j >= 0 && str[j] == char) {
        j--;
      }
      return str.substring(i, j + 1);
    }
  
    static IsStringNullOrEmpty(str: string) {
      return (str == undefined || str == null || typeof (str) != "string" || str.length === 0 || !str.trim());
    };
  
    static IsStringNullOrWhiteSpace(str: string) {
      return str == undefined || str == null || typeof (str) != "string" || str == "" || str.trim().length == 0;
    }
  
  
    static startsWith(a: string, ai: number, b: string, bi: number): boolean {
      if (ai == 0 && bi != 0) {
        return false;
      }
      if (bi == 0) {
        return a[ai] == b[bi];
      }
      return a[ai] == b[bi] && this.startsWith(a, ai - 1, b, bi - 1);
    }
  
    static replaceAll(within: string, toReplace: string, replaceWith: string) {
      var ret = "";
      var i = 0;
      var toReplaceLength = toReplace.length;
      while (i < within.length) {
        if (this.startsWith(within, i + toReplaceLength - 1, toReplace, toReplaceLength - 1)) {
          ret += replaceWith;
          i += toReplaceLength;
        }
        else {
          ret += within[i];
          i += 1;
        }
      }
      return ret;
    }
  
  
    static stripQuotes(str: string) {
      if (str.charAt(0) === '"' && str.charAt(str.length - 1) === '"') {
        return str.substr(1, str.length - 2);
      }
      return str.toString();
    }
  
  
    //numbers
    static removeCrazySigFigs(n: string): string {
      return Number(parseFloat(n).toPrecision(12)).toString();
    }
  
    static isNumeric(str: any) {
      return !isNaN(parseFloat(str)) && isFinite(str);
    }
  
  
    static getDomainFromUrl(url: string) {
      var a = document.createElement('a');
      a.setAttribute('href', url);
      return a.hostname;
    }
  
    //ARRAYS
    static insertAfter(arr: any[], ref: any, item: any) {
      let index = arr.indexOf(ref);
      if (index == -1) throw ("reference item not found in array");
      arr = arr.splice(index + 1, 0, item);
    }
  
    static insertBefore(arr: any, ref: any, item: any) {
      let refIndex = arr.indexOf(ref);
      if (refIndex == -1) throw ("reference item not found in array");
      arr = arr.splice(refIndex, 0, item);
    }
  
    static deepInsertBefore(arr: any, ref: any, item: any) {
      let refIndex = this.deepIndexOf(arr, ref);
      if (refIndex == -1) throw ("reference item not found in array");
      arr = arr.splice(refIndex, 0, item);
    }
  
    static getUniqueItems<T>(arr: T[]): T[] {
      let ret: T[] = [];
      for (let item of arr) {
        if (ret.indexOf(item) == -1) ret.push(item);
      }
      return ret;
    }
  
    static replaceItem<T>(arr: T[], oldItem: T, newItem: T) {
      this.removeFromArray(arr, newItem);
      let index = arr.indexOf(oldItem);
      if (index != -1) arr[index] = newItem;
    }
  
    static deepIndexOf<T>(arr: T[], item: T): number {
      for (let i = 0; i < arr.length; i++) {
        if (this.deepCompare(item, arr[i])) return i;
      }
      return -1;
    }
  
    static deepReplaceItem<T>(arr: T[], oldItem: T, newItem: T) {
      let index = this.deepIndexOf(arr, oldItem);
      if (index != -1) arr[index] = newItem;
    }
  
    static getItemImmediatelyBefore<T>(arr: T[], after: T) {
      let index = arr.indexOf(after);
      return index == -1 ? undefined : arr[index - 1];
    }
  
    static getItemImmediatelyAfter<T>(arr: T[], after: T) {
      let index = arr.indexOf(after);
      return index == -1 ? undefined : arr[index + 1];
    }
  
    static getRandomItem<T>(arr: T[]) {
      let index = Math.floor(Math.random() * arr.length);
      return arr[index];
    }
  
    //removes all instances not just the first
    static removeFromArray<T>(array: T[], item: T) {
      for (let i = array.length; i >= 0; i--) {
        if (array[i] == item) { array.splice(i, 1); }
      }
    }
  
    //removes one instance
    static removeFromArrayOnce<T>(array: T[], item: T) {
      for (let i = array.length; i >= 0; i--) {
        if (array[i] == item) { array.splice(i, 1); return; }
      }
    }
  
    static deepRemoveFromArrayOnce<T>(array: T[], item: T) {
      for (let i = array.length; i >= 0; i--) {
        if (this.deepCompare(array[i], item)) { array.splice(i, 1); return; }
      }
    }
  
    static deepRemoveFromArray<T>(array: T[], item: T) {
      for (let i = array.length; i >= 0; i--) {
        if (this.deepCompare(item, array[i])) { array.splice(i, 1); }
      }
    }
  
    static lowerCaseLetterFromIndex(i: number) { return String.fromCharCode(97 + i); }
  
    static lengthOfObject(obj: any) {
      let ret = 0;
      for (let key in obj) { ret++ }
      return ret;
    }
  
    static getValuesFromObject(obj: any) {
      let ret = [];
      for (let key in obj) { ret.push(obj[key]) }
      return ret;
    }
  
    static getKeysFromObject(obj: any) {
      let ret = [];
      for (let key in obj) { ret.push(key) }
      return ret;
    }
  
    static getKeyFromValue(obj: any, value: any) {
      for (let key in obj) { if (obj[key] == value) return key }
    }
  
    static mergeObjects(obj1: any, obj2: any) {
      let ret: any = {};
      for (let key in obj1) {
        ret[key] = obj1[key];
      }
      for (let key in obj2) {
        ret[key] = obj2[key];
      }
      return ret;
    }
  
    static copyObject(obj1: any) {
      return JSON.parse(JSON.stringify(obj1))
    }
  
    static deepCompare(obj1: any, obj2: any) {
      if (typeof (obj1) != typeof (obj2)) return false;
      if (typeof (obj1) == "object") {
        for (let key in obj1) {
          if (!(key in obj2) || !this.deepCompare(obj1[key], obj2[key])) return false;
        }
        return true;
      }
      return obj1 == obj2;
  
    }
  
    static deepRemoveDuplicatesUsingHash(arr: any) {
      let obj: any = {};
      for (let i = 0; i < arr.length; i++) {
        obj[arr[i].toString()] = arr[i];
      }
      return this.getValuesFromObject(obj);
    }
    
    static alphaIndex(str: string): number { //lowercase only!!!
      if (this.isLowerAlpha(str)) { return str.charCodeAt(0) - 97; }
      if (this.isUpperAlpha(str)) { return str.charCodeAt(0) - 65; }
      throw new Error("function alphaindex called on non alphanumeric string");
    };
  
    static isAlpha(str: string): boolean {
      var code = str.charCodeAt(0);
      return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    };
  
    static isLowerAlpha(str: string): boolean {
      var code = str.charCodeAt(0);
      return (code >= 97 && code <= 122);
    };
  
    static isUpperAlpha(str: string): boolean {
      var code = str.charCodeAt(0);
      return (code >= 65 && code <= 90);
    };
  };
  
  
  /**
   * Creates a pseudo-random value generator. The seed must be an integer.
   *
   * Uses an optimized version of the Park-Miller PRNG.
   * http://www.firstpr.com.au/dsp/rand31/
   */
  export class KRandom {
    _seed: number;
    constructor(seed: number = 0) {
      if (!seed) { this._seed = KRandom.generateSeed() }
      else { this._seed = seed }
      this._seed = this._seed % 2147483647;
      if (this._seed <= 0) this._seed += 2147483646;
      //console.log(this._seed);
    }
  
    //0 inclusive to limit exclusive
    next(limit?: any) {
      if (limit == undefined) {
        limit = 2147483647;
      }
      this._seed = this._seed * 16807 % 2147483647;
      return this._seed % limit;
    }
  
    static generateSeed(): number {
      let now = new Date();
      let seed = now.getTime();
      seed = seed % 2147483647;
      if (seed <= 0) seed += 2147483646;
      return seed;
    }
  
    getRandomMember(arr: any[]) {
      let index = this.next(arr.length);
      return arr[index];
    }
  
    getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(this.next(max - min + 1) + min); // Max and min are inclusive
    }
  }
  
  