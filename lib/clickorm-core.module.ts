import {
  Global,
  Module,
  Logger,
  OnApplicationShutdown,
  DynamicModule,
  Provider,
  Type,
} from "@nestjs/common";
import { DataSource, type DataSourceOpt } from "clickorm-clickhouse";

import {
  ClickOrmModuleAsyncOptions,
  ClickOrmOptionsFactory,
  ModuleOptions,
} from "./module.opt.interface";
import { CLICKORM_MODULE_ID, CLICKORM_MODULE_PROVIDER } from "./constants";
import { getDataSourceToken } from "./utils/clickorm.utils";
import { randomUUID } from "crypto";

@Global()
@Module({})
export class ClickOrmCoreModule implements OnApplicationShutdown {
  private readonly logger = new Logger("ClickOrmModule");

  public static forRoot(opt: ModuleOptions): DynamicModule {
    const clickOrmModuleOptions = {
      provide: CLICKORM_MODULE_PROVIDER,
      useValue: opt,
    };
    const dataSourceProvider = {
      provide: getDataSourceToken(opt),
      useFactory: async () => await this.createDataSource(opt),
    };

    const providers = [dataSourceProvider, clickOrmModuleOptions];
    const exports = [dataSourceProvider];

    return {
      module: ClickOrmCoreModule,
      providers,
      exports,
    };
  }

  public static forRootAsync(
    options: ClickOrmModuleAsyncOptions
  ): DynamicModule {
    const dataSourceProvider = {
      provide: getDataSourceToken(options as DataSourceOpt),
      useFactory: async (opt: ModuleOptions) => {
        return await this.createDataSource(opt);
      },
      inject: [CLICKORM_MODULE_PROVIDER],
    };

    const asyncProviders = this.createAsyncProviders(options);
    const providers = [
      ...asyncProviders,
      dataSourceProvider,
      {
        provide: CLICKORM_MODULE_ID,
        useValue: randomUUID(),
      },
      ...(options.extraProviders || []),
    ];
    const exports: Array<Provider | Function> = [dataSourceProvider];

    return {
      module: ClickOrmCoreModule,
      providers,
      exports,
      imports: options.imports,
    };
  }

  private static createAsyncProviders(
    options: ClickOrmModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<ClickOrmOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: ClickOrmModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CLICKORM_MODULE_PROVIDER,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const inject = [
      (options.useClass || options.useExisting) as Type<ClickOrmOptionsFactory>,
    ];
    return {
      provide: CLICKORM_MODULE_PROVIDER,
      useFactory: async (optionsFactory: ClickOrmOptionsFactory) =>
        await optionsFactory.createTypeOrmOptions(options.name),
      inject,
    };
  }

  private static async createDataSource(opt: ModuleOptions) {
    return await DataSource.init(opt);
  }

  public async onApplicationShutdown() {
    this.logger.log(`Destroy clickorm module`);
  }
}
