/* tslint:disable */
/* eslint-disable */
/**
 * Prism API
 * API for Prism project
 *
 * The version of the OpenAPI document: v1
 * Contact: mercysquadrant@gmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, type RequestArgs, BaseAPI, RequiredError, operationServerMap } from '../base';
// @ts-ignore
import type { ArtistsRead404Response } from '../models';
// @ts-ignore
import type { AuthLoginCreate400Response } from '../models';
// @ts-ignore
import type { AuthLogoutCreate200Response } from '../models';
/**
 * LikesApi - axios parameter creator
 * @export
 */
export const LikesApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Allows authenticated users to like a specific content item.
         * @summary Like content.
         * @param {string} contentId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        likesCreate: async (contentId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'contentId' is not null or undefined
            assertParamExists('likesCreate', 'contentId', contentId)
            const localVarPath = `/likes/{content_id}/`
                .replace(`{${"content_id"}}`, encodeURIComponent(String(contentId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Basic required
            // http basic authentication required
            setBasicAuthToObject(localVarRequestOptions, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Allows authenticated users to unlike a specific content item.
         * @summary # Correct indentation here Unlike content.
         * @param {string} contentId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        likesDelete: async (contentId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'contentId' is not null or undefined
            assertParamExists('likesDelete', 'contentId', contentId)
            const localVarPath = `/likes/{content_id}/`
                .replace(`{${"content_id"}}`, encodeURIComponent(String(contentId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Basic required
            // http basic authentication required
            setBasicAuthToObject(localVarRequestOptions, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * LikesApi - functional programming interface
 * @export
 */
export const LikesApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = LikesApiAxiosParamCreator(configuration)
    return {
        /**
         * Allows authenticated users to like a specific content item.
         * @summary Like content.
         * @param {string} contentId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async likesCreate(contentId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AuthLogoutCreate200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.likesCreate(contentId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['LikesApi.likesCreate']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Allows authenticated users to unlike a specific content item.
         * @summary # Correct indentation here Unlike content.
         * @param {string} contentId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async likesDelete(contentId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AuthLogoutCreate200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.likesDelete(contentId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['LikesApi.likesDelete']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * LikesApi - factory interface
 * @export
 */
export const LikesApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = LikesApiFp(configuration)
    return {
        /**
         * Allows authenticated users to like a specific content item.
         * @summary Like content.
         * @param {string} contentId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        likesCreate(contentId: string, options?: RawAxiosRequestConfig): AxiosPromise<AuthLogoutCreate200Response> {
            return localVarFp.likesCreate(contentId, options).then((request) => request(axios, basePath));
        },
        /**
         * Allows authenticated users to unlike a specific content item.
         * @summary # Correct indentation here Unlike content.
         * @param {string} contentId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        likesDelete(contentId: string, options?: RawAxiosRequestConfig): AxiosPromise<AuthLogoutCreate200Response> {
            return localVarFp.likesDelete(contentId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * LikesApi - object-oriented interface
 * @export
 * @class LikesApi
 * @extends {BaseAPI}
 */
export class LikesApi extends BaseAPI {
    /**
     * Allows authenticated users to like a specific content item.
     * @summary Like content.
     * @param {string} contentId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LikesApi
     */
    public likesCreate(contentId: string, options?: RawAxiosRequestConfig) {
        return LikesApiFp(this.configuration).likesCreate(contentId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Allows authenticated users to unlike a specific content item.
     * @summary # Correct indentation here Unlike content.
     * @param {string} contentId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof LikesApi
     */
    public likesDelete(contentId: string, options?: RawAxiosRequestConfig) {
        return LikesApiFp(this.configuration).likesDelete(contentId, options).then((request) => request(this.axios, this.basePath));
    }
}

