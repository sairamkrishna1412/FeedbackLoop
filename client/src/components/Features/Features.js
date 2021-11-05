import React from 'react';

import FeatureCard from '../UI/Card/FeatureCard/FeatureCard';

import styles from './Features.module.css';

function Features() {
  return (
    <div className={styles.featureContainer}>
      <FeatureCard
        cardTitle="Feature 1"
        cardContent="Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci laudantium aliquam, quae corrupti possimus, molestiae, laborum eum quas explicabo quibusdam exercitationem? Id vel facere molestiae."
      ></FeatureCard>
      <FeatureCard
        cardTitle="Feature 2"
        cardContent="Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde maxime aut vitae, sed eos temporibus omnis voluptate molestiae a ad, alias natus at rerum illo."
      ></FeatureCard>
      <FeatureCard
        cardTitle="Feature 3"
        cardContent="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor illo voluptatibus ducimus quo quidem, aliquid saepe iste, et earum itaque magnam a, voluptatum atque eligendi!"
      ></FeatureCard>
    </div>
  );
}

export default Features;
