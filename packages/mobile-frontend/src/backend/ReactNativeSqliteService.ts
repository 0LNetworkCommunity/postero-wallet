import { PlatformSqliteService } from '@postero/core';
import ExpoSQLiteDialect from '@expo/knex-expo-sqlite-dialect';

class ReactNativeSqliteService implements PlatformSqliteService {
  public async getKnexConfig() {
    return {
      client: ExpoSQLiteDialect,
      connection: {
        filename: 'postero.db',
      },
    };
  }
}

export default ReactNativeSqliteService;
