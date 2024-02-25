import { PlatformSqliteService } from '@postero/mobile-backend';
import ExpoSQLiteDialect from '@expo/knex-expo-sqlite-dialect';

class ExpoSqliteService implements PlatformSqliteService {
  public async getKnexConfig() {
    return {
      client: ExpoSQLiteDialect,
      connection: {
        filename: 'postero.db',
      },
    };
  }
}

export default ExpoSqliteService;
