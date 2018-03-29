export default {
  Query: {
    fields: {
      allPolls: {
        limit: (table, { limit }) => limit,
        orderBy: 'id',
        where: (table, empty, { key }) => `${table}.id > ${key}`,
      },
    },
  },
  Poll: {
    sqlTable: 'polls',
    uniqueKey: 'id',
    fields: {
      options: {
        sqlJoin: (pollTable, pollOptionsTable) => `${pollTable}.id = ${pollOptionsTable}."pollId"`,
      },
    },
  },
  PollOption: {
    sqlTable: '"poll_options"',
    uniqueKey: 'id',
  },
};
