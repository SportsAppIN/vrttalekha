module.exports = {
	env: {
		'commonjs': true,
		'es2021': true,
		'node': true
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 12
	},
	globals: {
		'ClientError': 'readonly'
	},
	rules: {
		indent: [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		quotes: [
			'error',
			'single'
		],
		semi: [
			'error',
			'always'
		],
		'no-unused-vars': [
			'error',
			{
				vars: 'all',
				args: 'all',
				argsIgnorePattern: '^_',
				caughtErrors: 'all'
			}
		],
		'no-undef': 'error',
		'valid-jsdoc': [
			'error',
			{
				requireParamDescription: false,
				requireReturnDescription: false,
				requireReturn: false
			}
		],
		'eol-last': [
			'error',
			'always'
		],
		'no-multiple-empty-lines': [
			'error',
			{
				max: 2,
				maxEOF: 1
			}
		]
	}
};
