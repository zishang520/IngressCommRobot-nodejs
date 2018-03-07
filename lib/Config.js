/*jshint esversion: 6 */
(() => {
    'use strict';
    const fs = require('fs');
    // import fs from 'fs';
    class Config {
        /*!
         * [constructor 构造函数]
         * @Author    ZiShang520@gmail.com
         * @DateTime  2017-12-29T15:10:56+0800
         * @copyright (c) ZiShang520 All Rights Reserved
         * @param     {[type]} file_name [description]
         * @param     {[type]} option [description]
         * @return    {[type]} [description]
         */
        constructor(file_name, option) {
            this.file_name = file_name || '';
            this.arr = {};
            this.option = typeof option === 'object' ? option : {};
            if (fs.existsSync(this.file_name)) {
                try {
                    let arr = require(this.file_name);
                    this.arr = this.isJson(arr) ? arr : {};
                } catch (err) {
                    if (!(err instanceof SyntaxError)) {
                        throw new Error('Unexpected error type in json decode');
                    }
                    this.arr = {};
                }
            }
        }
        /*!
         * [isJson 判断是否为JSON]
         * @Author    ZiShang520@gmail.com
         * @DateTime  2017-12-29T15:11:12+0800
         * @copyright (c) ZiShang520 All Rights Reserved
         * @param     {[type]} obj [description]
         * @return    {Boolean} [description]
         */
        isJson(obj) {
            return (typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length);
        }
        /*!
         * [set 设置值]
         * @Author    ZiShang520@gmail.com
         * @DateTime  2017-12-29T15:11:30+0800
         * @copyright (c) ZiShang520 All Rights Reserved
         * @param     {[type]} name [description]
         * @param     {[type]} value [description]
         */
        set(name, value) {
            if (arguments.length == 1 && this.isJson(name)) {
                this.arr = this.merge(name);
            } else if (arguments.length == 2 && this.is_scalar(name)) {
                this.arr[name] = value;
            } else {
                this.arr = this.merge(arguments);
            }
            return this;
        }

        /*!
         * [del 删除制定值]
         * @Author    ZiShang520@gmail.com
         * @DateTime  2017-12-29T15:20:27+0800
         * @copyright (c) ZiShang520 All Rights Reserved
         * @param     {[type]} name [description]
         * @return    {[type]} [description]
         */
        del(name) {
            return delete this.arr[name];
        }
        /*!
         * [get 获取]
         * @Author    ZiShang520@gmail.com
         * @DateTime  2017-12-29T15:20:52+0800
         * @copyright (c) ZiShang520 All Rights Reserved
         * @param     {[type]} name [description]
         * @return    {[type]} [description]
         */
        get(name) {
            if (name === undefined) {
                return this.arr;
            }
            if (name in this.arr) {
                return this.arr[name];
            }
            return undefined;
        }

        /**
         * [save 保存文件]
         * @Author    ZiShang520@gmail.com
         * @DateTime  2017-12-29T15:24:22+0800
         * @copyright (c) ZiShang520 All Rights Reserved
         * @param     {[type]} call [description]
         * @return    {[type]} [description]
         */
        save(call) {
            let callback = (typeof call === 'function') ? call : function() {};
            let data = JSON.stringify(this.arr);
            if (this.option.hasOwnProperty('sync') && !!this.option.sync) {
                try {
                    fs.writeFileSync(this.file_name, data);
                    callback(true);
                } catch (e) {
                    callback(false, e);
                }
            } else {
                fs.writeFile(this.file_name, data, function(err) {
                    if (err) {
                        callback(false, err);
                    } else {
                        callback(true);
                    }
                });
            }
        }
        /*!
         * [is_scalar 判断是否为标量]
         * @Author    ZiShang520@gmail.com
         * @DateTime  2017-12-29T15:23:27+0800
         * @copyright (c) ZiShang520 All Rights Reserved
         * @param     {[type]} value [description]
         * @return    {Boolean} [description]
         */
        is_scalar(value) {
            return (/boolean|number|string/).test(typeof value);
        }
        /*!
         * [merge 合并]
         * @Author    ZiShang520@gmail.com
         * @DateTime  2017-12-29T15:13:10+0800
         * @copyright (c) ZiShang520 All Rights Reserved
         * @return    {[type]} [description]
         */
        merge() {
            let args = Array.prototype.slice.call(arguments),
                argl = args.length,
                arg,
                retObj = this.arr,
                k = '',
                argil = 0,
                j = 0,
                i = 0,
                ct = 0,
                toStr = Object.prototype.toString,
                retArr = true;
            for (i = 0; i < argl; i++) {
                if (!Array.isArray(args[i])) {
                    retArr = false;
                    break;
                }
            }

            if (retArr) {
                retArr = [];
                for (i = 0; i < argl; i++) {
                    retArr = retArr.concat(args[i]);
                }
                return retArr;
            }

            for (i = 0, ct = 0; i < argl; i++) {
                arg = args[i];
                if (Array.isArray(arg)) {
                    for (j = 0, argil = arg.length; j < argil; j++) {
                        retObj[ct++] = arg[j];
                    }
                } else {
                    for (k in arg) {
                        if (arg.hasOwnProperty(k)) {
                            if (parseInt(k, 10) + '' === k) {
                                retObj[ct++] = arg[k];
                            } else {
                                retObj[k] = arg[k];
                            }
                        }
                    }
                }
            }
            return retObj;
        }
    }
    module.exports = Config;
})();