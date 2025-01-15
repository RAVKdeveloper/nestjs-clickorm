import { createHash } from "crypto";
import {
  DataSource,
  type EntityTarget,
  type DataSourceOpt,
} from "clickorm-clickhouse";

import { ModuleOptions } from "../module.opt.interface";
import { DEFAULT_DATASOURCE_NAME } from "../constants";

export function getDataSourceToken(opt: ModuleOptions | DataSource | string) {
  const strToHash: string = DEFAULT_DATASOURCE_NAME;
  const hash = createHash("sha256").update(strToHash).digest("base64");

  return hash;
}

export function getRepositoryToken(
  entity: EntityTarget<any>,
  dataSource?: string | DataSource | DataSourceOpt
) {
  const dataSourceStr = getDataSourceToken(dataSource);
  const separator = "__";

  if (typeof entity !== "function") {
    throw new Error("Entity must be class type!");
  }

  const entityName = entity.name;
  const strToHash = `${dataSourceStr}${separator}${entityName}`;
  const hash = createHash("sha256").update(strToHash).digest("base64");

  return hash;
}
