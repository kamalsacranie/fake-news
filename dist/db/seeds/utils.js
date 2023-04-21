"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatComments = exports.createRef = exports.convertTimestampToDate = void 0;
const convertTimestampToDate = (_a) => {
    var { created_at } = _a, otherProperties = __rest(_a, ["created_at"]);
    if (!created_at)
        return Object.assign({}, otherProperties);
    return Object.assign({ created_at: new Date(created_at) }, otherProperties);
};
exports.convertTimestampToDate = convertTimestampToDate;
const createRef = (arr, 
// this is temporary i didn't want to modify any functionality while convertint to ts
key = "title", value = "article_id") => {
    return arr.reduce((ref, element) => {
        ref[element[key]] = element[value];
        return ref;
    }, {});
};
exports.createRef = createRef;
// this needs lots of fucking work
const formatComments = (comments, idLookup) => {
    return comments.map((_a) => {
        var { author, article_id } = _a, restOfComment = __rest(_a, ["author", "article_id"]);
        // const article_id = idLookup[belongs_to];
        return Object.assign({ article_id,
            author }, (0, exports.convertTimestampToDate)(restOfComment));
    });
};
exports.formatComments = formatComments;
