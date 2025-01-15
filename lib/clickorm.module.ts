import { DynamicModule, Module } from "@nestjs/common";
import {
  ClickOrmModuleAsyncOptions,
  ModuleOptions,
} from "./module.opt.interface";
import { ClickOrmCoreModule } from "./clickorm-core.module";
import {
  DataSource,
  type DataSourceOpt,
  type EntityTarget,
} from "clickorm-clickhouse";
import { DEFAULT_DATASOURCE_NAME } from "./constants";
import { createClickOrmProviders } from "./clickorm.providers";

@Module({})
export class ClickOrmModule {
  public static forRoot(opt: ModuleOptions): DynamicModule {
    return {
      module: ClickOrmModule,
      imports: [ClickOrmCoreModule.forRoot(opt)],
    };
  }

  public static forRootAsync(opt: ClickOrmModuleAsyncOptions): DynamicModule {
    return {
      module: ClickOrmModule,
      imports: [ClickOrmCoreModule.forRootAsync(opt)],
    };
  }

  public static forFeature(
    entities: EntityTarget<any>[] = [],
    dataSource: DataSource | DataSourceOpt | string = DEFAULT_DATASOURCE_NAME
  ) {
    const providers = createClickOrmProviders(entities, dataSource);
    return {
      module: ClickOrmModule,
      providers: providers,
      exports: providers,
    };
  }
}
