const { Router } = require('express')
const Employee = require('../models/Employee')
const router = Router()
const redisClient = require('../redisClient.js')
const { promisify } = require('util')

const redisFlushAsync = promisify(redisClient.flushall).bind(redisClient)

router.get('/flush-cache', async (_, res) => {
  try {
    await redisFlushAsync()
    res.json({ message: 'Cache cleared' })
  } catch (e) {
    res.status(500).json({ message: "Can't flush cache", error: e.message })
  }
})

router.get('/client-model', async (_, res) => {
  try {
    redisClient.get('allemployees', async (err, employees) => {
      if (err) throw err
      if (employees) {
        res.status(200).json(JSON.parse(employees))
      } else {
        const employees = await Employee.find({})
        redisClient.setex('allemployees', 3600, JSON.stringify(employees))
        res.status(200).json(employees)
      }
    })
  } catch (e) {
    res
      .status(500)
      .json({ message: "Can't get employees! Server error", error: e.message })
  }
})

router.post('/infinite-model', async (req, res) => {
  const { startRow, endRow, sortModel = [], filterModel = {} } = req.body

  const queryPipeline = []

  const isFiltering = Object.keys(filterModel).length > 0
  const isSorting = sortModel.length > 0

  if (isFiltering) buildQueryPipeline(filterModel, queryPipeline)

  const query = Employee.aggregate(queryPipeline)

  if (isSorting) {
    const sortQuery = {}
    sortModel.forEach(({ colId, sort }) => {
      const ascending = sort === 'asc' ? 1 : -1
      sortQuery[colId] = ascending
    })
    query.sort(sortQuery).collation({ numericOrdering: true, locale: 'en' })
  }

  try {
    const rows = await query.skip(startRow).limit(endRow - startRow)
    const lastRowIndex = getLastRowIndex(startRow, endRow, rows.length)
    res.status(200).json({ rows, lastRowIndex })
  } catch (e) {
    res
      .status(500)
      .json({ message: "Can't get employees! Server error", error: e.message })
  }
})

function getLastRowIndex(startRow, endRow, rowsLength) {
  let lastRowIndex
  if (!rowsLength || rowsLength == 0) {
    lastRowIndex = null
  }
  const currentLastRow = startRow + rowsLength
  lastRowIndex = currentLastRow < endRow ? currentLastRow : -1
  return lastRowIndex
}

function buildQueryPipeline(filterModel, queryPipeline) {
  const queries = getQueries(filterModel)
  queries.forEach((query) => {
    const mongoQueryObject = createQueryObject(query)
    queryPipeline.push(mongoQueryObject)
  })
}

function getQueries(filterModel) {
  const queries = []
  for (key in filterModel) {
    const query = {
      columnName: key,
      filterType: filterModel[key].filterType,
      operator: translateToMongoOperand(filterModel[key].type),
      filterValue: filterModel[key].filter,
    }
    queries.push(query)
  }
  return queries
}

function createQueryObject(query) {
  const columnQuery = {}
  let { columnName, operator, filterValue } = query
  if (operator === '$regex') {
    filterValue = `.*${filterValue}.*`
    columnQuery.$options = 'i'
  }
  columnQuery[operator] = filterValue

  return {
    $match: {
      [columnName]: columnQuery,
    },
  }
}

function translateToMongoOperand(operand) {
  switch (operand) {
    case 'equals':
      return '$eq'
    case 'greaterThan':
      return '$gt'
    case 'lessThan':
      return '$lt'
    case 'contains':
      return '$regex'
    default:
      return ''
  }
}

module.exports = router
