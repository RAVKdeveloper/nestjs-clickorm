import { type EntityTarget, DataSource } from "clickorm-clickhouse";
import { DEFAULT_DATASOURCE_NAME } from "../constants";
import { Inject } from "@nestjs/common";
import {
  getDataSourceToken,
  getRepositoryToken,
} from "../utils/clickorm.utils";

export const InjectRepo = (
  entity: EntityTarget<any>,
  dataSource: string = DEFAULT_DATASOURCE_NAME
): ReturnType<typeof Inject> => Inject(getRepositoryToken(entity, dataSource));

export const InjectDataSource = (
  dataSource: DataSource | string = DEFAULT_DATASOURCE_NAME
): ReturnType<typeof Inject> => Inject(getDataSourceToken(dataSource));
