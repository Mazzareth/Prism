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


// May contain unused imports in some cases
// @ts-ignore
import type { Content } from './content';

/**
 * 
 * @export
 * @interface Artist
 */
export interface Artist {
    /**
     * 
     * @type {number}
     * @memberof Artist
     */
    'id'?: number;
    /**
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     * @type {string}
     * @memberof Artist
     */
    'username': string;
    /**
     * 
     * @type {boolean}
     * @memberof Artist
     */
    'is_artist'?: boolean;
    /**
     * 
     * @type {string}
     * @memberof Artist
     */
    'profile_picture'?: string | null;
    /**
     * 
     * @type {Array<Content>}
     * @memberof Artist
     */
    'content_items'?: Array<Content>;
    /**
     * 
     * @type {string}
     * @memberof Artist
     */
    'followers'?: string;
    /**
     * 
     * @type {string}
     * @memberof Artist
     */
    'following'?: string;
}

