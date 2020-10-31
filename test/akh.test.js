const Knex = require('knex')({ client: 'sqlite3', useNullAsDefault: true })
const Akh = require('../lib/akh')

describe('Akh Instance', () => {
  test('Should return error when the knex instance not found', () => {
    expect(Akh).toThrowError('Knex not found')
  })
})

describe('Filter Implementation', () => {
  test('Should not add condition when the filter is not passed', () => {
    const query = Knex('profiles').modify(builder => Akh(builder))
    expect(query.toString()).toBe('select * from `profiles`')
  })

  test('Should not add condition when the filter empty is passed', () => {
    const query = Knex('profiles').modify(builder => Akh(builder, {}))
    expect(query.toString()).toBe('select * from `profiles`')
  })

  test('Should build simple query', () => {
  	const filter = {
  		id: 1,
  		name: 'avza',
  		surname: null,
  		hobbies: ['soccer', 'volleyball']
  	}

  	const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where `id` = 1 and `name` = \'avza\' and `surname` is null and `hobbies` in (\'soccer\', \'volleyball\')')
  })

  test('Should build query with operator "equal"', () => {
    const filter = { id: { eq: 1 } }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where (`id` = 1)')
  })

  test('Should build query with operator "not equal"', () => {
    const filter = { id: { neq: 1 } }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where (not `id` = 1)')
  })

  test('Should build query with operator "like"', () => {
    const filter = {
      name: { lk: '%av' },
      surname: { lk: 'za%' },
      login: { lk: '%avza%' }
    }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where (`name` like \'%av\') and (`surname` like \'za%\') and (`login` like \'%avza%\')')
  })

  test('Should build query with operator "not like"', () => {
    const filter = { name: { nlk: '%av' } }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where (`name` not like \'%av\')')
  })

  test('Should build query with operator "in"', () => {
    const filter = { id: { in: [1, 2] } }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where (`id` in (1, 2))')
  })

  test('Should build query with operator "not in"', () => {
    const filter = { id: { nin: [1, 2] } }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where (`id` not in (1, 2))')
  })

  test('Should build query with operator "between"', () => {
    const filter = { id: { btw: [1, 2] } }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where (`id` between 1 and 2)')
  })

  test('Should build query with operator "not between"', () => {
    const filter = { id: { nbtw: [1, 2] } }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where (`id` not between 1 and 2)')
  })

  test('Should build query with operators "gte" and "lte"', () => {
    const filter = {
      id: {
        gte: 1,
        lte: 5
      }
    }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where (`id` >= 1 and `id` <= 5)')
  })

  test('Should build query with operators "gt" and "lt"', () => {
    const filter = {
      id: {
        gt: 1,
        lt: 5
      }
    }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where (`id` > 1 and `id` < 5)')
  })

  test('Should build query with operators "isnull"', () => {
    const filter = {
      name: {
        isnull: false
      },
      surname: {
        isnull: true
      }
    }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where (`name` is not null) and (`surname` is null)')
  })

  test('Should build query with connector OR', () => {
    const filter = {
      name: 'avza',
      or: {
        surname: 'avza'
      }
    }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where `name` = \'avza\' or (`surname` = \'avza\')')
  })

  test('Should build query with connector OR inside another OR', () => {
    const filter = {
      id: 1,
      or: {
        name: 'avza',
        or: {
          surname: 'avza'
        }
      }
    }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where `id` = 1 or (`name` = \'avza\' or (`surname` = \'avza\'))')
  })

  test('Should build complex query', () => {
    const filter = {
      id: {
        in: [1, 2]
      },
      or: {
        id: {
          gte: 5,
          lte: 9
        }
      },
      name: 'avza',
      surname: {
        lk: 'za%'
      }
    }

    const query = Knex('profiles').modify(builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` where (`id` in (1, 2)) or ((`id` >= 5 and `id` <= 9)) and `name` = \'avza\' and (`surname` like \'za%\')')
  })

  test('Should build query with custom name', () => {
    const filter = {
      id: 1,
      name: { lk: '%avza%' },
      or: { age: 22 }
    }

    const columnNames = { id: 'profile_id', name: 'fullname' }

    const query = Knex('profiles').modify(builder => Akh(builder, filter, columnNames))
    expect(query.toString()).toBe('select * from `profiles` where `profile_id` = 1 and (`fullname` like \'%avza%\') or (`age` = 22)')
  })

  test('Should build simple query with join and operator "eq" and "neq"', () => {
    const filter = {
      id: 1,
      name: {
        neq: 'avza'
      }
    }

    const query = Knex('profiles').innerJoin({ g: 'games' }, builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` inner join `games` as `g` on `id` = 1 and (`name` <> `avza`)')
  })

  test('Should build simple query with join and operator "gte" and "lte"', () => {
    const filter = {
      id: {
        gte: 1,
        lte: 8
      }
    }

    const query = Knex('profiles').innerJoin({ g: 'games' }, builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` inner join `games` as `g` on (`id` >= 1 and `id` <= 8)')
  })

  test('Should build simple query with join and operator "gt" and "lt"', () => {
    const filter = {
      id: {
        gt: 1,
        lt: 8
      }
    }

    const query = Knex('profiles').innerJoin({ g: 'games' }, builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` inner join `games` as `g` on (`id` > 1 and `id` < 8)')
  })

  test('Should build simple query with join and operator "in" and "nin"', () => {
    const filter = {
      id: {
        in: [1, 2, 3]
      },
      type_id: {
        nin: [1, 2, 3, 4, 5]
      }
    }

    const query = Knex('profiles').innerJoin({ g: 'games' }, builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` inner join `games` as `g` on (`id` in (1, 2, 3)) and (`type_id` not in (1, 2, 3, 4, 5))')
  })

  test('Should build simple query with join and operator "lk" and "nlk"', () => {
    const filter = {
      name: {
        lk: 'za%'
      },
      surname: {
        nlk: '%tb'
      }
    }

    const query = Knex('profiles').innerJoin({ g: 'games' }, builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` inner join `games` as `g` on (`name` like `za%`) and (`surname` not like `%tb`)')
  })

  test('Should build simple query with join and operator "in" and "nin"', () => {
    const filter = {
      id: {
        btw: [1, 10]
      },
      type_id: {
        nbtw: [1, 5]
      }
    }

    const query = Knex('profiles').innerJoin({ g: 'games' }, builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` inner join `games` as `g` on (`id` between 1 and 10) and (`type_id` not between 1 and 5)')
  })

  test('Should build simple query with join and operator "is null"', () => {
    const filter = {
      id: {
        isnull: false
      },
      type_id: {
        isnull: true
      }
    }

    const query = Knex('profiles').innerJoin({ g: 'games' }, builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` inner join `games` as `g` on (`id` is not null) and (`type_id` is null)')
  })

  test('Should build simple query with join and operator "OR"', () => {
    const filter = {
      name: 'avza',
      or: {
        surname: {
          isnull: true
        }
      }
    }

    const query = Knex('profiles').innerJoin({ g: 'games' }, builder => Akh(builder, filter))
    expect(query.toString()).toBe('select * from `profiles` inner join `games` as `g` on `name` = `avza` or ((`surname` is null))')
  })
})
