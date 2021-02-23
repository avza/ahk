const operations = {
  eq: (query, column, value, options) => options.isJoin ? query.on(column, value) : query.where(column, value),
  neq: (query, column, value, options) => options.isJoin ? query.on(column, '<>', value) : query.whereNot(column, value),
  gte: (query, column, value, options) => options.isJoin ? query.on(column, '>=', value) : query.where(column, '>=', value),
  gt: (query, column, value, options) => options.isJoin ? query.on(column, '>', value) : query.where(column, '>', value),
  lt: (query, column, value, options) => options.isJoin ? query.on(column, '<', value) : query.where(column, '<', value),
  lte: (query, column, value, options) => options.isJoin ? query.on(column, '<=', value) : query.where(column, '<=', value),
  in: (query, column, value, options) => options.isJoin ? query.onIn(column, value) : query.whereIn(column, value),
  nin: (query, column, value, options) => options.isJoin ? query.onNotIn(column, value) : query.whereNotIn(column, value),
  lk: (query, column, value, options) => options.isJoin ? query.on(column, 'like', `${value}`) : query.where(column, 'like', `${value}`),
  nlk: (query, column, value, options) => options.isJoin ? query.on(column, 'not like', `${value}`) : query.where(column, 'not like', `${value}`),
  btw: (query, column, value, options) => options.isJoin ? query.onBetween(column, value) : query.whereBetween(column, value),
  nbtw: (query, column, value, options) => options.isJoin ? query.onNotBetween(column, value) : query.whereNotBetween(column, value),
  isnull: (query, column, value, options) => {
    if (options.isJoin) {
      value ? query.onNull(column) : query.onNotNull(column)
    } else {
      value ? query.whereNull(column) : query.whereNotNull(column)
    }
  },
  or: (query, column, value, options) => options.isJoin ? query.orOn(query => handler(query, value, options)) : query.orWhere(query => handler(query, value, options))
}

function isObject (value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function handler (query, data, options) {
  Object.keys(data).forEach(key => {
    if (key === 'or') {
      operations.or(query, '', data[key], options)
    } else if (options.columnNames[key]) {
      const columnName = options.columnNames[key]/* ? options.columnNames[key] : key*/

      if (isObject(data[key])) {
        query[options.isJoin ? 'andOn' : 'andWhere'](query => {
          Object.keys(data[key]).forEach(operation => {
            const operator = operations[operation]

            if (operator) {
              operator(query, columnName, data[key][operation], options)
            }
          })
        })
      } else {
        const operator = Array.isArray(data[key]) ? operations.in : operations.eq
        operator(query, columnName, data[key], options)
      }
    }
  })
}

function Akh (builder, values, fields = {}, filterColumn = false) {
  if (!builder) {
    throw new Error('Knex not found')
  }

  if (isObject(values)) {
    handler(builder, values, { columnNames: fields, isJoin: builder.joinType, filterColumn })
  }
}

module.exports = Akh
