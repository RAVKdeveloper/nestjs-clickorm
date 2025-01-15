import { ModuleMetadata, Provider, Type } from "@nestjs/common";
import { DataSource, type DataSourceOpt } from "clickorm-clickhouse";

export interface ModuleOptions extends DataSourceOpt {}

export interface ClickOrmOptionsFactory {
  createTypeOrmOptions(
    connectionName?: string
  ): Promise<ModuleOptions> | ModuleOptions;
}

export type ClickOrmDataSourceFactory = (
  options?: ModuleOptions
) => Promise<DataSource>;

export interface ClickOrmModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  name?: string;
  useExisting?: Type<ClickOrmOptionsFactory>;
  useClass?: Type<ClickOrmOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<ClickOrmOptionsFactory> | ClickOrmOptionsFactory;
  dataSourceFactory?: ClickOrmDataSourceFactory;
  inject?: any[];
  extraProviders?: Provider[];
}
