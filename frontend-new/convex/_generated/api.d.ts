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
import type * as actions_backfillBodies from "../actions/backfillBodies.js";
import type * as actions_backfillContent from "../actions/backfillContent.js";
import type * as actions_backfillImages from "../actions/backfillImages.js";
import type * as actions_cleanupDatabase from "../actions/cleanupDatabase.js";
import type * as actions_imageGenerator from "../actions/imageGenerator.js";
import type * as actions_imageProcessor from "../actions/imageProcessor.js";
import type * as actions_ingestRss from "../actions/ingestRss.js";
import type * as actions_marketData from "../actions/marketData.js";
import type * as actions_scrapeJobsReal from "../actions/scrapeJobsReal.js";
import type * as actions_scrapeJobsTenders from "../actions/scrapeJobsTenders.js";
import type * as actions_scrapeTendersReal from "../actions/scrapeTendersReal.js";
import type * as actions_seedDirectory from "../actions/seedDirectory.js";
import type * as actions_seedNamibiaGuide from "../actions/seedNamibiaGuide.js";
import type * as actions_socialQueue from "../actions/socialQueue.js";
import type * as actions_synthesizeStory from "../actions/synthesizeStory.js";
import type * as actions_triggerScrapeJobs from "../actions/triggerScrapeJobs.js";
import type * as actions_uploadPlaceImages from "../actions/uploadPlaceImages.js";
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
  "actions/backfillBodies": typeof actions_backfillBodies;
  "actions/backfillContent": typeof actions_backfillContent;
  "actions/backfillImages": typeof actions_backfillImages;
  "actions/cleanupDatabase": typeof actions_cleanupDatabase;
  "actions/imageGenerator": typeof actions_imageGenerator;
  "actions/imageProcessor": typeof actions_imageProcessor;
  "actions/ingestRss": typeof actions_ingestRss;
  "actions/marketData": typeof actions_marketData;
  "actions/scrapeJobsReal": typeof actions_scrapeJobsReal;
  "actions/scrapeJobsTenders": typeof actions_scrapeJobsTenders;
  "actions/scrapeTendersReal": typeof actions_scrapeTendersReal;
  "actions/seedDirectory": typeof actions_seedDirectory;
  "actions/seedNamibiaGuide": typeof actions_seedNamibiaGuide;
  "actions/socialQueue": typeof actions_socialQueue;
  "actions/synthesizeStory": typeof actions_synthesizeStory;
  "actions/triggerScrapeJobs": typeof actions_triggerScrapeJobs;
  "actions/uploadPlaceImages": typeof actions_uploadPlaceImages;
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
