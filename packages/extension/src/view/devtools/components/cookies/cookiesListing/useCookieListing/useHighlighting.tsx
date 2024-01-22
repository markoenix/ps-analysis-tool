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
import { useCallback, useEffect } from 'react';
import { getCookieKey, type TabCookies } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */

const useHighlighting = (
  cookies: TabCookies,
  setTableData: React.Dispatch<React.SetStateAction<TabCookies>>,
  domainsInAllowList: Set<string>
) => {
  const handleHighlighting = useCallback(
    (cookiesToProcess: TabCookies, cookiesToReference?: TabCookies) =>
      Object.values(cookiesToProcess).reduce((acc, cookie) => {
        const key = getCookieKey(cookie.parsedCookie) as string;
        acc[key] = {
          ...cookie,
          highlighted: cookiesToReference?.[key]?.highlighted || false,
        };

        return acc;
      }, {} as TabCookies),
    []
  );

  const handleDomainAdditionToAllowedList = useCallback(() => {
    setTableData((prevData) =>
      Object.fromEntries(
        Object.entries(cookies || {}).map(([key, cookie]) => {
          const domain = cookie.parsedCookie?.domain || '';
          let isDomainInAllowList = domainsInAllowList.has(domain);

          if (!isDomainInAllowList) {
            isDomainInAllowList = [...domainsInAllowList].some(
              (storedDomain) => {
                // For example xyz.bbc.com and .bbc.com
                if (
                  (domain.endsWith(storedDomain) && domain !== storedDomain) ||
                  `.${domain}` === storedDomain
                ) {
                  return true;
                }

                return false;
              }
            );
          }

          cookie.highlighted = prevData?.[key]?.highlighted;
          cookie.isDomainInAllowList = isDomainInAllowList;

          return [key, cookie];
        })
      )
    );
  }, [cookies, domainsInAllowList, setTableData]);

  useEffect(() => {
    setTableData((prevData) => handleHighlighting(cookies, prevData));
  }, [cookies, handleHighlighting, setTableData]);

  useEffect(() => {
    handleDomainAdditionToAllowedList();
  }, [handleDomainAdditionToAllowedList]);

  const removeHighlights = useCallback(() => {
    setTableData((prev) => handleHighlighting(prev));
  }, [handleHighlighting, setTableData]);

  useEffect(() => {
    chrome.storage.session.onChanged.addListener(removeHighlights);
    return () => {
      try {
        chrome.storage.session.onChanged.removeListener(removeHighlights);
      } catch (error) {
        /* do nothing */
      }
    };
  }, [removeHighlights]);
};

export default useHighlighting;
