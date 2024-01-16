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
import { useState, useCallback, useEffect } from 'react';

/**
 * Internal dependencies.
 */
import {
  getNetworkScriptsFromResourceTree,
  getResourcesWithContent,
} from '../../utils';
import { detectMatchingSignatures, sumUpDetectionResults } from '../../core';
import type { LibraryData } from '../../types';

const useLibraryDetection = () => {
  const initialState: LibraryData = {
    gis: {
      signatureMatches: 0,
      matches: [],
    },
    gsiV2: {
      signatureMatches: 0,
      moduleMatch: 0,
      matches: [],
    },
  };

  const [libraryMatches, setLibraryMatches] = useState(initialState);

  const listenerCallback = useCallback(
    async (resource) => {
      const resourcesWithContent = await getResourcesWithContent([resource]);
      const realtimeComputationResult =
        detectMatchingSignatures(resourcesWithContent);

      if (
        realtimeComputationResult.gis.matches.length !== 0 ||
        realtimeComputationResult.gsiV2.matches.length !== 0
      ) {
        const newResult = sumUpDetectionResults(
          libraryMatches,
          realtimeComputationResult
        );

        setLibraryMatches(newResult);
      }
    },
    [libraryMatches]
  );

  useEffect(() => {
    (async () => {
      const scripts = await getNetworkScriptsFromResourceTree();
      const detectMatchingSignaturesv1Results =
        detectMatchingSignatures(scripts);

      setLibraryMatches(detectMatchingSignaturesv1Results);
    })();
  }, []);

  const invokeGSIdetection = useCallback(() => {
    chrome.devtools.inspectedWindow.onResourceAdded.removeListener(
      listenerCallback
    );

    chrome.devtools.inspectedWindow.onResourceAdded.addListener(
      listenerCallback
    );
  }, [listenerCallback]);

  useEffect(() => {
    invokeGSIdetection();
  }, [invokeGSIdetection]);

  return {
    libraryMatches,
  };
};

export default useLibraryDetection;
