module.exports = {
    root: false,
    globals: {
        "$":true,
        "jQuery": true,
        "Editor": true
    },
    extends: [
        'plugin:vue/vue3-recommended',
    ],
    rules: {
        'space-before-function-paren': ['error', {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'always'
        }],
        'no-unused-vars' : ['error'],
        'no-debugger': 1,
        'no-console' : process.env.NODE_ENV === 'production' ? "error" : "off",
        'indent' : [ 'error', 4 ]
    }
}
