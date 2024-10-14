import { defaultAdapter, UserAppConfig, createNodeblocksUserApp } from "@basaldev/blocks-user-service";
import * as handlers from  "./handlers/handlers";
import * as validators from  "./validators/validators";
import {config, database, up} from 'migrate-mongo';
import { DATABASE_NAME } from "./constant";
const path = require('path');
/**
 * Access to the configs set on the NBC dashboard based no the adapter manifest(nbc.adapter.json) by process.env
 * 
 * @example
 * const foo = process.env.ADAPTER_CUSTOM_FOO;
 */

type CreateUserDefaultAdapterDependencies = Parameters<typeof defaultAdapter.createUserDefaultAdapter>[1];

/**
 * A hook function called before the adapter is created
 * This hook can be used to customize the adapter configs
 * 
 * @param {defaultAdapter.UserDefaultAdapterOptions} currentOptions Adapter options set on the NBC dashboard
 * @param {CreateUserDefaultAdapterDependencies} currentDependencies Adapter dependencies set on the NBC dashboard
 * @returns {[defaultAdapter.UserDefaultAdapterOptions, CreateUserDefaultAdapterDependencies]} Updated adapter options and dependencies
 */
export function beforeCreateAdapter(
  currentOptions: defaultAdapter.UserDefaultAdapterOptions,
  currentDependencies: CreateUserDefaultAdapterDependencies): [defaultAdapter.UserDefaultAdapterOptions, CreateUserDefaultAdapterDependencies] {
  /**
   * Add new custom fields here
   * https://docs.nodeblocks.dev/docs/how-tos/customization/customizing-adapters#adding-new-custom-fields
   * 
   * @example
   * const updatedOptions = {
   *   ...currentOptions,
   *   customFields: {
   *     user: [ ... ]
   *   }
   * };
   */
  const updatedOptions = {
    ...currentOptions,
    customFields: {
      user: [
        {
          name: 'children',
          type: 'array' as const
        },
      ]
    }
  };

  /**
   * Replace third-party services here
   * https://docs.nodeblocks.dev/docs/how-tos/customization/customizing-adapters#replacing-third-party-services
   * 
   * @example
   * const updatedDependencies = {
   *   ...currentDependencies,
   *   mailService: new CustomMailProvider(),
   * };
   */
  const updatedDependencies = {
    ...currentDependencies
  };

  return [updatedOptions, updatedDependencies];
}

/**
 * A hook function called after the adapter is created
 * This hook can be used to customize the adapter instance
 * 
 * @param {defaultAdapter.UserDefaultAdapter} adapter Default adapter instance
 * @returns {defaultAdapter.UserDefaultAdapter} Updated adapter instance
 */
export function adapterCreated(adapter: defaultAdapter.UserDefaultAdapter): defaultAdapter.UserDefaultAdapter {
  /**
   * Customize handlers and validators for an existing endpoint here
   * https://docs.nodeblocks.dev/docs/how-tos/customization/customizing-adapters#customizing-handlers-and-validators-for-an-existing-endpoint
   * 
   * @example
   * const updatedAdapter = sdk.adapter.setValidator(adapter, 'createUser', 'nameUnique', async (logger, context) => {
   *   ...
   *   return sdk.util.StatusCodes.OK;
   * });
   */
  const updatedAdapter = adapter;

  return updatedAdapter;
}

/**
 * A hook function called before the service is created
 * This hook can be used to customize the service configs
 * 
 * @param {UserAppConfig} currentConfigs Service configs set on the NBC dashboard
 */
export function beforeCreateService(currentConfigs: UserAppConfig): UserAppConfig {
  /**
   * Customize service options including CORS options here
   * 
   * @example
   * const updatedConfigs = {
   *   ...currentConfigs,
   *   corsOptions: {
   *     origin: '*',
   *   }
   * };
   */
  const updatedConfigs = {
    ...currentConfigs
  };

  return updatedConfigs;
}

/**
 * A hook function called after the service is created
 * This hook can be used to perform any post service creation tasks
 */
export function serviceCreated() {
  config.set({
    mongodb: {
      url: process.env.ADAPTER_DATABASE_URL,
      databaseName: DATABASE_NAME,
    },
    migrationsDir: path.resolve(__dirname),
    changelogCollectionName: "changelog",
    migrationFileExtension: ".ts",
    useFileHash: false,
  });
}

type StartServiceArgs = Parameters<ReturnType<typeof createNodeblocksUserApp>['startService']>;
type ServiceOpts = StartServiceArgs[0];

/**
 * A hook function called before the service is started
 * This hook can be used to customize the options for starting the service
 * 
 * @param {ServiceOpts} currentOptions Service options
 * @returns {StartServiceArgs} Updated service start args
 */
export function beforeStartService(currentOptions: ServiceOpts): StartServiceArgs {
  /**
   * Add new api endpoints here
   * https://docs.nodeblocks.dev/docs/how-tos/customization/customizing-adapters#adding-new-api-endpoints
   * 
   */

  const updatedOptions = {
    ...currentOptions,
    customRoutes: [
      {
        handler: handlers.get_children_handler,
        method: 'get' as const,
        path: '/children/get',
        validators: [
          validators.get.validate_parent_id
        ]
      },
      {
        handler: handlers.get_subjects_handler,
        method: 'get' as const,
        path: '/subjects/get',
        validators: [
        ]
      },
      {
        handler: handlers.create_child_handler,
        method: 'post' as const,
        path: '/children/create',
        validators: [
          validators.post.validate_parent_id,
          validators.post.validate_child_name,
          validators.post.validate_child_bday,
          validators.post.validate_subject_list
        ]
      },
      {
        handler: handlers.get_tasks_handler,
        method: 'get' as const,
        path: '/tasks/get',
        validators: [
          validators.post.validate_child_id 
        ]
      },  
      {
        handler: handlers.add_task_handler,
        method: 'post' as const,
        path: '/tasks/add',
        validators: [
          validators.post.validate_child_id,
          validators.post.validate_subject_id,
          validators.post.validate_completed_flag,
          validators.post.validate_date, 
        ]
      },
      {
        handler: handlers.deactivate_task_handler,
        method: 'post' as const,
        path: '/tasks/deactivate',
        validators: [
          validators.post.validate_task_id
        ]
      },
      {
        handler: handlers.complete_task_handler,
        method: 'post' as const,
        path: '/tasks/complete',
        validators: [
          validators.post.validate_task_id
        ]
      },
      {
        handler: handlers.complete_active_tasks_handler,
        method: 'post' as const,
        path: '/tasks/complete_active',
        validators: [
          validators.post.validate_child_id
        ]
      },
      {
        handler: handlers.add_review_handler,
        method: 'post' as const,
        path: '/reviews/add',
        validators: [
          validators.post.validate_child_id,
          validators.post.validate_date, 
          validators.post.validate_subject_id,
          validators.post.validate_task_id,
          validators.post.validate_duration
        ]
      },
      {
        handler: handlers.get_reviews_handler,
        method: 'get' as const,
        path: '/reviews/get',
        validators: [
          validators.get.validate_child_id,
          validators.get.validate_subject_id
        ]
      }
    ]
  };
  return [updatedOptions];
}

/**
 * A hook function called after the service is started
 * This hook can be used to perform any post service starting tasks
 */
export function serviceStarted() {   
  const migrateDatabase = async () => {
    const { db, client } = await database.connect();
    await up(db, client);
  }
  migrateDatabase();
}
