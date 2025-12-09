// Base Props interface matching C# BaseProps
export interface BaseProps {
    IsActive?: boolean;
    IsDeleted?: boolean;
    AddedOn?: string;
    AddedBy?: number;
    ModifiedOn?: string;
    ModifiedBy?: number;
}

// Post interface matching C# Post DTO
export interface Post extends BaseProps {
    PostId?: number;
    Title?: string;
    Url?: string;
    ThumbnailImage?: string;
    CoverImage?: string;
    Content?: string;
    Tags?: string;
    Categories?: string;
    PostAuthorId?: number;
    ViewCount?: number;
    PublishedOn?: string;
    IsVideoContent?: boolean;
    VideoLink?: string;
    RecommendationMetaTags?: string;
    IsPublic?: boolean;
    RowTotal?: number;
}



// Post save request
export interface PostSaveRequest {
    postId?: number;
    title: string;
    url: string;
    thumbnailImage?: string;
    coverImage?: string;
    content: string;
    tags?: string;
    categories?: string;
    publishedOn?: string;
    isVideoContent?: boolean;
    videoLink?: string;
    recommendationMetaTags?: string;
    isPublic?: boolean;
    isActive?: boolean;
}

// PostCategory interface matching C# PostCategory DTO
export interface PostCategory extends BaseProps {
    PostCategoryId?: number;
    Name?: string;
    Url?: string;
    RowTotal?: number;
}

// PostCategory save request
export interface PostCategorySaveRequest {
    postCategoryId?: number;
    name: string;
    url: string;
    isActive?: boolean;
}

// PostSetting interface matching C# PostSetting DTO
export interface PostSetting {
    PostSettingId?: number;
    RecentPostPerPage?: number;
    RecentPostPerRow?: number;
    UseNextPrev?: boolean;
    ShowDescriptionInRecentPost?: boolean;
    ShowDescriptionInLine?: number;
}

// PostSetting save request
export interface PostSettingSaveRequest {
    postSettingId?: number;
    recentPostPerPage: number;
    recentPostPerRow: number;
    useNextPrev: boolean;
    showDescriptionInRecentPost: boolean;
    showDescriptionInLine: number;
}

export interface ApiResponse<T> {
    Code: number;
    Message: string;
    Data: T;
    Errors?: string[];
}

export interface BlogListQuery {
    offset?: number;
    limit?: number;
    query?: string;
    categoryId?: number;
    isPublic?: boolean;
}
