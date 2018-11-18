export interface AgGunOptions
{
    peers?: string[];
    s3?: GunS3Options;
    radisk?: boolean;
    localStorage?: boolean;
    file?: string;
    uuid?: () => string;
}

export interface GunS3Options
{
    key: string;
    secret: string;
    bucket: string;
}
