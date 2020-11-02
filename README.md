<h1 align="center">
	AHK
</h1>

A handler to add conditions on Knex queries.

Install
---

```bash
npm install ahk --save
```

Using
---
```js
const Ahk = require('ahk')
```

Operators
---
|name|description|
|---|:---:|
|eq|equal|
|neq|not equal|
|gte|greater than or equal|
|gt|greater than|
|lt|less than|
|lte|less than or equal|
|in|in|
|nin|not in|
|lk|like|
|nlk|not like|
|btw|between|
|nbtw|not between|
|isnull|is null / is not null|
|or|or|

Examples
---

```js
// Operator EQ
const filter = {
	param1: {
		eq: 2
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (`param1` = 2)
```

```js
// Operator NEQ
const filter = {
	param1: {
		neq: 2
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (not `param1` = 2)
```

```js
// Operator GT
const filter = {
	param1: {
		gt: 5
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (`param1` > 5)
```

```js
// Operator GTE
const filter = {
	param1: {
		gte: 5
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (`param1` >= 5)
```

```js
// Operator LT
const filter = {
	param1: {
		lt: 5
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (`param1` < 5)
```

```js
// Operator LTE
const filter = {
	param1: {
		lte: 5
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (`param1` <= 5)
```

```js
// Operator LK
const filter = {
	param1: {
		lk: 'za%'
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (`param1` like 'za%')
```

```js
// Operator NLK
const filter = {
	param1: {
		nlk: 'za%'
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (`param1` not like 'za%')
```

```js
// Operator IN
const filter = {
	param1: {
		in: [1, 2, 3]
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (`param1` in (1, 2, 3))
```
```js
// Operator NIN
const filter = {
	param1: {
		nin: [1, 2, 3]
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (`param1` not in (1, 2, 3))
```
```js
// Operator BTW
const filter = {
	param1: {
		btw: [10, 20]
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (`param1` between 10 and 20)
```
```js
// Operator NBTW
const filter = {
	param1: {
		nbtw: [10, 20]
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (`param1` not between 10 and 20)
```

```js
// Operator ISNULL
const filter = {
	param1: {
		isnull: true
	},
	param2: {
		isnull: false
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (`param1` is null) and (`param2` is not null)
```

```js
// Operator OR
const filter = {
	param1: 1,
	or: {
		param2: {
			eq: 'za%'
		}
	}
}

const query = knex('table').modify(builder => Ahk(builder, filter))

// RESULT
// select * from table where (`param1` = 1) or (`param2` like 'za%')
```
