package com.studio.api.repository;

import com.studio.api.model.Artwork;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ArtworkRepository extends MongoRepository<Artwork, String> {

    List<Artwork> findByFeaturedTrue();

    List<Artwork> findByTagsContaining(String tag);

    /**
     * Server-side random sample. $sample is far cheaper than pulling the whole
     * collection and shuffling in the JVM once the gallery grows.
     */
    @Aggregation(pipeline = { "{ $sample: { size: ?0 } }" })
    List<Artwork> findRandom(int size);
}
