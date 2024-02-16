export interface IS3OjectsResponse<T> {
    objectSummaries: T[];
    commonPrefixes: string[];
    isTruncated: boolean;
    bucketName: string;
    keyCount: number;
    nextContinuationToken?: string;
    prefix?: string;
    delimiter?: string;
    maxKeys: number;
    encodingType?: string;
    continuationToken?: string;
    startAfter?: string;
}