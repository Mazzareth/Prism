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



/**
 * 
 * @export
 * @interface User
 */
export interface User {
    /**
     * 
     * @type {number}
     * @memberof User
     */
    'id'?: number;
    /**
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     * @type {string}
     * @memberof User
     */
    'username': string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'email'?: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'password'?: string;
    /**
     * 
     * @type {boolean}
     * @memberof User
     */
    'is_artist'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'access_token'?: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'refresh_token'?: string;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'profile_picture'?: string | null;
}

