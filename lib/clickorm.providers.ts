import { Provider } from "@nestjs/common";
import {
  DataSource,
  type DataSourceOpt,
  type EntityTarget,
} from "clickorm-clickhouse";
import { getDataSourceToken, getRepositoryToken } from "./utils/clickorm.utils";

export function createClickOrmProviders(
  entities?: EntityTarget<any>[],
  dataSource?: DataSource | DataSourceOpt | string
): Provider[] {
  return (entities || []).map((entity) => ({
    provide: getRepositoryToken(entity, dataSource),
    useFactory: (dataSource: DataSource) => {
      return dataSource.getRepo(entity);
    },
    inject: [getDataSourceToken(dataSource)],
  }));
}
