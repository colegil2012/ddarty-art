package com.studio.api.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "artwork")
public class Artwork {

    @Id
    private String id;

    private String title;
    private String description;
    private String medium;
    private String year;
    private List<String> tags;

    /** Storage key for the full-size render. */
    private String imageKey;
    /** Storage key for the grid thumbnail. */
    private String thumbKey;

    private Integer width;
    private Integer height;

    /** Tiny base64 placeholder shown while the real image decodes. */
    private String lqip;

    @Indexed
    private boolean featured;

    private Instant createdAt = Instant.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMedium() { return medium; }
    public void setMedium(String medium) { this.medium = medium; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getImageKey() { return imageKey; }
    public void setImageKey(String imageKey) { this.imageKey = imageKey; }

    public String getThumbKey() { return thumbKey; }
    public void setThumbKey(String thumbKey) { this.thumbKey = thumbKey; }

    public Integer getWidth() { return width; }
    public void setWidth(Integer width) { this.width = width; }

    public Integer getHeight() { return height; }
    public void setHeight(Integer height) { this.height = height; }

    public String getLqip() { return lqip; }
    public void setLqip(String lqip) { this.lqip = lqip; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
