/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_aiProvider from "../actions/aiProvider.js";
import type * as actions_imageGenerator from "../actions/imageGenerator.js";
import type * as actions_ingestRss from "../actions/ingestRss.js";
import type * as actions_seedNamibiaGuide from "../actions/seedNamibiaGuide.js";
import type * as actions_synthesizeStory from "../actions/synthesizeStory.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as mutations from "../mutations.js";
import type * as mutationsAdmin from "../mutationsAdmin.js";
import type * as queries from "../queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/aiProvider": typeof actions_aiProvider;
  "actions/imageGenerator": typeof actions_imageGenerator;
  "actions/ingestRss": typeof actions_ingestRss;
  "actions/seedNamibiaGuide": typeof actions_seedNamibiaGuide;
  "actions/synthesizeStory": typeof actions_synthesizeStory;
  crons: typeof crons;
  http: typeof http;
  mutations: typeof mutations;
  mutationsAdmin: typeof mutationsAdmin;
  queries: typeof queries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
