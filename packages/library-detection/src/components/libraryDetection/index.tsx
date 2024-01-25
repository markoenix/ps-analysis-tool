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
import React, { memo } from 'react';
import {
  CookiesLandingContainer,
  COLOR_MAP,
  ProgressBar,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import LIBRARIES from '../../config';
import type { Config } from '../../types';
import { useLibraryDetection, useLibraryDetectionContext } from '../../core';

// eslint-disable-next-line react/display-name
const LibraryDetection = memo(function LibraryDetection({
  tabId,
}: {
  tabId: number;
}) {
  const { libraryMatches } = useLibraryDetection(tabId);
  const { showLoader } = useLibraryDetectionContext(({ state }) => ({
    showLoader: state.showLoader,
  }));

  const names = Object.keys(libraryMatches);

  const detectedLibraryNames = names.filter(
    (name) => libraryMatches[name]?.matches?.length
  );

  const dataMapping = [
    {
      title: 'Known Breakages',
      count: Number(detectedLibraryNames.length),
      data: [{ count: 1, color: COLOR_MAP.uncategorized.color }],
    },
  ];

  const result =
    detectedLibraryNames.length > 0 ? (
      <>
        {LIBRARIES.map((config: Config) => {
          const Component = config.component as React.FC;
          const matches =
            libraryMatches && libraryMatches[config.name]
              ? libraryMatches[config.name]?.matches
              : [];

          return <Component key={config.name} matches={matches} />;
        })}
      </>
    ) : (
      <p className="text-center dark:text-bright-gray">
        No libraries with known breakages found yet!
      </p>
    );

  return (
    <CookiesLandingContainer
      dataMapping={dataMapping}
      testId="library-detection"
      description=""
    >
      {showLoader ? (
        <>
          <ProgressBar additionalStyles="w-1/3 mx-auto h-full" />
          <p className="text-center dark:text-bright-gray">
            Checking libraries for any known breakages on the page....
          </p>
        </>
      ) : (
        result
      )}
    </CookiesLandingContainer>
  );
});

export default LibraryDetection;
