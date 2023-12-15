"use client";

import React, { useEffect, useState } from 'react';
import styles from './index.module.css'; // You need to create a CSS module file
import { useDispatch, useSelector } from 'react-redux';
import { author, category, getPersonalizedTags, setPersonalizedTagsClient, source } from '@/store/reducers/feedSlice';

const PersonalizeModal = ({ onClose, onSubmit }) => {
    const dispatch = useDispatch()
    const authors = useSelector(author)
    const categories = useSelector(category)
    const sources = useSelector(source)
    const selectedChips = useSelector(getPersonalizedTags)

    const toggleChip = (chip) => {
        dispatch(setPersonalizedTagsClient(chip))
    };

    const handleSubmission = () => {
        // Separate selected chips into different arrays
        const selectedCategories = selectedChips.filter(chip => categories.includes(chip));
        const selectedSources = selectedChips.filter(chip => sources.includes(chip));
        const selectedAuthors = selectedChips.filter(chip => authors.includes(chip));

        // Call the onSubmit function with the separated selected chips data
        onSubmit({
            categories: selectedCategories.toString(),
            sources: selectedSources.toString(),
            authors: selectedAuthors.toString(),
        });

        // Close the modal
        onClose();
    };

    return (
        <div className={styles.modal}>
            <div className={styles['modal-content']}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <div className={styles['input-group']}>
                    <h3>Make Personal Feed</h3>
                </div>
                <div className={styles['input-group']}>
                    <h3>Select Sources</h3>
                    {sources && sources.filter((val) => val ? true : false).map((source, key) => (
                        <div
                            key={key}
                            className={`${styles.chip} ${selectedChips.includes(source) ? styles['selected-chip'] : ''}`}
                            onClick={() => toggleChip(source)}
                        >
                            {source}
                        </div>
                    ))}
                </div>

                <div className={styles['input-group']}>
                    <h3>Select Categories</h3>
                    {categories && categories.filter((val) => val ? true : false).map((category, key) => (
                        <div
                            key={key}
                            className={`${styles.chip} ${selectedChips.includes(category) ? styles['selected-chip'] : ''}`}
                            onClick={() => toggleChip(category)}
                        >
                            {category}
                        </div>
                    ))}
                </div>

                <div className={styles['input-group']}>
                    <h3>Select Authors</h3>
                    {authors && authors.filter((val) => val ? true : false).map((author, key) => (
                        <div
                            key={key}
                            className={`${styles.chip} ${selectedChips.includes(author) ? styles['selected-chip'] : ''}`}
                            onClick={() => toggleChip(author)}
                        >
                            {author}
                        </div>
                    ))}
                </div>

                <button className={styles.button} onClick={handleSubmission}>Submit</button>
            </div>
        </div>
    );
};

export default PersonalizeModal;