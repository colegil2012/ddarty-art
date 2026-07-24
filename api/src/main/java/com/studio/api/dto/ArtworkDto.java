package com.studio.api.dto;

import java.util.List;

/**
 * What the frontend actually receives. Storage keys are resolved to URLs here
 * so the client never needs to know about buckets or local folders.
 */
public record ArtworkDto(
        String id,
        String title,
        String description,
        String medium,
        String year,
        List<String> tags,
        String imageUrl,
        String thumbUrl,
        Integer width,
        Integer height,
        String lqip,
        boolean featured
) {}
