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
        junction: {
          sqlTable: '"pollOptions"',
          include: {
            primary: {
              sqlColumn: 'primary',
            },
          },
          sqlJoins: [
            (pollTable, junctionTable) => `${pollTable}.id = ${junctionTable}."pollId"`,
            (junctionTable, pollOptionTable) => `${junctionTable}."pollId" = ${pollOptionTable}.id`,
          ],
        },
      },
    },
  },
};
