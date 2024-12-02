/* tslint:disable */
/* eslint-disable */
/**
 * Prism API
 * API for Prism project
 *
 * The version of the OpenAPI document: v1
 * Contact: contact@prism.example.com
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
import type { TokenRefresh } from '../models';
/**
 * AuthApi - axios parameter creator
 * @export
 */
export const AuthApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
         * @param {TokenRefresh} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authTokenRefreshCreate: async (data: TokenRefresh, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'data' is not null or undefined
            assertParamExists('authTokenRefreshCreate', 'data', data)
            const localVarPath = `/auth/token/refresh/`;
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


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(data, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AuthApi - functional programming interface
 * @export
 */
export const AuthApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AuthApiAxiosParamCreator(configuration)
    return {
        /**
         * Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
         * @param {TokenRefresh} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async authTokenRefreshCreate(data: TokenRefresh, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<TokenRefresh>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authTokenRefreshCreate(data, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthApi.authTokenRefreshCreate']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * AuthApi - factory interface
 * @export
 */
export const AuthApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AuthApiFp(configuration)
    return {
        /**
         * Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
         * @param {TokenRefresh} data 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authTokenRefreshCreate(data: TokenRefresh, options?: RawAxiosRequestConfig): AxiosPromise<TokenRefresh> {
            return localVarFp.authTokenRefreshCreate(data, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AuthApi - object-oriented interface
 * @export
 * @class AuthApi
 * @extends {BaseAPI}
 */
export class AuthApi extends BaseAPI {
    /**
     * Takes a refresh type JSON web token and returns an access type JSON web token if the refresh token is valid.
     * @param {TokenRefresh} data 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    public authTokenRefreshCreate(data: TokenRefresh, options?: RawAxiosRequestConfig) {
        return AuthApiFp(this.configuration).authTokenRefreshCreate(data, options).then((request) => request(this.axios, this.basePath));
    }
}

