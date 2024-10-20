import React, { useState, useEffect } from 'react';

// Deletable Ad Banner component with random selection and reappearing after 20 seconds
const DeletableAdBanner = () => {
  const ads = [
    { imageUrl: '/src/ads/ad1.jpg', altText: 'Ad 1' },
    { imageUrl: '/src/ads/ad2.jpg', altText: 'Ad 2' },
    { imageUrl: '/src/ads/ad3.jpg', altText: 'Ad 3' },
  ];

  const [currentAdIndex, setCurrentAdIndex] = useState(() => Math.floor(Math.random() * ads.length));
  const [isAdVisible, setIsAdVisible] = useState(true);

  useEffect(() => {
    let adInterval;

    // Function to start rotating the ads
    const startAdRotation = () => {
      adInterval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 60000); // Rotate every 60 seconds
    };

    // Start the rotation if the ad is visible
    if (isAdVisible) {
      startAdRotation();
    }

    return () => clearInterval(adInterval); // Clean up interval on unmount
  }, [ads.length, isAdVisible]);

  const currentAd = ads[currentAdIndex];

  // Function to close the ad and start the timer to show it again after 20 seconds
  const handleCloseAd = () => {
    setIsAdVisible(false);

    // Set timeout to make the ad visible again after 20 seconds
    setTimeout(() => {
      setIsAdVisible(true);
      setCurrentAdIndex(Math.floor(Math.random() * ads.length)); // Choose a random ad when it reappears
    }, 60000); // 60 seconds delay before ad reappears
  };

  return isAdVisible ? (
    <div className="deletable-ad-banner">
      <img src={currentAd.imageUrl} alt={currentAd.altText} />
      <button onClick={handleCloseAd} className="close-button">X</button>
    </div>
  ) : null;
};

export default DeletableAdBanner;
