export interface ApiResponse<T> {
    Code: number;
    Message: string;
    Data: T;
}

export interface Post {
    PostId: number;
    Title: string;
    Url: string;
    ThumbnailImage?: string;
    CoverImage?: string;
    Content: string;
    Tags?: string;
    Categories?: string;
    PostAuthorId: number;
    ViewCount: number;
    PublishedOn: string; // DateTime usually comes as string in JSON
    IsVideoContent: boolean;
    VideoLink?: string;
    RecommendationMetaTags?: string;
    IsPublic: boolean;
    // Files are usually not part of the response DTO for display, but kept here if needed for some reason, 
    // though typically they are for upload. 
    // Excluding IFormFile properties as they are backend specific.

    // Additional properties inferred from usage giving Author or Date might need mapped or exist in backend response not shown in user request?
    // User request only showed DTO.
    // Assuming backend returns what is in DTO.
    RowTotal: number;
}
export interface PostWithSEO{
    PostId: number;
    Title:string;
    Url: string;
    ThumbnailImage: string;
    CoverImage: string;
    Content:string;
    Tags: string;
    Categories: string;
    PostAuthorId: number;
    ViewCount: number;
    PublishedOn: string;
    RowTotal: number;
    ThumbnailImageFile: string;
    CoverImageFile:string;
    IsNew: false,
    OldUrl: null,
    IsVideoContent: false,
    VideoLink: string;
    RecommendationMetaTags: string;
    IsPublic: true,
    SEOId: number;
    MetaTitle: string;
    MetaKeyWords:string;
    MetaDescription: string;
    SeoType: string;
    ImageFile: string;
}
