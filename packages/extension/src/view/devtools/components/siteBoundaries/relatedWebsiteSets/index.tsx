/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies.
 */
import React from 'react';
import { LandingPage, PSInfoKey } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import RWSJsonGenerator from './jsonGenerator';
import Insights from './insights';

const RelatedWebsiteSets = () => {
  return (
    <LandingPage
      title="Related Website Sets"
      psInfoKey={PSInfoKey.RelatedWebsiteSets}
      extraClasses="max-w-2xl h-fit"
    >
      <Insights />
      <RWSJsonGenerator />
    </LandingPage>
  );
};

export default RelatedWebsiteSets;
